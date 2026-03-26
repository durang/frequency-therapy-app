// Simplified audio engine for demo purposes
// In production, this would use Tone.js or Web Audio API directly

export interface AudioEngineConfig {
  frequency: number
  volume: number
  waveform: 'sine' | 'square' | 'triangle' | 'sawtooth'
  binauralBeat?: {
    enabled: boolean
    beatFrequency: number
  }
  spatialAudio?: {
    enabled: boolean
    panPosition: number
  }
  ambientSound?: {
    enabled: boolean
    type: 'rain' | 'ocean' | 'forest' | 'white_noise'
    volume: number
  }
}

export class FrequencyAudioEngine {
  private audioContext: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private gainNode: GainNode | null = null
  private isPlaying = false

  constructor() {
    // Initialize will be called when user interacts
  }

  async initialize(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  async startFrequency(config: AudioEngineConfig): Promise<void> {
    await this.initialize()
    
    if (!this.audioContext) return
    
    // Stop any existing audio
    this.stopFrequency()

    // Create oscillator
    this.oscillator = this.audioContext.createOscillator()
    this.gainNode = this.audioContext.createGain()

    // Configure oscillator
    this.oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime)
    this.oscillator.type = config.waveform

    // Configure volume
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    this.gainNode.gain.linearRampToValueAtTime(config.volume * 0.1, this.audioContext.currentTime + 2) // Fade in

    // Connect nodes
    this.oscillator.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)

    // Start oscillator
    this.oscillator.start()
    this.isPlaying = true

    console.log(`🎵 Started ${config.frequency}Hz frequency at ${Math.round(config.volume * 100)}% volume`)
  }

  stopFrequency(): void {
    if (this.oscillator && this.audioContext && this.isPlaying) {
      // Fade out
      this.gainNode?.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1)
      
      setTimeout(() => {
        this.oscillator?.stop()
        this.oscillator?.disconnect()
        this.gainNode?.disconnect()
        this.oscillator = null
        this.gainNode = null
        this.isPlaying = false
      }, 1000)
      
      console.log('🔇 Stopped frequency')
    }
  }

  setVolume(volume: number): void {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.linearRampToValueAtTime(volume * 0.1, this.audioContext.currentTime + 0.1)
    }
  }

  setPanning(pan: number): void {
    // For demo purposes, this is a placeholder
    console.log(`🎚️ Set panning to ${pan}`)
  }

  getIsPlaying(): boolean {
    return this.isPlaying
  }

  dispose(): void {
    this.stopFrequency()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// Service Worker registration for background audio (placeholder)
export const registerAudioServiceWorker = async (): Promise<void> => {
  console.log('🔧 Audio Service Worker registration (placeholder)')
}

export const enableBackgroundAudio = (config: AudioEngineConfig): void => {
  console.log('🎵 Enable background audio (placeholder)')
}

export const disableBackgroundAudio = (): void => {
  console.log('🔇 Disable background audio (placeholder)')
}

// Preset configurations for different therapy types
export const audioPresets = {
  dna_repair: {
    frequency: 528,
    volume: 0.7,
    waveform: 'sine' as const,
    binauralBeat: {
      enabled: true,
      beatFrequency: 8
    },
    spatialAudio: {
      enabled: true,
      panPosition: 0
    }
  },
  deep_sleep: {
    frequency: 7.83,
    volume: 0.5,
    waveform: 'sine' as const,
    binauralBeat: {
      enabled: true,
      beatFrequency: 2
    },
    ambientSound: {
      enabled: true,
      type: 'rain' as const,
      volume: 0.3
    }
  },
  focus: {
    frequency: 40,
    volume: 0.6,
    waveform: 'sine' as const,
    binauralBeat: {
      enabled: true,
      beatFrequency: 10
    }
  },
  meditation: {
    frequency: 6.3,
    volume: 0.6,
    waveform: 'sine' as const,
    ambientSound: {
      enabled: true,
      type: 'forest' as const,
      volume: 0.2
    }
  }
}