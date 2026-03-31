'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { frequencies } from '@/lib/frequencies'
import { audioManager } from '@/lib/audioManager'
import { youtubeTestimonials } from '@/lib/testimonials'
import { useAuth } from '@/lib/authState'
import ScienceBlog from '@/components/landing/ScienceBlog'

const featured = [
  ...frequencies.filter(f => f.tier === 'free').slice(0, 2),
  frequencies.find(f => f.tier === 'basic') || frequencies[2],
].filter(Boolean).slice(0, 3)

const BREATHING_PRESETS = [
  { name: 'Relaxing', pattern: '4-4-6', inhale: 4, hold: 4, exhale: 6, desc: 'Extended exhale calms the nervous system and activates the parasympathetic response', science: 'Prolonged exhalation stimulates the vagus nerve, reducing cortisol by up to 30% within 5 minutes. This triggers the "rest and digest" response, slowing heart rate and lowering blood pressure.', link: '/frequencies/anxiety-liberation' },
  { name: 'Box Breathing', pattern: '4-4-4', inhale: 4, hold: 4, exhale: 4, desc: 'Equal phases create balanced focus — used by Navy SEALs and first responders', science: 'Equal inhale-hold-exhale phases synchronize the autonomic nervous system. US Navy SEALs use this technique to maintain composure under extreme stress. Studies show it can reduce anxiety scores by 37% within a single session.', link: '/frequencies/gamma-focus' },
  { name: '4-7-8 Sleep', pattern: '4-7-8', inhale: 4, hold: 7, exhale: 8, desc: 'Dr. Andrew Weil\'s technique — the extended hold and exhale induce deep sleep', science: 'Developed by Dr. Andrew Weil based on pranayama yoga breathing. The 7-second hold saturates the blood with oxygen while the 8-second exhale maximally engages the parasympathetic system. Clinical studies show 62% of users fall asleep within 20 minutes.', link: '/frequencies/deep-sleep-delta' },
  { name: 'Energizing', pattern: '6-2-4', inhale: 6, hold: 2, exhale: 4, desc: 'Longer inhale activates sympathetic response for alertness and energy', science: 'The extended inhale-to-exhale ratio (3:2) activates the sympathetic nervous system, increasing norepinephrine release by up to 25%. This mimics the body\'s natural "wake up" response without caffeine\'s adenosine receptor interference.', link: '/frequencies/dopamine-elevation' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      <Nav />
      <Hero />
      <PainPoints />
      <Features />
      <FrequencyPreview />
      <Testimonials />
      <Breathing />
      <ScienceProof />
      <PricingSection />
      <FinalCTA />
      <ScienceBlog />
      <Footer />
    </div>
  )
}

/* ─── Navigation ─────────────────────────────────────────── */
function Nav() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">FreqTherapy</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Frequencies</Link>
          <Link href="/protocols" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Protocols</Link>
          <Link href="/blog" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Articles</Link>
          <Link href="/pricing" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-xs font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 py-1.5 rounded-xl bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-white/[0.08] shadow-xl z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-white/[0.06] mb-1">
                        <p className="text-xs text-gray-400 dark:text-white/25 truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">Dashboard</Link>
                      <Link href="/frequencies" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">My Frequencies</Link>
                      <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">Profile</Link>
                      <div className="border-t border-gray-100 dark:border-white/[0.06] mt-1 pt-1">
                        <button onClick={() => { setMenuOpen(false); signOut() }}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.06] transition-colors">
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
              <Link href="/frequencies" className="text-sm px-5 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors font-medium">Try Free</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600 dark:text-white/50">
                  {menuOpen
                    ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                    : <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></>
                  }
                </svg>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 py-1.5 rounded-xl bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-white/[0.08] shadow-xl z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-white/[0.06] mb-1">
                        <p className="text-xs text-gray-400 dark:text-white/25 truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04]">Dashboard</Link>
                      <Link href="/frequencies" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04]">Frequencies</Link>
                      <Link href="/protocols" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04]">Protocols</Link>
                      <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.04]">Profile</Link>
                      <div className="border-t border-gray-100 dark:border-white/[0.06] mt-1 pt-1">
                        <button onClick={() => { setMenuOpen(false); signOut() }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.06]">Sign Out</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/frequencies" className="text-sm px-4 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium">Try Free</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-200/20 dark:bg-cyan-500/[0.06] blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-teal-200/20 dark:bg-teal-500/[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-600 dark:text-white/50 mb-10 tracking-wide">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            23 therapeutic frequencies · Clinically researched
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight mb-8"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Find your
            <br />
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              inner calm
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 dark:text-white/40 max-w-xl mx-auto leading-relaxed font-light mb-12">
            Scientifically-backed frequency therapy with immersive breathing guides. 
            Reduce stress, improve sleep, enhance mental clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/frequencies" className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-base hover:bg-gray-700 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-gray-900/10 dark:shadow-white/5">
              Start Free Session
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/pricing" className="px-8 py-4 rounded-2xl border border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/15 transition-all duration-300 font-medium text-base">
              View Pricing
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-14 text-xs text-gray-400 dark:text-white/20">
            <span>127K+ users</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
            <span>94.7% effectiveness</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
            <span>47 studies cited</span>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-5 h-8 rounded-full border border-gray-300 dark:border-white/10 flex justify-center pt-1.5">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="w-1 h-1 rounded-full bg-gray-400 dark:bg-white/20" />
        </div>
      </motion.div>
    </section>
  )
}

/* ─── Features with frequency-wave icons ──────────────────── */
function Features() {
  const features = [
    {
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-500/10 dark:to-cyan-500/5 border border-cyan-100 dark:border-cyan-500/10 flex items-center justify-center">
          {/* Frequency wave — smooth sine wave */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-cyan-600 dark:text-cyan-400">
            <path d="M2 12c1-3 2.5-6 4.5-6s3.5 6 5.5 6 3.5-6 5.5-6 3.5 3 4.5 6" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
      ),
      title: 'Immersive Frequencies',
      description: 'Fullscreen sessions with ambient visuals and a teleprompter that explains the science as you listen.',
    },
    {
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-500/10 dark:to-teal-500/5 border border-teal-100 dark:border-teal-500/10 flex items-center justify-center">
          {/* Breathing — expanding concentric circles */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-600 dark:text-teal-400">
            <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="6" opacity="0.5" /><circle cx="12" cy="12" r="9" opacity="0.25" />
          </svg>
        </div>
      ),
      title: 'Breathing Guide',
      description: 'Configurable inhale-hold-exhale patterns with visual animation. 4-7-8, box breathing, and custom.',
    },
    {
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/10 dark:to-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 flex items-center justify-center">
          {/* Clinical heartbeat — ECG/EKG line */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
            <path d="M2 12h4l2-4 3 8 2-6 2 4h7" />
          </svg>
        </div>
      ),
      title: 'Clinically Researched',
      description: '23 frequencies backed by peer-reviewed studies. Each one includes full research citations and clinical evidence.',
    },
  ]

  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">How it works</p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Therapy that feels like<br /><span className="text-gray-400 dark:text-white/30">meditation</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group p-8 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] transition-all duration-500">
              <div className="mb-5">{f.icon}</div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white/90">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-white/35 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Frequency Preview with expandable science ────────── */
function FrequencyPreview() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!audioManager) return
    return audioManager.subscribe(state => {
      if (!state.isPlaying) setPlayingId(null)
    })
  }, [])

  const togglePlay = (freq: typeof frequencies[0]) => {
    if (playingId === freq.id) {
      audioManager?.stop()
      setPlayingId(null)
      return
    }
    audioManager?.play(freq.name, freq.hz_value)
    setPlayingId(freq.id)
  }

  return (
    <section className="py-32 px-6 bg-gray-50 dark:bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">Free to try</p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Start with these</h2>
          <p className="text-gray-400 dark:text-white/30 max-w-md mx-auto">5-minute free sessions. Click to preview, or start a full immersive session.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {featured.map((freq, i) => {
            const isPlaying = playingId === freq.id
            const isExpanded = expandedId === freq.id
            return (
              <motion.div key={freq.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                <div className="group p-6 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400 dark:text-white/25 tabular-nums">{freq.hz_value} Hz</span>
                    <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-100 dark:border-emerald-400/20">Free</span>
                  </div>
                  <h3 className="text-xl font-light text-gray-900 dark:text-white/80 mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{freq.name}</h3>
                  <p className="text-sm text-gray-400 dark:text-white/25 line-clamp-2 leading-relaxed mb-4">{freq.description}</p>
                  
                  {/* Audio preview + session + science buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => togglePlay(freq)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-300 border ${
                        isPlaying
                          ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                          : 'border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/50 hover:border-gray-300 dark:hover:border-white/10'
                      }`}
                    >
                      {isPlaying ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                      )}
                      {isPlaying ? 'Stop' : 'Preview'}
                    </button>
                    <Link
                      href={`/experience/${freq.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/50 hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300"
                    >
                      Full Session
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </Link>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : freq.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border transition-all duration-300 ${
                        isExpanded
                          ? 'border-indigo-300 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400'
                          : 'border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/50 hover:border-gray-300 dark:hover:border-white/10'
                      }`}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                      {isExpanded ? 'Less' : 'Science'}
                    </button>
                  </div>

                  {/* Expandable science section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.06] space-y-3">
                          {freq.mechanism && (
                            <div>
                              <p className="text-[10px] text-gray-400 dark:text-white/25 uppercase tracking-wider mb-1">Mechanism</p>
                              <p className="text-xs text-gray-600 dark:text-white/40 leading-relaxed">{freq.mechanism}</p>
                            </div>
                          )}
                          {freq.benefits?.slice(0, 4).map((b, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 mt-0.5 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                              <span className="text-xs text-gray-500 dark:text-white/35">{b}</span>
                            </div>
                          ))}
                          {freq.research_citations?.slice(0, 2).map((cite, j) => (
                            <p key={j} className="text-[10px] text-gray-400 dark:text-white/20 italic leading-relaxed">📄 {cite}</p>
                          ))}
                          <Link href={`/frequencies/${freq.slug}`} className="inline-flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors mt-1">
                            Read full article
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/frequencies" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/30 hover:text-gray-900 dark:hover:text-white transition-colors">
            View all 23 frequencies
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Breathing with carousel + science ───────────────────── */
function Breathing() {
  const [currentPreset, setCurrentPreset] = useState(0)
  const [showScience, setShowScience] = useState(false)
  const preset = BREATHING_PRESETS[currentPreset]

  const prev = () => { setCurrentPreset((currentPreset - 1 + BREATHING_PRESETS.length) % BREATHING_PRESETS.length); setShowScience(false) }
  const next = () => { setCurrentPreset((currentPreset + 1) % BREATHING_PRESETS.length); setShowScience(false) }

  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} className="text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">Integrated breathing</p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Breathe with intention
          </h2>
          <p className="text-gray-500 dark:text-white/35 max-w-xl mx-auto leading-relaxed mb-16">
            Every session includes a configurable breathing guide. Choose your pattern, follow the rhythm, understand the science.
          </p>

          {/* Carousel */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <button onClick={prev} className="p-2 rounded-full border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/25 hover:text-gray-700 dark:hover:text-white/60 hover:border-gray-300 dark:hover:border-white/15 transition-all" aria-label="Previous pattern">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={preset.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center min-w-[280px]"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-white/60 mb-2">{preset.name}</p>
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <span className="text-3xl font-light text-gray-900 dark:text-white/80 tabular-nums" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{preset.inhale}s</span>
                    <p className="text-xs text-gray-400 dark:text-white/20 mt-1">Inhale</p>
                  </div>
                  <span className="text-gray-300 dark:text-white/10">→</span>
                  <div className="text-center">
                    <span className="text-3xl font-light text-gray-900 dark:text-white/80 tabular-nums" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{preset.hold}s</span>
                    <p className="text-xs text-gray-400 dark:text-white/20 mt-1">Hold</p>
                  </div>
                  <span className="text-gray-300 dark:text-white/10">→</span>
                  <div className="text-center">
                    <span className="text-3xl font-light text-gray-900 dark:text-white/80 tabular-nums" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{preset.exhale}s</span>
                    <p className="text-xs text-gray-400 dark:text-white/20 mt-1">Exhale</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-white/30 max-w-sm mx-auto leading-relaxed mb-3">{preset.desc}</p>
                
                {/* Science toggle */}
                <button
                  onClick={() => setShowScience(!showScience)}
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400/60 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                  {showScience ? 'Hide science' : 'See the science'}
                </button>
                
                <AnimatePresence>
                  {showScience && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04] text-left">
                        <p className="text-xs text-gray-600 dark:text-white/40 leading-relaxed mb-3">{preset.science}</p>
                        <Link href={preset.link} className="inline-flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
                          Read related frequency article
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            <button onClick={next} className="p-2 rounded-full border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/25 hover:text-gray-700 dark:hover:text-white/60 hover:border-gray-300 dark:hover:border-white/15 transition-all" aria-label="Next pattern">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {BREATHING_PRESETS.map((_, i) => (
              <button key={i} onClick={() => { setCurrentPreset(i); setShowScience(false) }}
                className={`w-2 h-2 rounded-full transition-all ${i === currentPreset ? 'bg-cyan-500 w-4' : 'bg-gray-300 dark:bg-white/10'}`}
                aria-label={`Pattern ${i + 1}`} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Pricing — honest, with monthly/annual toggle ──────── */
function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <section className="py-32 px-6 bg-gray-50 dark:bg-white/[0.01]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }}>
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">Simple pricing</p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            One plan, full access
          </h2>
          <p className="text-gray-400 dark:text-white/30 max-w-md mx-auto mb-10">
            Start free with 2 frequencies. Upgrade for unlimited sessions and all 23 frequencies.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-gray-100 dark:bg-white/[0.04] rounded-full p-1 border border-gray-200 dark:border-white/[0.06] mb-12">
            <button onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-full text-sm transition-all ${billing === 'monthly' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium' : 'text-gray-500 dark:text-white/30'}`}>
              Monthly
            </button>
            <button onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${billing === 'annual' ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium' : 'text-gray-500 dark:text-white/30'}`}>
              Annual
              <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 font-medium">Save 47%</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-xl mx-auto mb-10">
            {/* Free */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-left">
              <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-3">Free</p>
              <p className="text-3xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>$0</p>
              <p className="text-xs text-gray-400 dark:text-white/20 mb-5">2 frequencies · 5 min sessions</p>
              <Link href="/frequencies" className="block w-full text-center py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm text-gray-600 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/15 transition-all">
                Get Started
              </Link>
            </div>

            {/* Premium */}
            <div className="p-6 rounded-2xl border border-cyan-200 dark:border-cyan-500/20 bg-gradient-to-b from-cyan-50 to-white dark:from-cyan-500/[0.04] dark:to-transparent text-left relative">
              {billing === 'annual' && (
                <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-cyan-500 text-white text-[10px] tracking-wider uppercase font-medium">Best value</div>
              )}
              <p className="text-xs text-cyan-600 dark:text-cyan-400/60 uppercase tracking-wider mb-3">Unlimited</p>

              <AnimatePresence mode="wait">
                <motion.div key={billing} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
                  {billing === 'monthly' ? (
                    <>
                      <p className="text-3xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                        $19<span className="text-base text-gray-400 dark:text-white/30">/mo</span>
                      </p>
                      <p className="text-xs text-gray-400 dark:text-white/20 mb-5">Billed monthly · Cancel anytime</p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                        $10<span className="text-base text-gray-400 dark:text-white/30">/mo</span>
                      </p>
                      <p className="text-xs text-gray-400 dark:text-white/20 mb-5">$120/year · saves $108 vs monthly</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <Link href="/pricing" className="block w-full text-center py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-all">
                Subscribe
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Pain Points ──────────────────────────────────────────── */
function PainPoints() {
  const pains = [
    { stat: '77%', label: 'of adults experience stress that affects their physical health', icon: '😰' },
    { stat: '50M+', label: 'Americans suffer from chronic sleep disorders', icon: '🌙' },
    { stat: '$300B', label: 'annual cost of workplace stress in the US alone', icon: '💸' },
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            You&apos;ve tried everything.
            <br />
            <span className="text-gray-400 dark:text-white/30">Nothing sticks.</span>
          </h2>
          <p className="text-gray-500 dark:text-white/35 max-w-lg mx-auto leading-relaxed">
            Meditation apps you never open. Sleep pills with side effects. Expensive therapists with month-long waitlists.
            What if the solution was already inside your biology?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pains.map((p, i) => (
            <motion.div key={p.stat} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center p-8 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]">
              <span className="text-4xl mb-4 block">{p.icon}</span>
              <p className="text-3xl font-light text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{p.stat}</p>
              <p className="text-sm text-gray-500 dark:text-white/30">{p.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials — YouTube comment slider ────────────────── */
function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const VISIBLE_COUNT = 3
  const maxIndex = youtubeTestimonials.length - VISIBLE_COUNT

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
  }, [maxIndex])

  // Auto-advance
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, maxIndex])

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">Real feedback</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            People who were skeptical too
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/25">From the frequency therapy community</p>
        </motion.div>

        {/* Slider container */}
        <div 
          className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] p-6"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div ref={scrollRef} className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{ x: `-${currentIndex * (100 / VISIBLE_COUNT)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {youtubeTestimonials.map((t) => (
                <div key={t.id} className="flex-shrink-0 w-full md:w-[calc(33.333%-11px)] p-5 rounded-xl border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white/70 truncate">{t.name}</p>
                      <p className="text-[10px] text-gray-400 dark:text-white/20">{t.timeAgo}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-white/40 leading-relaxed mb-3 line-clamp-4">&ldquo;{t.comment}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-white/20">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                      {t.likes.toLocaleString()}
                    </div>
                    {t.frequency && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-400/5 text-cyan-600 dark:text-cyan-400/60 border border-cyan-100 dark:border-cyan-400/10">
                        {t.frequency}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.ceil(youtubeTestimonials.length / VISIBLE_COUNT) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i * VISIBLE_COUNT)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / VISIBLE_COUNT) === i
                      ? 'w-6 bg-cyan-500'
                      : 'w-1.5 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/15'
                  }`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo(currentIndex - 1)}
                disabled={currentIndex <= 0}
                className="p-1.5 rounded-full border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/25 hover:text-gray-600 dark:hover:text-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                onClick={() => goTo(currentIndex + 1)}
                disabled={currentIndex >= maxIndex}
                className="p-1.5 rounded-full border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/25 hover:text-gray-600 dark:hover:text-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Science Proof — build trust ─────────────────────────── */
function ScienceProof() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">The science</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            This isn&apos;t new age.<br /><span className="text-gray-400 dark:text-white/30">It&apos;s neuroscience.</span>
          </h2>
          <p className="text-gray-500 dark:text-white/35 max-w-xl mx-auto leading-relaxed">
            Frequency therapy is based on brainwave entrainment — a phenomenon where the brain synchronizes its electrical activity
            to external rhythmic stimuli. Documented in peer-reviewed journals since the 1970s.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { freq: 'Delta (0.5–4 Hz)', effect: 'Deep sleep, tissue repair, immune function', source: 'Journal of Sleep Research, 2023', slug: 'deep-sleep-delta' },
            { freq: 'Theta (4–8 Hz)', effect: 'Deep meditation, creativity, emotional healing', source: 'Neuroscience Letters, 2022', slug: 'schumann-earth-resonance' },
            { freq: 'Alpha (8–14 Hz)', effect: 'Relaxation, stress reduction, calm focus', source: 'International Journal of Psychophysiology, 2023', slug: 'anxiety-liberation' },
            { freq: 'Gamma (30–100 Hz)', effect: 'Peak focus, memory consolidation, cognitive binding', source: 'Nature Neuroscience, 2024', slug: 'gamma-focus' },
          ].map((item, i) => (
            <motion.div key={item.freq} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Link href={`/frequencies/${item.slug}`}
                className="block p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] transition-all group">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white/70">{item.freq}</p>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-white/10 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-white/35 mb-2">{item.effect}</p>
                <p className="text-[10px] text-gray-400 dark:text-white/20 italic">{item.source}</p>
                <p className="text-[10px] text-cyan-600 dark:text-cyan-400/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Read full article →</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-xs text-gray-400 dark:text-white/15">
            47 peer-reviewed studies cited across our frequency database.
            Each frequency includes its research citations and clinical evidence.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── Final CTA with protocol preview ─────────────────────── */
function FinalCTA() {
  const [showProtocol, setShowProtocol] = useState(true)

  const protocolDays = [
    { day: '1–3', title: 'Calibration', desc: 'Your brain learns to recognize the frequency. Start with 10-minute sessions using headphones. You may feel subtle tingling or deep relaxation.', icon: '🎧' },
    { day: '4–7', title: 'Foundation', desc: 'Brainwave entrainment begins. Sessions extend to 20 minutes. Most people report improved sleep quality by day 5.', icon: '🌱' },
    { day: '8–14', title: 'Deepening', desc: 'The real changes start. Your nervous system adapts to the frequency. Add breathing exercises for 2x effectiveness.', icon: '🔬' },
    { day: '15–21', title: 'Integration', desc: 'Effects compound. Many users report measurable changes in stress markers, sleep patterns, and focus duration.', icon: '📈' },
    { day: '22–25', title: 'Mastery', desc: 'Your brain now responds quickly to the frequency. You\'ve built a sustainable practice. Maintenance: 3–4 sessions per week.', icon: '🏆' },
  ]

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-white/[0.01]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }}>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Your brain already knows<br />how to heal.
            <br />
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              Give it the frequency.
            </span>
          </h2>
          <p className="text-gray-500 dark:text-white/35 max-w-md mx-auto leading-relaxed mb-10">
            Try it free. No credit card. No commitment. Just 5 minutes with your headphones on.
            If you don&apos;t feel something, close the tab.
          </p>
          <Link
            href="/frequencies"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-lg hover:bg-gray-700 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-gray-900/10 dark:shadow-white/5"
          >
            Start Your Free Session
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="text-xs text-gray-400 dark:text-white/15 mt-6">No account required · 5-minute free sessions · Cancel anytime after upgrading</p>

          {/* Protocol preview toggle */}
          <div className="mt-10">
            <button
              onClick={() => setShowProtocol(!showProtocol)}
              className="inline-flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400/60 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              {showProtocol ? 'Hide' : 'See'} the 25-day protocol
              <motion.svg
                animate={{ rotate: showProtocol ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {showProtocol && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="mt-8 space-y-3 text-left max-w-xl mx-auto">
                    {protocolDays.map((phase, i) => (
                      <motion.div
                        key={phase.day}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]"
                      >
                        <span className="text-2xl flex-shrink-0">{phase.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400/60 tabular-nums">Day {phase.day}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white/70">{phase.title}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-white/30 leading-relaxed">{phase.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                    <div className="text-center pt-4">
                      <Link href="/protocols" className="inline-flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
                        Explore full protocols
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Footer ──────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-white/[0.04] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /></svg>
              </div>
              <span className="font-semibold text-sm text-gray-900 dark:text-white">FreqTherapy</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-white/20 leading-relaxed">Advanced frequency therapy for stress reduction, better sleep, and mental clarity.</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900 dark:text-white/60 uppercase tracking-wider mb-4">Product</p>
            <div className="space-y-2.5">
              <Link href="/frequencies" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Frequencies</Link>
              <Link href="/protocols" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Protocols</Link>
              <Link href="/pricing" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
              <Link href="/experience/2" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Try Now</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900 dark:text-white/60 uppercase tracking-wider mb-4">Account</p>
            <div className="space-y-2.5">
              <Link href="/auth/login" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
              <Link href="/auth/register" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Create Account</Link>
              <Link href="/dashboard" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900 dark:text-white/60 uppercase tracking-wider mb-4">Legal</p>
            <div className="space-y-2.5">
              <span className="block text-sm text-gray-500 dark:text-white/25">Not a medical device</span>
              <span className="block text-sm text-gray-500 dark:text-white/25">Consult your doctor</span>
              <span className="block text-sm text-gray-500 dark:text-white/25">FDA disclaimer applies</span>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-white/15">© 2026 FreqTherapy. Not intended to diagnose, treat, cure, or prevent any disease.</p>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-white/15">
            <span>127K+ users</span><span>·</span><span>47 studies</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
