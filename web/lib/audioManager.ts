'use client'

// Global audio manager — ensures only one audio plays at a time
// and provides controls accessible from any page

type AudioState = {
  isPlaying: boolean
  frequencyName: string
  hzValue: number
}

type Listener = (state: AudioState) => void

class GlobalAudioManager {
  private ctx: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private harmonic: OscillatorNode | null = null
  private gain: GainNode | null = null
  private harmonicGain: GainNode | null = null
  private _state: AudioState = { isPlaying: false, frequencyName: '', hzValue: 0 }
  private listeners: Set<Listener> = new Set()

  get state() { return this._state }

  subscribe(fn: Listener) {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }

  private notify() {
    this.listeners.forEach(fn => fn(this._state))
  }

  async play(name: string, hz: number) {
    // Stop any existing audio first
    this.stop()

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.ctx = ctx

      if (ctx.state === 'suspended') await ctx.resume()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(hz, ctx.currentTime)
      osc.connect(gain)
      osc.start()
      this.oscillator = osc

      // Harmonic for low frequencies — ensure minimum 150 Hz audible harmonic
      if (hz < 100) {
        const harm = ctx.createOscillator()
        const hGain = ctx.createGain()
        harm.type = 'sine'
        // Calculate harmonic that's at least 150 Hz (clearly audible on any speaker)
        let hFreq = hz * 4
        while (hFreq < 150) hFreq *= 2
        harm.frequency.setValueAtTime(hFreq, ctx.currentTime)
        hGain.gain.setValueAtTime(0, ctx.currentTime)
        hGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 5)
        harm.connect(hGain)
        hGain.connect(ctx.destination)
        harm.start()
        this.harmonic = harm
        this.harmonicGain = hGain
      }

      const volume = hz < 50 ? 0.25 : hz < 200 ? 0.15 : 0.10
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 5)
      gain.connect(ctx.destination)
      this.gain = gain

      this._state = { isPlaying: true, frequencyName: name, hzValue: hz }
      this.notify()
      console.log(`🎵 Audio: Playing ${name} at ${hz}Hz`)
    } catch (err) {
      console.error('Audio play failed:', err)
    }
  }

  stop() {
    if (this.gain && this.ctx) {
      try {
        this.gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5)
        if (this.harmonicGain) {
          this.harmonicGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5)
        }
      } catch {}

      setTimeout(() => {
        try {
          this.oscillator?.stop()
          this.oscillator?.disconnect()
          this.harmonic?.stop()
          this.harmonic?.disconnect()
          this.gain?.disconnect()
          this.harmonicGain?.disconnect()
          this.ctx?.close()
        } catch {}
        this.oscillator = null
        this.harmonic = null
        this.gain = null
        this.harmonicGain = null
        this.ctx = null
      }, 600)
    }

    this._state = { isPlaying: false, frequencyName: '', hzValue: 0 }
    this.notify()
    console.log('🔇 Audio: Stopped')
  }
}

// Singleton
export const audioManager = typeof window !== 'undefined' ? new GlobalAudioManager() : null
