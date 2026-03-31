'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { frequencies } from '@/lib/frequencies'

// Curated articles — frequencies with the richest scientific content
const FEATURED_SLUGS = [
  'dna-repair',
  'anxiety-liberation',
  'gamma-focus',
  'deep-sleep-delta',
  'schumann-earth-resonance',
  'pain-relief',
  'heart-coherence',
  'dopamine-elevation',
]

const categoryEmoji: Record<string, string> = {
  dna_repair: '🧬',
  anxiety_relief: '🧘',
  cognitive_enhancement: '⚡',
  sleep_optimization: '🌙',
  grounding: '🌍',
  pain_management: '💊',
  cardiovascular: '❤️',
  neurotransmitter_optimization: '🧠',
  mood_enhancement: '✨',
  relaxation: '🌊',
}

const categoryLabel: Record<string, string> = {
  dna_repair: 'Cellular Biology',
  anxiety_relief: 'Neuroscience',
  cognitive_enhancement: 'Cognitive Science',
  sleep_optimization: 'Sleep Research',
  grounding: 'Biophysics',
  pain_management: 'Pain Science',
  cardiovascular: 'Cardiology',
  neurotransmitter_optimization: 'Neurochemistry',
  mood_enhancement: 'Psychology',
  relaxation: 'Psychophysiology',
}

export default function ScienceBlog() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [gsapLoaded, setGsapLoaded] = useState(false)

  const articles = FEATURED_SLUGS
    .map(slug => frequencies.find(f => f.slug === slug))
    .filter(Boolean) as typeof frequencies

  // Simple fade-in animation for cards — no pin, no scroll hijacking
  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return

    let ctx: any

    const initGSAP = async () => {
      try {
        const gsapModule = await import('gsap')
        const scrollModule = await import('gsap/ScrollTrigger')
        const gsap = gsapModule.default || gsapModule.gsap
        const ScrollTrigger = scrollModule.ScrollTrigger || scrollModule.default

        if (!gsap || !ScrollTrigger) return

        gsap.registerPlugin(ScrollTrigger)
        setGsapLoaded(true)

        const track = trackRef.current!
        const container = containerRef.current!

        ctx = gsap.context(() => {
          // Stagger-reveal cards as they enter viewport
          gsap.fromTo(
            track.querySelectorAll('.science-card'),
            { opacity: 0, y: 40, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: container,
                start: 'top 80%',
                once: true,
              },
            }
          )
        }, container)
      } catch (e) {
        // GSAP not available — fallback to static layout
        console.warn('[ScienceBlog] GSAP load failed, using fallback', e)
      }
    }

    initGSAP()

    return () => {
      ctx?.revert()
    }
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Section header — outside the pinned area */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-cyan-600 dark:text-cyan-400/60 font-medium mb-3">
              The Research
            </p>
            <h2
              className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 dark:text-white/90"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Don't take our word for it.
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-white/35 max-w-xl leading-relaxed">
              Every frequency in our library is backed by published research. 
              These aren't wellness trends — they're measurable phenomena documented 
              in peer-reviewed journals.
            </p>
          </div>
          <Link
            href="/frequencies"
            className="group flex-shrink-0 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/30 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            View all {frequencies.length} frequencies
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scrollable card track — native horizontal scroll, no pin */}
      <div ref={containerRef} className="relative pb-8">
        <div
          ref={trackRef}
          className="flex gap-6 pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] pr-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articles.map((freq, i) => (
            <Link
              key={freq.slug}
              href={`/frequencies/${freq.slug}`}
              className="science-card group flex-shrink-0 w-[340px] md:w-[400px] snap-center"
            >
              <div className="relative h-[420px] rounded-3xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-gray-200 dark:hover:border-white/[0.12] hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20">
                {/* Top gradient accent — unique per card */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, 
                      hsl(${170 + i * 15}, 60%, 50%), 
                      hsl(${185 + i * 15}, 70%, 45%))`,
                  }}
                />

                <div className="p-7 flex flex-col h-full">
                  {/* Category tag */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-base">{categoryEmoji[freq.category] || '🔬'}</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-white/25 font-medium">
                      {categoryLabel[freq.category] || freq.category}
                    </span>
                  </div>

                  {/* Hz badge */}
                  <div className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-xs font-mono text-gray-500 dark:text-white/40 tabular-nums">
                      {freq.hz_value} Hz
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-2xl font-light text-gray-900 dark:text-white/85 mb-3 group-hover:text-gray-700 dark:group-hover:text-white transition-colors leading-tight"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {freq.name}
                  </h3>

                  {/* Excerpt — pull from scientific_backing */}
                  <p className="text-sm text-gray-500 dark:text-white/30 leading-relaxed line-clamp-3 mb-auto">
                    {freq.scientific_backing?.substring(0, 160)}…
                  </p>

                  {/* Bottom: research count + read CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/[0.04] mt-6">
                    <div className="flex items-center gap-3">
                      {freq.research_citations && freq.research_citations.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-400/20">
                          {freq.research_citations.length} studies
                        </span>
                      )}
                      {freq.clinical_trials && freq.clinical_trials.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-400/20">
                          {freq.clinical_trials.length} trials
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-white/20 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                      Read
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className="group-hover:translate-x-0.5 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Final card — CTA to all frequencies */}
          <div className="science-card flex-shrink-0 w-[340px] md:w-[400px] snap-center">
            <div className="h-[420px] rounded-3xl border border-dashed border-gray-200 dark:border-white/[0.08] flex flex-col items-center justify-center text-center px-10">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className="text-gray-400 dark:text-white/25">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p
                className="text-xl font-light text-gray-900 dark:text-white/70 mb-2"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                {frequencies.length} frequencies.
                <br />
                Each one documented.
              </p>
              <p className="text-sm text-gray-400 dark:text-white/25 mb-6">
                Search by symptom, Hz value, or condition.
              </p>
              <Link
                href="/frequencies"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-all"
              >
                Explore Library
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
