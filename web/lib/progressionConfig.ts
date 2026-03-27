/**
 * Progression system configuration — level thresholds, unlock definitions,
 * and color theme palettes for the visual progression engine.
 *
 * Levels follow a logarithmic curve: each level requires roughly 2× the
 * cumulative playtime of the previous one, rewarding early engagement while
 * keeping long-term goals aspirational.
 */

// ---------------------------------------------------------------------------
// Level thresholds (cumulative playtime in seconds)
// ---------------------------------------------------------------------------

export interface LevelThreshold {
  level: number
  /** Minimum cumulative playtime (seconds) to reach this level */
  playtimeRequired: number
  /** Human-readable label */
  label: string
}

/**
 * Logarithmic curve: L2=5 min, L3=15 min, L4=30 min, L5=60 min,
 * L6=120 min, L7=240 min, L8=480 min.
 */
export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, playtimeRequired: 0,       label: 'Initiate' },
  { level: 2, playtimeRequired: 300,     label: 'Explorer' },      // 5 min
  { level: 3, playtimeRequired: 900,     label: 'Resonator' },     // 15 min
  { level: 4, playtimeRequired: 1800,    label: 'Harmonic' },      // 30 min
  { level: 5, playtimeRequired: 3600,    label: 'Frequency Adept' },// 60 min
  { level: 6, playtimeRequired: 7200,    label: 'Wave Master' },   // 120 min
  { level: 7, playtimeRequired: 14400,   label: 'Sonic Sage' },    // 240 min
  { level: 8, playtimeRequired: 28800,   label: 'Quantum Maestro' },// 480 min
]

/** XP earned per second of active playtime */
export const XP_PER_SECOND = 1

// ---------------------------------------------------------------------------
// Unlock definitions — map levels to effect IDs
// ---------------------------------------------------------------------------

export interface UnlockDefinition {
  effectId: string
  level: number
  label: string
  description: string
  category: 'particle' | 'theme' | 'waveform' | 'background' | 'prestige'
}

export const UNLOCK_DEFINITIONS: UnlockDefinition[] = [
  {
    effectId: 'particle-subtle',
    level: 2,
    label: 'Subtle Particles',
    description: 'Gentle ambient particle effects',
    category: 'particle',
  },
  {
    effectId: 'theme-warm',
    level: 3,
    label: 'Warm Theme',
    description: 'A warm color palette shift',
    category: 'theme',
  },
  {
    effectId: 'waveform-glow',
    level: 4,
    label: 'Waveform Glow',
    description: 'Glowing waveform visualizer overlay',
    category: 'waveform',
  },
  {
    effectId: 'mandala-bg',
    level: 5,
    label: 'Mandala Background',
    description: 'Animated mandala background pattern',
    category: 'background',
  },
  {
    effectId: 'particle-storm',
    level: 6,
    label: 'Particle Storm',
    description: 'Intense particle burst effects',
    category: 'particle',
  },
  {
    effectId: 'spectrum-theme',
    level: 7,
    label: 'Spectrum Theme',
    description: 'Full-spectrum rainbow color cycling',
    category: 'theme',
  },
  {
    effectId: 'prestige',
    level: 8,
    label: 'Prestige',
    description: 'Prestige badge and exclusive gold effects',
    category: 'prestige',
  },
]

// ---------------------------------------------------------------------------
// Color theme palettes per level
// ---------------------------------------------------------------------------

export interface ProgressionTheme {
  id: string
  level: number
  label: string
  /** CSS custom property values */
  colors: {
    '--progression-primary': string
    '--progression-glow': string
    '--progression-accent': string
    '--progression-bg': string
  }
}

export const PROGRESSION_THEMES: ProgressionTheme[] = [
  {
    id: 'default',
    level: 1,
    label: 'Default',
    colors: {
      '--progression-primary': '#6366f1',   // indigo-500
      '--progression-glow': 'rgba(99,102,241,0.4)',
      '--progression-accent': '#818cf8',    // indigo-400
      '--progression-bg': 'rgba(30,27,75,0.6)',
    },
  },
  {
    id: 'explorer',
    level: 2,
    label: 'Explorer Blue',
    colors: {
      '--progression-primary': '#3b82f6',   // blue-500
      '--progression-glow': 'rgba(59,130,246,0.4)',
      '--progression-accent': '#60a5fa',    // blue-400
      '--progression-bg': 'rgba(23,37,84,0.6)',
    },
  },
  {
    id: 'warm',
    level: 3,
    label: 'Warm Ember',
    colors: {
      '--progression-primary': '#f59e0b',   // amber-500
      '--progression-glow': 'rgba(245,158,11,0.4)',
      '--progression-accent': '#fbbf24',    // amber-400
      '--progression-bg': 'rgba(69,26,3,0.6)',
    },
  },
  {
    id: 'harmonic',
    level: 4,
    label: 'Harmonic Green',
    colors: {
      '--progression-primary': '#10b981',   // emerald-500
      '--progression-glow': 'rgba(16,185,129,0.4)',
      '--progression-accent': '#34d399',    // emerald-400
      '--progression-bg': 'rgba(6,78,59,0.6)',
    },
  },
  {
    id: 'adept',
    level: 5,
    label: 'Frequency Adept',
    colors: {
      '--progression-primary': '#8b5cf6',   // violet-500
      '--progression-glow': 'rgba(139,92,246,0.5)',
      '--progression-accent': '#a78bfa',    // violet-400
      '--progression-bg': 'rgba(46,16,101,0.6)',
    },
  },
  {
    id: 'wave-master',
    level: 6,
    label: 'Wave Master',
    colors: {
      '--progression-primary': '#ec4899',   // pink-500
      '--progression-glow': 'rgba(236,72,153,0.5)',
      '--progression-accent': '#f472b6',    // pink-400
      '--progression-bg': 'rgba(80,7,51,0.6)',
    },
  },
  {
    id: 'sonic-sage',
    level: 7,
    label: 'Sonic Sage',
    colors: {
      '--progression-primary': '#06b6d4',   // cyan-500
      '--progression-glow': 'rgba(6,182,212,0.5)',
      '--progression-accent': '#22d3ee',    // cyan-400
      '--progression-bg': 'rgba(8,51,68,0.6)',
    },
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Compute the level for a given totalPlaytime (seconds). */
export function computeLevelFromPlaytime(totalPlaytimeSeconds: number): number {
  let level = 1
  for (const t of LEVEL_THRESHOLDS) {
    if (totalPlaytimeSeconds >= t.playtimeRequired) {
      level = t.level
    } else {
      break
    }
  }
  return level
}

/** Return all effect IDs unlocked at or below the given level. */
export function getUnlockedEffects(level: number): string[] {
  return UNLOCK_DEFINITIONS
    .filter((u) => u.level <= level)
    .map((u) => u.effectId)
}

/** Return the theme for a given level (falls back to highest available). */
export function getThemeForLevel(level: number): ProgressionTheme {
  const sorted = [...PROGRESSION_THEMES].sort((a, b) => b.level - a.level)
  return sorted.find((t) => t.level <= level) ?? PROGRESSION_THEMES[0]
}

/** XP required to go from one level to the next. Returns Infinity at max. */
export function xpToNextLevel(currentLevel: number): number {
  const next = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1)
  if (!next) return Infinity
  const current = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel)
  return (next.playtimeRequired - (current?.playtimeRequired ?? 0)) * XP_PER_SECOND
}

/** Label for a given level number. */
export function getLevelLabel(level: number): string {
  return LEVEL_THRESHOLDS.find((t) => t.level === level)?.label ?? 'Unknown'
}
