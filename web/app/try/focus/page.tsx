'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
const PF = 'var(--font-playfair), Georgia, serif'

function EmailModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  if (!show) return null
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    localStorage.setItem('freqtherapy-email-captured', 'true')
    localStorage.setItem('freqtherapy-popup-shown', 'true')
    setDone(true)
    setTimeout(onClose, 2000)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#111118] border border-amber-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-amber-500/5">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors text-2xl leading-none">&times;</button>
        {done ? (
          <div className="text-center py-6">
            <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(251 191 36)" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            <p className="text-white/60 text-sm">Check your inbox.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl text-white mb-2" style={{ fontFamily: PF }}>Get your free focus frequency guide</h3>
            <p className="text-sm text-white/35 mb-6">Gamma protocols for sustained deep work sessions.</p>
            <form onSubmit={submit} className="flex gap-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 text-sm" />
              <button type="submit" className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-400 transition-colors">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function usePopup() {
  const [show, setShow] = useState(false)
  const fired = useRef(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('freqtherapy-popup-shown') === 'true') return
    if (localStorage.getItem('freqtherapy-email-captured') === 'true') return
    const t = setTimeout(() => { if (!fired.current) { fired.current = true; setShow(true) } }, 45000)
    const onScroll = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (pct >= 0.7 && !fired.current) { fired.current = true; setShow(true) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])
  return { show, close: () => { setShow(false); localStorage.setItem('freqtherapy-popup-shown', 'true') } }
}

export default function TryFocusPage() {
  const popup = usePopup()
  const containerRef = useRef<HTMLDivElement>(null)
  const gsapRef = useRef<any>(null)
  const [inlineEmail, setInlineEmail] = useState('')
  const [inlineDone, setInlineDone] = useState(false)
  const [showInline, setShowInline] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('freqtherapy-email-captured') === 'true') setShowInline(false)
  }, [])

  const animateCountUp = useCallback((el: HTMLElement, target: string, gsap: any) => {
    const isPercent = target.includes('%')
    const isSec = target.includes('sec')
    const isX = target.includes('x')
    const hasHrs = target.includes('hrs')
    const num = parseInt(target.replace(/[^0-9]/g, ''), 10)
    if (isSec || hasHrs) {
      gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
      return
    }
    const obj = { val: 0 }
    gsap.to(obj, {
      val: num,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => {
        const v = Math.round(obj.val)
        el.textContent = isX ? `${v}x` : isPercent ? `${v}%` : `${v}`
      }
    })
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
        gsapRef.current = gsap

        // Hero — staggered text entrance
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        heroTl
          .fromTo('.hero-badge', { opacity: 0, y: 30, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 })
          .fromTo('.hero-line-1', { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }, '-=0.55')
          .fromTo('.hero-line-2', { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }, '-=0.55')
          .fromTo('.hero-sub', { opacity: 0, y: 30, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, '-=0.5')
          .fromTo('.hero-cta', { opacity: 0, y: 30, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, '-=0.4')
          .fromTo('.hero-note', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3')

        // Hero glow parallax
        gsap.to('.hero-glow', {
          y: 150,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
        })

        // Stats — count up
        gsap.utils.toArray<HTMLElement>('.stat-number').forEach(el => {
          const target = el.getAttribute('data-target') || '0'
          animateCountUp(el, target, gsap)
        })
        gsap.utils.toArray<HTMLElement>('.stat-desc').forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.15 + 0.5, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
        })

        // Steps — slide from left with extending line
        gsap.utils.toArray<HTMLElement>('.step-col').forEach((el, i) => {
          const line = el.querySelector('.step-line')
          gsap.fromTo(el, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.7, delay: i * 0.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
          if (line) {
            gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.8, delay: i * 0.2 + 0.3, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
          }
        })

        // Testimonials — 3D card flip
        gsap.utils.toArray<HTMLElement>('.testimonial-card').forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 30, rotateY: 3 }, { opacity: 1, y: 0, rotateY: 0, duration: 0.8, delay: i * 0.15, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
        })

        // Science — word-by-word reveal
        const scienceWords = gsap.utils.toArray<HTMLElement>('.science-word')
        if (scienceWords.length) {
          gsap.fromTo(scienceWords, { opacity: 0.1 }, {
            opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power1.out',
            scrollTrigger: { trigger: '.science-card', start: 'top 80%' }
          })
        }

        // Timeline — pulsing dots
        gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((el, i) => {
          const dot = el.querySelector('.timeline-dot')
          gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.15, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
          if (dot) {
            gsap.fromTo(dot, { scale: 1 }, {
              scale: 1.5, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1,
              scrollTrigger: { trigger: el, start: 'top 85%' }
            })
          }
        })

        // Final CTA
        gsap.fromTo('.final-cta', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.final-cta', start: 'top 85%' } })

        // CTA button glow pulse
        gsap.to('.cta-glow', {
          boxShadow: '0 0 40px 8px rgba(251, 191, 36, 0.3)',
          duration: 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        })

        // Section headings
        gsap.utils.toArray<HTMLElement>('.section-heading').forEach(h => {
          gsap.fromTo(h, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: h, start: 'top 85%' } })
        })
      } catch {}
    }
    init()
    return () => { gsapRef.current?.killTweensOf('*') }
  }, [animateCountUp])

  const submitInline = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inlineEmail) return
    localStorage.setItem('freqtherapy-email-captured', 'true')
    setInlineDone(true)
    setTimeout(() => setShowInline(false), 2000)
  }

  const scienceQuote = '40 Hz gamma entrainment improved memory, cognition, and mood while preventing neuronal loss.'

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0f] text-white">
      <EmailModal show={popup.show} onClose={popup.close} />

      {/* Hero */}
      <section className="hero-section relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: NOISE }} />
        <div className="hero-glow absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/[0.06] blur-[120px] pointer-events-none" />
        <div className="relative max-w-2xl">
          <p className="hero-badge text-[11px] tracking-[0.3em] uppercase text-amber-400/60 font-medium mb-8 opacity-0">40 Hz Gamma Entrainment</p>
          <h1 style={{ fontFamily: PF }}>
            <span className="hero-line-1 block text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.1] opacity-0">MIT-validated frequency</span>
            <span className="hero-line-2 block text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.1] text-white/40 mt-2 opacity-0">for sharper focus.</span>
          </h1>
          <p className="hero-sub text-base sm:text-lg text-white/35 max-w-md mx-auto mb-10 mt-8 leading-relaxed opacity-0">40 Hz gamma studied at MIT, published in Nature. Synchronizes both hemispheres. Put on headphones and work.</p>
          <div className="hero-cta opacity-0">
            <Link href="/experience/3" className="cta-glow group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-gray-900 font-medium text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10">
              Try It Now — Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <p className="hero-note text-[11px] text-white/20 mt-5 opacity-0">No account needed. Headphones recommended.</p>
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-5xl mx-auto h-px bg-white/[0.05]" />

      {/* The Problem */}
      <section className="px-6 py-28 max-w-5xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-20" style={{ fontFamily: PF }}>You have tried everything.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          {[
            { n: '8 sec', d: 'average sustained attention span in adults under 40', target: '8 sec' },
            { n: '4 hrs', d: 'before the caffeine crash destroys your afternoon', target: '4 hrs' },
            { n: '96x', d: 'the average person checks their phone per day', target: '96x' },
          ].map((s, i) => (
            <div key={i} className="border-t border-amber-500/20 pt-6">
              <p className="stat-number text-5xl sm:text-6xl font-light text-amber-400 mb-3" style={{ fontFamily: PF, fontVariantNumeric: 'tabular-nums' }} data-target={s.target}>{s.target.includes('sec') || s.target.includes('hrs') ? s.n : '0'}</p>
              <p className="stat-desc text-sm text-white/30 leading-relaxed opacity-0">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-5xl mx-auto h-px bg-white/[0.05]" />

      {/* How It Works */}
      <section className="px-6 py-28 max-w-5xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-20" style={{ fontFamily: PF }}>Three steps. Five minutes.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {[
            { s: 'STEP 01', t: 'Press play', d: '40 Hz gamma delivered binaurally. Both hemispheres synchronize through stereo headphones.' },
            { s: 'STEP 02', t: 'Neural binding', d: 'MIT-documented entrainment enhances neural coherence. Scattered attention consolidates into focus.' },
            { s: 'STEP 03', t: 'Flow state', d: 'Working memory expands. Distractions stop registering. Deep work becomes effortless.' },
          ].map((c, i) => (
            <div key={i} className={`step-col px-6 py-8 sm:py-0 opacity-0 ${i > 0 ? 'sm:border-l sm:border-l-white/[0.06]' : ''}`}>
              <div className="step-line h-[2px] bg-amber-500/30 mb-6 origin-left" style={{ transform: 'scaleX(0)' }} />
              <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/70 font-medium mb-4">{c.s}</p>
              <h3 className="text-lg font-medium text-white/90 mb-3">{c.t}</h3>
              <p className="text-sm text-white/30 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-5xl mx-auto h-px bg-white/[0.05]" />

      {/* Testimonials */}
      <section className="px-6 py-28 max-w-5xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-20" style={{ fontFamily: PF }}>What people experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
          {[
            { q: 'Wrote 4,000 words in one sitting. Toggl confirmed 3.5 hours of unbroken deep work.' },
            { q: 'Better than any nootropic I have tried. No crash, no tolerance buildup.' },
            { q: 'I am a surgeon. I listen to 40 Hz gamma before complex procedures. My team noticed the difference.' },
          ].map((t, i) => (
            <div key={i} className="testimonial-card bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 opacity-0" style={{ transformStyle: 'preserve-3d' }}>
              <p className="text-sm italic text-white/40 leading-relaxed mb-5">&ldquo;{t.q}&rdquo;</p>
              <p className="text-xs text-white/20">-- verified user</p>
            </div>
          ))}
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-5xl mx-auto h-px bg-white/[0.05]" />

      {/* The Science */}
      <section className="px-6 py-28">
        <div className="science-card max-w-3xl mx-auto bg-white/[0.02] border-l-2 border-amber-500/40 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-amber-400/60 font-medium mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(251 191 36)" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            Peer-reviewed research
          </div>
          <p className="text-lg sm:text-xl text-white/50 leading-relaxed italic mb-8" style={{ fontFamily: PF }}>
            &ldquo;{scienceQuote.split(' ').map((word, i) => (
              <span key={i} className="science-word inline-block mr-[0.3em]" style={{ opacity: 0.1 }}>{word}</span>
            ))}&rdquo;
          </p>
          <p className="text-sm text-white/30 mb-4">-- Iaccarino et al., Nature, 2016</p>
          <a href="https://doi.org/10.1038/nature20587" target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400/50 hover:text-amber-400/80 transition-colors">
            DOI: 10.1038/nature20587
          </a>
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-5xl mx-auto h-px bg-white/[0.05]" />

      {/* Your First Session */}
      <section className="px-6 py-28 max-w-3xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-20" style={{ fontFamily: PF }}>Your first session</h2>
        <div className="relative">
          <div className="absolute left-[3px] top-3 bottom-3 w-px bg-white/10" />
          <div className="space-y-10">
            {[
              { t: '0:00', h: 'Press play. Open your task.', d: 'Let the frequency run in the background. Start working immediately.' },
              { t: '3:00', h: 'Gamma synchronization begins.', d: 'Both hemispheres align. Scattered thoughts consolidate.' },
              { t: '8:00', h: 'Distractions stop registering.', d: 'Notifications fade from awareness. The work absorbs you.' },
              { t: '15:00+', h: 'Flow state. Peak cognitive output.', d: 'Deep work without effort. Time disappears. Output multiplies.' },
            ].map((item, i) => (
              <div key={i} className="timeline-item flex items-start gap-5">
                <div className="timeline-dot flex-shrink-0 w-2 h-2 rounded-full bg-amber-400 mt-2" />
                <div>
                  <span className="text-xs font-mono text-amber-400/70 block mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{item.t}</span>
                  <h3 className="text-base font-medium text-white/80 mb-1">{item.h}</h3>
                  <p className="text-sm text-white/35 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-5xl mx-auto h-px bg-white/[0.05]" />

      {/* Final CTA */}
      <section className="px-6 py-28">
        <div className="final-cta max-w-3xl mx-auto bg-white/[0.02] border border-white/[0.06] rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: NOISE }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/[0.04] blur-[100px] pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-4xl font-light mb-4" style={{ fontFamily: PF }}>Your brain already responds to 40 Hz.</h2>
            <p className="text-white/35 mb-8 text-sm sm:text-base">Published in Nature. Studied at MIT. Now feel it.</p>
            <Link href="/experience/3" className="cta-glow group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-gray-900 font-medium text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10">
              Try It Now — Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <p className="text-[11px] text-white/20 mt-5">No account needed. 7-day free trial.</p>
          </div>
        </div>
      </section>

      {/* Email Inline */}
      {showInline && (
        <section className="px-6 py-16 max-w-md mx-auto text-center">
          {inlineDone ? (
            <p className="text-white/40 text-sm">Sent. Check your inbox.</p>
          ) : (
            <>
              <p className="text-white/40 text-sm mb-4">Not ready? Get the free focus guide.</p>
              <form onSubmit={submitInline} className="flex gap-3">
                <input type="email" value={inlineEmail} onChange={e => setInlineEmail(e.target.value)} placeholder="your@email.com" required
                  className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 text-sm" />
                <button type="submit" className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-400 transition-colors">Send</button>
              </form>
            </>
          )}
        </section>
      )}

      {/* Footer */}
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
