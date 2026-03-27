'use client'

import { useCallback } from 'react'
import { usePanelStore, MovementPatternType } from '@/lib/panelState'
import { spatialAudioManager } from '@/lib/spatialAudioManager'

const PATTERNS: { id: MovementPatternType; label: string; icon: string }[] = [
  { id: 'static', label: 'Static', icon: '·' },
  { id: 'circular', label: 'Circular', icon: '↻' },
  { id: 'pendulum', label: 'Pendulum', icon: '↔' },
  { id: 'spiral', label: 'Spiral', icon: '🌀' },
]

interface MovementPatternSelectorProps {
  frequencyId: string
}

export function MovementPatternSelector({ frequencyId }: MovementPatternSelectorProps) {
  const activeFrequencies = usePanelStore((s) => s.activeFrequencies)
  const setMovementPattern = usePanelStore((s) => s.setMovementPattern)
  const spatialEnabled = usePanelStore((s) => s.spatialEnabled)

  const activeFreq = activeFrequencies.find((af) => af.frequency.id === frequencyId)
  const currentPattern: MovementPatternType = activeFreq?.movementPattern ?? 'static'
  const currentSpeed: number = activeFreq?.movementSpeed ?? 1

  const handlePatternSelect = useCallback(
    (pattern: MovementPatternType) => {
      setMovementPattern(frequencyId, pattern, currentSpeed)
      // Directly sync to spatial audio manager
      if (pattern === 'static') {
        spatialAudioManager.stopMovementPattern(frequencyId)
      } else {
        spatialAudioManager.startMovementPattern(frequencyId, pattern, currentSpeed)
      }
    },
    [frequencyId, currentSpeed, setMovementPattern],
  )

  const handleSpeedChange = useCallback(
    (speed: number) => {
      setMovementPattern(frequencyId, currentPattern, speed)
      if (currentPattern !== 'static') {
        spatialAudioManager.startMovementPattern(frequencyId, currentPattern, speed)
      }
    },
    [frequencyId, currentPattern, setMovementPattern],
  )

  if (!spatialEnabled) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
        Movement
      </div>

      {/* Pattern buttons */}
      <div className="flex gap-1">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePatternSelect(p.id)}
            className={`flex-1 py-1 rounded text-[10px] font-medium transition-colors ${
              currentPattern === p.id
                ? 'bg-quantum-500/30 text-quantum-300 border border-quantum-500/40'
                : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
            }`}
            title={p.label}
          >
            <span className="block text-sm leading-none">{p.icon}</span>
          </button>
        ))}
      </div>

      {/* Speed slider — only shown when not static */}
      {currentPattern !== 'static' && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40 w-8">Spd</span>
          <input
            type="range"
            min={50}
            max={300}
            step={10}
            value={currentSpeed * 100}
            onChange={(e) => handleSpeedChange(Number(e.target.value) / 100)}
            className="flex-1 h-1 bg-white/10 rounded appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-quantum-400"
          />
          <span className="text-[10px] text-white/40 font-mono w-6 text-right">
            {currentSpeed.toFixed(1)}x
          </span>
        </div>
      )}
    </div>
  )
}
