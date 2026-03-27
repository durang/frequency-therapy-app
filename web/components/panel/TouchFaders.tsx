'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { usePanel } from '@/lib/panelState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  AdjustmentsHorizontalIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'

interface TouchFaderProps {
  frequencyId: string
  initialVolume: number
  frequencyName: string
  frequencyHz: number
  onVolumeChange?: (volume: number) => void
}

export function TouchFader({ 
  frequencyId, 
  initialVolume, 
  frequencyName, 
  frequencyHz,
  onVolumeChange 
}: TouchFaderProps) {
  const { updateFrequencyVolume, isFrequencyActive } = usePanel()
  const [volume, setVolume] = useState(initialVolume)
  const [isDragging, setIsDragging] = useState(false)
  const [touchId, setTouchId] = useState<number | null>(null)
  const faderRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const isActive = isFrequencyActive(frequencyId)

  // Update volume when dragging
  const updateVolume = useCallback((clientY: number) => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const trackHeight = rect.height - 40 // Account for thumb size
    const relativeY = clientY - rect.top - 20 // Center on thumb
    const newVolume = Math.max(0, Math.min(1, 1 - (relativeY / trackHeight)))
    
    setVolume(newVolume)
    updateFrequencyVolume(frequencyId, newVolume)
    onVolumeChange?.(newVolume)
    
    console.log('🎚️ [TouchFader] Volume updated:', frequencyName, Math.round(newVolume * 100) + '%')
  }, [frequencyId, frequencyName, updateFrequencyVolume, onVolumeChange])

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    setIsDragging(true)
    setTouchId(touch.identifier)
    updateVolume(touch.clientY)
    
    console.log('📱 [TouchFader] Touch started:', frequencyName)
  }, [frequencyName, updateVolume])

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (!isDragging) return
    
    const touch = Array.from(e.touches).find(t => t.identifier === touchId)
    if (touch) {
      updateVolume(touch.clientY)
    }
  }, [isDragging, touchId, updateVolume])

  // Handle touch end
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (!isDragging) return
    
    setIsDragging(false)
    setTouchId(null)
    
    console.log('📱 [TouchFader] Touch ended:', frequencyName, Math.round(volume * 100) + '%')
  }, [isDragging, frequencyName, volume])

  // Handle mouse events for desktop fallback
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updateVolume(e.clientY)
    
    console.log('🖱️ [TouchFader] Mouse down:', frequencyName)
  }, [frequencyName, updateVolume])

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !touchId) {
        updateVolume(e.clientY)
      }
    }

    const handleMouseUp = () => {
      if (isDragging && !touchId) {
        setIsDragging(false)
        console.log('🖱️ [TouchFader] Mouse up:', frequencyName, Math.round(volume * 100) + '%')
      }
    }

    if (isDragging && !touchId) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, touchId, frequencyName, volume, updateVolume])

  // Calculate thumb position
  const thumbPosition = `${(1 - volume) * 100}%`

  return (
    <div 
      ref={faderRef}
      className="flex flex-col h-full min-h-[280px] select-none"
    >
      {/* Fader Header */}
      <div className="flex-shrink-0 p-3 text-center border-b border-white/10">
        <div className="text-white font-medium text-sm truncate mb-1">
          {frequencyName}
        </div>
        <div className="text-quantum-400 font-mono text-xs">
          {frequencyHz} Hz
        </div>
        <div className="text-white/60 font-mono text-xs mt-1">
          {Math.round(volume * 100)}%
        </div>
      </div>

      {/* Fader Track */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          ref={trackRef}
          className={`
            relative w-12 h-full min-h-[160px] rounded-lg border-2 transition-colors duration-200
            ${isDragging 
              ? 'border-quantum-400 bg-quantum-400/20' 
              : isActive 
                ? 'border-quantum-500/50 bg-gradient-to-t from-quantum-500/20 to-transparent' 
                : 'border-white/20 bg-white/5'
            }
          `}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {/* Fader Fill */}
          <div 
            className={`
              absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-75
              ${isActive 
                ? 'bg-gradient-to-t from-quantum-500 to-quantum-400' 
                : 'bg-gradient-to-t from-white/40 to-white/20'
              }
            `}
            style={{ height: `${volume * 100}%` }}
          />
          
          {/* Volume Markings */}
          <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none">
            {[100, 75, 50, 25, 0].map(mark => (
              <div key={mark} className="flex items-center">
                <div className="w-2 h-px bg-white/30 ml-1" />
                <div className="text-white/40 text-xs ml-2 font-mono">
                  {mark}
                </div>
              </div>
            ))}
          </div>
          
          {/* Fader Thumb */}
          <div 
            className={`
              absolute left-1/2 w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 
              rounded-lg border-2 shadow-lg transition-all duration-75 cursor-grab
              ${isDragging 
                ? 'border-quantum-300 bg-quantum-400 shadow-quantum-400/50 scale-110 cursor-grabbing' 
                : isActive
                  ? 'border-quantum-500 bg-gradient-to-b from-quantum-400 to-quantum-600 hover:shadow-quantum-400/30' 
                  : 'border-white/50 bg-gradient-to-b from-white/80 to-white/60 hover:shadow-white/20'
              }
            `}
            style={{ top: thumbPosition }}
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* Fader Controls */}
      <div className="flex-shrink-0 p-2 border-t border-white/10">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newVolume = volume > 0 ? 0 : 0.7
              setVolume(newVolume)
              updateFrequencyVolume(frequencyId, newVolume)
              onVolumeChange?.(newVolume)
            }}
            className="p-2 w-8 h-8"
          >
            {volume > 0 ? (
              <SpeakerWaveIcon className="w-4 h-4" />
            ) : (
              <SpeakerXMarkIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function TouchFaders() {
  const { activeFrequencies, isPlaying, togglePlayback, masterVolume, setMasterVolume } = usePanel()

  if (activeFrequencies.length === 0) {
    return (
      <Card variant="glass" className="h-full flex items-center justify-center">
        <div className="text-center text-white/50">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
            <AdjustmentsHorizontalIcon className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-medium mb-2">No Active Frequencies</h4>
          <p className="text-sm">Add frequencies to see touch controls</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Master Controls */}
      <div className="flex-shrink-0 p-4 bg-black/20 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Touch Mixer</h3>
          <Button
            variant={isPlaying ? 'neural' : 'quantum'}
            onClick={togglePlayback}
            className="px-6 py-2"
            disabled={activeFrequencies.length === 0}
          >
            {isPlaying ? <PauseIcon className="w-5 h-5 mr-2" /> : <PlayIcon className="w-5 h-5 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
        
        {/* Master Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Master Volume</span>
            <span className="text-quantum-400 font-mono text-sm">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume * 100}
            onChange={(e) => setMasterVolume(parseInt(e.target.value) / 100)}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-quantum"
          />
        </div>
      </div>

      {/* Fader Grid */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 h-full">
          {activeFrequencies.map((activeFreq, index) => (
            <Card 
              key={activeFreq.frequency.id} 
              variant="neural" 
              className="rounded-none border-r border-b border-white/10 last:border-r-0"
            >
              <TouchFader
                frequencyId={activeFreq.frequency.id}
                initialVolume={activeFreq.volume}
                frequencyName={activeFreq.frequency.name}
                frequencyHz={activeFreq.frequency.hz_value}
                onVolumeChange={(volume) => {
                  console.log('📱 [TouchFaders] Volume change:', activeFreq.frequency.name, volume)
                }}
              />
            </Card>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 4 - activeFrequencies.length) }).map((_, i) => (
            <Card 
              key={`empty-${i}`} 
              variant="glass" 
              className="rounded-none border-r border-b border-white/10 last:border-r-0 opacity-40"
            >
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white/30">
                  <div className="text-2xl font-mono mb-2">
                    {activeFrequencies.length + i + 1}
                  </div>
                  <div className="text-xs">Available</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}