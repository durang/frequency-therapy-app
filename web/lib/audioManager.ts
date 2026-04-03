'use client'

// Global audio manager — ensures only one audio plays at a time
// and provides controls accessible from any page

type AudioState = {
  isPlaying: boolean
  frequencyName: string
  hzValue: number
  volume: number
}

type Listener = (state: AudioState) => void

class GlobalAudioManager {
  private ctx: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private harmonic: OscillatorNode | null = null
  private gain: GainNode | null = null
  private harmonicGain: GainNode | null = null
  private _state: AudioState = { isPlaying: false, frequencyName: '', hzValue: 0, volume: 1 }
  private listeners: Set<Listener> = new Set()
  private boundVisibilityHandler: (() => void) | null = null
  private baseVolume: number = 0.14 // stored per-frequency base volume

  get state() { return this._state }

  subscribe(fn: Listener) {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }

  private notify() {
    this.listeners.forEach(fn => fn(this._state))
  }

  /** Resume AudioContext when tab becomes visible again — browsers suspend it in background */
  private setupVisibilityHandler() {
    if (this.boundVisibilityHandler) return
    this.boundVisibilityHandler = () => {
      if (document.visibilityState === 'visible' && this.ctx && this._state.isPlaying) {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().then(() => {
            console.log('🎵 Audio: Resumed after tab switch')
          }).catch(() => {
            // Context is dead — restart playback
            console.log('🎵 Audio: Context dead after tab switch, restarting')
            const { frequencyName, hzValue } = this._state
            this.play(frequencyName, hzValue)
          })
        } else if (this.ctx.state === 'closed') {
          // Context was closed — restart
          console.log('🎵 Audio: Context closed after tab switch, restarting')
          const { frequencyName, hzValue } = this._state
          this.play(frequencyName, hzValue)
        }
      }
    }
    document.addEventListener('visibilitychange', this.boundVisibilityHandler)
  }

  private removeVisibilityHandler() {
    if (this.boundVisibilityHandler) {
      document.removeEventListener('visibilitychange', this.boundVisibilityHandler)
      this.boundVisibilityHandler = null
    }
  }

  async play(name: string, hz: number) {
    return this.playWithContext(name, hz)
  }

  async playWithContext(name: string, hz: number, prewarmedCtx?: AudioContext) {
    // Stop any existing audio first
    this.stop()

    try {
      const ctx = prewarmedCtx || new (window.AudioContext || (window as any).webkitAudioContext)()
      this.ctx = ctx

      // iOS Safari: resume() MUST happen synchronously in the user gesture call stack.
      // Do NOT await anything before this call.
      const resumePromise = ctx.resume()

      // Set up statechange listener for iOS — sometimes resume() resolves
      // but the state doesn't change until the first audio node starts
      ctx.onstatechange = () => {
        if (ctx.state === 'running') {
          console.log('🎵 Audio: Context now running')
        }
      }

      // Wait for resume to complete (or timeout after 500ms)
      await Promise.race([
        resumePromise,
        new Promise(r => setTimeout(r, 500))
      ])

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
        hGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 5)
        harm.connect(hGain)
        hGain.connect(ctx.destination)
        harm.start()
        this.harmonic = harm
        this.harmonicGain = hGain
      }

      const volume = hz < 50 ? 0.40 : hz < 200 ? 0.22 : 0.14
      this.baseVolume = volume
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(volume * this._state.volume, ctx.currentTime + 5)
      gain.connect(ctx.destination)
      this.gain = gain

      this._state = { isPlaying: true, frequencyName: name, hzValue: hz, volume: this._state.volume }
      this.notify()
      this.setupVisibilityHandler()
      console.log(`🎵 Audio: Playing ${name} at ${hz}Hz`)
    } catch (err) {
      console.error('Audio play failed:', err)
    }
  }

  stop() {
    // Capture current references before clearing
    const ctx = this.ctx
    const osc = this.oscillator
    const harm = this.harmonic
    const gain = this.gain
    const hGain = this.harmonicGain

    // Clear references immediately to prevent race conditions
    this.oscillator = null
    this.harmonic = null
    this.gain = null
    this.harmonicGain = null
    this.ctx = null

    if (gain && ctx) {
      try {
        // Anchor current gain value before ramping — required for linearRamp to interpolate
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
        if (hGain) {
          hGain.gain.setValueAtTime(hGain.gain.value, ctx.currentTime)
          hGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
        }
      } catch {}

      setTimeout(() => {
        try {
          osc?.stop()
          osc?.disconnect()
          harm?.stop()
          harm?.disconnect()
          gain?.disconnect()
          hGain?.disconnect()
          ctx?.close()
        } catch {}
      }, 600)
    }

    this._state = { isPlaying: false, frequencyName: '', hzValue: 0, volume: this._state.volume }
    this.notify()
    this.removeVisibilityHandler()
    console.log('🔇 Audio: Stopped')
  }

  /** Set volume 0–1. Applies immediately with a short ramp to avoid clicks. */
  setVolume(vol: number) {
    const v = Math.max(0, Math.min(1, vol))
    this._state = { ...this._state, volume: v }
    this.notify()

    const ctx = this.ctx
    const gain = this.gain
    const hGain = this.harmonicGain
    if (!ctx || !gain) return

    const target = this.baseVolume * v
    try {
      gain.gain.cancelScheduledValues(ctx.currentTime)
      gain.gain.linearRampToValueAtTime(Math.max(target, 0.001), ctx.currentTime + 0.1)
      if (hGain) {
        hGain.gain.cancelScheduledValues(ctx.currentTime)
        hGain.gain.linearRampToValueAtTime(Math.max(0.15 * v, 0.001), ctx.currentTime + 0.1)
      }
    } catch {}
  }

  /** Gracefully fade audio to silence over `durationSeconds` (default 2s), then fully stop. */
  fadeOutAndStop(durationSeconds = 2): Promise<void> {
    return new Promise(resolve => {
      const ctx = this.ctx
      const gain = this.gain
      const hGain = this.harmonicGain

      if (!gain || !ctx) {
        this.stop()
        resolve()
        return
      }

      try {
        // Anchor current gain value — required for linearRamp to actually interpolate
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds)
        if (hGain) {
          hGain.gain.setValueAtTime(hGain.gain.value, ctx.currentTime)
          hGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds)
        }
      } catch {
        this.stop()
        resolve()
        return
      }

      console.log(`🔉 Audio: Fading out over ${durationSeconds}s`)

      setTimeout(() => {
        this.stop()
        resolve()
      }, durationSeconds * 1000 + 100)
    })
  }
}

// Singleton
export const audioManager = typeof window !== 'undefined' ? new GlobalAudioManager() : null
