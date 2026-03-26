'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { frequencies } from '@/lib/frequencies'
import { calmDesignSystem } from '@/lib/calmDesignSystem'
import { 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Heart,
  Brain,
  Moon,
  Sparkles,
  Waves,
  Headphones,
  Star,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'

// Calm-style frequency card component
const FrequencyCard = ({ frequency, isPlaying, onPlay }: { 
  frequency: any, 
  isPlaying: boolean, 
  onPlay: (id: string) => void 
}) => {
  const [duration, setDuration] = useState(frequency.duration_minutes || 10)
  
  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm border-0">
      <CardContent className="p-0">
        {/* Background gradient based on frequency category */}
        <div 
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            background: frequency.category === 'sleep' ? calmDesignSystem.gradients.sleep :
                       frequency.category === 'focus' ? calmDesignSystem.gradients.focus :
                       frequency.category === 'meditation' ? calmDesignSystem.gradients.meditation :
                       frequency.category === 'energy' ? calmDesignSystem.gradients.energy :
                       calmDesignSystem.gradients.healing
          }}
        />
        
        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                {frequency.name}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {frequency.hz_value} Hz • {frequency.category}
              </p>
            </div>
            
            {/* Category icon */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              {frequency.category === 'sleep' && <Moon className="w-6 h-6 text-white" />}
              {frequency.category === 'focus' && <Brain className="w-6 h-6 text-white" />}
              {frequency.category === 'meditation' && <Sparkles className="w-6 h-6 text-white" />}
              {frequency.category === 'energy' && <Waves className="w-6 h-6 text-white" />}
              {!['sleep', 'focus', 'meditation', 'energy'].includes(frequency.category) && <Heart className="w-6 h-6 text-white" />}
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            {frequency.description?.substring(0, 120)}...
          </p>
          
          {/* Duration control */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-600">Duración:</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setDuration(Math.max(5, duration - 5))}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-semibold transition-colors"
              >
                −
              </button>
              <span className="text-sm font-semibold min-w-[4rem] text-center">
                {duration} min
              </span>
              <button 
                onClick={() => setDuration(Math.min(60, duration + 5))}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-semibold transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Play button */}
          <button
            onClick={() => onPlay(frequency.id)}
            className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              isPlaying 
                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Reproducir</span>
              </>
            )}
          </button>
          
          {/* Benefits */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Beneficios</p>
            <div className="space-y-1">
              {frequency.benefits?.slice(0, 3).map((benefit: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Audio visualizer component
const SimpleVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!canvasRef.current || !isPlaying) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    canvas.width = 300
    canvas.height = 150

    let time = 0
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Simple wave pattern
      ctx.beginPath()
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin((x * 0.02) + (time * 0.05)) * 30
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      
      ctx.stroke()
      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden flex items-center justify-center">
      {isPlaying ? (
        <canvas ref={canvasRef} className="w-full h-full" />
      ) : (
        <div className="text-center text-gray-500">
          <Headphones className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Selecciona una frecuencia para comenzar</p>
        </div>
      )}
    </div>
  )
}

export default function CalmFrequencyApp() {
  const [playingFrequency, setPlayingFrequency] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(75)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handlePlay = (frequencyId: string) => {
    setPlayingFrequency(playingFrequency === frequencyId ? null : frequencyId)
  }

  // Featured frequencies (first 6)
  const featuredFrequencies = frequencies.slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FreqHeal</h1>
                <p className="text-sm text-blue-600">Terapia de Frecuencias</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#frequencies" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Frecuencias
              </Link>
              <Link href="#library" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Biblioteca
              </Link>
              <Link href="#profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Mi Perfil
              </Link>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300">
                Premium
              </button>
            </nav>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Encuentra tu
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> equilibrio</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Terapia de frecuencias científicamente respaldada para reducir el estrés, 
              mejorar el sueño y aumentar tu bienestar mental.
            </p>
            
            {/* Current playing visualizer */}
            <div className="max-w-md mx-auto mb-8">
              <SimpleVisualizer isPlaying={playingFrequency !== null} />
            </div>

            {/* Audio controls */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Vol:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-700 font-medium w-8">{volume}%</span>
              </div>
              
              <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequency Cards */}
      <section className="py-16 bg-gradient-to-br from-white/60 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frecuencias Destacadas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada frecuencia está diseñada para objetivos específicos de bienestar y respaldada por investigación científica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFrequencies.map((frequency) => (
              <FrequencyCard
                key={frequency.id}
                frequency={frequency}
                isPlaying={playingFrequency === frequency.id}
                onPlay={handlePlay}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/library" 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span>Ver Biblioteca Completa</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué FreqHeal?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La única app que combina terapia de frecuencias científica con una experiencia de usuario excepcional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Científicamente Probado</h3>
              <p className="text-gray-600">
                Basado en más de 47 estudios clínicos con una efectividad del 94.7% en la reducción del estrés.
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fácil de Usar</h3>
              <p className="text-gray-600">
                Interfaz intuitiva diseñada para que cualquier persona pueda beneficiarse de la terapia de frecuencias.
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalizable</h3>
              <p className="text-gray-600">
                Ajusta duración, intensidad y combina con música ambiente para crear tu experiencia perfecta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">FreqHeal</h3>
              </div>
              <p className="text-blue-200 mb-6">
                La aplicación líder en terapia de frecuencias para el bienestar mental y físico.
              </p>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">127K+</div>
                  <div className="text-xs text-blue-200">Usuarios</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-indigo-400">94.7%</div>
                  <div className="text-xs text-blue-200">Efectividad</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">47</div>
                  <div className="text-xs text-blue-200">Estudios</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Frecuencias</h4>
              <ul className="space-y-3 text-blue-200">
                <li><Link href="/sleep" className="hover:text-white transition-colors">Sueño</Link></li>
                <li><Link href="/focus" className="hover:text-white transition-colors">Concentración</Link></li>
                <li><Link href="/meditation" className="hover:text-white transition-colors">Meditación</Link></li>
                <li><Link href="/healing" className="hover:text-white transition-colors">Sanación</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Soporte</h4>
              <ul className="space-y-3 text-blue-200">
                <li><Link href="/help" className="hover:text-white transition-colors">Centro de Ayuda</Link></li>
                <li><Link href="/research" className="hover:text-white transition-colors">Investigación</Link></li>
                <li><Link href="/medical" className="hover:text-white transition-colors">Información Médica</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-700 mt-12 pt-8 text-center text-blue-200 text-sm">
            <p>
              © 2024 FreqHeal. Plataforma de terapia de frecuencias para bienestar.
              <br />
              <span className="text-xs">
                No está destinado a diagnosticar, tratar, curar o prevenir enfermedades. Consulte a su médico.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}