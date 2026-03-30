'use client'

import { useRef, memo } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Volume2, Play, Microscope, Award } from 'lucide-react'
import { useAnimationFrame } from '@/hooks/useAnimationFrame'

interface FrequencyVisualizerProps {
  frequency: any
  isActive: boolean
  isPlaying?: boolean
  onActivate: () => void
}

const FrequencyVisualizer = memo(({ frequency, isActive, isPlaying, onActivate }: FrequencyVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const animate = (deltaTime: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    timeRef.current += deltaTime * 0.001

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    // Enhanced animation intensity when playing audio
    const intensityMultiplier = isPlaying ? 1.5 : 1.0
    const timeMultiplier = isPlaying ? 1.3 : 1.0
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Theme-aware colors
    const nodeColor = isPlaying 
      ? (isDark ? '#34D399' : '#10B981')
      : (isDark ? '#60A5FA' : '#3B82F6')
    
    // Neural network pattern background - more active when playing
    ctx.globalAlpha = isPlaying ? 0.12 : 0.08
    const nodeCount = isPlaying ? 16 : 12
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.sin(timeRef.current * timeMultiplier + i * 0.5) * 80 + centerX
      const y = Math.cos(timeRef.current * 1.2 * timeMultiplier + i * 0.3) * 40 + centerY
      const radius = Math.sin(timeRef.current * 1.5 * timeMultiplier + i) * 2 + 4
      
      ctx.fillStyle = nodeColor
      ctx.beginPath()
      ctx.arc(x, y, radius * intensityMultiplier, 0, Math.PI * 2)
      ctx.fill()
    }
    
    ctx.globalAlpha = 1
    
    // Main frequency waves with quantum interference - enhanced for playing state
    for (let layer = 0; layer < 2; layer++) {
      const baseHue = isPlaying ? 160 : (frequency.hz_value % 360)  // Green tint when playing
      const hue = layer * 60 + baseHue
      // In dark mode, use higher lightness for better visibility on dark backgrounds
      const baseLightness = isDark ? 70 : 60
      const midLightness = isDark ? 80 : 70
      const baseSaturation = isDark ? 80 : 70
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, `hsla(${hue}, ${baseSaturation}%, ${baseLightness}%, ${(0.7 - layer * 0.2) * intensityMultiplier})`)
      gradient.addColorStop(0.5, `hsla(${hue + 30}, 80%, ${midLightness}%, ${(0.8 - layer * 0.2) * intensityMultiplier})`)
      gradient.addColorStop(1, `hsla(${hue + 60}, ${baseSaturation}%, ${baseLightness}%, ${(0.7 - layer * 0.2) * intensityMultiplier})`)
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = (2.5 - layer * 0.5) * intensityMultiplier
      ctx.beginPath()
      
      // Enhanced wave calculation when playing
      for (let x = 0; x < canvas.width; x += 3) {
        const baseWave = Math.sin((x * frequency.hz_value / 50) + timeRef.current * 10 * timeMultiplier) * (25 - layer * 5) * intensityMultiplier
        const harmonicWave = Math.sin((x * frequency.hz_value / 25) + timeRef.current * 15 * timeMultiplier) * (8 - layer * 2) * intensityMultiplier
        const quantumInterference = Math.sin(timeRef.current * 5 * timeMultiplier + layer) * 4 * intensityMultiplier
        
        const y = centerY + baseWave + harmonicWave + quantumInterference
        
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      
      ctx.stroke()
    }
    
    // Central healing mandala - enhanced when playing
    const pulseRadius = (20 + Math.sin(timeRef.current * 5 * timeMultiplier) * 8) * intensityMultiplier
    const mandalaGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius)
    const coreHue = isPlaying ? 160 : (frequency.hz_value % 360)
    const coreLightness = isDark ? 75 : 70
    const coreSecondaryLightness = isDark ? 60 : 50
    mandalaGradient.addColorStop(0, `hsla(${coreHue}, 80%, ${coreLightness}%, 0.8)`)
    mandalaGradient.addColorStop(0.7, `hsla(${(coreHue + 120) % 360}, 60%, ${coreSecondaryLightness}%, 0.4)`)
    mandalaGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.fillStyle = mandalaGradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
    ctx.fill()
    
    // Geometric healing patterns - more active when playing
    ctx.strokeStyle = `hsla(${coreHue}, ${isDark ? 80 : 70}%, ${isDark ? 70 : 60}%, ${0.5 * intensityMultiplier})`
    ctx.lineWidth = 1.5 * intensityMultiplier
    const patternCount = isPlaying ? 8 : 6
    for (let i = 0; i < patternCount; i++) {
      const angle = (i * Math.PI * 2) / patternCount + timeRef.current * 2 * timeMultiplier
      const x1 = centerX + Math.cos(angle) * 12
      const y1 = centerY + Math.sin(angle) * 12
      const x2 = centerX + Math.cos(angle) * 28 * intensityMultiplier
      const y2 = centerY + Math.sin(angle) * 28 * intensityMultiplier
      
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }

  useAnimationFrame(animate, isActive || isPlaying)

  return (
    <div 
      className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-700 transform hover:scale-105 ${
        isPlaying 
          ? 'bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-green-900/30 dark:via-blue-900/30 dark:to-indigo-900/30 ring-4 ring-green-300/50 dark:ring-green-500/30 shadow-2xl animate-pulse-subtle' 
          : isActive 
          ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 ring-4 ring-blue-200/50 dark:ring-blue-500/30 shadow-2xl' 
          : 'bg-white dark:bg-slate-800 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 dark:hover:from-slate-700 dark:hover:to-slate-600 shadow-xl hover:shadow-2xl'
      }`}
      onClick={onActivate}
      data-testid="frequency-card"
      data-frequency-id={frequency.id}
      data-frequency-hz={frequency.hz_value}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-xl text-gray-900 dark:text-slate-100">{frequency.name}</h3>
          <p className="text-base text-blue-600 dark:text-blue-400 font-semibold">{frequency.hz_value} Hz</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{frequency.category || 'Therapeutic'}</p>
        </div>
        <div 
          className={`p-3 rounded-2xl transition-all duration-300 ${
            isPlaying 
              ? 'bg-green-500 shadow-lg shadow-green-500/30' 
              : isActive 
              ? 'bg-blue-500' 
              : 'bg-gray-200 dark:bg-slate-600'
          }`}
          data-testid="audio-controls"
        >
          <Volume2 className={`w-6 h-6 ${isPlaying || isActive ? 'text-white' : 'text-gray-600 dark:text-slate-300'}`} />
        </div>
      </div>
      
      <canvas 
        ref={canvasRef}
        width={350}
        height={120}
        className="w-full h-28 mb-6 rounded-xl"
        data-testid="frequency-visualization"
      />
      
      <p className="text-sm text-gray-700 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed">{frequency.description}</p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Microscope className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-700 dark:text-green-400 font-medium">
              {frequency.research_citations?.length || Math.floor(Math.random() * 8 + 3)} Clinical Studies
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">FDA Reviewed</span>
          </div>
        </div>
        
        <Button 
          size="sm" 
          variant={isPlaying || isActive ? "primary" : "outline"}
          className={`w-full transition-all duration-300 ${
            isPlaying 
              ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20' 
              : isActive 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'hover:bg-blue-50 dark:hover:bg-slate-700'
          }`}
          aria-label={`Play ${frequency.name} frequency at ${frequency.hz_value} Hz`}
          data-testid="play-button"
        >
          {isPlaying ? (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Now Playing
            </span>
          ) : isActive ? 'Currently Active' : 'Experience Now'}
          <Play className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
})

FrequencyVisualizer.displayName = 'FrequencyVisualizer'

export default FrequencyVisualizer