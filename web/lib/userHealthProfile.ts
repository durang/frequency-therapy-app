import { UserHealthProfile } from './medicalSafety'

// Default health profile for demonstration
const DEFAULT_HEALTH_PROFILE: UserHealthProfile = {
  hasEpilepsy: false,
  hasPacemaker: false,
  isPregnant: false,
  hasCardiacConditions: false,
  hasPsychiatricConditions: false,
  hasRecentBrainInjury: false,
  isOnMedication: false,
  medicationDetails: '',
  age: 25,
  hasPhysicianApproval: false
}

// User health profile management
export class UserHealthProfileManager {
  private static readonly STORAGE_KEY = 'user_health_profile'
  private static readonly PROFILE_VERSION = '1.0'
  
  static getProfile(): UserHealthProfile {
    if (typeof window === 'undefined') {
      return DEFAULT_HEALTH_PROFILE
    }
    
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validate stored profile has all required fields
        if (this.validateProfile(parsed)) {
          return { ...DEFAULT_HEALTH_PROFILE, ...parsed }
        }
      }
    } catch (error) {
      console.error('[Health Profile] Error loading profile:', error)
    }
    
    return DEFAULT_HEALTH_PROFILE
  }
  
  static saveProfile(profile: UserHealthProfile): void {
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      const profileWithVersion = {
        ...profile,
        _version: this.PROFILE_VERSION,
        _lastUpdated: new Date().toISOString()
      }
      
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(profileWithVersion))
      
      console.log('[Health Profile] Profile saved successfully')
    } catch (error) {
      console.error('[Health Profile] Error saving profile:', error)
    }
  }
  
  static clearProfile(): void {
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      sessionStorage.removeItem(this.STORAGE_KEY)
      console.log('[Health Profile] Profile cleared')
    } catch (error) {
      console.error('[Health Profile] Error clearing profile:', error)
    }
  }
  
  private static validateProfile(profile: any): boolean {
    if (!profile || typeof profile !== 'object') {
      return false
    }
    
    const requiredBooleanFields = [
      'hasEpilepsy',
      'hasPacemaker', 
      'isPregnant',
      'hasCardiacConditions',
      'hasPsychiatricConditions',
      'hasRecentBrainInjury',
      'isOnMedication'
    ]
    
    for (const field of requiredBooleanFields) {
      if (typeof profile[field] !== 'boolean') {
        return false
      }
    }
    
    if (typeof profile.age !== 'number' || profile.age < 18 || profile.age > 120) {
      return false
    }
    
    return true
  }
  
  static hasHighRiskConditions(profile?: UserHealthProfile): boolean {
    const currentProfile = profile || this.getProfile()
    
    return (
      currentProfile.hasEpilepsy ||
      currentProfile.hasPacemaker ||
      currentProfile.isPregnant ||
      currentProfile.hasCardiacConditions ||
      currentProfile.hasPsychiatricConditions ||
      currentProfile.hasRecentBrainInjury
    )
  }
  
  static getProfileSummary(profile?: UserHealthProfile): {
    riskLevel: 'low' | 'medium' | 'high'
    conditions: string[]
    recommendations: string[]
  } {
    const currentProfile = profile || this.getProfile()
    const conditions: string[] = []
    const recommendations: string[] = []
    
    // Check for high-risk conditions
    if (currentProfile.hasEpilepsy) {
      conditions.push('Epilepsy/Seizure disorder')
      recommendations.push('Avoid beta frequencies (15-25 Hz)')
    }
    
    if (currentProfile.hasPacemaker) {
      conditions.push('Cardiac pacemaker')
      recommendations.push('Avoid ultra-low frequencies (<1 Hz)')
    }
    
    if (currentProfile.isPregnant) {
      conditions.push('Pregnancy')
      recommendations.push('Use only free-tier frequencies')
    }
    
    if (currentProfile.hasCardiacConditions) {
      conditions.push('Cardiac conditions')
      recommendations.push('Medical supervision recommended for low frequencies')
    }
    
    if (currentProfile.hasPsychiatricConditions) {
      conditions.push('Psychiatric conditions')
      recommendations.push('Supervision required for clinical frequencies')
    }
    
    if (currentProfile.hasRecentBrainInjury) {
      conditions.push('Recent brain injury')
      recommendations.push('Medical clearance required for high frequencies')
    }
    
    if (currentProfile.isOnMedication) {
      conditions.push('Current medication use')
      recommendations.push('Consult healthcare provider about interactions')
    }
    
    // Age-based considerations
    if (currentProfile.age < 25) {
      recommendations.push('Additional caution recommended for clinical frequencies')
    }
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    
    if (currentProfile.hasEpilepsy || currentProfile.hasPacemaker || currentProfile.isPregnant) {
      riskLevel = 'high'
    } else if (conditions.length > 0) {
      riskLevel = 'medium'
    }
    
    return { riskLevel, conditions, recommendations }
  }
  
  static requiresMedicalSupervision(frequencyTier: string, profile?: UserHealthProfile): boolean {
    const currentProfile = profile || this.getProfile()
    const summary = this.getProfileSummary(currentProfile)
    
    // Clinical tier always requires supervision
    if (frequencyTier === 'clinical') {
      return true
    }
    
    // Pro tier requires supervision for high-risk patients
    if (frequencyTier === 'pro' && summary.riskLevel === 'high') {
      return true
    }
    
    // Specific conditions that require supervision
    if (currentProfile.hasPsychiatricConditions && (frequencyTier === 'pro' || frequencyTier === 'clinical')) {
      return true
    }
    
    if (currentProfile.hasRecentBrainInjury && frequencyTier !== 'free') {
      return true
    }
    
    return false
  }
}

// Health questionnaire for new users
export const HEALTH_QUESTIONNAIRE = [
  {
    id: 'hasEpilepsy',
    question: 'Do you have epilepsy, seizure disorder, or history of seizures?',
    type: 'boolean' as const,
    critical: true,
    helpText: 'This is important for frequency safety screening'
  },
  {
    id: 'hasPacemaker',
    question: 'Do you have a cardiac pacemaker or other implanted electronic device?',
    type: 'boolean' as const,
    critical: true,
    helpText: 'Low frequencies may interfere with pacemaker function'
  },
  {
    id: 'isPregnant',
    question: 'Are you currently pregnant?',
    type: 'boolean' as const,
    critical: true,
    helpText: 'Certain frequencies have pregnancy considerations'
  },
  {
    id: 'hasCardiacConditions',
    question: 'Do you have any heart conditions or cardiovascular disease?',
    type: 'boolean' as const,
    critical: false,
    helpText: 'Includes high blood pressure, arrhythmias, heart disease'
  },
  {
    id: 'hasPsychiatricConditions',
    question: 'Do you have any psychiatric or mental health conditions?',
    type: 'boolean' as const,
    critical: false,
    helpText: 'Includes depression, anxiety, bipolar disorder, etc.'
  },
  {
    id: 'hasRecentBrainInjury',
    question: 'Have you had a brain injury, concussion, or neurosurgery in the past year?',
    type: 'boolean' as const,
    critical: false,
    helpText: 'Recent brain trauma may affect frequency sensitivity'
  },
  {
    id: 'isOnMedication',
    question: 'Are you currently taking any medications?',
    type: 'boolean' as const,
    critical: false,
    helpText: 'Some medications may interact with frequency therapy'
  },
  {
    id: 'medicationDetails',
    question: 'If yes, please list your current medications:',
    type: 'text' as const,
    critical: false,
    helpText: 'Optional: helps identify potential interactions',
    dependsOn: 'isOnMedication'
  },
  {
    id: 'age',
    question: 'What is your age?',
    type: 'number' as const,
    critical: true,
    helpText: 'Must be 18 or older to use frequency therapy',
    min: 18,
    max: 120
  },
  {
    id: 'hasPhysicianApproval',
    question: 'Has a healthcare provider approved your use of frequency therapy?',
    type: 'boolean' as const,
    critical: false,
    helpText: 'Recommended for users with medical conditions'
  }
] as const

export type HealthQuestionnaireField = typeof HEALTH_QUESTIONNAIRE[number]