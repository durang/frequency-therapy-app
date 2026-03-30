import fs from 'fs'
import path from 'path'

describe('Breathing Guide - S02', () => {
  describe('BreathingGuide component', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '../components/immersive/BreathingGuide.tsx'),
      'utf-8'
    )

    it('has three phases: inhale, hold, exhale', () => {
      expect(source).toContain("'inhale'")
      expect(source).toContain("'hold'")
      expect(source).toContain("'exhale'")
    })

    it('defaults to 4-4-6 timing', () => {
      expect(source).toContain('inhale: 4')
      expect(source).toContain('hold: 4')
      expect(source).toContain('exhale: 6')
    })

    it('uses requestAnimationFrame with delta-time', () => {
      expect(source).toContain('requestAnimationFrame')
      expect(source).toContain('performance.now')
      expect(source).toContain('delta')
    })

    it('skips frames with large delta to prevent drift', () => {
      expect(source).toContain('delta > 0.1')
    })

    it('has phase explanations for each breathing phase', () => {
      expect(source).toContain('parasympathetic')
      expect(source).toContain('CO₂')
      expect(source).toContain('vagus nerve')
    })

    it('persists config in localStorage', () => {
      expect(source).toContain('localStorage.getItem')
      expect(source).toContain('localStorage.setItem')
      expect(source).toContain('freqtherapy-breathing-config')
    })

    it('tracks cycle count', () => {
      expect(source).toContain('cycleCount')
      expect(source).toContain('Cycle')
    })

    it('renders breathing orb with dynamic scale', () => {
      expect(source).toContain('getScale')
      expect(source).toContain('radial-gradient')
    })

    it('shows countdown timer per phase', () => {
      expect(source).toContain('remainingSeconds')
      expect(source).toContain('tabular-nums')
    })

    it('uses distinctive typography', () => {
      expect(source).toContain('--font-instrument')
    })
  })

  describe('BreathingSettings component', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '../components/immersive/BreathingSettings.tsx'),
      'utf-8'
    )

    it('has preset breathing patterns', () => {
      expect(source).toContain('Relaxing')
      expect(source).toContain('Box Breathing')
      expect(source).toContain('4-7-8 Sleep')
      expect(source).toContain('Energizing')
    })

    it('allows adjusting individual phase durations', () => {
      expect(source).toContain('adjustValue')
      expect(source).toContain('Math.max(1')
      expect(source).toContain('Math.min(12')
    })

    it('shows total cycle time and breaths per minute', () => {
      expect(source).toContain('breaths/min')
      expect(source).toContain('Cycle:')
    })

    it('persists changes to localStorage', () => {
      expect(source).toContain('localStorage.setItem')
    })

    it('has close button', () => {
      expect(source).toContain('onClose')
    })

    it('explains each preset', () => {
      expect(source).toContain('Extended exhale')
      expect(source).toContain('Equal phases')
      expect(source).toContain('Dr. Weil')
      expect(source).toContain('sympathetic')
    })
  })

  describe('Integration with ImmersiveExperience', () => {
    const source = fs.readFileSync(
      path.join(__dirname, '../components/immersive/ImmersiveExperience.tsx'),
      'utf-8'
    )

    it('imports BreathingGuide and BreathingSettings', () => {
      expect(source).toContain("import BreathingGuide from './BreathingGuide'")
      expect(source).toContain("import BreathingSettings from './BreathingSettings'")
    })

    it('has breathing toggle state', () => {
      expect(source).toContain('breathingActive')
      expect(source).toContain('setBreathingActive')
    })

    it('has settings panel toggle', () => {
      expect(source).toContain('breathingSettingsOpen')
      expect(source).toContain('setBreathingSettingsOpen')
    })

    it('renders breathing toggle button', () => {
      expect(source).toContain('Breathe')
    })

    it('breathing guide only active when playing', () => {
      expect(source).toContain('breathingActive && isPlaying')
    })
  })
})
