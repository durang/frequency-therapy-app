/**
 * Progression Engine Tests
 * Tests the level computation, unlock system, and theme assignment
 */
import {
  LEVEL_THRESHOLDS,
  UNLOCK_DEFINITIONS,
  PROGRESSION_THEMES,
  XP_PER_SECOND,
  computeLevelFromPlaytime,
  getUnlockedEffects,
  getThemeForLevel,
  xpToNextLevel,
  getLevelLabel,
} from '@/lib/progressionConfig'

describe('Progression Config', () => {
  describe('Level Thresholds', () => {
    test('has 8 levels defined', () => {
      expect(LEVEL_THRESHOLDS).toHaveLength(8)
    })

    test('level 1 starts at 0 playtime', () => {
      expect(LEVEL_THRESHOLDS[0].playtimeRequired).toBe(0)
      expect(LEVEL_THRESHOLDS[0].level).toBe(1)
    })

    test('level 2 requires 5 minutes (300 seconds)', () => {
      expect(LEVEL_THRESHOLDS[1].playtimeRequired).toBe(300)
    })

    test('levels are in ascending order', () => {
      for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
        expect(LEVEL_THRESHOLDS[i].playtimeRequired).toBeGreaterThan(
          LEVEL_THRESHOLDS[i - 1].playtimeRequired
        )
      }
    })

    test('each level has a unique label', () => {
      const labels = LEVEL_THRESHOLDS.map(l => l.label)
      expect(new Set(labels).size).toBe(labels.length)
    })
  })

  describe('computeLevelFromPlaytime', () => {
    test('0 seconds = level 1', () => {
      expect(computeLevelFromPlaytime(0)).toBe(1)
    })

    test('299 seconds = still level 1', () => {
      expect(computeLevelFromPlaytime(299)).toBe(1)
    })

    test('300 seconds = level 2 (5 min threshold)', () => {
      expect(computeLevelFromPlaytime(300)).toBe(2)
    })

    test('900 seconds = level 3 (15 min threshold)', () => {
      expect(computeLevelFromPlaytime(900)).toBe(3)
    })

    test('28800 seconds = level 8 (max level, 480 min)', () => {
      expect(computeLevelFromPlaytime(28800)).toBe(8)
    })

    test('above max threshold stays at max level', () => {
      expect(computeLevelFromPlaytime(100000)).toBe(8)
    })
  })

  describe('getUnlockedEffects', () => {
    test('level 1 has no unlocked effects', () => {
      const effects = getUnlockedEffects(1)
      expect(effects).toHaveLength(0)
    })

    test('level 2 unlocks particle-subtle', () => {
      const effects = getUnlockedEffects(2)
      expect(effects).toContain('particle-subtle')
    })

    test('higher levels accumulate all previous unlocks', () => {
      const level5Effects = getUnlockedEffects(5)
      const level3Effects = getUnlockedEffects(3)
      // Level 5 should have everything level 3 has plus more
      level3Effects.forEach(e => {
        expect(level5Effects).toContain(e)
      })
      expect(level5Effects.length).toBeGreaterThan(level3Effects.length)
    })

    test('level 8 unlocks all effects', () => {
      const effects = getUnlockedEffects(8)
      expect(effects).toHaveLength(UNLOCK_DEFINITIONS.length)
    })
  })

  describe('getThemeForLevel', () => {
    test('level 1 returns default theme', () => {
      const theme = getThemeForLevel(1)
      expect(theme.id).toBe('default')
    })

    test('each level has an assigned theme', () => {
      LEVEL_THRESHOLDS.forEach(l => {
        const theme = getThemeForLevel(l.level)
        expect(theme).toBeDefined()
        expect(theme.id).toBeTruthy()
        expect(theme.level).toBeLessThanOrEqual(l.level)
      })
    })

    test('themes have required CSS custom properties', () => {
      PROGRESSION_THEMES.forEach(theme => {
        expect(theme.colors).toHaveProperty('--progression-primary')
        expect(theme.colors).toHaveProperty('--progression-glow')
        expect(theme.colors).toHaveProperty('--progression-accent')
        expect(theme.colors).toHaveProperty('--progression-bg')
      })
    })
  })

  describe('xpToNextLevel', () => {
    test('level 1 requires 300 XP to reach level 2', () => {
      const xp = xpToNextLevel(1)
      expect(xp).toBe(300) // L2 threshold - L1 threshold
    })

    test('max level returns Infinity (no next level)', () => {
      const xp = xpToNextLevel(8)
      expect(xp).toBe(Infinity)
    })
  })

  describe('getLevelLabel', () => {
    test('level 1 is Initiate', () => {
      expect(getLevelLabel(1)).toBe('Initiate')
    })

    test('level 8 is Quantum Maestro', () => {
      expect(getLevelLabel(8)).toBe('Quantum Maestro')
    })
  })

  describe('XP System', () => {
    test('XP_PER_SECOND is 1', () => {
      expect(XP_PER_SECOND).toBe(1)
    })
  })

  describe('Unlock Definitions', () => {
    test('has at least 7 unlocks', () => {
      expect(UNLOCK_DEFINITIONS.length).toBeGreaterThanOrEqual(7)
    })

    test('each unlock has required fields', () => {
      UNLOCK_DEFINITIONS.forEach(unlock => {
        expect(unlock).toHaveProperty('effectId')
        expect(unlock).toHaveProperty('level')
        expect(unlock).toHaveProperty('label')
        expect(unlock).toHaveProperty('description')
        expect(unlock).toHaveProperty('category')
        expect(unlock.level).toBeGreaterThanOrEqual(2) // no unlocks at level 1
      })
    })

    test('categories are valid', () => {
      const validCategories = ['particle', 'theme', 'waveform', 'background', 'prestige']
      UNLOCK_DEFINITIONS.forEach(unlock => {
        expect(validCategories).toContain(unlock.category)
      })
    })
  })
})
