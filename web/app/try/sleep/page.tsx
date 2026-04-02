'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TrySleepPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Minimal nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /></svg>
          </div>
          <span className="text-sm font-semibold">FreqTherapy</span>
        </Link>
      </nav>

      {/* Hero — single focus */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.06] blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative">
          <p className="text-xs tracking-[0.3em] uppercase text-indigo-400/60 font-medium mb-6">1.5 Hz · Delta Frequency</p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight mb-6 leading-tight" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Fall asleep.<br />
            <span className="text-white/40">Without trying.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/35 max-w-md mx-auto mb-10 leading-relaxed">
            Delta frequency entrainment guides your brain into deep sleep.
            Put on headphones. Close your eyes. That&apos;s it.
          </p>

          <Link
            href="/experience/4"
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
        <div className="flex items-center justify-center gap-6 text-[11px] text-white/15">
          <span>Based on peer-reviewed research</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>23 frequencies available</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>7-day free trial</span>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <div className="px-6 pb-6 text-center">
        <p className="text-[9px] text-white/10 max-w-md mx-auto">
          FreqTherapy is a wellness tool, not a medical device. Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider.
        </p>
      </div>
    </div>
  )
}
