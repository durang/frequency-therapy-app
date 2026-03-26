// AI-Powered Personal Frequency Profiling System
// Revolutionary personalization based on circadian rhythms, biometrics, and usage patterns

export interface BiometricData {
  heartRateVariability?: number[]
  restingHeartRate?: number
  sleepQuality?: number // 1-10 scale
  stressLevel?: number // 1-10 scale
  energyLevel?: number // 1-10 scale
  mood?: 'anxious' | 'calm' | 'focused' | 'tired' | 'energetic' | 'stressed'
  location?: {
    timezone: string
    lat?: number
    lng?: number
  }
}

export interface UsagePattern {
  preferredTimes: string[] // ISO time strings
  sessionDurations: number[] // minutes
  effectiveFrequencies: string[] // frequency IDs that work well
  skipRates: { [frequencyId: string]: number } // 0-1 ratio
  completionRates: { [frequencyId: string]: number } // 0-1 ratio
  userFeedback: { [frequencyId: string]: number } // 1-5 rating
}

export interface PersonalityProfile {
  introversion: number // 0-1 scale
  neuroticism: number // 0-1 scale
  openness: number // 0-1 scale
  conscientiousness: number // 0-1 scale
  agreeableness: number // 0-1 scale
  chronotype: 'morning' | 'evening' | 'intermediate'
  stressResponse: 'fast' | 'moderate' | 'slow'
  focusType: 'sustained' | 'burst' | 'variable'
}

export interface UserProfile {
  id: string
  createdAt: Date
  biometrics: BiometricData
  usage: UsagePattern
  personality: PersonalityProfile
  goals: Array<{
    type: 'sleep' | 'focus' | 'stress_relief' | 'energy' | 'meditation' | 'healing'
    priority: 1 | 2 | 3
    targetMetric?: number
  }>
  preferences: {
    sessionLength: number // minutes
    preferredWaveforms: string[]
    enableBinauralBeats: boolean
    enableSpatialAudio: boolean
    backgroundSounds: string[]
  }
}

export class AIFrequencyProfiler {
  private profile: UserProfile
  private learningRate: number = 0.1
  private adaptationThreshold: number = 0.7

  // Machine Learning Models (simplified for demo - in production would use TensorFlow.js)
  private circadianModel: Map<string, number> = new Map()
  private effectivenessModel: Map<string, number> = new Map()
  private personalityModel: Map<string, number> = new Map()

  constructor(profile: UserProfile) {
    this.profile = profile
    this.initializeModels()
  }

  private initializeModels() {
    // Initialize circadian rhythm patterns
    const baseCircadianPatterns = {
      'morning': { '06:00': 0.9, '08:00': 0.8, '10:00': 0.7, '12:00': 0.6 },
      'evening': { '18:00': 0.8, '20:00': 0.9, '22:00': 0.7, '00:00': 0.6 },
      'intermediate': { '09:00': 0.8, '14:00': 0.6, '19:00': 0.8, '21:00': 0.7 }
    }

    const chronotype = this.profile.personality.chronotype
    const patterns = baseCircadianPatterns[chronotype]
    
    for (const [time, effectiveness] of Object.entries(patterns)) {
      this.circadianModel.set(time, effectiveness)
    }
  }

  // Main AI recommendation engine
  generatePersonalizedRecommendations(context: {
    currentTime: Date
    goal: string
    sessionDuration?: number
    biometrics?: BiometricData
  }): Array<{
    frequencyId: string
    confidence: number
    reasoning: string[]
    customConfig: any
  }> {
    const recommendations: Array<{
      frequencyId: string
      confidence: number
      reasoning: string[]
      customConfig: any
    }> = []

    // Analyze current context
    const circadianScore = this.calculateCircadianOptimization(context.currentTime)
    const biometricScore = this.analyzeBiometricCompatibility(context.biometrics)
    const usageScore = this.analyzeUsagePatterns(context.goal)
    const personalityScore = this.analyzePersonalityFit(context.goal)

    // Get frequency candidates based on goal
    const candidates = this.getFrequencyCandidates(context.goal)

    for (const candidate of candidates) {
      const confidence = this.calculateConfidenceScore({
        candidate,
        circadianScore,
        biometricScore,
        usageScore,
        personalityScore,
        context
      })

      if (confidence > this.adaptationThreshold) {
        const customConfig = this.generateCustomConfiguration(candidate, context)
        const reasoning = this.generateReasoningExplanation(candidate, context, {
          circadianScore,
          biometricScore,
          usageScore,
          personalityScore
        })

        recommendations.push({
          frequencyId: candidate.id,
          confidence,
          reasoning,
          customConfig
        })
      }
    }

    // Sort by confidence and return top recommendations
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)
  }

  private calculateCircadianOptimization(currentTime: Date): number {
    const hour = currentTime.getHours()
    const timeKey = `${hour.toString().padStart(2, '0')}:00`
    
    // Base circadian score
    let score = this.circadianModel.get(timeKey) || 0.5

    // Adjust for chronotype
    const chronotype = this.profile.personality.chronotype
    if (chronotype === 'morning' && hour < 12) score += 0.2
    if (chronotype === 'evening' && hour > 16) score += 0.2
    if (chronotype === 'intermediate' && hour >= 9 && hour <= 21) score += 0.1

    // Adjust for timezone if available
    if (this.profile.biometrics.location?.timezone) {
      const localHour = this.adjustForTimezone(currentTime, this.profile.biometrics.location.timezone)
      // Add timezone-adjusted scoring logic here
    }

    return Math.min(score, 1)
  }

  private analyzeBiometricCompatibility(biometrics?: BiometricData): number {
    if (!biometrics) return 0.5

    let score = 0.5

    // Heart Rate Variability analysis
    if (biometrics.heartRateVariability) {
      const avgHRV = biometrics.heartRateVariability.reduce((a, b) => a + b, 0) / biometrics.heartRateVariability.length
      if (avgHRV > 40) score += 0.2 // Good HRV indicates readiness for frequency therapy
      else if (avgHRV < 20) score += 0.3 // Low HRV suggests need for stress relief frequencies
    }

    // Stress level impact
    if (biometrics.stressLevel) {
      if (biometrics.stressLevel > 7) score += 0.3 // High stress = prioritize calming frequencies
      else if (biometrics.stressLevel < 4) score += 0.2 // Low stress = can handle stimulating frequencies
    }

    // Sleep quality impact
    if (biometrics.sleepQuality) {
      if (biometrics.sleepQuality < 5) score += 0.2 // Poor sleep = prioritize sleep/recovery frequencies
    }

    // Energy level considerations
    if (biometrics.energyLevel) {
      if (biometrics.energyLevel < 4) score += 0.1 // Low energy = avoid sedating frequencies during day
    }

    return Math.min(score, 1)
  }

  private analyzeUsagePatterns(goal: string): number {
    const usage = this.profile.usage
    let score = 0.5

    // Check historical effectiveness for this goal
    const goalRelatedFreqs = usage.effectiveFrequencies.filter(id => 
      this.isFrequencyRelatedToGoal(id, goal)
    )

    if (goalRelatedFreqs.length > 0) {
      score += 0.3 // User has successful history with goal-related frequencies
    }

    // Completion rates indicate engagement
    const avgCompletion = Object.values(usage.completionRates).reduce((a, b) => a + b, 0) / Object.keys(usage.completionRates).length || 0.5
    score += avgCompletion * 0.2

    // User feedback incorporation
    const avgFeedback = Object.values(usage.userFeedback).reduce((a, b) => a + b, 0) / Object.keys(usage.userFeedback).length || 3
    score += (avgFeedback - 3) * 0.1 // Scale feedback from 1-5 to impact

    return Math.min(score, 1)
  }

  private analyzePersonalityFit(goal: string): number {
    const personality = this.profile.personality
    let score = 0.5

    // Introversion impact on frequency selection
    if (personality.introversion > 0.6 && ['meditation', 'stress_relief'].includes(goal)) {
      score += 0.2 // Introverts respond well to introspective frequencies
    }

    // Neuroticism and stress response
    if (personality.neuroticism > 0.6 && goal === 'stress_relief') {
      score += 0.3 // High neuroticism benefits greatly from stress relief frequencies
    }

    // Conscientiousness and focus
    if (personality.conscientiousness > 0.6 && goal === 'focus') {
      score += 0.2 // Conscientious people typically respond well to focus frequencies
    }

    // Openness to new experiences
    if (personality.openness > 0.7) {
      score += 0.1 // Open people are more likely to benefit from any frequency therapy
    }

    return Math.min(score, 1)
  }

  private getFrequencyCandidates(goal: string): Array<{ id: string; category: string; hz_value: number }> {
    // This would normally fetch from your frequency database
    const goalToFrequencies = {
      sleep: [
        { id: '2', category: 'deep_sleep', hz_value: 7.83 },
        { id: '8', category: 'delta_waves', hz_value: 2 },
        { id: '15', category: 'deep_sleep', hz_value: 1.5 }
      ],
      focus: [
        { id: '5', category: 'focus', hz_value: 40 },
        { id: '12', category: 'cognitive', hz_value: 10 },
        { id: '18', category: 'focus', hz_value: 14 }
      ],
      stress_relief: [
        { id: '1', category: 'dna_repair', hz_value: 528 },
        { id: '3', category: 'healing', hz_value: 432 },
        { id: '9', category: 'heart_coherence', hz_value: 0.1 }
      ],
      energy: [
        { id: '6', category: 'energy', hz_value: 80 },
        { id: '13', category: 'gamma_waves', hz_value: 55 },
        { id: '19', category: 'energy', hz_value: 70 }
      ],
      meditation: [
        { id: '4', category: 'meditation', hz_value: 7.83 },
        { id: '10', category: 'theta_waves', hz_value: 6 },
        { id: '16', category: 'meditation', hz_value: 8.5 }
      ],
      healing: [
        { id: '1', category: 'dna_repair', hz_value: 528 },
        { id: '7', category: 'cellular_regeneration', hz_value: 285 },
        { id: '14', category: 'healing', hz_value: 174 }
      ]
    }

    return goalToFrequencies[goal as keyof typeof goalToFrequencies] || []
  }

  private calculateConfidenceScore(params: {
    candidate: any
    circadianScore: number
    biometricScore: number
    usageScore: number
    personalityScore: number
    context: any
  }): number {
    const weights = {
      circadian: 0.25,
      biometric: 0.30,
      usage: 0.25,
      personality: 0.20
    }

    return (
      params.circadianScore * weights.circadian +
      params.biometricScore * weights.biometric +
      params.usageScore * weights.usage +
      params.personalityScore * weights.personality
    )
  }

  private generateCustomConfiguration(candidate: any, context: any): any {
    const config = {
      frequency: candidate.hz_value,
      volume: 0.7,
      waveform: 'sine' as const,
      duration: context.sessionDuration || this.profile.preferences.sessionLength,
      binauralBeat: {
        enabled: this.profile.preferences.enableBinauralBeats,
        beatFrequency: this.calculateOptimalBinauralBeat(candidate, context),
        carrierLeft: candidate.hz_value,
        carrierRight: candidate.hz_value + this.calculateOptimalBinauralBeat(candidate, context)
      },
      neuralPhaseLocking: {
        enabled: true,
        targetBrainwave: this.determineTargetBrainwave(context.goal),
        harmonics: this.generateHarmonics(candidate.hz_value)
      },
      adaptiveModulation: {
        enabled: true,
        heartRateSync: !!context.biometrics?.restingHeartRate,
        breathingSync: true,
        circadianSync: true
      },
      spatialAudio: {
        enabled: this.profile.preferences.enableSpatialAudio,
        position: { x: 0, y: 0, z: 0 },
        movement: this.determineOptimalMovement(context.goal)
      }
    }

    return config
  }

  private calculateOptimalBinauralBeat(candidate: any, context: any): number {
    const goal = context.goal
    const goalToBeat = {
      sleep: 3, // Delta waves for deep sleep
      focus: 15, // Beta waves for focus
      stress_relief: 8, // Alpha waves for relaxation
      energy: 25, // High beta for alertness
      meditation: 6, // Theta for deep meditation
      healing: 10 // Alpha-theta bridge
    }

    return goalToBeat[goal as keyof typeof goalToBeat] || 10
  }

  private determineTargetBrainwave(goal: string): 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' {
    const goalToBrainwave = {
      sleep: 'delta' as const,
      meditation: 'theta' as const,
      stress_relief: 'alpha' as const,
      focus: 'beta' as const,
      energy: 'gamma' as const,
      healing: 'alpha' as const
    }

    return goalToBrainwave[goal as keyof typeof goalToBrainwave] || 'alpha'
  }

  private generateHarmonics(baseFreq: number): number[] {
    return [
      baseFreq * 2,     // Octave
      baseFreq * 3,     // Perfect fifth
      baseFreq * 4,     // Double octave
      baseFreq * 1.618  // Golden ratio harmonic
    ]
  }

  private determineOptimalMovement(goal: string): 'static' | 'circular' | 'pendulum' | 'spiral' {
    const goalToMovement = {
      sleep: 'pendulum' as const,     // Soothing back and forth
      focus: 'static' as const,       // No distraction
      stress_relief: 'circular' as const, // Gentle circular motion
      energy: 'spiral' as const,     // Energizing spiral
      meditation: 'pendulum' as const,   // Rhythmic movement
      healing: 'circular' as const   // Encompassing circular energy
    }

    return goalToMovement[goal as keyof typeof goalToMovement] || 'static'
  }

  private generateReasoningExplanation(candidate: any, context: any, scores: any): string[] {
    const reasons: string[] = []

    if (scores.circadianScore > 0.7) {
      reasons.push(`Optimal timing based on your ${this.profile.personality.chronotype} chronotype`)
    }

    if (scores.biometricScore > 0.7) {
      reasons.push('Matches your current biometric indicators')
    }

    if (scores.usageScore > 0.7) {
      reasons.push('Based on your successful sessions with similar frequencies')
    }

    if (scores.personalityScore > 0.7) {
      reasons.push('Aligned with your personality profile and preferences')
    }

    if (context.biometrics?.stressLevel > 7) {
      reasons.push('Specifically chosen to address current stress levels')
    }

    return reasons
  }

  // Utility methods
  private adjustForTimezone(date: Date, timezone: string): number {
    // Simplified timezone adjustment - in production use proper library
    return date.getHours()
  }

  private isFrequencyRelatedToGoal(frequencyId: string, goal: string): boolean {
    // Simplified relationship check - in production use proper mapping
    return true
  }

  // Learning and adaptation methods
  recordSessionResult(frequencyId: string, result: {
    completed: boolean
    userRating: number
    biometricImprovement?: number
    goalAchievement?: number
  }) {
    // Update effectiveness model
    const currentEffectiveness = this.effectivenessModel.get(frequencyId) || 0.5
    const newEffectiveness = currentEffectiveness + (this.learningRate * (result.userRating / 5 - currentEffectiveness))
    this.effectivenessModel.set(frequencyId, newEffectiveness)

    // Update usage patterns
    if (!this.profile.usage.completionRates[frequencyId]) {
      this.profile.usage.completionRates[frequencyId] = 0
    }
    this.profile.usage.completionRates[frequencyId] = 
      (this.profile.usage.completionRates[frequencyId] + (result.completed ? 1 : 0)) / 2

    this.profile.usage.userFeedback[frequencyId] = 
      (this.profile.usage.userFeedback[frequencyId] || 3 + result.userRating) / 2

    // Store effective frequencies
    if (result.userRating >= 4 && result.completed) {
      if (!this.profile.usage.effectiveFrequencies.includes(frequencyId)) {
        this.profile.usage.effectiveFrequencies.push(frequencyId)
      }
    }
  }

  updateBiometrics(biometrics: Partial<BiometricData>) {
    this.profile.biometrics = { ...this.profile.biometrics, ...biometrics }
  }

  // Export profile for persistence
  exportProfile(): UserProfile {
    return JSON.parse(JSON.stringify(this.profile))
  }

  // AI insights for user
  generateInsights(): Array<{
    type: 'trend' | 'recommendation' | 'achievement' | 'pattern'
    title: string
    description: string
    confidence: number
    actionable: boolean
  }> {
    const insights = []

    // Usage pattern insights
    const avgCompletion = Object.values(this.profile.usage.completionRates).reduce((a, b) => a + b, 0) / Object.keys(this.profile.usage.completionRates).length
    if (avgCompletion > 0.8) {
      insights.push({
        type: 'achievement' as const,
        title: 'Excellent Consistency',
        description: 'You\'re completing 80%+ of your frequency therapy sessions. This consistency is key to neuroplasticity benefits.',
        confidence: 0.95,
        actionable: false
      })
    }

    // Circadian optimization
    const morningUsage = this.profile.usage.preferredTimes.filter(t => parseInt(t.split(':')[0]) < 12).length
    const totalUsage = this.profile.usage.preferredTimes.length
    if (morningUsage / totalUsage > 0.7 && this.profile.personality.chronotype !== 'morning') {
      insights.push({
        type: 'recommendation' as const,
        title: 'Circadian Misalignment Detected',
        description: 'Your usage pattern suggests morning preference, but your chronotype is evening. Try sessions between 6-8 PM for better results.',
        confidence: 0.8,
        actionable: true
      })
    }

    return insights
  }
}

export default AIFrequencyProfiler