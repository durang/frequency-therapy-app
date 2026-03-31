/**
 * LibraryChat — AI Chat Component for the Frequency Library
 * 
 * Embedded in the /frequencies page. Activates when the user writes
 * conversational input. Uses the same /api/chat backend as ChatSidebar
 * but with library-specific UI (frequency cards, quick actions, etc.)
 */

'use client'

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react'
import { useChat } from '@ai-sdk/react'
import { isToolUIPart, getToolName, type UIMessage } from 'ai'
import { getFrequencyById } from '@/lib/frequencies'
import { useSessionHistory } from '@/lib/sessionHistory'
import { useAuth } from '@/lib/authState'
import { useSubscription } from '@/lib/useSubscription'
import { Frequency } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ─── Quick suggestions for chat mode ───────────────────────────────────
const CHAT_SUGGESTIONS = [
  { emoji: '😴', label: 'Can\'t sleep', prompt: 'No puedo dormir, ¿qué frecuencia me recomiendas?' },
  { emoji: '😰', label: 'Stressed', prompt: 'Me siento muy estresado y ansioso' },
  { emoji: '🧠', label: 'Need focus', prompt: 'I need to concentrate and focus better' },
  { emoji: '💆', label: 'Pain relief', prompt: 'Tengo dolor crónico, ¿qué frecuencia ayuda?' },
  { emoji: '⚡', label: 'Low energy', prompt: 'I feel tired and need an energy boost' },
  { emoji: '🧬', label: 'Healing', prompt: 'Quiero acelerar mi recuperación y sanación' },
]

// ─── Simple markdown renderer ──────────────────────────────────────────
function renderMarkdown(text: string) {
  // Split into lines for processing
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let listItems: string[] = []
  
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ol key={`list-${elements.length}`} className="list-decimal list-inside space-y-1.5 my-2">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      )
      listItems = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Numbered list item: "1. **text**" or "1. text"
    const listMatch = line.match(/^\d+\.\s+(.+)/)
    if (listMatch) {
      listItems.push(listMatch[1])
      continue
    }

    // Bullet list item
    const bulletMatch = line.match(/^[-•]\s+(.+)/)
    if (bulletMatch) {
      flushList()
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 my-1">
          <span className="text-cyan-400 mt-1 text-xs">•</span>
          <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(bulletMatch[1]) }} />
        </div>
      )
      continue
    }

    // Headings: ## or ### — strip the hashes, render as styled text
    const headingMatch = line.match(/^#{1,4}\s+(.+)/)
    if (headingMatch) {
      flushList()
      elements.push(
        <p key={`h-${i}`} className="text-sm font-semibold text-gray-800 dark:text-white/70 mt-3 mb-1">
          {headingMatch[1].replace(/[#]/g, '').trim()}
        </p>
      )
      continue
    }

    // Regular text
    flushList()
    if (line.trim()) {
      elements.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed my-1" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      )
    } else if (i > 0 && i < lines.length - 1) {
      elements.push(<div key={`br-${i}`} className="h-1" />)
    }
  }
  flushList()

  return <>{elements}</>
}

function formatInline(text: string): string {
  // Bold: **text** → <strong>
  let result = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white/90">$1</strong>')
  // Italic: *text* → <em>
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
  // Code: `text` → <code>
  result = result.replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-xs">$1</code>')
  return result
}

// ─── Tier badges ───────────────────────────────────────────────────────
const tierColors: Record<string, string> = {
  free: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10',
  basic: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10',
  pro: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10',
  clinical: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10',
}

// ─── Frequency Card inside chat ────────────────────────────────────────
function ChatFrequencyCard({ freq, isPrimary, onSelect }: {
  freq: { id: string; name: string; hz_value: number; category: string; description?: string; tier?: string; duration_minutes?: number }
  isPrimary?: boolean
  onSelect: (id: string) => void
}) {
  const fullFreq = getFrequencyById(freq.id)
  const tierLabel = freq.tier === 'free' ? 'Free' : freq.tier === 'clinical' ? 'Clinical' : 'Premium'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 transition-all ${
        isPrimary
          ? 'border-cyan-500/30 dark:border-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-500/[0.06]'
          : 'border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/[0.12]'
      }`}
    >
      {isPrimary && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            🏆 Best Match
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white/90 truncate"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              {freq.name}
            </h4>
            <span className="text-xs text-gray-400 dark:text-white/30 tabular-nums flex-shrink-0">{freq.hz_value} Hz</span>
          </div>

          {freq.description && (
            <p className="text-xs text-gray-500 dark:text-white/40 line-clamp-2 mb-2">{freq.description}</p>
          )}

          <div className="flex items-center gap-2">
            {freq.tier && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tierColors[freq.tier] || tierColors.free}`}>
                {tierLabel}
              </span>
            )}
            {freq.duration_minutes && (
              <span className="text-[10px] text-gray-400 dark:text-white/25">⏱ {freq.duration_minutes} min</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <Link
            href={`/experience/${freq.id}`}
            className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-all text-center"
            onClick={(e) => e.stopPropagation()}
          >
            ▶ Start
          </Link>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(freq.id) }}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/[0.08] text-xs text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/15 transition-all"
          >
            Details
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Tool result renderer ──────────────────────────────────────────────
function ChatToolResult({ toolName, output, onSelectFrequency }: {
  toolName: string
  output: unknown
  onSelectFrequency: (id: string) => void
}) {
  const result = output as Record<string, unknown>
  if (!result?.success) return null

  if (toolName === 'recommend_frequency') {
    const frequencies = result.frequencies as Array<{
      id: string; name: string; hz_value: number; category: string; description: string; tier: string; duration_minutes: number
    }> | undefined

    if (!frequencies || frequencies.length === 0) return null

    return (
      <div className="space-y-2 mt-2">
        {frequencies.map((f, i) => (
          <ChatFrequencyCard
            key={f.id}
            freq={f}
            isPrimary={i === 0}
            onSelect={onSelectFrequency}
          />
        ))}
      </div>
    )
  }

  if (toolName === 'activate_frequency') {
    const freq = result.frequency as { id: string; name: string; hz_value: number; category: string; tier: string } | undefined
    if (!freq) return null

    return (
      <div className="mt-2">
        <ChatFrequencyCard freq={freq} isPrimary onSelect={onSelectFrequency} />
      </div>
    )
  }

  return null
}

// ─── Streaming indicator ───────────────────────────────────────────────
function StreamingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 150, 300].map(delay => (
        <span key={delay} className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────
interface LibraryChatProps {
  onSelectFrequency: (id: string) => void
  onClose: () => void
  initialMessage?: string
}

export function LibraryChat({ onSelectFrequency, onClose, initialMessage }: LibraryChatProps) {
  const [input, setInput] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const processedToolCalls = useRef<Set<string>>(new Set())
  const { addChatEntry, getProfileSummaryForAI } = useSessionHistory()
  const { isSuperadmin } = useAuth()
  const { isActive: hasSubscription } = useSubscription()
  const canUseChat = hasSubscription || isSuperadmin

  const { messages, sendMessage, status } = useChat()
  const isLoading = status === 'streaming' || status === 'submitted'

  // Send initial message if provided
  useEffect(() => {
    if (initialMessage && !hasStarted) {
      setHasStarted(true)
      sendMessage({ text: initialMessage })
    }
  }, [initialMessage, hasStarted, sendMessage])

  // Auto-scroll WITHIN the chat container (not the page)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, isLoading])

  // Focus input
  useEffect(() => {
    if (!initialMessage) {
      inputRef.current?.focus()
    }
  }, [initialMessage])

  // Track tool calls for session history
  useEffect(() => {
    for (const message of messages) {
      if (message.role !== 'assistant') continue
      for (const part of message.parts) {
        if (isToolUIPart(part) && part.state === 'output-available') {
          const toolName = getToolName(part)
          const toolCallId = part.toolCallId
          if (processedToolCalls.current.has(toolCallId)) continue
          processedToolCalls.current.add(toolCallId)

          const result = part.output as Record<string, unknown>
          if (result?.success && toolName === 'recommend_frequency') {
            const freqs = result.frequencies as Array<{ id: string; name: string; hz_value: number }> | undefined
            if (freqs?.length) {
              const firstUserMsg = messages.find(m => m.role === 'user')
              const userText = firstUserMsg?.parts.find(p => p.type === 'text')
              addChatEntry({
                userMessage: (userText as { text: string })?.text || '',
                recommendedFrequencies: freqs.map(f => ({ id: f.id, name: f.name, hz: f.hz_value })),
              })
            }
          }
        }
      }
    }
  }, [messages, addChatEntry])

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    setHasStarted(true)
    sendMessage({ text })
  }, [input, isLoading, sendMessage])

  const handleSuggestion = useCallback((prompt: string) => {
    if (isLoading) return
    setHasStarted(true)
    sendMessage({ text: prompt })
  }, [isLoading, sendMessage])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-cyan-500/20 dark:border-cyan-500/10 bg-white dark:bg-[#0d0d15] overflow-hidden shadow-lg shadow-cyan-500/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/[0.06] bg-gradient-to-r from-cyan-50/50 to-transparent dark:from-cyan-500/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white/80">AI Frequency Advisor</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-400">Beta</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors p-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages — scrolls within this container, NOT the page */}
      {canUseChat ? (
        <div ref={scrollContainerRef} className="max-h-[500px] overflow-y-auto px-5 py-4 scroll-smooth">
          {!hasStarted ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 dark:text-white/50 mb-1">
                Tell me how you feel, and I&apos;ll find the perfect frequency for you.
              </p>
              <p className="text-xs text-gray-400 dark:text-white/25 mb-4">
                I speak English, Spanish, and more 🌎
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {CHAT_SUGGESTIONS.map(s => (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestion(s.prompt)}
                    className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-xs text-gray-600 dark:text-white/50 hover:border-cyan-400/40 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-cyan-400 transition-all"
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message: UIMessage) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] ${
                    message.role === 'user'
                      ? 'rounded-2xl rounded-br-md px-4 py-2.5 bg-gray-900 dark:bg-white/10 text-white text-sm'
                      : 'text-gray-700 dark:text-white/70'
                  }`}>
                    {message.parts.map((part, idx) => {
                      if (part.type === 'text') {
                        return (
                          <div key={idx}>
                            {renderMarkdown(part.text)}
                          </div>
                        )
                      }
                      if (isToolUIPart(part) && part.state === 'output-available') {
                        return (
                          <ChatToolResult
                            key={idx}
                            toolName={getToolName(part)}
                            output={part.output}
                            onSelectFrequency={onSelectFrequency}
                          />
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <StreamingDots />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      ) : (
        /* Paywall — shown to free users instead of chat */
        <div className="text-center p-6">
          <span className="text-2xl mb-2 block">✨</span>
          <p className="text-sm font-medium text-gray-900 dark:text-white/80 mb-1">AI Advisor is a Premium feature</p>
          <p className="text-xs text-gray-500 dark:text-white/35 mb-4">Get personalized frequency recommendations powered by AI</p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-sm font-medium">Upgrade to Premium</Link>
        </div>
      )}

      {/* Input — only shown to subscribers */}
      {canUseChat && (
      <div className="border-t border-gray-100 dark:border-white/[0.06] p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hasStarted ? 'Follow up...' : 'Describe how you feel...'}
            className="flex-1 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-cyan-500/40 dark:focus:border-cyan-500/30 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-teal-700 disabled:opacity-30 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
      )}
    </motion.div>
  )
}
