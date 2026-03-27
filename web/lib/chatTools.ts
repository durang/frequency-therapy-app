import { tool, type ToolSet } from 'ai'
import { z } from 'zod'
import {
  getRecommendedFrequencies,
  searchFrequencies,
  getFrequencyById,
  getFrequenciesByCategory,
} from '@/lib/frequencies'

/**
 * Frequency control tools for the AI chat assistant.
 * These are server-side tool definitions that the AI model can invoke
 * to recommend, activate, and manage frequency therapy sessions.
 */

export const frequencyTools = {
  recommend_frequency: tool({
    description:
      'Recommend frequencies based on a user goal like "relaxation", "focus", "sleep", "pain relief", "energy", etc. ' +
      'Searches both goal mappings and free-text across names, descriptions, categories, and benefits. ' +
      'Returns up to 4 results to respect the 4-channel panel limit. Always use this tool when the user asks for frequency suggestions.',
    inputSchema: z.object({
      goal: z
        .string()
        .describe(
          'The user goal or need — e.g. "relaxation", "focus", "sleep", "quiero dormir mejor", "pain in my back"'
        ),
    }),
    execute: async ({ goal }) => {
      console.log(`[chat-tool] recommend_frequency called with goal: "${goal}"`)

      const trimmedGoal = goal.trim()

      // Try goal-based mapping first, then fall back to free-text search
      let results = getRecommendedFrequencies(trimmedGoal)
      if (results.length === 0) {
        results = searchFrequencies(trimmedGoal)
      }

      // Limit to 4 results (panel has 4 channels max)
      const limited = results.slice(0, 4)

      if (limited.length === 0) {
        return {
          success: true,
          frequencies: [],
          message:
            'No specific frequencies found for that goal. I can suggest general wellness frequencies instead.',
        }
      }

      return {
        success: true,
        frequencies: limited.map((f) => ({
          id: f.id,
          name: f.name,
          hz_value: f.hz_value,
          category: f.category,
          description: f.description,
          tier: f.tier,
          duration_minutes: f.duration_minutes,
        })),
      }
    },
  }),

  activate_frequency: tool({
    description:
      'Activate a specific frequency on the panel by its ID. Validates that the frequency exists before returning activation data. ' +
      'The client will use the returned frequency info to add it to a panel channel. ' +
      'Use this after recommending frequencies when the user confirms they want to try one.',
    inputSchema: z.object({
      frequency_id: z
        .string()
        .describe('The frequency ID to activate (e.g. "1", "5", "12")'),
    }),
    execute: async ({ frequency_id }) => {
      console.log(
        `[chat-tool] activate_frequency called with id: "${frequency_id}"`
      )

      const frequency = getFrequencyById(frequency_id)

      if (!frequency) {
        return {
          success: false,
          error: `Frequency with ID "${frequency_id}" not found. Use recommend_frequency to find valid frequencies first.`,
        }
      }

      return {
        success: true,
        frequency: {
          id: frequency.id,
          name: frequency.name,
          hz_value: frequency.hz_value,
          category: frequency.category,
          description: frequency.description,
          tier: frequency.tier,
          duration_minutes: frequency.duration_minutes,
        },
      }
    },
  }),

  adjust_panel: tool({
    description:
      'Adjust the frequency panel settings — set master volume (0 to 1) or control playback (play, stop, clear). ' +
      'The client will apply these adjustments to the panel. Use this when the user asks to change volume, start/stop, or clear the panel.',
    inputSchema: z.object({
      master_volume: z
        .number()
        .min(0)
        .max(1)
        .optional()
        .describe('Master volume level from 0 (silent) to 1 (full volume)'),
      action: z
        .enum(['play', 'stop', 'clear'])
        .optional()
        .describe(
          'Panel action — play: start playback, stop: pause playback, clear: remove all active frequencies'
        ),
    }),
    execute: async ({ master_volume, action }) => {
      console.log(
        `[chat-tool] adjust_panel called — volume: ${master_volume}, action: ${action}`
      )

      const adjustments: string[] = []

      if (master_volume !== undefined) {
        adjustments.push(
          `Master volume set to ${Math.round(master_volume * 100)}%`
        )
      }

      if (action) {
        const actionLabels = {
          play: 'Playback started',
          stop: 'Playback stopped',
          clear: 'All frequencies cleared from panel',
        }
        adjustments.push(actionLabels[action])
      }

      if (adjustments.length === 0) {
        return {
          success: false,
          error:
            'No adjustments specified. Provide master_volume (0-1) and/or action (play/stop/clear).',
        }
      }

      return {
        success: true,
        adjustments,
        master_volume,
        action,
      }
    },
  }),

  get_panel_state: tool({
    description:
      'Request the current state of the frequency panel from the client. ' +
      'Since the panel state lives client-side (active frequencies, volume, playback status), ' +
      'this tool signals the AI to ask the user about their current panel configuration. ' +
      'Use this when you need to know what frequencies are currently active before making recommendations.',
    inputSchema: z.object({}),
    execute: async () => {
      console.log('[chat-tool] get_panel_state called')

      return {
        success: true,
        message:
          'Panel state is managed client-side. The client should provide: active frequencies (names and Hz values), current volume level, and playback status (playing/stopped).',
        requested_info: [
          'active_frequencies',
          'master_volume',
          'playback_status',
          'channel_count',
        ],
      }
    },
  }),
} satisfies ToolSet
