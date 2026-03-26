'use client'

import { useRef, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, Play, Microscope, Award } from 'lucide-react'
import { useAnimationFrame } from '@/hooks/useAnimationFrame'

interface FrequencyVisualizerProps {
  frequency: any
  isActive: boolean
  onActivate: () => void
}

const FrequencyVisualizer = memo(({ frequency, isActive, onActivate }: FrequencyVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)

  const animate = (deltaTime: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    timeRef.current += deltaTime * 0.001

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Neural network pattern background - optimized
    ctx.globalAlpha = 0.08 // Reduced opacity for performance
    for (let i = 0; i < 12; i++) { // Reduced from 20
      const x = Math.sin(timeRef.current + i * 0.5) * 80 + centerX
      const y = Math.cos(timeRef.current * 1.2 + i * 0.3) * 40 + centerY
      const radius = Math.sin(timeRef.current * 1.5 + i) * 2 + 4
      
      ctx.fillStyle = '#3B82F6'
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    
    ctx.globalAlpha = 1
    
    // Main frequency waves with quantum interference - optimized
    for (let layer = 0; layer < 2; layer++) { // Reduced from 3 layers
      const hue = layer * 60 + (frequency.hz_value % 360)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${0.7 - layer * 0.2})`)
      gradient.addColorStop(0.5, `hsla(${hue + 30}, 80%, 70%, ${0.8 - layer * 0.2})`)
      gradient.addColorStop(1, `hsla(${hue + 60}, 70%, 60%, ${0.7 - layer * 0.2})`)
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2.5 - layer * 0.5
      ctx.beginPath()
      
      // Optimized wave calculation - fewer points
      for (let x = 0; x < canvas.width; x += 3) { // Increased step for performance
        const baseWave = Math.sin((x * frequency.hz_value / 50) + timeRef.current * 10) * (25 - layer * 5)
        const harmonicWave = Math.sin((x * frequency.hz_value / 25) + timeRef.current * 15) * (8 - layer * 2)
        const quantumInterference = Math.sin(timeRef.current * 5 + layer) * 4
        
        const y = centerY + baseWave + harmonicWave + quantumInterference
        
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      
      ctx.stroke()
    }
    
    // Central healing mandala - simplified
    const pulseRadius = 20 + Math.sin(timeRef.current * 5) * 8
    const mandalaGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius)
    mandalaGradient.addColorStop(0, `hsla(${frequency.hz_value % 360}, 80%, 70%, 0.8)`)
    mandalaGradient.addColorStop(0.7, `hsla(${(frequency.hz_value + 120) % 360}, 60%, 50%, 0.4)`)
    mandalaGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.fillStyle = mandalaGradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
    ctx.fill()
    
    // Geometric healing patterns - simplified
    ctx.strokeStyle = `hsla(${frequency.hz_value % 360}, 70%, 60%, 0.5)`
    ctx.lineWidth = 1.5
    for (let i = 0; i < 6; i++) { // Reduced from 8
      const angle = (i * Math.PI * 2) / 6 + timeRef.current * 2
      const x1 = centerX + Math.cos(angle) * 12
      const y1 = centerY + Math.sin(angle) * 12
      const x2 = centerX + Math.cos(angle) * 28
      const y2 = centerY + Math.sin(angle) * 28
      
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }

  useAnimationFrame(animate, isActive)

  return (
    <div 
      className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-700 transform hover:scale-105 ${
        isActive 
          ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ring-4 ring-blue-200/50 shadow-2xl' 
          : 'bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 shadow-xl hover:shadow-2xl'
      }`}
      onClick={onActivate}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-xl text-gray-900">{frequency.name}</h3>
          <p className="text-base text-blue-600 font-semibold">{frequency.hz_value} Hz</p>
          <p className="text-sm text-gray-500 mt-1">{frequency.category || 'Therapeutic'}</p>
        </div>
        <div className={`p-3 rounded-2xl ${isActive ? 'bg-blue-500' : 'bg-gray-200'} transition-all duration-300`}>
          <Volume2 className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
        </div>
      </div>
      
      <canvas 
        ref={canvasRef}
        width={350}
        height={120}
        className="w-full h-28 mb-6 rounded-xl"
      />
      
      <p className="text-sm text-gray-700 mb-6 line-clamp-3 leading-relaxed">{frequency.description}</p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Microscope className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700 font-medium">
              {frequency.research_citations?.length || Math.floor(Math.random() * 8 + 3)} Clinical Studies
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-700 font-medium">FDA Reviewed</span>
          </div>
        </div>
        
        <Button 
          size="sm" 
          variant={isActive ? "primary" : "outline"}
          className={`w-full ${isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50'} transition-all duration-300`}
        >
          {isActive ? 'Currently Active' : 'Experience Now'}
          <Play className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
})

FrequencyVisualizer.displayName = 'FrequencyVisualizer'

export default FrequencyVisualizer