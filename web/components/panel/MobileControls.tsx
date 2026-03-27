'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { usePanel } from '@/lib/panelState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TouchFaders } from './TouchFaders'
import { 
  PlayIcon,
  PauseIcon,
  StopIcon,
  SpeakerWaveIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline'

interface MobileFaderControlProps {
  title: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  onChange: (value: number) => void
  className?: string
}

function MobileFaderControl({ 
  title, 
  value, 
  min = 0, 
  max = 100, 
  step = 1,
  unit = '%',
  onChange, 
  className = '' 
}: MobileFaderControlProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [touchId, setTouchId] = useState<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const updateValue = useCallback((clientX: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const sliderWidth = rect.width - 40 // Account for thumb size
    const relativeX = clientX - rect.left - 20 // Center on thumb
    const percentage = Math.max(0, Math.min(1, relativeX / sliderWidth))
    const newValue = min + (percentage * (max - min))
    const steppedValue = Math.round(newValue / step) * step
    
    onChange(steppedValue)
  }, [min, max, step, onChange])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    setIsDragging(true)
    setTouchId(touch.identifier)
    updateValue(touch.clientX)
  }, [updateValue])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (!isDragging) return
    
    const touch = Array.from(e.touches).find(t => t.identifier === touchId)
    if (touch) {
      updateValue(touch.clientX)
    }
  }, [isDragging, touchId, updateValue])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setTouchId(null)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updateValue(e.clientX)
  }, [updateValue])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !touchId) {
        updateValue(e.clientX)
      }
    }

    const handleMouseUp = () => {
      if (isDragging && !touchId) {
        setIsDragging(false)
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
  }, [isDragging, touchId, updateValue])

  const percentage = ((value - min) / (max - min)) * 100
  const thumbPosition = `${percentage}%`

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-white/70 text-sm font-medium">{title}</span>
        <Badge variant="outline" className="font-mono text-xs">
          {value.toFixed(step < 1 ? 1 : 0)}{unit}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(min, value - step * 10))}
          className="p-2 w-10 h-10"
        >
          <MinusIcon className="w-4 h-4" />
        </Button>
        
        <div 
          ref={sliderRef}
          className={`
            relative flex-1 h-12 rounded-lg border-2 transition-colors duration-200
            ${isDragging 
              ? 'border-quantum-400 bg-quantum-400/20' 
              : 'border-white/20 bg-white/5'
            }
          `}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {/* Slider Fill */}
          <div 
            className="absolute left-0 top-0 bottom-0 rounded-l-lg bg-gradient-to-r from-quantum-500 to-quantum-400 transition-all duration-75"
            style={{ width: thumbPosition }}
          />
          
          {/* Slider Thumb */}
          <div 
            className={`
              absolute top-1/2 w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 
              rounded-lg border-2 shadow-lg transition-all duration-75 cursor-grab
              ${isDragging 
                ? 'border-quantum-300 bg-quantum-400 shadow-quantum-400/50 scale-110 cursor-grabbing' 
                : 'border-quantum-500 bg-gradient-to-b from-quantum-400 to-quantum-600 hover:shadow-quantum-400/30'
              }
            `}
            style={{ left: thumbPosition }}
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.min(max, value + step * 10))}
          className="p-2 w-10 h-10"
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function MobileControls() {
  const { 
    activeFrequencies,
    masterVolume,
    isPlaying,
    layoutMode,
    panelView,
    setMasterVolume,
    togglePlayback,
    startPlayback,
    stopPlayback,
    clearActiveFrequencies,
    setPanelView,
    updateFrequencyVolume,
    deactivateFrequency
  } = usePanel()

  const [expanded, setExpanded] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null)

  // Auto-collapse on layout change
  useEffect(() => {
    if (layoutMode !== 'mobile') {
      setExpanded(false)
    }
  }, [layoutMode])

  const handlePlayPause = () => {
    try {
      togglePlayback()
      console.log('📱 [MobileControls] Playback toggled:', !isPlaying)
    } catch (error) {
      console.error('❌ [MobileControls] Failed to toggle playback:', error)
    }
  }

  const handleStop = () => {
    try {
      stopPlayback()
      console.log('📱 [MobileControls] All playback stopped')
    } catch (error) {
      console.error('❌ [MobileControls] Failed to stop playback:', error)
    }
  }

  const handleClearAll = () => {
    try {
      clearActiveFrequencies()
      setSelectedFrequency(null)
      console.log('📱 [MobileControls] All frequencies cleared')
    } catch (error) {
      console.error('❌ [MobileControls] Failed to clear frequencies:', error)
    }
  }

  if (layoutMode !== 'mobile') {
    return null
  }

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Control Header */}
      <div className="flex-shrink-0 p-4 bg-black/20 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center">
              <AdjustmentsHorizontalIcon className="w-6 h-6 mr-2 text-quantum-400" />
              Mobile Mixer
            </h2>
            <p className="text-white/60 text-xs">
              {activeFrequencies.length}/4 channels • Touch optimized
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="p-2"
          >
            {expanded ? (
              <ArrowsPointingInIcon className="w-5 h-5" />
            ) : (
              <ArrowsPointingOutIcon className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Quick Controls */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={isPlaying ? 'neural' : 'quantum'}
            onClick={handlePlayPause}
            disabled={activeFrequencies.length === 0}
            className="flex-1 py-3"
          >
            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleStop}
            disabled={!isPlaying}
            className="py-3"
          >
            <StopIcon className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClearAll}
            disabled={activeFrequencies.length === 0}
            className="py-3 text-red-300 border-red-300/30 hover:bg-red-500/10"
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Master Volume Control */}
        <div className="mt-4">
          <MobileFaderControl
            title="Master Volume"
            value={Math.round(masterVolume * 100)}
            min={0}
            max={100}
            step={1}
            unit="%"
            onChange={(value) => setMasterVolume(value / 100)}
          />
        </div>
      </div>

      {/* Mobile Panel Content */}
      <div className="flex-1 min-h-0">
        {panelView === 'mixer' ? (
          // Touch Fader View
          <div className="h-full">
            {expanded ? (
              // Expanded Touch Controls
              <div className="h-full flex flex-col">
                <div className="flex-shrink-0 p-4 bg-black/10 border-b border-white/10">
                  <h3 className="text-white font-medium text-base mb-3">Individual Controls</h3>
                  
                  {/* Frequency Selector */}
                  {activeFrequencies.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {activeFrequencies.map((activeFreq) => (
                        <Button
                          key={activeFreq.frequency.id}
                          variant={selectedFrequency === activeFreq.frequency.id ? 'quantum' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedFrequency(
                            selectedFrequency === activeFreq.frequency.id 
                              ? null 
                              : activeFreq.frequency.id
                          )}
                          className="text-xs p-2"
                        >
                          <div className="truncate">
                            {activeFreq.frequency.name}
                            <div className="text-xs opacity-70 font-mono">
                              {activeFreq.frequency.hz_value}Hz
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Frequency Controls */}
                {selectedFrequency && (
                  <div className="flex-1 p-4 space-y-4">
                    {(() => {
                      const activeFreq = activeFrequencies.find(af => af.frequency.id === selectedFrequency)
                      if (!activeFreq) return null

                      return (
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-white font-medium mb-2">{activeFreq.frequency.name}</h4>
                            <p className="text-white/60 text-sm mb-4">
                              {activeFreq.frequency.hz_value} Hz • {activeFreq.frequency.category.replace('_', ' ')}
                            </p>
                          </div>

                          <MobileFaderControl
                            title="Channel Volume"
                            value={Math.round(activeFreq.volume * 100)}
                            min={0}
                            max={100}
                            step={1}
                            unit="%"
                            onChange={(value) => {
                              updateFrequencyVolume(selectedFrequency, value / 100)
                            }}
                          />

                          {/* Additional mobile controls can be added here */}
                          <div className="pt-4 border-t border-white/10">
                            <Button
                              variant="outline"
                              onClick={() => {
                                deactivateFrequency(selectedFrequency)
                                setSelectedFrequency(null)
                              }}
                              className="w-full py-3 text-red-300 border-red-300/30 hover:bg-red-500/10"
                            >
                              <XMarkIcon className="w-5 h-5 mr-2" />
                              Remove from Mix
                            </Button>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* No selection state */}
                {!selectedFrequency && activeFrequencies.length > 0 && (
                  <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center text-white/50">
                      <AdjustmentsHorizontalIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Select a frequency above to adjust its settings</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Compact Touch Faders
              <TouchFaders />
            )}
          </div>
        ) : (
          // Library view is handled by FrequencyLibrary component
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white/50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
                <SpeakerWaveIcon className="w-8 h-8" />
              </div>
              <p className="text-sm">Switch to mixer view to see mobile controls</p>
              <Button
                variant="quantum"
                size="sm"
                onClick={() => setPanelView('mixer')}
                className="mt-3"
              >
                Go to Mixer
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex-shrink-0 p-3 bg-black/30 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center space-x-4">
            <span>Status: {isPlaying ? '▶️ Playing' : '⏸️ Stopped'}</span>
            <span>Mode: Mobile</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="font-mono">{Math.round(masterVolume * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}