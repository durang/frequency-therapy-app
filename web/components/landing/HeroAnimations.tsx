'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
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
  ArrowDown,
  Shield,
  Zap
} from 'lucide-react'

interface HeroAnimationsProps {
  playingFrequency?: string | null
  onFrequencySelect?: (frequencyId: string) => void
  isMuted?: boolean
  volume?: number
  onMuteToggle?: () => void
  onVolumeChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  isReadyToStart?: boolean
  complianceProgress?: number
}

interface ParticleSystem {
  particles: Array<{
    id: number
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
  }>
  nextId: number
}

export default function HeroAnimations({
  playingFrequency,
  onFrequencySelect,
  isMuted = false,
  volume = 75,
  onMuteToggle,
  onVolumeChange,
  isReadyToStart = false,
  complianceProgress = 0
}: HeroAnimationsProps) {
  const containerRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [particleSystem, setParticleSystem] = useState<ParticleSystem>({
    particles: [],
    nextId: 0
  })
  
  // Scroll-based transforms for cinematic parallax
  const { scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  // Enhanced parallax transforms with spring physics
  const heroY = useTransform(scrollY, [0, 800], [0, -200])
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0])
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.1])
  const heroBlur = useTransform(scrollY, [0, 600], [0, 5])
  
  // Particle movement based on scroll
  const particleY = useTransform(scrollY, [0, 400], [0, -100])
  
  // Text reveal animations with staggered delays
  const titleY = useTransform(scrollY, [0, 500], [0, -100])
  const subtitleY = useTransform(scrollY, [0, 500], [0, -80])
  const ctaY = useTransform(scrollY, [0, 500], [0, -60])
  
  // Audio visualizer scaling
  const visualizerScale = useTransform(scrollY, [0, 300], [1, 1.2])
  const visualizerRotate = useTransform(scrollY, [0, 400], [0, 5])
  
  // Spring-based smooth transforms
  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 })
  const smoothScale = useSpring(heroScale, { stiffness: 200, damping: 40 })
  
  // Section visibility tracking
  const isHeroInView = useInView(heroRef, { 
    once: false, 
    margin: "-20% 0px -20% 0px" 
  })
  
  // Advanced particle system
  useEffect(() => {
    if (!isHeroInView || !heroRef.current) return
    
    const interval = setInterval(() => {
      setParticleSystem(prev => {
        const newParticles = [...prev.particles]
        
        // Add new particles
        if (Math.random() < 0.3) {
          newParticles.push({
            id: prev.nextId,
            x: Math.random() * (heroRef.current?.offsetWidth || 1000),
            y: Math.random() * (heroRef.current?.offsetHeight || 600),
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: 0,
            maxLife: 300 + Math.random() * 200
          })
        }
        
        // Update particle positions and remove expired ones
        const updatedParticles = newParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life + 1
          }))
          .filter(particle => particle.life < particle.maxLife)
        
        return {
          particles: updatedParticles,
          nextId: prev.nextId + 1
        }
      })
    }, 50)
    
    return () => clearInterval(interval)
  }, [isHeroInView])
  
  // CTA animations variants
  const ctaVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: { 
      scale: 1.05, 
      y: -3,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  }
  
  // Staggered text animations
  const textVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1.2,
        delay: delay * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  }
  
  // Interactive frequency demo
  const demoFrequencies = [
    { id: 'demo-calm', name: 'Calm', hz: 432, color: 'from-blue-400 to-blue-600' },
    { id: 'demo-focus', name: 'Focus', hz: 40, color: 'from-purple-400 to-purple-600' },
    { id: 'demo-sleep', name: 'Sleep', hz: 1.5, color: 'from-indigo-400 to-indigo-600' }
  ]
  
  const handleDemoPlay = (freqId: string) => {
    if (!isReadyToStart) {
      // Smooth scroll to medical sections
      const medicalSection = document.getElementById('medical-scroll-sections')
      if (medicalSection) {
        medicalSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }
    
    onFrequencySelect?.(freqId)
  }
  
  return (
    <motion.section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y: smoothHeroY, opacity: heroOpacity }}
    >
      {/* Dynamic Background with Scroll Parallax */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{ 
          scale: smoothScale,
          filter: useTransform(heroBlur, (blur) => `blur(${blur}px)`)
        }}
      >
        <div className="neural-pattern w-full h-full" />
      </motion.div>
      
      {/* Enhanced Particle System */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: particleY }}
      >
        {particleSystem.particles.map(particle => {
          const opacity = 1 - (particle.life / particle.maxLife)
          const scale = 0.5 + (particle.life / particle.maxLife) * 0.5
          
          return (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
                opacity,
                scale,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity }}
              exit={{ opacity: 0 }}
            />
          )
        })}
      </motion.div>
      
      {/* Floating Orbs with Advanced Physics */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-10"
            style={{
              background: `linear-gradient(135deg, 
                ${i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4'}, 
                ${i % 3 === 0 ? '#1d4ed8' : i % 3 === 1 ? '#7c3aed' : '#0891b2'})`,
              left: `${15 + (i * 12)}%`,
              top: `${20 + (i * 8)}%`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.9, 1],
              rotate: [0, 90, -45, 0],
            }}
            transition={{
              duration: 8 + (i * 2),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>
      
      <div 
        ref={heroRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
      >
        {/* Main Title with Advanced Typography Animation */}
        <motion.div
          style={{ y: titleY }}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          custom={0}
          className="mb-8"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-black mb-4 leading-[0.9]"
            style={{ 
              perspective: "1000px",
              transformStyle: "preserve-3d"
            }}
          >
            <motion.span
              className="block overflow-hidden"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Encuentra tu
            </motion.span>
            <motion.span 
              className="hero-gradient block mt-4"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              equilibrio
            </motion.span>
          </motion.h1>
          
          {/* Animated underline */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          />
        </motion.div>
        
        {/* Enhanced Subtitle */}
        <motion.div
          style={{ y: subtitleY }}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          custom={1}
          className="mb-16"
        >
          <motion.p 
            className="text-xl md:text-3xl text-gray-600 mb-8 leading-relaxed font-light max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
          >
            Terapia de frecuencias{' '}
            <motion.span
              className="text-blue-600 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              científicamente respaldada
            </motion.span>
            {' '}para reducir el estrés, mejorar el sueño y aumentar tu bienestar mental.
          </motion.p>
          
          {/* Statistics with countup animation */}
          <motion.div 
            className="flex items-center justify-center space-x-8 text-sm text-gray-500 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-yellow-500" />
              <span>127K+ usuarios</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span>94.7% efectividad</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-4 h-4 text-green-500" />
              <span>100% seguro</span>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Interactive Audio Visualizer with Scroll Integration */}
        <motion.div 
          className="max-w-2xl mx-auto mb-16"
          style={{ 
            scale: visualizerScale,
            rotateY: visualizerRotate,
            y: ctaY
          }}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          custom={2}
        >
          <motion.div 
            className={`glass-card p-8 md:p-12 rounded-3xl transition-all duration-500 ${
              playingFrequency ? 'playing ring-2 ring-blue-400/50' : ''
            }`}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px rgba(59, 130, 246, 0.25)"
            }}
          >
            {/* Enhanced Audio Wave Visualizer */}
            <motion.div 
              className="flex items-center justify-center mb-8"
              animate={playingFrequency ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className={`audio-wave ${playingFrequency ? 'active' : ''}`}>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="freq-bar"
                    style={{
                      height: playingFrequency 
                        ? `${20 + Math.sin((Date.now() * 0.005) + i) * 15}px`
                        : '8px',
                      background: playingFrequency
                        ? `linear-gradient(to top, 
                            ${i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4'}, 
                            ${i % 3 === 0 ? '#1d4ed8' : i % 3 === 1 ? '#7c3aed' : '#0891b2'})`
                        : '#d1d5db'
                    }}
                    animate={{
                      height: playingFrequency 
                        ? [8, 40, 8]
                        : 8
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: playingFrequency ? Infinity : 0,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Status Display */}
            <motion.div className="text-center mb-8">
              <motion.p 
                className="text-lg font-medium text-gray-700 mb-2"
                animate={{ opacity: playingFrequency ? [1, 0.7, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {playingFrequency 
                  ? `🎵 Reproduciendo frecuencia de demostración`
                  : isReadyToStart
                    ? '✨ Listo para comenzar tu viaje de sanación'
                    : '📋 Revisa la información médica para continuar'
                }
              </motion.p>
              
              {playingFrequency && (
                <motion.div
                  className="text-sm text-blue-600 font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  Demostración • Frecuencia Segura
                </motion.div>
              )}
            </motion.div>
            
            {/* Interactive Demo Frequencies */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, staggerChildren: 0.1 }}
            >
              {demoFrequencies.map((freq, index) => (
                <motion.button
                  key={freq.id}
                  onClick={() => handleDemoPlay(freq.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    playingFrequency === freq.id
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 bg-white/50 hover:border-blue-300'
                  } ${!isReadyToStart ? 'opacity-60' : ''}`}
                  variants={ctaVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={isReadyToStart ? "hover" : {}}
                  whileTap={isReadyToStart ? "tap" : {}}
                  custom={index}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${freq.color} rounded-full flex items-center justify-center`}>
                      {playingFrequency === freq.id ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{freq.name}</div>
                      <div className="text-xs text-gray-500">{freq.hz} Hz</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
            
            {/* Audio Controls */}
            <motion.div 
              className="flex items-center justify-center space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 3.0 }}
            >
              <motion.button
                onClick={onMuteToggle}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Vol:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={onVolumeChange}
                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-700 font-medium w-8">{volume}%</span>
              </div>
              
              <motion.button 
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Multiple CTAs with Progressive Disclosure */}
        <motion.div 
          className="space-y-6"
          style={{ y: ctaY }}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          custom={3}
        >
          {/* Primary CTA */}
          {isReadyToStart ? (
            <motion.button
              className="btn-primary-glow bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl mx-auto block"
              variants={ctaVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                // Navigate to frequency selection or main app
                console.log('[HeroAnimations] Primary CTA clicked - Start Now')
              }}
            >
              <span className="flex items-center justify-center space-x-3">
                <Zap className="w-6 h-6" />
                <span>Comenzar Ahora</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </motion.button>
          ) : (
            <motion.div
              className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 px-8 py-5 rounded-2xl mx-auto max-w-md"
              variants={ctaVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Shield className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-gray-900">Revisión de Seguridad</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Completa la revisión médica para acceder a todas las frecuencias
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${complianceProgress * 100}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <motion.button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold text-sm hover:from-amber-600 hover:to-orange-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const medicalSection = document.getElementById('medical-scroll-sections')
                  if (medicalSection) {
                    medicalSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Continuar Revisión</span>
                  <ArrowDown className="w-4 h-4" />
                </span>
              </motion.button>
            </motion.div>
          )}
          
          {/* Secondary CTAs */}
          <motion.div 
            className="flex items-center justify-center space-x-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.0 }}
          >
            <motion.button
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium underline underline-offset-4"
              whileHover={{ scale: 1.05 }}
            >
              Ver Demostración
            </motion.button>
            <motion.button
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium underline underline-offset-4"
              whileHover={{ scale: 1.05 }}
            >
              Leer Investigación
            </motion.button>
            <motion.button
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium underline underline-offset-4"
              whileHover={{ scale: 1.05 }}
            >
              Testimonios
            </motion.button>
          </motion.div>
          
          {/* Progress Indicators */}
          <motion.div
            className="flex items-center justify-center space-x-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5 }}
          >
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-12 h-1 bg-gray-300 rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${complianceProgress * 100}%` }}
                transition={{ duration: 1, delay: 5 }}
              />
            </div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </motion.div>
        </motion.div>
        
        {/* Floating Call-to-Action for Scroll */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="flex flex-col items-center space-y-2 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors"
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              const nextSection = document.querySelector('.py-16')
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            <span className="text-xs font-medium">Descubre Más</span>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}