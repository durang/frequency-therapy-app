'use client'

import { useRef, useEffect, useCallback } from 'react'

interface AmbientCanvasProps {
  frequency: number
  isPlaying: boolean
  color?: string
}

interface Orb {
  x: number
  y: number
  radius: number
  baseRadius: number
  vx: number
  vy: number
  phase: number
  hue: number
  opacity: number
}

export default function AmbientCanvas({ frequency, isPlaying, color }: AmbientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  const initOrbs = useCallback((w: number, h: number) => {
    const count = 6
    const orbs: Orb[] = []
    for (let i = 0; i < count; i++) {
      orbs.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 60 + Math.random() * 120,
        baseRadius: 60 + Math.random() * 120,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        hue: 200 + Math.random() * 60, // blue-teal range
        opacity: 0.04 + Math.random() * 0.06,
      })
    }
    orbsRef.current = orbs
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio, 2)

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
      if (orbsRef.current.length === 0) {
        initOrbs(window.innerWidth, window.innerHeight)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    let lastTime = performance.now()

    const draw = (now: number) => {
      const delta = (now - lastTime) / 1000
      lastTime = now
      if (delta > 0.1) {
        animRef.current = requestAnimationFrame(draw)
        return // skip large gaps
      }

      timeRef.current += delta
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      // Slow frequency-driven pulse
      const pulse = isPlaying
        ? 1 + Math.sin(timeRef.current * (frequency / 100)) * 0.15
        : 1

      for (const orb of orbsRef.current) {
        // drift
        orb.x += orb.vx * delta * 60
        orb.y += orb.vy * delta * 60

        // wrap
        if (orb.x < -orb.radius) orb.x = w + orb.radius
        if (orb.x > w + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius) orb.y = h + orb.radius
        if (orb.y > h + orb.radius) orb.y = -orb.radius

        // breathe
        const breathe = Math.sin(timeRef.current * 0.5 + orb.phase) * 0.2
        orb.radius = orb.baseRadius * (1 + breathe) * pulse

        // render soft glow
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        )
        gradient.addColorStop(0, `hsla(${orb.hue}, 60%, 50%, ${orb.opacity * 1.5})`)
        gradient.addColorStop(0.5, `hsla(${orb.hue}, 50%, 40%, ${orb.opacity * 0.8})`)
        gradient.addColorStop(1, `hsla(${orb.hue}, 40%, 30%, 0)`)

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [frequency, isPlaying, initOrbs])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
