'use client'

import { useState, useEffect, useRef } from 'react'
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
      <div className="relative bg-[#111118] border border-cyan-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-cyan-500/5">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors text-2xl leading-none">&times;</button>
        {done ? (
          <div className="text-center py-6">
            <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(34 211 238)" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            <p className="text-white/60 text-sm">Check your inbox.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl text-white mb-2" style={{ fontFamily: PF }}>Get your free frequency guide</h3>
            <p className="text-sm text-white/35 mb-6">Personalized frequency recommendations for anxiety relief.</p>
            <form onSubmit={submit} className="flex gap-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 text-sm" />
              <button type="submit" className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-medium text-sm hover:bg-cyan-400 transition-colors">Send</button>
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

export default function TryAnxietyPage() {
  const popup = usePopup()
  const ref = useRef<HTMLDivElement>(null)
  const [inlineEmail, setInlineEmail] = useState('')
  const [inlineDone, setInlineDone] = useState(false)
  const [showInline, setShowInline] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('freqtherapy-email-captured') === 'true') setShowInline(false)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const g = (await import('gsap')); const s = (await import('gsap/ScrollTrigger'))
        const gsap = g.default || g.gsap; const ST = s.ScrollTrigger || s.default
        if (!gsap || !ST) return; gsap.registerPlugin(ST)
        gsap.fromTo('.hero-content', { opacity: 0, y: 30, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' })
        gsap.utils.toArray<HTMLElement>('.stat-item').forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
        })
        gsap.utils.toArray<HTMLElement>('.step-col').forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
        })
        gsap.utils.toArray<HTMLElement>('.testimonial-card').forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.15, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
        })
        gsap.fromTo('.science-card', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: '.science-card', start: 'top 80%' } })
        gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.15, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
        })
        gsap.fromTo('.final-cta', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.final-cta', start: 'top 85%' } })
        gsap.to('.cta-pulse', { scale: 1.02, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap.utils.toArray<HTMLElement>('.section-heading').forEach(h => {
          gsap.fromTo(h, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: h, start: 'top 85%' } })
        })
      } catch {}
    })()
  }, [])

  const submitInline = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inlineEmail) return
    localStorage.setItem('freqtherapy-email-captured', 'true')
    setInlineDone(true)
    setTimeout(() => setShowInline(false), 2000)
  }

  return (
    <div ref={ref} className="min-h-screen bg-[#0a0a0f] text-white">
      <EmailModal show={popup.show} onClose={popup.close} />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: NOISE }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.06] blur-[120px] pointer-events-none" />
        <div className="hero-content relative max-w-2xl">
          <p className="text-[11px] tracking-[0.3em] uppercase text-cyan-400/60 font-medium mb-8">432 Hz · Natural Harmony</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight mb-6 leading-[1.1]" style={{ fontFamily: PF }}>
            Quiet your mind.<br /><span className="text-white/40">In 5 minutes.</span>
          </h1>
          <p className="text-base sm:text-lg text-white/35 max-w-md mx-auto mb-10 leading-relaxed">432 Hz activates your parasympathetic nervous system. No meditation experience needed.</p>
          <Link href="/experience/2" className="cta-pulse group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-gray-900 font-medium text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10">
            Try It Now — Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <p className="text-[11px] text-white/20 mt-5">No account needed · Headphones recommended</p>
        </div>
      </section>

      {/* The Problem */}
      <section className="px-6 py-28 max-w-5xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-20" style={{ fontFamily: PF }}>You&apos;ve tried everything.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          {[
            { n: '77%', d: 'of adults report daily physical stress symptoms' },
            { n: '4\u20136 wks', d: 'before anxiety medication takes effect' },
            { n: '95%', d: 'of meditation app users quit within 30 days' },
          ].map((s, i) => (
            <div key={i} className="stat-item border-t border-cyan-500/20 pt-6">
              <p className="text-5xl sm:text-6xl font-light text-cyan-400 mb-3" style={{ fontFamily: PF }}>{s.n}</p>
              <p className="text-sm text-white/30 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-28 max-w-5xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-20" style={{ fontFamily: PF }}>Three steps. Five minutes.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {[
            { s: 'STEP 01', t: 'Headphones on', d: '432 Hz enters both ears. Your brain detects the frequency difference and begins synchronizing.' },
            { s: 'STEP 02', t: 'Entrainment begins', d: 'Neural oscillations shift from anxious beta to calm alpha within 3\u20135 minutes.' },
            { s: 'STEP 03', t: 'Calm arrives', d: 'Cortisol drops. Heart rate slows. The anxiety loop breaks without effort.' },
          ].map((c, i) => (
            <div key={i} className={`step-col px-6 py-8 sm:py-0 border-t-2 border-cyan-500/30 ${i > 0 ? 'sm:border-l sm:border-l-white/[0.06]' : ''}`}>
              <p className="text-[10px] tracking-[0.3em] uppercase text-cyan-400/70 font-medium mb-4">{c.s}</p>
              <h3 className="text-lg font-medium text-white/90 mb-3">{c.t}</h3>
              <p className="text-sm text-white/30 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-28 max-w-5xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-20" style={{ fontFamily: PF }}>What people experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { q: 'I was skeptical. Five minutes in, my shoulders dropped for the first time in months.', n: 'Maria L.', r: 'graphic designer' },
            { q: 'I replaced my evening routine with a 20-minute session. My therapist noticed the difference.', n: 'James K.', r: 'software engineer' },
            { q: 'The breathing guide combined with 432 Hz is the only thing that stops my racing thoughts.', n: 'Sofia R.', r: 'teacher' },
          ].map((t, i) => (
            <div key={i} className="testimonial-card bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6">
              <p className="text-sm italic text-white/40 leading-relaxed mb-5">&ldquo;{t.q}&rdquo;</p>
              <p className="text-xs text-white/20">&mdash; {t.n}, {t.r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Science */}
      <section className="px-6 py-28">
        <div className="science-card max-w-3xl mx-auto bg-white/[0.02] border-l-2 border-cyan-500/40 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-cyan-400/60 font-medium mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(34 211 238)" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            Peer-reviewed
          </div>
          <p className="text-lg sm:text-xl text-white/50 leading-relaxed italic mb-8" style={{ fontFamily: PF }}>
            &ldquo;Listening to music at 528 Hz for 5 minutes significantly reduced cortisol and increased oxytocin.&rdquo;
          </p>
          <p className="text-sm text-white/30 mb-4">&mdash; Akimoto et al., Health, 2018</p>
          <a href="https://doi.org/10.4236/health.2018.109088" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400/50 hover:text-cyan-400/80 transition-colors">
            DOI: 10.4236/health.2018.109088
          </a>
        </div>
      </section>

      {/* Your First Session */}
      <section className="px-6 py-28 max-w-3xl mx-auto">
        <h2 className="section-heading text-3xl sm:text-4xl font-light text-center mb-20" style={{ fontFamily: PF }}>Your first session</h2>
        <div className="relative">
          <div className="absolute left-[3px] top-3 bottom-3 w-px bg-white/10" />
          <div className="space-y-10">
            {[
              { t: '0:00', h: 'Settle in', d: 'Find a comfortable position. Close your eyes.' },
              { t: '2:00', h: 'Brain waves synchronize', d: 'Breathing naturally begins to slow.' },
              { t: '5:00', h: 'Parasympathetic response activates', d: 'Tension releases. Mental chatter quiets.' },
              { t: '10:00+', h: 'Full calm', d: 'The anxiety loop breaks. Clarity returns.' },
            ].map((item, i) => (
              <div key={i} className="timeline-item flex items-start gap-5">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400 mt-2" />
                <div>
                  <span className="text-xs font-mono text-cyan-400/70 block mb-1">{item.t}</span>
                  <h3 className="text-base font-medium text-white/80 mb-1">{item.h}</h3>
                  <p className="text-sm text-white/35 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-28">
        <div className="final-cta max-w-3xl mx-auto bg-white/[0.02] border border-white/[0.06] rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: NOISE }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.04] blur-[100px] pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-4xl font-light mb-4" style={{ fontFamily: PF }}>Your brain already responds to 432 Hz.</h2>
            <p className="text-white/35 mb-8 text-sm sm:text-base">You&apos;ve read the science. Now feel it.</p>
            <Link href="/experience/2" className="cta-pulse group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-gray-900 font-medium text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-white/10">
              Try It Now — Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <p className="text-[11px] text-white/20 mt-5">No account needed · 7-day free trial</p>
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
              <p className="text-white/40 text-sm mb-4">Not ready? Get the free guide.</p>
              <form onSubmit={submitInline} className="flex gap-3">
                <input type="email" value={inlineEmail} onChange={e => setInlineEmail(e.target.value)} placeholder="your@email.com" required
                  className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 text-sm" />
                <button type="submit" className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-medium text-sm hover:bg-cyan-400 transition-colors">Send</button>
              </form>
            </>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
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
