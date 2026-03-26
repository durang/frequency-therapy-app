// Advanced Audio Engine - Neural Phase Locking Technology
// Based on latest scientific research from Brain.fm and MIT studies

export interface AdvancedAudioConfig {
  frequency: number
  volume: number
  waveform: 'sine' | 'square' | 'triangle' | 'sawtooth'
  binauralBeat?: {
    enabled: boolean
    beatFrequency: number
    carrierLeft: number
    carrierRight: number
  }
  neuralPhaseLocking?: {
    enabled: boolean
    targetBrainwave: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'
    harmonics: number[]
  }
  adaptiveModulation?: {
    enabled: boolean
    heartRateSync: boolean
    breathingSync: boolean
    circadianSync: boolean
  }
  spatialAudio?: {
    enabled: boolean
    position: { x: number; y: number; z: number }
    movement: 'static' | 'circular' | 'pendulum' | 'spiral'
  }
}

export class AdvancedFrequencyAudioEngine {
  private audioContext: AudioContext | null = null
  private primaryOscillator: OscillatorNode | null = null
  private secondaryOscillator: OscillatorNode | null = null
  private gainNode: GainNode | null = null
  private analyser: AnalyserNode | null = null
  private pannerNode: PannerNode | null = null
  private convolver: ConvolverNode | null = null
  private isPlaying: boolean = false
  private config: AdvancedAudioConfig
  
  // Neural entrainment variables
  private entrainmentTimer: NodeJS.Timeout | null = null
  private adaptiveTimer: NodeJS.Timeout | null = null
  private currentPhase: number = 0
  private targetEntrainment: number = 0
  
  // Biometric integration
  private heartRateData: number[] = []
  private breathingRate: number = 12 // breaths per minute
  private currentTime: number = 0

  constructor(config: AdvancedAudioConfig) {
    this.config = config
    this.initializeAudioContext()
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // Create advanced audio nodes
      this.setupAdvancedAudioChain()
    } catch (error) {
      console.warn('Advanced audio features not supported, falling back to basic audio')
      this.setupBasicAudioChain()
    }
  }

  private setupAdvancedAudioChain() {
    if (!this.audioContext) return

    // Primary oscillator for main frequency
    this.primaryOscillator = this.audioContext.createOscillator()
    this.primaryOscillator.type = this.config.waveform
    this.primaryOscillator.frequency.value = this.config.frequency

    // Secondary oscillator for binaural beats
    if (this.config.binauralBeat?.enabled) {
      this.secondaryOscillator = this.audioContext.createOscillator()
      this.secondaryOscillator.type = this.config.waveform
      this.secondaryOscillator.frequency.value = 
        this.config.frequency + this.config.binauralBeat.beatFrequency
    }

    // Spatial audio with 3D positioning
    if (this.config.spatialAudio?.enabled) {
      this.pannerNode = this.audioContext.createPanner()
      this.pannerNode.panningModel = 'HRTF'
      this.pannerNode.distanceModel = 'inverse'
      this.pannerNode.setPosition(
        this.config.spatialAudio.position.x,
        this.config.spatialAudio.position.y,
        this.config.spatialAudio.position.z
      )
    }

    // Convolution reverb for immersive experience
    this.convolver = this.audioContext.createConvolver()
    this.createImpulseResponse()

    // Advanced analyser for real-time feedback
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 2048
    this.analyser.smoothingTimeConstant = 0.8

    // Master gain control
    this.gainNode = this.audioContext.createGain()
    this.gainNode.gain.value = this.config.volume

    // Connect the audio chain
    this.connectAdvancedAudioChain()
  }

  private setupBasicAudioChain() {
    if (!this.audioContext) return

    this.primaryOscillator = this.audioContext.createOscillator()
    this.primaryOscillator.type = this.config.waveform
    this.primaryOscillator.frequency.value = this.config.frequency

    this.gainNode = this.audioContext.createGain()
    this.gainNode.gain.value = this.config.volume

    this.primaryOscillator.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)
  }

  private connectAdvancedAudioChain() {
    if (!this.audioContext || !this.primaryOscillator || !this.gainNode) return

    let currentNode: AudioNode = this.primaryOscillator

    // Connect spatial audio
    if (this.pannerNode) {
      currentNode.connect(this.pannerNode)
      currentNode = this.pannerNode
    }

    // Connect convolution reverb
    if (this.convolver) {
      const dryGain = this.audioContext.createGain()
      const wetGain = this.audioContext.createGain()
      
      dryGain.gain.value = 0.7 // 70% dry
      wetGain.gain.value = 0.3 // 30% wet
      
      currentNode.connect(dryGain)
      currentNode.connect(this.convolver)
      this.convolver.connect(wetGain)
      
      const merger = this.audioContext.createChannelMerger(2)
      dryGain.connect(merger, 0, 0)
      wetGain.connect(merger, 0, 1)
      
      currentNode = merger
    }

    // Connect analyser
    if (this.analyser) {
      currentNode.connect(this.analyser)
    }

    // Connect to master gain and output
    currentNode.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)

    // Connect secondary oscillator for binaural beats
    if (this.secondaryOscillator) {
      this.secondaryOscillator.connect(this.gainNode)
    }
  }

  private createImpulseResponse() {
    if (!this.audioContext || !this.convolver) return

    const length = this.audioContext.sampleRate * 2 // 2 seconds
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
      }
    }

    this.convolver.buffer = impulse
  }

  async play(): Promise<void> {
    if (this.isPlaying || !this.audioContext) return

    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // Start oscillators
      if (this.primaryOscillator) {
        this.primaryOscillator.start()
      }
      
      if (this.secondaryOscillator) {
        this.secondaryOscillator.start()
      }

      this.isPlaying = true

      // Start neural entrainment
      if (this.config.neuralPhaseLocking?.enabled) {
        this.startNeuralEntrainment()
      }

      // Start adaptive modulation
      if (this.config.adaptiveModulation?.enabled) {
        this.startAdaptiveModulation()
      }

      // Start spatial audio movement
      if (this.config.spatialAudio?.enabled && this.config.spatialAudio.movement !== 'static') {
        this.startSpatialMovement()
      }

    } catch (error) {
      console.error('Error starting advanced audio:', error)
      throw error
    }
  }

  private startNeuralEntrainment() {
    const brainwaveTargets = {
      delta: { min: 0.5, max: 4 },
      theta: { min: 4, max: 8 },
      alpha: { min: 8, max: 13 },
      beta: { min: 13, max: 30 },
      gamma: { min: 30, max: 100 }
    }

    const target = this.config.neuralPhaseLocking?.targetBrainwave || 'alpha'
    this.targetEntrainment = (brainwaveTargets[target].min + brainwaveTargets[target].max) / 2

    this.entrainmentTimer = setInterval(() => {
      this.updateNeuralPhaseLocking()
    }, 100) // Update every 100ms for smooth entrainment
  }

  private updateNeuralPhaseLocking() {
    if (!this.primaryOscillator || !this.config.neuralPhaseLocking?.enabled) return

    // Gradually adjust frequency towards target entrainment
    const currentFreq = this.primaryOscillator.frequency.value
    const targetFreq = this.config.frequency + (Math.sin(this.currentPhase) * this.targetEntrainment)
    
    // Smooth frequency modulation
    this.primaryOscillator.frequency.exponentialRampToValueAtTime(
      targetFreq,
      this.audioContext!.currentTime + 0.1
    )

    this.currentPhase += 0.05
    if (this.currentPhase > Math.PI * 2) {
      this.currentPhase = 0
    }
  }

  private startAdaptiveModulation() {
    this.adaptiveTimer = setInterval(() => {
      this.updateAdaptiveModulation()
    }, 1000) // Update every second
  }

  private updateAdaptiveModulation() {
    if (!this.config.adaptiveModulation?.enabled || !this.gainNode) return

    let modulationFactor = 1

    // Heart rate synchronization
    if (this.config.adaptiveModulation.heartRateSync && this.heartRateData.length > 0) {
      const avgHeartRate = this.heartRateData.reduce((a, b) => a + b, 0) / this.heartRateData.length
      const heartRateModulation = Math.sin((this.currentTime * avgHeartRate) / 60) * 0.1 + 1
      modulationFactor *= heartRateModulation
    }

    // Breathing synchronization
    if (this.config.adaptiveModulation.breathingSync) {
      const breathingModulation = Math.sin((this.currentTime * this.breathingRate) / 60) * 0.15 + 1
      modulationFactor *= breathingModulation
    }

    // Circadian rhythm synchronization
    if (this.config.adaptiveModulation.circadianSync) {
      const hour = new Date().getHours()
      const circadianModulation = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 0.2 + 1
      modulationFactor *= circadianModulation
    }

    // Apply modulation smoothly
    this.gainNode.gain.exponentialRampToValueAtTime(
      this.config.volume * modulationFactor,
      this.audioContext!.currentTime + 1
    )

    this.currentTime += 1
  }

  private startSpatialMovement() {
    if (!this.pannerNode || !this.config.spatialAudio?.enabled) return

    const movement = this.config.spatialAudio.movement
    const position = this.config.spatialAudio.position
    let angle = 0

    const moveTimer = setInterval(() => {
      if (!this.pannerNode || !this.isPlaying) {
        clearInterval(moveTimer)
        return
      }

      let x = position.x
      let y = position.y
      let z = position.z

      switch (movement) {
        case 'circular':
          x = Math.cos(angle) * 2
          z = Math.sin(angle) * 2
          break
        case 'pendulum':
          x = Math.sin(angle) * 3
          break
        case 'spiral':
          const radius = 1 + angle * 0.1
          x = Math.cos(angle) * radius
          z = Math.sin(angle) * radius
          y = angle * 0.1
          break
      }

      this.pannerNode.setPosition(x, y, z)
      angle += 0.05

      if (angle > Math.PI * 4) angle = 0
    }, 50) // Smooth 20fps movement
  }

  // Public API for biometric integration
  updateHeartRate(bpm: number) {
    this.heartRateData.push(bpm)
    if (this.heartRateData.length > 10) {
      this.heartRateData.shift() // Keep only last 10 readings
    }
  }

  updateBreathingRate(breathsPerMinute: number) {
    this.breathingRate = breathsPerMinute
  }

  // Real-time audio analysis
  getAudioAnalysis(): { frequencies: Uint8Array; waveform: Uint8Array } | null {
    if (!this.analyser) return null

    const frequencies = new Uint8Array(this.analyser.frequencyBinCount)
    const waveform = new Uint8Array(this.analyser.fftSize)

    this.analyser.getByteFrequencyData(frequencies)
    this.analyser.getByteTimeDomainData(waveform)

    return { frequencies, waveform }
  }

  updateVolume(volume: number) {
    this.config.volume = volume
    if (this.gainNode) {
      this.gainNode.gain.exponentialRampToValueAtTime(
        volume,
        this.audioContext!.currentTime + 0.1
      )
    }
  }

  updateFrequency(frequency: number) {
    this.config.frequency = frequency
    if (this.primaryOscillator) {
      this.primaryOscillator.frequency.exponentialRampToValueAtTime(
        frequency,
        this.audioContext!.currentTime + 0.1
      )
    }
  }

  stop() {
    if (!this.isPlaying) return

    // Clear all timers
    if (this.entrainmentTimer) {
      clearInterval(this.entrainmentTimer)
      this.entrainmentTimer = null
    }

    if (this.adaptiveTimer) {
      clearInterval(this.adaptiveTimer)
      this.adaptiveTimer = null
    }

    // Stop oscillators
    if (this.primaryOscillator) {
      this.primaryOscillator.stop()
      this.primaryOscillator = null
    }

    if (this.secondaryOscillator) {
      this.secondaryOscillator.stop()
      this.secondaryOscillator = null
    }

    this.isPlaying = false

    // Reinitialize for next use
    setTimeout(() => {
      this.setupAdvancedAudioChain()
    }, 100)
  }

  destroy() {
    this.stop()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }

  // Status getters
  get playing() {
    return this.isPlaying
  }

  get currentConfig() {
    return { ...this.config }
  }
}

export default AdvancedFrequencyAudioEngine