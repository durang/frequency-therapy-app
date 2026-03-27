'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePanelAudioEngine } from '@/lib/panelAudioEngine'

interface WaveformVisualizerProps {
  frequencyId: string
  height?: number
  width?: number
  className?: string
  showFrequencyDomain?: boolean
  animationSpeed?: number
}

export function WaveformVisualizer({ 
  frequencyId, 
  height = 100, 
  width = 300, 
  className = '',
  showFrequencyDomain = true,
  animationSpeed = 60 // FPS
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const { getMasterAnalysis, getFrequencyAnalysis } = usePanelAudioEngine()
  
  // Performance tracking
  const [renderMetrics, setRenderMetrics] = useState({
    fps: 0,
    lastFrameTime: 0,
    frameCount: 0,
    renderTime: 0
  })
  
  const [isActive, setIsActive] = useState(false)
  const fpsCounterRef = useRef({ lastTime: 0, frameCount: 0 })
  const lastRenderTimeRef = useRef(0)

  // Get audio analysis data
  const getAnalysisData = useCallback(() => {
    if (frequencyId === 'master') {
      return getMasterAnalysis()
    }
    return getFrequencyAnalysis(frequencyId)
  }, [frequencyId, getMasterAnalysis, getFrequencyAnalysis])

  // Draw waveform visualization
  const drawWaveform = useCallback((
    ctx: CanvasRenderingContext2D,
    waveformData: Uint8Array,
    frequencies: Uint8Array,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const startTime = performance.now()
    
    // Clear canvas with dark background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.1)') // quantum-500 with opacity
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)') // neural-500 with opacity
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    if (showFrequencyDomain && frequencies) {
      // Draw frequency domain (spectrum analyzer style)
      drawFrequencySpectrum(ctx, frequencies, canvasWidth, canvasHeight)
    } else if (waveformData) {
      // Draw time domain (oscilloscope style)
      drawTimeDomainWaveform(ctx, waveformData, canvasWidth, canvasHeight)
    }
    
    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight)
    
    // Track render performance
    const renderTime = performance.now() - startTime
    setRenderMetrics(prev => ({
      ...prev,
      renderTime: renderTime,
      frameCount: prev.frameCount + 1
    }))
    
    lastRenderTimeRef.current = renderTime
  }, [showFrequencyDomain])

  // Draw frequency spectrum bars
  const drawFrequencySpectrum = (
    ctx: CanvasRenderingContext2D,
    frequencies: Uint8Array,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const barWidth = canvasWidth / frequencies.length * 2.5
    let x = 0

    for (let i = 0; i < frequencies.length; i++) {
      const barHeight = (frequencies[i] / 255) * canvasHeight * 0.8

      // Create gradient for each bar
      const barGradient = ctx.createLinearGradient(0, canvasHeight, 0, canvasHeight - barHeight)
      
      // Color based on frequency intensity
      if (frequencies[i] < 85) {
        barGradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)') // green-500
        barGradient.addColorStop(1, 'rgba(34, 197, 94, 0.4)')
      } else if (frequencies[i] < 170) {
        barGradient.addColorStop(0, 'rgba(234, 179, 8, 0.8)') // yellow-500
        barGradient.addColorStop(1, 'rgba(234, 179, 8, 0.4)')
      } else {
        barGradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)') // red-500
        barGradient.addColorStop(1, 'rgba(239, 68, 68, 0.4)')
      }

      ctx.fillStyle = barGradient
      ctx.fillRect(x, canvasHeight - barHeight, barWidth - 1, barHeight)

      x += barWidth
    }
  }

  // Draw time domain waveform
  const drawTimeDomainWaveform = (
    ctx: CanvasRenderingContext2D,
    waveformData: Uint8Array,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.8)' // quantum-500
    ctx.beginPath()

    const sliceWidth = canvasWidth / waveformData.length
    let x = 0

    for (let i = 0; i < waveformData.length; i++) {
      const v = waveformData[i] / 128.0
      const y = v * canvasHeight / 2

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      x += sliceWidth
    }

    ctx.stroke()

    // Add glow effect
    ctx.shadowColor = 'rgba(124, 58, 237, 0.5)'
    ctx.shadowBlur = 3
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const currentTime = performance.now()
    const targetInterval = 1000 / animationSpeed

    // Throttle animation to target FPS
    if (currentTime - fpsCounterRef.current.lastTime >= targetInterval) {
      const analysisData = getAnalysisData()
      
      if (analysisData) {
        setIsActive(true)
        drawWaveform(
          ctx,
          analysisData.waveform,
          analysisData.frequencies,
          canvas.width,
          canvas.height
        )
      } else {
        setIsActive(false)
        // Draw inactive state
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw placeholder
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.strokeRect(10, canvas.height / 2 - 20, canvas.width - 20, 40)
        ctx.setLineDash([])
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.font = '12px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('No Signal', canvas.width / 2, canvas.height / 2 + 4)
      }

      fpsCounterRef.current.lastTime = currentTime
      fpsCounterRef.current.frameCount++
    }

    // Calculate FPS every second
    if (currentTime - renderMetrics.lastFrameTime >= 1000) {
      const fps = fpsCounterRef.current.frameCount
      setRenderMetrics(prev => ({
        ...prev,
        fps: fps,
        lastFrameTime: currentTime
      }))
      fpsCounterRef.current.frameCount = 0
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [getAnalysisData, animationSpeed, drawWaveform, renderMetrics.lastFrameTime])

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    const devicePixelRatio = window.devicePixelRatio || 1
    
    canvas.width = (width || rect.width) * devicePixelRatio
    canvas.height = height * devicePixelRatio
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, width, height])

  // Performance logging for observability
  useEffect(() => {
    if (renderMetrics.frameCount > 0 && renderMetrics.frameCount % 300 === 0) { // Log every 5 seconds at 60fps
      console.log('📊 [WaveformVisualizer] Performance metrics:', {
        frequencyId,
        fps: renderMetrics.fps,
        renderTime: renderMetrics.renderTime?.toFixed(2) + 'ms',
        isActive,
        frameCount: renderMetrics.frameCount
      })
    }
  }, [renderMetrics.frameCount, renderMetrics.fps, renderMetrics.renderTime, frequencyId, isActive])

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: width || '100%', height: `${height}px` }}
        className="rounded-md bg-black/20 border border-white/10"
      />
      
      {/* Performance Overlay (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-1 right-1 text-xs text-white/50 bg-black/50 px-2 py-1 rounded">
          <div>{renderMetrics.fps} FPS</div>
          <div>{lastRenderTimeRef.current.toFixed(1)}ms</div>
        </div>
      )}
      
      {/* Status Indicator */}
      <div className="absolute top-2 left-2">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
      </div>
      
      {/* Waveform Type Indicator */}
      <div className="absolute bottom-1 left-1 text-xs text-white/30 font-mono">
        {showFrequencyDomain ? 'FREQ' : 'WAVE'}
      </div>
      
      {/* Frequency ID */}
      <div className="absolute bottom-1 right-1 text-xs text-white/30 font-mono">
        {frequencyId === 'master' ? 'MST' : frequencyId.slice(-3).toUpperCase()}
      </div>
    </div>
  )
}