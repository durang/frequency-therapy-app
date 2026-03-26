import { FrequencySafetyValidator } from '@/lib/medicalSafety'
import { UserHealthProfileManager } from '@/lib/userHealthProfile'

describe('FrequencySafetyValidator', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('Frequency Validation', () => {
    it('should validate frequency safety parameters', () => {
      const validFrequency = {
        hz_value: 528,
        duration_minutes: 20,
        tier: 'free',
        volume: 0.5
      }

      const result = FrequencySafetyValidator.validateFrequency(validFrequency)

      expect(result.isValid).toBe(true)
      expect(result.frequency).toEqual(validFrequency)
    })

    it('should reject frequencies outside safe range', () => {
      const dangerousFrequency = {
        hz_value: 15000,
        duration_minutes: 20,
        tier: 'free',
        volume: 0.5
      }

      const result = FrequencySafetyValidator.validateFrequency(dangerousFrequency)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Frequency must not exceed 1000 Hz')
    })
  })

  describe('Contraindication Checking', () => {
    const safeFrequency = {
      hz_value: 528,
      duration_minutes: 20,
      tier: 'free',
      volume: 0.5
    }

    it('should identify epilepsy contraindications', () => {
      const epilepsyProfile = {
        hasEpilepsy: true,
        hasPacemaker: false,
        isPregnant: false,
        hasCardiacConditions: false,
        hasPsychiatricConditions: false,
        hasRecentBrainInjury: false,
        isOnMedication: false,
        age: 30,
        medicationDetails: '',
        hasPhysicianApproval: false
      }

      const seizureRiskFrequency = {
        ...safeFrequency,
        hz_value: 18
      }

      const result = FrequencySafetyValidator.checkContraindications(
        seizureRiskFrequency,
        epilepsyProfile
      )

      expect(result.isContraindicated).toBe(true)
      expect(result.warnings).toContain('This frequency may trigger seizures in individuals with epilepsy')
    })
  })
})