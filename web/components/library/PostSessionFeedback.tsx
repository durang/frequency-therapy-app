/**
 * PostSessionFeedback — Minimal feedback modal after a session
 * Two taps and done: emoji rating + optional tags.
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessionHistory, SessionFeedback } from '@/lib/sessionHistory'

const RATING_EMOJIS = [
  { value: 1 as const, emoji: '😕', label: 'Not helpful' },
  { value: 2 as const, emoji: '😐', label: 'A little' },
  { value: 3 as const, emoji: '🙂', label: 'Good' },
  { value: 4 as const, emoji: '😊', label: 'Great' },
  { value: 5 as const, emoji: '😍', label: 'Amazing' },
]

const HELPED_WITH_TAGS = [
  { label: 'Sleep', value: 'sleep', emoji: '😴' },
  { label: 'Anxiety', value: 'anxiety', emoji: '🧘' },
  { label: 'Focus', value: 'focus', emoji: '🧠' },
  { label: 'Pain', value: 'pain', emoji: '💆' },
  { label: 'Energy', value: 'energy', emoji: '⚡' },
  { label: 'Mood', value: 'mood', emoji: '🌈' },
]

export function PostSessionFeedback() {
  const { feedbackPending, submitFeedback, dismissFeedback } = useSessionHistory()
  const [selectedRating, setSelectedRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [step, setStep] = useState<'rating' | 'tags'>('rating')

  if (!feedbackPending) return null

  const handleRating = (rating: 1 | 2 | 3 | 4 | 5) => {
    setSelectedRating(rating)
    setStep('tags')
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = () => {
    if (!selectedRating) return
    const feedback: SessionFeedback = {
      rating: selectedRating,
      helpedWith: selectedTags,
      wouldRepeat: selectedRating >= 3,
      timestamp: new Date().toISOString(),
    }
    submitFeedback(feedbackPending.id, feedback)
    setSelectedRating(null)
    setSelectedTags([])
    setStep('rating')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[340px] max-w-[calc(100vw-2rem)]"
      >
        <div className="relative rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#13131f] shadow-2xl shadow-black/10 dark:shadow-black/30 p-5">
          <button
            onClick={() => { dismissFeedback(); setSelectedRating(null); setSelectedTags([]); setStep('rating') }}
            className="absolute top-3 right-3 text-gray-300 dark:text-white/20 hover:text-gray-500 dark:hover:text-white/40 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-white/50 mb-3">
            How was your <span className="font-medium text-gray-900 dark:text-white/80">{feedbackPending.frequencyName}</span> session?
          </p>

          <AnimatePresence mode="wait">
            {step === 'rating' ? (
              <motion.div key="rating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center gap-3">
                {RATING_EMOJIS.map(r => (
                  <button key={r.value} onClick={() => handleRating(r.value)} className="flex flex-col items-center gap-1 group">
                    <span className="text-2xl transition-transform group-hover:scale-125">{r.emoji}</span>
                    <span className="text-[10px] text-gray-400 dark:text-white/25 group-hover:text-gray-600 dark:group-hover:text-white/50 transition-colors">{r.label}</span>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div key="tags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-xs text-gray-400 dark:text-white/30 text-center mb-2.5">
                  What did it help with? <span className="text-gray-300 dark:text-white/15">(optional)</span>
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                  {HELPED_WITH_TAGS.map(tag => (
                    <button key={tag.value} onClick={() => toggleTag(tag.value)}
                      className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                        selectedTags.includes(tag.value)
                          ? 'bg-cyan-100 dark:bg-cyan-400/15 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-400/30'
                          : 'bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-white/35 border border-gray-100 dark:border-white/[0.06] hover:border-gray-200 dark:hover:border-white/10'
                      }`}>
                      {tag.emoji} {tag.label}
                    </button>
                  ))}
                </div>
                <button onClick={handleSubmit}
                  className="w-full py-2 rounded-xl bg-gray-900 dark:bg-white/10 text-white text-xs font-medium hover:bg-gray-700 dark:hover:bg-white/15 transition-all">
                  Done ✓
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
