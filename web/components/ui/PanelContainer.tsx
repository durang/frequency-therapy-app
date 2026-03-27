'use client'

import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface PanelContainerProps {
  children: ReactNode
  className?: string
}

export function PanelContainer({ children, className }: PanelContainerProps) {
  return (
    <div 
      className={cn(
        // Base container styles
        'relative min-h-screen w-full',
        
        // Neural-inspired gradient background
        'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
        
        // Neural mesh overlay
        'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]',
        'after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_70%_80%,rgba(88,28,135,0.3),transparent_50%)]',
        
        // Panel-specific styling
        'text-white font-light',
        
        // Subtle neural glow animation
        'animate-pulse-neural',
        
        className
      )}
    >
      {/* Neural Grid Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating Neural Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`
              absolute w-1 h-1 bg-quantum-400 rounded-full opacity-60
              animate-float-${(i % 3) + 1}
            `}
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${15 + (i * 6) % 70}%`,
              animationDelay: `${i * 0.5}s`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Audio Spectrum Visualization Bars (Decorative) */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none opacity-20 z-0">
        <div className="flex items-end justify-center space-x-1 h-16 p-4">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-quantum-500 to-neural-400 w-1 rounded-t"
              style={{
                height: `${Math.random() * 40 + 10}%`,
                animationDelay: `${i * 0.05}s`,
                animation: `pulse-spectrum 2s ease-in-out infinite alternate`
              }}
            />
          ))}
        </div>
      </div>

      {/* DJ-style Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none">
        <div className="w-full h-full border-l-2 border-t-2 border-quantum-500/30 rounded-tl-lg" />
        <div className="absolute top-2 left-2 w-4 h-4 bg-quantum-500/50 rounded-full animate-pulse-slow" />
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
        <div className="w-full h-full border-r-2 border-t-2 border-neural-500/30 rounded-tr-lg" />
        <div className="absolute top-2 right-2 w-4 h-4 bg-neural-500/50 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none">
        <div className="w-full h-full border-l-2 border-b-2 border-purple-500/30 rounded-bl-lg" />
        <div className="absolute bottom-2 left-2 w-4 h-4 bg-purple-500/50 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none">
        <div className="w-full h-full border-r-2 border-b-2 border-frequency-dna/30 rounded-br-lg" />
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-frequency-dna/50 rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>
    </div>
  )
}