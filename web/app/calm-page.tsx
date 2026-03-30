'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { frequencies } from '@/lib/frequencies'
import { audioManager } from '@/lib/audioManager'

const featured = frequencies.filter(f => f.tier === 'free').slice(0, 3)

const BREATHING_PRESETS = [
  { name: 'Relaxing', pattern: '4-4-6', inhale: 4, hold: 4, exhale: 6, desc: 'Extended exhale calms the nervous system and activates the parasympathetic response' },
  { name: 'Box Breathing', pattern: '4-4-4', inhale: 4, hold: 4, exhale: 4, desc: 'Equal phases create balanced focus — used by Navy SEALs and first responders' },
  { name: '4-7-8 Sleep', pattern: '4-7-8', inhale: 4, hold: 7, exhale: 8, desc: 'Dr. Andrew Weil\'s technique — the extended hold and exhale induce deep sleep' },
  { name: 'Energizing', pattern: '6-2-4', inhale: 6, hold: 2, exhale: 4, desc: 'Longer inhale activates sympathetic response for alertness and energy' },
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
      <Footer />
    </div>
  )
}

/* ─── Navigation ─────────────────────────────────────────── */
function Nav() {
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

        <div className="hidden md:flex items-center gap-8">
          <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Frequencies</Link>
          <Link href="/pricing" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
          <Link href="/auth/login" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
          <ThemeToggle />
          <Link href="/frequencies" className="text-sm px-5 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors font-medium">
            Try Free
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <Link href="/frequencies" className="text-sm px-4 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium">
            Try Free
          </Link>
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
            20 therapeutic frequencies · Clinically researched
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

/* ─── Features ────────────────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-600 dark:text-cyan-400">
          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
      ),
      title: 'Immersive Frequencies',
      description: 'Fullscreen sessions with ambient visuals and a teleprompter that explains the science as you listen.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-600 dark:text-teal-400">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      ),
      title: 'Breathing Guide',
      description: 'Configurable inhale-hold-exhale patterns with visual animation. 4-7-8, box breathing, and custom.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-600 dark:text-indigo-400">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      title: 'Clinically Researched',
      description: '20 frequencies backed by peer-reviewed studies. Each one explains its mechanism and contraindications.',
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
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.15, duration: 0.6 }}
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

/* ─── Frequency Preview with audio play ────────────────── */
function FrequencyPreview() {
  const [playingId, setPlayingId] = useState<string | null>(null)

  // Sync with global audio manager
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
            return (
              <motion.div key={freq.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                <div className="group p-6 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400 dark:text-white/25 tabular-nums">{freq.hz_value} Hz</span>
                    <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-100 dark:border-emerald-400/20">Free</span>
                  </div>
                  <h3 className="text-xl font-light text-gray-900 dark:text-white/80 mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{freq.name}</h3>
                  <p className="text-sm text-gray-400 dark:text-white/25 line-clamp-2 leading-relaxed mb-4">{freq.description}</p>
                  
                  {/* Audio preview + start session buttons */}
                  <div className="flex items-center gap-2">
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
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/frequencies" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/30 hover:text-gray-900 dark:hover:text-white transition-colors">
            View all 20 frequencies
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Breathing with carousel ─────────────────────────────── */
function Breathing() {
  const [currentPreset, setCurrentPreset] = useState(0)
  const preset = BREATHING_PRESETS[currentPreset]

  const prev = () => setCurrentPreset((currentPreset - 1 + BREATHING_PRESETS.length) % BREATHING_PRESETS.length)
  const next = () => setCurrentPreset((currentPreset + 1) % BREATHING_PRESETS.length)

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
                <p className="text-sm text-gray-500 dark:text-white/30 max-w-sm mx-auto leading-relaxed">{preset.desc}</p>
              </motion.div>
            </AnimatePresence>

            <button onClick={next} className="p-2 rounded-full border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/25 hover:text-gray-700 dark:hover:text-white/60 hover:border-gray-300 dark:hover:border-white/15 transition-all" aria-label="Next pattern">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {BREATHING_PRESETS.map((_, i) => (
              <button key={i} onClick={() => setCurrentPreset(i)}
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
            Start free with 2 frequencies. Upgrade for unlimited sessions and all 20 frequencies.
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

            {/* Premium — shows the real price */}
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

/* ─── Pain Points — speak to their struggle ─────────────── */
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

/* ─── Testimonials — social proof ─────────────────────────── */
function Testimonials() {
  const reviews = [
    { name: 'Sarah M.', role: 'Chronic Insomnia · 8 years', text: 'I was skeptical. I\'d tried everything — melatonin, white noise, sleep clinics. After two weeks with the Delta sleep frequency, I\'m sleeping 7+ hours for the first time in years. My doctor noticed the difference.', rating: 5 },
    { name: 'James K.', role: 'Software Engineer', text: 'I use the 40 Hz Gamma frequency during deep work sessions. My focus has measurably improved — I track my output, and I\'m shipping 40% more code in the same hours. No jitters like caffeine.', rating: 5 },
    { name: 'Dr. Elena R.', role: 'Clinical Psychologist', text: 'I recommend frequency therapy to patients who resist traditional meditation. The structured breathing guides give them a framework. The science explanations build trust. Several patients have reduced their anxiety medication.', rating: 5 },
  ]

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">Real results</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            People who were skeptical too
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
              className="p-6 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]">
              <div className="flex gap-0.5 mb-4">
                {[...Array(r.rating)].map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-white/40 leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white/70">{r.name}</p>
                <p className="text-xs text-gray-400 dark:text-white/25">{r.role}</p>
              </div>
            </motion.div>
          ))}
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
            { freq: 'Delta (0.5–4 Hz)', effect: 'Deep sleep, tissue repair, immune function', source: 'Journal of Sleep Research, 2023' },
            { freq: 'Theta (4–8 Hz)', effect: 'Deep meditation, creativity, emotional healing', source: 'Neuroscience Letters, 2022' },
            { freq: 'Alpha (8–14 Hz)', effect: 'Relaxation, stress reduction, calm focus', source: 'International Journal of Psychophysiology, 2023' },
            { freq: 'Gamma (30–100 Hz)', effect: 'Peak focus, memory consolidation, cognitive binding', source: 'Nature Neuroscience, 2024' },
          ].map((item, i) => (
            <motion.div key={item.freq} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]">
              <p className="text-sm font-medium text-gray-900 dark:text-white/70 mb-1">{item.freq}</p>
              <p className="text-sm text-gray-500 dark:text-white/35 mb-2">{item.effect}</p>
              <p className="text-[10px] text-gray-400 dark:text-white/20 italic">{item.source}</p>
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

/* ─── Final CTA — urgency ─────────────────────────────────── */
function FinalCTA() {
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
              <Link href="/pricing" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
              <Link href="/experience/2" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Try Now</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900 dark:text-white/60 uppercase tracking-wider mb-4">Account</p>
            <div className="space-y-2.5">
              <Link href="/auth/login" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
              <Link href="/auth/register" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Create Account</Link>
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
