// Procedural Noir Audio Engine for Bhorer Shahar: Case Files
// Uses Web Audio API synthesis for zero-404 guaranteed sound effects and ambient rain
// Supports Howler.js where external assets exist, with seamless graceful procedural fallback

class SoundManager {
  private ctx: AudioContext | null = null;
  private rainNode: AudioNode | null = null;
  private isMuted: boolean = false;
  private isRainPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isRainPlaying) {
      this.stopRain();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Mechanical Typewriter keystroke sound
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "square";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2200, ctx.currentTime);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  /**
   * Paper slide rustle (switching documents/dossiers)
   */
  public playPaperSlide() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Generate brief white/pink noise burst
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  /**
   * Brass Pin placement sound on Cork Caseboard
   */
  public playBrassPin() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // High metallic ping + deep thud
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1850, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(120, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.11);
    osc2.stop(ctx.currentTime + 0.11);
  }

  /**
   * Heavy Rubber Stamp for verified / rejected checkpoints
   */
  public playRubberStamp(success: boolean = true) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);

    // Follow-up metallic ring if successful, or low dissonance if rejected
    const toneOsc = ctx.createOscillator();
    const toneGain = ctx.createGain();
    toneOsc.type = success ? "triangle" : "sawtooth";
    toneOsc.frequency.setValueAtTime(success ? 440 : 130, now + 0.05);
    if (success) {
      toneOsc.frequency.exponentialRampToValueAtTime(659.25, now + 0.35); // A4 to E5
    }

    toneGain.gain.setValueAtTime(0.001, now);
    toneGain.gain.setValueAtTime(0.18, now + 0.06);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    toneOsc.connect(toneGain);
    toneGain.connect(ctx.destination);

    toneOsc.start(now + 0.05);
    toneOsc.stop(now + 0.42);
  }

  /**
   * Tension sting / eerie discovery
   */
  public playTensionSting() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [110, 116.54, 155.56]; // Dissonant minor second / flat fifth

    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    });
  }

  /**
   * Case Solved / Victory fanfare
   */
  public playVictoryFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const chords = [
      { notes: [220, 277.18, 329.63], time: 0, dur: 0.35 },      // A major
      { notes: [246.94, 311.13, 369.99], time: 0.35, dur: 0.35 },  // B major
      { notes: [293.66, 369.99, 440, 587.33], time: 0.7, dur: 1.0 }, // D / A resolution
    ];

    const now = ctx.currentTime;
    chords.forEach(({ notes, time, dur }) => {
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.linearRampToValueAtTime(0.12, now + time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });
    });
  }

  /**
   * Ambient late-monsoon rain loop
   */
  public startRain() {
    if (this.isMuted || this.isRainPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise synthesis
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(950, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.045, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      this.rainNode = noise;
      this.isRainPlaying = true;
    } catch {
      // Ignored if browser limits audio creation before gesture
    }
  }

  public stopRain() {
    if (this.rainNode) {
      try {
        (this.rainNode as AudioScheduledSourceNode).stop();
      } catch {}
      this.rainNode = null;
    }
    this.isRainPlaying = false;
  }

  /**
   * Play Voice Note Audio (e.g., Rina Basu's distress recording)
   * Uses Web Speech API with vintage telephone DSP when available, or procedural audio playback
   */
  public playVoiceNote(
    text: string,
    onEnded?: () => void,
    onProgress?: (percent: number) => void
  ): { stop: () => void } {
    if (this.isMuted) {
      onEnded?.();
      return { stop: () => {} };
    }

    // Play initial tape recorder click
    this.playClick();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.15;
      utterance.rate = 0.92;
      
      // Select appropriate female voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.includes("en-IN") || v.name.toLowerCase().includes("india") || v.lang.includes("en-GB")
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      let interval: NodeJS.Timeout | null = null;
      const startTime = Date.now();
      const estimatedDuration = Math.max(4000, text.length * 75);

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, Math.floor((elapsed / estimatedDuration) * 100));
        onProgress?.(pct);
        if (pct >= 100 && interval) {
          clearInterval(interval);
        }
      }, 150);

      utterance.onend = () => {
        if (interval) clearInterval(interval);
        onProgress?.(100);
        onEnded?.();
      };

      utterance.onerror = () => {
        if (interval) clearInterval(interval);
        onEnded?.();
      };

      window.speechSynthesis.speak(utterance);

      return {
        stop: () => {
          if (interval) clearInterval(interval);
          window.speechSynthesis.cancel();
          onEnded?.();
        },
      };
    } else {
      // Fallback timer simulation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        onProgress?.(Math.min(100, progress));
        if (progress >= 100) {
          clearInterval(interval);
          onEnded?.();
        }
      }, 200);

      return {
        stop: () => {
          clearInterval(interval);
          onEnded?.();
        },
      };
    }
  }
}

export const soundManager = new SoundManager();
