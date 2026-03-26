/**
 * Real Audio Engine for Frequency Therapy
 * Generates actual audio frequencies using Web Audio API
 */

export class FrequencyAudioEngine {
  private audioContext: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private gainNode: GainNode | null = null
  private isPlaying: boolean = false
  private currentFrequency: number = 0

  constructor() {
    // Only initialize if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.initializeAudioContext()
    }
  }

  private async initializeAudioContext() {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') return

      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Handle audio context state
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  async play(frequency: number, volume: number = 0.1): Promise<boolean> {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return false
    
    if (!this.audioContext) {
      await this.initializeAudioContext()
      if (!this.audioContext) return false
    }

    try {
      // Stop any existing audio
      this.stop()

      // Create oscillator for the frequency
      this.oscillator = this.audioContext.createOscillator()
      this.gainNode = this.audioContext.createGain()

      // Configure oscillator
      this.oscillator.type = 'sine' // Pure sine wave for therapeutic frequencies
      this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

      // Configure volume with smooth fade-in
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      this.gainNode.gain.exponentialRampToValueAtTime(volume, this.audioContext.currentTime + 0.1)

      // Connect audio nodes
      this.oscillator.connect(this.gainNode)
      this.gainNode.connect(this.audioContext.destination)

      // Start playing
      this.oscillator.start()
      this.isPlaying = true
      this.currentFrequency = frequency

      // Handle oscillator end
      this.oscillator.onended = () => {
        this.isPlaying = false
        this.currentFrequency = 0
      }

      return true
    } catch (error) {
      console.error('Failed to play frequency:', error)
      return false
    }
  }

  stop(): void {
    if (this.oscillator && this.isPlaying) {
      try {
        // Smooth fade-out
        if (this.gainNode && this.audioContext) {
          this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1)
        }
        
        // Stop oscillator after fade-out
        setTimeout(() => {
          if (this.oscillator) {
            this.oscillator.stop()
            this.oscillator.disconnect()
            this.oscillator = null
          }
          if (this.gainNode) {
            this.gainNode.disconnect()
            this.gainNode = null
          }
        }, 100)

        this.isPlaying = false
        this.currentFrequency = 0
      } catch (error) {
        console.error('Failed to stop frequency:', error)
      }
    }
  }

  setVolume(volume: number): void {
    if (this.gainNode && this.audioContext) {
      // Clamp volume between 0 and 1
      const clampedVolume = Math.max(0, Math.min(1, volume))
      this.gainNode.gain.exponentialRampToValueAtTime(
        Math.max(0.001, clampedVolume), 
        this.audioContext.currentTime + 0.1
      )
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying
  }

  getCurrentFrequency(): number {
    return this.currentFrequency
  }

  // Binaural beats generation (difference between left and right ear frequencies)
  async playBinauralBeats(baseFrequency: number, beatFrequency: number, volume: number = 0.1): Promise<boolean> {
    if (typeof window === 'undefined') return false
    
    if (!this.audioContext) {
      await this.initializeAudioContext()
      if (!this.audioContext) return false
    }

    try {
      this.stop()

      // Create stereo setup for binaural beats
      const leftOsc = this.audioContext.createOscillator()
      const rightOsc = this.audioContext.createOscillator()
      const merger = this.audioContext.createChannelMerger(2)
      const gainNode = this.audioContext.createGain()

      // Configure frequencies (left ear gets base, right ear gets base + beat)
      leftOsc.frequency.setValueAtTime(baseFrequency, this.audioContext.currentTime)
      rightOsc.frequency.setValueAtTime(baseFrequency + beatFrequency, this.audioContext.currentTime)

      // Set oscillator types
      leftOsc.type = 'sine'
      rightOsc.type = 'sine'

      // Configure volume
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(volume, this.audioContext.currentTime + 0.1)

      // Connect for stereo output
      leftOsc.connect(merger, 0, 0)   // Left channel
      rightOsc.connect(merger, 0, 1)  // Right channel
      merger.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      // Start both oscillators
      leftOsc.start()
      rightOsc.start()

      this.isPlaying = true
      this.currentFrequency = baseFrequency

      // Store references for cleanup
      this.oscillator = leftOsc // Store one for stop functionality
      this.gainNode = gainNode

      leftOsc.onended = () => {
        this.isPlaying = false
        this.currentFrequency = 0
      }

      return true
    } catch (error) {
      console.error('Failed to play binaural beats:', error)
      return false
    }
  }

  // Create nature sounds mixer (ocean waves, rain, etc.)
  async playWithAmbientSound(frequency: number, ambientType: 'ocean' | 'rain' | 'forest' | 'none' = 'none', volume: number = 0.1): Promise<boolean> {
    // For now, just play the pure frequency
    // In production, you would load and mix ambient audio files
    return this.play(frequency, volume)
  }

  // Frequency sweeping (gradually change frequency over time)
  sweep(startFreq: number, endFreq: number, durationSeconds: number, volume: number = 0.1): void {
    if (!this.audioContext || !this.oscillator) return

    const currentTime = this.audioContext.currentTime
    this.oscillator.frequency.setValueAtTime(startFreq, currentTime)
    this.oscillator.frequency.exponentialRampToValueAtTime(endFreq, currentTime + durationSeconds)
  }

  // Clean up resources
  destroy(): void {
    this.stop()
    if (this.audioContext && typeof window !== 'undefined') {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// Singleton instance for global use (only created in browser)
export const audioEngine = typeof window !== 'undefined' ? new FrequencyAudioEngine() : null

// Utility function to request audio permissions
export async function requestAudioPermissions(): Promise<boolean> {
  try {
    // Some browsers require user interaction before audio context can be created
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      // Request microphone permission as a proxy for audio permissions
      await navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        // Immediately stop the stream as we don't need it
        stream.getTracks().forEach(track => track.stop())
      })
    }
    return true
  } catch (error) {
    console.warn('Audio permissions not granted:', error)
    return false
  }
}

// Helper function to convert frequency to musical note (for display purposes)
export function frequencyToNote(frequency: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const a4 = 440
  const c0 = a4 * Math.pow(2, -4.75)
  
  if (frequency > c0) {
    const h = Math.round(12 * Math.log2(frequency / c0))
    const octave = Math.floor(h / 12)
    const n = h % 12
    return noteNames[n] + octave
  }
  
  return '?'
}

export default FrequencyAudioEngine