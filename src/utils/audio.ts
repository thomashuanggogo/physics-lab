// Web Audio API Synthesizer - 100% Client-side and offline
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, gainMultiplier: number = 1.0, ramp: boolean = true) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const targetGain = 0.08 * this.volume * gainMultiplier;
      gain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
      if (ramp) {
        gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);
      } else {
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playClick() {
    this.playTone(720, 'sine', 0.08, 0.4);
  }

  public playSelect() {
    this.playTone(880, 'triangle', 0.1, 0.5);
  }

  public playRemove() {
    this.playTone(340, 'sine', 0.1, 0.4);
  }

  public playHint() {
    this.playTone(600, 'sine', 0.15, 0.5);
    setTimeout(() => this.playTone(750, 'sine', 0.2, 0.5), 120);
  }

  public playCorrect() {
    // Bright melodic chord progression: C5 -> E5 -> G5 -> C6
    const notes = [
      { freq: 523.25, time: 0, dur: 0.25 },
      { freq: 659.25, time: 90, dur: 0.3 },
      { freq: 783.99, time: 180, dur: 0.35 },
      { freq: 1046.50, time: 270, dur: 0.5 },
    ];
    notes.forEach((n) => {
      setTimeout(() => {
        this.playTone(n.freq, 'sine', n.dur, 0.8);
      }, n.time);
    });
  }

  public playWrong() {
    // Low double buzz
    this.playTone(180, 'sawtooth', 0.22, 0.6);
    setTimeout(() => {
      this.playTone(140, 'sawtooth', 0.26, 0.7);
    }, 120);
  }

  public playComplete() {
    // Victorious fanfare arpeggio
    const fanfare = [
      { f: 523.25, d: 0.15, delay: 0 },
      { f: 659.25, d: 0.15, delay: 120 },
      { f: 783.99, d: 0.15, delay: 240 },
      { f: 1046.50, d: 0.4, delay: 360 },
      { f: 880.00, d: 0.2, delay: 560 },
      { f: 1046.50, d: 0.6, delay: 720 },
    ];
    fanfare.forEach((n) => {
      setTimeout(() => {
        this.playTone(n.f, 'sine', n.d, 0.9);
      }, n.delay);
    });
  }
}

export const soundManager = new SoundManager();
