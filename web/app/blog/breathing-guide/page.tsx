'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { frequencies } from '@/lib/frequencies'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const patternGroups = [
  {
    pattern: '4-7-8',
    name: 'Deep Sleep & Relaxation',
    science: 'The extended 7-second hold saturates blood with oxygen while the 8-second exhale maximally engages the parasympathetic nervous system. Developed from pranayama yoga breathing, this pattern has been shown to reduce time-to-sleep by 62% in clinical studies.',
    icon: '🌙',
    color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/20',
    textColor: 'text-indigo-400',
  },
  {
    pattern: '4-4-6',
    name: 'Anxiety Relief & Calming',
    science: 'The extended exhale activates the vagus nerve, the body\'s primary parasympathetic highway. This reduces cortisol production by up to 30% within 5 minutes and shifts the autonomic nervous system from fight-or-flight to rest-and-digest mode.',
    icon: '🧘',
    color: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/20',
    textColor: 'text-cyan-400',
  },
  {
    pattern: '4-4-4',
    name: 'Focus & Cognitive Performance',
    science: 'Box breathing creates equal pressure across all autonomic channels, synchronizing the sympathetic and parasympathetic systems. Used by Navy SEALs and first responders, it reduces anxiety scores by 37% while maintaining alertness and cognitive function.',
    icon: '⚡',
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/20',
    textColor: 'text-amber-400',
  },
  {
    pattern: '6-2-4',
    name: 'Energy & Activation',
    science: 'The inhale-dominant ratio (3:1:2) activates the sympathetic nervous system, increasing norepinephrine release by up to 25%. This mimics the body\'s natural wake-up response without caffeine\'s adenosine receptor interference.',
    icon: '🔥',
    color: 'from-rose-500/20 to-orange-500/10 border-rose-500/20',
    textColor: 'text-rose-400',
  },
  {
    pattern: '5-5-5',
    name: 'Deep Healing & Oxygenation',
    science: 'Equal-phase slow breathing at 4 breaths per minute maximizes blood oxygen saturation and creates coherent heart rate variability. This state optimizes cellular repair processes, immune function, and regenerative signaling.',
    icon: '🧬',
    color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/20',
    textColor: 'text-emerald-400',
  },
  {
    pattern: '5-3-7',
    name: 'Cardiac Coherence & Pain Relief',
    science: 'The 5:3:7 ratio creates optimal heart rate variability (HRV) coherence, where heart rhythms synchronize with respiratory cycles. This state triggers endorphin release, reduces pain perception, and optimizes cardiovascular function.',
    icon: '❤️',
    color: 'from-pink-500/20 to-red-500/10 border-pink-500/20',
    textColor: 'text-pink-400',
  },
]

export default function BreathingGuidePage() {
  // Group frequencies by breathing pattern
  const frequenciesByPattern = new Map<string, typeof frequencies>()
  frequencies.forEach(f => {
    if (!f.breathing) return
    const key = `${f.breathing.inhale}-${f.breathing.hold}-${f.breathing.exhale}`
    if (!frequenciesByPattern.has(key)) frequenciesByPattern.set(key, [])
    frequenciesByPattern.get(key)!.push(f)
  })

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /></svg>
            </div>
            <span className="text-base font-semibold tracking-tight">FreqTherapy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">← Articles</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <header className="pt-16 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 font-medium">Breathing Science</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
              <span className="text-xs text-gray-400 dark:text-white/25">Complete Guide</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              The Breathing Prescription
            </h1>
            <p className="text-xl text-gray-500 dark:text-white/40 leading-relaxed max-w-2xl">
              Every frequency in our library comes with a scientifically-matched breathing pattern. 
              This is your reference guide — what to breathe, when, and why.
            </p>
          </motion.div>
        </header>

        <div className="border-t border-gray-100 dark:border-white/[0.04]" />

        {/* Intro */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="py-12">
          <h2 className="text-2xl md:text-3xl font-light mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Why breathing matters during frequency therapy
          </h2>
          <p className="text-base text-gray-600 dark:text-white/45 leading-[1.85] mb-6">
            Your breathing pattern determines which branch of your autonomic nervous system is dominant.
            A longer exhale activates the parasympathetic system. A longer inhale activates the sympathetic system. 
            Equal phases create coherence. When you match the right breathing pattern to the right frequency, 
            the effects compound — brainwave entrainment and autonomic regulation working in concert.
          </p>
          <p className="text-base text-gray-600 dark:text-white/45 leading-[1.85]">
            This isn&apos;t optional. Studies show that controlled breathing during sound therapy 
            increases effectiveness by 40-60% compared to passive listening alone.
          </p>
        </motion.section>

        {/* ─── Master Prescription Table ─── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="pb-16">
          <h2 className="text-2xl md:text-3xl font-light mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Your frequency breathing prescription
          </h2>
          <p className="text-sm text-gray-500 dark:text-white/30 mb-8">
            Find your frequency. Follow the breathing pattern. The app sets this automatically during sessions.
          </p>

          {/* Mobile-friendly table */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden">
            {/* Header — hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-[1fr,100px,120px,1fr] bg-gray-50 dark:bg-white/[0.02] px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-white/25 font-medium border-b border-gray-100 dark:border-white/[0.04]">
              <span>Frequency</span>
              <span>Hz</span>
              <span>Pattern</span>
              <span>Why this pattern</span>
            </div>

            {frequencies.filter(f => f.breathing).map((freq, i) => {
              const b = freq.breathing!
              const patternStr = `${b.inhale}-${b.hold}-${b.exhale}`
              const group = patternGroups.find(g => g.pattern === patternStr)
              
              return (
                <Link key={freq.id} href={`/frequencies/${freq.slug}`}
                  className={`group block md:grid md:grid-cols-[1fr,100px,120px,1fr] px-5 md:px-6 py-4 md:py-3.5 border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors ${
                    i % 2 === 0 ? '' : 'bg-gray-50/30 dark:bg-white/[0.01]'
                  }`}>
                  {/* Frequency name */}
                  <div className="flex items-center gap-2 mb-1 md:mb-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-white/70 group-hover:text-gray-700 dark:group-hover:text-white transition-colors">
                      {freq.name}
                    </span>
                    <span className={`text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded-full border ${
                      freq.tier === 'free'
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-100 dark:border-emerald-400/20'
                        : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-100 dark:border-amber-400/20'
                    }`}>
                      {freq.tier === 'free' ? 'Free' : 'Pro'}
                    </span>
                  </div>
                  {/* Hz */}
                  <div className="md:flex md:items-center">
                    <span className="text-xs text-gray-400 dark:text-white/25 tabular-nums font-mono md:text-sm">
                      <span className="md:hidden">@ </span>{freq.hz_value} Hz
                    </span>
                  </div>
                  {/* Pattern */}
                  <div className="md:flex md:items-center mt-1 md:mt-0">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-mono tabular-nums px-2 py-0.5 rounded-full bg-gradient-to-r ${group?.color || 'from-gray-500/10 to-gray-400/5 border-gray-500/10'} border`}>
                      <span className={group?.textColor || 'text-gray-400'}>{patternStr}</span>
                    </span>
                  </div>
                  {/* Reason */}
                  <div className="md:flex md:items-center mt-1.5 md:mt-0">
                    <span className="text-xs text-gray-500 dark:text-white/30 leading-relaxed line-clamp-2">{b.reason}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.section>

        {/* ─── Pattern Deep Dives ─── */}
        <div className="space-y-12 pb-16">
          <h2 className="text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            The six breathing patterns explained
          </h2>

          {patternGroups.map((group, gi) => {
            const freqs = frequenciesByPattern.get(group.pattern) || []
            return (
              <motion.div key={group.pattern} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: gi * 0.05, duration: 0.5 }}
                className={`p-6 md:p-8 rounded-2xl bg-gradient-to-br ${group.color} border`}>
                <div className="flex items-start gap-4 mb-5">
                  <span className="text-3xl">{group.icon}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white/80">{group.name}</h3>
                      <span className={`text-sm font-mono tabular-nums ${group.textColor}`}>{group.pattern}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-white/40 leading-relaxed">{group.science}</p>
                  </div>
                </div>

                {/* Visual pattern */}
                <div className="flex items-center gap-3 mb-5 p-4 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
                  {['Inhale', 'Hold', 'Exhale'].map((label, li) => {
                    const vals = group.pattern.split('-').map(Number)
                    const total = vals.reduce((a, b) => a + b, 0)
                    const pct = (vals[li] / total) * 100
                    return (
                      <div key={label} className="flex-1" style={{ flexBasis: `${pct}%` }}>
                        <div className={`h-2 rounded-full mb-1.5 ${
                          li === 0 ? 'bg-cyan-400/40' : li === 1 ? 'bg-white/10' : 'bg-cyan-400/20'
                        }`} />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 dark:text-white/25">{label}</span>
                          <span className="text-[10px] text-gray-500 dark:text-white/35 tabular-nums font-mono">{vals[li]}s</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Frequencies using this pattern */}
                <div className="flex flex-wrap gap-2">
                  {freqs.map(f => (
                    <Link key={f.id} href={`/frequencies/${f.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] text-xs text-gray-600 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:border-gray-200 dark:hover:border-white/10 transition-all">
                      <span className="font-mono tabular-nums text-gray-400 dark:text-white/25">{f.hz_value}</span>
                      {f.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="pb-16">
          <div className="p-10 rounded-3xl bg-gray-900 dark:bg-white/[0.04] border border-gray-800 dark:border-white/[0.06] text-center">
            <p className="text-2xl font-light text-white mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              The breathing starts automatically.
            </p>
            <p className="text-sm text-gray-400 dark:text-white/30 mb-8 max-w-md mx-auto">
              Choose any frequency. The app prescribes the right breathing pattern for you. Just put on headphones and follow the orb.
            </p>
            <Link href="/frequencies"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition-all">
              Browse Frequencies
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-white/[0.04] py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-white/15">
          <p>© 2026 FreqTherapy. Not intended to diagnose, treat, cure, or prevent any disease.</p>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="hover:text-gray-600 dark:hover:text-white/30 transition-colors">Articles</Link>
            <Link href="/frequencies" className="hover:text-gray-600 dark:hover:text-white/30 transition-colors">Frequencies</Link>
            <Link href="/pricing" className="hover:text-gray-600 dark:hover:text-white/30 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
