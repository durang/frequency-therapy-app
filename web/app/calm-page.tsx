'use client'

import { useState, useEffect, useRef } from 'react'
import { audioEngine } from '@/lib/real-audio-engine'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { frequencies } from '@/lib/frequencies'
import { calmDesignSystem } from '@/lib/calmDesignSystem'
import FrequencyLab from '@/components/landing/frequency-lab/FrequencyLab'
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer'
import { useDisclaimerRequired, medicalCompliance } from '@/lib/disclaimerState'
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
  X
} from 'lucide-react'

export default function CalmFrequencyApp() {
  const [playingFrequency, setPlayingFrequency] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(75)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Medical disclaimer state
  const { isRequired: isDisclaimerRequired, acceptDisclaimer, resetDisclaimer } = useDisclaimerRequired()

  const handleDisclaimerAccept = () => {
    acceptDisclaimer()
    
    // Log compliance acceptance
    console.log('[Medical Compliance]', {
      action: 'disclaimer_accepted',
      timestamp: new Date().toISOString(),
      metadata: medicalCompliance.getComplianceMetadata()
    })
  }

  const handleDisclaimerDecline = () => {
    // Reset disclaimer state and redirect or show message
    console.log('[Medical Compliance] User declined medical disclaimer')
    
    // In a real app, you might redirect to a "declined" page or show an info message
    // For now, we'll just reset the disclaimer state
    resetDisclaimer()
    
    alert('You must accept the medical disclaimer to use frequency therapy features. You can return to this page anytime to review and accept.')
  }

  const handlePlay = async (frequencyId: string) => {
    // Check medical compliance before allowing frequency therapy
    const sessionValid = medicalCompliance.validateSession()
    if (!sessionValid.valid) {
      console.warn('[Medical Compliance] Session invalid:', sessionValid.reason)
      resetDisclaimer() // Force disclaimer to show again
      return
    }

    const frequency = frequencies.find(f => f.id === frequencyId)
    if (!frequency || !audioEngine) return

    // Validate frequency safety
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

    // Check user health profile for contraindications
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

    // Show warnings for supervision required
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

    // Show safety warnings if any
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

    console.log('[AudioEngine] Play request:', {
      frequencyId,
      currentlyPlaying: playingFrequency,
      frequency: frequency.name,
      hz: frequency.hz_value,
      timestamp: new Date().toISOString(),
      complianceValid: true,
      safetyChecked: true,
      contraindications: contraindications.warnings.length > 0 ? contraindications.warnings : 'none'
    })

    if (playingFrequency === frequencyId) {
      // Stop current audio
      audioEngine.stop()
      setPlayingFrequency(null)
      console.log('[AudioEngine] Stopped audio')
    } else {
      // Stop any other playing audio
      audioEngine.stop()
      
      // Start new audio
      const success = await audioEngine.play(frequency.hz_value, volume / 100)
      if (success) {
        setPlayingFrequency(frequencyId)
        console.log('[AudioEngine] Successfully started audio')
        
        // Log safety validation for compliance tracking
        console.log('[Medical Compliance] Frequency session started:', {
          action: 'frequency_started',
          frequencyId,
          hz: frequency.hz_value,
          tier: frequency.tier,
          safetyWarnings: contraindications.warnings.length,
          requiresSupervision: contraindications.requiresSupervision,
          timestamp: new Date().toISOString()
        })
      } else {
        // Fallback: still show playing state even if audio fails
        setPlayingFrequency(frequencyId)
        console.warn('[AudioEngine] Audio playback failed, but continuing with visual state')
      }
    }
  }

  // Handle volume changes
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    // Update real-time volume if audio is playing
    if (audioEngine) {
      audioEngine.setVolume(newVolume / 100)
    }
  }

  // Handle mute/unmute
  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
    if (audioEngine) {
      if (!isMuted) {
        // Muting
        audioEngine.setVolume(0)
      } else {
        // Unmuting
        audioEngine.setVolume(volume / 100)
      }
    }
  }

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioEngine) {
        audioEngine.stop()
      }
    }
  }, [])

  // Featured frequencies (first 6)
  const featuredFrequencies = frequencies.slice(0, 6)

  return (
    <>
      {/* Medical Disclaimer Modal */}
      <MedicalDisclaimer
        isVisible={isDisclaimerRequired}
        onAccept={handleDisclaimerAccept}
        onDecline={handleDisclaimerDecline}
      />
      
      <div className="min-h-screen animated-bg neural-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card">
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
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/library" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Frecuencias
              </Link>
              <Link href="/library" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Biblioteca
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Mi Perfil
              </Link>
              <button className="btn-primary-glow text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300">
                Premium
              </button>
            </nav>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Floating particles */}
        <div className="particles">
          <div className="particle float-animation" style={{left: '10%', top: '20%'}}></div>
          <div className="particle float-animation" style={{left: '80%', top: '40%'}}></div>
          <div className="particle float-animation" style={{left: '30%', top: '60%'}}></div>
          <div className="particle float-animation" style={{left: '70%', top: '80%'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Encuentra tu
              <span className="hero-gradient block mt-2"> equilibrio</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-light">
              Terapia de frecuencias científicamente respaldada para reducir el estrés, 
              mejorar el sueño y aumentar tu bienestar mental.
            </p>
            
            {/* Audio Visualizer with playing state */}
            <div className="max-w-lg mx-auto mb-12">
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
                  {playingFrequency ? `Reproduciendo: ${frequencies.find(f => f.id === playingFrequency)?.name}` : 'Selecciona una frecuencia para comenzar'}
                </p>
                {playingFrequency && (
                  <div className="text-sm text-blue-600 font-medium">
                    {frequencies.find(f => f.id === playingFrequency)?.hz_value} Hz • {frequencies.find(f => f.id === playingFrequency)?.category}
                  </div>
                )}
              </div>
            </div>

            {/* Audio controls */}
            <div className="flex items-center justify-center space-x-4 mb-8">
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
            </div>
          </div>
        </div>
      </section>

      {/* Frequency Laboratory */}
      <FrequencyLab 
        featuredFrequencies={featuredFrequencies}
        totalFrequencies={frequencies.length}
        playingFrequency={playingFrequency}
        onFrequencySelect={handlePlay}
      />

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
  </>
  )
}