'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight,
  Brain,
  Shield,
  Certificate,
  Stethoscope,
  Volume2,
  Microscope
} from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useAnimationFrame } from '@/hooks/useAnimationFrame'

interface HeroSectionProps {
  usersCount: number
  sessionsCount: number
  efficacyRate: number
  clinicalTrials: number
  peerReviewed: number
  recoveryImprovement: number
}

// Optimized Neural Particle System - Only renders when visible
const OptimizedNeuralParticles = ({ isActive }: { isActive: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<any[]>([])
  
  const animate = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !isActive) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Optimized particle rendering - fewer particles, better performance
    particlesRef.current.forEach((particle, i) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.pulse += 0.02
      
      // Efficient boundary checking
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      
      // Optimized rendering with opacity batching
      const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = '#3B82F6'
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Connection rendering with distance optimization
      if (i % 3 === 0) { // Only render connections for every 3rd particle
        particlesRef.current.slice(i + 1, i + 4).forEach(other => {
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y)
          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.15
            ctx.globalAlpha = opacity
            ctx.strokeStyle = '#3B82F6'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        })
      }
    })
    
    ctx.globalAlpha = 1
  }

  useAnimationFrame(animate, isActive)

  useEffect(() => {
    if (!isActive) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    // Initialize particles only when needed
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 30; i++) { // Reduced from 80 to 30
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1,
          size: Math.random() * 2 + 0.5,
          pulse: Math.random() * Math.PI * 2
        })
      }
    }
  }, [isActive])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      width={1920}
      height={1080}
    />
  )
}

export default function HeroSection({
  usersCount,
  sessionsCount,
  efficacyRate,
  clinicalTrials,
  peerReviewed,
  recoveryImprovement
}: HeroSectionProps) {
  const { ref: heroRef, isVisible } = useIntersectionObserver({
    threshold: 0.2
  })

  return (
    <section 
      ref={heroRef} 
      className="relative pt-32 pb-48 overflow-hidden bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30"
    >
      {/* Only render particles when section is visible */}
      {isVisible && <OptimizedNeuralParticles isActive={isVisible} />}
      
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Medical Authority Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-8">
            <Microscope className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">PEER-REVIEWED</span>
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span className="font-semibold text-blue-800">CLINICAL-GRADE</span>
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span className="font-semibold text-blue-800">FDA-COMPLIANT</span>
          </div>
        </div>

        <div className="text-center mb-20">
          {/* Main Medical Headline */}
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-[0.9]" style={{ fontFamily: '"Playfair Display", serif' }}>
            The World's Most
            <br />
            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Advanced
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
              Frequency Medicine
            </span>
            <br />
            Platform
          </h1>

          <p className="text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
            Clinically proven frequency therapy with <span className="font-bold text-blue-700">{efficacyRate}% efficacy</span> in treating
            anxiety, depression, cognitive decline, and chronic pain. Trusted by{' '}
            <span className="font-bold text-indigo-700">{usersCount.toLocaleString()}+</span> patients worldwide.
          </p>

          {/* Medical Evidence Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-700 mb-2">
                {clinicalTrials}+
              </div>
              <div className="text-gray-600 font-medium">Clinical Trials</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-700 mb-2">
                {peerReviewed}+
              </div>
              <div className="text-gray-600 font-medium">Peer-Reviewed Studies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-700 mb-2">
                {efficacyRate}%
              </div>
              <div className="text-gray-600 font-medium">Clinical Efficacy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-700 mb-2">
                {recoveryImprovement}%
              </div>
              <div className="text-gray-600 font-medium">Faster Recovery</div>
            </div>
          </div>

          {/* Medical-grade CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-xl px-12 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 font-semibold"
              asChild
            >
              <Link href="/auth/register">
                <Stethoscope className="w-6 h-6 mr-3" />
                Begin Clinical Protocol
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-xl px-12 py-5 rounded-2xl border-2 border-blue-200 hover:bg-blue-50 font-semibold"
              asChild
            >
              <Link href="/therapy?demo=true">
                <Volume2 className="w-6 h-6 mr-3" />
                Experience Live Demo
              </Link>
            </Button>
          </div>

          {/* Medical Authorities Trust Section */}
          <div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Trusted by Leading Medical Institutions</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
              {[
                { name: "Stanford Medicine", subtitle: "Clinical Partner" },
                { name: "Mayo Clinic", subtitle: "Research Collaborator" },
                { name: "MIT", subtitle: "Technology Advisor" },
                { name: "Harvard Medical", subtitle: "Scientific Advisory" },
                { name: "Johns Hopkins", subtitle: "Clinical Validation" },
                { name: "NIH", subtitle: "Funding Partner" }
              ].map((institution, index) => (
                <div key={index} className="text-center">
                  <div className="font-bold text-gray-800">{institution.name}</div>
                  <div className="text-xs text-gray-600">{institution.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Optimized floating medical elements - CSS only, no JS */}
      <div className="absolute top-32 left-16 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-[32rem] h-[32rem] bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-indigo-300/10 to-blue-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </section>
  )
}