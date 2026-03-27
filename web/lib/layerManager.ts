'use client'

// Layer Manager — per-channel audio layer stacking engine
// Manages ambient (noise) and binaural beat layers on shared AudioContext
// Base frequency layer is managed by AdvancedFrequencyAudioEngine

export type LayerType = 'ambient' | 'binaural'

export interface BinauralPreset {
  name: string
  beatFreq: number
  label: string
}

export const BINAURAL_PRESETS: BinauralPreset[] = [
  { name: 'Delta', beatFreq: 2, label: 'Deep Sleep' },
  { name: 'Theta', beatFreq: 6, label: 'Meditation' },
  { name: 'Alpha', beatFreq: 10, label: 'Relaxation' },
  { name: 'Beta', beatFreq: 20, label: 'Focus' },
  { name: 'Gamma', beatFreq: 40, label: 'Peak Performance' },
]

interface AmbientLayerNodes {
  type: 'ambient'
  source: AudioBufferSourceNode
  filter: BiquadFilterNode
  gain: GainNode
}

interface BinauralLayerNodes {
  type: 'binaural'
  oscLeft: OscillatorNode
  oscRight: OscillatorNode
  gainLeft: GainNode
  gainRight: GainNode
  merger: ChannelMergerNode
  stereoPanner: StereoPannerNode
  gain: GainNode
  baseFreq: number
  beatFreq: number
}

type LayerNodes = AmbientLayerNodes | BinauralLayerNodes

interface FrequencyLayers {
  ambient?: AmbientLayerNodes
  binaural?: BinauralLayerNodes
}

class LayerManager {
  private audioContext: AudioContext | null = null
  private layers: Map<string, FrequencyLayers> = new Map()
  private destinations: Map<string, AudioNode> = new Map()

  /**
   * Set the shared AudioContext from PanelAudioEngineManager.
   */
  setAudioContext(ctx: AudioContext): void {
    this.audioContext = ctx
    console.log('🎚️ [LayerManager] AudioContext set, state:', ctx.state)
  }

  /**
   * Register the destination node (PannerNode or GainNode) for a frequency channel.
   * Layers for this frequency connect through their own gain → this destination.
   */
  setDestination(frequencyId: string, destination: AudioNode): void {
    this.destinations.set(frequencyId, destination)
  }

  /**
   * Remove destination when a channel is deactivated.
   */
  removeDestination(frequencyId: string): void {
    this.removeAllLayers(frequencyId)
    this.destinations.delete(frequencyId)
  }

  // --- Ambient Layer ---

  /**
   * Add an ambient noise layer filtered to a therapeutic range around the base frequency.
   */
  addAmbientLayer(frequencyId: string, config: { baseFreq: number; volume: number }): boolean {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      console.error('🎚️ [LayerManager] Cannot create ambient layer: AudioContext unavailable or closed')
      return false
    }

    const destination = this.destinations.get(frequencyId)
    if (!destination) {
      console.error('🎚️ [LayerManager] No destination node for frequency:', frequencyId)
      return false
    }

    // Remove existing ambient layer first
    this.removeLayer(frequencyId, 'ambient')

    try {
      const ctx = this.audioContext

      // Create filtered noise buffer (2 seconds, looped)
      const bufferLength = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(2, bufferLength, ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch)
        // Pink-ish noise: attenuate higher frequencies for warmth
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
        for (let i = 0; i < bufferLength; i++) {
          const white = Math.random() * 2 - 1
          b0 = 0.99886 * b0 + white * 0.0555179
          b1 = 0.99332 * b1 + white * 0.0750759
          b2 = 0.96900 * b2 + white * 0.1538520
          b3 = 0.86650 * b3 + white * 0.3104856
          b4 = 0.55000 * b4 + white * 0.5329522
          b5 = -0.7616 * b5 - white * 0.0168980
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
          b6 = white * 0.115926
        }
      }

      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true

      // Bandpass filter centered around base frequency for therapeutic resonance
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = config.baseFreq
      filter.Q.value = 1.5

      const gain = ctx.createGain()
      gain.gain.value = Math.max(0, Math.min(1, config.volume))

      // Signal chain: source → filter → gain → destination
      source.connect(filter)
      filter.connect(gain)
      gain.connect(destination)

      source.start()

      const layerNodes: AmbientLayerNodes = { type: 'ambient', source, filter, gain }
      const freqLayers = this.layers.get(frequencyId) || {}
      freqLayers.ambient = layerNodes
      this.layers.set(frequencyId, freqLayers)

      console.log('🎚️ [LayerManager] Ambient layer added for', frequencyId,
        '| baseFreq:', config.baseFreq, '| volume:', config.volume)
      return true
    } catch (error) {
      console.error('🎚️ [LayerManager] Failed to create ambient layer:', error,
        '| AudioContext state:', this.audioContext?.state, '| node type: AudioBufferSourceNode')
      return false
    }
  }

  // --- Binaural Beat Layer ---

  /**
   * Add a binaural beat layer: left oscillator at baseFreq, right at baseFreq + beatFreq.
   * Uses ChannelMergerNode for true stereo separation and StereoPannerNode to maintain
   * L/R difference even when spatial PannerNode repositions the channel.
   */
  addBinauralLayer(frequencyId: string, baseFreq: number, beatFreq: number, volume: number = 0.4): boolean {
    // Clamp beat frequency to valid range
    const clampedBeat = Math.max(0.5, Math.min(40, beatFreq))
    const clampedVolume = Math.max(0, Math.min(1, volume))

    if (!this.audioContext || this.audioContext.state === 'closed') {
      console.error('🎚️ [LayerManager] Cannot create binaural layer: AudioContext unavailable or closed')
      return false
    }

    const destination = this.destinations.get(frequencyId)
    if (!destination) {
      console.error('🎚️ [LayerManager] No destination node for frequency:', frequencyId)
      return false
    }

    // Remove existing binaural layer first
    this.removeLayer(frequencyId, 'binaural')

    try {
      const ctx = this.audioContext

      // Left oscillator — base frequency
      const oscLeft = ctx.createOscillator()
      oscLeft.type = 'sine'
      oscLeft.frequency.value = baseFreq

      // Right oscillator — base + beat offset
      const oscRight = ctx.createOscillator()
      oscRight.type = 'sine'
      oscRight.frequency.value = baseFreq + clampedBeat

      // Individual channel gains
      const gainLeft = ctx.createGain()
      gainLeft.gain.value = clampedVolume
      const gainRight = ctx.createGain()
      gainRight.gain.value = clampedVolume

      // Merge into stereo: left → channel 0, right → channel 1
      const merger = ctx.createChannelMerger(2)
      oscLeft.connect(gainLeft)
      gainLeft.connect(merger, 0, 0)
      oscRight.connect(gainRight)
      gainRight.connect(merger, 0, 1)

      // StereoPannerNode to preserve L/R separation through spatial panning
      const stereoPanner = ctx.createStereoPanner()
      stereoPanner.pan.value = 0 // centered; spatial PannerNode handles positioning

      // Master gain for the binaural layer
      const gain = ctx.createGain()
      gain.gain.value = 1 // volume is controlled at individual channel gains

      // Signal chain: merger → stereoPanner → gain → destination
      merger.connect(stereoPanner)
      stereoPanner.connect(gain)
      gain.connect(destination)

      oscLeft.start()
      oscRight.start()

      const layerNodes: BinauralLayerNodes = {
        type: 'binaural',
        oscLeft, oscRight,
        gainLeft, gainRight,
        merger, stereoPanner, gain,
        baseFreq, beatFreq: clampedBeat,
      }
      const freqLayers = this.layers.get(frequencyId) || {}
      freqLayers.binaural = layerNodes
      this.layers.set(frequencyId, freqLayers)

      console.log('🎚️ [LayerManager] Binaural layer added for', frequencyId,
        '| baseFreq:', baseFreq, '| beatFreq:', clampedBeat, 'Hz | volume:', clampedVolume)
      return true
    } catch (error) {
      console.error('🎚️ [LayerManager] Failed to create binaural layer:', error,
        '| AudioContext state:', this.audioContext?.state, '| node type: OscillatorNode')
      return false
    }
  }

  // --- Layer Removal ---

  removeLayer(frequencyId: string, layerType: LayerType): void {
    const freqLayers = this.layers.get(frequencyId)
    if (!freqLayers) return

    const nodes = freqLayers[layerType]
    if (!nodes) return

    try {
      if (nodes.type === 'ambient') {
        nodes.source.stop()
        nodes.source.disconnect()
        nodes.filter.disconnect()
        nodes.gain.disconnect()
      } else if (nodes.type === 'binaural') {
        nodes.oscLeft.stop()
        nodes.oscRight.stop()
        nodes.oscLeft.disconnect()
        nodes.oscRight.disconnect()
        nodes.gainLeft.disconnect()
        nodes.gainRight.disconnect()
        nodes.merger.disconnect()
        nodes.stereoPanner.disconnect()
        nodes.gain.disconnect()
      }
    } catch {
      // Nodes may already be stopped/disconnected
    }

    delete freqLayers[layerType]
    console.log('🎚️ [LayerManager] Removed', layerType, 'layer for', frequencyId)
  }

  removeAllLayers(frequencyId: string): void {
    this.removeLayer(frequencyId, 'ambient')
    this.removeLayer(frequencyId, 'binaural')
    this.layers.delete(frequencyId)
    console.log('🎚️ [LayerManager] All layers removed for', frequencyId)
  }

  // --- Volume Control ---

  updateLayerVolume(frequencyId: string, layerType: LayerType, volume: number): void {
    const clampedVol = Math.max(0, Math.min(1, volume))
    const freqLayers = this.layers.get(frequencyId)
    if (!freqLayers) return

    const nodes = freqLayers[layerType]
    if (!nodes) return

    if (nodes.type === 'ambient') {
      nodes.gain.gain.value = clampedVol
    } else if (nodes.type === 'binaural') {
      nodes.gainLeft.gain.value = clampedVol
      nodes.gainRight.gain.value = clampedVol
    }
  }

  // --- Binaural Frequency Update ---

  setBinauralFrequency(frequencyId: string, beatFreq: number): void {
    const clamped = Math.max(0.5, Math.min(40, beatFreq))
    const freqLayers = this.layers.get(frequencyId)
    if (!freqLayers?.binaural) return

    const b = freqLayers.binaural
    b.beatFreq = clamped
    // Right oscillator = baseFreq + beatFreq
    if (this.audioContext && this.audioContext.state !== 'closed') {
      b.oscRight.frequency.value = b.baseFreq + clamped
    }

    console.log('🎚️ [LayerManager] Binaural frequency updated for', frequencyId,
      '| new beatFreq:', clamped, 'Hz')
  }

  // --- Observability ---

  getActiveLayerCount(frequencyId: string): number {
    const freqLayers = this.layers.get(frequencyId)
    if (!freqLayers) return 0
    let count = 0
    if (freqLayers.ambient) count++
    if (freqLayers.binaural) count++
    return count
  }

  hasLayer(frequencyId: string, layerType: LayerType): boolean {
    const freqLayers = this.layers.get(frequencyId)
    return !!freqLayers?.[layerType]
  }

  getTotalActiveNodes(): number {
    let total = 0
    this.layers.forEach((freqLayers) => {
      if (freqLayers.ambient) total++ // 1 source node
      if (freqLayers.binaural) total += 2 // 2 oscillators
    })
    return total
  }

  // --- Cleanup ---

  destroy(): void {
    this.layers.forEach((_layers, frequencyId) => {
      this.removeAllLayers(frequencyId)
    })
    this.layers.clear()
    this.destinations.clear()
    this.audioContext = null
    console.log('🎚️ [LayerManager] Destroyed')
  }
}

// Global singleton
export const layerManager = new LayerManager()

// React hook
export function useLayerManager() {
  return {
    setAudioContext: (ctx: AudioContext) => layerManager.setAudioContext(ctx),
    setDestination: (id: string, node: AudioNode) => layerManager.setDestination(id, node),
    removeDestination: (id: string) => layerManager.removeDestination(id),
    addAmbientLayer: (id: string, config: { baseFreq: number; volume: number }) =>
      layerManager.addAmbientLayer(id, config),
    addBinauralLayer: (id: string, baseFreq: number, beatFreq: number, volume?: number) =>
      layerManager.addBinauralLayer(id, baseFreq, beatFreq, volume),
    removeLayer: (id: string, type: LayerType) => layerManager.removeLayer(id, type),
    removeAllLayers: (id: string) => layerManager.removeAllLayers(id),
    updateLayerVolume: (id: string, type: LayerType, vol: number) =>
      layerManager.updateLayerVolume(id, type, vol),
    setBinauralFrequency: (id: string, beatFreq: number) =>
      layerManager.setBinauralFrequency(id, beatFreq),
    getActiveLayerCount: (id: string) => layerManager.getActiveLayerCount(id),
    hasLayer: (id: string, type: LayerType) => layerManager.hasLayer(id, type),
    getTotalActiveNodes: () => layerManager.getTotalActiveNodes(),
    destroy: () => layerManager.destroy(),
  }
}
