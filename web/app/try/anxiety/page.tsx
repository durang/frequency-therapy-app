'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function EmailCaptureModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!show) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      localStorage.setItem('freqtherapy-email-captured', 'true')
      setSubmitted(true)
      setTimeout(onClose, 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#111118] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors text-xl leading-none">&times;</button>
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white/70 text-sm">Check your inbox!</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-light text-white mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Get your free frequency guide
            </h3>
            <p className="text-sm text-white/35 mb-6">We&apos;ll send you a personalized frequency recommendation</p>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 text-sm"
              />
              <button type="submit" className="px-6 py-3 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function useEmailPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const triggered = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('freqtherapy-email-captured') === 'true') return

    const timer = setTimeout(() => {
      if (!triggered.current) { triggered.current = true; setShowPopup(true) }
    }, 30000)

    const handleScroll = () => {
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrollPct >= 0.6 && !triggered.current) { triggered.current = true; setShowPopup(true) }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll) }
  }, [])

  return { showPopup, closePopup: () => setShowPopup(false) }
}

export default function TryAnxietyPage() {
  const { showPopup, closePopup } = useEmailPopup()
  const scienceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: { revert: () => void } | null = null
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const el = scienceRef.current
      if (!el) return

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.gsap-fade-in').forEach(elem => {
          gsap.fromTo(elem, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: elem, start: 'top 85%', toggleActions: 'play none none none' }
          })
        })
      }, el)
    })()
    return () => { ctx?.revert() }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <EmailCaptureModal show={showPopup} onClose={closePopup} />

      <nav className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /></svg>
          </div>
          <span className="text-sm font-semibold">FreqTherapy</span>
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.06] blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative">
          <p className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 font-medium mb-6">432 Hz · Natural Harmony</p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Quiet your mind.<br />
            <span className="text-white/40">In 5 minutes.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/35 max-w-md mx-auto mb-10 leading-relaxed">
            432 Hz has been shown to reduce cortisol and activate your parasympathetic nervous system.
            No meditation experience needed.
          </p>

          <Link
            href="/experience/2"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-gray-900 font-medium text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10"
          >
            Try It Now — Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>

          <p className="text-[11px] text-white/15 mt-5">
            No account needed · Headphones recommended · 5 min free preview
          </p>
        </motion.div>
      </div>

      {/* Social proof strip */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
        className="px-6 pb-8 text-center">
        <div className="flex items-center justify-center gap-6 text-[11px] text-white/15 flex-wrap">
          <span>Research: Akimoto et al., 2018</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>23 frequencies available</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>7-day free trial</span>
        </div>
      </motion.div>

      {/* Science section */}
      <div ref={scienceRef} className="px-6 pb-20">
        {/* How it works */}
        <div className="gsap-fade-in max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl sm:text-3xl font-light text-center mb-12" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="gsap-fade-in bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <div className="text-3xl mb-4">🎧</div>
              <h3 className="text-base font-medium mb-2">Put on headphones</h3>
              <p className="text-sm text-white/35 leading-relaxed">Sound enters both ears, creating a binaural difference your brain naturally follows</p>
            </div>
            <div className="gsap-fade-in bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-base font-medium mb-2">Brain entrainment</h3>
              <p className="text-sm text-white/35 leading-relaxed">Your neural oscillations synchronize to the 432 Hz frequency within minutes</p>
            </div>
            <div className="gsap-fade-in bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <div className="text-3xl mb-4">😌</div>
              <h3 className="text-base font-medium mb-2">Nervous system responds</h3>
              <p className="text-sm text-white/35 leading-relaxed">Parasympathetic activation reduces cortisol, heart rate slows, muscles relax</p>
            </div>
          </div>
        </div>

        {/* Research citation */}
        <div className="gsap-fade-in max-w-2xl mx-auto mb-20">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              &ldquo;A peer-reviewed study found that 528 Hz music reduced stress-related cortisol and increased oxytocin after just 5 minutes of listening.&rdquo;
            </p>
            <p className="text-xs text-white/25">
              Akimoto K, Hu A, Yamaguchi T, Kobayashi H (2018).{' '}
              <a href="https://doi.org/10.4236/health.2018.1012126" target="_blank" rel="noopener noreferrer" className="text-cyan-400/50 hover:text-cyan-400/80 underline">
                doi:10.4236/health.2018.1012126
              </a>
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="gsap-fade-in text-center">
          <Link
            href="/experience/2"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-gray-900 font-medium text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10"
          >
            Try It Now — Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-6 pb-6 text-center">
        <p className="text-[9px] text-white/10 max-w-md mx-auto">
          FreqTherapy is a wellness tool, not a medical device. Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider.
        </p>
      </div>
    </div>
  )
}
