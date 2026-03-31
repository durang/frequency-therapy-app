/**
 * Session History Store
 * 
 * Tracks user therapy sessions with post-session feedback,
 * builds a wellness profile over time, and provides data
 * for AI-personalized recommendations.
 * 
 * Storage: localStorage for anonymous users, Supabase for logged-in users.
 * Migration: localStorage data migrates to Supabase on sign-in.
 */

'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Frequency } from '@/types'

// ─── Types ─────────────────────────────────────────────────────────────

export interface SessionRecord {
  id: string
  frequencyId: string
  frequencyName: string
  frequencyHz: number
  category: string
  startedAt: string         // ISO string
  endedAt: string | null
  durationMinutes: number
  completionRate: number    // 0-1
  context: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
    dayOfWeek: number       // 0-6
    triggeredBy: 'search' | 'chat' | 'recommendation' | 'direct' | 'protocol'
    chatContext?: string    // what the user asked before starting
  }
  feedback?: SessionFeedback
}

export interface SessionFeedback {
  rating: 1 | 2 | 3 | 4 | 5
  helpedWith: string[]      // tags: "sleep", "anxiety", "focus", "pain", "energy", "mood"
  wouldRepeat: boolean
  timestamp: string
}

export interface FrequencyUsageStats {
  frequencyId: string
  frequencyName: string
  frequencyHz: number
  totalSessions: number
  totalMinutes: number
  avgRating: number
  avgCompletionRate: number
  lastUsed: string
  preferredTimeOfDay: string
  helpedWith: string[]
}

export interface WellnessInsights {
  totalSessions: number
  totalMinutes: number
  streakDays: number
  longestStreak: number
  mostUsedFrequency: FrequencyUsageStats | null
  mostEffectiveFrequency: FrequencyUsageStats | null
  topGoals: string[]               // most common helpedWith tags
  preferredTimeOfDay: string
  weeklyAvgSessions: number
  improvementAreas: {
    area: string
    sessionCount: number
    avgRating: number
  }[]
}

export interface ChatHistoryEntry {
  id: string
  timestamp: string
  userMessage: string         // first user message (the query)
  recommendedFrequencies: { id: string; name: string; hz: number }[]
  activatedFrequency?: { id: string; name: string; hz: number }
}

// ─── Helper: Time of Day ───────────────────────────────────────────────

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

function generateId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ─── Store ─────────────────────────────────────────────────────────────

interface SessionHistoryState {
  sessions: SessionRecord[]
  chatHistory: ChatHistoryEntry[]
  activeSession: SessionRecord | null
  feedbackPending: SessionRecord | null  // session waiting for feedback

  // Actions
  startSession: (frequency: Frequency, triggeredBy: SessionRecord['context']['triggeredBy'], chatContext?: string) => string
  endSession: (sessionId: string) => void
  submitFeedback: (sessionId: string, feedback: SessionFeedback) => void
  dismissFeedback: () => void
  addChatEntry: (entry: Omit<ChatHistoryEntry, 'id' | 'timestamp'>) => void

  // Computed
  getInsights: () => WellnessInsights
  getFrequencyStats: (frequencyId: string) => FrequencyUsageStats | null
  getAllFrequencyStats: () => FrequencyUsageStats[]
  getRecentSessions: (limit?: number) => SessionRecord[]
  getProfileSummaryForAI: () => string  // compressed context for AI system prompt
  getTimeBasedRecommendation: () => { frequencyId: string; reason: string } | null
}

export const useSessionHistory = create<SessionHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],
      chatHistory: [],
      activeSession: null,
      feedbackPending: null,

      startSession: (frequency, triggeredBy, chatContext) => {
        const id = generateId()
        const session: SessionRecord = {
          id,
          frequencyId: frequency.id,
          frequencyName: frequency.name,
          frequencyHz: frequency.hz_value,
          category: frequency.category,
          startedAt: new Date().toISOString(),
          endedAt: null,
          durationMinutes: 0,
          completionRate: 0,
          context: {
            timeOfDay: getTimeOfDay(),
            dayOfWeek: new Date().getDay(),
            triggeredBy,
            chatContext,
          },
        }
        set({ activeSession: session })
        console.log(`📊 [SessionHistory] Started session ${id} for ${frequency.name} (${frequency.hz_value} Hz)`)
        return id
      },

      endSession: (sessionId) => {
        const { activeSession, sessions } = get()
        if (!activeSession || activeSession.id !== sessionId) return

        const endedAt = new Date()
        const startedAt = new Date(activeSession.startedAt)
        const durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000)

        // Skip if less than 30 seconds
        if (durationMinutes < 0.5) {
          set({ activeSession: null })
          return
        }

        const completedSession: SessionRecord = {
          ...activeSession,
          endedAt: endedAt.toISOString(),
          durationMinutes,
          completionRate: Math.min(1, durationMinutes / 20), // assume 20min is a "full" session
        }

        set({
          sessions: [completedSession, ...sessions].slice(0, 200), // keep last 200
          activeSession: null,
          feedbackPending: completedSession,
        })

        console.log(`📊 [SessionHistory] Ended session ${sessionId} — ${durationMinutes} min`)
      },

      submitFeedback: (sessionId, feedback) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === sessionId ? { ...s, feedback } : s
          ),
          feedbackPending: null,
        }))
        console.log(`📊 [SessionHistory] Feedback submitted for ${sessionId}: ${feedback.rating}⭐`)
      },

      dismissFeedback: () => set({ feedbackPending: null }),

      addChatEntry: (entry) => {
        const chatEntry: ChatHistoryEntry = {
          ...entry,
          id: `chat_${Date.now()}`,
          timestamp: new Date().toISOString(),
        }
        set(state => ({
          chatHistory: [chatEntry, ...state.chatHistory].slice(0, 50),
        }))
      },

      // ── Computed Insights ──────────────────────────────────────

      getInsights: () => {
        const { sessions } = get()
        if (sessions.length === 0) {
          return {
            totalSessions: 0,
            totalMinutes: 0,
            streakDays: 0,
            longestStreak: 0,
            mostUsedFrequency: null,
            mostEffectiveFrequency: null,
            topGoals: [],
            preferredTimeOfDay: 'evening',
            weeklyAvgSessions: 0,
            improvementAreas: [],
          }
        }

        const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
        const allStats = get().getAllFrequencyStats()

        // Streak calculation
        const sessionDates = Array.from(new Set(
          sessions.map(s => new Date(s.startedAt).toDateString())
        )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

        let streakDays = 0
        let longestStreak = 0
        let currentStreak = 0
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()

        if (sessionDates[0] === today || sessionDates[0] === yesterday) {
          for (let i = 0; i < sessionDates.length; i++) {
            const expected = new Date(Date.now() - i * 86400000).toDateString()
            if (sessionDates.includes(expected)) {
              currentStreak++
            } else break
          }
          streakDays = currentStreak
        }

        // Longest streak (simplified)
        longestStreak = Math.max(streakDays, 1)

        // Most used
        const mostUsed = allStats.sort((a, b) => b.totalSessions - a.totalSessions)[0] || null

        // Most effective (highest avg rating with at least 2 sessions)
        const rated = allStats.filter(s => s.avgRating > 0 && s.totalSessions >= 2)
        const mostEffective = rated.sort((a, b) => b.avgRating - a.avgRating)[0] || null

        // Top goals
        const goalCounts: Record<string, number> = {}
        sessions.forEach(s => {
          s.feedback?.helpedWith.forEach(g => {
            goalCounts[g] = (goalCounts[g] || 0) + 1
          })
        })
        const topGoals = Object.entries(goalCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([g]) => g)

        // Preferred time
        const timeCounts: Record<string, number> = {}
        sessions.forEach(s => {
          timeCounts[s.context.timeOfDay] = (timeCounts[s.context.timeOfDay] || 0) + 1
        })
        const preferredTimeOfDay = Object.entries(timeCounts)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'evening'

        // Weekly average
        const oldestSession = new Date(sessions[sessions.length - 1].startedAt)
        const weeksSinceFirst = Math.max(1, (Date.now() - oldestSession.getTime()) / (7 * 86400000))
        const weeklyAvgSessions = Math.round((sessions.length / weeksSinceFirst) * 10) / 10

        // Improvement areas
        const improvementAreas = Object.entries(goalCounts).map(([area, count]) => {
          const relevantSessions = sessions.filter(s => s.feedback?.helpedWith.includes(area))
          const avgRating = relevantSessions.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / Math.max(relevantSessions.length, 1)
          return { area, sessionCount: count, avgRating: Math.round(avgRating * 10) / 10 }
        }).sort((a, b) => b.sessionCount - a.sessionCount)

        return {
          totalSessions: sessions.length,
          totalMinutes,
          streakDays,
          longestStreak,
          mostUsedFrequency: mostUsed,
          mostEffectiveFrequency: mostEffective,
          topGoals,
          preferredTimeOfDay,
          weeklyAvgSessions,
          improvementAreas,
        }
      },

      getFrequencyStats: (frequencyId) => {
        const { sessions } = get()
        const freqSessions = sessions.filter(s => s.frequencyId === frequencyId)
        if (freqSessions.length === 0) return null

        const rated = freqSessions.filter(s => s.feedback)
        const allHelpedWith = new Set<string>()
        freqSessions.forEach(s => s.feedback?.helpedWith.forEach(h => allHelpedWith.add(h)))

        const timeCounts: Record<string, number> = {}
        freqSessions.forEach(s => {
          timeCounts[s.context.timeOfDay] = (timeCounts[s.context.timeOfDay] || 0) + 1
        })

        return {
          frequencyId,
          frequencyName: freqSessions[0].frequencyName,
          frequencyHz: freqSessions[0].frequencyHz,
          totalSessions: freqSessions.length,
          totalMinutes: freqSessions.reduce((sum, s) => sum + s.durationMinutes, 0),
          avgRating: rated.length > 0
            ? rated.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / rated.length
            : 0,
          avgCompletionRate: freqSessions.reduce((sum, s) => sum + s.completionRate, 0) / freqSessions.length,
          lastUsed: freqSessions[0].startedAt,
          preferredTimeOfDay: Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'evening',
          helpedWith: Array.from(allHelpedWith),
        }
      },

      getAllFrequencyStats: () => {
        const { sessions } = get()
        const frequencyIds = Array.from(new Set(sessions.map(s => s.frequencyId)))
        return frequencyIds.map(id => get().getFrequencyStats(id)!).filter(Boolean)
      },

      getRecentSessions: (limit = 10) => {
        return get().sessions.slice(0, limit)
      },

      // ── AI Context Generator ──────────────────────────────────

      getProfileSummaryForAI: () => {
        const { sessions, chatHistory } = get()
        if (sessions.length === 0) return ''

        const insights = get().getInsights()
        const recentSessions = sessions.slice(0, 5)
        const recentChats = chatHistory.slice(0, 3)

        let summary = `USER WELLNESS PROFILE (${sessions.length} sessions, ${insights.totalMinutes} total minutes):\n`

        if (insights.mostUsedFrequency) {
          summary += `- Most used: ${insights.mostUsedFrequency.frequencyName} (${insights.mostUsedFrequency.frequencyHz} Hz) — ${insights.mostUsedFrequency.totalSessions} sessions\n`
        }
        if (insights.mostEffectiveFrequency) {
          summary += `- Most effective: ${insights.mostEffectiveFrequency.frequencyName} (${insights.mostEffectiveFrequency.frequencyHz} Hz) — ${insights.mostEffectiveFrequency.avgRating.toFixed(1)}⭐ avg\n`
        }
        if (insights.topGoals.length > 0) {
          summary += `- Primary goals: ${insights.topGoals.join(', ')}\n`
        }
        if (insights.streakDays > 0) {
          summary += `- Current streak: ${insights.streakDays} days\n`
        }
        summary += `- Preferred time: ${insights.preferredTimeOfDay}\n`
        summary += `- Weekly avg: ${insights.weeklyAvgSessions} sessions/week\n`

        if (recentSessions.length > 0) {
          summary += `\nRECENT SESSIONS:\n`
          recentSessions.forEach(s => {
            const rating = s.feedback ? `${s.feedback.rating}⭐` : 'no rating'
            summary += `- ${s.frequencyName} (${s.frequencyHz} Hz) — ${s.durationMinutes} min, ${s.context.timeOfDay}, ${rating}\n`
          })
        }

        if (recentChats.length > 0) {
          summary += `\nRECENT QUERIES:\n`
          recentChats.forEach(c => {
            summary += `- "${c.userMessage}" → recommended: ${c.recommendedFrequencies.map(f => f.name).join(', ')}\n`
          })
        }

        return summary
      },

      // ── Time-Based Recommendation ─────────────────────────────

      getTimeBasedRecommendation: () => {
        const { sessions } = get()
        if (sessions.length < 3) return null

        const currentTime = getTimeOfDay()
        const currentHour = new Date().getHours()

        // Find sessions at similar times with good ratings
        const similarTimeSessions = sessions
          .filter(s => s.context.timeOfDay === currentTime && s.feedback && s.feedback.rating >= 4)
          .slice(0, 10)

        if (similarTimeSessions.length === 0) return null

        // Count frequency usage at this time
        const freqCounts: Record<string, { count: number; avgRating: number; name: string; id: string }> = {}
        similarTimeSessions.forEach(s => {
          if (!freqCounts[s.frequencyId]) {
            freqCounts[s.frequencyId] = { count: 0, avgRating: 0, name: s.frequencyName, id: s.frequencyId }
          }
          freqCounts[s.frequencyId].count++
          freqCounts[s.frequencyId].avgRating += s.feedback!.rating
        })

        // Find best frequency for this time
        const best = Object.values(freqCounts)
          .map(f => ({ ...f, avgRating: f.avgRating / f.count }))
          .sort((a, b) => b.avgRating - a.avgRating || b.count - a.count)[0]

        if (!best) return null

        const timeLabel = currentTime === 'morning' ? 'mornings' : currentTime === 'afternoon' ? 'afternoons' : currentTime === 'evening' ? 'evenings' : 'nights'
        const reason = `You've used ${best.name} ${best.count} times on ${timeLabel} with an average ${best.avgRating.toFixed(1)}⭐ rating.`

        return { frequencyId: best.id, reason }
      },
    }),
    {
      name: 'freq-session-history',
      version: 1,
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
    }
  )
)
