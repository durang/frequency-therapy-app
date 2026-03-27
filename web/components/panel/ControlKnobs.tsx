'use client'

import { useState, useEffect, useRef } from 'react'
import { usePanelAudioEngine } from '@/lib/panelAudioEngine'
import { Frequency } from '@/types'
import { Button } from '@/components/ui/button'
import { 
  CogIcon, 
  ArrowPathIcon,
  BeakerIcon,
  SpeakerWaveIcon 
} from '@heroicons/react/24/outline'

interface ControlKnobsProps {
  frequencyId: string
  frequency: Frequency
}

interface KnobValue {
  value: number
  min: number
  max: number
  step: number
  label: string
  unit: string
  default: number
}

export function ControlKnobs({ frequencyId, frequency }: ControlKnobsProps) {
  const { updateFrequencyParameter } = usePanelAudioEngine()
  
  // Knob state management
  const [knobs, setKnobs] = useState<{ [key: string]: KnobValue }>({
    frequency: {
      value: frequency.hz_value,
      min: Math.max(1, frequency.hz_value - 50),
      max: frequency.hz_value + 50,
      step: 0.1,
      label: 'Frequency',
      unit: 'Hz',
      default: frequency.hz_value
    },
    detune: {
      value: 0,
      min: -100,
      max: 100,
      step: 1,
      label: 'Detune',
      unit: 'cents',
      default: 0
    },
    harmonics: {
      value: 0,
      min: 0,
      max: 5,
      step: 1,
      label: 'Harmonics',
      unit: 'x',
      default: 0
    },
    modulation: {
      value: 0,
      min: 0,
      max: 10,
      step: 0.1,
      label: 'LFO Rate',
      unit: 'Hz',
      default: 0
    }
  })
  
  const [activeKnob, setActiveKnob] = useState<string | null>(null)
  const [knobInteractions, setKnobInteractions] = useState<{ [key: string]: number }>({})
  
  // Refs for performance tracking
  const lastUpdateTimeRef = useRef<{ [key: string]: number }>({})
  const updateCountRef = useRef<{ [key: string]: number }>({})

  // Update knob value and audio parameter
  const updateKnobValue = (knobKey: string, newValue: number) => {
    const knob = knobs[knobKey]
    if (!knob) return
    
    const clampedValue = Math.max(knob.min, Math.min(knob.max, newValue))
    const startTime = performance.now()
    
    setKnobs(prev => ({
      ...prev,
      [knobKey]: { ...prev[knobKey], value: clampedValue }
    }))
    
    // Update interaction count
    setKnobInteractions(prev => ({
      ...prev,
      [knobKey]: (prev[knobKey] || 0) + 1
    }))
    
    // Update audio parameter based on knob type
    try {
      switch (knobKey) {
        case 'frequency':
          updateFrequencyParameter(frequencyId, 'frequency', clampedValue)
          break
        case 'detune':
          // Convert cents to frequency offset
          const detuneRatio = Math.pow(2, clampedValue / 1200)
          updateFrequencyParameter(frequencyId, 'frequency', frequency.hz_value * detuneRatio)
          break
        // Note: harmonics and modulation would need additional audio engine support
        default:
          console.log('🎛️ [ControlKnobs] Parameter not yet implemented:', knobKey, clampedValue)
      }
      
      // Track performance
      const updateTime = performance.now() - startTime
      lastUpdateTimeRef.current[knobKey] = updateTime
      updateCountRef.current[knobKey] = (updateCountRef.current[knobKey] || 0) + 1
      
      console.log('🎚️ [ControlKnobs] Knob updated:', knobKey, clampedValue, knob.unit, 'latency:', updateTime.toFixed(2) + 'ms')
      
    } catch (error) {
      console.error('❌ [ControlKnobs] Failed to update parameter:', error)
    }
  }

  // Reset knob to default value
  const resetKnob = (knobKey: string) => {
    const knob = knobs[knobKey]
    if (!knob) return
    
    updateKnobValue(knobKey, knob.default)
    console.log('🔄 [ControlKnobs] Knob reset to default:', knobKey, knob.default)
  }

  // Reset all knobs
  const resetAllKnobs = () => {
    Object.entries(knobs).forEach(([key, knob]) => {
      updateKnobValue(key, knob.default)
    })
    console.log('🔄 [ControlKnobs] All knobs reset to defaults')
  }

  // Knob visual component
  const KnobControl = ({ knobKey, knob }: { knobKey: string; knob: KnobValue }) => {
    const percentage = ((knob.value - knob.min) / (knob.max - knob.min)) * 100
    const rotation = (percentage / 100) * 270 - 135 // -135 to 135 degrees
    
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      updateKnobValue(knobKey, newValue)
    }
    
    const handleMouseDown = () => setActiveKnob(knobKey)
    const handleMouseUp = () => setActiveKnob(null)
    
    const isActive = activeKnob === knobKey
    const interactionCount = knobInteractions[knobKey] || 0
    const lastUpdateTime = lastUpdateTimeRef.current[knobKey] || 0
    
    return (
      <div className="space-y-2">
        {/* Knob Label */}
        <div className="text-center">
          <div className="text-xs font-medium text-white/70">{knob.label}</div>
          <div className={`text-xs font-mono ${isActive ? 'text-quantum-400 animate-pulse' : 'text-white/50'}`}>
            {knob.value.toFixed(knob.step >= 1 ? 0 : 1)}{knob.unit}
          </div>
        </div>
        
        {/* Visual Knob */}
        <div className="relative w-16 h-16 mx-auto">
          {/* Knob Base */}
          <div className={`
            w-full h-full rounded-full border-2 transition-all duration-200
            ${isActive ? 'border-quantum-400 shadow-lg shadow-quantum-400/20' : 'border-white/20'}
            bg-gradient-to-br from-gray-700 to-gray-800
          `}>
            {/* Knob Indicator */}
            <div 
              className="absolute top-1 left-1/2 w-1 h-6 bg-quantum-400 rounded-full transform -translate-x-1/2 origin-bottom transition-transform duration-150"
              style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
            />
            
            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          {/* Value Arc */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="rgba(124, 58, 237, 0.8)"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${(percentage / 100) * 188.5} 188.5`}
              strokeLinecap="round"
              className="transition-all duration-200"
            />
          </svg>
        </div>
        
        {/* Slider Control */}
        <input
          type="range"
          min={knob.min}
          max={knob.max}
          step={knob.step}
          value={knob.value}
          onChange={handleSliderChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer knob-slider"
        />
        
        {/* Quick Actions */}
        <div className="flex justify-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => resetKnob(knobKey)}
            className="px-2 py-1 text-xs text-white/50 hover:text-white"
          >
            <ArrowPathIcon className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateKnobValue(knobKey, knob.min)}
            className="px-2 py-1 text-xs text-white/50 hover:text-white"
            disabled={knob.value === knob.min}
          >
            MIN
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateKnobValue(knobKey, knob.max)}
            className="px-2 py-1 text-xs text-white/50 hover:text-white"
            disabled={knob.value === knob.max}
          >
            MAX
          </Button>
        </div>
        
        {/* Performance Info (Development) */}
        {process.env.NODE_ENV === 'development' && interactionCount > 0 && (
          <div className="text-xs text-white/30 text-center space-y-1">
            <div>Updates: {interactionCount}</div>
            {lastUpdateTime > 0 && (
              <div>Latency: {lastUpdateTime.toFixed(1)}ms</div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Control Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CogIcon className="w-4 h-4 text-quantum-400" />
          <span className="text-sm font-medium text-white/70">Parameter Controls</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetAllKnobs}
          className="px-2 py-1 text-xs text-white/50 hover:text-white"
        >
          <ArrowPathIcon className="w-3 h-3 mr-1" />
          Reset All
        </Button>
      </div>

      {/* Knob Grid */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(knobs).map(([key, knob]) => (
          <KnobControl key={key} knobKey={key} knob={knob} />
        ))}
      </div>

      {/* Preset Controls */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 mb-2">
          <BeakerIcon className="w-4 h-4 text-neural-400" />
          <span className="text-xs font-medium text-white/70">Quick Presets</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateKnobValue('detune', 0)
              updateKnobValue('harmonics', 0)
              updateKnobValue('modulation', 0)
            }}
            className="text-xs"
          >
            Pure Tone
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateKnobValue('detune', Math.random() * 20 - 10)
              updateKnobValue('harmonics', Math.floor(Math.random() * 3) + 1)
              updateKnobValue('modulation', Math.random() * 2)
            }}
            className="text-xs"
          >
            Complex
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateKnobValue('detune', 0)
              updateKnobValue('harmonics', 2)
              updateKnobValue('modulation', 4)
            }}
            className="text-xs"
          >
            Meditation
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateKnobValue('detune', 5)
              updateKnobValue('harmonics', 1)
              updateKnobValue('modulation', 8)
            }}
            className="text-xs"
          >
            Focus
          </Button>
        </div>
      </div>

      {/* Status Info */}
      <div className="pt-2 border-t border-white/10 text-xs text-white/50">
        <div className="flex justify-between items-center">
          <span>Base: {frequency.hz_value}Hz</span>
          <span className="flex items-center space-x-1">
            <SpeakerWaveIcon className="w-3 h-3" />
            <span>
              {Object.values(knobInteractions).reduce((a, b) => a + b, 0)} adjustments
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}