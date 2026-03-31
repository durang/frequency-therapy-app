'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { frequencies } from '@/lib/frequencies'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { BreakthroughStory } from '@/components/library/BreakthroughStory'

export default function FrequencyArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const freq = frequencies.find(f => f.slug === slug)

  if (!freq) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center text-gray-500 dark:text-white/40">
        <div className="text-center">
          <p className="text-6xl mb-4">🔬</p>
          <h1 className="text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Frequency not found</h1>
          <Link href="/frequencies" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">← Back to Library</Link>
        </div>
      </div>
    )
  }

  // Find related frequencies (same category, different id)
  const related = frequencies.filter(f => f.category === freq.category && f.id !== freq.id).slice(0, 3)
  if (related.length < 3) {
    const extra = frequencies.filter(f => f.id !== freq.id && !related.find(r => r.id === f.id)).slice(0, 3 - related.length)
    related.push(...extra)
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-label="FreqTherapy logo" role="img">
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">FreqTherapy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">← Library</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ─── Article Hero ─── */}
      <article className="max-w-3xl mx-auto px-6">
        <header className="pt-16 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 font-medium">{freq.hz_value} Hz</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
              <span className="text-xs text-gray-400 dark:text-white/25">{freq.duration_minutes} min recommended</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
              <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                freq.tier === 'free'
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-100 dark:border-emerald-400/20'
                  : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-100 dark:border-amber-400/20'
              }`}>{freq.tier === 'free' ? 'Free' : 'Premium'}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              {freq.name}
            </h1>
            <p className="text-xl text-gray-500 dark:text-white/40 leading-relaxed max-w-2xl">
              {freq.description}
            </p>
          </motion.div>
        </header>

        <div className="border-t border-gray-100 dark:border-white/[0.04]" />

        {/* ─── Inline CTA — above the fold ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
          className="my-10 p-6 rounded-2xl bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-500/[0.04] dark:to-teal-500/[0.03] border border-cyan-100 dark:border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white/70 mb-1">Ready to try {freq.name}?</p>
            <p className="text-xs text-gray-500 dark:text-white/30">{freq.tier === 'free' ? 'Free · No account needed · Headphones recommended' : 'Premium · Unlimited sessions · Full immersive experience'}</p>
          </div>
          <Link href={`/experience/${freq.id}`}
            className="group flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all">
            Start Session
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </motion.div>

        {/* ─── Article Body ─── */}
        <div className="prose-section space-y-16 pb-16">

          {/* Section: What is this frequency */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white/90" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              What is the {freq.hz_value} Hz frequency?
            </h2>
            <p className="text-base text-gray-600 dark:text-white/45 leading-[1.85] mb-6">
              {freq.scientific_backing}
            </p>
            {freq.mechanism && (
              <div className="p-5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06]">
                <p className="text-xs tracking-[0.2em] uppercase text-cyan-600 dark:text-cyan-400/50 font-medium mb-2">Mechanism of Action</p>
                <p className="text-sm text-gray-600 dark:text-white/40 leading-relaxed">{freq.mechanism}</p>
              </div>
            )}
          </motion.section>

          {/* Section: Documented Benefits */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white/90" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Documented benefits
            </h2>
            <p className="text-base text-gray-600 dark:text-white/45 leading-[1.85] mb-8">
              Research and clinical observation have identified the following effects when listening to {freq.hz_value} Hz at appropriate volume levels with quality headphones for {freq.duration_minutes}+ minutes per session:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {freq.benefits.map((benefit, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-white/50">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section: Best Used For */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white/90" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Who is this for?
            </h2>
            <p className="text-base text-gray-600 dark:text-white/45 leading-[1.85] mb-6">
              The {freq.hz_value} Hz frequency is particularly effective for people experiencing:
            </p>
            <div className="flex flex-wrap gap-2">
              {freq.best_for.map((item, i) => (
                <span key={i} className="px-4 py-2 rounded-full text-sm border border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-white/40 bg-white dark:bg-white/[0.02]">
                  {item}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Mid-article CTA */}
          <div className="p-8 rounded-2xl bg-gray-900 dark:bg-white/[0.04] border border-gray-800 dark:border-white/[0.06] text-center">
            <p className="text-lg font-light text-white dark:text-white/80 mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Experience it yourself
            </p>
            <p className="text-sm text-gray-400 dark:text-white/30 mb-6">
              Reading about frequency therapy is one thing. Feeling it is another.
            </p>
            <Link href={`/experience/${freq.id}`}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white dark:bg-white text-gray-900 font-medium hover:bg-gray-100 transition-all">
              Start {freq.duration_minutes}-Minute Session
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {/* Section: The Science */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white/90" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              The science behind {freq.hz_value} Hz
            </h2>
            <p className="text-base text-gray-600 dark:text-white/45 leading-[1.85] mb-8">
              Brainwave entrainment — the process by which the brain synchronizes its electrical activity to an external stimulus — is one of the most well-documented phenomena in auditory neuroscience. When you listen to {freq.hz_value} Hz, your brain&apos;s neural oscillations begin to match that frequency through the <strong className="text-gray-800 dark:text-white/60">Frequency Following Response (FFR)</strong>.
            </p>
            <p className="text-base text-gray-600 dark:text-white/45 leading-[1.85] mb-8">
              This isn&apos;t speculation. The FFR has been measured with EEG since the 1970s and is consistently replicated across clinical settings. What varies between frequencies is which neural circuits are most affected — and that&apos;s where the specificity of {freq.hz_value} Hz matters.
            </p>

            {/* Research Citations */}
            {freq.research_citations && freq.research_citations.length > 0 && (
              <div className="space-y-3 mb-8">
                <p className="text-xs tracking-[0.2em] uppercase text-cyan-600 dark:text-cyan-400/50 font-medium mb-3">Published Research</p>
                {freq.research_citations.map((cite, j) => (
                  <div key={j} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04]">
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400/60 mt-0.5 flex-shrink-0 w-6 text-right">[{j + 1}]</span>
                    <span className="text-sm text-gray-500 dark:text-white/35 leading-relaxed italic">{cite}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          {/* Section: Clinical Trials */}
          {freq.clinical_trials && freq.clinical_trials.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white/90" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Clinical trial results
              </h2>
              <div className="space-y-4">
                {freq.clinical_trials.map((trial, j) => (
                  <div key={j} className="p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]">
                    <p className="text-base font-medium text-gray-900 dark:text-white/70 mb-4">{trial.title}</p>
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                        <p className="text-2xl font-light text-gray-900 dark:text-white/80 tabular-nums" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{trial.participants.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 dark:text-white/20 mt-1">Participants</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                        <p className="text-2xl font-light text-gray-900 dark:text-white/80 tabular-nums" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{trial.duration_weeks}</p>
                        <p className="text-[10px] text-gray-400 dark:text-white/20 mt-1">Weeks</p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-400/5">
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 leading-snug">{trial.results}</p>
                        <p className="text-[10px] text-emerald-600/60 dark:text-emerald-400/30 mt-1">Outcome</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-white/20 italic">{trial.institution}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section: Recommended Protocol */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white/90" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              How to use {freq.name}
            </h2>
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] mb-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-600 dark:text-cyan-400"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white/70 mb-1">Recommended Dosage</p>
                  <p className="text-sm text-gray-600 dark:text-white/40 leading-relaxed">
                    {freq.dosage || `Listen for ${freq.duration_minutes} minutes per session. Use quality headphones for best results. Consistent daily use amplifies effectiveness over time.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] text-center">
                <p className="text-2xl mb-2">🎧</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white/60 mb-1">Use headphones</p>
                <p className="text-[10px] text-gray-400 dark:text-white/25">Over-ear for best entrainment. The frequency must reach both ears directly.</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] text-center">
                <p className="text-2xl mb-2">🧘</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white/60 mb-1">Find a quiet space</p>
                <p className="text-[10px] text-gray-400 dark:text-white/25">External noise competes with the frequency. A calm environment amplifies the effect.</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] text-center">
                <p className="text-2xl mb-2">📅</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white/60 mb-1">Be consistent</p>
                <p className="text-[10px] text-gray-400 dark:text-white/25">Daily use for 2+ weeks produces measurable results. Your brain adapts and responds faster over time.</p>
              </div>
            </div>
          </motion.section>

          {/* Section: Safety */}
          {freq.contraindications && freq.contraindications.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900 dark:text-white/90" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Safety information
              </h2>
              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-400/5 border border-amber-100 dark:border-amber-400/10">
                <p className="text-sm text-gray-700 dark:text-white/50 leading-relaxed mb-4">
                  Frequency therapy is generally considered safe for most adults. However, certain conditions require caution. Consult a healthcare professional before use if any of the following apply:
                </p>
                <ul className="space-y-2.5 mb-4">
                  {freq.contraindications.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="text-amber-500 mt-0.5 text-sm flex-shrink-0">⚠</span>
                      <span className="text-sm text-amber-800 dark:text-amber-400/70">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-amber-600/60 dark:text-amber-400/30">
                  This information is for educational purposes only. FreqTherapy is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>
            </motion.section>
          )}
        </div>

        {/* ─── Breakthrough Story ─── */}
        <BreakthroughStory
          frequencySlug={freq.slug}
          frequencyName={freq.name}
          frequencyHz={freq.hz_value}
          frequencyId={freq.id}
        />

        {/* ─── Final CTA ─── */}
        <div className="pb-16">
          <div className="p-10 rounded-3xl bg-gradient-to-b from-gray-50 to-white dark:from-white/[0.04] dark:to-transparent border border-gray-100 dark:border-white/[0.04] text-center">
            <p className="text-3xl font-light mb-3 text-gray-900 dark:text-white/90" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Your brain already responds to {freq.hz_value} Hz.
            </p>
            <p className="text-base text-gray-500 dark:text-white/35 max-w-md mx-auto mb-8 leading-relaxed">
              You&apos;ve read the science. You&apos;ve seen the research. Now put on your headphones and experience what {freq.name} feels like.
            </p>
            <Link href={`/experience/${freq.id}`}
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-lg hover:bg-gray-700 dark:hover:bg-gray-100 transition-all shadow-lg shadow-gray-900/10 dark:shadow-white/5">
              Start {freq.duration_minutes}-Minute Session
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <p className="text-xs text-gray-400 dark:text-white/15 mt-4">
              {freq.tier === 'free' ? 'Free · No account required · 5-minute preview' : 'Premium · Unlimited session length · Cancel anytime'}
            </p>
          </div>
        </div>

        {/* ─── Related Frequencies ─── */}
        <div className="pb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 font-medium mb-6">Explore more</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.id} href={`/frequencies/${r.slug}`}
                className="group p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] transition-all">
                <span className="text-xs text-gray-400 dark:text-white/25 tabular-nums">{r.hz_value} Hz</span>
                <p className="text-base font-light text-gray-900 dark:text-white/80 mt-1 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {r.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-white/25 mt-1 line-clamp-2">{r.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-white/[0.04] py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-white/15">
          <p>© 2026 FreqTherapy. Not intended to diagnose, treat, cure, or prevent any disease.</p>
          <div className="flex items-center gap-4">
            <Link href="/frequencies" className="hover:text-gray-600 dark:hover:text-white/30 transition-colors">All Frequencies</Link>
            <Link href="/protocols" className="hover:text-gray-600 dark:hover:text-white/30 transition-colors">Protocols</Link>
            <Link href="/pricing" className="hover:text-gray-600 dark:hover:text-white/30 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
