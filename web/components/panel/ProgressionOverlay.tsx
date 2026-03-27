'use client'

import { useEffect, useRef, useCallback, memo } from 'react'
import { useProgression } from '@/lib/progressionState'
import { usePanelAudioEngine } from '@/lib/panelAudioEngine'

// ---------------------------------------------------------------------------
// Particle type and pool
// ---------------------------------------------------------------------------

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  life: number
  maxLife: number
  hue: number
  /** Index into connections array for neural-mode (L7+) */
  id: number
}

// ---------------------------------------------------------------------------
// Configuration per level tier
// ---------------------------------------------------------------------------

interface TierConfig {
  maxParticles: number
  baseSpeed: number
  baseRadius: number
  trailAlpha: number // 0 = no trail, higher = more persistent trail
  connectLines: boolean // neural network style
  audioReactive: boolean
}

function getTierConfig(level: number): TierConfig {
  if (level <= 1) return { maxParticles: 0, baseSpeed: 0, baseRadius: 0, trailAlpha: 0, connectLines: false, audioReactive: false }
  if (level <= 3) return { maxParticles: 15, baseSpeed: 0.3, baseRadius: 2, trailAlpha: 0, connectLines: false, audioReactive: false }
  if (level <= 5) return { maxParticles: 35, baseSpeed: 0.5, baseRadius: 2.5, trailAlpha: 0.02, connectLines: false, audioReactive: true }
  if (level === 6) return { maxParticles: 60, baseSpeed: 0.8, baseRadius: 3, trailAlpha: 0.06, connectLines: false, audioReactive: true }
  // level 7+
  return { maxParticles: 80, baseSpeed: 0.6, baseRadius: 2.5, trailAlpha: 0.04, connectLines: true, audioReactive: true }
}

// ---------------------------------------------------------------------------
// Color helpers — read from CSS custom properties at render time
// ---------------------------------------------------------------------------

function parseParticleColor(el: HTMLElement | null): { r: number; g: number; b: number } {
  if (!el) return { r: 99, g: 102, b: 241 }
  const raw = getComputedStyle(el).getPropertyValue('--progression-particle-color').trim()
  const match = raw.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (match) return { r: +match[1], g: +match[2], b: +match[3] }
  return { r: 99, g: 102, b: 241 }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ProgressionOverlayInner() {
  const { level, unlockedEffects } = useProgression()
  const { getMasterAnalysis } = usePanelAudioEngine()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const nextIdRef = useRef(0)
  const lastTimeRef = useRef(0)

  // --------------------------------------------------
  // Particle factory (object pool reuse)
  // --------------------------------------------------
  const spawnParticle = useCallback((w: number, h: number, cfg: TierConfig): Particle => {
    const edge = Math.random()
    let x: number, y: number
    if (edge < 0.25) { x = Math.random() * w; y = -10 }
    else if (edge < 0.5) { x = Math.random() * w; y = h + 10 }
    else if (edge < 0.75) { x = -10; y = Math.random() * h }
    else { x = w + 10; y = Math.random() * h }

    const angle = Math.atan2(h / 2 - y, w / 2 - x) + (Math.random() - 0.5) * 1.5
    const speed = cfg.baseSpeed * (0.5 + Math.random())

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: cfg.baseRadius * (0.6 + Math.random() * 0.8),
      alpha: 0,
      life: 0,
      maxLife: 300 + Math.random() * 400,
      hue: Math.random() * 30 - 15, // slight hue variance
      id: nextIdRef.current++,
    }
  }, [])

  // --------------------------------------------------
  // Main animation loop
  // --------------------------------------------------
  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Delta time cap — skip frame if we're lagging hard (> 33ms ≈ 30fps floor)
    const delta = timestamp - (lastTimeRef.current || timestamp)
    lastTimeRef.current = timestamp
    if (delta > 50) {
      // Too slow, skip this frame entirely to catch up
      animFrameRef.current = requestAnimationFrame(animate)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const cfg = getTierConfig(level)

    // -- Audio reactivity ---------------------------------------------------
    let audioEnergy = 0
    if (cfg.audioReactive) {
      const analysis = getMasterAnalysis()
      if (analysis) {
        const freqs = analysis.frequencies
        let sum = 0
        for (let i = 0; i < freqs.length; i++) sum += freqs[i]
        audioEnergy = sum / (freqs.length * 255) // 0..1
      }
    }

    // -- Clear canvas (with optional trail) ---------------------------------
    if (cfg.trailAlpha > 0) {
      ctx.fillStyle = `rgba(0,0,0,${0.15 + (1 - cfg.trailAlpha) * 0.1})`
      ctx.fillRect(0, 0, w, h)
    } else {
      ctx.clearRect(0, 0, w, h)
    }

    // -- Read particle color from CSS var ------------------------------------
    const { r, g, b } = parseParticleColor(containerRef.current)

    // -- Spawn / cull particles ---------------------------------------------
    const particles = particlesRef.current
    while (particles.length < cfg.maxParticles) {
      particles.push(spawnParticle(w, h, cfg))
    }

    // -- Update & draw particles --------------------------------------------
    const alive: Particle[] = []
    for (const p of particles) {
      p.life++

      // Fade in / out
      const lifePct = p.life / p.maxLife
      if (lifePct < 0.1) p.alpha = lifePct / 0.1
      else if (lifePct > 0.8) p.alpha = (1 - lifePct) / 0.2
      else p.alpha = 1

      // Audio-reactive size boost
      const audioBoost = cfg.audioReactive ? 1 + audioEnergy * 1.5 : 1

      // Move
      p.x += p.vx * (1 + audioEnergy * 0.5)
      p.y += p.vy * (1 + audioEnergy * 0.5)

      // Kill if off-screen with margin or expired
      if (p.life >= p.maxLife || p.x < -50 || p.x > w + 50 || p.y < -50 || p.y > h + 50) {
        continue // don't push to alive
      }

      alive.push(p)

      // Draw circle
      const drawRadius = p.radius * audioBoost
      ctx.beginPath()
      ctx.arc(p.x, p.y, drawRadius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},${(p.alpha * 0.7).toFixed(2)})`
      ctx.fill()

      // Glow halo for higher levels
      if (level >= 4) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, drawRadius * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${(p.alpha * 0.12).toFixed(2)})`
        ctx.fill()
      }
    }

    particlesRef.current = alive

    // -- Neural connection lines (L7+) --------------------------------------
    if (cfg.connectLines && alive.length > 1) {
      const connectionDist = 120
      ctx.lineWidth = 0.5
      for (let i = 0; i < alive.length; i++) {
        for (let j = i + 1; j < alive.length; j++) {
          const dx = alive[i].x - alive[j].x
          const dy = alive[i].y - alive[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectionDist) {
            const lineAlpha = (1 - dist / connectionDist) * 0.25 * Math.min(alive[i].alpha, alive[j].alpha)
            ctx.strokeStyle = `rgba(${r},${g},${b},${lineAlpha.toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(alive[i].x, alive[i].y)
            ctx.lineTo(alive[j].x, alive[j].y)
            ctx.stroke()
          }
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)
  }, [level, getMasterAnalysis, spawnParticle])

  // --------------------------------------------------
  // Canvas setup and resize
  // --------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // cap at 2× for perf
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    // Start animation loop
    particlesRef.current = []
    lastTimeRef.current = 0
    animFrameRef.current = requestAnimationFrame(animate)

    console.log(`✨ [ProgressionOverlay] Started — level ${level}, tier config:`, getTierConfig(level))

    return () => {
      window.removeEventListener('resize', resize)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      particlesRef.current = []
    }
  }, [animate, level])

  // Don't render anything below level 2
  if (level < 2) return null

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
    </div>
  )
}

export const ProgressionOverlay = memo(ProgressionOverlayInner)
