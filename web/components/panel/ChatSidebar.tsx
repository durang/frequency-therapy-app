'use client'

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react'
import { useChat } from '@ai-sdk/react'
import { isToolUIPart, getToolName, type UIMessage } from 'ai'
import { usePanelStore } from '@/lib/panelState'
import { useChatState } from '@/lib/chatState'
import { getFrequencyById } from '@/lib/frequencies'
import {
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

// ─── Quick-action preset buttons ───────────────────────────────────────
const QUICK_ACTIONS = [
  { emoji: '🧘', label: 'Relaxation', prompt: 'I want to relax and reduce stress' },
  { emoji: '🧠', label: 'Focus', prompt: 'Help me focus and concentrate' },
  { emoji: '😴', label: 'Sleep', prompt: 'I need help falling asleep' },
  { emoji: '⚡', label: 'Energy', prompt: 'I need an energy boost' },
]

// ─── Tool result card ──────────────────────────────────────────────────
function ToolCard({ toolName, output }: { toolName: string; output: unknown }) {
  const result = output as Record<string, unknown>
  if (!result?.success) return null

  if (toolName === 'recommend_frequency' || toolName === 'activate_frequency') {
    const frequencies =
      toolName === 'recommend_frequency'
        ? (result.frequencies as Array<{ name: string; hz_value: number; category: string }>)
        : result.frequency
          ? [result.frequency as { name: string; hz_value: number; category: string }]
          : []

    if (!frequencies || frequencies.length === 0) return null

    return (
      <div className="chat-tool-card mt-1 space-y-1">
        {frequencies.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-quantum-400" />
            <span className="font-medium text-white/90">{f.name}</span>
            <span className="text-white/50">{f.hz_value} Hz</span>
            <span className="ml-auto rounded-full bg-quantum-500/20 px-2 py-0.5 text-[10px] text-quantum-300">
              {toolName === 'activate_frequency' ? 'Activated' : f.category}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (toolName === 'adjust_panel') {
    const adjustments = result.adjustments as string[] | undefined
    if (!adjustments?.length) return null
    return (
      <div className="chat-tool-card mt-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70">
        🎛️ {adjustments.join(' • ')}
      </div>
    )
  }

  return null
}

// ─── Streaming dots indicator ──────────────────────────────────────────
function StreamingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-quantum-400 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-quantum-400 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-quantum-400 [animation-delay:300ms]" />
    </div>
  )
}

// ─── Missing API key setup card ────────────────────────────────────────
function ApiKeyMissingCard() {
  return (
    <div className="mx-4 my-auto flex flex-col items-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
        <ExclamationTriangleIcon className="h-7 w-7 text-amber-400" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-white/90">AI Assistant Setup</h3>
      <p className="mb-3 text-xs leading-relaxed text-white/50">
        The AI chat assistant needs an OpenAI API key to work. Add one to your{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-quantum-300">.env.local</code>{' '}
        file:
      </p>
      <div className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-left text-xs font-mono text-white/60">
        OPENAI_API_KEY=sk-...
      </div>
      <p className="mt-3 text-[11px] text-white/30">
        This feature is optional — the panel works fine without it.
      </p>
    </div>
  )
}

// ─── Main ChatSidebar Component ────────────────────────────────────────
interface ChatSidebarProps {
  isMobile?: boolean
  onClose?: () => void
}

export function ChatSidebar({ isMobile = false, onClose }: ChatSidebarProps) {
  const { sidebarOpen, setSidebarOpen } = useChatState()
  const [input, setInput] = useState('')
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const processedToolCalls = useRef<Set<string>>(new Set())

  const { messages, sendMessage, status, error } = useChat()

  const isLoading = status === 'streaming' || status === 'submitted'

  // Detect API key missing from error responses
  useEffect(() => {
    if (
      error &&
      (error.message?.includes('API key') ||
        error.message?.includes('OPENAI') ||
        error.message?.includes('503'))
    ) {
      setApiKeyMissing(true)
    }
  }, [error])

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose()
    } else {
      setSidebarOpen(false)
    }
  }, [onClose, setSidebarOpen])

  // ── Tool→Action Bridge ────────────────────────────────────────────
  const handleToolAction = useCallback(
    (toolName: string, toolCallId: string, output: unknown) => {
      if (processedToolCalls.current.has(toolCallId)) return
      processedToolCalls.current.add(toolCallId)

      const result = output as Record<string, unknown>
      if (!result?.success) return

      const panelState = usePanelStore.getState()

      console.log(`💬 [ChatSidebar] Tool→Action bridge: ${toolName}`, result)

      switch (toolName) {
        case 'activate_frequency': {
          const freqData = result.frequency as { id: string } | undefined
          if (freqData?.id) {
            const freq = getFrequencyById(freqData.id)
            if (freq) {
              panelState.activateFrequency(freq)
              if (!panelState.isPlaying) panelState.startPlayback()
            }
          }
          break
        }

        case 'recommend_frequency': {
          const frequencies = result.frequencies as Array<{ id: string }> | undefined
          if (frequencies?.length) {
            const freq = getFrequencyById(frequencies[0].id)
            if (freq) {
              panelState.activateFrequency(freq)
              if (!panelState.isPlaying) panelState.startPlayback()
            }
          }
          break
        }

        case 'adjust_panel': {
          const masterVolume = result.master_volume as number | undefined
          const action = result.action as string | undefined

          if (masterVolume !== undefined) {
            panelState.setMasterVolume(masterVolume)
          }
          if (action === 'play') panelState.startPlayback()
          if (action === 'stop') panelState.stopPlayback()
          if (action === 'clear') panelState.clearActiveFrequencies()
          break
        }
      }
    },
    [],
  )

  // ── Watch messages for tool call results ──────────────────────────
  useEffect(() => {
    for (const message of messages) {
      if (message.role !== 'assistant') continue
      for (const part of message.parts) {
        if (isToolUIPart(part) && part.state === 'output-available') {
          const toolName = getToolName(part)
          handleToolAction(toolName, part.toolCallId, part.output)
        }
      }
    }
  }, [messages, handleToolAction])

  // ── Auto-scroll ───────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // ── Form submission ───────────────────────────────────────────────
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const text = input.trim()
      if (!text || isLoading) return
      setInput('')
      sendMessage({ text })
    },
    [input, isLoading, sendMessage],
  )

  // ── Quick-action sends the prompt directly as a message ───────────
  const handleQuickAction = useCallback(
    (prompt: string) => {
      if (isLoading) return
      sendMessage({ text: prompt })
    },
    [isLoading, sendMessage],
  )

  if (!sidebarOpen && !isMobile) return null

  return (
    <div
      className={`chat-sidebar flex flex-col border-l border-white/10 bg-black/20 backdrop-blur-sm ${
        isMobile
          ? 'chat-sidebar-mobile h-full w-full'
          : 'h-full w-80 lg:w-96'
      }`}
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-quantum-400" />
          <h2 className="text-sm font-semibold text-white">AI Assistant</h2>
        </div>
        <button
          onClick={handleClose}
          className="rounded-lg p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* ── Messages area ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {apiKeyMissing ? (
          /* API key missing — graceful setup card */
          <ApiKeyMissingCard />
        ) : messages.length === 0 ? (
          /* Welcome state */
          <div className="flex h-full flex-col items-center justify-center text-center">
            <SparklesIcon className="mb-3 h-10 w-10 text-quantum-400/60" />
            <p className="mb-1 text-sm font-medium text-white/80">
              Frequency Therapy Assistant
            </p>
            <p className="mb-4 text-xs text-white/50">
              Ask about frequencies in any language
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-all hover:border-quantum-500/40 hover:bg-quantum-500/10 hover:text-white"
                >
                  {action.emoji} {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message list */
          <div className="space-y-3">
            {messages.map((message: UIMessage) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === 'user'
                      ? 'chat-message-user bg-quantum-500/30 text-white'
                      : 'chat-message-ai bg-white/5 text-white/90'
                  }`}
                >
                  {message.parts.map((part, idx) => {
                    if (part.type === 'text') {
                      return (
                        <p key={idx} className="whitespace-pre-wrap leading-relaxed">
                          {part.text}
                        </p>
                      )
                    }
                    if (isToolUIPart(part) && part.state === 'output-available') {
                      return (
                        <ToolCard
                          key={idx}
                          toolName={getToolName(part)}
                          output={part.output}
                        />
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            ))}

            {/* Streaming indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/5">
                  <StreamingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Error display ─────────────────────────────────────────── */}
      {error && !apiKeyMissing && (
        <div className="mx-4 mb-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          <p>⚠️ {error.message || 'Something went wrong. Please try again.'}</p>
        </div>
      )}

      {/* ── Input area ────────────────────────────────────────────── */}
      <div className="chat-input-area border-t border-white/10 p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about frequencies... / Pregunta sobre frecuencias..."
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-quantum-500/50 focus:bg-white/10"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center rounded-xl bg-quantum-500/80 px-3 py-2.5 text-white transition-all hover:bg-quantum-500 disabled:opacity-30 disabled:hover:bg-quantum-500/80"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
