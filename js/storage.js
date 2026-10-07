/**
 * Buana Academy Studio Transition Engine - Storage Module
 * Manages LocalStorage persistence, seed data loading, cross-window syncing,
 * voice preset management with Activity Labels & Sundanese phonetic guidelines, and JSON backup utilities.
 */

export const STORAGE_KEY_SCHEDULE = 'buana_studio_schedule_v1';
export const STORAGE_KEY_SETTINGS = 'buana_studio_settings_v1';
export const STORAGE_KEY_PRAYERS = 'buana_studio_prayers_v1';
export const STORAGE_KEY_VOICE_PRESETS = 'buana_studio_voice_presets_v1';

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const PRAYER_EVENTS_META = [
  { id: 'subuh', name: 'Subuh (Fajr)', arabicName: 'الفجر', icon: '🌅', type: 'prayer', hasAdzan: true, defaultTime: '04:30' },
  { id: 'dzikirPagi', name: 'Dzikir Pagi', arabicName: 'أذكار الصباح', icon: '📖', type: 'dzikir', hasAdzan: false, defaultTime: '06:00' },
  { id: 'dhuha', name: 'Shalat Dhuha', arabicName: 'صلاة الضحى', icon: '☀️', type: 'sunnah', hasAdzan: false, defaultTime: '08:45' },
  { id: 'dzuhur', name: 'Dzuhur (Dhuhr)', arabicName: 'الظهر', icon: '☀️', type: 'prayer', hasAdzan: true, defaultTime: '12:00' },
  { id: 'ashar', name: 'Ashar (Asr)', arabicName: 'العصر', icon: '🌤️', type: 'prayer', hasAdzan: true, defaultTime: '15:15' },
  { id: 'dzikirPetang', name: 'Dzikir Petang', arabicName: 'أذكار المساء', icon: '📿', type: 'dzikir', hasAdzan: false, defaultTime: '16:00' },
  { id: 'maghrib', name: 'Maghrib (Sunset)', arabicName: 'المغرب', icon: '🌇', type: 'prayer', hasAdzan: true, defaultTime: '18:00' },
  { id: 'isya', name: 'Isya (Isha)', arabicName: 'العشاء', icon: '🌙', type: 'prayer', hasAdzan: true, defaultTime: '19:15' }
];

export const DEFAULT_PRAYER_SCHEDULE = {
  subuh: '04:30',
  dzikirPagi: '06:00',
  dhuha: '08:45',
  dzuhur: '12:00',
  ashar: '15:15',
  dzikirPetang: '16:00',
  maghrib: '18:00',
  isya: '19:15',
  prepareWarningMin: 10,
  adzanEnabled: true,
  dzikirEnabled: true,
  dhuhaReminderEnabled: true,
  prepareWarningEnabled: true
};

export const CATEGORIES = [
  { id: 'stem', name: 'STEM / Robotika 🤖', color: 'stem', badgeClass: 'badge-stem', borderClass: 'border-accent-stem' },
  { id: 'language', name: 'Bahasa 📚', color: 'purple', badgeClass: 'badge-language', borderClass: 'border-accent-language' },
  { id: 'martial', name: 'Bela Diri 🥋', color: 'rose', badgeClass: 'badge-martial', borderClass: 'border-accent-martial' },
  { id: 'sunnah', name: 'Olahraga Sunnah 🏹', color: 'emerald', badgeClass: 'badge-sunnah', borderClass: 'border-accent-sunnah' },
  { id: 'prayer', name: 'Shalat & Dzikir 🕌', color: 'emerald', badgeClass: 'badge-sunnah', borderClass: 'border-accent-sunnah' },
  { id: 'general', name: 'Kegiatan Umum 🎨', color: 'slate', badgeClass: 'badge-general', borderClass: 'border-accent-general' }
];

export const AUDIO_PRESETS = [
  { id: 'singing-bowl', name: 'Mangkuk Suara Tibet 🧘 (Dengung Halus)' },
  { id: 'deep-gong', name: 'Gong Perunggu 🔔 (Gema Mantap)' },
  { id: 'two-tone', name: 'Lonceng Dua Nada 🎵 (Ting-Tung Ceria)' },
  { id: 'zen-bell', name: 'Lonceng Zen Jernih ✨ (Fokus & Tenang)' },
  { id: 'adzan-call', name: 'Gema Adzan Ibadah 🕌 (Panggilan Shalat)' },
  { id: 'indonesia-raya', name: 'Lagu Indonesia Raya 🇮🇩 (Paduan Suara Web)' }
];

export const DEFAULT_SETTINGS = {
  masterVolume: 0.95,
  defaultWarningMin: 10,
  defaultChimePreset: 'singing-bowl',
  defaultEndChimePreset: 'deep-gong',
  voiceEnabled: true,
  voiceLanguage: 'sundanese',
  voiceGender: 'alternate',
  voiceTone: 'energetic',
  voiceRate: 0.95,
  voiceAnnounceWarning: true,
  voiceAnnounceEnd: true,
  voiceAnnounceOpening: true,
  // Indonesia Raya Mandatory Civic Routine Settings
  indonesiaRayaEnabled: true,
  indonesiaRayaTime: '10:00', // Configurable (e.g. 09:00 or 10:00)
  indonesiaRayaAudioMode: 'synth_acapella', // 'synth_acapella' | 'custom_url'
  indonesiaRayaCustomUrl: '',
  indonesiaRayaVoicePresetId: 'preset_id_anthem',
  indonesiaRayaAnnouncementEnabled: true
};

/**
 * Preset Activity Labels / Categories
 */
export const PRESET_LABELS = [
  { id: 'opening', name: 'Opening / Ngawitan Sési 🚀', icon: '🚀', color: 'cyan', desc: 'Starting a new class or workshop with high energy & motivation' },
  { id: 'closing', name: 'Closing / Réngsé Sési 🏁', icon: '🏁', color: 'emerald', desc: 'Concluding a session with appreciation & next steps' },
  { id: 'anthem', name: 'Lagu Kebangsaan Indonesia Raya 🇮🇩', icon: '🇮🇩', color: 'rose', desc: 'Mandatory standing call and Indonesia Raya anthem at 09:00/10:00 AM' },
  { id: 'sholat', name: 'Ajakan Shalat / Wudhu 🕌', icon: '🕌', color: 'emerald', desc: 'Pre-prayer wudhu notice & congregational shaf call' },
  { id: 'dzikir', name: 'Ajakan Dzikir 📿', icon: '📿', color: 'teal', desc: 'Morning & afternoon remembrance reminders' },
  { id: 'makan', name: 'Waktu Istirahat Makan 🍱', icon: '🍱', color: 'amber', desc: 'Lunch & meal break encouragement' },
  { id: 'qoilullah', name: 'Waktu Istirahat Qoilullah 🛌', icon: '🛌', color: 'indigo', desc: 'Pre-Dzuhur sunnah power rest' },
  { id: 'warning', name: 'Transisi / Wrap-up (T-10m) ⏳', icon: '⏳', color: 'orange', desc: '10-minute warning to pack bins & clean mats' },
  { id: 'custom', name: 'Kagiatan Anyar / Custom Activity ✨', icon: '✨', color: 'purple', desc: 'Custom studio announcements' }
];

/**
 * Preset Tone / Energy Profiles
 */
export const PRESET_TONES = [
  { id: 'energetic', name: 'Semangat & Berenergi ⚡', desc: 'Upbeat lively pitch and dynamic energetic tempo' },
  { id: 'warm', name: 'Ramah & Hangat 🌟', desc: 'Friendly, encouraging, clear studio cadence' },
  { id: 'spiritual', name: 'Khusyuk & Tenang 🕊️', desc: 'Peaceful, serene, relaxed contemplative tone' },
  { id: 'authoritative', name: 'Tegas & Jelas 📢', desc: 'Direct, clear, firm classroom guidance' }
];

/**
 * Multilingual Dialect, Pronunciation & Phrasing Guides
 * Provides language-specific rules, intonation tips, clickable quick phrases, and dynamic tokens for browser TTS.
 */
export const LANGUAGE_DIALECT_GUIDES = {
  sundanese: {
    id: 'sundanese',
    name: 'Sundanese (Basa Sunda 🌺)',
    flag: '🌺',
    title: 'Panduan Éjahan & Dialék Basa Sunda (TTS Sundanese Guide)',
    badgeText: 'Pituduh Sora Sunda',
    description: 'Supados sora TTS browser ngucapkeun basa Sunda kalayan lentong anu sumanget, natural, sareng logat anu merenah:',
    rules: [
      {
        label: 'é (e taling)',
        sound: 'Kawas dina kecap: lélé, saté, bérés',
        tip: 'Tulis: "sési", "bérés-bérés", "réngsé", "nyésa"'
      },
      {
        label: 'e (e pepet)',
        sound: 'Kawas dina kecap: bener, seger, lebet',
        tip: 'Tulis: "beres" (pepet), "lebet", "tempat"'
      },
      {
        label: 'eu (e curek)',
        sound: 'Kawas dina kecap: beureum, heula, sareng',
        tip: 'Tulis: "heula", "reureuh", "keur", "deui"'
      }
    ],
    vocabularySnippets: [
      { label: 'Sampurasun sadayana', text: 'Sampurasun sadayana wargi Buana!' },
      { label: 'Wilujeng sumping', text: 'Wilujeng sumping dina sési {title}!' },
      { label: 'Hayu urang kawitan', text: 'Hayu urang kawitan kalayan pinuh sumanget!' },
      { label: 'Simpen wadah proyék', text: 'simpen wadah proyék sareng pakakas' },
      { label: 'Tata deui matras', text: 'tata deui matras sareng sajadah' },
      { label: 'Nyesa {minutes} menit', text: 'nyesa {minutes} menit deui' },
      { label: 'Sési salajengna', text: 'Salajengna siapkeun kanggo sési {nextTitle} dina tabuh {nextTime}' },
      { label: 'Siap-siap wudhu', text: 'Mangga siap-siap wudhu kanggo shalat berjamaah' },
      { label: 'Parantos réngsé', text: 'Alhamdulillah, sési {title} parantos réngsé kalayan lungsur-langsar, hatur nuhun!' },
      { label: 'Istirahat tuang', text: 'Waktosna istirahat tuang siang, mangga raosan katuangan anu sehat' },
      { label: 'Istirahat qoilullah', text: 'Waktosna reureuh sakedap kanggo istirahat Qoilullah sateuacan Dzuhur' }
    ]
  },

  indonesian: {
    id: 'indonesian',
    name: 'Indonesian (Bahasa Indonesia 🇮🇩)',
    flag: '🇮🇩',
    title: 'Panduan Intonasi & Frasa Bahasa Indonesia (TTS Indonesian Guide)',
    badgeText: 'Panduan Vokal Indonesia',
    description: 'Gunakan tanda baca seru (!) untuk intonasi energik, tanda koma (,) untuk jeda pernapasan alami, dan hindari singkatan agar vokal terdengar jernih:',
    rules: [
      {
        label: 'Intonasi Energik (!)',
        sound: 'Gunakan tanda seru (!) di akhir kalimat pembuka/ajakan',
        tip: 'Contoh: "Mari kita mulai dengan semangat!"'
      },
      {
        label: 'Jeda Pernapasan (,)',
        sound: 'Gunakan tanda koma (,) untuk memberi jeda alami',
        tip: 'Contoh: "Perhatian semuanya, waktu tersisa 10 menit lagi."'
      },
      {
        label: 'Penulisan Baku',
        sound: 'Hindari singkatan (cth: tulis "menit", bukan "mnt")',
        tip: 'Tulis kata lengkap agar TTS melafalkan dengan fasih'
      }
    ],
    vocabularySnippets: [
      { label: 'Selamat datang semuanya', text: 'Selamat datang di Buana Academy! Mari kita mulai sesi {title} dengan penuh semangat!' },
      { label: 'Mulai eksperimen & fokus', text: 'Mari kita mulai eksplorasi dan eksperimen hari ini dengan fokus dan kolaborasi!' },
      { label: 'Peringatan T-10m', text: 'Perhatian semuanya! Waktu sesi {title} tersisa {minutes} menit lagi. Mari mulai merapikan perlengkapan: {action}!' },
      { label: 'Rapikan alat & matras', text: 'simpan kembali boks proyek dan rapikan matras latihan' },
      { label: 'Persiapan sesi berikutnya', text: 'Selanjutnya persiapkan ruangan untuk sesi {nextTitle} pada pukul {nextTime}' },
      { label: 'Ajakan Shalat & Wudhu', text: 'Waktu shalat {prayerName} telah tiba. Mari persiapkan wudhu dan luruskan shaf berjamaah.' },
      { label: 'Ajakan Dzikir Pagi', text: 'Selamat pagi! Mari sejenak membaca Dzikir Pagi untuk mengawali hari dengan keberkahan dan ketenangan.' },
      { label: 'Ajakan Dzikir Petang', text: 'Ba\'da shalat Ashar, mari kita luangkan waktu membaca Dzikir Petang bersama.' },
      { label: 'Pengingat Shalat Dhuha', text: 'Pengingat Shalat Dhuha: Luangkan sejenak untuk berwudhu dan melaksanakan shalat sunnah Dhuha.' },
      { label: 'Istirahat Makan Siang', text: 'Waktu istirahat makan siang telah tiba! Selamat menikmati santapan sehat dan jangan lupa berdoa.' },
      { label: 'Istirahat Qoilullah', text: 'Waktunya istirahat sejenak untuk Qoilullah sebelum waktu Dzuhur guna menyegarkan kembali tubuh dan pikiran.' },
      { label: 'Sesi Selesai (Penutupan)', text: 'Alhamdulillah, sesi {title} telah selesai dengan lancar. Terima kasih atas kerja keras semuanya!' }
    ]
  },

  english: {
    id: 'english',
    name: 'English (International 🇬🇧)',
    flag: '🇬🇧',
    title: 'English Pronunciation & Dynamic Phrasing Guide',
    badgeText: 'English Phrasing Tips',
    description: 'Craft dynamic, upbeat studio announcements using expressive punctuation and rhythmic breath pauses:',
    rules: [
      {
        label: 'Upbeat Kickoff (!)',
        sound: 'Use exclamation marks to elevate energy in kickoff announcements',
        tip: 'Example: "Let\'s collaborate and build amazing projects today!"'
      },
      {
        label: 'Pacing & Commas (,)',
        sound: 'Insert commas before instructions for natural rhythm',
        tip: 'Example: "Attention studio, ten minutes remaining in {title}."'
      },
      {
        label: 'Dynamic Variables',
        sound: 'Use placeholders like {title}, {action}, {nextTitle}',
        tip: 'Variables auto-fill from the active studio schedule'
      }
    ],
    vocabularySnippets: [
      { label: 'Welcome & Kickoff', text: 'Welcome everyone to Buana Academy! Let\'s kick off the {title} session with great energy and creativity!' },
      { label: 'Martial Dojo Kickoff', text: 'Attention athletes! The {title} session is now starting. Form up, focus your minds, and give your maximum effort!' },
      { label: 'T-10m Wrap-up Warning', text: 'Attention Buana Academy studio! Ten minutes remaining in the {title} session. Please begin wrap-up: {action}!' },
      { label: 'Store Bins & Clean Space', text: 'pack your project bins and sanitize your workstations' },
      { label: 'Next Session Prep', text: 'Prepare the studio space for {nextTitle} starting at {nextTime}' },
      { label: 'Congregational Prayer', text: 'Time for {prayerName} prayer. Please prepare for wudhu and line up for congregational prayer.' },
      { label: 'Morning Remembrance', text: 'Good morning! Time for Morning Remembrance, Dzikir Pagi, to begin our day with tranquility and blessings.' },
      { label: 'Evening Dhikr', text: 'Time for Evening Dhikr and mindful reflection following the Ashar prayer.' },
      { label: 'Dhuha Reminder', text: 'Dhuha Prayer Reminder: Take a brief pause to perform wudhu and observe the blessed Dhuha prayer.' },
      { label: 'Lunch Break Time', text: 'It is now lunch and meal break time at Buana Academy! Enjoy your meal, hydrate, and recharge.' },
      { label: 'Qoilullah Sunnah Rest', text: 'Time for a brief midday Qoilullah rest before Dhuhr prayer. Relax, recharge, and restore your focus.' },
      { label: 'Session Concluded', text: 'Alhamdulillah, the {title} session has now concluded. Thank you everyone for your dedication and great progress!' }
    ]
  },

  arabic: {
    id: 'arabic',
    name: 'Arabic (العربية 🇸🇦)',
    flag: '🇸🇦',
    title: 'دليل النطق والعبارات باللغة العربية الفصحى (Arabic Speech Guide)',
    badgeText: 'إرشادات النطق العربي',
    description: 'توجيهات لصياغة إعلانات باللغة العربية الفصحى مع التشكيل المناسب لضمان نطق فصيح وواضح عبر محرك الصوت:',
    rules: [
      {
        label: 'الفصاحة والتشكيل',
        sound: 'استخدم جملاً واضحة بفواصل مناسبة',
        tip: 'مثال: "أهلاً وسهلاً بكم في أكاديمية بوانا!"'
      },
      {
        label: 'نبرة النشاط والهمة',
        sound: 'استخدم علامات التعجب في بداية الجلسات لتحفيز الطلاب',
        tip: 'مثال: "لنبدأ جلستنا بكل همة ونشاط!"'
      },
      {
        label: 'الهدوء في العبادات',
        sound: 'استخدم نبرة خاشعة ومريحة في أوقات الصلاة والأذكار',
        tip: 'مثال: "هلموا إلى الوضوء وصلاة الجماعة المباركة."'
      }
    ],
    vocabularySnippets: [
      { label: 'بداية الجلسة والحماس', text: 'أهلاً وسهلاً بكم جميعاً في أكاديمية بوانا! فلنبدأ جلسة {title} بكل حماس ونشاط وتعاون!' },
      { label: 'بداية تدريب الدفاع عن النفس', text: 'تحية لأبطال دوجانج بوانا! بدأت الآن جلسة {title}، فلنستعد ونلتزم بأعلى درجات الانضباط!' },
      { label: 'تنبيه الترتيب (١٠ دقائق)', text: 'تنبيه لجميع أعضاء الاستوديو: بقي {minutes} دقائق على نهاية جلسة {title}. يرجى البدء في الترتيب: {action}!' },
      { label: 'ترتيب الأدوات والبساط', text: 'ترتيب صناديق المشاريع وتنظيف بساط التدريب' },
      { label: 'الاستعداد للجلسة القادمة', text: 'يرجى تجهيز المكان للجلسة القادمة {nextTitle} في تمام الساعة {nextTime}' },
      { label: 'دعوة الصلاة والوضوء', text: 'حان موعد أذان وصلاة {prayerName}. هلموا إلى الوضوء وتسوية الصفوف لصلاة الجماعة المباركة.' },
      { label: 'أذكار الصباح المباركة', text: 'صباح الخير والبركة. حان الآن وقت أذكار الصباح لبدء يومنا بالسكينة والتوفيق.' },
      { label: 'أذكار المساء', text: 'بعد صلاة العصر، هلموا معاً لقراءة أذكار المساء لحفظ النفس والبركة.' },
      { label: 'تذكير بصلاة الضحى', text: 'تذكير بصلاة الضحى: يرجى أخذ استراحة قصيرة للوضوء وأداء صلاة الضحى المباركة.' },
      { label: 'استراحة الغداء', text: 'حان الآن وقت استراحة تناول الطعام والغداء. بالهناء والشفاء للجميع، وتذكروا التسمية!' },
      { label: 'سنة القيلولة المباركة', text: 'حان الآن وقت القيلولة والاستراحة القصيرة قبل صلاة الظهر لتجديد النشاط والهمة.' },
      { label: 'اختتام الجلسة بنجاح', text: 'الحمد لله، انتهت جلسة {title} بنجاح وتوفيق. شكراً لجهودكم جميعاً، ونلتقي في النشاط القادم {nextTitle}!' }
    ]
  }
};

/**
 * Universal Dynamic Tokens shared across all languages
 */
export const UNIVERSAL_DYNAMIC_TOKENS = [
  { token: '{title}', desc: 'Nama Kelas / Pelajaran' },
  { token: '{action}', desc: 'Instruksi Beres-Beres' },
  { token: '{minutes}', desc: 'Sisa Waktu Menit (Contoh: 10)' },
  { token: '{nextTitle}', desc: 'Nama Kelas Selanjutnya' },
  { token: '{nextTime}', desc: 'Jam Kelas Selanjutnya' },
  { token: '{prayerName}', desc: 'Nama Shalat (Contoh: Ashar)' }
];

export const SUNDANESE_DIALECT_GUIDE = LANGUAGE_DIALECT_GUIDES.sundanese;

/**
 * Factory Seed Voice Presets categorized by Activity Label across ALL languages:
 * Sundanese (🌺), Indonesian (🇮🇩), English (🇬🇧), and Arabic (🇸🇦)
 */
export const FACTORY_VOICE_PRESETS = [
  // ==========================================
  // 1. OPENING / NGAWITAN SESI (Energetic Kickoff)
  // ==========================================
  {
    id: 'preset_su_opening_stem',
    name: 'Sundanese: Ngawitan Sési Robotics (Semangat)',
    label: 'opening',
    tone: 'energetic',
    language: 'sundanese',
    gender: 'female',
    text: "Sampurasun wargi Buana Academy! Wilujeng sumping dina sési {title}! Hayu urang kawitan ékspérimén dinten ieu kalayan pinuh sumanget, kréativitas, sareng fokus!"
  },
  {
    id: 'preset_su_opening_martial',
    name: 'Sundanese: Ngawitan Latihan Beladiri (Semangat)',
    label: 'opening',
    tone: 'energetic',
    language: 'sundanese',
    gender: 'male',
    text: "Sampurasun para ksatria Buana Dojang! Sési {title} parantos dikawitan. Hayu pasang kuda-kuda, siapkeun raga, sareng laksanakeun latihan kalayan disiplin luhur!"
  },
  {
    id: 'preset_id_opening_stem',
    name: 'Indonesian: Pembukaan Sesi Robotika & Sains (Semangat)',
    label: 'opening',
    tone: 'energetic',
    language: 'indonesian',
    gender: 'female',
    text: "Selamat datang di Buana Academy! Sesi {title} telah resmi dimulai. Mari kita bereksplorasi, merakit, dan berinovasi dengan penuh semangat dan kolaborasi!"
  },
  {
    id: 'preset_id_opening_martial',
    name: 'Indonesian: Pembukaan Latihan Bela Diri (Semangat)',
    label: 'opening',
    tone: 'energetic',
    language: 'indonesian',
    gender: 'male',
    text: "Perhatian seluruh ksatria Buana Dojang! Sesi {title} telah dimulai. Pasang kuda-kuda, fokuskan pikiran, dan mari berlatih dengan disiplin serta kehormatan!"
  },
  {
    id: 'preset_en_opening',
    name: 'English: Session Kickoff & Motivation',
    label: 'opening',
    tone: 'energetic',
    language: 'english',
    gender: 'female',
    text: "Welcome everyone to the {title} session at Buana Academy! Let's get energized, collaborate, and make extraordinary progress together today!"
  },
  {
    id: 'preset_ar_opening',
    name: 'Arabic: افتتاح وبدء الجلسة بنشاط',
    label: 'opening',
    tone: 'energetic',
    language: 'arabic',
    gender: 'female',
    text: "أهلاً وسهلاً بكم جميعاً في جلسة {title} في أكاديمية بوانا! فلنبدأ يومنا بكل حماس ونشاط وتعاون مثمر!"
  },

  // ==========================================
  // 2. CLOSING / RENGSE SESI (Warm Appreciation)
  // ==========================================
  {
    id: 'preset_su_closing',
    name: 'Sundanese: Réngsé Sési & Hatur Nuhun',
    label: 'closing',
    tone: 'warm',
    language: 'sundanese',
    gender: 'female',
    text: "Alhamdulillah, sési {title} parantos réngsé kalayan lungsur-langsar. Hatur nuhun kasadayana wargi anu parantos kerja keras dinten ieu! Mangga siap-siap kanggo sési salajengna, {nextTitle}."
  },
  {
    id: 'preset_id_closing',
    name: 'Indonesian: Penutupan Sesi & Apresiasi',
    label: 'closing',
    tone: 'warm',
    language: 'indonesian',
    gender: 'female',
    text: "Alhamdulillah, sesi {title} telah selesai dengan sangat baik. Terima kasih atas kerja keras, fokus, dan dedikasi semuanya! Silakan bersiap untuk sesi selanjutnya, {nextTitle}."
  },
  {
    id: 'preset_en_closing',
    name: 'English: Concluded Session Wrap-up',
    label: 'closing',
    tone: 'warm',
    language: 'english',
    gender: 'male',
    text: "Great work everyone! The {title} session has now concluded. Thank you for your wonderful focus and collaboration. Please prepare for our next activity, {nextTitle}."
  },
  {
    id: 'preset_ar_closing',
    name: 'Arabic: ختام الجلسة وشكر المشاركين',
    label: 'closing',
    tone: 'warm',
    language: 'arabic',
    gender: 'male',
    text: "الحمد لله، انتهت جلسة {title} بنجاح وتميز. شكراً لجهودكم وتفاعلكم الرائع، ويرجى الاستعداد للجلسة القادمة {nextTitle}."
  },

  // ==========================================
  // 3. AJAKAN SHALAT & WUDHU (Spiritual Preparation)
  // ==========================================
  {
    id: 'preset_su_sholat_prepare',
    name: 'Sundanese: Ajakan Wudhu & Persiapan Shalat',
    label: 'sholat',
    tone: 'spiritual',
    language: 'sundanese',
    gender: 'male',
    text: "Parantos caket waktos shalat {prayerName}. Hayu wargi sadaya siap-siap wudhu, beberes tempat, sareng tata sajadah kanggo shalat berjamaah."
  },
  {
    id: 'preset_su_adzan',
    name: 'Sundanese: Adzan Call to Prayer',
    label: 'sholat',
    tone: 'spiritual',
    language: 'sundanese',
    gender: 'male',
    text: "Waktos adzan {prayerName} parantos sumping. Hayu urang sami-sami ngalaksanakeun shalat berjamaah sareng lempengkeun shaf."
  },
  {
    id: 'preset_id_sholat_prepare',
    name: 'Indonesian: Ajakan Wudhu & Persiapan Shalat',
    label: 'sholat',
    tone: 'spiritual',
    language: 'indonesian',
    gender: 'male',
    text: "Waktu shalat {prayerName} segera tiba. Mari bersama-sama mengambil wudhu, merapikan ruangan, dan menata saf untuk shalat berjamaah."
  },
  {
    id: 'preset_id_adzan',
    name: 'Indonesian: Panggilan Shalat & Luruskan Saf',
    label: 'sholat',
    tone: 'spiritual',
    language: 'indonesian',
    gender: 'male',
    text: "Panggilan shalat {prayerName} telah berkumandang. Mari kita segera berkumpul, meluruskan saf, dan mendirikan shalat secara berjamaah."
  },
  {
    id: 'preset_en_sholat',
    name: 'English: Call to Prayer & Congregational Rows',
    label: 'sholat',
    tone: 'spiritual',
    language: 'english',
    gender: 'male',
    text: "Approaching {prayerName} prayer time. Please pause your activities, perform wudhu, and arrange the studio space for congregational prayer."
  },
  {
    id: 'preset_ar_sholat',
    name: 'Arabic: النداء إلى الصلاة وتسوية الصفوف',
    label: 'sholat',
    tone: 'spiritual',
    language: 'arabic',
    gender: 'male',
    text: "اقترب موعد صلاة {prayerName}. هلموا إلى الوضوء وإقامة الصلاة وتسوية الصفوف لصلاة الجماعة المباركة."
  },

  // ==========================================
  // 4. AJAKAN DZIKIR (Pagi, Petang & Dhuha)
  // ==========================================
  {
    id: 'preset_su_dzikir_pagi',
    name: 'Sundanese: Dzikir Pagi Morning',
    label: 'dzikir',
    tone: 'spiritual',
    language: 'sundanese',
    gender: 'female',
    text: "Wilujeng enjing wargi Buana Academy! Hayu urang sasarengan maos Dzikir Pagi supados dinten ieu pinuh ku katengtraman, panangtayungan, sareng kaberkahan."
  },
  {
    id: 'preset_su_dzikir_petang',
    name: 'Sundanese: Dzikir Petang Afternoon',
    label: 'dzikir',
    tone: 'spiritual',
    language: 'sundanese',
    gender: 'female',
    text: "Ba'da shalat Ashar, hayu urang sami-sami maos Dzikir Petang kanggo ngaraksa manah sareng ngalap kaberkahan sonten ieu."
  },
  {
    id: 'preset_su_dhuha',
    name: 'Sundanese: Pangemut Shalat Dhuha',
    label: 'dzikir',
    tone: 'spiritual',
    language: 'sundanese',
    gender: 'female',
    text: "Pangemut Shalat Sunnah Dhuha: Mangga nyempetkeun wudhu sakedap sareng ngalaksanakeun shalat Dhuha kanggo nyuhunkeun kaberkahan rejeki."
  },
  {
    id: 'preset_id_dzikir_pagi',
    name: 'Indonesian: Ajakan Dzikir Pagi Pembuka Hari',
    label: 'dzikir',
    tone: 'spiritual',
    language: 'indonesian',
    gender: 'female',
    text: "Selamat pagi rekan-rekan Buana Academy. Mari kita luangkan waktu sejenak untuk membaca Dzikir Pagi agar hari kita senantiasa dalam perlindungan dan keberkahan Allah."
  },
  {
    id: 'preset_id_dzikir_petang',
    name: 'Indonesian: Ajakan Dzikir Petang Ba\'da Ashar',
    label: 'dzikir',
    tone: 'spiritual',
    language: 'indonesian',
    gender: 'female',
    text: "Selepas shalat Ashar, mari bersama-sama membaca Dzikir Petang untuk menenangkan hati dan memohon penjagaan di penghujung hari."
  },
  {
    id: 'preset_id_dhuha',
    name: 'Indonesian: Pengingat Shalat Sunnah Dhuha',
    label: 'dzikir',
    tone: 'spiritual',
    language: 'indonesian',
    gender: 'female',
    text: "Pengingat Shalat Sunnah Dhuha: Mari sempatkan berwudhu dan menunaikan shalat Dhuha sebagai rasa syukur dan pembuka pintu rezeki berkah."
  },
  {
    id: 'preset_en_dzikir',
    name: 'English: Morning & Evening Remembrance',
    label: 'dzikir',
    tone: 'spiritual',
    language: 'english',
    gender: 'female',
    text: "Time for Dzikir and mindful reflection at Buana Academy. Let us pause to remember our Creator, cultivate peace of mind, and seek divine blessings."
  },
  {
    id: 'preset_ar_dzikir',
    name: 'Arabic: أذكار الصباح والمساء والضحى',
    label: 'dzikir',
    tone: 'spiritual',
    language: 'arabic',
    gender: 'female',
    text: "حان الآن وقت أذكار الصباح والمساء المباركة. فلنلجأ إلى ذكر الله تطميناً للقلوب وتحصيناً للأنفس."
  },

  // ==========================================
  // 5. WAKTU ISTIRAHAT MAKAN (Meal / Lunch Break)
  // ==========================================
  {
    id: 'preset_su_makan',
    name: 'Sundanese: Waktos Istirahat Tuang (Meal Break)',
    label: 'makan',
    tone: 'warm',
    language: 'sundanese',
    gender: 'female',
    text: "Waktosna istirahat tuang siang parantos sumping! Mangga raosan katuangan anu sehat, seueurkeun ngaleueut cai herang, sareng ulah hilap ngawitan ku ngaos Bismillah."
  },
  {
    id: 'preset_id_makan',
    name: 'Indonesian: Waktu Istirahat Makan Siang Sehat',
    label: 'makan',
    tone: 'warm',
    language: 'indonesian',
    gender: 'female',
    text: "Waktu istirahat makan siang telah tiba! Selamat menikmati santapan yang sehat dan bergizi, perbanyak minum air putih, dan jangan lupa mengawali dengan bismillah."
  },
  {
    id: 'preset_en_makan',
    name: 'English: Lunch & Nourishment Break',
    label: 'makan',
    tone: 'warm',
    language: 'english',
    gender: 'female',
    text: "It is now lunch and meal break time at Buana Academy! Please enjoy your meal, stay hydrated, and take time to recharge your energy."
  },
  {
    id: 'preset_ar_makan',
    name: 'Arabic: وقت استراحة الغداء وتناول الطعام',
    label: 'makan',
    tone: 'warm',
    language: 'arabic',
    gender: 'female',
    text: "حان الآن وقت استراحة تناول طعام الغداء في أكاديمية بوانا. هنيئاً مريئاً للجميع، وبارك الله في طعامكم وشرابكم."
  },

  // ==========================================
  // 6. WAKTU ISTIRAHAT QOILULLAH (Midday Sunnah Rest)
  // ==========================================
  {
    id: 'preset_su_qoilullah',
    name: 'Sundanese: Istirahat Qoilullah (Sunnah Tidur Siang)',
    label: 'qoilullah',
    tone: 'spiritual',
    language: 'sundanese',
    gender: 'male',
    text: "Waktosna reureuh sakedap kanggo istirahat Qoilullah sateuacan lebet waktos Dzuhur. Mangga ngareureuhkeun raga supados seger deui nalika ibadah sareng diajar."
  },
  {
    id: 'preset_id_qoilullah',
    name: 'Indonesian: Istirahat Sunnah Qoilullah Sebelum Dzuhur',
    label: 'qoilullah',
    tone: 'spiritual',
    language: 'indonesian',
    gender: 'male',
    text: "Saatnya beristirahat sejenak untuk menunaikan sunnah Qoilullah sebelum waktu Dzuhur. Istirahatkan tubuh dan pikiran agar segar kembali untuk beribadah dan berkarya."
  },
  {
    id: 'preset_en_qoilullah',
    name: 'English: Midday Qoilullah Power Rest',
    label: 'qoilullah',
    tone: 'spiritual',
    language: 'english',
    gender: 'male',
    text: "Time for a brief midday Qoilullah rest before Dhuhr prayer. Take a moment to relax, recharge your body, and restore your clarity and focus."
  },
  {
    id: 'preset_ar_qoilullah',
    name: 'Arabic: سنة القيلولة المباركة قبل الظهر',
    label: 'qoilullah',
    tone: 'spiritual',
    language: 'arabic',
    gender: 'male',
    text: "حان الآن وقت سنة القيلولة والاستراحة المباركة قبل أذان الظهر، لتجديد النشاط والراحة للجسم والذهن."
  },

  // ==========================================
  // 7. TRANSISI / WRAP-UP (T-10m Warning)
  // ==========================================
  {
    id: 'preset_su_robotics',
    name: 'Sundanese: Robotics & Makerspace Wrap-up',
    label: 'warning',
    tone: 'energetic',
    language: 'sundanese',
    gender: 'female',
    text: "Perhatosan wargi Buana Academy! Waktos sési {title} nyesa {minutes} menit deui. Hayu mimiti bérés-bérés: simpen wadah proyék sareng tata deui pakakas! Salajengna siapkeun rohangan kanggo sési {nextTitle} dina tabuh {nextTime}."
  },
  {
    id: 'preset_su_martial',
    name: 'Sundanese: Martial Arts & Mat Transition',
    label: 'warning',
    tone: 'energetic',
    language: 'sundanese',
    gender: 'male',
    text: "Perhatosan wargi Buana Dojang! Waktos sési {title} nyesa {minutes} menit deui. Hayu urang réngsékeun latihan, béreskeun matras sareng alat pelindung! Siapkeun rohangan kanggo sési {nextTitle} dina tabuh {nextTime}."
  },
  {
    id: 'preset_id_robotics',
    name: 'Indonesian: Transisi Robotika & Bersihkan Ruang (T-10m)',
    label: 'warning',
    tone: 'energetic',
    language: 'indonesian',
    gender: 'female',
    text: "Perhatian studio Buana Academy! Waktu sesi {title} tersisa {minutes} menit lagi. Silakan mulai merapikan: {action}! Selanjutnya persiapkan ruangan untuk sesi {nextTitle} pada pukul {nextTime}."
  },
  {
    id: 'preset_id_martial',
    name: 'Indonesian: Transisi Bela Diri & Matras (T-10m)',
    label: 'warning',
    tone: 'energetic',
    language: 'indonesian',
    gender: 'male',
    text: "Perhatian ksatria Buana Dojang! Waktu sesi {title} tersisa {minutes} menit lagi. Mari rapikan matras latihan dan simpan alat pelindung. Persiapkan ruangan untuk sesi {nextTitle} pukul {nextTime}."
  },
  {
    id: 'preset_en_warning',
    name: 'English: Studio Wrap-up (T-10m)',
    label: 'warning',
    tone: 'energetic',
    language: 'english',
    gender: 'female',
    text: "Attention Buana Academy studio! Ten minutes remaining in the {title} session. Please begin wrap-up: {action}! Next up, prepare the space for {nextTitle} starting at {nextTime}."
  },
  {
    id: 'preset_ar_warning',
    name: 'Arabic: تنبيه الترتيب والتجهيز (١٠ دقائق)',
    label: 'warning',
    tone: 'energetic',
    language: 'arabic',
    gender: 'female',
    text: "تنبيه لجميع أعضاء استوديو بوانا: تبقى {minutes} دقائق على نهاية جلسة {title}. يرجى البدء في الترتيب: {action}، والتجهيز للجلسة القادمة {nextTitle} في تمام الساعة {nextTime}."
  },

  // ==========================================
  // 8. CUSTOM ACTIVITY & GENERAL ANNOUNCEMENTS
  // ==========================================
  {
    id: 'preset_su_custom_announcement',
    name: 'Sundanese: Béwara Kagiatan Anyar',
    label: 'custom',
    tone: 'authoritative',
    language: 'sundanese',
    gender: 'male',
    text: "Perhatosan kasadayana wargi Buana Academy! Aya béwara penting ngeunaan kagiatan studio. Mangga regepkeun sareng sayagikeun kaperluan masing-masing."
  },
  {
    id: 'preset_id_custom_announcement',
    name: 'Indonesian: Pengumuman Khusus Studio',
    label: 'custom',
    tone: 'authoritative',
    language: 'indonesian',
    gender: 'male',
    text: "Perhatian seluruh rekan Buana Academy! Berikut adalah pengumuman penting terkait kegiatan studio kita. Mohon disimak dengan seksama dan dipersiapkan sebaik-baiknya."
  },
  {
    id: 'preset_en_custom_announcement',
    name: 'English: Studio Special Announcement',
    label: 'custom',
    tone: 'authoritative',
    language: 'english',
    gender: 'female',
    text: "Attention everyone at Buana Academy! We have an important studio announcement. Please give your attention and prepare accordingly."
  },
  {
    id: 'preset_ar_custom_announcement',
    name: 'Arabic: إعلان خاص بالاستوديو والأنشطة',
    label: 'custom',
    tone: 'authoritative',
    language: 'arabic',
    gender: 'male',
    text: "تنبيه لجميع الحاضرين في أكاديمية بوانا! إليكم إعلاناً مهماً بخصوص أنشطة الاستوديو، يرجى الانتباه وحسن الاستعداد."
  },

  // ==========================================
  // 9. LAGU KEBANGSAAN INDONESIA RAYA (Sikap Sempurna)
  // ==========================================
  {
    id: 'preset_id_anthem',
    name: 'Indonesian: Ajakan Berdiri Lagu Kebangsaan Indonesia Raya',
    label: 'anthem',
    tone: 'authoritative',
    language: 'indonesian',
    gender: 'female',
    text: "Perhatian kepada seluruh hadirin dan civitas Buana Academy. Tepat pada pukul {nextTime}, dimohon berdiri tegak dengan sikap sempurna dan khidmat untuk mendengarkan serta menyanyikan bersama Lagu Kebangsaan Indonesia Raya."
  },
  {
    id: 'preset_su_anthem',
    name: 'Sundanese: Ngadeg Sikep Sampurna Indonesia Raya',
    label: 'anthem',
    tone: 'authoritative',
    language: 'sundanese',
    gender: 'male',
    text: "Perhatosan kasadayana wargi Buana Academy. Dina tabuh {nextTime}, mangga sadayana ngadeg kalayan sikep sampurna tur khusyuk kanggo ngaregepkeun sareng ngawihkeun Lagu Kabangsaan Indonesia Raya."
  },
  {
    id: 'preset_en_anthem',
    name: 'English: National Anthem Indonesia Raya Standing Call',
    label: 'anthem',
    tone: 'authoritative',
    language: 'english',
    gender: 'female',
    text: "Attention everyone at Buana Academy. At {nextTime}, please stand upright in respectful attention to listen and sing together our National Anthem, Indonesia Raya."
  },
  {
    id: 'preset_ar_anthem',
    name: 'Arabic: النداء للوقوف احتراما للنشيد الوطني',
    label: 'anthem',
    tone: 'authoritative',
    language: 'arabic',
    gender: 'male',
    text: "تنبيه لجميع الحاضرين في أكاديمية بوانا. في تمام الساعة {nextTime}، يرجى الوقوف بكل احترام وسكون للاستماع والإنشاد للنشيد الوطني الإندونيسي (إندونيسيا رايا)."
  }
];

/**
 * Standard factory seed schedule per specifications
 */
export const FACTORY_SEED_SCHEDULE = [
  // Monday
  {
    id: 'slot_mon_1',
    day: 'Monday',
    startTime: '13:30',
    endTime: '15:30',
    title: 'Open Robotic Lab',
    category: 'STEM / Robotics',
    instructor: 'Robotics Team',
    location: 'Studio A (Makerspace)',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Store Project Bins • Prepare Mats',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_stem',
    voicePresetId: 'preset_su_robotics',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_mon_2',
    day: 'Monday',
    startTime: '15:30',
    endTime: '17:00',
    title: 'Guided Robotics',
    category: 'STEM / Robotics',
    instructor: 'Coach Faris',
    location: 'Studio A (Makerspace)',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Disassemble Prototypes • Return Toolboxes',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_stem',
    voicePresetId: 'preset_su_robotics',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_mon_3',
    day: 'Monday',
    startTime: '17:30',
    endTime: '19:00',
    title: 'Taekwondo / Archery',
    category: 'Martial Arts',
    instructor: 'Master Han & Coach Ilham',
    location: 'Dojang & Range',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Bow Out • Sanitize Gear • Pack Quivers',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_mon_4',
    day: 'Monday',
    startTime: '19:30',
    endTime: '21:00',
    title: 'Adult BJJ',
    category: 'Martial Arts',
    instructor: 'Professor Alex',
    location: 'Main Tatami',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Final Sparring Round • Mat Cool Down',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },

  // Tuesday
  {
    id: 'slot_tue_1',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '11:30',
    title: 'TOAFL Track',
    category: 'Language',
    instructor: 'Ust. Ahmad',
    location: 'Language Suite',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Submit Practice Sheets • Pack Headsets',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_en_opening',
    voicePresetId: 'preset_ar_sholat',
    endVoicePresetId: 'preset_en_closing'
  },
  {
    id: 'slot_tue_2',
    day: 'Tuesday',
    startTime: '13:30',
    endTime: '15:30',
    title: 'TOEFL Intensive',
    category: 'Language',
    instructor: 'Ms. Sarah',
    location: 'Language Suite',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Finish Listening Module • Log Out',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_en_opening',
    voicePresetId: 'preset_en_warning',
    endVoicePresetId: 'preset_en_closing'
  },
  {
    id: 'slot_tue_3',
    day: 'Tuesday',
    startTime: '17:30',
    endTime: '19:00',
    title: 'Capoeira',
    category: 'Martial Arts',
    instructor: 'Instrutor Rafael',
    location: 'Main Studio',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Final Roda • Cool Down & Stretching',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_tue_4',
    day: 'Tuesday',
    startTime: '19:30',
    endTime: '21:00',
    title: 'Adult Aikido',
    category: 'Martial Arts',
    instructor: 'Sensei Kenji',
    location: 'Main Tatami',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Mokuso & Bow • Wipe Down Mats',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },

  // Wednesday
  {
    id: 'slot_wed_1',
    day: 'Wednesday',
    startTime: '13:30',
    endTime: '15:30',
    title: 'Open Robotic Lab',
    category: 'STEM / Robotics',
    instructor: 'Robotics Team',
    location: 'Studio A (Makerspace)',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Store Project Bins • Prepare Mats',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_stem',
    voicePresetId: 'preset_su_robotics',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_wed_2',
    day: 'Wednesday',
    startTime: '15:30',
    endTime: '17:00',
    title: 'Guided Robotics',
    category: 'STEM / Robotics',
    instructor: 'Coach Faris',
    location: 'Studio A (Makerspace)',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Disassemble Prototypes • Return Toolboxes',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_stem',
    voicePresetId: 'preset_su_robotics',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_wed_3',
    day: 'Wednesday',
    startTime: '17:30',
    endTime: '19:00',
    title: 'Taekwondo / Archery',
    category: 'Martial Arts',
    instructor: 'Master Han & Coach Ilham',
    location: 'Dojang & Range',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Bow Out • Sanitize Gear • Pack Quivers',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_wed_4',
    day: 'Wednesday',
    startTime: '19:30',
    endTime: '21:00',
    title: 'Adult BJJ',
    category: 'Martial Arts',
    instructor: 'Professor Alex',
    location: 'Main Tatami',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Final Sparring Round • Mat Cool Down',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },

  // Thursday
  {
    id: 'slot_thu_1',
    day: 'Thursday',
    startTime: '09:00',
    endTime: '11:30',
    title: 'TOAFL Track',
    category: 'Language',
    instructor: 'Ust. Ahmad',
    location: 'Language Suite',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Submit Practice Sheets • Pack Headsets',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_en_opening',
    voicePresetId: 'preset_ar_sholat',
    endVoicePresetId: 'preset_en_closing'
  },
  {
    id: 'slot_thu_2',
    day: 'Thursday',
    startTime: '13:30',
    endTime: '15:30',
    title: 'TOEFL Intensive',
    category: 'Language',
    instructor: 'Ms. Sarah',
    location: 'Language Suite',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Finish Listening Module • Log Out',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_en_opening',
    voicePresetId: 'preset_en_warning',
    endVoicePresetId: 'preset_en_closing'
  },
  {
    id: 'slot_thu_3',
    day: 'Thursday',
    startTime: '17:30',
    endTime: '19:00',
    title: 'Capoeira',
    category: 'Martial Arts',
    instructor: 'Instrutor Rafael',
    location: 'Main Studio',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Final Roda • Cool Down & Stretching',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_thu_4',
    day: 'Thursday',
    startTime: '19:30',
    endTime: '21:00',
    title: 'Adult Aikido',
    category: 'Martial Arts',
    instructor: 'Sensei Kenji',
    location: 'Main Tatami',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Mokuso & Bow • Wipe Down Mats',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },

  // Friday
  {
    id: 'slot_fri_1',
    day: 'Friday',
    startTime: '13:30',
    endTime: '15:30',
    title: 'Open Robotic Lab',
    category: 'STEM / Robotics',
    instructor: 'Robotics Team',
    location: 'Studio A (Makerspace)',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Store Project Bins • Prepare Mats',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_stem',
    voicePresetId: 'preset_su_robotics',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_fri_2',
    day: 'Friday',
    startTime: '15:30',
    endTime: '17:00',
    title: 'Guided Robotics',
    category: 'STEM / Robotics',
    instructor: 'Coach Faris',
    location: 'Studio A (Makerspace)',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Disassemble Prototypes • Return Toolboxes',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_stem',
    voicePresetId: 'preset_su_robotics',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_fri_3',
    day: 'Friday',
    startTime: '17:30',
    endTime: '19:00',
    title: 'Taekwondo / Archery',
    category: 'Martial Arts',
    instructor: 'Master Han & Coach Ilham',
    location: 'Dojang & Range',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Bow Out • Sanitize Gear • Pack Quivers',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_fri_4',
    day: 'Friday',
    startTime: '19:30',
    endTime: '21:00',
    title: 'Adult BJJ',
    category: 'Martial Arts',
    instructor: 'Professor Alex',
    location: 'Main Tatami',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Final Sparring Round • Mat Cool Down',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },

  // Saturday
  {
    id: 'slot_sat_1',
    day: 'Saturday',
    startTime: '08:30',
    endTime: '11:45',
    title: 'Youth Martial Arts',
    category: 'Martial Arts',
    instructor: 'Coach Zaki & Team',
    location: 'Main Tatami',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Belt Lineup • Parent Handover Preparation',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_sat_2',
    day: 'Saturday',
    startTime: '13:30',
    endTime: '17:00',
    title: 'Weekend Robotics',
    category: 'STEM / Robotics',
    instructor: 'Coach Faris & Team',
    location: 'Makerspace Lab',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Save Code Repos • Pack Electronics Kits',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_stem',
    voicePresetId: 'preset_su_robotics',
    endVoicePresetId: 'preset_su_closing'
  },

  // Sunday
  {
    id: 'slot_sun_1',
    day: 'Sunday',
    startTime: '07:30',
    endTime: '09:30',
    title: 'Sunnah Sports (Field)',
    category: 'Sunnah Sports',
    instructor: 'Ust. Dani & Coaches',
    location: 'Outdoor Field & Archery Track',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Collect Arrows • Equipment Count • Cool Down',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  },
  {
    id: 'slot_sun_2',
    day: 'Sunday',
    startTime: '10:00',
    endTime: '12:00',
    title: 'Adult BJJ & Aikido',
    category: 'Martial Arts',
    instructor: 'Professor Alex & Sensei Kenji',
    location: 'Main Tatami',
    warningThresholdMin: 10,
    transitionInstruction: 'WRAP-UP TIME: Joint Lineup • Studio Cleanup & Mat Sanitization',
    audioPreset: 'singing-bowl',
    endAudioPreset: 'deep-gong',
    openingVoicePresetId: 'preset_su_opening_martial',
    voicePresetId: 'preset_su_martial',
    endVoicePresetId: 'preset_su_closing'
  }
];

export const DEFAULT_SETTINGS = {
  masterVolume: 0.85,
  audioMuted: false,
  autoFullscreenOnTap: false,
  showNextSessionAlways: true,
  transitionThresholdDefault: 10,
  studioName: 'Buana Academy Studio',
  // Voice Synthesis Engine Settings
  voiceEnabled: true,
  voiceLanguage: 'sundanese',
  voiceGender: 'alternate',
  voiceRate: 1.0,
  voiceTone: 'energetic',
  voiceAnnounceOpening: true,
  voiceAnnounceWarning: true,
  voiceAnnounceEnd: true
};

/**
 * Storage Controller Class
 */
class StorageService {
  constructor() {
    this._listeners = new Set();
    this.ensureInitialized();
    this._bindStorageEvents();
  }

  ensureInitialized() {
    try {
      const existing = localStorage.getItem(STORAGE_KEY_SCHEDULE);
      if (!existing) {
        this.saveSchedule(FACTORY_SEED_SCHEDULE);
      }
      const existingSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (!existingSettings) {
        this.saveSettings(DEFAULT_SETTINGS);
      }
      const existingPrayers = localStorage.getItem(STORAGE_KEY_PRAYERS);
      if (!existingPrayers) {
        this.savePrayerSchedule(DEFAULT_PRAYER_SCHEDULE);
      }
      const existingPresets = localStorage.getItem(STORAGE_KEY_VOICE_PRESETS);
      if (!existingPresets) {
        this.saveVoicePresets(FACTORY_VOICE_PRESETS);
      }
    } catch (err) {
      console.error('StorageService: LocalStorage initialization error', err);
    }
  }

  _bindStorageEvents() {
    window.addEventListener('storage', (e) => {
      if (
        e.key === STORAGE_KEY_SCHEDULE ||
        e.key === STORAGE_KEY_SETTINGS ||
        e.key === STORAGE_KEY_PRAYERS ||
        e.key === STORAGE_KEY_VOICE_PRESETS
      ) {
        this._notifyListeners({ key: e.key, newValue: e.newValue });
      }
    });
  }

  /**
   * Subscribe to schedule/settings changes across tabs or locally
   */
  onScheduleChange(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  _notifyListeners(detail) {
    for (const listener of this._listeners) {
      try {
        listener(detail);
      } catch (err) {
        console.error('StorageService listener error:', err);
      }
    }
  }

  _broadcastLocalUpdate(key) {
    this._notifyListeners({ key, newValue: localStorage.getItem(key) });
    window.dispatchEvent(new CustomEvent('buana-storage-update', { detail: { key } }));
  }

  getSchedule() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SCHEDULE);
      if (!raw) return FACTORY_SEED_SCHEDULE;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : FACTORY_SEED_SCHEDULE;
    } catch (err) {
      console.warn('StorageService: failed to parse schedule, using seed', err);
      return FACTORY_SEED_SCHEDULE;
    }
  }

  saveSchedule(scheduleArray) {
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(scheduleArray));
      this._broadcastLocalUpdate(STORAGE_KEY_SCHEDULE);
      return true;
    } catch (err) {
      console.error('StorageService: failed to save schedule', err);
      return false;
    }
  }

  getSlotsByDay(dayName) {
    const all = this.getSchedule();
    return all
      .filter((s) => s.day.toLowerCase() === dayName.toLowerCase())
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  getSlotById(id) {
    const all = this.getSchedule();
    return all.find((s) => s.id === id) || null;
  }

  addSlot(slotData) {
    const all = this.getSchedule();
    const newSlot = {
      ...slotData,
      id: slotData.id || `slot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    };
    all.push(newSlot);
    this.saveSchedule(all);
    return newSlot;
  }

  updateSlot(id, updatedFields) {
    const all = this.getSchedule();
    const index = all.findIndex((s) => s.id === id);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updatedFields };
    this.saveSchedule(all);
    return all[index];
  }

  deleteSlot(id) {
    const all = this.getSchedule();
    const filtered = all.filter((s) => s.id !== id);
    if (filtered.length !== all.length) {
      this.saveSchedule(filtered);
      return true;
    }
    return false;
  }

  duplicateSlot(id, targetDay = null) {
    const slot = this.getSlotById(id);
    if (!slot) return null;

    const copy = {
      ...slot,
      id: `slot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      day: targetDay || slot.day,
      title: `${slot.title} (Copy)`
    };
    return this.addSlot(copy);
  }

  /**
   * Voice Preset CRUD Methods
   */
  getVoicePresets() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_VOICE_PRESETS);
      if (!raw) return FACTORY_VOICE_PRESETS;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : FACTORY_VOICE_PRESETS;
    } catch {
      return FACTORY_VOICE_PRESETS;
    }
  }

  saveVoicePresets(presets) {
    try {
      localStorage.setItem(STORAGE_KEY_VOICE_PRESETS, JSON.stringify(presets));
      this._broadcastLocalUpdate(STORAGE_KEY_VOICE_PRESETS);
      return true;
    } catch (err) {
      console.error('StorageService: failed to save voice presets', err);
      return false;
    }
  }

  getVoicePresetById(id) {
    const all = this.getVoicePresets();
    return all.find(p => p.id === id) || null;
  }

  addVoicePreset(presetData) {
    const all = this.getVoicePresets();
    const newPreset = {
      ...presetData,
      id: presetData.id || `preset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    };
    all.push(newPreset);
    this.saveVoicePresets(all);
    return newPreset;
  }

  updateVoicePreset(id, updatedFields) {
    const all = this.getVoicePresets();
    const index = all.findIndex(p => p.id === id);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updatedFields };
    this.saveVoicePresets(all);
    return all[index];
  }

  deleteVoicePreset(id) {
    const all = this.getVoicePresets();
    const filtered = all.filter(p => p.id !== id);
    if (filtered.length !== all.length) {
      this.saveVoicePresets(filtered);
      return true;
    }
    return false;
  }

  /**
   * Reset to factory seed schedule & default prayers & presets
   */
  resetToFactoryDefaults() {
    this.saveSchedule(FACTORY_SEED_SCHEDULE);
    this.saveSettings(DEFAULT_SETTINGS);
    this.savePrayerSchedule(DEFAULT_PRAYER_SCHEDULE);
    this.saveVoicePresets(FACTORY_VOICE_PRESETS);
    return true;
  }

  getSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      this._broadcastLocalUpdate(STORAGE_KEY_SETTINGS);
      return true;
    } catch (err) {
      console.error('StorageService: failed to save settings', err);
      return false;
    }
  }

  getPrayerSchedule() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRAYERS);
      if (!raw) return DEFAULT_PRAYER_SCHEDULE;
      return { ...DEFAULT_PRAYER_SCHEDULE, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PRAYER_SCHEDULE;
    }
  }

  savePrayerSchedule(prayerConfig) {
    try {
      localStorage.setItem(STORAGE_KEY_PRAYERS, JSON.stringify(prayerConfig));
      this._broadcastLocalUpdate(STORAGE_KEY_PRAYERS);
      return true;
    } catch (err) {
      console.error('StorageService: failed to save prayer schedule', err);
      return false;
    }
  }

  exportScheduleJSON() {
    const data = {
      version: '1.3',
      exportedAt: new Date().toISOString(),
      studio: 'Buana Academy',
      settings: this.getSettings(),
      prayerSchedule: this.getPrayerSchedule(),
      voicePresets: this.getVoicePresets(),
      schedule: this.getSchedule()
    };
    return JSON.stringify(data, null, 2);
  }

  importScheduleJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.schedule)) {
        throw new Error('Invalid JSON backup format: missing schedule array');
      }
      for (const item of parsed.schedule) {
        if (!item.day || !item.startTime || !item.endTime || !item.title) {
          throw new Error('Invalid slot structure in backup');
        }
      }

      this.saveSchedule(parsed.schedule);
      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveSettings({ ...this.getSettings(), ...parsed.settings });
      }
      if (parsed.prayerSchedule && typeof parsed.prayerSchedule === 'object') {
        this.savePrayerSchedule({ ...this.getPrayerSchedule(), ...parsed.prayerSchedule });
      }
      if (parsed.voicePresets && Array.isArray(parsed.voicePresets)) {
        this.saveVoicePresets(parsed.voicePresets);
      }
      return { success: true, count: parsed.schedule.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const Storage = new StorageService();
