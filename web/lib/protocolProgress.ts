'use client'

// Protocol progress tracking — localStorage for now, Supabase when authenticated

export interface SessionLog {
  protocolId: string
  day: number
  phase: number
  sessionIndex: number
  frequencyId: string
  frequencyName: string
  duration: number // minutes listened
  completedAt: string // ISO date
}

export interface ProtocolProgress {
  protocolId: string
  startedAt: string
  currentDay: number
  currentPhase: number
  completedSessions: SessionLog[]
  totalMinutes: number
  streak: number // consecutive days
  lastSessionDate: string
  completed: boolean
}

const STORAGE_KEY = 'freqtherapy-protocol-progress'

function loadAll(): Record<string, ProtocolProgress> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch { return {} }
}

function saveAll(data: Record<string, ProtocolProgress>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function getProgress(protocolId: string): ProtocolProgress | null {
  const all = loadAll()
  return all[protocolId] || null
}

export function startProtocol(protocolId: string): ProtocolProgress {
  const all = loadAll()
  const existing = all[protocolId]
  if (existing && !existing.completed) return existing

  const progress: ProtocolProgress = {
    protocolId,
    startedAt: new Date().toISOString(),
    currentDay: 1,
    currentPhase: 0,
    completedSessions: [],
    totalMinutes: 0,
    streak: 0,
    lastSessionDate: '',
    completed: false,
  }
  all[protocolId] = progress
  saveAll(all)
  console.log(`📋 Protocol started: ${protocolId}`)
  return progress
}

/** Minimum minutes a session must last to count as "completed" */
const MIN_SESSION_MINUTES = 1

export function logSession(protocolId: string, session: Omit<SessionLog, 'completedAt'>): ProtocolProgress {
  const all = loadAll()
  let progress = all[protocolId]
  if (!progress) {
    progress = startProtocol(protocolId)
    const allNew = loadAll()
    progress = allNew[protocolId]
  }

  // Use real duration from sessionStorage if available (set by ImmersiveExperience)
  let realDuration = session.duration
  if (typeof window !== 'undefined') {
    const realMinutesStr = sessionStorage.getItem('last-session-real-minutes')
    const realFreqId = sessionStorage.getItem('last-session-frequency-id')
    if (realMinutesStr && realFreqId === session.frequencyId) {
      realDuration = parseInt(realMinutesStr, 10) || session.duration
      // Clear after use
      sessionStorage.removeItem('last-session-real-minutes')
      sessionStorage.removeItem('last-session-frequency-id')
      console.log(`📋 Using real playback duration: ${realDuration} min (protocol expected: ${session.duration} min)`)
    }
  }

  // Only count sessions where user actually listened for the minimum duration
  if (realDuration < MIN_SESSION_MINUTES) {
    console.log(`📋 Session too short (${realDuration}min < ${MIN_SESSION_MINUTES}min minimum) — not counted`)
    return progress
  }

  // Prevent duplicate session logs for the same day+frequency combo
  const today = new Date().toDateString()
  const alreadyLogged = progress.completedSessions.some(s => {
    const sessionDate = new Date(s.completedAt).toDateString()
    return sessionDate === today && s.frequencyId === session.frequencyId && s.day === session.day
  })
  if (alreadyLogged) {
    console.log(`📋 Session already logged for today (Day ${session.day}, ${session.frequencyName}) — skipping duplicate`)
    return progress
  }

  const log: SessionLog = {
    ...session,
    duration: realDuration, // use real playback time, not protocol estimate
    completedAt: new Date().toISOString(),
  }

  progress.completedSessions.push(log)
  progress.totalMinutes += realDuration

  // Update streak
  const lastDate = progress.lastSessionDate ? new Date(progress.lastSessionDate).toDateString() : ''
  if (lastDate !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (lastDate === yesterday.toDateString()) {
      progress.streak += 1
    } else if (lastDate !== today) {
      progress.streak = 1
    }
    progress.lastSessionDate = new Date().toISOString()
  }

  // Current day = number of unique days with completed sessions (not calendar days since start)
  const uniqueDays = new Set(
    progress.completedSessions.map(s => new Date(s.completedAt).toDateString())
  )
  progress.currentDay = Math.min(uniqueDays.size, 25)

  // Update phase
  if (progress.currentDay <= 7) progress.currentPhase = 0
  else if (progress.currentDay <= 17) progress.currentPhase = 1
  else progress.currentPhase = 2

  // Check completion — requires both 25 days with sessions AND at least 25 total sessions
  if (progress.currentDay >= 25 && progress.completedSessions.length >= 25) {
    progress.completed = true
  }

  all[protocolId] = progress
  saveAll(all)
  console.log(`📋 Session logged: Day ${progress.currentDay}, Phase ${progress.currentPhase + 1}, ${session.duration}min (${progress.completedSessions.length} total sessions)`)
  return progress
}

export function getAllProgress(): ProtocolProgress[] {
  const all = loadAll()
  return Object.values(all)
}

export function resetProtocol(protocolId: string) {
  const all = loadAll()
  delete all[protocolId]
  saveAll(all)
}
