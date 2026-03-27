'use client'

import { AdvancedFrequencyAudioEngine, AdvancedAudioConfig } from './advanced-audio-engine'
import { spatialAudioManager } from './spatialAudioManager'

// Audio engine instance manager for panel
class PanelAudioEngineManager {
  private engines: Map<string, AdvancedFrequencyAudioEngine> = new Map()
  private masterGain: GainNode | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private isInitialized = false

  // Performance metrics
  private performanceMetrics = {
    audioLatency: 0,
    renderFps: 0,
    lastRenderTime: 0,
    parameterChangeCount: 0,
    lastParameterChange: 0
  }

  // Initialize audio context and master controls
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // Master gain for mixing
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = 0.7
      this.masterGain.connect(this.audioContext.destination)

      // Master analyser for visualization
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
      this.analyser.smoothingTimeConstant = 0.8
      this.analyser.connect(this.audioContext.destination)

      this.isInitialized = true
      
      // Hand the shared context to the spatial audio manager
      spatialAudioManager.setAudioContext(this.audioContext)
      
      console.log('🎛️ [PanelAudioEngine] Initialized successfully')
      console.log('🎛️ [PanelAudioEngine] Sample rate:', this.audioContext.sampleRate)
      console.log('🎛️ [PanelAudioEngine] Base latency:', this.audioContext.baseLatency)
      
    } catch (error) {
      console.error('❌ [PanelAudioEngine] Failed to initialize:', error)
      throw new Error(`Audio engine initialization failed: ${error}`)
    }
  }

  // Create or get audio engine for frequency
  async createFrequencyEngine(frequencyId: string, config: AdvancedAudioConfig): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    // Stop existing engine if present
    if (this.engines.has(frequencyId)) {
      this.engines.get(frequencyId)?.stop()
      this.engines.delete(frequencyId)
    }

    try {
      // Pass shared AudioContext so all engines use the same context
      const engine = new AdvancedFrequencyAudioEngine(config, this.audioContext ?? undefined)
      this.engines.set(frequencyId, engine)
      
      // Create a spatial PannerNode and insert into signal chain:
      // engine output → PannerNode → masterGain → destination
      if (this.audioContext && this.masterGain) {
        const pannerNode = spatialAudioManager.createPannerNode(frequencyId)
        const outputNode = engine.getOutputNode()
        if (pannerNode && outputNode) {
          // Disconnect engine from its default destination and route through panner
          try { outputNode.disconnect() } catch { /* may not be connected yet */ }
          outputNode.connect(pannerNode)
          pannerNode.connect(this.masterGain)
        } else if (outputNode) {
          // No panner available — route directly to masterGain
          try { outputNode.disconnect() } catch { /* may not be connected yet */ }
          outputNode.connect(this.masterGain)
        }
      }
      
      console.log('🎵 [PanelAudioEngine] Created engine for frequency:', frequencyId, config.frequency + 'Hz')
      
      // Track performance
      this.trackParameterChange()
      
    } catch (error) {
      console.error('❌ [PanelAudioEngine] Failed to create engine:', error)
      throw error
    }
  }

  // Start frequency playback
  async startFrequency(frequencyId: string): Promise<void> {
    const engine = this.engines.get(frequencyId)
    if (!engine) {
      throw new Error(`No engine found for frequency: ${frequencyId}`)
    }

    try {
      await engine.play()
      console.log('▶️ [PanelAudioEngine] Started frequency:', frequencyId)
      
      this.trackParameterChange()
      
    } catch (error) {
      console.error('❌ [PanelAudioEngine] Failed to start frequency:', error)
      throw error
    }
  }

  // Stop frequency playback
  stopFrequency(frequencyId: string): void {
    const engine = this.engines.get(frequencyId)
    if (engine) {
      engine.stop()
      // Clean up spatial PannerNode for this frequency
      spatialAudioManager.removePannerNode(frequencyId)
      console.log('⏹️ [PanelAudioEngine] Stopped frequency:', frequencyId)
    }
  }

  // Update frequency volume with latency tracking
  updateFrequencyVolume(frequencyId: string, volume: number): void {
    const startTime = performance.now()
    
    const engine = this.engines.get(frequencyId)
    if (engine) {
      engine.updateVolume(volume)
      
      // Track latency
      const latency = performance.now() - startTime
      this.performanceMetrics.audioLatency = latency
      this.trackParameterChange()
      
      console.log('🔊 [PanelAudioEngine] Volume updated:', frequencyId, 'volume:', volume, 'latency:', latency.toFixed(2) + 'ms')
    }
  }

  // Update frequency parameter (frequency, waveform, etc.)
  updateFrequencyParameter(frequencyId: string, parameter: 'frequency' | 'waveform', value: any): void {
    const startTime = performance.now()
    
    const engine = this.engines.get(frequencyId)
    if (engine) {
      if (parameter === 'frequency' && typeof value === 'number') {
        engine.updateFrequency(value)
      }
      
      // Track latency
      const latency = performance.now() - startTime
      this.performanceMetrics.audioLatency = latency
      this.trackParameterChange()
      
      console.log('🎚️ [PanelAudioEngine] Parameter updated:', frequencyId, parameter, value, 'latency:', latency.toFixed(2) + 'ms')
    }
  }

  // Update master volume
  updateMasterVolume(volume: number): void {
    const startTime = performance.now()
    
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, volume),
        this.audioContext.currentTime + 0.05
      )
      
      const latency = performance.now() - startTime
      this.performanceMetrics.audioLatency = latency
      
      console.log('🔊 [PanelAudioEngine] Master volume updated:', volume, 'latency:', latency.toFixed(2) + 'ms')
    }
  }

  // Get master audio analysis for visualization
  getMasterAnalysis(): { frequencies: Uint8Array; waveform: Uint8Array } | null {
    if (!this.analyser) return null

    const frequencies = new Uint8Array(this.analyser.frequencyBinCount)
    const waveform = new Uint8Array(this.analyser.fftSize)

    this.analyser.getByteFrequencyData(frequencies)
    this.analyser.getByteTimeDomainData(waveform)

    return { frequencies, waveform }
  }

  // Get individual frequency analysis
  getFrequencyAnalysis(frequencyId: string): { frequencies: Uint8Array; waveform: Uint8Array } | null {
    const engine = this.engines.get(frequencyId)
    if (!engine) return null

    return engine.getAudioAnalysis()
  }

  // Stop all frequencies
  stopAllFrequencies(): void {
    this.engines.forEach((engine, frequencyId) => {
      engine.stop()
      spatialAudioManager.removePannerNode(frequencyId)
      console.log('⏹️ [PanelAudioEngine] Stopped frequency:', frequencyId)
    })
    this.engines.clear()
    
    console.log('🛑 [PanelAudioEngine] All frequencies stopped')
  }

  // Clean up audio engine
  destroy(): void {
    this.stopAllFrequencies()
    spatialAudioManager.destroy()
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    
    this.masterGain = null
    this.analyser = null
    this.isInitialized = false
    
    console.log('🗑️ [PanelAudioEngine] Destroyed')
  }

  // Expose shared AudioContext for external consumers (e.g. spatial manager, layer manager)
  getAudioContext(): AudioContext | null {
    return this.audioContext
  }

  // Performance tracking
  private trackParameterChange(): void {
    this.performanceMetrics.parameterChangeCount++
    this.performanceMetrics.lastParameterChange = performance.now()
  }

  // Performance metrics for observability
  getPerformanceMetrics() {
    const currentTime = performance.now()
    
    return {
      ...this.performanceMetrics,
      isInitialized: this.isInitialized,
      activeEngines: this.engines.size,
      contextState: this.audioContext?.state || 'unknown',
      sampleRate: this.audioContext?.sampleRate || 0,
      baseLatency: this.audioContext?.baseLatency || 0,
      currentTime: this.audioContext?.currentTime || 0,
      timeSinceLastChange: currentTime - this.performanceMetrics.lastParameterChange,
      spatialNodeCount: spatialAudioManager.getActiveNodeCount(),
      panningModel: spatialAudioManager.getPanningModel(),
    }
  }

  // Get engine status
  getEngineStatus(frequencyId: string) {
    const engine = this.engines.get(frequencyId)
    if (!engine) return null

    return {
      playing: engine.playing,
      config: engine.currentConfig
    }
  }

  // Get all active engines
  getActiveEngines(): string[] {
    return Array.from(this.engines.keys()).filter(id => {
      const engine = this.engines.get(id)
      return engine?.playing || false
    })
  }
}

// Global instance
export const panelAudioEngine = new PanelAudioEngineManager()

// Hook for React components
export function usePanelAudioEngine() {
  return {
    initialize: () => panelAudioEngine.initialize(),
    createFrequencyEngine: (id: string, config: AdvancedAudioConfig) => 
      panelAudioEngine.createFrequencyEngine(id, config),
    startFrequency: (id: string) => panelAudioEngine.startFrequency(id),
    stopFrequency: (id: string) => panelAudioEngine.stopFrequency(id),
    updateFrequencyVolume: (id: string, volume: number) => 
      panelAudioEngine.updateFrequencyVolume(id, volume),
    updateFrequencyParameter: (id: string, parameter: 'frequency' | 'waveform', value: any) =>
      panelAudioEngine.updateFrequencyParameter(id, parameter, value),
    updateMasterVolume: (volume: number) => panelAudioEngine.updateMasterVolume(volume),
    getMasterAnalysis: () => panelAudioEngine.getMasterAnalysis(),
    getFrequencyAnalysis: (id: string) => panelAudioEngine.getFrequencyAnalysis(id),
    stopAllFrequencies: () => panelAudioEngine.stopAllFrequencies(),
    getPerformanceMetrics: () => panelAudioEngine.getPerformanceMetrics(),
    getEngineStatus: (id: string) => panelAudioEngine.getEngineStatus(id),
    getActiveEngines: () => panelAudioEngine.getActiveEngines(),
    getAudioContext: () => panelAudioEngine.getAudioContext(),
  }
}