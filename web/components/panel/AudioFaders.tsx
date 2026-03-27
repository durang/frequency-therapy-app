'use client'

import { useState, useEffect, useRef } from 'react'
import { usePanel } from '@/lib/panelState'
import { usePanelAudioEngine } from '@/lib/panelAudioEngine'
import { Button } from '@/components/ui/button'
import { 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  AdjustmentsVerticalIcon 
} from '@heroicons/react/24/outline'

interface AudioFadersProps {
  frequencyId: string
  initialVolume?: number
}

export function AudioFaders({ frequencyId, initialVolume = 0.7 }: AudioFadersProps) {
  const { updateFrequencyVolume, deactivateFrequency } = usePanel()
  const { updateFrequencyVolume: updateEngineVolume } = usePanelAudioEngine()
  
  const [volume, setVolume] = useState(initialVolume)
  const [isMuted, setIsMuted] = useState(false)
  const [lastVolume, setLastVolume] = useState(initialVolume)
  const [isDragging, setIsDragging] = useState(false)
  
  const faderRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef(volume)
  
  // Track interactions for observability
  const interactionCountRef = useRef(0)
  const lastInteractionRef = useRef<number>(0)

  // Update volume refs when prop changes
  useEffect(() => {
    setVolume(initialVolume)
    volumeRef.current = initialVolume
  }, [initialVolume])

  // Handle volume changes with real-time audio engine updates
  const handleVolumeChange = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
    volumeRef.current = clampedVolume
    
    // Update both panel state and audio engine
    updateFrequencyVolume(frequencyId, clampedVolume)
    updateEngineVolume(frequencyId, clampedVolume)
    
    // Track interaction for observability
    interactionCountRef.current++
    lastInteractionRef.current = performance.now()
    
    console.log('🎚️ [AudioFaders] Volume changed:', frequencyId, clampedVolume)
  }

  // Mute/unmute functionality
  const handleMute = () => {
    if (isMuted) {
      // Unmute - restore previous volume
      handleVolumeChange(lastVolume)
      setIsMuted(false)
      console.log('🔊 [AudioFaders] Unmuted:', frequencyId, 'restored volume:', lastVolume)
    } else {
      // Mute - save current volume and set to 0
      setLastVolume(volume)
      handleVolumeChange(0)
      setIsMuted(true)
      console.log('🔇 [AudioFaders] Muted:', frequencyId, 'saved volume:', volume)
    }
  }

  // Handle slider input
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100
    handleVolumeChange(newVolume)
    
    if (isMuted && newVolume > 0) {
      setIsMuted(false)
    }
  }

  // Handle mouse/touch interactions for better responsiveness
  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Visual feedback for fader position
  const faderPosition = isMuted ? 0 : volume * 100
  const volumeLevel = volume * 100

  // Volume level visual indicator
  const getVolumeColor = () => {
    if (isMuted || volume === 0) return 'text-gray-400'
    if (volume < 0.3) return 'text-green-400'
    if (volume < 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getVolumeBarColor = () => {
    if (isMuted || volume === 0) return 'bg-gray-600'
    if (volume < 0.3) return 'bg-green-500'
    if (volume < 0.7) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-3">
      {/* Volume Fader Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AdjustmentsVerticalIcon className="w-4 h-4 text-quantum-400" />
          <span className="text-xs font-medium text-white/70">Volume Fader</span>
        </div>
        <span className={`text-xs font-mono ${getVolumeColor()}`}>
          {isMuted ? 'MUTE' : `${Math.round(volumeLevel)}%`}
        </span>
      </div>

      {/* Fader Container */}
      <div 
        ref={faderRef}
        className="relative bg-black/30 rounded-lg border border-white/10 p-4"
      >
        {/* Volume Meter */}
        <div className="absolute left-2 top-2 bottom-2 w-2 bg-black/50 rounded-sm overflow-hidden">
          <div 
            className={`absolute bottom-0 left-0 right-0 transition-all duration-100 ${getVolumeBarColor()}`}
            style={{ height: `${faderPosition}%` }}
          />
        </div>

        {/* Main Volume Slider */}
        <div className="ml-6">
          <input
            type="range"
            min="0"
            max="100"
            value={faderPosition}
            onChange={handleSliderChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={`
              w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer
              ${isDragging ? 'ring-2 ring-quantum-400 ring-opacity-50' : ''}
              fader-slider
            `}
            style={{
              background: `linear-gradient(to right, 
                ${getVolumeBarColor().replace('bg-', '')} 0%, 
                ${getVolumeBarColor().replace('bg-', '')} ${faderPosition}%, 
                rgba(255, 255, 255, 0.2) ${faderPosition}%)`
            }}
          />
          
          {/* Fader Markings */}
          <div className="flex justify-between text-xs text-white/40 mt-2">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center justify-between mt-4 space-x-2">
          {/* Mute Button */}
          <Button
            variant={isMuted ? "neural" : "outline"}
            size="sm"
            onClick={handleMute}
            className={`
              px-3 py-2 transition-all duration-200
              ${isMuted ? 'text-red-300 bg-red-500/20 border-red-500/30' : 'text-white/70 hover:text-white'}
            `}
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-4 h-4" />
            ) : (
              <SpeakerWaveIcon className="w-4 h-4" />
            )}
          </Button>

          {/* Quick Volume Presets */}
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVolumeChange(0.25)}
              className="px-2 py-1 text-xs text-white/50 hover:text-white hover:bg-white/10"
            >
              25%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVolumeChange(0.5)}
              className="px-2 py-1 text-xs text-white/50 hover:text-white hover:bg-white/10"
            >
              50%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVolumeChange(0.75)}
              className="px-2 py-1 text-xs text-white/50 hover:text-white hover:bg-white/10"
            >
              75%
            </Button>
          </div>

          {/* Remove Channel */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => deactivateFrequency(frequencyId)}
            className="px-2 py-2 text-red-300 border-red-300/30 hover:bg-red-500/10"
          >
            ×
          </Button>
        </div>

        {/* Advanced Fader Info */}
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50">
          <div className="flex justify-between">
            <span>Interactions: {interactionCountRef.current}</span>
            <span className={isDragging ? 'text-quantum-400 animate-pulse' : ''}>
              {isDragging ? 'Adjusting...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Fine Tune Controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleVolumeChange(Math.max(0, volume - 0.05))}
          className="px-2 py-1 text-xs text-white/50 hover:text-white"
          disabled={volume <= 0}
        >
          -5%
        </Button>
        <div className="flex-1 text-center">
          <span className="text-xs text-white/60">Fine Tune</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleVolumeChange(Math.min(1, volume + 0.05))}
          className="px-2 py-1 text-xs text-white/50 hover:text-white"
          disabled={volume >= 1}
        >
          +5%
        </Button>
      </div>
    </div>
  )
}