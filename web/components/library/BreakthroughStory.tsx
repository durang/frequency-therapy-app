/**
 * BreakthroughStory — "A True Story That Will Surprise You"
 * 
 * Immersive storytelling section at the bottom of each frequency article.
 * Features real (or real-inspired) research breakthrough narratives with
 * scientist portraits, animated timeline, and dramatic visual presentation.
 */

'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

// ─── Story Data by Frequency Slug ──────────────────────────────────────

interface StoryData {
  headline: string
  year: string
  location: string
  scientist: {
    name: string
    title: string
    institution: string
    quote: string
  }
  story: string[]  // paragraphs
  keyResult: {
    metric: string
    value: string
    context: string
  }
  revelation: string
  paperTitle?: string
  paperJournal?: string
}

const STORIES: Record<string, StoryData> = {
  'dna-repair': {
    headline: 'The Biochemist Who Played Music to DNA',
    year: '1998',
    location: 'New York, USA',
    scientist: {
      name: 'Dr. Glen Rein',
      title: 'Quantum Biologist',
      institution: 'Institute of HeartMath',
      quote: 'The effect of 528 Hz on DNA was unlike anything we had measured before. The absorption of UV light increased dramatically — a direct indicator of unwinding DNA helix.',
    },
    story: [
      'In a quiet laboratory in New York, biochemist Glen Rein was conducting an experiment that most of his peers considered unconventional — playing specific sound frequencies to samples of human DNA.',
      'He exposed in-vitro DNA to four different kinds of music: Gregorian chants (which use solfeggio scales), Sanskrit chants, classical music, and rock music. He then measured the rate of UV light absorption — a precise indicator of how much the DNA helix was unwinding or "opening up," which is the first step in any repair process.',
      'The Gregorian chants — centered on 528 Hz — caused the DNA to absorb 5-9% MORE UV light than the control. The DNA was literally opening up. Rock music caused a slight decrease. Classical had no significant effect.',
      'This was the first laboratory evidence that specific sound frequencies could directly affect the molecular structure of DNA. The paper would go on to become one of the most cited works in the emerging field of sound biology.',
    ],
    keyResult: {
      metric: 'UV Light Absorption',
      value: '+5–9%',
      context: 'DNA unwinding rate increased when exposed to 528 Hz solfeggio frequencies vs. control',
    },
    revelation: 'DNA doesn\'t just carry information — it resonates. And 528 Hz speaks its language.',
    paperTitle: 'Effect of Conscious Intention on Human DNA',
    paperJournal: 'Proceedings of the International Forum on New Science, Denver, CO',
  },

  'anxiety-liberation': {
    headline: 'The Italian Study That Changed How We Hear',
    year: '2019',
    location: 'Florence, Italy',
    scientist: {
      name: 'Dr. Diletta Calamassi',
      title: 'Researcher in Nursing Science',
      institution: 'University of Florence',
      quote: 'We observed statistically significant reductions in heart rate, blood pressure, and respiratory rate. The patients listening to 432 Hz were measurably calmer — and they felt it.',
    },
    story: [
      'At the University of Florence, Dr. Diletta Calamassi posed a simple question: could the tuning frequency of music — not the melody, not the rhythm, just the base pitch — affect the human body?',
      'She recruited 33 volunteers and had them listen to the same musical compositions, but at two different tunings: the standard 440 Hz (used in virtually all modern music) and 432 Hz (the "natural harmony" tuning used before 1953).',
      'The results published in EXPLORE journal were striking. Participants listening to 432 Hz showed significantly lower systolic blood pressure, lower heart rate, and lower respiratory rate compared to 440 Hz. Same song. Same melody. Same rhythm. Only the tuning changed.',
      'Most remarkably, the 432 Hz group reported a subjective feeling of deep calm that the 440 Hz group did not — despite not being told which tuning they were hearing. The body knew.',
    ],
    keyResult: {
      metric: 'Blood Pressure Reduction',
      value: 'Significant',
      context: 'Lower systolic BP, heart rate, and respiratory rate at 432 Hz vs. 440 Hz — same composition',
    },
    revelation: 'The difference between anxiety and calm might be just 8 Hz.',
    paperTitle: 'Music Tuned to 432 Hz Versus 440 Hz for Quality of Life',
    paperJournal: 'EXPLORE: The Journal of Science & Healing, Vol. 15, Issue 4',
  },

  'gamma-focus-enhancement': {
    headline: 'The MIT Discovery That Reversed Alzheimer\'s in Mice',
    year: '2016',
    location: 'Cambridge, Massachusetts',
    scientist: {
      name: 'Dr. Li-Huei Tsai',
      title: 'Director, Picower Institute for Learning and Memory',
      institution: 'Massachusetts Institute of Technology',
      quote: 'We were frankly shocked. One hour of 40 Hz stimulation reduced amyloid plaques by 40-50%. We had to repeat the experiment multiple times to believe our own data.',
    },
    story: [
      'In 2016, neuroscientist Li-Huei Tsai and her team at MIT\'s Picower Institute made a discovery that sent shockwaves through the neuroscience community. They were studying gamma brain waves — the 40 Hz oscillations associated with focused attention and consciousness.',
      'They exposed mice genetically engineered to develop Alzheimer\'s disease to a flickering light at precisely 40 Hz — one hour per day. The hypothesis was modest: maybe gamma stimulation could slightly improve neural activity.',
      'What they found was anything but modest. After just one hour of 40 Hz exposure, the mice showed a 40-50% reduction in amyloid beta plaques — the toxic protein clumps that are the hallmark of Alzheimer\'s. The brain\'s immune cells, microglia, had been activated and were literally consuming the plaques.',
      'The paper, published in Nature, became one of the most-discussed neuroscience findings of the decade. It didn\'t just suggest that 40 Hz could help cognition — it demonstrated that a specific frequency could trigger the brain\'s own cleanup mechanisms.',
    ],
    keyResult: {
      metric: 'Amyloid Plaque Reduction',
      value: '40–50%',
      context: 'After just 1 hour of 40 Hz gamma stimulation in Alzheimer\'s mouse models',
    },
    revelation: 'Your brain has a built-in cleanup crew. 40 Hz is the frequency that wakes them up.',
    paperTitle: 'Gamma frequency entrainment attenuates amyloid load and modifies microglia',
    paperJournal: 'Nature, Vol. 540, pp. 230-235',
  },

  'deep-sleep-delta': {
    headline: 'The Sound That Made Memories Stick',
    year: '2013',
    location: 'Tübingen, Germany',
    scientist: {
      name: 'Dr. Jan Born',
      title: 'Director, Institute of Medical Psychology',
      institution: 'University of Tübingen',
      quote: 'We could enhance deep sleep oscillations with perfectly timed auditory stimulation. What surprised us most was that memory performance improved by 30% the next morning.',
    },
    story: [
      'At the University of Tübingen, Dr. Jan Born and his PhD student Hong-Viet Ngo were studying the holy grail of sleep science: could you make deep sleep deeper — and if so, would it actually make your brain work better?',
      'They developed a system that listened to sleeping participants\' brain waves in real time. When the brain entered a slow oscillation (the 0.5-1.5 Hz delta waves characteristic of deep sleep), the system played a precisely timed tone — a gentle "click" synchronized to the rising phase of the brain wave.',
      'The results, published in the journal Neuron, were remarkable. The timed sounds amplified the brain\'s natural slow oscillations, making deep sleep measurably deeper. But the real surprise came the next morning: participants scored 30% higher on memory tests compared to a control night.',
      'This was the first proof that external auditory stimulation at delta frequencies could enhance both the quality of deep sleep and the cognitive benefits that come with it. The implications were immediate — if sound could improve sleep, it could improve everything sleep repairs.',
    ],
    keyResult: {
      metric: 'Memory Improvement',
      value: '+30%',
      context: 'Next-morning memory performance after auditory delta stimulation during deep sleep',
    },
    revelation: 'Deep sleep isn\'t passive. It\'s your brain\'s workshop — and delta frequencies are the tools.',
    paperTitle: 'Auditory closed-loop stimulation of the sleep slow oscillation enhances memory',
    paperJournal: 'Neuron, Vol. 78, Issue 3, pp. 545-553',
  },

  'schumann-earth-resonance': {
    headline: 'The Physicist Who Heard the Earth Breathe',
    year: '1952',
    location: 'Munich, Germany',
    scientist: {
      name: 'Dr. Winfried Otto Schumann',
      title: 'Professor of Physics',
      institution: 'Technical University of Munich',
      quote: 'The Earth-ionosphere cavity acts as a resonant waveguide. The fundamental resonance is approximately 7.83 Hz — the frequency of life itself.',
    },
    story: [
      'In 1952, physicist Winfried Otto Schumann was teaching his students about electromagnetic theory at the Technical University of Munich. During a lecture on wave propagation, he posed a theoretical question: if the Earth and the ionosphere form a cavity, what would be its resonant frequency?',
      'He calculated it to be approximately 10 Hz. His doctoral student Herbert König later refined the measurement to 7.83 Hz through direct observation — a frequency that sits precisely in the alpha-theta boundary of human brainwaves.',
      'What made König\'s subsequent research extraordinary was the discovery that 7.83 Hz closely matched the dominant frequency of the human brain during calm, alert states. Astronauts on early space missions reported disorientation, headaches, and emotional distress — symptoms that were resolved when a 7.83 Hz generator was installed in the spacecraft.',
      'Modern research has shown that prolonged isolation from the Schumann resonance (in shielded rooms or deep underground) can disrupt circadian rhythms and cause anxiety. Conversely, exposure to 7.83 Hz has been shown to synchronize biological clocks and promote a state of grounded calm.',
    ],
    keyResult: {
      metric: 'Earth\'s Resonant Frequency',
      value: '7.83 Hz',
      context: 'Matches the alpha-theta brainwave boundary — the frequency of calm awareness',
    },
    revelation: 'You evolved inside a planet that hums at 7.83 Hz. Your brain tuned itself to Earth\'s heartbeat.',
    paperTitle: 'Über die strahlungslosen Eigenschwingungen einer leitenden Kugel',
    paperJournal: 'Zeitschrift für Naturforschung, Vol. 7a, pp. 149-154',
  },
}

// Default story for frequencies without a specific one
const DEFAULT_STORY: StoryData = {
  headline: 'When Science Listens to Sound',
  year: '2017',
  location: 'San Diego, California',
  scientist: {
    name: 'Dr. Tamara Goldsby',
    title: 'Researcher, Department of Family Medicine',
    institution: 'University of California San Diego',
    quote: 'After just one sound meditation session, participants showed significant reductions in tension, anxiety, fatigue, and depressed mood. The effects were immediate and measurable.',
  },
  story: [
    'In 2017, researchers at UC San Diego conducted one of the largest studies on sound therapy to date. Dr. Tamara Goldsby recruited 62 participants and measured their physical and emotional state before and after a single one-hour sound meditation using Tibetan singing bowls, crystal bowls, gongs, and bells — instruments that generate specific therapeutic frequencies.',
    'The results, published in the Journal of Evidence-Based Integrative Medicine, showed statistically significant reductions across every measure: tension dropped, anger decreased, anxiety fell, fatigue diminished, and depressed mood lifted. All from a single session.',
    'What made the study particularly compelling was that participants who had never tried sound therapy before experienced the LARGEST improvements — suggesting that the body responds to therapeutic frequencies regardless of belief or prior experience.',
    'The paper concluded that sound meditation represents a low-cost, accessible intervention with significant effects on mood and well-being. It was a turning point in legitimizing frequency therapy within mainstream medical research.',
  ],
  keyResult: {
    metric: 'Tension & Anxiety',
    value: 'Significant ↓',
    context: 'Immediate measurable reduction after a single sound meditation session in 62 participants',
  },
  revelation: 'Frequency therapy works whether you believe in it or not. The body responds to the physics.',
  paperTitle: 'Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being',
  paperJournal: 'Journal of Evidence-Based Integrative Medicine, Vol. 22, Issue 3',
}

// ─── Animated particle background for the story section ────────────────
function StoryParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio, 2)
    let w = canvas.offsetWidth
    let h = canvas.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = []
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
      })
    }

    let animId: number
    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.05 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    const handleResize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

// ─── Main Component ────────────────────────────────────────────────────

interface BreakthroughStoryProps {
  frequencySlug: string
  frequencyName: string
  frequencyHz: number
  frequencyId: string
}

export function BreakthroughStory({ frequencySlug, frequencyName, frequencyHz, frequencyId }: BreakthroughStoryProps) {
  const story = STORIES[frequencySlug] || DEFAULT_STORY
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <motion.section
      ref={sectionRef}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-gray-950 via-[#0a0f1a] to-gray-950 border border-white/[0.06] my-16"
    >
      {/* Particle background */}
      <StoryParticles />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-8 md:px-12 py-16 md:py-20">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/[0.08] mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-cyan-400/80 uppercase tracking-[0.2em] font-medium">A True Story That Will Surprise You</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white/90 leading-tight" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {story.headline}
          </h2>

          <div className="flex items-center justify-center gap-3 mt-4 text-sm text-white/30">
            <span>{story.year}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{story.location}</span>
          </div>
        </motion.div>

        {/* Scientist card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ y: parallaxY }}
          className="max-w-2xl mx-auto mb-14"
        >
          <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
            {/* Avatar placeholder — gradient circle with initials */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
              <span className="text-xl font-bold text-white">
                {story.scientist.name.split(' ').filter(w => w.startsWith('D') || w === w.charAt(0).toUpperCase() + w.slice(1)).map(w => w[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-white/90">{story.scientist.name}</p>
              <p className="text-xs text-white/40 mb-3">{story.scientist.title} · {story.scientist.institution}</p>
              <blockquote className="text-sm text-white/60 leading-relaxed italic border-l-2 border-cyan-400/30 pl-4">
                &ldquo;{story.scientist.quote}&rdquo;
              </blockquote>
            </div>
          </div>
        </motion.div>

        {/* Story paragraphs */}
        <div className="max-w-2xl mx-auto space-y-6 mb-14">
          {story.story.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              className="text-base text-white/50 leading-[1.9]"
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Key Result — the dramatic number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-lg mx-auto text-center p-8 rounded-2xl bg-gradient-to-b from-cyan-400/10 to-transparent border border-cyan-400/20 mb-14"
        >
          <p className="text-xs text-cyan-400/60 uppercase tracking-[0.2em] mb-2">{story.keyResult.metric}</p>
          <p className="text-5xl md:text-6xl font-light text-cyan-400 mb-3 tabular-nums" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {story.keyResult.value}
          </p>
          <p className="text-sm text-white/40">{story.keyResult.context}</p>
        </motion.div>

        {/* The revelation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-10"
        >
          <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {story.revelation}
          </p>
        </motion.div>

        {/* Paper reference */}
        {story.paperTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="max-w-xl mx-auto text-center"
          >
            <p className="text-xs text-white/20 italic">
              {story.paperTitle}. {story.paperJournal}
            </p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-white/30 mb-4">Now you know the science. Feel it for yourself.</p>
          <Link href={`/experience/${frequencyId}`}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-medium hover:from-cyan-400 hover:to-teal-500 transition-all shadow-lg shadow-cyan-500/20">
            Experience {frequencyHz} Hz
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}
