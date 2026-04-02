'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

function EmailCaptureModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  if (!show) return null
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      localStorage.setItem('freqtherapy-email-captured', 'true')
      localStorage.setItem('freqtherapy-popup-shown', 'true')
      setSubmitted(true)
      setTimeout(onClose, 2000)
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#111118] border border-amber-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-amber-500/5">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors text-2xl leading-none">&times;</button>
        {submitted ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✓</div>
            <p className="text-white/60 text-sm">Check your inbox!</p>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
              <span className="text-amber-400 text-lg">⚡</span>
            </div>
            <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Before you go — get your free frequency guide
            </h3>
            <p className="text-sm text-white/35 mb-6">Personalized frequency recommendations for peak focus</p>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 text-sm" />
              <button type="submit" className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-400 transition-colors whitespace-nowrap">Send</button>
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
    if (localStorage.getItem('freqtherapy-popup-shown') === 'true') return
    if (localStorage.getItem('freqtherapy-email-captured') === 'true') return
    const timer = setTimeout(() => {
      if (!triggered.current) { triggered.current = true; setShowPopup(true) }
    }, 45000)
    const handleScroll = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (pct >= 0.7 && !triggered.current) { triggered.current = true; setShowPopup(true) }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll) }
  }, [])
  return { showPopup, closePopup: () => { setShowPopup(false); localStorage.setItem('freqtherapy-popup-shown', 'true') } }
}

export default function TryFocusPage() {
  const { showPopup, closePopup } = useEmailPopup()
  const pageRef = useRef<HTMLDivElement>(null)
  const [emailInline, setEmailInline] = useState('')
  const [inlineSubmitted, setInlineSubmitted] = useState(false)
  const [showEmailSection, setShowEmailSection] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('freqtherapy-email-captured') === 'true') {
      setShowEmailSection(false)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const g = await import('gsap')
        const s = await import('gsap/ScrollTrigger')
        const gsap = g.default || g.gsap
        const ST = s.ScrollTrigger || s.default
        if (!gsap || !ST) return
        gsap.registerPlugin(ST)
        const el = pageRef.current
        if (!el) return

        gsap.fromTo('.hero-content', { opacity: 0, y: 30, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' })

        gsap.utils.toArray<HTMLElement>('.pain-card').forEach((card, i) => {
          gsap.fromTo(card, { opacity: 0, x: -30 }, {
            opacity: 1, x: 0, duration: 0.7, delay: i * 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%' }
          })
        })

        gsap.utils.toArray<HTMLElement>('.step-item').forEach((item, i) => {
          gsap.fromTo(item, { opacity: 0, y: 25 }, {
            opacity: 1, y: 0, duration: 0.7, delay: i * 0.2, ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 85%' }
          })
        })

        gsap.fromTo('.science-card', { opacity: 0, scale: 0.96 }, {
          opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: '.science-card', start: 'top 80%' }
        })

        gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item, i) => {
          gsap.fromTo(item, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.6, delay: i * 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 85%' }
          })
        })

        gsap.fromTo('.final-cta', { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: '.final-cta', start: 'top 85%' }
        })

        gsap.to('.cta-pulse', { scale: 1.02, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })

        gsap.utils.toArray<HTMLElement>('.section-heading').forEach(h => {
          gsap.fromTo(h, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: h, start: 'top 85%' }
          })
        })
      } catch {}
    }
    init()
  }, [])

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailInline) {
      localStorage.setItem('freqtherapy-email-captured', 'true')
      setInlineSubmitted(true)
      setTimeout(() => setShowEmailSection(false), 2000)
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0f] text-white">
      <EmailCaptureModal show={showPopup} onClose={closePopup} />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: NOISE_BG }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/[0.06] blur-[120px] pointer-events-none" />

        <div className="hero-content relative max-w-2xl">
          <p className="text-[11px] tracking-[0.3em] uppercase text-amber-400/60 font-medium mb-8">40 Hz · Gamma Entrainment</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight mb-6 leading-[1.1]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Sharpen your focus.<br /><span className="text-white/40">Without caffeine.</span>
          </h1>
          <p className="text-base sm:text-lg text-white/35 max-w-md mx-auto mb-10 leading-relaxed">
            40 Hz gamma waves synchronize both brain hemispheres, enhancing cognitive binding and sustained attention.
          </p>
          <Link href="/experience/3"
            className="cta-pulse group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-gray-900 font-medium text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10">
            Try It Now — Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <p className="text-[11px] text-white/20 mt-5">No account · Headphones recommended · Free</p>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-14" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          You&apos;ve tried everything.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { emoji: '🧠', text: 'The average attention span has dropped to 8 seconds' },
            { emoji: '☕', text: 'Caffeine creates a crash cycle that worsens afternoon focus' },
            { emoji: '📱', text: 'The average person checks their phone 96 times per day' },
          ].map((card, i) => (
            <div key={i} className="pain-card bg-white/[0.02] border-l-2 border-amber-500/30 rounded-xl p-6">
              <span className="text-2xl block mb-3">{card.emoji}</span>
              <p className="text-sm text-white/50 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-14" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Three steps. Five minutes.
        </h2>
        <div className="relative">
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-transparent" />
          <div className="space-y-12 sm:space-y-16">
            {[
              { num: '01', icon: '🎧', title: 'Put on headphones', desc: '40 Hz gamma waves synchronize both brain hemispheres simultaneously' },
              { num: '02', icon: '⚡', title: 'Gamma entrainment', desc: 'MIT research published in Nature shows 40 Hz stimulation enhances neural synchrony and cognitive binding' },
              { num: '03', icon: '🎯', title: 'Flow state', desc: 'Attention sharpens. Distractions fade. Working memory expands. You enter the zone.' },
            ].map((step, i) => (
              <div key={i} className="step-item flex items-start gap-6 sm:gap-8">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-400 text-xs font-mono font-bold">{step.num}</span>
                </div>
                <div>
                  <div className="text-xl mb-1">{step.icon}</div>
                  <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed max-w-md">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Science ── */}
      <section className="px-6 py-24">
        <div className="science-card max-w-3xl mx-auto bg-white/[0.02] border border-amber-500/15 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-500/[0.04] blur-[80px] pointer-events-none" />
          <div className="relative">
            <p className="text-lg sm:text-xl text-white/60 leading-relaxed italic mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              &ldquo;40 Hz sensory stimulation entrains gamma oscillations and reduces amyloid pathology.&rdquo;
            </p>
            <p className="text-sm text-white/30 mb-4">— Iaccarino et al., Nature, 2016</p>
            <a href="https://doi.org/10.1038/nature20587" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-amber-400/50 hover:text-amber-400/80 transition-colors">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">✓</span>
              Published in Nature · View Study
            </a>
          </div>
        </div>
      </section>

      {/* ── What You'll Experience ── */}
      <section className="px-6 py-24 max-w-3xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-14" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Your first session
        </h2>
        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-500/30 via-amber-500/15 to-transparent" />
          <div className="space-y-10">
            {[
              { time: '0:00', title: 'Press play. Start working.', desc: 'No ritual needed. Just put on headphones and begin.' },
              { time: '3:00', title: 'Gamma synchronization begins.', desc: 'Both hemispheres start firing in sync.' },
              { time: '8:00', title: 'Distractions stop registering.', desc: 'The urge to check your phone fades.' },
              { time: '15:00+', title: 'Flow state. Peak cognitive performance.', desc: 'Deep work becomes effortless. Time compresses.' },
            ].map((item, i) => (
              <div key={i} className="timeline-item flex items-start gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <span className="text-[10px] text-amber-400 font-mono">{item.time}</span>
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-white/35 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-24">
        <div className="final-cta max-w-3xl mx-auto bg-white/[0.02] border border-white/[0.06] rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: NOISE_BG }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/[0.04] blur-[100px] pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-4xl font-light mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Your brain already responds to 40 Hz.
            </h2>
            <p className="text-white/35 mb-8 text-sm sm:text-base">You&apos;ve read the science. Now feel it.</p>
            <Link href="/experience/3"
              className="cta-pulse group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-gray-900 font-medium text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10">
              Try It Now — Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <p className="text-[11px] text-white/20 mt-5">No account needed · 7-day free trial for full access</p>
          </div>
        </div>
      </section>

      {/* ── Email Capture ── */}
      {showEmailSection && (
        <section className="px-6 py-16 max-w-md mx-auto text-center">
          {inlineSubmitted ? (
            <p className="text-white/40 text-sm">✓ Check your inbox</p>
          ) : (
            <>
              <p className="text-white/40 text-sm mb-4">Not ready yet? Get the free frequency guide.</p>
              <form onSubmit={handleInlineSubmit} className="flex gap-3">
                <input type="email" value={emailInline} onChange={e => setEmailInline(e.target.value)} placeholder="your@email.com" required
                  className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 text-sm" />
                <button type="submit" className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-400 transition-colors">Send</button>
              </form>
              <p className="text-[10px] text-white/15 mt-3">We&apos;ll send personalized frequency recommendations based on your goal</p>
            </>
          )}
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="px-6 py-10 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /></svg>
            </div>
            <span className="text-xs text-white/30">FreqTherapy</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-white/20">
            <Link href="/frequencies" className="hover:text-white/40 transition-colors">All Frequencies</Link>
            <Link href="/pricing" className="hover:text-white/40 transition-colors">Pricing</Link>
            <Link href="/auth/signin" className="hover:text-white/40 transition-colors">Sign In</Link>
          </div>
          <p className="text-[9px] text-white/10">Not a medical device</p>
        </div>
      </footer>
    </div>
  )
}
