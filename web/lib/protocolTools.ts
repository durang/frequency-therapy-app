/**
 * Protocol recommendation tools for the AI chat assistant.
 * Extends the frequency tools with protocol-specific capabilities.
 */

import { tool, type ToolSet } from 'ai'
import { z } from 'zod'
import { protocols, getProtocolById } from '@/lib/protocols'
import { getFrequencyById } from '@/lib/frequencies'

export const protocolTools = {
  recommend_protocol: tool({
    description:
      'Recommend healing protocols based on a user goal or condition. ' +
      'Protocols are structured 25-day programs with phased frequency sessions. ' +
      'Always use this tool when the user asks about protocols, programs, structured plans, or long-term healing goals. ' +
      'Available protocols: sleep, anxiety, focus/cognitive, pain/recovery, detox, universal healing.',
    inputSchema: z.object({
      goal: z
        .string()
        .describe(
          'The user goal, condition, or need — e.g. "sleep better", "reduce anxiety", "focus", "pain relief", "detox", "general healing"'
        ),
    }),
    execute: async ({ goal }) => {
      console.log(`[chat-tool] recommend_protocol called with goal: "${goal}"`)

      const lowerGoal = goal.toLowerCase()

      // Goal → protocol mapping with scoring
      const scoredProtocols = protocols.map(p => {
        let score = 0
        const searchFields = [
          p.name,
          p.description,
          p.condition,
          ...p.expectedOutcomes,
          ...p.tips,
        ].join(' ').toLowerCase()

        // Direct keyword matches
        const keywords: Record<string, string[]> = {
          sleep: ['sleep', 'insomnia', 'dormir', 'sueño', 'rest', 'descanso', 'tired', 'cansado'],
          anxiety: ['anxiety', 'stress', 'anxious', 'ansiedad', 'estrés', 'nervous', 'nervioso', 'panic', 'calm', 'relax'],
          focus: ['focus', 'concentration', 'cognitive', 'brain', 'enfoque', 'concentración', 'memory', 'attention', 'ADHD', 'brain fog'],
          pain: ['pain', 'hurt', 'ache', 'injury', 'recovery', 'dolor', 'inflammation', 'arthritis', 'surgery'],
          detox: ['detox', 'cleanse', 'toxin', 'clean', 'desintoxicar', 'limpiar', 'purify'],
          healing: ['heal', 'wellness', 'immune', 'health', 'sanar', 'curar', 'recovery', 'general', 'overall'],
        }

        const matchingKeywords = keywords[p.id] || []
        for (const kw of matchingKeywords) {
          if (lowerGoal.includes(kw)) score += 10
        }

        // Fuzzy match against all protocol text
        const goalWords = lowerGoal.split(/\s+/)
        for (const word of goalWords) {
          if (word.length > 2 && searchFields.includes(word)) score += 2
        }

        return { protocol: p, score }
      })

      // Sort by score, take top matches
      const ranked = scoredProtocols
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)

      // If no keyword match, return all sorted by relevance
      const results = ranked.length > 0
        ? ranked.slice(0, 3)
        : scoredProtocols.slice(0, 3)

      return {
        success: true,
        protocols: results.map(({ protocol: p, score }) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          icon: p.icon,
          description: p.description,
          condition: p.condition,
          duration_days: p.duration_days,
          difficulty: p.difficulty,
          expectedOutcomes: p.expectedOutcomes.slice(0, 4),
          phases: p.phases.map(phase => ({
            name: phase.name,
            days: phase.days,
            description: phase.description,
            frequencyCount: phase.sessions.length,
          })),
          science: p.science,
          relevanceScore: score,
        })),
      }
    },
  }),

  get_protocol_details: tool({
    description:
      'Get detailed information about a specific protocol, including all phases, sessions, frequencies used, and tips. ' +
      'Use this when a user wants more details about a protocol or is about to start one.',
    inputSchema: z.object({
      protocol_id: z
        .string()
        .describe('The protocol ID (e.g. "sleep", "anxiety", "focus", "pain", "detox", "healing")'),
    }),
    execute: async ({ protocol_id }) => {
      console.log(`[chat-tool] get_protocol_details called with id: "${protocol_id}"`)

      const protocol = getProtocolById(protocol_id)
      if (!protocol) {
        return {
          success: false,
          error: `Protocol "${protocol_id}" not found. Available: ${protocols.map(p => p.id).join(', ')}`,
        }
      }

      // Resolve frequency names for each session
      const phasesWithFreqs = protocol.phases.map(phase => ({
        name: phase.name,
        days: phase.days,
        description: phase.description,
        sessions: phase.sessions.map(s => {
          const freq = getFrequencyById(s.frequencyId)
          return {
            frequencyName: freq?.name || 'Unknown',
            frequencyHz: freq?.hz_value || 0,
            frequencySlug: freq?.slug || '',
            duration: s.duration,
            timeOfDay: s.timeOfDay,
            notes: s.notes,
          }
        }),
      }))

      return {
        success: true,
        protocol: {
          id: protocol.id,
          name: protocol.name,
          slug: protocol.slug,
          icon: protocol.icon,
          description: protocol.description,
          condition: protocol.condition,
          science: protocol.science,
          citations: protocol.citations,
          duration_days: protocol.duration_days,
          difficulty: protocol.difficulty,
          phases: phasesWithFreqs,
          expectedOutcomes: protocol.expectedOutcomes,
          contraindications: protocol.contraindications,
          tips: protocol.tips,
        },
      }
    },
  }),
} satisfies ToolSet
