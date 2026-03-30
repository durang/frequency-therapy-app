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

export function logSession(protocolId: string, session: Omit<SessionLog, 'completedAt'>): ProtocolProgress {
  const all = loadAll()
  let progress = all[protocolId]
  if (!progress) {
    progress = startProtocol(protocolId)
    const allNew = loadAll()
    progress = allNew[protocolId]
  }

  const log: SessionLog = {
    ...session,
    completedAt: new Date().toISOString(),
  }

  progress.completedSessions.push(log)
  progress.totalMinutes += session.duration

  // Update streak
  const today = new Date().toDateString()
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

  // Update current day based on days elapsed since start
  const daysSinceStart = Math.floor((Date.now() - new Date(progress.startedAt).getTime()) / (1000 * 60 * 60 * 24)) + 1
  progress.currentDay = Math.min(daysSinceStart, 25)

  // Update phase
  if (progress.currentDay <= 7) progress.currentPhase = 0
  else if (progress.currentDay <= 17) progress.currentPhase = 1
  else progress.currentPhase = 2

  // Check completion
  if (progress.currentDay >= 25 && progress.completedSessions.length >= 25) {
    progress.completed = true
  }

  all[protocolId] = progress
  saveAll(all)
  console.log(`📋 Session logged: Day ${progress.currentDay}, Phase ${progress.currentPhase + 1}, ${session.duration}min`)
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
