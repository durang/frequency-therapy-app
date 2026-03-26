'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { audioEngine } from '@/lib/real-audio-engine'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { frequencies } from '@/lib/frequencies'
import { calmDesignSystem } from '@/lib/calmDesignSystem'
import FrequencyLab from '@/components/landing/frequency-lab/FrequencyLab'
import ScrollProgress, { ScrollIndicator } from '@/components/ui/ScrollProgress'
import MedicalScrollSections from '@/components/landing/MedicalScrollSections'
import { 
  useScrollStory, 
  useScrollSection, 
  defaultScrollSections,
  validateMedicalCompliance 
} from '@/lib/scrollStory'
import { FrequencySafetyValidator } from '@/lib/medicalSafety'
import { UserHealthProfileManager } from '@/lib/userHealthProfile'
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
  X,
  Shield,
  AlertTriangle
} from 'lucide-react'

export default function CalmFrequencyApp() {
  const [playingFrequency, setPlayingFrequency] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(75)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [explicitMedicalProgress, setExplicitMedicalProgress] = useState(0)
  
  // Scroll story state - replaces modal-based disclaimer
  const {
    scrollProgress,
    currentSection,
    sectionsRead,
    medicalComplianceProgress,
    isReadyToStart,
    sections,
    markSectionAsRead,
    fps
  } = useScrollStory(defaultScrollSections)

  // Enhanced medical compliance - combines scroll story readiness with explicit medical progress
  const isFullyReady = isReadyToStart && explicitMedicalProgress >= 1.0

  // Section refs for scroll tracking
  const { ref: heroRef, isInView: heroInView } = useScrollSection('hero')
  const { ref: howItWorksRef, isInView: howItWorksInView } = useScrollSection('how-it-works')
  const { ref: medicalInfoRef, isInView: medicalInfoInView } = useScrollSection('medical-info')
  const { ref: safetyRef, isInView: safetyInView } = useScrollSection('safety-guidelines')
  const { ref: startTherapyRef, isInView: startTherapyInView } = useScrollSection('start-therapy')

  // Parallax transforms for hero section
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  const handlePlay = async (frequencyId: string) => {
    // Check medical compliance through scroll progress instead of modal
    const complianceValidation = validateMedicalCompliance(explicitMedicalProgress, sectionsRead)
    
    if (!complianceValidation.isValid) {
      console.warn('[Medical Compliance] Scroll-based validation failed:', {
        progress: explicitMedicalProgress,
        missing: complianceValidation.missingRequirements
      })
      
      // Scroll to first missing section instead of showing modal
      const firstMissing = complianceValidation.missingRequirements[0]
      const targetSection = sections.find(s => s.id === firstMissing)
      
      if (targetSection) {
        const targetProgress = targetSection.minProgress
        const targetY = targetProgress * document.documentElement.scrollHeight
        
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        })
        
        // Show toast notification
        console.log('[ScrollStory] Redirecting to medical compliance section:', firstMissing)
      }
      
      return
    }

    const frequency = frequencies.find(f => f.id === frequencyId)
    if (!frequency || !audioEngine) return

    // Existing frequency safety validation...
    const frequencyInput = {
      hz_value: frequency.hz_value,
      duration_minutes: frequency.duration_minutes,
      tier: frequency.tier,
      volume: volume / 100
    }

    const safetyValidation = FrequencySafetyValidator.validateFrequency(frequencyInput)
    if (!safetyValidation.isValid) {
      console.error('[Safety] Frequency validation failed:', safetyValidation.errors)
      alert(`Safety Error: ${safetyValidation.errors?.join(', ')}`)
      return
    }

    const userProfile = UserHealthProfileManager.getProfile()
    const contraindications = FrequencySafetyValidator.checkContraindications(
      safetyValidation.frequency!,
      userProfile
    )

    if (contraindications.isContraindicated) {
      console.warn('[Safety] Frequency contraindicated:', contraindications.warnings)
      const warningMessage = [
        'This frequency may not be safe for your health profile:',
        ...contraindications.warnings,
        '',
        'Please consult with a healthcare provider before using this frequency.'
      ].join('\n')
      
      alert(warningMessage)
      return
    }

    if (contraindications.requiresSupervision) {
      const supervisionWarning = [
        'Medical supervision recommended:',
        ...contraindications.warnings,
        '',
        'Do you want to continue? (This frequency may require medical oversight)'
      ].join('\n')
      
      const userConsent = confirm(supervisionWarning)
      if (!userConsent) {
        console.log('[Safety] User declined supervised frequency')
        return
      }
    }

    if (contraindications.warnings.length > 0 && !contraindications.isContraindicated) {
      const generalWarnings = [
        'Safety Notice:',
        ...contraindications.warnings,
        '',
        'Please monitor yourself carefully during the session. Click OK to continue.'
      ].join('\n')
      
      const userAcknowledged = confirm(generalWarnings)
      if (!userAcknowledged) {
        console.log('[Safety] User declined frequency with warnings')
        return
      }
    }

    // Audio playback logic
    if (playingFrequency === frequencyId) {
      audioEngine.stop()
      setPlayingFrequency(null)
      console.log('[AudioEngine] Stopped audio')
    } else {
      audioEngine.stop()
      
      const success = await audioEngine.play(frequency.hz_value, volume / 100)
      if (success) {
        setPlayingFrequency(frequencyId)
        console.log('[AudioEngine] Successfully started audio')
        
        console.log('[Medical Compliance] Frequency session started:', {
          action: 'frequency_started',
          frequencyId,
          hz: frequency.hz_value,
          tier: frequency.tier,
          complianceProgress: explicitMedicalProgress,
          scrollProgress: scrollProgress,
          timestamp: new Date().toISOString()
        })
      } else {
        setPlayingFrequency(frequencyId)
        console.warn('[AudioEngine] Audio playback failed, but continuing with visual state')
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (audioEngine) {
      audioEngine.setVolume(newVolume / 100)
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
    if (audioEngine) {
      if (!isMuted) {
        audioEngine.setVolume(0)
      } else {
        audioEngine.setVolume(volume / 100)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (audioEngine) {
        audioEngine.stop()
      }
    }
  }, [])

  const featuredFrequencies = frequencies.slice(0, 6)

  return (
    <>
      {/* Scroll Progress Indicators */}
      <ScrollProgress showPercentage={false} height={3} />
      <ScrollIndicator />
      
      {/* Performance Monitor (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-50">
          FPS: {Math.round(fps)} | Section: {currentSection} | Progress: {Math.round(scrollProgress * 100)}%
        </div>
      )}
      
      <div className="min-h-screen animated-bg neural-pattern">
        {/* Header - Updated with scroll-based medical compliance indicator */}
        <header className="sticky top-0 z-40 glass-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 float-animation">
                  <Waves className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">FreqHeal</h1>
                  <p className="text-sm text-blue-600 font-medium">Terapia de Frecuencias</p>
                </div>
              </div>
              
              {/* Medical Compliance Progress Indicator */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className={`w-5 h-5 ${isReadyToStart ? 'text-green-600' : 'text-amber-500'}`} />
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${isReadyToStart ? 'bg-green-500' : 'bg-amber-400'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${explicitMedicalProgress * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {isReadyToStart ? 'Ready' : `${Math.round(explicitMedicalProgress * 100)}%`}
                  </span>
                </div>
              </div>

              <nav className="hidden lg:flex items-center space-x-8">
                <Link href="/library" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Frecuencias
                </Link>
                <Link href="/library" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Biblioteca
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Mi Perfil
                </Link>
                <motion.button 
                  className="btn-primary-glow text-white px-8 py-3 rounded-2xl font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Premium
                </motion.button>
              </nav>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section with Enhanced Animations */}
        <HeroAnimations
          playingFrequency={playingFrequency}
          onFrequencySelect={handlePlay}
          isMuted={isMuted}
          volume={volume}
          onMuteToggle={handleMuteToggle}
          onVolumeChange={handleVolumeChange}
          isReadyToStart={isFullyReady}
          complianceProgress={explicitMedicalProgress}
        />
        <motion.section 
          ref={heroRef as any}
          className="relative py-20 md:py-28 overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Floating particles */}
          <div className="particles">
            <motion.div 
              className="particle"
              style={{left: '10%', top: '20%'}}
              animate={{ y: [-20, 20, -20] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="particle"
              style={{left: '80%', top: '40%'}}
              animate={{ y: [20, -20, 20] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="particle"
              style={{left: '30%', top: '60%'}}
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div 
              className="particle"
              style={{left: '70%', top: '80%'}}
              animate={{ y: [25, -25, 25] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <motion.h1 
                className="text-5xl md:text-7xl font-black mb-8 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Encuentra tu
                <span className="hero-gradient block mt-2"> equilibrio</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Terapia de frecuencias científicamente respaldada para reducir el estrés, 
                mejorar el sueño y aumentar tu bienestar mental.
              </motion.p>
              
              {/* Audio Visualizer */}
              <motion.div 
                className="max-w-lg mx-auto mb-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <div className={`glass-card p-8 rounded-3xl ${playingFrequency ? 'playing' : ''}`}>
                  <div className="flex items-center justify-center mb-6">
                    <div className={`audio-wave ${playingFrequency ? 'active' : ''}`}>
                      <div className="freq-bar h-6"></div>
                      <div className="freq-bar h-8"></div>
                      <div className="freq-bar h-4"></div>
                      <div className="freq-bar h-10"></div>
                      <div className="freq-bar h-6"></div>
                      <div className="freq-bar h-8"></div>
                      <div className="freq-bar h-4"></div>
                      <div className="freq-bar h-10"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {playingFrequency ? `Reproduciendo: ${frequencies.find(f => f.id === playingFrequency)?.name}` : 'Continúa scrolling para acceder a las frecuencias'}
                  </p>
                  {playingFrequency && (
                    <div className="text-sm text-blue-600 font-medium">
                      {frequencies.find(f => f.id === playingFrequency)?.hz_value} Hz • {frequencies.find(f => f.id === playingFrequency)?.category}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Audio controls */}
              <motion.div 
                className="flex items-center justify-center space-x-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <button
                  onClick={handleMuteToggle}
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
                    onChange={handleVolumeChange}
                    className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 font-medium w-8">{volume}%</span>
                </div>
                
                <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section 
          ref={howItWorksRef as any}
          className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Cómo Funciona?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                La ciencia detrás de la terapia de frecuencias y por qué es tan efectiva.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ondas Cerebrales</h3>
                <p className="text-gray-600">
                  Las frecuencias específicas sincronizan con las ondas cerebrales naturales, promoviendo estados deseados de relajación o concentración.
                </p>
              </motion.div>

              <motion.div 
                className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Waves className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Resonancia</h3>
                <p className="text-gray-600">
                  El fenómeno de resonancia permite que el cuerpo se alinee naturalmente con las frecuencias terapéuticas.
                </p>
              </motion.div>

              <motion.div 
                className="text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Bienestar</h3>
                <p className="text-gray-600">
                  El resultado es una sensación profunda de calma, mejor sueño, reducción del estrés y mayor claridad mental.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>


        {/* Medical Scroll Sections - Replaces Modal UX */}
        <section 
          id="medical-scroll-sections"
          ref={medicalInfoRef as any}
          className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        >
          <MedicalScrollSections 
            onComplianceProgress={setExplicitMedicalProgress}
            className=""
          />
        </section>
        {/* Frequency Laboratory - Now Enabled by Scroll Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FrequencyLab 
            featuredFrequencies={featuredFrequencies}
            totalFrequencies={frequencies.length}
            playingFrequency={playingFrequency}
            onFrequencySelect={handlePlay}
            isEnabled={isFullyReady}
            complianceProgress={explicitMedicalProgress}
          />
        </motion.div>

        {/* Start Therapy CTA Section */}
        <motion.section 
          ref={startTherapyRef as any}
          className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="neural-pattern w-full h-full"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Comienza Tu Viaje de Sanación
              </h2>
              
              <p className="text-xl md:text-2xl mb-12 text-blue-100">
                Miles de personas ya han transformado su bienestar con FreqHeal. 
                Tu momento es ahora.
              </p>

              <div className="space-y-6">
                {isReadyToStart ? (
                  <motion.button
                    className="btn-primary-glow bg-white text-indigo-600 px-12 py-4 rounded-2xl font-bold text-lg shadow-xl"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Play className="w-6 h-6" />
                      <span>Comenzar Ahora</span>
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </motion.button>
                ) : (
                  <motion.div
                    className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Revisión de Seguridad</span>
                    </div>
                    <p className="text-sm text-blue-100 mb-4">
                      Lee la información médica y de seguridad arriba para desbloquear las frecuencias
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${explicitMedicalProgress * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-blue-200 mt-2">
                      {Math.round(explicitMedicalProgress * 100)}% completado
                    </p>
                  </motion.div>
                )}

                <div className="flex items-center justify-center space-x-8 text-sm text-blue-200">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>127K+ usuarios</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>94.7% efectividad</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>100% seguro</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

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
    </>
  )
}

import HeroAnimations from '@/components/landing/HeroAnimations'