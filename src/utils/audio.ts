// S.H.I.E.L.D. Protocol - Audio Synthesizer (Web Audio API)
// Pure synthesized sounds - zero external assets needed, works in all modern browsers

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Tactical Interface Beep
  public playBeep(freq = 880, duration = 0.08, type: OscillatorType = 'sine') {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }

  // Quake Seismic Shockwave
  public playSeismic(intensity = 1.0) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Low rumble sub oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const baseFreq = 40 + intensity * 25;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.45);

      // Add a lowpass filter for sub-bass punch
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      gain.gain.setValueAtTime(0.3 * Math.min(1.5, intensity), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio fallback
    }
  }

  // Coulson Energy Shield Activation & Hum
  public playEnergyShield(active: boolean) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      if (active) {
        osc1.frequency.setValueAtTime(320, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);
        osc2.frequency.setValueAtTime(640, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.25);
      } else {
        osc1.frequency.setValueAtTime(1200, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2);
        osc2.frequency.setValueAtTime(1800, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
      }

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.28);
      osc2.stop(ctx.currentTime + 0.28);
    } catch {
      // Audio fallback
    }
  }

  // Coulson Laser / Finger Cut
  public playLaser() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio fallback
    }
  }

  // Framework CRT Static / Glitch
  public playGlitch() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Audio fallback
    }
  }

  // LMD Boot / Drone Servo
  public playLmdBoot() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio fallback
    }
  }

  // Shotgun-Axe blast
  public playShotgunAxe() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Heavy boom
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);

      // Metallic slice sheen
      setTimeout(() => {
        if (!ctx) return;
        const metalOsc = ctx.createOscillator();
        const metalGain = ctx.createGain();
        metalOsc.type = 'sine';
        metalOsc.frequency.setValueAtTime(1800, ctx.currentTime);
        metalOsc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.2);
        metalGain.gain.setValueAtTime(0.15, ctx.currentTime);
        metalGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        metalOsc.connect(metalGain);
        metalGain.connect(ctx.destination);
        metalOsc.start();
        metalOsc.stop(ctx.currentTime + 0.2);
      }, 100);
    } catch {
      // Audio fallback
    }
  }

  // Level Up / Clearance Promotion Chime
  public playClearancePromotion() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
      });
    } catch {
      // Audio fallback
    }
  }

  // Ambient Audio Engine (Continuous loop synthesizer)
  private ambientGain: GainNode | null = null;
  private ambientOscs: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private currentAmbientTrack: 'off' | 'zephyr' | 'mainframe' | 'radio' = 'off';

  public getCurrentAmbientTrack(): 'off' | 'zephyr' | 'mainframe' | 'radio' {
    return this.currentAmbientTrack;
  }

  public stopAmbient() {
    this.ambientOscs.forEach(node => {
      try {
        if ('stop' in node) node.stop();
        node.disconnect();
      } catch {}
    });
    this.ambientOscs = [];
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch {}
      this.ambientGain = null;
    }
    this.currentAmbientTrack = 'off';
  }

  public setAmbientTrack(track: 'off' | 'zephyr' | 'mainframe' | 'radio', volume = 0.12) {
    this.stopAmbient();
    if (track === 'off' || this.isMuted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.currentAmbientTrack = track;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      if (track === 'zephyr') {
        // Deep twin-turbine engine hum (55Hz & 110Hz + lowpass filter)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(54, ctx.currentTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(108, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, ctx.currentTime);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.4, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(subGain);
        subGain.connect(masterGain);

        osc1.start();
        osc2.start();
        this.ambientOscs.push(osc1, osc2);
      } else if (track === 'mainframe') {
        // Triskelion Server Room: dual frequency sine tones + gentle cooling fan noise
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(6, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.04, ctx.currentTime);

        const toneGain = ctx.createGain();
        toneGain.gain.setValueAtTime(0.1, ctx.currentTime);

        osc.connect(toneGain);
        toneGain.connect(masterGain);

        osc.start();
        lfo.start();
        this.ambientOscs.push(osc, lfo);
      } else if (track === 'radio') {
        // Tactical shortwave comms hiss
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.15;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(1400, ctx.currentTime);
        bandpass.Q.setValueAtTime(2.5, ctx.currentTime);

        noise.connect(bandpass);
        bandpass.connect(masterGain);
        noise.start();
        this.ambientOscs.push(noise);
      }
    } catch {
      // Audio fallback
    }
  }

  // Yo-Yo Slingshot Super-Speed Whoosh
  public playSlingshotSpeed() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }

  // Ghost Rider Hellfire Blaze & Engine Roar
  public playGhostRiderIgnition() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // Low roaring rumble
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.4);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    } catch {}
  }

  // Mockingbird Shock Baton Crackle
  public playShockBaton() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.05);
      osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }

  // Berserker Staff Surge
  public playBerserkerRage() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(70, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }

  // Monolith Harmonic Resonance
  public playMonolithPhase(freq = 440) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch {}
  }

  // Speech Synthesizer for Quotes
  public speakQuote(text: string, voiceName?: string) {
    if (this.isMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 0.95;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0 && voiceName) {
        const found = voices.find(v => v.name.toLowerCase().includes(voiceName.toLowerCase()));
        if (found) utterance.voice = found;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech fallback
    }
  }
}

export const sound = new SoundController();
