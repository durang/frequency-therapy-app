'use client'

import { create } from 'zustand'
import {
  computeLevelFromPlaytime,
  getUnlockedEffects,
  getThemeForLevel,
  xpToNextLevel,
  getLevelLabel,
  XP_PER_SECOND,
  LEVEL_THRESHOLDS,
  type ProgressionTheme,
} from './progressionConfig'
import { PanelPersistenceEngine } from './panelPersistence'

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface ProgressionState {
  level: number
  xp: number
  totalPlaytime: number // seconds
  unlockedEffects: string[]
  activeTheme: string
  lastLevelUp: string | null // ISO timestamp
  streakDays: number
  longestStreak: number
  isLevelingUp: boolean
  progressionPanelOpen: boolean

  // Actions
  initFromPersistence: () => Promise<void>
  addPlaytime: (seconds: number) => void
  getColorTheme: () => ProgressionTheme
  setProgressionPanelOpen: (open: boolean) => void
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function deriveStateFromPlaytime(totalPlaytime: number) {
  const level = computeLevelFromPlaytime(totalPlaytime)
  const xp = totalPlaytime * XP_PER_SECOND
  const unlockedEffects = getUnlockedEffects(level)
  const activeTheme = getThemeForLevel(level).id
  return { level, xp, unlockedEffects, activeTheme }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProgressionStore = create<ProgressionState>((set, get) => ({
  // Defaults — everything starts at zero/level 1
  level: 1,
  xp: 0,
  totalPlaytime: 0,
  unlockedEffects: [],
  activeTheme: 'default',
  lastLevelUp: null,
  streakDays: 0,
  longestStreak: 0,
  isLevelingUp: false,
  progressionPanelOpen: false,

  // --------------------------------------------------
  // initFromPersistence — read analytics.totalPlaytime
  // from panelPersistence and derive current state
  // --------------------------------------------------
  initFromPersistence: async () => {
    try {
      const stored = await PanelPersistenceEngine.load()
      if (!stored) {
        console.log('🎮 [Progression] No persistence data — starting fresh')
        return
      }

      const totalPlaytime = stored.analytics.totalPlaytime ?? 0

      // Restore progression sub-object if it exists
      const prog = (stored as any).progression as
        | {
            lastLevelUp?: string | null
            streakDays?: number
            longestStreak?: number
          }
        | undefined

      const derived = deriveStateFromPlaytime(totalPlaytime)

      set({
        ...derived,
        totalPlaytime,
        lastLevelUp: prog?.lastLevelUp ?? null,
        streakDays: prog?.streakDays ?? 0,
        longestStreak: prog?.longestStreak ?? 0,
      })

      console.log(
        `🎮 [Progression] Initialised — Level ${derived.level} (${getLevelLabel(derived.level)}), ` +
          `${Math.round(totalPlaytime / 60)} min playtime, ${derived.unlockedEffects.length} unlocks`
      )
    } catch (error) {
      console.error('❌ [Progression] Failed to init from persistence:', error)
    }
  },

  // --------------------------------------------------
  // addPlaytime — increment XP / totalPlaytime, check
  // for level-up, persist progression data
  // --------------------------------------------------
  addPlaytime: (seconds: number) => {
    const prev = get()
    const newTotalPlaytime = prev.totalPlaytime + seconds
    const derived = deriveStateFromPlaytime(newTotalPlaytime)

    const leveledUp = derived.level > prev.level

    set({
      ...derived,
      totalPlaytime: newTotalPlaytime,
      ...(leveledUp
        ? {
            isLevelingUp: true,
            lastLevelUp: new Date().toISOString(),
          }
        : {}),
    })

    if (leveledUp) {
      console.log(
        `🎉 [Progression] LEVEL UP! ${prev.level} → ${derived.level} (${getLevelLabel(derived.level)})`
      )

      // Clear the leveling-up flag after 3 seconds (animation window)
      setTimeout(() => {
        set({ isLevelingUp: false })
      }, 3000)
    }

    // Persist progression data asynchronously
    persistProgression(get()).catch((err) =>
      console.error('❌ [Progression] Persistence write failed:', err)
    )
  },

  // --------------------------------------------------
  // getColorTheme — return CSS vars for current level
  // --------------------------------------------------
  getColorTheme: () => {
    const { level } = get()
    return getThemeForLevel(level)
  },

  setProgressionPanelOpen: (open: boolean) => {
    set({ progressionPanelOpen: open })
  },
}))

// ---------------------------------------------------------------------------
// Persistence helper — writes the progression sub-object into
// PersistentPanelData so it survives across sessions
// ---------------------------------------------------------------------------

async function persistProgression(state: ProgressionState) {
  try {
    const stored = await PanelPersistenceEngine.load()
    if (!stored) return

    ;(stored as any).progression = {
      level: state.level,
      xp: state.xp,
      unlockedEffects: state.unlockedEffects,
      activeTheme: state.activeTheme,
      lastLevelUp: state.lastLevelUp,
      streakDays: state.streakDays,
      longestStreak: state.longestStreak,
    }

    await PanelPersistenceEngine.save(stored)
  } catch {
    // Caller already logs
  }
}

// ---------------------------------------------------------------------------
// Selector hook — stable selectors to avoid unnecessary re-renders
// ---------------------------------------------------------------------------

export function useProgression() {
  const level = useProgressionStore((s) => s.level)
  const xp = useProgressionStore((s) => s.xp)
  const totalPlaytime = useProgressionStore((s) => s.totalPlaytime)
  const unlockedEffects = useProgressionStore((s) => s.unlockedEffects)
  const activeTheme = useProgressionStore((s) => s.activeTheme)
  const lastLevelUp = useProgressionStore((s) => s.lastLevelUp)
  const streakDays = useProgressionStore((s) => s.streakDays)
  const longestStreak = useProgressionStore((s) => s.longestStreak)
  const isLevelingUp = useProgressionStore((s) => s.isLevelingUp)
  const progressionPanelOpen = useProgressionStore((s) => s.progressionPanelOpen)
  const initFromPersistence = useProgressionStore((s) => s.initFromPersistence)
  const addPlaytime = useProgressionStore((s) => s.addPlaytime)
  const getColorTheme = useProgressionStore((s) => s.getColorTheme)
  const setProgressionPanelOpen = useProgressionStore((s) => s.setProgressionPanelOpen)

  return {
    // State
    level,
    xp,
    totalPlaytime,
    unlockedEffects,
    activeTheme,
    lastLevelUp,
    streakDays,
    longestStreak,
    isLevelingUp,
    progressionPanelOpen,

    // Actions
    initFromPersistence,
    addPlaytime,
    getColorTheme,
    setProgressionPanelOpen,

    // Derived
    levelLabel: getLevelLabel(level),
    xpToNext: xpToNextLevel(level),
    xpProgress:
      xpToNextLevel(level) === Infinity
        ? 1
        : (xp - (LEVEL_THRESHOLDS.find((t) => t.level === level)?.playtimeRequired ?? 0) * XP_PER_SECOND) /
          xpToNextLevel(level),
    maxLevel: level >= 8,
  }
}
