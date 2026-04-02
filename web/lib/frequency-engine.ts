export class QuantumFrequencyEngine {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying: boolean = false;
  private currentFrequency: number = 440;
  private wakeLock: any = null;

  constructor() {
    // Initialize on user interaction to comply with browser autoplay policies
    if (typeof window !== 'undefined') {
      this.initializeAudioContext();
    }
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      
      // Create analyser for visualization
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async startFrequency(frequency: number, waveType: OscillatorType = 'sine') {
    if (!this.audioContext) {
      await this.initializeAudioContext();
    }

    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.stopFrequency();

    this.currentFrequency = frequency;
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = waveType;
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    if (this.gainNode) {
      this.oscillator.connect(this.gainNode);
      this.oscillator.start();
      this.isPlaying = true;
    }

    // Request wake lock to prevent screen from turning off
    await this.requestWakeLock();

    return this.oscillator;
  }

  stopFrequency() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
      this.isPlaying = false;
    }

    this.releaseWakeLock();
  }

  setVolume(volume: number) {
    if (this.gainNode && this.audioContext) {
      // Clamp volume between 0 and 1
      const clampedVolume = Math.max(0, Math.min(1, volume));
      this.gainNode.gain.setValueAtTime(clampedVolume, this.audioContext.currentTime);
    }
  }

  fadeIn(duration: number = 2) {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + duration);
    }
  }

  fadeOut(duration: number = 2) {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
      setTimeout(() => this.stopFrequency(), duration * 1000);
    }
  }

  // Get frequency data for visualization
  getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  // Screen wake lock for background playback
  private async requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.log('Wake lock request failed:', err);
      }
    }
  }

  private releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release();
      this.wakeLock = null;
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getCurrentFrequency() {
    return this.currentFrequency;
  }

  // Advanced frequency generation for specific therapeutic protocols
  generateCoherentWaveform(baseFreq: number, harmonics: number[] = []) {
    if (!this.audioContext) return;

    // Create multiple oscillators for harmonic superposition
    const oscillators = [this.createOscillator(baseFreq)];
    
    harmonics.forEach(harmonic => {
      const harmonicOsc = this.createOscillator(baseFreq * harmonic);
      if (harmonicOsc && this.gainNode) {
        const harmonicGain = this.audioContext!.createGain();
        harmonicGain.gain.setValueAtTime(0.05, this.audioContext!.currentTime);
        harmonicOsc.connect(harmonicGain);
        harmonicGain.connect(this.gainNode);
        harmonicOsc.start();
        oscillators.push(harmonicOsc);
      }
    });

    return oscillators;
  }

  private createOscillator(frequency: number): OscillatorNode | null {
    if (!this.audioContext) return null;
    
    const osc = this.audioContext.createOscillator();
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    return osc;
  }
}

// Singleton instance
export const frequencyEngine = new QuantumFrequencyEngine();