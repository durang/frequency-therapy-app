'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { frequencies } from '@/lib/frequencies'

// Featured frequencies for preview
const featured = frequencies.filter(f => f.tier === 'free').slice(0, 3)

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      <Nav />
      <Hero />
      <Features />
      <FrequencyPreview />
      <Breathing />
      <Pricing />
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
          <span className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            FreqTherapy
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
            Frequencies
          </Link>
          <Link href="/pricing" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/auth/login" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <ThemeToggle />
          <Link
            href="/frequencies"
            className="text-sm px-5 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors font-medium"
          >
            Try Free
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <Link
            href="/frequencies"
            className="text-sm px-4 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium"
          >
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
      {/* Ambient gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-200/20 dark:bg-cyan-500/[0.06] blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-teal-200/20 dark:bg-teal-500/[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] text-xs text-gray-600 dark:text-white/50 mb-10 tracking-wide">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            20 therapeutic frequencies · Clinically researched
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight mb-8"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Find your
            <br />
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              inner calm
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-500 dark:text-white/40 max-w-xl mx-auto leading-relaxed font-light mb-12">
            Scientifically-backed frequency therapy with immersive breathing guides. 
            Reduce stress, improve sleep, enhance mental clarity.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/frequencies"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-base hover:bg-gray-700 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-gray-900/10 dark:shadow-white/5"
            >
              Start Free Session
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-2xl border border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/15 transition-all duration-300 font-medium text-base"
            >
              View Pricing
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-14 text-xs text-gray-400 dark:text-white/20">
            <span>127K+ users</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
            <span>94.7% effectiveness</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
            <span>47 studies cited</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border border-gray-300 dark:border-white/10 flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-1 h-1 rounded-full bg-gray-400 dark:bg-white/20"
          />
        </div>
      </motion.div>
    </section>
  )
}

/* ─── Features ────────────────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: '🎵',
      title: 'Immersive Frequencies',
      description: 'Fullscreen sessions with ambient visuals and a teleprompter that explains the science as you listen.',
    },
    {
      icon: '🫁',
      title: 'Breathing Guide',
      description: 'Configurable inhale-hold-exhale patterns with visual animation. 4-7-8, box breathing, and custom.',
    },
    {
      icon: '🧠',
      title: 'Clinically Researched',
      description: '20 frequencies backed by peer-reviewed studies. Each one explains its mechanism and contraindications.',
    },
  ]

  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">
            How it works
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Therapy that feels like
            <br />
            <span className="text-gray-400 dark:text-white/30">meditation</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group p-8 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] transition-all duration-500"
            >
              <div className="text-3xl mb-5">{f.icon}</div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white/90">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-white/35 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Frequency Preview ───────────────────────────────────── */
function FrequencyPreview() {
  return (
    <section className="py-32 px-6 bg-gray-50 dark:bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">
            Free to try
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Start with these
          </h2>
          <p className="text-gray-400 dark:text-white/30 max-w-md mx-auto">
            5-minute free sessions. No account required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {featured.map((freq, i) => (
            <motion.div
              key={freq.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link
                href={`/experience/${freq.id}`}
                className="group block p-6 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-400 dark:text-white/25 tabular-nums">{freq.hz_value} Hz</span>
                  <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-100 dark:border-emerald-400/20">
                    Free
                  </span>
                </div>
                <h3 className="text-xl font-light text-gray-900 dark:text-white/80 group-hover:text-gray-700 dark:group-hover:text-white mb-2"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {freq.name}
                </h3>
                <p className="text-sm text-gray-400 dark:text-white/25 line-clamp-2 leading-relaxed">{freq.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Start session</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/frequencies"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/30 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            View all 20 frequencies
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Breathing Section ───────────────────────────────────── */
function Breathing() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">
            Integrated breathing
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Breathe with intention
          </h2>
          <p className="text-gray-500 dark:text-white/35 max-w-xl mx-auto leading-relaxed mb-16">
            Every session includes a configurable breathing guide that syncs with the frequency.
            Inhale. Hold. Exhale. Each phase explained with the science behind it.
          </p>

          {/* Breathing demo visual */}
          <div className="flex items-center justify-center gap-12 mb-16">
            {[
              { phase: 'Inhale', seconds: '4s', desc: 'Activates parasympathetic response' },
              { phase: 'Hold', seconds: '4s', desc: 'Balances CO₂ and O₂ levels' },
              { phase: 'Exhale', seconds: '6s', desc: 'Stimulates the vagus nerve' },
            ].map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl font-light text-gray-900 dark:text-white/80 mb-1 tabular-nums"
                     style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {item.seconds}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-white/50 mb-1">{item.phase}</div>
                <div className="text-xs text-gray-400 dark:text-white/20 max-w-[140px]">{item.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['4-4-6 Relaxing', '4-4-4 Box', '4-7-8 Sleep', '6-2-4 Energy'].map(preset => (
              <span key={preset} className="px-4 py-2 rounded-full text-xs text-gray-500 dark:text-white/30 border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]">
                {preset}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Pricing Preview ─────────────────────────────────────── */
function Pricing() {
  return (
    <section className="py-32 px-6 bg-gray-50 dark:bg-white/[0.01]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">
            Simple pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            One plan, full access
          </h2>
          <p className="text-gray-400 dark:text-white/30 max-w-md mx-auto mb-12">
            Start free with 2 frequencies. Upgrade for unlimited sessions and all 20 frequencies.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 max-w-xl mx-auto mb-10">
            {/* Free */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-left">
              <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-3">Free</p>
              <p className="text-3xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>$0</p>
              <p className="text-xs text-gray-400 dark:text-white/20 mb-5">2 frequencies · 5 min sessions</p>
              <Link
                href="/frequencies"
                className="block w-full text-center py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm text-gray-600 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/15 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Premium */}
            <div className="p-6 rounded-2xl border border-cyan-200 dark:border-cyan-500/20 bg-gradient-to-b from-cyan-50 to-white dark:from-cyan-500/[0.04] dark:to-transparent text-left relative">
              <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-cyan-500 text-white text-[10px] tracking-wider uppercase font-medium">
                Popular
              </div>
              <p className="text-xs text-cyan-600 dark:text-cyan-400/60 uppercase tracking-wider mb-3">Unlimited</p>
              <p className="text-3xl font-light text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                $10<span className="text-base text-gray-400 dark:text-white/30">/mo</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-white/20 mb-5">All 20 frequencies · Unlimited sessions</p>
              <Link
                href="/pricing"
                className="block w-full text-center py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-all"
              >
                Subscribe
              </Link>
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-white/15">
            Annual billing available at $120/year (save 47%)
          </p>
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
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                </svg>
              </div>
              <span className="font-semibold text-sm text-gray-900 dark:text-white">FreqTherapy</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-white/20 leading-relaxed">
              Advanced frequency therapy for stress reduction, better sleep, and mental clarity.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-medium text-gray-900 dark:text-white/60 uppercase tracking-wider mb-4">Product</p>
            <div className="space-y-2.5">
              <Link href="/frequencies" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Frequencies</Link>
              <Link href="/pricing" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
              <Link href="/experience/2" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Try Now</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs font-medium text-gray-900 dark:text-white/60 uppercase tracking-wider mb-4">Account</p>
            <div className="space-y-2.5">
              <Link href="/auth/login" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
              <Link href="/auth/register" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Create Account</Link>
              <Link href="/dashboard" className="block text-sm text-gray-500 dark:text-white/25 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-medium text-gray-900 dark:text-white/60 uppercase tracking-wider mb-4">Legal</p>
            <div className="space-y-2.5">
              <span className="block text-sm text-gray-500 dark:text-white/25">Not a medical device</span>
              <span className="block text-sm text-gray-500 dark:text-white/25">Consult your doctor</span>
              <span className="block text-sm text-gray-500 dark:text-white/25">FDA disclaimer applies</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-white/15">
            © 2024 FreqTherapy. Not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-white/15">
            <span>127K+ users</span>
            <span>·</span>
            <span>47 studies</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
