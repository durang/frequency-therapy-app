'use client'

import { useEffect, useCallback } from 'react'
import { usePanelStore } from '@/lib/panelState'
import { layerManager, BINAURAL_PRESETS } from '@/lib/layerManager'
import { panelAudioEngine } from '@/lib/panelAudioEngine'
import { Frequency } from '@/types'

interface LayerControlsProps {
  frequencyId: string
  frequency: Frequency
}

export function LayerControls({ frequencyId, frequency }: LayerControlsProps) {
  const activeFrequencies = usePanelStore((s) => s.activeFrequencies)
  const toggleLayer = usePanelStore((s) => s.toggleLayer)
  const setBinauralFrequency = usePanelStore((s) => s.setBinauralFrequency)
  const updateLayerVolume = usePanelStore((s) => s.updateLayerVolume)

  const activeFreq = activeFrequencies.find(af => af.frequency.id === frequencyId)
  const layers = activeFreq?.layers ?? {
    ambient: false,
    binaural: false,
    binauralFreq: 10,
    ambientVolume: 0.3,
    binauralVolume: 0.4,
  }

  // Sync layer state with LayerManager audio nodes
  useEffect(() => {
    const ctx = panelAudioEngine.getAudioContext()
    if (!ctx || ctx.state === 'closed') return

    // Ensure LayerManager has the shared context
    layerManager.setAudioContext(ctx)

    // Ambient layer sync
    if (layers.ambient) {
      if (!layerManager.hasLayer(frequencyId, 'ambient')) {
        layerManager.addAmbientLayer(frequencyId, {
          baseFreq: frequency.hz_value,
          volume: layers.ambientVolume,
        })
      } else {
        layerManager.updateLayerVolume(frequencyId, 'ambient', layers.ambientVolume)
      }
    } else {
      if (layerManager.hasLayer(frequencyId, 'ambient')) {
        layerManager.removeLayer(frequencyId, 'ambient')
      }
    }

    // Binaural layer sync
    if (layers.binaural) {
      if (!layerManager.hasLayer(frequencyId, 'binaural')) {
        layerManager.addBinauralLayer(
          frequencyId,
          frequency.hz_value,
          layers.binauralFreq,
          layers.binauralVolume
        )
      } else {
        layerManager.setBinauralFrequency(frequencyId, layers.binauralFreq)
        layerManager.updateLayerVolume(frequencyId, 'binaural', layers.binauralVolume)
      }
    } else {
      if (layerManager.hasLayer(frequencyId, 'binaural')) {
        layerManager.removeLayer(frequencyId, 'binaural')
      }
    }
  }, [frequencyId, frequency.hz_value, layers.ambient, layers.binaural, layers.binauralFreq, layers.ambientVolume, layers.binauralVolume])

  // Clean up layers on unmount
  useEffect(() => {
    return () => {
      layerManager.removeAllLayers(frequencyId)
    }
  }, [frequencyId])

  const handleToggleAmbient = useCallback(() => {
    toggleLayer(frequencyId, 'ambient')
  }, [frequencyId, toggleLayer])

  const handleToggleBinaural = useCallback(() => {
    toggleLayer(frequencyId, 'binaural')
  }, [frequencyId, toggleLayer])

  const handlePresetSelect = useCallback((beatFreq: number) => {
    setBinauralFrequency(frequencyId, beatFreq)
  }, [frequencyId, setBinauralFrequency])

  const handleAmbientVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateLayerVolume(frequencyId, 'ambient', parseFloat(e.target.value) / 100)
  }, [frequencyId, updateLayerVolume])

  const handleBinauralVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateLayerVolume(frequencyId, 'binaural', parseFloat(e.target.value) / 100)
  }, [frequencyId, updateLayerVolume])

  const currentPreset = BINAURAL_PRESETS.find(p => p.beatFreq === layers.binauralFreq)

  return (
    <div className="space-y-3">
      {/* Layer Stack Indicator */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-white/50 text-[10px] uppercase tracking-wider font-medium">Layers</span>
        <div className="flex gap-0.5 flex-1">
          {/* Base layer — always on */}
          <div className="h-1.5 flex-1 rounded-full bg-quantum-400/80" title="Base frequency" />
          {/* Ambient layer */}
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              layers.ambient ? 'bg-emerald-400/80' : 'bg-white/10'
            }`}
            title="Ambient layer"
          />
          {/* Binaural layer */}
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              layers.binaural ? 'bg-violet-400/80' : 'bg-white/10'
            }`}
            title="Binaural beats"
          />
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-1.5">
        {/* Base — always on */}
        <button
          disabled
          className="flex-1 px-2 py-1 rounded text-[10px] font-medium bg-quantum-500/20 text-quantum-300 border border-quantum-400/30 cursor-not-allowed"
        >
          Base
        </button>

        {/* Ambient toggle */}
        <button
          onClick={handleToggleAmbient}
          className={`flex-1 px-2 py-1 rounded text-[10px] font-medium border transition-all ${
            layers.ambient
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-sm shadow-emerald-500/20'
              : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70'
          }`}
        >
          Ambient
        </button>

        {/* Binaural toggle */}
        <button
          onClick={handleToggleBinaural}
          className={`flex-1 px-2 py-1 rounded text-[10px] font-medium border transition-all ${
            layers.binaural
              ? 'bg-violet-500/20 text-violet-300 border-violet-400/40 shadow-sm shadow-violet-500/20'
              : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70'
          }`}
        >
          Binaural
        </button>
      </div>

      {/* Ambient Volume Slider */}
      {layers.ambient && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-white/50 text-[10px]">Ambient Vol</span>
            <span className="text-emerald-300 text-[10px] font-mono">{Math.round(layers.ambientVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(layers.ambientVolume * 100)}
            onChange={handleAmbientVolume}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-400"
          />
        </div>
      )}

      {/* Binaural Controls */}
      {layers.binaural && (
        <div className="space-y-2">
          {/* Binaural Volume */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-[10px]">Binaural Vol</span>
              <span className="text-violet-300 text-[10px] font-mono">{Math.round(layers.binauralVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(layers.binauralVolume * 100)}
              onChange={handleBinauralVolume}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-violet-400"
            />
          </div>

          {/* Binaural Presets */}
          <div className="space-y-1">
            <span className="text-white/50 text-[10px]">
              Beat: {currentPreset ? `${currentPreset.name} — ${currentPreset.label}` : `${layers.binauralFreq}Hz`}
            </span>
            <div className="flex flex-wrap gap-1">
              {BINAURAL_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset.beatFreq)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-medium border transition-all ${
                    layers.binauralFreq === preset.beatFreq
                      ? 'bg-violet-500/30 text-violet-200 border-violet-400/50'
                      : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60'
                  }`}
                  title={`${preset.name} (${preset.beatFreq}Hz) — ${preset.label}`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
