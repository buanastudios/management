/**
 * Buana Academy Studio Transition Engine - Procedural Audio Engine
 * Uses Web Audio API to synthesize Tibetan singing bowls, deep resonant bronze gongs,
 * and harmonious notification chimes procedurally without any external audio file dependencies.
 */

class AudioEngineService {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.reverbNode = null;
    this.isUnlocked = false;
    this._initCallbacks = [];
    this.masterVolume = 0.85;
    this.currentAudioElement = null;
    this.ytPlayerInstance = null;
    this.isYtApiLoading = false;
    this.isYtApiReady = false;
    this._ytReadyCallbacks = [];
  }

  /**
   * Lazily initialize or resume AudioContext upon first user interaction
   */
  async initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('Web Audio API is not supported in this browser.');
        return false;
      }
      this.ctx = new AudioCtx();

      // Master Gain Node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

      // Analyser Node for Visualizers
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      // Master chain: [Instruments] -> [MasterGain] -> [Analyser] -> [Destination]
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Build synthetic algorithmic impulse response for studio reverb
      this.reverbNode = this._createSyntheticReverb(2.5, 2.0);
    }

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('Could not resume AudioContext', e);
      }
    }

    this.isUnlocked = this.ctx.state === 'running';
    this._notifyInit();
    return this.isUnlocked;
  }

  /**
   * Direct unlock trigger on user tap/click
   */
  async unlock() {
    return this.initAudioContext();
  }

  /**
   * Register a callback for when audio becomes unlocked
   */
  onStateChange(cb) {
    this._initCallbacks.push(cb);
    if (this.ctx) cb(this.ctx.state);
  }

  _notifyInit() {
    const state = this.getContextState();
    this._initCallbacks.forEach(cb => {
      try { cb(state); } catch (e) { console.error(e); }
    });
  }

  getContextState() {
    if (!this.ctx) return 'uninitialized';
    return this.ctx.state;
  }

  getAnalyser() {
    return this.analyser;
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  getMasterVolume() {
    return this.masterVolume;
  }

  /**
   * Creates a synthetic convolution reverb buffer for acoustic room warmth
   */
  _createSyntheticReverb(duration = 2.5, decay = 2.0) {
    if (!this.ctx) return null;
    const rate = this.ctx.sampleRate;
    const length = Math.floor(rate * duration);
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i;
      const envelope = Math.exp(-n / (rate * (decay / 4)));
      left[i] = (Math.random() * 2 - 1) * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }

    const convolver = this.ctx.createConvolver();
    convolver.buffer = impulse;

    // Wet/Dry mix
    const wetGain = this.ctx.createGain();
    wetGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    convolver.connect(wetGain);
    wetGain.connect(this.masterGain);

    return { convolver, wetGain };
  }

  /**
   * Helper to ensure AudioContext is active prior to sound generation
   */
  async _ensureActive() {
    if (!this.ctx || this.ctx.state === 'suspended') {
      await this.initAudioContext();
    }
    return !!this.ctx;
  }

  /**
   * Preset 1: Tibetan Singing Bowl
   * Features warm fundamental (~280Hz) + detuned pair (~281.8Hz) for natural binaural beating,
   * plus 2nd (~840Hz) and 3rd (~1400Hz) harmonic overtones with gentle exponential decay.
   */
  async playSingingBowl({ baseFreq = 280, duration = 7.0, volume = 0.85 } = {}) {
    if (!await this._ensureActive()) return;
    const now = this.ctx.currentTime;

    // Sub-harmonic / Fundamental Pair (creating 1.8Hz beating)
    const partials = [
      { freq: baseFreq, gain: 0.6, decay: duration },
      { freq: baseFreq + 1.8, gain: 0.5, decay: duration },
      { freq: baseFreq * 2.98, gain: 0.25, decay: duration * 0.75 }, // ~834Hz
      { freq: baseFreq * 5.02, gain: 0.12, decay: duration * 0.55 }, // ~1405Hz
      { freq: baseFreq * 7.15, gain: 0.05, decay: duration * 0.35 }  // ~2000Hz
    ];

    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0, now);
    // Soft attack (mimicking padded mallet striking singing bowl)
    voiceGain.gain.linearRampToValueAtTime(volume, now + 0.12);
    voiceGain.connect(this.masterGain);

    if (this.reverbNode) {
      voiceGain.connect(this.reverbNode.convolver);
    }

    partials.forEach(({ freq, gain, decay }) => {
      const osc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      pGain.gain.setValueAtTime(gain, now);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(pGain);
      pGain.connect(voiceGain);

      osc.start(now);
      osc.stop(now + decay);
    });

    // Clean up voice gain
    setTimeout(() => {
      try { voiceGain.disconnect(); } catch {}
    }, duration * 1000 + 500);
  }

  /**
   * Preset 2: Deep Resonant Bronze Gong
   * Low metallic strike with complex inharmonic partials (~110Hz, ~235Hz, ~370Hz, ~520Hz, ~810Hz),
   * mallet noise strike transient, and lingering deep metallic rumble.
   */
  async playDeepGong({ duration = 8.0, pitch = 110, volume = 0.9 } = {}) {
    if (!await this._ensureActive()) return;
    const now = this.ctx.currentTime;

    // Inharmonic metallic partials
    const partials = [
      { ratio: 1.0, gain: 0.75, decay: duration },
      { ratio: 1.015, gain: 0.65, decay: duration },       // Beating bottom
      { ratio: 2.14, gain: 0.45, decay: duration * 0.8 },
      { ratio: 3.38, gain: 0.35, decay: duration * 0.65 },
      { ratio: 4.75, gain: 0.25, decay: duration * 0.5 },
      { ratio: 6.22, gain: 0.18, decay: duration * 0.4 },
      { ratio: 8.95, gain: 0.10, decay: duration * 0.25 }
    ];

    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0, now);
    voiceGain.gain.linearRampToValueAtTime(volume, now + 0.04);
    voiceGain.connect(this.masterGain);

    if (this.reverbNode) {
      voiceGain.connect(this.reverbNode.convolver);
    }

    // Strike noise transient (felt mallet hitting heavy bronze)
    this._playMalletNoise(now, 0.08, volume * 0.5);

    partials.forEach(({ ratio, gain, decay }) => {
      const osc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();

      osc.type = ratio > 4 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(pitch * ratio, now);

      pGain.gain.setValueAtTime(gain, now);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(pGain);
      pGain.connect(voiceGain);

      osc.start(now);
      osc.stop(now + decay);
    });

    setTimeout(() => {
      try { voiceGain.disconnect(); } catch {}
    }, duration * 1000 + 500);
  }

  /**
   * Boundary State Chime: Double Gong Chime
   * Plays a resonant strike followed by a deeper harmonic resolution gong.
   */
  async playDoubleGong({ volume = 0.85 } = {}) {
    await this.playDeepGong({ duration: 7.0, pitch: 120, volume });
    setTimeout(async () => {
      await this.playDeepGong({ duration: 9.0, pitch: 98, volume: volume * 1.05 });
    }, 1250);
  }

  /**
   * Preset 3: Soft Two-Tone Chime
   * Gentle, modern aerodynamic announcement chime (F5 698Hz -> A5 880Hz)
   */
  async playSoftTwoTone({ volume = 0.75 } = {}) {
    if (!await this._ensureActive()) return;
    const now = this.ctx.currentTime;

    const notes = [
      { freq: 698.46, timeOffset: 0.0, duration: 2.2 }, // F5
      { freq: 880.00, timeOffset: 0.38, duration: 3.0 }  // A5
    ];

    notes.forEach(({ freq, timeOffset, duration }) => {
      const noteTime = now + timeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      // Subtle overtone
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, noteTime);
      gain2.gain.setValueAtTime(0.15, noteTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, noteTime + duration * 0.6);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(volume, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

      osc.connect(gain);
      osc2.connect(gain2);
      gain2.connect(gain);
      gain.connect(this.masterGain);

      if (this.reverbNode) {
        gain.connect(this.reverbNode.convolver);
      }

      osc.start(noteTime);
      osc2.start(noteTime);
      osc.stop(noteTime + duration);
      osc2.stop(noteTime + duration);
    });
  }

  /**
   * Preset 4: Zen Temple Bell (Keisu)
   * High bell strike (E5 659Hz) with sparkling overtones and delicate chorus
   */
  async playZenBell({ volume = 0.8 } = {}) {
    if (!await this._ensureActive()) return;
    const now = this.ctx.currentTime;
    const duration = 6.0;

    const partials = [
      { freq: 659.25, gain: 0.7 },   // E5
      { freq: 1318.5, gain: 0.35 },  // E6
      { freq: 1977.7, gain: 0.18 },  // B6
      { freq: 2793.8, gain: 0.08 }   // F7
    ];

    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0, now);
    voiceGain.gain.linearRampToValueAtTime(volume, now + 0.015);
    voiceGain.connect(this.masterGain);

    if (this.reverbNode) {
      voiceGain.connect(this.reverbNode.convolver);
    }

    partials.forEach(({ freq, gain }) => {
      const osc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      pGain.gain.setValueAtTime(gain, now);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(pGain);
      pGain.connect(voiceGain);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  /**
   * Mallet noise burst helper for gong strike authenticity
   */
  _playMalletNoise(time, duration = 0.06, volume = 0.3) {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to sound like a padded mallet
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + duration);
  }

  /**
   * Preset 5: Adzan Call to Prayer Resonance
   * Melodic spiritual chime sequence with serene harmonics and deep reverberant resolution
   */
  async playAdzanCall({ volume = 0.9 } = {}) {
    if (!await this._ensureActive()) return;
    const now = this.ctx.currentTime;

    // Melodic prayer motive notes (D4, G4, A4, D5)
    const notes = [
      { freq: 293.66, time: 0.0, dur: 1.8, gain: 0.6 },  // D4
      { freq: 392.00, time: 0.7, dur: 2.2, gain: 0.7 },  // G4
      { freq: 440.00, time: 1.8, dur: 2.5, gain: 0.8 },  // A4
      { freq: 587.33, time: 2.8, dur: 4.5, gain: 0.85 }  // D5 sustaining tail
    ];

    notes.forEach(({ freq, time, dur, gain }) => {
      const noteTime = now + time;
      const osc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      // Add harmonic overtone
      const osc2 = this.ctx.createOscillator();
      const pGain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, noteTime);
      pGain2.gain.setValueAtTime(gain * 0.25, noteTime);
      pGain2.gain.exponentialRampToValueAtTime(0.001, noteTime + dur * 0.7);

      pGain.gain.setValueAtTime(0, noteTime);
      pGain.gain.linearRampToValueAtTime(gain * volume, noteTime + 0.08);
      pGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

      osc.connect(pGain);
      osc2.connect(pGain2);
      pGain2.connect(pGain);
      pGain.connect(this.masterGain);

      if (this.reverbNode) {
        pGain.connect(this.reverbNode.convolver);
      }

      osc.start(noteTime);
      osc2.start(noteTime);
      osc.stop(noteTime + dur);
      osc2.stop(noteTime + dur);
    });

    // Concluding resonance gong
    setTimeout(() => {
      this.playDeepGong({ duration: 6.0, pitch: 146.83, volume: volume * 0.7 });
    }, 3200);
  }

  /**
   * Preset 6: Lagu Kebangsaan Indonesia Raya (🇮🇩)
   * Plays either procedural acapella / choral harmony synthesis or custom audio / YouTube URL
   */
  async playIndonesiaRaya({ volume = 0.95, customUrl = '' } = {}) {
    if (customUrl && customUrl.trim()) {
      try {
        const played = await this.playCustomUrl(customUrl.trim(), { volume });
        if (played) return true;
      } catch (err) {
        console.warn('AudioEngine: Custom audio/YouTube URL failed, falling back to procedural anthem synth.', err);
      }
    }

    if (!await this._ensureActive()) return;
    const now = this.ctx.currentTime;

    // Opening Ceremonial Fanfare Chime
    this.playZenBell({ volume: volume * 0.8 });

    // Polyphonic choral melody & harmony notes of Indonesia Raya opening motif (G Major)
    // [note, startTime, duration, freq, bassFreq]
    const choralMotif = [
      // "In - do - ne - sia"
      { time: 0.8, dur: 0.45, freq: 293.66, bass: 146.83, gain: 0.7 }, // D4, D3
      { time: 1.3, dur: 0.70, freq: 392.00, bass: 196.00, gain: 0.85 }, // G4, G3
      { time: 2.1, dur: 0.40, freq: 392.00, bass: 196.00, gain: 0.75 }, // G4
      { time: 2.55, dur: 0.45, freq: 440.00, bass: 220.00, gain: 0.8 }, // A4, A3
      { time: 3.05, dur: 0.70, freq: 493.88, bass: 246.94, gain: 0.9 }, // B4, B3
      { time: 3.8, dur: 0.45, freq: 392.00, bass: 196.00, gain: 0.8 },  // G4

      // "Ta - nah  a - ir - ku"
      { time: 4.3, dur: 0.45, freq: 329.63, bass: 164.81, gain: 0.75 }, // E4, E3
      { time: 4.8, dur: 0.80, freq: 329.63, bass: 164.81, gain: 0.8 },  // E4

      // "Ta - nah  tum - pah  da - rah - ku"
      { time: 5.7, dur: 0.45, freq: 293.66, bass: 146.83, gain: 0.75 }, // D4
      { time: 6.2, dur: 0.70, freq: 440.00, bass: 220.00, gain: 0.85 }, // A4
      { time: 7.0, dur: 0.40, freq: 440.00, bass: 220.00, gain: 0.75 }, // A4
      { time: 7.45, dur: 0.45, freq: 493.88, bass: 246.94, gain: 0.8 }, // B4
      { time: 7.95, dur: 0.70, freq: 523.25, bass: 261.63, gain: 0.9 }, // C5, C4
      { time: 8.7, dur: 0.45, freq: 440.00, bass: 220.00, gain: 0.8 },  // A4
      { time: 9.2, dur: 0.45, freq: 369.99, bass: 185.00, gain: 0.75 }, // F#4
      { time: 9.7, dur: 0.80, freq: 293.66, bass: 146.83, gain: 0.8 },  // D4

      // "Di  sa - na - lah  a - ku  ber - di - ri"
      { time: 10.6, dur: 0.45, freq: 293.66, bass: 146.83, gain: 0.75 }, // D4
      { time: 11.1, dur: 0.70, freq: 493.88, bass: 246.94, gain: 0.9 },  // B4
      { time: 11.9, dur: 0.40, freq: 493.88, bass: 246.94, gain: 0.8 },  // B4
      { time: 12.35, dur: 0.45, freq: 523.25, bass: 261.63, gain: 0.85 },// C5
      { time: 12.85, dur: 0.70, freq: 587.33, bass: 293.66, gain: 0.95 },// D5
      { time: 13.6, dur: 0.45, freq: 493.88, bass: 246.94, gain: 0.85 }, // B4
      { time: 14.1, dur: 0.45, freq: 440.00, bass: 220.00, gain: 0.8 },  // A4
      { time: 14.6, dur: 0.75, freq: 392.00, bass: 196.00, gain: 0.85 }, // G4

      // "Ja - di  pan - du  i - bu - ku"
      { time: 15.45, dur: 0.45, freq: 440.00, bass: 220.00, gain: 0.8 }, // A4
      { time: 15.95, dur: 0.45, freq: 493.88, bass: 246.94, gain: 0.85 },// B4
      { time: 16.45, dur: 0.45, freq: 523.25, bass: 261.63, gain: 0.85 },// C5
      { time: 16.95, dur: 0.45, freq: 493.88, bass: 246.94, gain: 0.8 }, // B4
      { time: 17.45, dur: 0.70, freq: 440.00, bass: 220.00, gain: 0.85 },// A4
      { time: 18.2, dur: 2.20, freq: 392.00, bass: 196.00, gain: 1.0 }   // G4 Grand resolution
    ];

    choralMotif.forEach(({ time, dur, freq, bass, gain }) => {
      const noteTime = now + time;

      // 1. Lead Vocal Formant (Sine + Triangle blend)
      const oscLead = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();

      oscLead.type = 'sine';
      oscLead.frequency.setValueAtTime(freq, noteTime);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 1.5, noteTime); // Perfect fifth overtone warmth

      const formFilter = this.ctx.createBiquadFilter();
      formFilter.type = 'bandpass';
      formFilter.frequency.setValueAtTime(850, noteTime); // Vocal formant body
      formFilter.Q.setValueAtTime(1.8, noteTime);

      // 2. Choral Bass Harmony
      const oscBass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      oscBass.type = 'sine';
      oscBass.frequency.setValueAtTime(bass, noteTime);

      // Envelopes with smooth vocal attack and release
      leadGain.gain.setValueAtTime(0.0001, noteTime);
      leadGain.gain.linearRampToValueAtTime(gain * volume * 0.45, noteTime + 0.08);
      leadGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

      bassGain.gain.setValueAtTime(0.0001, noteTime);
      bassGain.gain.linearRampToValueAtTime(gain * volume * 0.35, noteTime + 0.10);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur + 0.1);

      // Connect Lead
      oscLead.connect(leadGain);
      oscHarmonic.connect(leadGain);
      leadGain.connect(formFilter);
      formFilter.connect(this.masterGain);

      // Connect Bass
      oscBass.connect(bassGain);
      bassGain.connect(this.masterGain);

      // Reverb send
      if (this.reverbNode) {
        formFilter.connect(this.reverbNode.convolver);
        bassGain.connect(this.reverbNode.convolver);
      }

      oscLead.start(noteTime);
      oscHarmonic.start(noteTime);
      oscBass.start(noteTime);

      oscLead.stop(noteTime + dur + 0.15);
      oscHarmonic.stop(noteTime + dur + 0.15);
      oscBass.stop(noteTime + dur + 0.25);
    });

    // Concluding Gong Resonance
    setTimeout(() => {
      this.playDoubleGong({ volume: volume * 0.7 });
    }, 19000);
  }

  /**
   * Generic router for playing presets by string ID
   */
  async playPreset(presetId) {
    switch (presetId) {
      case 'singing-bowl':
        return this.playSingingBowl();
      case 'deep-gong':
        return this.playDoubleGong();
      case 'two-tone':
        return this.playSoftTwoTone();
      case 'zen-bell':
        return this.playZenBell();
      case 'adzan-call':
        return this.playAdzanCall();
      case 'indonesia-raya':
        return this.playIndonesiaRaya();
      default:
        return this.playSingingBowl();
    }
  }

  /**
   * Helper: extract 11-character YouTube video ID from any YouTube URL format or raw ID
   */
  extractYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;
    const str = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
      return str;
    }
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = str.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Ensure hidden YouTube IFrame player container is injected in document body
   */
  _ensureYouTubeContainer() {
    if (typeof document === 'undefined') return null;
    let wrapper = document.getElementById('youtube-player-hidden-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'youtube-player-hidden-wrapper';
      wrapper.style.position = 'fixed';
      wrapper.style.bottom = '10px';
      wrapper.style.right = '10px';
      wrapper.style.width = '200px';
      wrapper.style.height = '120px';
      wrapper.style.zIndex = '-1';
      wrapper.style.opacity = '0.01';
      wrapper.style.pointerEvents = 'none';
      wrapper.innerHTML = '<div id="youtube-player-element"></div>';
      document.body.appendChild(wrapper);
    }
    return wrapper;
  }

  /**
   * Asynchronously load and initialize the official YouTube IFrame Player API
   */
  loadYouTubeIframeApi() {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(null);
      if (window.YT && window.YT.Player) {
        this.isYtApiReady = true;
        return resolve(window.YT);
      }

      this._ytReadyCallbacks.push(resolve);

      if (!this.isYtApiLoading) {
        this.isYtApiLoading = true;
        const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
        if (!existingScript) {
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScript = document.getElementsByTagName('script')[0];
          if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(tag, firstScript);
          } else {
            document.head.appendChild(tag);
          }
        }

        const prevReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (typeof prevReady === 'function') {
            try { prevReady(); } catch (e) {}
          }
          this.isYtApiReady = true;
          this._ytReadyCallbacks.forEach(cb => {
            try { cb(window.YT); } catch (e) { console.error(e); }
          });
          this._ytReadyCallbacks = [];
        };
      }
    });
  }

  /**
   * Play YouTube audio stream via hidden responsive IFrame player
   */
  async playYouTubeAudio(videoId, volume = this.masterVolume) {
    this._ensureYouTubeContainer();
    const YT = await this.loadYouTubeIframeApi();

    return new Promise((resolve, reject) => {
      try {
        const targetVol = Math.round(Math.max(0, Math.min(1, volume)) * 100);

        if (this.ytPlayerInstance && typeof this.ytPlayerInstance.loadVideoById === 'function') {
          this.ytPlayerInstance.setVolume(targetVol);
          this.ytPlayerInstance.loadVideoById({
            videoId: videoId,
            startSeconds: 0
          });
          this.ytPlayerInstance.playVideo();
          return resolve(this.ytPlayerInstance);
        }

        this.ytPlayerInstance = new YT.Player('youtube-player-element', {
          height: '120',
          width: '200',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1
          },
          events: {
            onReady: (event) => {
              event.target.setVolume(targetVol);
              event.target.playVideo();
              resolve(event.target);
            },
            onError: (err) => {
              console.warn('AudioEngine: YouTube Player error', err);
              reject(new Error(`YouTube player error (${err.data || 'embed restricted'})`));
            }
          }
        });
      } catch (err) {
        console.error('AudioEngine: Error initiating YouTube player', err);
        reject(err);
      }
    });
  }

  /**
   * Stop any active custom audio element or YouTube video stream
   */
  stopCustomAudio() {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement = null;
      } catch (e) {}
    }
    if (this.ytPlayerInstance && typeof this.ytPlayerInstance.stopVideo === 'function') {
      try {
        this.ytPlayerInstance.stopVideo();
      } catch (e) {}
    }
  }

  /**
   * Universal player for custom audio sources (YouTube URLs / Video IDs OR Direct MP3/WAV/AAC URLs)
   */
  async playCustomUrl(url, { volume = this.masterVolume } = {}) {
    if (!url || !url.trim()) return false;
    const cleanUrl = url.trim();

    // 1. Stop any currently playing custom track
    this.stopCustomAudio();

    // 2. Check for YouTube URL or video ID
    const ytId = this.extractYouTubeId(cleanUrl);
    if (ytId) {
      console.log(`AudioEngine: Detected YouTube URL. Streaming audio for video ID: ${ytId}`);
      return this.playYouTubeAudio(ytId, volume);
    }

    // 3. Fallback: Direct MP3/WAV/AAC audio stream
    try {
      const audio = new Audio(cleanUrl);
      audio.volume = Math.max(0, Math.min(1, volume));
      this.currentAudioElement = audio;
      await audio.play();
      return true;
    } catch (err) {
      console.error('AudioEngine: Error playing direct audio URL', err);
      throw err;
    }
  }

  /**
   * Stop all sound generation
   */
  stopAll() {
    this.stopCustomAudio();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const AudioEngine = new AudioEngineService();
