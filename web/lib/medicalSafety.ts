import { z } from 'zod'

// Safe frequency ranges based on medical research
export const FREQUENCY_SAFETY_RANGES = {
  SAFE: { min: 0.1, max: 1000 }, // General safe range
  THERAPEUTIC: { min: 0.5, max: 100 }, // Most therapeutic frequencies
  DANGEROUS: [
    { min: 1000, max: 20000, reason: "Ultrasonic frequencies may cause tissue damage" },
    { min: 0, max: 0.1, reason: "Extremely low frequencies may affect cardiac rhythm" }
  ],
  SEIZURE_RISK: [
    { min: 15, max: 25, reason: "Beta frequency range - seizure risk for epileptic individuals" },
    { min: 1, max: 20, reason: "Low frequency flashing - photosensitive epilepsy risk" }
  ]
} as const

// Frequency validation schema
export const frequencySchema = z.object({
  hz_value: z.number()
    .min(0.1, "Frequency must be at least 0.1 Hz")
    .max(1000, "Frequency must not exceed 1000 Hz")
    .refine(
      (hz) => {
        // Check dangerous ranges
        const dangerous = FREQUENCY_SAFETY_RANGES.DANGEROUS.some(
          range => hz >= range.min && hz <= range.max
        )
        return !dangerous
      },
      "Frequency is outside safe therapeutic range"
    ),
  duration_minutes: z.number()
    .min(1, "Duration must be at least 1 minute")
    .max(120, "Duration must not exceed 120 minutes for safety"),
  tier: z.enum(['free', 'basic', 'pro', 'clinical']),
  volume: z.number()
    .min(0, "Volume cannot be negative")
    .max(0.7, "Volume limited to 70% for hearing protection")
    .optional()
    .default(0.3)
})

export type SafeFrequencyInput = z.infer<typeof frequencySchema>

// User health screening for contraindications
export const userHealthSchema = z.object({
  hasEpilepsy: z.boolean(),
  hasPacemaker: z.boolean(),
  isPregnant: z.boolean(),
  hasCardiacConditions: z.boolean(),
  hasPsychiatricConditions: z.boolean(),
  hasRecentBrainInjury: z.boolean(),
  isOnMedication: z.boolean(),
  medicationDetails: z.string().optional(),
  age: z.number().min(18, "Users must be 18 or older"),
  hasPhysicianApproval: z.boolean().optional()
})

export type UserHealthProfile = z.infer<typeof userHealthSchema>

// Frequency safety validator
export class FrequencySafetyValidator {
  static validateFrequency(input: unknown): { 
    isValid: boolean; 
    frequency?: SafeFrequencyInput; 
    errors?: string[] 
  } {
    try {
      const frequency = frequencySchema.parse(input)
      return { isValid: true, frequency }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          isValid: false, 
          errors: error.errors.map(e => e.message) 
        }
      }
      return { 
        isValid: false, 
        errors: ['Unknown validation error'] 
      }
    }
  }

  static checkContraindications(
    frequency: SafeFrequencyInput, 
    healthProfile: UserHealthProfile
  ): { 
    isContraindicated: boolean; 
    warnings: string[];
    requiresSupervision: boolean;
  } {
    const warnings: string[] = []
    let isContraindicated = false
    let requiresSupervision = false

    // Absolute contraindications
    if (healthProfile.hasEpilepsy) {
      const seizureRisk = FREQUENCY_SAFETY_RANGES.SEIZURE_RISK.some(
        range => frequency.hz_value >= range.min && frequency.hz_value <= range.max
      )
      if (seizureRisk) {
        isContraindicated = true
        warnings.push("This frequency may trigger seizures in individuals with epilepsy")
      }
    }

    if (healthProfile.hasPacemaker) {
      if (frequency.hz_value < 1) {
        isContraindicated = true
        warnings.push("Low frequencies may interfere with pacemaker function")
      }
    }

    if (healthProfile.isPregnant && frequency.tier !== 'free') {
      isContraindicated = true
      warnings.push("Advanced frequencies not recommended during pregnancy")
    }

    // Conditions requiring medical supervision
    if (healthProfile.hasCardiacConditions && frequency.hz_value < 5) {
      requiresSupervision = true
      warnings.push("Low frequencies may affect heart rhythm - medical supervision recommended")
    }

    if (healthProfile.hasPsychiatricConditions && frequency.tier === 'clinical') {
      requiresSupervision = true
      warnings.push("Clinical frequencies require psychiatric supervision")
    }

    if (healthProfile.hasRecentBrainInjury && frequency.hz_value > 40) {
      requiresSupervision = true
      warnings.push("High frequencies not recommended after recent brain injury without medical clearance")
    }

    // Age-based restrictions
    if (healthProfile.age < 25 && frequency.tier === 'clinical') {
      requiresSupervision = true
      warnings.push("Clinical frequencies require additional caution in younger adults")
    }

    return { isContraindicated, warnings, requiresSupervision }
  }

  static getSafetyRecommendations(frequency: SafeFrequencyInput): string[] {
    const recommendations: string[] = []

    // Duration recommendations
    if (frequency.duration_minutes > 60) {
      recommendations.push("Consider taking 10-minute breaks every hour for extended sessions")
    }

    // Frequency-specific recommendations
    if (frequency.hz_value < 1) {
      recommendations.push("Use in a comfortable seated or lying position")
      recommendations.push("Monitor for any changes in heart rhythm")
    }

    if (frequency.hz_value > 40) {
      recommendations.push("Avoid use within 4 hours of bedtime")
      recommendations.push("Stay hydrated during and after session")
    }

    if (frequency.tier === 'clinical') {
      recommendations.push("Use only under qualified medical supervision")
      recommendations.push("Monitor vitals before and after session")
    }

    // General safety
    recommendations.push("Use quality headphones at comfortable volume")
    recommendations.push("Discontinue if you experience any adverse reactions")
    recommendations.push("Do not use while driving or operating machinery")

    return recommendations
  }

  static sanitizeUserInput(input: any): any {
    // Remove potentially dangerous properties
    const sanitized = { ...input }
    
    // Remove any script injection attempts
    if (typeof sanitized.name === 'string') {
      sanitized.name = sanitized.name.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    }
    
    if (typeof sanitized.description === 'string') {
      sanitized.description = sanitized.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    }

    // Ensure numeric values are actually numbers
    if (sanitized.hz_value !== undefined) {
      sanitized.hz_value = Number(sanitized.hz_value)
    }
    
    if (sanitized.duration_minutes !== undefined) {
      sanitized.duration_minutes = Number(sanitized.duration_minutes)
    }

    if (sanitized.volume !== undefined) {
      sanitized.volume = Math.max(0, Math.min(0.7, Number(sanitized.volume)))
    }

    return sanitized
  }
}

// Rate limiting for therapeutic sessions
export class TherapyRateLimiter {
  private static sessions = new Map<string, { count: number; lastReset: number }>()
  
  static checkRateLimit(userId: string, tier: string): { 
    allowed: boolean; 
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now()
    const limits = {
      free: { maxSessions: 3, windowMs: 24 * 60 * 60 * 1000 }, // 3 per day
      basic: { maxSessions: 10, windowMs: 24 * 60 * 60 * 1000 }, // 10 per day  
      pro: { maxSessions: 25, windowMs: 24 * 60 * 60 * 1000 }, // 25 per day
      clinical: { maxSessions: 50, windowMs: 24 * 60 * 60 * 1000 } // 50 per day
    }

    const limit = limits[tier as keyof typeof limits] || limits.free
    const userSessions = this.sessions.get(userId)

    if (!userSessions || now - userSessions.lastReset > limit.windowMs) {
      // Reset window
      this.sessions.set(userId, { count: 1, lastReset: now })
      return { 
        allowed: true, 
        remaining: limit.maxSessions - 1,
        resetTime: now + limit.windowMs
      }
    }

    if (userSessions.count >= limit.maxSessions) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: userSessions.lastReset + limit.windowMs
      }
    }

    // Increment count
    userSessions.count++
    return { 
      allowed: true, 
      remaining: limit.maxSessions - userSessions.count,
      resetTime: userSessions.lastReset + limit.windowMs
    }
  }
}

// Medical emergency detection
export class MedicalEmergencyDetector {
  static checkForEmergencySigns(
    sessionData: {
      heartRate?: number;
      bloodPressure?: { systolic: number; diastolic: number };
      reportedSymptoms?: string[];
    }
  ): { 
    isEmergency: boolean; 
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = []
    const recommendations: string[] = []
    let isEmergency = false

    // Heart rate monitoring
    if (sessionData.heartRate) {
      if (sessionData.heartRate > 150 || sessionData.heartRate < 40) {
        isEmergency = true
        warnings.push("Abnormal heart rate detected")
        recommendations.push("Stop session immediately and seek medical attention")
      }
    }

    // Blood pressure monitoring
    if (sessionData.bloodPressure) {
      const { systolic, diastolic } = sessionData.bloodPressure
      if (systolic > 180 || diastolic > 120) {
        isEmergency = true
        warnings.push("Dangerous blood pressure levels")
        recommendations.push("Stop session and contact emergency services if symptoms persist")
      }
    }

    // Symptom analysis
    const emergencySymptoms = [
      'chest pain', 'difficulty breathing', 'severe headache', 
      'confusion', 'seizure', 'loss of consciousness'
    ]
    
    if (sessionData.reportedSymptoms) {
      const hasEmergencySymptom = sessionData.reportedSymptoms.some(symptom =>
        emergencySymptoms.some(emergency => 
          symptom.toLowerCase().includes(emergency)
        )
      )
      
      if (hasEmergencySymptom) {
        isEmergency = true
        warnings.push("Emergency symptoms reported")
        recommendations.push("Discontinue therapy immediately and seek emergency medical care")
      }
    }

    return { isEmergency, warnings, recommendations }
  }
}