/**
 * Buana Academy Studio Transition Engine - Voice Synthesis Engine & Persona Manager
 * Provides expressive, energetic multilingual voice announcements in Sundanese (Basa Sunda),
 * English, and Arabic, with Natural / Neural voice ranking, Tone profiles (Energetic, Warm, Spiritual, Authoritative),
 * sentence chunking for natural breath pacing, and interchangeable Male/Female personas.
 */

export const VOICE_LANGUAGES = [
  { id: 'sundanese', name: 'Sundanese (Basa Sunda 🌺)', code: 'su-ID', fallbackCode: 'id-ID' },
  { id: 'indonesian', name: 'Indonesian (Bahasa Indonesia 🇮🇩)', code: 'id-ID', fallbackCode: 'ms-MY' },
  { id: 'english', name: 'English (International 🇬🇧)', code: 'en-US', fallbackCode: 'en-GB' },
  { id: 'arabic', name: 'Arabic (العربية 🇸🇦)', code: 'ar-SA', fallbackCode: 'ar-XA' },
  { id: 'multilingual_su_en', name: 'Bilingual: Sundanese + English', isMulti: true },
  { id: 'multilingual_id_en', name: 'Bilingual: Indonesian + English', isMulti: true },
  { id: 'multilingual_ar_en', name: 'Bilingual: Arabic + English', isMulti: true },
  { id: 'random_rotate', name: 'Auto-Rotate (Sundanese ➔ Indonesian ➔ English ➔ Arabic)', isRotate: true }
];

export const VOICE_GENDERS = [
  { id: 'alternate', name: 'Interchangeable / Auto-Rotate (Male ⇄ Female)' },
  { id: 'female', name: 'Female Voice Persona (Bright, Energetic & Warm)' },
  { id: 'male', name: 'Male Voice Persona (Resonant, Motivating & Calm)' }
];

export const TONE_PROFILES = {
  energetic: {
    name: 'Semangat & Berenergi ⚡',
    femalePitch: 1.20,
    malePitch: 1.04,
    rateMultiplier: 1.03,
    punctuationStyle: 'exclamatory'
  },
  warm: {
    name: 'Ramah & Hangat 🌟',
    femalePitch: 1.10,
    malePitch: 0.94,
    rateMultiplier: 0.97,
    punctuationStyle: 'friendly'
  },
  spiritual: {
    name: 'Khusyuk & Tenang 🕊️',
    femalePitch: 1.02,
    malePitch: 0.82,
    rateMultiplier: 0.88,
    punctuationStyle: 'serene'
  },
  authoritative: {
    name: 'Tegas & Jelas 📢',
    femalePitch: 1.08,
    malePitch: 0.88,
    rateMultiplier: 0.98,
    punctuationStyle: 'firm'
  }
};

/**
 * Default fallback announcement templates across all languages
 */
export const ANNOUNCEMENT_TEMPLATES = {
  sundanese: {
    opening: "Sampurasun wargi Buana Academy! Wilujeng sumping dina sési {title}! Hayu urang kawitan kalayan pinuh sumanget sareng fokus!",
    warning: "Perhatosan wargi Buana Academy! Waktos sési {title} nyesa {minutes} menit deui. Hayu mimiti bérés-bérés: {action}! Salajengna siapkeun rohangan kanggo sési {nextTitle} dina tabuh {nextTime}.",
    end: "Alhamdulillah, sési {title} parantos réngsé kalayan lungsur-langsar. Hatur nuhun kasadayana wargi! Mangga siap-siap kanggo sési salajengna, {nextTitle}.",
    anthem: "Perhatosan kasadayana wargi Buana Academy. Dina tabuh {nextTime}, mangga sadayana ngadeg kalayan sikep sampurna tur khusyuk kanggo ngaregepkeun sareng ngawihkeun Lagu Kabangsaan Indonesia Raya.",
    dzikirPagi: "Wilujeng enjing wargi Buana Academy! Hayu urang ngalaksanakeun Dzikir Pagi kanggo ngawitan dinten kalayan katengtraman sareng kaberkahan.",
    dhuha: "Pangemut Shalat Sunnah Dhuha: Mangga nyempetkeun wudhu sareng ngalaksanakeun shalat Dhuha.",
    preparePrayer: "Parantos caket waktos shalat {prayerName}. Hayu wargi sadaya siap-siap wudhu sareng tata sajadah kanggo shalat berjamaah.",
    adzan: "Waktos adzan {prayerName} parantos sumping. Hayu urang sami-sami ngalaksanakeun shalat berjamaah.",
    dzikirPetang: "Ba'da shalat Ashar, hayu urang sami-sami maos Dzikir Petang kanggo ngaraksa diri sareng ngalap kaberkahan sonten.",
    makan: "Waktosna istirahat tuang siang parantos sumping! Mangga raosan katuangan anu sehat sareng ulah hilap ngaos Bismillah.",
    qoilullah: "Waktosna reureuh sakedap kanggo istirahat Qoilullah sateuacan lebet waktos Dzuhur. Mangga ngareureuhkeun raga supados seger deui."
  },
  indonesian: {
    opening: "Selamat datang di Buana Academy! Sesi {title} telah resmi dimulai. Mari kita bereksplorasi dan berkreasi dengan penuh semangat dan kolaborasi!",
    warning: "Perhatian studio Buana Academy! Waktu sesi {title} tersisa {minutes} menit lagi. Silakan mulai merapikan: {action}! Selanjutnya persiapkan ruangan untuk sesi {nextTitle} pada pukul {nextTime}.",
    end: "Alhamdulillah, sesi {title} telah selesai dengan sangat baik. Terima kasih atas kerja keras dan dedikasi semuanya! Silakan bersiap untuk sesi selanjutnya, {nextTitle}.",
    anthem: "Perhatian kepada seluruh hadirin dan civitas Buana Academy. Tepat pada pukul {nextTime}, dimohon berdiri tegak dengan sikap sempurna dan khidmat untuk mendengarkan serta menyanyikan bersama Lagu Kebangsaan Indonesia Raya.",
    dzikirPagi: "Selamat pagi rekan-rekan Buana Academy. Mari kita luangkan waktu sejenak untuk membaca Dzikir Pagi agar hari kita senantiasa dalam perlindungan dan keberkahan.",
    dhuha: "Pengingat Shalat Sunnah Dhuha: Mari sempatkan berwudhu dan menunaikan shalat Dhuha sebagai pembuka pintu rezeki berkah.",
    preparePrayer: "Waktu shalat {prayerName} segera tiba. Mari bersama-sama mengambil wudhu, merapikan ruangan, dan menata saf untuk shalat berjamaah.",
    adzan: "Panggilan shalat {prayerName} telah berkumandang. Mari kita segera berkumpul, meluruskan saf, dan mendirikan shalat secara berjamaah.",
    dzikirPetang: "Selepas shalat Ashar, mari bersama-sama membaca Dzikir Petang untuk menenangkan hati dan memohon penjagaan di penghujung hari.",
    makan: "Waktu istirahat makan siang telah tiba! Selamat menikmati santapan yang sehat dan bergizi, dan jangan lupa mengawali dengan bismillah.",
    qoilullah: "Saatnya beristirahat sejenak untuk menunaikan sunnah Qoilullah sebelum waktu Dzuhur guna menyegarkan kembali tubuh dan pikiran."
  },
  english: {
    opening: "Welcome everyone to the {title} session at Buana Academy! Let's get energized, collaborate, and make today amazing!",
    warning: "Attention Buana Academy studio! Ten minutes remaining in the {title} session. Please begin wrap-up: {action}! Next up, prepare the space for {nextTitle} starting at {nextTime}.",
    end: "The {title} session has now concluded. Thank you everyone for your great work! Please prepare for the next session, {nextTitle}.",
    anthem: "Attention everyone at Buana Academy. At {nextTime}, please stand upright in respectful attention to listen and sing together our National Anthem, Indonesia Raya.",
    dzikirPagi: "Good morning Buana Academy studio! Time for Morning Remembrance, Dzikir Pagi, to begin our day with tranquility and blessings.",
    dhuha: "Dhuha Prayer Reminder: Take a brief pause to perform wudhu and observe the blessed Dhuha prayer.",
    preparePrayer: "Approaching {prayerName} prayer time. Please begin wudhu and prepare the studio space for congregational prayer.",
    adzan: "The time for {prayerName} prayer has arrived. Let us stand together for congregational prayer.",
    dzikirPetang: "Time for Evening Remembrance, Dzikir Petang, to preserve serenity and blessings for the afternoon.",
    makan: "It is now lunch and meal break time! Please enjoy your meal, hydrate, and relax.",
    qoilullah: "Time for a brief midday Qoilullah rest before Dhuhr prayer. Relax, recharge, and restore your focus."
  },
  arabic: {
    opening: "أهلاً وسهلاً بكم جميعاً في جلسة {title} في أكاديمية بوانا! لنبدأ يومنا بكل حماس ونشاط!",
    warning: "تنبيه لأعضاء أكاديمية بوانا: تبقى عشر دقائق على نهاية جلسة {title}. يرجى البدء في الترتيب: {action}. والاستعداد للجلسة القادمة {nextTitle} في تمام الساعة {nextTime}.",
    end: "انتهت جلسة {title} بنجاح. شكراً لجهودكم جميعاً، ويرجى الاستعداد للجلسة القادمة {nextTitle}.",
    anthem: "تنبيه لجميع الحاضرين في أكاديمية بوانا. في تمام الساعة {nextTime}، يرجى الوقوف بكل احترام وسكون للاستماع والإنشاد للنشيد الوطني الإندونيسي (إندونيسيا رايا).",
    dzikirPagi: "صباح الخير. حان الآن وقت أذكار الصباح لبدء يومنا بالبركة والسكينة.",
    dhuha: "تذكير بصلاة الضحى: يرجى أخذ استراحة قصيرة للوضوء وأداء صلاة الضحى المباركة.",
    preparePrayer: "اقترب وقت صلاة {prayerName}. يرجى الاستعداد والوضوء لصلاة الجماعة.",
    adzan: "حان الآن وقت أذان صلاة {prayerName}. حي على الصلاة، حي على الفلاح.",
    dzikirPetang: "حان الآن وقت أذكار المساء بعد صلاة العصر لحفظ النفس والبركة.",
    makan: "حان الآن وقت استراحة تناول الطعام والغداء. بالهناء والشفاء للجميع.",
    qoilullah: "حان الآن وقت القيلولة والاستراحة القصيرة قبل صلاة الظهر لتجديد النشاط والهمة."
  }
};

class VoiceEngineService {
  constructor() {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.voices = [];
    this.isReady = false;
    this.lastGenderUsed = 'female'; // Start with bright female, then alternate
    this.rotateLangIndex = 0;
    this.isSpeaking = false;
    this._listeners = new Set();

    this._initVoices();
  }

  _initVoices() {
    if (!this.synth) {
      console.warn('SpeechSynthesis API is not supported in this browser environment.');
      return;
    }

    const loadVoices = () => {
      this.voices = this.synth.getVoices();
      if (this.voices.length > 0) {
        this.isReady = true;
        this._notify();
      }
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  onVoicesReady(cb) {
    this._listeners.add(cb);
    if (this.isReady) cb(this.voices);
    return () => this._listeners.delete(cb);
  }

  _notify() {
    this._listeners.forEach(cb => {
      try { cb(this.voices); } catch (e) { console.error(e); }
    });
  }

  /**
   * Unlock speech synthesis on mobile / kiosk device upon user gesture
   */
  unlock() {
    if (!this.synth) return;
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.cancel();
      this.isSpeaking = false;
    } catch (e) {
      console.warn('Voice unlock error', e);
    }
  }

  /**
   * Intelligent Voice Selection with High-Fidelity Neural / Natural Voice Ranking
   * Prioritizes modern neural voices (Edge Natural, Google Cloud, Apple Enhanced) over legacy robotic voices.
   */
  findBestVoice(targetLangCode, genderPreference = 'female') {
    if (!this.voices || this.voices.length === 0) return null;

    const langLower = targetLangCode.toLowerCase().split('-')[0]; // 'su', 'id', 'en', 'ar'

    // Candidate pool
    let candidates = this.voices.filter(v => {
      const vLang = v.lang.toLowerCase();
      if (langLower === 'su') {
        return vLang.includes('su') || vLang.includes('id');
      }
      return vLang.startsWith(langLower) || vLang.includes(langLower);
    });

    if (candidates.length === 0) {
      candidates = this.voices;
    }

    // Score candidates based on natural quality and gender
    const scored = candidates.map(voice => {
      let score = 0;
      const nameLower = voice.name.toLowerCase();

      // 1. Natural / Neural quality keywords (+50 pts)
      if (nameLower.includes('natural') || nameLower.includes('neural') || nameLower.includes('online')) score += 50;
      if (nameLower.includes('google')) score += 40;
      if (nameLower.includes('enhanced') || nameLower.includes('premium')) score += 35;
      if (voice.localService === false) score += 20; // Network neural voices often sound vastly superior

      // 2. Penalize known robotic desktop synth engines (-30 pts)
      if (nameLower.includes('desktop') || nameLower.includes('espeak') || nameLower.includes('zira desktop') || nameLower.includes('david desktop')) {
        score -= 30;
      }

      // 3. Gender matching keywords
      const femaleKeywords = ['female', 'gadis', 'samantha', 'jenny', 'damayanti', 'salma', 'zira', 'laila', 'victoria', 'karen', 'serena', 'yuna', 'ayumi'];
      const maleKeywords = ['male', 'ardi', 'david', 'guy', 'george', 'maged', 'tarik', 'daniel', 'oliver', 'thomas', 'ryan', 'shakir'];

      const isFemale = femaleKeywords.some(k => nameLower.includes(k));
      const isMale = maleKeywords.some(k => nameLower.includes(k));

      if (genderPreference === 'female') {
        if (isFemale) score += 30;
        if (isMale) score -= 20;
      } else if (genderPreference === 'male') {
        if (isMale) score += 30;
        if (isFemale) score -= 20;
      }

      return { voice, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.voice || candidates[0] || this.voices[0] || null;
  }

  /**
   * Pre-process Sundanese / Indonesian text for natural prosody & pronunciation
   */
  enhanceTextProsody(rawText, langCode = 'su-ID') {
    if (!rawText) return '';
    let text = rawText.trim();

    // Clean up template tokens that weren't replaced
    text = text.replace(/{[a-zA-Z0-9_-]+}/g, '');

    // Phonetic smoothing for natural delivery
    if (langCode === 'su-ID' || langCode === 'id-ID') {
      text = text
        .replace(/bérés-bérés/gi, 'beres-beres')
        .replace(/réngsé/gi, 'rengse')
        .replace(/sési/gi, 'sesi')
        .replace(/qoilullah/gi, 'qoilulloh')
        .replace(/ba'da/gi, 'bada')
        .replace(/T-10m/gi, 'sapuluh menit');
    }

    // Ensure sentences end with lively punctuation to prevent robotic flat pitch
    if (!/[.!?]$/.test(text)) {
      text += '!';
    }

    return text;
  }

  /**
   * Replace dynamic tokens in template text
   */
  interpolateText(templateText, {
    title = 'Studio Session',
    action = 'Store equipment and prepare mats',
    nextTitle = 'the next scheduled session',
    nextTime = 'soon',
    minutes = 10,
    prayerName = 'Shalat'
  } = {}) {
    if (!templateText) return '';
    return templateText
      .replace(/{title}/g, title || 'Studio Session')
      .replace(/{action}/g, action || 'Clean up and store equipment')
      .replace(/{nextTitle}/g, nextTitle || 'the next scheduled session')
      .replace(/{nextTime}/g, nextTime || 'soon')
      .replace(/{prayerName}/g, prayerName || 'Shalat')
      .replace(/{minutes}/g, String(minutes));
  }

  /**
   * Build formatted announcement text from templates
   */
  formatAnnouncement(langId, type, tokens = {}) {
    const templates = ANNOUNCEMENT_TEMPLATES[langId] || ANNOUNCEMENT_TEMPLATES.english;
    const template = templates[type] || templates.warning || templates.opening;
    return this.interpolateText(template, tokens);
  }

  /**
   * Speak from a saved custom voice preset with Tone & Gender profiles
   */
  async speakFromPreset({
    presetId,
    presetObject = null,
    tokens = {},
    settings = {}
  }) {
    if (!this.synth) return;
    if (settings.voiceEnabled === false) return;

    let preset = presetObject;
    if (!preset && presetId) {
      try {
        const { Storage } = await import('./storage.js');
        preset = Storage.getVoicePresetById(presetId);
      } catch (err) {
        console.warn('VoiceEngine: could not fetch preset from storage', err);
      }
    }

    if (!preset) {
      // Fallback
      return this.speakAnnouncement({
        type: 'warning',
        slotTitle: tokens.title,
        actionInstruction: tokens.action,
        nextSlotTitle: tokens.nextTitle,
        nextSlotTime: tokens.nextTime,
        warningMinutes: tokens.minutes,
        prayerName: tokens.prayerName,
        settings
      });
    }

    const interpolated = this.interpolateText(preset.text, tokens);
    const targetLang = preset.language || settings.voiceLanguage || 'sundanese';
    const targetGender = preset.gender || settings.voiceGender || 'alternate';
    const toneId = preset.tone || settings.voiceTone || 'energetic';
    const baseRate = parseFloat(settings.voiceRate) || 1.0;
    const baseVolume = parseFloat(settings.masterVolume) || 0.95;

    let currentGender = targetGender;
    if (targetGender === 'alternate') {
      currentGender = this.lastGenderUsed === 'male' ? 'female' : 'male';
      this.lastGenderUsed = currentGender;
    }

    let langCode = 'su-ID';
    if (targetLang === 'english') langCode = 'en-US';
    else if (targetLang === 'arabic') langCode = 'ar-SA';
    else if (targetLang === 'indonesian') langCode = 'id-ID';
    else if (targetLang === 'sundanese') langCode = 'su-ID';

    const enhancedText = this.enhanceTextProsody(interpolated, langCode);

    this.synth.cancel();

    return this._speakNaturalPhrases({
      fullText: enhancedText,
      langCode,
      gender: currentGender,
      toneId,
      baseRate,
      volume: baseVolume
    });
  }

  /**
   * Execute voice announcement with interchangeable gender & multi-language support
   */
  async speakAnnouncement({
    type = 'warning', // 'opening', 'warning', 'end', 'anthem', 'dzikirPagi', 'dhuha', 'preparePrayer', 'adzan', 'dzikirPetang', 'makan', 'qoilullah'
    slotTitle,
    actionInstruction,
    nextSlotTitle,
    nextSlotTime,
    warningMinutes = 10,
    prayerName,
    settings = {}
  }) {
    if (!this.synth) return;
    if (settings.voiceEnabled === false) return;

    const langSetting = settings.voiceLanguage || 'sundanese';
    const genderSetting = settings.voiceGender || 'alternate';
    const toneSetting = settings.voiceTone || (type === 'opening' || type === 'warning' ? 'energetic' : (type === 'anthem' ? 'authoritative' : (type === 'end' || type === 'makan' ? 'warm' : 'spiritual')));
    const baseRate = parseFloat(settings.voiceRate) || 1.0;
    const baseVolume = parseFloat(settings.masterVolume) || 0.95;

    this.synth.cancel();

    let langQueue = [];
    if (langSetting === 'multilingual_su_en') {
      langQueue = ['sundanese', 'english'];
    } else if (langSetting === 'multilingual_id_en') {
      langQueue = ['indonesian', 'english'];
    } else if (langSetting === 'multilingual_ar_en') {
      langQueue = ['arabic', 'english'];
    } else if (langSetting === 'random_rotate') {
      const allLangs = ['sundanese', 'indonesian', 'english', 'arabic'];
      langQueue = [allLangs[this.rotateLangIndex % allLangs.length]];
      this.rotateLangIndex++;
    } else {
      langQueue = [langSetting];
    }

    for (let i = 0; i < langQueue.length; i++) {
      const currentLang = langQueue[i];

      let currentGender = genderSetting;
      if (genderSetting === 'alternate') {
        currentGender = this.lastGenderUsed === 'male' ? 'female' : 'male';
        this.lastGenderUsed = currentGender;
      }

      const rawText = this.formatAnnouncement(currentLang, type, {
        title: slotTitle,
        action: actionInstruction,
        nextTitle: nextSlotTitle,
        nextTime: nextSlotTime,
        minutes: warningMinutes,
        prayerName: prayerName
      });

      let langCode = 'su-ID';
      if (currentLang === 'sundanese') langCode = 'su-ID';
      else if (currentLang === 'indonesian') langCode = 'id-ID';
      else if (currentLang === 'arabic') langCode = 'ar-SA';
      else if (currentLang === 'english') langCode = 'en-US';

      const enhancedText = this.enhanceTextProsody(rawText, langCode);

      await this._speakNaturalPhrases({
        fullText: enhancedText,
        langCode,
        gender: currentGender,
        toneId: toneSetting,
        baseRate,
        volume: baseVolume
      });

      if (i < langQueue.length - 1) {
        await new Promise(r => setTimeout(r, 450));
      }
    }
  }

  /**
   * Dedicated helper for Indonesia Raya National Anthem Standing Call
   */
  async speakAnthemAnnouncement({
    time = '10:00',
    presetId = null,
    settings = {}
  }) {
    if (presetId) {
      return this.speakFromPreset({
        presetId,
        tokens: {
          nextTime: time,
          title: 'Lagu Kebangsaan Indonesia Raya'
        },
        settings: { ...settings, voiceTone: 'authoritative' }
      });
    }

    return this.speakAnnouncement({
      type: 'anthem',
      nextSlotTime: time,
      settings: { ...settings, voiceTone: 'authoritative' }
    });
  }

  /**
   * Dedicated helper for Prayer, Adzan & Dzikir announcements
   */
  async speakPrayerAnnouncement({
    type,
    prayerName = 'Shalat',
    settings = {}
  }) {
    return this.speakAnnouncement({
      type,
      prayerName,
      settings: { ...settings, voiceTone: 'spiritual' }
    });
  }

  /**
   * Splits multi-sentence paragraphs into natural breath phrases to avoid robotic monotone drone
   */
  async _speakNaturalPhrases({ fullText, langCode, gender, toneId = 'energetic', baseRate = 1.0, volume = 0.95 }) {
    if (!fullText) return;

    // Split text by sentence boundaries (. ! ?) while keeping natural grouping
    const sentences = fullText
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const tone = TONE_PROFILES[toneId] || TONE_PROFILES.energetic;
    const finalRate = Math.min(1.4, Math.max(0.7, baseRate * tone.rateMultiplier));
    const finalPitch = gender === 'female' ? tone.femalePitch : tone.malePitch;

    const matchedVoice = this.findBestVoice(langCode, gender);

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];

      // Subtle dynamic inflection: opening sentences slightly brighter (+0.04), closing sentences deeper
      let pitchMod = finalPitch;
      if (i === 0 && toneId === 'energetic') pitchMod += 0.04;
      if (i === sentences.length - 1 && toneId === 'warm') pitchMod -= 0.02;

      await this._speakSingleUtterance({
        text: sentence,
        langCode,
        voice: matchedVoice,
        pitch: pitchMod,
        rate: finalRate,
        volume
      });

      // Natural micro-pause between sentences (120ms - 180ms)
      if (i < sentences.length - 1) {
        await new Promise(r => setTimeout(r, 140));
      }
    }
  }

  /**
   * Speak a single utterance promise wrapper
   */
  _speakSingleUtterance({ text, langCode, voice, pitch, rate, volume }) {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      if (voice) {
        utterance.voice = voice;
      }

      // Safety timer to prevent hang if browser utterance event doesn't fire
      const safetyTimer = setTimeout(() => {
        this.isSpeaking = false;
        resolve();
      }, Math.max(3500, text.length * 150));

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        clearTimeout(safetyTimer);
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = (err) => {
        clearTimeout(safetyTimer);
        console.warn('Speech synthesis utterance error', err);
        this.isSpeaking = false;
        resolve();
      };

      try {
        if (this.synth.paused) {
          this.synth.resume();
        }
        this.synth.speak(utterance);
      } catch (e) {
        clearTimeout(safetyTimer);
        console.error('synth.speak failed', e);
        resolve();
      }
    });
  }

  /**
   * Test utterance helper for admin with instant energetic preview
   */
  async testSpeech({ langId = 'sundanese', gender = 'alternate', toneId = 'energetic', sampleText = null }) {
    let genderToUse = gender;
    if (gender === 'alternate') {
      genderToUse = this.lastGenderUsed === 'male' ? 'female' : 'male';
      this.lastGenderUsed = genderToUse;
    }

    const text = sampleText || this.formatAnnouncement(langId, 'opening', {
      title: 'Robotika & Coding Seru',
      action: 'Simpen wadah proyék sareng tata matras',
      nextTitle: 'Praktek Robotika Terpadu',
      nextTime: '15:30',
      minutes: 10
    });

    let langCode = 'su-ID';
    if (langId === 'indonesian') langCode = 'id-ID';
    if (langId === 'english') langCode = 'en-US';
    if (langId === 'arabic') langCode = 'ar-SA';

    const enhanced = this.enhanceTextProsody(text, langCode);

    return this._speakNaturalPhrases({
      fullText: enhanced,
      langCode,
      gender: genderToUse,
      toneId,
      baseRate: 1.0,
      volume: 0.98
    });
  }
}

export const VoiceEngine = new VoiceEngineService();
