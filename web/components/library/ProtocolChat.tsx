/**
 * ProtocolChat — AI-powered protocol recommendation chat for /protocols
 * 
 * "What would you like to achieve?" → AI recommends the right protocol,
 * explains why, shows the frequencies involved, and links to articles.
 */

'use client'

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react'
import { useChat } from '@ai-sdk/react'
import { isToolUIPart, getToolName, type UIMessage } from 'ai'
import { useSessionHistory } from '@/lib/sessionHistory'
import { useAuth } from '@/lib/authState'
import { useSubscription } from '@/lib/useSubscription'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ─── Simple markdown renderer ──────────────────────────────────────────
function renderSimpleMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let listItems: string[] = []
  
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ol key={`list-${elements.length}`} className="list-decimal list-inside space-y-1.5 my-2">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: fmtInline(item) }} />
            </li>
          ))}
        </ol>
      )
      listItems = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const listMatch = line.match(/^\d+\.\s+(.+)/)
    if (listMatch) { listItems.push(listMatch[1]); continue }
    flushList()
    if (line.trim()) {
      elements.push(<p key={`p-${i}`} className="text-sm leading-relaxed my-1" dangerouslySetInnerHTML={{ __html: fmtInline(line) }} />)
    }
  }
  flushList()
  return <>{elements}</>
}

function fmtInline(t: string): string {
  return t.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white/90">$1</strong>')
}

// ─── Goal suggestions ──────────────────────────────────────────────────
const GOAL_SUGGESTIONS = [
  { emoji: '🌙', label: 'Better sleep', prompt: 'I want to fix my sleep — I have insomnia and wake up tired' },
  { emoji: '😌', label: 'Less anxiety', prompt: 'I need to reduce my anxiety and feel calmer every day' },
  { emoji: '🧠', label: 'Sharpen focus', prompt: 'I want to improve my focus and concentration for work' },
  { emoji: '💪', label: 'Pain recovery', prompt: 'I have chronic pain and want to recover faster' },
  { emoji: '🧹', label: 'Detox & cleanse', prompt: 'I want to detox my body and feel cleaner and more energetic' },
  { emoji: '✨', label: 'Overall healing', prompt: 'I want a comprehensive healing program for general wellness' },
]

// ─── Protocol Card ─────────────────────────────────────────────────────
function ProtocolRecommendationCard({ protocol, isPrimary }: {
  protocol: {
    id: string; name: string; slug: string; icon: string; description: string;
    condition: string; duration_days: number; difficulty: string;
    expectedOutcomes: string[]; phases: { name: string; days: string; description: string; frequencyCount: number }[]
    science?: string; relevanceScore?: number
  }
  isPrimary?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 transition-all ${
        isPrimary
          ? 'border-cyan-500/30 dark:border-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-500/[0.06]'
          : 'border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03]'
      }`}
    >
      {isPrimary && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            🏆 Best Match for You
          </span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl flex-shrink-0">{protocol.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white/90" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {protocol.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5 line-clamp-2">{protocol.description}</p>
        </div>
      </div>

      {/* Meta badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30">
          {protocol.duration_days} days
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
          protocol.difficulty === 'beginner'
            ? 'border-emerald-200 dark:border-emerald-400/20 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10'
            : 'border-amber-200 dark:border-amber-400/20 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10'
        }`}>{protocol.difficulty}</span>
        <span className="text-[10px] text-gray-400 dark:text-white/25">
          {protocol.phases.length} phases · {protocol.phases.reduce((s, p) => s + p.frequencyCount, 0)} daily sessions
        </span>
      </div>

      {/* Expected outcomes */}
      {protocol.expectedOutcomes.length > 0 && (
        <div className="mb-3">
          <div className="space-y-1">
            {protocol.expectedOutcomes.slice(0, 3).map((outcome, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 mt-0.5 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-xs text-gray-600 dark:text-white/40">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phases preview */}
      <div className="flex gap-1 mb-3">
        {protocol.phases.map((phase, i) => (
          <div key={i} className="flex-1 rounded-lg bg-gray-50 dark:bg-white/[0.03] px-2 py-1.5 text-center">
            <p className="text-[10px] font-medium text-gray-600 dark:text-white/50">{phase.name}</p>
            <p className="text-[9px] text-gray-400 dark:text-white/20">Days {phase.days}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex gap-2">
        <Link
          href={`/protocols/${protocol.slug}`}
          className="flex-1 text-center py-2 rounded-lg bg-gray-900 dark:bg-white/10 text-white text-xs font-medium hover:bg-gray-700 dark:hover:bg-white/15 transition-all"
        >
          View Full Protocol →
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Tool result renderer ──────────────────────────────────────────────
function ProtocolToolResult({ toolName, output }: { toolName: string; output: unknown }) {
  const result = output as Record<string, unknown>
  if (!result?.success) return null

  if (toolName === 'recommend_protocol') {
    const protocols = result.protocols as Array<{
      id: string; name: string; slug: string; icon: string; description: string;
      condition: string; duration_days: number; difficulty: string;
      expectedOutcomes: string[]; phases: { name: string; days: string; description: string; frequencyCount: number }[]
      science?: string; relevanceScore?: number
    }> | undefined

    if (!protocols || protocols.length === 0) return null

    return (
      <div className="space-y-3 mt-2">
        {protocols.map((p, i) => (
          <ProtocolRecommendationCard key={p.id} protocol={p} isPrimary={i === 0} />
        ))}
      </div>
    )
  }

  if (toolName === 'get_protocol_details') {
    const protocol = result.protocol as Record<string, unknown> | undefined
    if (!protocol) return null

    return (
      <div className="mt-2">
        <ProtocolRecommendationCard
          protocol={{
            id: protocol.id as string,
            name: protocol.name as string,
            slug: protocol.slug as string,
            icon: protocol.icon as string,
            description: protocol.description as string,
            condition: protocol.condition as string,
            duration_days: protocol.duration_days as number,
            difficulty: protocol.difficulty as string,
            expectedOutcomes: (protocol.expectedOutcomes as string[]) || [],
            phases: ((protocol.phases as Array<{ name: string; days: string; description: string; sessions: unknown[] }>) || []).map(p => ({
              ...p,
              frequencyCount: p.sessions?.length || 0,
            })),
          }}
          isPrimary
        />
      </div>
    )
  }

  // Fall through to frequency tool cards
  if (toolName === 'recommend_frequency' || toolName === 'activate_frequency') {
    const frequencies = toolName === 'recommend_frequency'
      ? (result.frequencies as Array<{ id: string; name: string; hz_value: number; category: string; description: string; tier: string }>) || []
      : result.frequency ? [result.frequency as { id: string; name: string; hz_value: number; category: string; description: string; tier: string }] : []

    if (frequencies.length === 0) return null

    return (
      <div className="space-y-1.5 mt-2">
        {frequencies.map((f, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] px-3 py-2">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-white/80">{f.name}</span>
              <span className="text-xs text-gray-400 dark:text-white/30 ml-2">{f.hz_value} Hz</span>
            </div>
            <Link href={`/frequencies/${(f as Record<string, unknown>).slug || f.id}`}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex-shrink-0">
              Read article →
            </Link>
          </div>
        ))}
      </div>
    )
  }

  return null
}

// ─── Streaming dots ────────────────────────────────────────────────────
function StreamingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 150, 300].map(d => (
        <span key={d} className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
      ))}
    </div>
  )
}

// ─── Main ProtocolChat Component ───────────────────────────────────────
export function ProtocolChat() {
  const [input, setInput] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [instantMatch, setInstantMatch] = useState<any>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { getProfileSummaryForAI } = useSessionHistory()
  const { isSuperadmin } = useAuth()
  const { isActive: hasSubscription } = useSubscription()
  const canUseChat = hasSubscription || isSuperadmin

  const { messages, sendMessage, status } = useChat()
  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, isLoading])

  // Instant protocol match — runs locally, no AI needed
  const findInstantMatch = useCallback((text: string) => {
    const lower = text.toLowerCase()
    const keywords: Record<string, string[]> = {
      sleep: ['sleep', 'insomnia', 'dormir', 'sueño', 'rest', 'tired', 'cansado', 'fatigue', 'exhausted'],
      anxiety: ['anxiety', 'stress', 'anxious', 'ansiedad', 'nervous', 'panic', 'calm', 'relax', 'tension', 'worry'],
      focus: ['focus', 'concentration', 'brain', 'enfoque', 'memory', 'attention', 'ADHD', 'productivity', 'study', 'work', 'cognitive'],
      pain: ['pain', 'hurt', 'ache', 'injury', 'dolor', 'inflammation', 'arthritis', 'surgery', 'chronic', 'back', 'recovery'],
      detox: ['detox', 'cleanse', 'toxin', 'clean', 'desintoxicar', 'limpiar', 'purify', 'hangover'],
      healing: ['heal', 'wellness', 'immune', 'health', 'general', 'overall', 'energy', 'vitality'],
      'sexual-wellness': ['sexual', 'libido', 'intimacy', 'performance', 'erectile', 'desire', 'testosterone', 'pareja', 'rendimiento'],
    }

    // Import protocols dynamically to avoid circular deps
    try {
      const { protocols } = require('@/lib/protocols')
      let bestMatch: any = null
      let bestScore = 0

      for (const p of protocols) {
        let score = 0
        const kwList = keywords[p.id] || keywords.healing || []
        for (const kw of kwList) {
          if (lower.includes(kw)) score += 10
        }
        // Fuzzy match against protocol text
        const searchText = `${p.name} ${p.description} ${p.condition}`.toLowerCase()
        for (const word of lower.split(/\s+/)) {
          if (word.length > 2 && searchText.includes(word)) score += 3
        }
        if (score > bestScore) {
          bestScore = score
          bestMatch = p
        }
      }

      return bestMatch
    } catch {
      return null
    }
  }, [])

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    setHasStarted(true)
    setIsExpanded(true)

    // Step 1: Instant match (< 10ms)
    const match = findInstantMatch(text)
    if (match) {
      setInstantMatch(match)
    }

    // Step 2: Send to AI for conversational depth (with pre-matched context)
    const enrichedText = match
      ? `${text}\n\n[SYSTEM: The best matching protocol is "${match.name}" (${match.id}). Present this protocol enthusiastically with its benefits and ask a personalization follow-up. Do NOT search — you already have the answer.]`
      : text
    sendMessage({ text: enrichedText })
  }, [input, isLoading, sendMessage, findInstantMatch])

  const handleSuggestion = useCallback((prompt: string) => {
    if (isLoading) return
    setHasStarted(true)
    setIsExpanded(true)

    const match = findInstantMatch(prompt)
    if (match) setInstantMatch(match)

    const enrichedText = match
      ? `${prompt}\n\n[SYSTEM: The best matching protocol is "${match.name}" (${match.id}). Present this protocol enthusiastically with its benefits and ask a personalization follow-up. Do NOT search — you already have the answer.]`
      : prompt
    sendMessage({ text: enrichedText })
  }, [isLoading, sendMessage, findInstantMatch])

  return (
    <motion.div
      layout
      className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] overflow-hidden"
    >
      {/* Header — always visible */}
      <div className="px-6 py-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white/80" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            What would you like to achieve?
          </h3>
        </div>
        <p className="text-xs text-gray-400 dark:text-white/30 mb-4">
          Tell me your goal and I&apos;ll recommend the perfect protocol — with the science behind it
        </p>

        {/* Input — only for subscribers */}
        {canUseChat ? (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-lg mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. I want to sleep better, reduce anxiety, improve focus..."
                className="flex-1 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-cyan-500/40 dark:focus:border-cyan-500/30 transition-colors"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-teal-700 disabled:opacity-30 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>

            {/* Goal suggestions — shown when not started */}
            {!hasStarted && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {GOAL_SUGGESTIONS.map(s => (
                  <button key={s.label} onClick={() => handleSuggestion(s.prompt)}
                    className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-xs text-gray-600 dark:text-white/40 hover:border-cyan-400/40 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-cyan-400 transition-all">
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Paywall — shown to free users */
          <div className="text-center pt-2">
            <span className="text-2xl mb-2 block">✨</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white/80 mb-1">AI Advisor is a Premium feature</p>
            <p className="text-xs text-gray-500 dark:text-white/35 mb-4">Get personalized frequency recommendations powered by AI</p>
            <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-sm font-medium">Upgrade to Premium</Link>
          </div>
        )}
      </div>

      {/* Chat conversation — expands when active (subscribers only) */}
      <AnimatePresence>
        {isExpanded && canUseChat && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div ref={scrollContainerRef} className="border-t border-gray-100 dark:border-white/[0.04] max-h-[600px] overflow-y-auto px-5 py-4 scroll-smooth">
              <div className="space-y-4 max-w-2xl mx-auto">
                {/* Instant match card — appears immediately, before AI responds */}
                {instantMatch && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                  >
                    <ProtocolRecommendationCard protocol={{
                      id: instantMatch.id,
                      name: instantMatch.name,
                      slug: instantMatch.slug,
                      icon: instantMatch.icon,
                      description: instantMatch.description,
                      condition: instantMatch.condition,
                      duration_days: instantMatch.duration_days || instantMatch.duration,
                      difficulty: instantMatch.difficulty,
                      expectedOutcomes: instantMatch.expectedOutcomes || [],
                      phases: (instantMatch.phases || []).map((p: any) => ({
                        name: p.name,
                        days: p.days,
                        description: p.description,
                        frequencyCount: p.sessions?.length || 0,
                      })),
                      science: instantMatch.science,
                      relevanceScore: 1,
                    }} isPrimary={true} />
                  </motion.div>
                )}

                {messages.map((message: UIMessage) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] ${
                      message.role === 'user'
                        ? 'rounded-2xl rounded-br-md px-4 py-2.5 bg-gray-900 dark:bg-white/10 text-white text-sm'
                        : 'text-sm text-gray-700 dark:text-white/70'
                    }`}>
                      {message.parts.map((part, idx) => {
                        if (part.type === 'text') {
                          const cleanText = part.text.replace(/\n*\[SYSTEM:[\s\S]*?\]/g, '').trim()
                          if (!cleanText) return null
                          return <div key={idx}>{renderSimpleMarkdown(cleanText)}</div>
                        }
                        if (isToolUIPart(part) && part.state === 'output-available') {
                          return <ProtocolToolResult key={idx} toolName={getToolName(part)} output={part.output} />
                        }
                        return null
                      })}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start"><StreamingDots /></div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Follow-up input */}
            <div className="border-t border-gray-100 dark:border-white/[0.04] p-3">
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a follow-up..."
                  className="flex-1 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-cyan-500/40 transition-colors"
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-teal-700 disabled:opacity-30 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
