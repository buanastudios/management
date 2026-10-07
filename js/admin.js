/**
 * Buana Academy Studio Transition Engine - Admin Dashboard Controller
 * Handles CRUD operations, day filtering, modal forms, sound previews,
 * voice preset dialect studio with Sundanese, Indonesian, English & Arabic phrasing guidelines,
 * Indonesia Raya mandatory civic routine management, and JSON backup workflows.
 */

import { Storage, DAYS_OF_WEEK, CATEGORIES, AUDIO_PRESETS, PRESET_LABELS, PRESET_TONES, LANGUAGE_DIALECT_GUIDES, UNIVERSAL_DYNAMIC_TOKENS, FACTORY_SEED_SCHEDULE } from './storage.js';
import { AudioEngine } from './audio-engine.js';
import { VoiceEngine } from './voice-engine.js';

// State
let currentSelectedDay = 'Monday';
let currentSelectedPresetLabel = 'all';
let currentSelectedPresetLang = 'all';
let presetSearchTerm = '';
let editingSlotId = null;
let editingPresetId = null;

// DOM Selectors
const elDayTabsContainer = document.getElementById('day-tabs-container');
const elScheduleList = document.getElementById('schedule-list');
const elEmptyState = document.getElementById('empty-schedule-state');
const elActiveDayTitle = document.getElementById('active-day-title');
const elSlotCountBadge = document.getElementById('slot-count-badge');

// Voice Settings Elements
const elVoiceEnableToggle = document.getElementById('voice-enable-toggle');
const elVoiceLangSelect = document.getElementById('voice-lang-select');
const elVoiceGenderSelect = document.getElementById('voice-gender-select');
const elVoiceRateSlider = document.getElementById('voice-rate-slider');
const elVoiceRateLabel = document.getElementById('voice-rate-label');
const elVoiceAnnounceWarningCheck = document.getElementById('voice-announce-warning-check');
const elVoiceAnnounceEndCheck = document.getElementById('voice-announce-end-check');
const elBtnTestSundanese = document.getElementById('btn-test-sundanese');
const elBtnTestEnglish = document.getElementById('btn-test-english');
const elBtnTestArabic = document.getElementById('btn-test-arabic');

// Voice Presets Elements
const elPresetLabelFilters = document.getElementById('preset-label-filters');
const elPresetLangFilters = document.getElementById('preset-lang-filters');
const inPresetSearch = document.getElementById('in-preset-search');
const elVoicePresetsList = document.getElementById('voice-presets-list');
const elBtnAddPreset = document.getElementById('btn-add-preset');
const elPresetModal = document.getElementById('voice-preset-modal');
const elPresetModalTitle = document.getElementById('preset-modal-title');
const elModalDialectGuideContainer = document.getElementById('modal-dialect-guide-container');
const elBtnClosePresetModal = document.getElementById('btn-close-preset-modal');
const elBtnCancelPresetModal = document.getElementById('btn-cancel-preset-modal');
const elPresetForm = document.getElementById('preset-form');
const inPresetId = document.getElementById('form-preset-id');
const inPresetName = document.getElementById('form-preset-name');
const inPresetLabel = document.getElementById('form-preset-label');
const inPresetLang = document.getElementById('form-preset-lang');
const inPresetGender = document.getElementById('form-preset-gender');
const inPresetTone = document.getElementById('form-preset-tone');
const inPresetText = document.getElementById('form-preset-text');
const elPresetCharCount = document.getElementById('preset-char-count');
const elPresetLivePreview = document.getElementById('preset-live-preview');
const elBtnTestModalPreset = document.getElementById('btn-test-modal-preset');

// Indonesia Raya Mandatory Civic Routine Elements
const elIndonesiaRayaEnabled = document.getElementById('indonesia-raya-enabled');
const elIndonesiaRayaTime = document.getElementById('indonesia-raya-time');
const elIndonesiaRayaVoicePreset = document.getElementById('indonesia-raya-voice-preset');
const elIndonesiaRayaAnnounceEnabled = document.getElementById('indonesia-raya-announce-enabled');
const elIndonesiaRayaAudioMode = document.getElementById('indonesia-raya-audio-mode');
const elIndonesiaRayaCustomUrl = document.getElementById('indonesia-raya-custom-url');
const elBtnTestAnthemVoice = document.getElementById('btn-test-anthem-voice');
const elBtnTestAnthemAudio = document.getElementById('btn-test-anthem-audio');
const elBtnTestAnthemFull = document.getElementById('btn-test-anthem-full');

// Modal Elements (Slots)
const elSlotModal = document.getElementById('slot-modal');
const elModalTitle = document.getElementById('modal-title');
const elSlotForm = document.getElementById('slot-form');
const elBtnCloseModal = document.getElementById('btn-close-modal');
const elBtnCancelModal = document.getElementById('btn-cancel-modal');
const elBtnAddSlot = document.getElementById('btn-add-slot');

// Form Input Elements (Slots)
const inSlotId = document.getElementById('form-slot-id');
const inDay = document.getElementById('form-day');
const inStartTime = document.getElementById('form-start-time');
const inEndTime = document.getElementById('form-end-time');
const inTitle = document.getElementById('form-title');
const inCategory = document.getElementById('form-category');
const inInstructor = document.getElementById('form-instructor');
const inLocation = document.getElementById('form-location');
const inWarningThreshold = document.getElementById('form-warning-threshold');
const inTransitionInstruction = document.getElementById('form-transition-instruction');
const inAudioPreset = document.getElementById('form-audio-preset');
const inEndAudioPreset = document.getElementById('form-end-audio-preset');
const inOpeningVoicePreset = document.getElementById('form-opening-voice-preset');
const inVoicePreset = document.getElementById('form-voice-preset');
const inEndVoicePreset = document.getElementById('form-end-voice-preset');
const elBtnPreviewChime = document.getElementById('btn-preview-chime');

// Global Action Buttons
const elBtnExportJson = document.getElementById('btn-export-json');
const elBtnImportJson = document.getElementById('btn-import-json');
const elFileInput = document.getElementById('import-file-input');
const elBtnResetFactory = document.getElementById('btn-reset-factory');

// Toast Notification
const elToastContainer = document.getElementById('toast-container');

/**
 * Initialize Admin Controller
 */
function initAdmin() {
  renderDayTabs();
  renderScheduleList();
  renderPresetLabelFilters();
  renderPresetLangFilters();
  renderVoicePresetsList();
  bindModalEvents();
  bindPresetModalEvents();
  bindDataManagementEvents();
  bindVoiceSettingsEvents();
  bindPrayerScheduleEvents();
  bindIndonesiaRayaEvents();

  // Cross-tab sync: re-render if another tab modified storage
  Storage.onScheduleChange(() => {
    renderScheduleList();
    renderVoicePresetsList();
    loadVoiceSettings();
    loadPrayerSchedule();
    loadIndonesiaRayaSettings();
    populateVoicePresetDropdowns();
    populateIndonesiaRayaVoiceDropdown();
  });
}

/**
 * Render Day Tabs Navigation
 */
function renderDayTabs() {
  if (!elDayTabsContainer) return;

  const dayLabels = {
    'All Days': 'Semua Hari 📅',
    'Monday': 'Senin 🚀',
    'Tuesday': 'Selasa ⚡',
    'Wednesday': 'Rabu 🔬',
    'Thursday': 'Kamis 🎯',
    'Friday': 'Jumat 🕌',
    'Saturday': 'Sabtu 🥋',
    'Sunday': 'Minggu ☀️'
  };

  const tabs = ['All Days', ...DAYS_OF_WEEK];
  elDayTabsContainer.innerHTML = '';

  tabs.forEach((tab) => {
    const btn = document.createElement('button');
    const isActive = tab === currentSelectedDay;
    btn.type = 'button';
    btn.className = `px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
      isActive
        ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;
    btn.textContent = dayLabels[tab] || tab;
    btn.onclick = () => {
      currentSelectedDay = tab;
      renderDayTabs();
      renderScheduleList();
    };
    elDayTabsContainer.appendChild(btn);
  });
}

/**
 * Render Preset Label Filters Bar
 */
function renderPresetLabelFilters() {
  if (!elPresetLabelFilters) return;

  const filterOptions = [
    { id: 'all', name: 'Semua Kalimat', icon: '🎙️' },
    ...PRESET_LABELS
  ];

  elPresetLabelFilters.innerHTML = '';

  filterOptions.forEach(opt => {
    const btn = document.createElement('button');
    const isActive = opt.id === currentSelectedPresetLabel;
    btn.type = 'button';
    btn.className = `px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
      isActive
        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
    }`;
    btn.innerHTML = `<span>${opt.icon || '📌'}</span> <span>${opt.name}</span>`;
    btn.onclick = () => {
      currentSelectedPresetLabel = opt.id;
      renderPresetLabelFilters();
      renderVoicePresetsList();
    };
    elPresetLabelFilters.appendChild(btn);
  });
}

/**
 * Render Preset Language Filters Bar
 */
function renderPresetLangFilters() {
  if (!elPresetLangFilters) return;

  const langOptions = [
    { id: 'all', name: 'Semua Bahasa 🌐' },
    { id: 'sundanese', name: 'Basa Sunda 🌺' },
    { id: 'indonesian', name: 'Bahasa Indonesia 🇮🇩' },
    { id: 'english', name: 'Bahasa Inggris 🇬🇧' },
    { id: 'arabic', name: 'Bahasa Arab 🇸🇦' }
  ];

  elPresetLangFilters.innerHTML = '';

  langOptions.forEach(opt => {
    const btn = document.createElement('button');
    const isActive = opt.id === currentSelectedPresetLang;
    btn.type = 'button';
    btn.className = `px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
      isActive
        ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20'
        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
    }`;
    btn.textContent = opt.name;
    btn.onclick = () => {
      currentSelectedPresetLang = opt.id;
      renderPresetLangFilters();
      renderVoicePresetsList();
    };
    elPresetLangFilters.appendChild(btn);
  });
}

/**
 * Render Schedule Items for current selection
 */
function renderScheduleList() {
  if (!elScheduleList) return;

  let slots = [];
  if (currentSelectedDay === 'All Days') {
    slots = Storage.getSchedule().sort((a, b) => {
      const dayOrder = DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day);
      if (dayOrder !== 0) return dayOrder;
      return a.startTime.localeCompare(b.startTime);
    });
  } else {
    slots = Storage.getSlotsByDay(currentSelectedDay);
  }

  if (elActiveDayTitle) {
    elActiveDayTitle.textContent = currentSelectedDay;
  }
  if (elSlotCountBadge) {
    elSlotCountBadge.textContent = `${slots.length} ${slots.length === 1 ? 'Slot' : 'Slots'}`;
  }

  if (slots.length === 0) {
    elScheduleList.innerHTML = '';
    if (elEmptyState) elEmptyState.classList.remove('hidden');
    return;
  }

  if (elEmptyState) elEmptyState.classList.add('hidden');
  elScheduleList.innerHTML = '';

  const allPresets = Storage.getVoicePresets();

  slots.forEach((slot) => {
    const categoryConfig = CATEGORIES.find(c => c.name === slot.category) || CATEGORIES[0];
    const card = document.createElement('div');
    card.className = `glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 transition-all duration-200 hover:translate-y-[-2px] ${categoryConfig.borderClass}`;

    // Calculate duration
    const [sh, sm] = slot.startTime.split(':').map(Number);
    const [eh, em] = slot.endTime.split(':').map(Number);
    const durMins = (eh * 60 + em) - (sh * 60 + sm);
    const durHours = Math.floor(durMins / 60);
    const durRemainderMins = durMins % 60;
    const durText = durHours > 0 
      ? (durRemainderMins > 0 ? `${durHours}h ${durRemainderMins}m` : `${durHours}h`) 
      : `${durRemainderMins}m`;

    const presetObj = AUDIO_PRESETS.find(p => p.id === slot.audioPreset) || AUDIO_PRESETS[0];
    const openingPreset = allPresets.find(p => p.id === slot.openingVoicePresetId);
    const warningPreset = allPresets.find(p => p.id === slot.voicePresetId);
    const closingPreset = allPresets.find(p => p.id === slot.endVoicePresetId);

    card.innerHTML = `
      <div class="flex-1 space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          ${currentSelectedDay === 'All Days' ? `<span class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-cyan-400 border border-slate-700">${slot.day}</span>` : ''}
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryConfig.badgeClass}">${slot.category}</span>
          <span class="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${slot.startTime} – ${slot.endTime} (${durText})
          </span>
          <span class="text-xs text-amber-400/90 font-mono flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            🔔 T-${slot.warningThresholdMin || 10}m Chime
          </span>
        </div>

        <div class="flex items-baseline gap-3">
          <h3 class="text-xl font-bold text-white">${slot.title}</h3>
        </div>

        <div class="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400">
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            ${slot.instructor || 'Lead Coach'}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${slot.location || 'Main Studio'}
          </span>
          <span class="flex items-center gap-1 text-slate-500">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            Chime: ${presetObj.name.split('(')[0]}
          </span>
        </div>

        <!-- Voice Presets Assigned Badges -->
        <div class="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          ${openingPreset ? `
            <span class="px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <span>🚀 Opening:</span> <b>${openingPreset.name.split(':')[0]}</b>
            </span>
          ` : ''}
          ${warningPreset ? `
            <span class="px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/30 flex items-center gap-1">
              <span>⏳ Wrap-up:</span> <b>${warningPreset.name.split(':')[0]}</b>
            </span>
          ` : ''}
          ${closingPreset ? `
            <span class="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span>🏁 Closing:</span> <b>${closingPreset.name.split(':')[0]}</b>
            </span>
          ` : ''}
        </div>

        ${slot.transitionInstruction ? `
          <div class="text-xs text-amber-300/80 bg-amber-950/30 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span class="font-semibold text-amber-400">Transition Notice:</span>
            <span>${slot.transitionInstruction}</span>
          </div>
        ` : ''}
      </div>

      <div class="flex items-center gap-2 self-end md:self-center">
        <button type="button" class="btn-preview-slot p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors" title="Dengarkan Bunyi Lonceng" data-preset="${slot.audioPreset || 'singing-bowl'}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        </button>
        <button type="button" class="btn-edit-slot px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-cyan-500 hover:text-slate-950 transition-all" data-id="${slot.id}">
          ✏️ Edit
        </button>
        <button type="button" class="btn-duplicate-slot px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all" data-id="${slot.id}">
          📋 Salin
        </button>
        <button type="button" class="btn-delete-slot p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Hapus Jadwal" data-id="${slot.id}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `;

    // Bind action events
    card.querySelector('.btn-preview-slot').onclick = (e) => {
      const preset = e.currentTarget.getAttribute('data-preset');
      AudioEngine.playPreset(preset);
      showToast(`Playing ${preset} chime...`, 'info');
    };

    card.querySelector('.btn-edit-slot').onclick = () => openEditModal(slot.id);
    card.querySelector('.btn-duplicate-slot').onclick = () => handleDuplicate(slot.id);
    card.querySelector('.btn-delete-slot').onclick = () => handleDelete(slot.id, slot.title);

    elScheduleList.appendChild(card);
  });
}

/**
 * Populate all voice preset dropdowns in the schedule slot modal
 */
function populateVoicePresetDropdowns() {
  const presets = Storage.getVoicePresets();

  const generateOptions = (labelFilter = null) => {
    let filtered = presets;
    if (labelFilter) {
      filtered = presets.filter(p => p.label === labelFilter || p.type === labelFilter);
      if (filtered.length === 0) filtered = presets;
    }

    return `
      <option value="">(Default / Global Announcement)</option>
      ${filtered.map(p => {
        const labelMeta = PRESET_LABELS.find(l => l.id === (p.label || p.type));
        const icon = labelMeta ? labelMeta.icon : '🎙️';
        return `<option value="${p.id}">${icon} ${p.name} [${p.language.toUpperCase()}]</option>`;
      }).join('')}
    `;
  };

  if (inOpeningVoicePreset) inOpeningVoicePreset.innerHTML = generateOptions('opening');
  if (inVoicePreset) inVoicePreset.innerHTML = generateOptions('warning');
  if (inEndVoicePreset) inEndVoicePreset.innerHTML = generateOptions('closing');
}

/**
 * Render Voice Presets Section
 */
function renderVoicePresetsList() {
  if (!elVoicePresetsList) return;
  const allPresets = Storage.getVoicePresets();

  let presets = allPresets;
  if (currentSelectedPresetLabel !== 'all') {
    presets = presets.filter(p => (p.label || p.type) === currentSelectedPresetLabel);
  }
  if (currentSelectedPresetLang !== 'all') {
    presets = presets.filter(p => p.language === currentSelectedPresetLang);
  }
  if (presetSearchTerm) {
    const term = presetSearchTerm.toLowerCase();
    presets = presets.filter(p => 
      (p.name && p.name.toLowerCase().includes(term)) || 
      (p.text && p.text.toLowerCase().includes(term)) ||
      (p.label && p.label.toLowerCase().includes(term)) ||
      (p.language && p.language.toLowerCase().includes(term))
    );
  }

  elVoicePresetsList.innerHTML = '';

  if (presets.length === 0) {
    elVoicePresetsList.innerHTML = `
      <div class="col-span-1 md:col-span-2 glass-panel p-8 rounded-2xl text-center space-y-2 border border-slate-800">
        <p class="text-sm text-slate-400">No presets match the selected label/language or search filter.</p>
        <button type="button" class="btn-quick-add-label px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 font-bold shadow">
          + Create Preset for this Activity
        </button>
      </div>
    `;
    const btnQuick = elVoicePresetsList.querySelector('.btn-quick-add-label');
    if (btnQuick) btnQuick.onclick = () => openAddPresetModal(currentSelectedPresetLabel !== 'all' ? currentSelectedPresetLabel : 'opening');
    return;
  }

  presets.forEach((preset) => {
    const card = document.createElement('div');
    card.className = 'glass-panel p-4 md:p-5 rounded-2xl flex flex-col justify-between gap-3 border border-slate-800 hover:border-slate-700 transition-all';

    let langBadge = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    if (preset.language === 'indonesian') langBadge = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    if (preset.language === 'english') langBadge = 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    if (preset.language === 'arabic') langBadge = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

    const labelMeta = PRESET_LABELS.find(l => l.id === (preset.label || preset.type)) || PRESET_LABELS[0];
    const toneMeta = PRESET_TONES.find(t => t.id === preset.tone) || PRESET_TONES[0];

    let genderLabel = 'Alternate (Male ⇄ Female)';
    if (preset.gender === 'female') genderLabel = 'Female Persona';
    if (preset.gender === 'male') genderLabel = 'Male Persona';

    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
              <span>${labelMeta.icon}</span> ${labelMeta.name.split('/')[0].trim()}
            </span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase font-mono border ${langBadge}">
              ${preset.language}
            </span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
              ${genderLabel}
            </span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
              ${toneMeta.name}
            </span>
          </div>
        </div>

        <h4 class="text-sm font-bold text-white font-display">${preset.name}</h4>
        
        <div class="text-xs text-slate-300/90 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 line-clamp-3 leading-relaxed">
          "${preset.text}"
        </div>
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
        <button type="button" class="btn-test-preset-voice px-3 py-1.5 rounded-xl font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all" data-id="${preset.id}">
          <span>🗣️ Coba Suara</span>
        </button>

        <div class="flex items-center gap-1.5">
          <button type="button" class="btn-edit-preset px-2.5 py-1.5 rounded-xl font-medium bg-slate-800 text-slate-200 hover:bg-cyan-500 hover:text-slate-950 transition-all" data-id="${preset.id}">
            ✏️ Edit
          </button>
          <button type="button" class="btn-duplicate-preset px-2.5 py-1.5 rounded-xl font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all" data-id="${preset.id}">
            📋 Salin
          </button>
          <button type="button" class="btn-delete-preset p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Hapus Kalimat" data-id="${preset.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;

    // Event bindings on preset card
    card.querySelector('.btn-test-preset-voice').onclick = async () => {
      VoiceEngine.unlock();
      showToast(`Membacakan kalimat: ${preset.name}...`, 'info');
      await VoiceEngine.speakFromPreset({
        presetObject: preset,
        tokens: {
          title: 'Robotika & Coding Seru',
          action: 'Simpen wadah proyék sareng tata matras',
          nextTitle: 'Praktek Robotika Terpadu',
          nextTime: '15:30',
          minutes: 10,
          prayerName: 'Ashar'
        },
        settings: Storage.getSettings()
      });
    };

    card.querySelector('.btn-edit-preset').onclick = () => openEditPresetModal(preset.id);
    card.querySelector('.btn-duplicate-preset').onclick = () => handleDuplicatePreset(preset.id);
    card.querySelector('.btn-delete-preset').onclick = () => handleDeletePreset(preset.id, preset.name);

    elVoicePresetsList.appendChild(card);
  });
}

/**
 * Render Dynamic Language Dialect & Phrasing Guide in Preset Modal
 */
function renderModalDialectGuide(langId = 'sundanese') {
  if (!elModalDialectGuideContainer) return;

  const guide = LANGUAGE_DIALECT_GUIDES[langId] || LANGUAGE_DIALECT_GUIDES.sundanese;

  let rulesHtml = '';
  if (guide.rules && guide.rules.length > 0) {
    rulesHtml = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        ${guide.rules.map(r => `
          <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/60 space-y-1">
            <div class="font-bold text-cyan-300 text-xs">${r.label}</div>
            <div class="text-[11px] text-slate-300">${r.sound}</div>
            <div class="text-[10px] text-slate-400 font-mono italic">${r.tip}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  let phrasesHtml = '';
  if (guide.vocabularySnippets && guide.vocabularySnippets.length > 0) {
    phrasesHtml = `
      <div class="space-y-1.5 pt-1">
        <label class="block text-xs font-semibold text-slate-300">
          💡 Pilihan Kalimat Siap Pakai untuk ${guide.name} <span class="text-slate-400 font-normal font-sans">(Klik untuk memasukkan ke teks)</span>:
        </label>
        <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          ${guide.vocabularySnippets.map(snippet => `
            <button type="button" class="btn-insert-dynamic-phrase px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40 border border-slate-700 transition-all text-left" data-text="${snippet.text.replace(/"/g, '&quot;')}">
              ${snippet.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  const tokensHtml = `
    <div class="space-y-1.5 pt-1">
      <label class="block text-xs font-semibold text-slate-300">
        ⚡ Kode Pintar Otomatis <span class="text-slate-400 font-normal font-sans">(Otomatis diganti sesuai jadwal kelas yang sedang aktif)</span>:
      </label>
      <div class="flex flex-wrap gap-1.5">
        ${UNIVERSAL_DYNAMIC_TOKENS.map(t => `
          <button type="button" class="btn-insert-dynamic-token px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all" data-token="${t.token}" title="${t.desc}">
            ${t.token}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  elModalDialectGuideContainer.innerHTML = `
    <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-700/70 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-base">${guide.flag || '🌐'}</span>
          <h5 class="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">${guide.title}</h5>
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">${guide.badgeText}</span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed">${guide.description}</p>
      ${rulesHtml}
      ${phrasesHtml}
      ${tokensHtml}
    </div>
  `;

  // Bind dynamic phrase insertion
  elModalDialectGuideContainer.querySelectorAll('.btn-insert-dynamic-phrase').forEach(btn => {
    btn.onclick = () => {
      const textToInsert = btn.getAttribute('data-text');
      insertTextAtCursor(inPresetText, ` ${textToInsert} `);
      updatePresetLivePreview();
    };
  });

  // Bind dynamic token insertion
  elModalDialectGuideContainer.querySelectorAll('.btn-insert-dynamic-token').forEach(btn => {
    btn.onclick = () => {
      const tokenToInsert = btn.getAttribute('data-token');
      insertTextAtCursor(inPresetText, `${tokenToInsert}`);
      updatePresetLivePreview();
    };
  });
}

/**
 * Preset Modal Event Handling & Dialect Guide
 */
function bindPresetModalEvents() {
  if (elBtnAddPreset) {
    elBtnAddPreset.onclick = () => openAddPresetModal();
  }

  // Preset search input
  if (inPresetSearch) {
    inPresetSearch.oninput = (e) => {
      presetSearchTerm = e.target.value.trim();
      renderVoicePresetsList();
    };
  }

  const closePresetModal = () => {
    if (elPresetModal) {
      elPresetModal.classList.add('hidden');
      elPresetModal.classList.remove('flex');
    }
    editingPresetId = null;
    if (elPresetForm) elPresetForm.reset();
  };

  if (elBtnClosePresetModal) elBtnClosePresetModal.onclick = closePresetModal;
  if (elBtnCancelPresetModal) elBtnCancelPresetModal.onclick = closePresetModal;

  // Language selector change inside modal: update dialect guide dynamically!
  if (inPresetLang) {
    inPresetLang.onchange = (e) => {
      renderModalDialectGuide(e.target.value);
    };
  }

  // Live text input counter & token simulation preview
  if (inPresetText) {
    inPresetText.oninput = () => {
      updatePresetLivePreview();
    };
  }

  // Live Test Button inside Modal
  if (elBtnTestModalPreset) {
    elBtnTestModalPreset.onclick = async () => {
      const rawText = inPresetText.value.trim();
      if (!rawText) {
        showToast('Please enter script text to test voice.', 'error');
        return;
      }

      VoiceEngine.unlock();
      showToast('Testing energetic speech synthesis...', 'info');

      const tempPreset = {
        name: inPresetName.value || 'Test Preset',
        label: inPresetLabel.value || 'opening',
        tone: inPresetTone.value || 'energetic',
        language: inPresetLang.value || 'sundanese',
        gender: inPresetGender.value || 'alternate',
        text: rawText
      };

      await VoiceEngine.speakFromPreset({
        presetObject: tempPreset,
        tokens: {
          title: 'Open Robotic Lab',
          action: 'Simpen wadah proyék sareng tata matras',
          nextTitle: 'Guided Robotics',
          nextTime: '15:30',
          minutes: 10,
          prayerName: 'Ashar'
        },
        settings: Storage.getSettings()
      });
    };
  }

  // Preset Form Submit
  if (elPresetForm) {
    elPresetForm.onsubmit = handlePresetFormSubmit;
  }
}

function updatePresetLivePreview() {
  if (!inPresetText || !elPresetCharCount || !elPresetLivePreview) return;
  const val = inPresetText.value;
  elPresetCharCount.textContent = `${val.length} chars`;

  if (!val.trim()) {
    elPresetLivePreview.textContent = '-- Write text above to preview token interpolation --';
    return;
  }

  const simulated = VoiceEngine.interpolateText(val, {
    title: 'Open Robotic Lab',
    action: 'simpen wadah proyék sareng tata deui pakakas',
    nextTitle: 'Guided Robotics',
    nextTime: '15:30',
    minutes: 10,
    prayerName: 'Ashar'
  });

  elPresetLivePreview.textContent = `"${simulated}"`;
}

/**
 * Utility: insert text string at textarea caret position
 */
function insertTextAtCursor(textarea, text) {
  if (!textarea) return;
  textarea.focus();

  const startPos = textarea.selectionStart ?? textarea.value.length;
  const endPos = textarea.selectionEnd ?? textarea.value.length;
  const currentVal = textarea.value;

  textarea.value = currentVal.substring(0, startPos) + text + currentVal.substring(endPos);
  const newPos = startPos + text.length;
  textarea.selectionStart = newPos;
  textarea.selectionEnd = newPos;
}

function openAddPresetModal(preferredLabel = 'opening') {
  editingPresetId = null;
  if (elPresetForm) elPresetForm.reset();
  if (elPresetModalTitle) elPresetModalTitle.textContent = 'Tambah Kalimat Suara Baru 🎙️';

  if (inPresetLabel) inPresetLabel.value = preferredLabel !== 'all' ? preferredLabel : 'opening';
  if (inPresetTone) inPresetTone.value = 'energetic';
  if (inPresetLang) inPresetLang.value = 'sundanese';
  if (inPresetGender) inPresetGender.value = 'alternate';
  if (inPresetText) {
    inPresetText.value = 'Sampurasun wargi Buana Academy! Wilujeng sumping dina sési {title}! Hayu urang kawitan kalayan pinuh sumanget sareng fokus!';
  }

  renderModalDialectGuide(inPresetLang ? inPresetLang.value : 'sundanese');
  updatePresetLivePreview();

  if (elPresetModal) {
    elPresetModal.classList.remove('hidden');
    elPresetModal.classList.add('flex');
  }
}

function openEditPresetModal(presetId) {
  const preset = Storage.getVoicePresetById(presetId);
  if (!preset) return;

  editingPresetId = presetId;
  if (elPresetModalTitle) elPresetModalTitle.textContent = `Edit Voice Preset: ${preset.name}`;

  if (inPresetId) inPresetId.value = preset.id;
  if (inPresetName) inPresetName.value = preset.name;
  if (inPresetLabel) inPresetLabel.value = preset.label || preset.type || 'opening';
  if (inPresetTone) inPresetTone.value = preset.tone || 'energetic';
  if (inPresetLang) inPresetLang.value = preset.language || 'sundanese';
  if (inPresetGender) inPresetGender.value = preset.gender || 'alternate';
  if (inPresetText) inPresetText.value = preset.text || '';

  renderModalDialectGuide(preset.language || 'sundanese');
  updatePresetLivePreview();

  if (elPresetModal) {
    elPresetModal.classList.remove('hidden');
    elPresetModal.classList.add('flex');
  }
}

function handlePresetFormSubmit(e) {
  e.preventDefault();

  const name = inPresetName.value.trim();
  const label = inPresetLabel.value;
  const tone = inPresetTone.value;
  const language = inPresetLang.value;
  const gender = inPresetGender.value;
  const text = inPresetText.value.trim();

  if (!name || !text) {
    showToast('Please provide a Preset Name and Script Text.', 'error');
    return;
  }

  const presetData = {
    name,
    label,
    tone,
    language,
    gender,
    text
  };

  if (editingPresetId) {
    Storage.updateVoicePreset(editingPresetId, presetData);
    showToast(`Updated preset "${name}" successfully`, 'success');
  } else {
    Storage.addVoicePreset(presetData);
    showToast(`Created preset "${name}"`, 'success');
  }

  if (elPresetModal) {
    elPresetModal.classList.add('hidden');
    elPresetModal.classList.remove('flex');
  }

  renderVoicePresetsList();
  populateVoicePresetDropdowns();
  populateIndonesiaRayaVoiceDropdown();
}

function handleDuplicatePreset(presetId) {
  const preset = Storage.getVoicePresetById(presetId);
  if (!preset) return;

  const copy = {
    ...preset,
    id: `preset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: `${preset.name} (Copy)`
  };

  Storage.addVoicePreset(copy);
  showToast(`Duplicated preset: "${copy.name}"`, 'success');
  renderVoicePresetsList();
  populateVoicePresetDropdowns();
  populateIndonesiaRayaVoiceDropdown();
}

function handleDeletePreset(presetId, name) {
  if (confirm(`Are you sure you want to delete voice preset "${name}"?`)) {
    Storage.deleteVoicePreset(presetId);
    showToast(`Deleted preset "${name}"`, 'info');
    renderVoicePresetsList();
    populateVoicePresetDropdowns();
    populateIndonesiaRayaVoiceDropdown();
  }
}

/**
 * Modal Handling (Slots)
 */
function bindModalEvents() {
  if (elBtnAddSlot) {
    elBtnAddSlot.onclick = () => openAddModal();
  }

  const closeModal = () => {
    if (elSlotModal) {
      elSlotModal.classList.add('hidden');
      elSlotModal.classList.remove('flex');
    }
    editingSlotId = null;
    if (elSlotForm) elSlotForm.reset();
  };

  if (elBtnCloseModal) elBtnCloseModal.onclick = closeModal;
  if (elBtnCancelModal) elBtnCancelModal.onclick = closeModal;

  if (elBtnPreviewChime && inAudioPreset) {
    elBtnPreviewChime.onclick = () => {
      const preset = inAudioPreset.value;
      AudioEngine.playPreset(preset);
      showToast(`Previewing ${preset}...`, 'info');
    };
  }

  if (elSlotForm) {
    elSlotForm.onsubmit = handleFormSubmit;
  }

  // Populate category and preset select options
  if (inCategory) {
    inCategory.innerHTML = CATEGORIES.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  }
  if (inAudioPreset) {
    inAudioPreset.innerHTML = AUDIO_PRESETS.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  }
  if (inEndAudioPreset) {
    inEndAudioPreset.innerHTML = AUDIO_PRESETS.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  }

  populateVoicePresetDropdowns();
}

function openAddModal() {
  editingSlotId = null;
  if (elSlotForm) elSlotForm.reset();
  if (elModalTitle) elModalTitle.textContent = 'Tambah Jadwal Kelas 📅';

  // Default day to current active tab if not "All Days"
  if (inDay) {
    inDay.value = currentSelectedDay !== 'All Days' ? currentSelectedDay : 'Monday';
  }
  if (inWarningThreshold) inWarningThreshold.value = '10';
  if (inTransitionInstruction) {
    inTransitionInstruction.value = 'WAKTU BERES-BERES: Rapikan Boks Proyek • Bersihkan Matras';
  }
  if (inAudioPreset) inAudioPreset.value = 'singing-bowl';
  if (inEndAudioPreset) inEndAudioPreset.value = 'deep-gong';
  if (inOpeningVoicePreset) inOpeningVoicePreset.value = '';
  if (inVoicePreset) inVoicePreset.value = '';
  if (inEndVoicePreset) inEndVoicePreset.value = '';

  if (elSlotModal) {
    elSlotModal.classList.remove('hidden');
    elSlotModal.classList.add('flex');
  }
}

function openEditModal(slotId) {
  const slot = Storage.getSlotById(slotId);
  if (!slot) return;

  editingSlotId = slotId;
  if (elModalTitle) elModalTitle.textContent = 'Edit Jadwal Kelas 📅';

  if (inSlotId) inSlotId.value = slot.id;
  if (inDay) inDay.value = slot.day;
  if (inStartTime) inStartTime.value = slot.startTime;
  if (inEndTime) inEndTime.value = slot.endTime;
  if (inTitle) inTitle.value = slot.title;
  if (inCategory) inCategory.value = slot.category;
  if (inInstructor) inInstructor.value = slot.instructor || '';
  if (inLocation) inLocation.value = slot.location || '';
  if (inWarningThreshold) inWarningThreshold.value = slot.warningThresholdMin || 10;
  if (inTransitionInstruction) inTransitionInstruction.value = slot.transitionInstruction || '';
  if (inAudioPreset) inAudioPreset.value = slot.audioPreset || 'singing-bowl';
  if (inEndAudioPreset) inEndAudioPreset.value = slot.endAudioPreset || 'deep-gong';
  if (inOpeningVoicePreset) inOpeningVoicePreset.value = slot.openingVoicePresetId || '';
  if (inVoicePreset) inVoicePreset.value = slot.voicePresetId || '';
  if (inEndVoicePreset) inEndVoicePreset.value = slot.endVoicePresetId || '';

  if (elSlotModal) {
    elSlotModal.classList.remove('hidden');
    elSlotModal.classList.add('flex');
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const day = inDay.value;
  const startTime = inStartTime.value;
  const endTime = inEndTime.value;
  const title = inTitle.value.trim();
  const category = inCategory.value;
  const instructor = inInstructor.value.trim();
  const location = inLocation.value.trim();
  const warningThresholdMin = parseInt(inWarningThreshold.value, 10) || 10;
  const transitionInstruction = inTransitionInstruction.value.trim();
  const audioPreset = inAudioPreset.value;
  const endAudioPreset = inEndAudioPreset.value;
  const openingVoicePresetId = inOpeningVoicePreset ? inOpeningVoicePreset.value || null : null;
  const voicePresetId = inVoicePreset ? inVoicePreset.value || null : null;
  const endVoicePresetId = inEndVoicePreset ? inEndVoicePreset.value || null : null;

  if (!title || !startTime || !endTime) {
    showToast('Please provide Title, Start Time, and End Time.', 'error');
    return;
  }

  if (startTime >= endTime) {
    showToast('Start Time must be before End Time.', 'error');
    return;
  }

  const slotData = {
    day,
    startTime,
    endTime,
    title,
    category,
    instructor,
    location,
    warningThresholdMin,
    transitionInstruction,
    audioPreset,
    endAudioPreset,
    openingVoicePresetId,
    voicePresetId,
    endVoicePresetId
  };

  if (editingSlotId) {
    Storage.updateSlot(editingSlotId, slotData);
    showToast(`Updated "${title}" successfully`, 'success');
  } else {
    Storage.addSlot(slotData);
    showToast(`Added "${title}" to ${day}`, 'success');
  }

  // Close modal and refresh list
  if (elSlotModal) {
    elSlotModal.classList.add('hidden');
    elSlotModal.classList.remove('flex');
  }
  renderScheduleList();
}

function handleDuplicate(slotId) {
  const duplicated = Storage.duplicateSlot(slotId);
  if (duplicated) {
    showToast(`Duplicated slot: "${duplicated.title}"`, 'success');
    renderScheduleList();
  }
}

function handleDelete(slotId, title) {
  if (confirm(`Are you sure you want to delete "${title}"?`)) {
    Storage.deleteSlot(slotId);
    showToast(`Deleted "${title}"`, 'info');
    renderScheduleList();
  }
}

/**
 * Backup / Restore / Reset
 */
function bindDataManagementEvents() {
  // Export JSON
  if (elBtnExportJson) {
    elBtnExportJson.onclick = () => {
      const json = Storage.exportScheduleJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `buana-academy-schedule-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Backup JSON exported successfully', 'success');
    };
  }

  // Import JSON via file input
  if (elBtnImportJson && elFileInput) {
    elBtnImportJson.onclick = () => elFileInput.click();

    elFileInput.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const result = Storage.importScheduleJSON(content);
        if (result.success) {
          showToast(`Successfully imported ${result.count} schedule slots & presets!`, 'success');
          renderScheduleList();
          renderVoicePresetsList();
          populateVoicePresetDropdowns();
        } else {
          showToast(`Import error: ${result.error}`, 'error');
        }
        elFileInput.value = '';
      };
      reader.readAsText(file);
    };
  }

  // Reset to factory defaults
  if (elBtnResetFactory) {
    elBtnResetFactory.onclick = () => {
      if (confirm('Are you sure you want to reset the schedule to factory defaults? All custom slots and presets will be reset to the standard Buana Academy curriculum.')) {
        Storage.resetToFactoryDefaults();
        showToast('Schedule & presets reset to factory defaults', 'success');
        renderScheduleList();
        renderVoicePresetsList();
        loadVoiceSettings();
        populateVoicePresetDropdowns();
      }
    };
  }
}

/**
 * Voice Synthesis Settings Handlers
 */
function bindVoiceSettingsEvents() {
  loadVoiceSettings();

  // Voice toggle
  if (elVoiceEnableToggle) {
    elVoiceEnableToggle.onchange = (e) => {
      const enabled = e.target.checked;
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, voiceEnabled: enabled });
      showToast(enabled ? 'Voice announcements activated' : 'Voice announcements disabled', 'info');
    };
  }

  // Voice Language
  if (elVoiceLangSelect) {
    elVoiceLangSelect.onchange = (e) => {
      const val = e.target.value;
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, voiceLanguage: val });
      showToast(`Language set to: ${e.target.selectedOptions[0].text}`, 'success');
    };
  }

  // Voice Gender / Persona
  if (elVoiceGenderSelect) {
    elVoiceGenderSelect.onchange = (e) => {
      const val = e.target.value;
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, voiceGender: val });
      showToast(`Voice persona: ${e.target.selectedOptions[0].text}`, 'success');
    };
  }

  // Speech Speed / Rate Slider
  if (elVoiceRateSlider && elVoiceRateLabel) {
    elVoiceRateSlider.oninput = (e) => {
      const rate = parseFloat(e.target.value);
      elVoiceRateLabel.textContent = `${rate.toFixed(2)}x`;
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, voiceRate: rate });
    };
  }

  // Warning Checkbox
  if (elVoiceAnnounceWarningCheck) {
    elVoiceAnnounceWarningCheck.onchange = (e) => {
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, voiceAnnounceWarning: e.target.checked });
    };
  }

  // End Checkbox
  if (elVoiceAnnounceEndCheck) {
    elVoiceAnnounceEndCheck.onchange = (e) => {
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, voiceAnnounceEnd: e.target.checked });
    };
  }

  // Test Buttons
  if (elBtnTestSundanese) {
    elBtnTestSundanese.onclick = async () => {
      VoiceEngine.unlock();
      showToast('Testing energetic Sundanese voice announcement...', 'info');
      await VoiceEngine.testSpeech({
        langId: 'sundanese',
        gender: elVoiceGenderSelect ? elVoiceGenderSelect.value : 'alternate',
        toneId: 'energetic'
      });
    };
  }

  if (elBtnTestEnglish) {
    elBtnTestEnglish.onclick = async () => {
      VoiceEngine.unlock();
      showToast('Testing energetic English voice announcement...', 'info');
      await VoiceEngine.testSpeech({
        langId: 'english',
        gender: elVoiceGenderSelect ? elVoiceGenderSelect.value : 'alternate',
        toneId: 'energetic'
      });
    };
  }

  if (elBtnTestArabic) {
    elBtnTestArabic.onclick = async () => {
      VoiceEngine.unlock();
      showToast('Testing Arabic voice announcement...', 'info');
      await VoiceEngine.testSpeech({
        langId: 'arabic',
        gender: elVoiceGenderSelect ? elVoiceGenderSelect.value : 'alternate',
        toneId: 'spiritual'
      });
    };
  }
}

function loadVoiceSettings() {
  const settings = Storage.getSettings();

  if (elVoiceEnableToggle) {
    elVoiceEnableToggle.checked = settings.voiceEnabled !== false;
  }
  if (elVoiceLangSelect && settings.voiceLanguage) {
    elVoiceLangSelect.value = settings.voiceLanguage;
  }
  if (elVoiceGenderSelect && settings.voiceGender) {
    elVoiceGenderSelect.value = settings.voiceGender;
  }
  if (elVoiceRateSlider && settings.voiceRate) {
    elVoiceRateSlider.value = settings.voiceRate;
    if (elVoiceRateLabel) elVoiceRateLabel.textContent = `${parseFloat(settings.voiceRate).toFixed(2)}x`;
  }
  if (elVoiceAnnounceWarningCheck) {
    elVoiceAnnounceWarningCheck.checked = settings.voiceAnnounceWarning !== false;
  }
  if (elVoiceAnnounceEndCheck) {
    elVoiceAnnounceEndCheck.checked = settings.voiceAnnounceEnd !== false;
  }
}

/**
 * Islamic Prayer Times & Dzikir Event Handlers
 */
function bindPrayerScheduleEvents() {
  loadPrayerSchedule();

  const prayerKeys = ['subuh', 'dzikirPagi', 'dhuha', 'dzuhur', 'ashar', 'dzikirPetang', 'maghrib', 'isya'];

  // Input changes
  prayerKeys.forEach(key => {
    const input = document.getElementById(`prayer-time-${key}`);
    if (input) {
      input.onchange = (e) => {
        const val = e.target.value;
        const prayers = Storage.getPrayerSchedule();
        Storage.savePrayerSchedule({ ...prayers, [key]: val });
        showToast(`Updated ${key} time to ${val}`, 'success');
      };
    }
  });

  // Toggles
  const elAdzanToggle = document.getElementById('prayer-adzan-toggle');
  const elPrepareToggle = document.getElementById('prayer-prepare-toggle');
  const elDzikirToggle = document.getElementById('prayer-dzikir-toggle');
  const elDhuhaToggle = document.getElementById('prayer-dhuha-toggle');

  if (elAdzanToggle) {
    elAdzanToggle.onchange = (e) => {
      const prayers = Storage.getPrayerSchedule();
      Storage.savePrayerSchedule({ ...prayers, adzanEnabled: e.target.checked });
      showToast(e.target.checked ? 'Adzan call active' : 'Adzan call disabled', 'info');
    };
  }

  if (elPrepareToggle) {
    elPrepareToggle.onchange = (e) => {
      const prayers = Storage.getPrayerSchedule();
      Storage.savePrayerSchedule({ ...prayers, prepareWarningEnabled: e.target.checked });
      showToast(e.target.checked ? 'Pre-prayer wudhu reminder active' : 'Pre-prayer reminder disabled', 'info');
    };
  }

  if (elDzikirToggle) {
    elDzikirToggle.onchange = (e) => {
      const prayers = Storage.getPrayerSchedule();
      Storage.savePrayerSchedule({ ...prayers, dzikirEnabled: e.target.checked });
    };
  }

  if (elDhuhaToggle) {
    elDhuhaToggle.onchange = (e) => {
      const prayers = Storage.getPrayerSchedule();
      Storage.savePrayerSchedule({ ...prayers, dhuhaReminderEnabled: e.target.checked });
    };
  }

  // Prayer Test Buttons
  const elBtnTestAdzan = document.getElementById('btn-test-adzan');
  const elBtnTestDzikirPagi = document.getElementById('btn-test-dzikir-pagi');
  const elBtnTestDhuha = document.getElementById('btn-test-dhuha');
  const elBtnTestDzikirPetang = document.getElementById('btn-test-dzikir-petang');

  if (elBtnTestAdzan) {
    elBtnTestAdzan.onclick = async () => {
      VoiceEngine.unlock();
      showToast('Playing Adzan Call & Announcement...', 'info');
      await AudioEngine.playAdzanCall();
      setTimeout(async () => {
        await VoiceEngine.speakPrayerAnnouncement({
          type: 'adzan',
          prayerName: 'Ashar',
          settings: Storage.getSettings()
        });
      }, 3500);
    };
  }

  if (elBtnTestDzikirPagi) {
    elBtnTestDzikirPagi.onclick = async () => {
      VoiceEngine.unlock();
      showToast('Playing Dzikir Pagi reminder...', 'info');
      await AudioEngine.playZenBell();
      setTimeout(async () => {
        await VoiceEngine.speakPrayerAnnouncement({
          type: 'dzikirPagi',
          settings: Storage.getSettings()
        });
      }, 1400);
    };
  }

  if (elBtnTestDhuha) {
    elBtnTestDhuha.onclick = async () => {
      VoiceEngine.unlock();
      showToast('Playing Shalat Dhuha reminder...', 'info');
      await AudioEngine.playSoftTwoTone();
      setTimeout(async () => {
        await VoiceEngine.speakPrayerAnnouncement({
          type: 'dhuha',
          settings: Storage.getSettings()
        });
      }, 1200);
    };
  }

  if (elBtnTestDzikirPetang) {
    elBtnTestDzikirPetang.onclick = async () => {
      VoiceEngine.unlock();
      showToast('Playing Dzikir Petang reminder...', 'info');
      await AudioEngine.playSingingBowl();
      setTimeout(async () => {
        await VoiceEngine.speakPrayerAnnouncement({
          type: 'dzikirPetang',
          settings: Storage.getSettings()
        });
      }, 1400);
    };
  }
}

function loadPrayerSchedule() {
  const prayers = Storage.getPrayerSchedule();
  const prayerKeys = ['subuh', 'dzikirPagi', 'dhuha', 'dzuhur', 'ashar', 'dzikirPetang', 'maghrib', 'isya'];

  prayerKeys.forEach(key => {
    const input = document.getElementById(`prayer-time-${key}`);
    if (input && prayers[key]) {
      input.value = prayers[key];
    }
  });

  const elAdzanToggle = document.getElementById('prayer-adzan-toggle');
  const elPrepareToggle = document.getElementById('prayer-prepare-toggle');
  const elDzikirToggle = document.getElementById('prayer-dzikir-toggle');
  const elDhuhaToggle = document.getElementById('prayer-dhuha-toggle');

  if (elAdzanToggle) elAdzanToggle.checked = prayers.adzanEnabled !== false;
  if (elPrepareToggle) elPrepareToggle.checked = prayers.prepareWarningEnabled !== false;
  if (elDzikirToggle) elDzikirToggle.checked = prayers.dzikirEnabled !== false;
  if (elDhuhaToggle) elDhuhaToggle.checked = prayers.dhuhaReminderEnabled !== false;
}

/**
 * Indonesia Raya Mandatory Civic Routine Handlers
 */
function bindIndonesiaRayaEvents() {
  populateIndonesiaRayaVoiceDropdown();
  loadIndonesiaRayaSettings();

  // Enabled toggle
  if (elIndonesiaRayaEnabled) {
    elIndonesiaRayaEnabled.onchange = (e) => {
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, indonesiaRayaEnabled: e.target.checked });
      showToast(e.target.checked ? 'Indonesia Raya civic routine active' : 'Indonesia Raya routine disabled', 'info');
    };
  }

  // Time picker
  if (elIndonesiaRayaTime) {
    elIndonesiaRayaTime.onchange = (e) => {
      const val = e.target.value;
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, indonesiaRayaTime: val });
      showToast(`Anthem time set to ${val}`, 'success');
    };
  }

  // Quick Anthem Time Buttons (09:00, 10:00)
  document.querySelectorAll('.btn-quick-anthem-time').forEach(btn => {
    btn.onclick = () => {
      const time = btn.getAttribute('data-time');
      if (elIndonesiaRayaTime) elIndonesiaRayaTime.value = time;
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, indonesiaRayaTime: time });
      showToast(`Anthem time set to ${time}`, 'success');
    };
  });

  // Spoken Voice Preset
  if (elIndonesiaRayaVoicePreset) {
    elIndonesiaRayaVoicePreset.onchange = (e) => {
      const val = e.target.value;
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, indonesiaRayaVoicePresetId: val });
      showToast('Updated anthem voice preset', 'success');
    };
  }

  // Announcement toggle
  if (elIndonesiaRayaAnnounceEnabled) {
    elIndonesiaRayaAnnounceEnabled.onchange = (e) => {
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, indonesiaRayaAnnouncementEnabled: e.target.checked });
    };
  }

  // Audio mode (synth_acapella vs custom_url)
  if (elIndonesiaRayaAudioMode) {
    elIndonesiaRayaAudioMode.onchange = (e) => {
      const val = e.target.value;
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, indonesiaRayaAudioMode: val });
      showToast(`Anthem audio source: ${val === 'synth_acapella' ? 'Web Audio Acapella Synth' : 'Custom Audio URL'}`, 'info');
    };
  }

  // Custom Audio URL
  if (elIndonesiaRayaCustomUrl) {
    elIndonesiaRayaCustomUrl.onchange = (e) => {
      const val = e.target.value.trim();
      const settings = Storage.getSettings();
      Storage.saveSettings({ ...settings, indonesiaRayaCustomUrl: val });
      showToast('Saved custom anthem audio URL', 'success');
    };
  }

  // Test 1: Spoken Standing Call only
  if (elBtnTestAnthemVoice) {
    elBtnTestAnthemVoice.onclick = async () => {
      VoiceEngine.unlock();
      showToast('Testing standing spoken announcement...', 'info');
      const settings = Storage.getSettings();
      await VoiceEngine.speakAnthemAnnouncement({
        time: elIndonesiaRayaTime ? elIndonesiaRayaTime.value : '10:00',
        presetId: elIndonesiaRayaVoicePreset ? elIndonesiaRayaVoicePreset.value : null,
        settings
      });
    };
  }

  // Test 2: Anthem Audio only
  if (elBtnTestAnthemAudio) {
    elBtnTestAnthemAudio.onclick = async () => {
      AudioEngine.unlock();
      showToast('Playing Indonesia Raya anthem audio...', 'info');
      const settings = Storage.getSettings();
      await AudioEngine.playIndonesiaRaya({
        volume: settings.masterVolume ?? 0.95,
        customUrl: settings.indonesiaRayaAudioMode === 'custom_url' ? settings.indonesiaRayaCustomUrl : null
      });
    };
  }

  // Test 3: Full Routine Flow
  if (elBtnTestAnthemFull) {
    elBtnTestAnthemFull.onclick = async () => {
      VoiceEngine.unlock();
      AudioEngine.unlock();
      showToast('Testing complete Indonesia Raya civic routine flow...', 'info');
      
      const settings = Storage.getSettings();
      // 1. Play opening bell
      await AudioEngine.playZenBell();

      // 2. Announce standing prompt
      setTimeout(async () => {
        if (settings.indonesiaRayaAnnouncementEnabled !== false) {
          await VoiceEngine.speakAnthemAnnouncement({
            time: elIndonesiaRayaTime ? elIndonesiaRayaTime.value : '10:00',
            presetId: elIndonesiaRayaVoicePreset ? elIndonesiaRayaVoicePreset.value : null,
            settings
          });
        }

        // 3. Play Anthem Audio
        setTimeout(async () => {
          await AudioEngine.playIndonesiaRaya({
            volume: settings.masterVolume ?? 0.95,
            customUrl: settings.indonesiaRayaAudioMode === 'custom_url' ? settings.indonesiaRayaCustomUrl : null
          });
        }, 1200);
      }, 1000);
    };
  }
}

function loadIndonesiaRayaSettings() {
  const settings = Storage.getSettings();

  if (elIndonesiaRayaEnabled) {
    elIndonesiaRayaEnabled.checked = settings.indonesiaRayaEnabled !== false;
  }
  if (elIndonesiaRayaTime && settings.indonesiaRayaTime) {
    elIndonesiaRayaTime.value = settings.indonesiaRayaTime;
  }
  if (elIndonesiaRayaVoicePreset && settings.indonesiaRayaVoicePresetId) {
    elIndonesiaRayaVoicePreset.value = settings.indonesiaRayaVoicePresetId;
  }
  if (elIndonesiaRayaAnnounceEnabled) {
    elIndonesiaRayaAnnounceEnabled.checked = settings.indonesiaRayaAnnouncementEnabled !== false;
  }
  if (elIndonesiaRayaAudioMode && settings.indonesiaRayaAudioMode) {
    elIndonesiaRayaAudioMode.value = settings.indonesiaRayaAudioMode;
  }
  if (elIndonesiaRayaCustomUrl && settings.indonesiaRayaCustomUrl) {
    elIndonesiaRayaCustomUrl.value = settings.indonesiaRayaCustomUrl;
  }
}

function populateIndonesiaRayaVoiceDropdown() {
  if (!elIndonesiaRayaVoicePreset) return;
  const presets = Storage.getVoicePresets();

  // Anthem presets prioritized first
  const anthemPresets = presets.filter(p => p.label === 'anthem' || p.type === 'anthem');
  const otherPresets = presets.filter(p => p.label !== 'anthem' && p.type !== 'anthem');

  let html = '<option value="">(Default Standard Indonesian Civic Prompt)</option>';

  if (anthemPresets.length > 0) {
    html += `<optgroup label="🇮🇩 Anthem Specific Presets">
      ${anthemPresets.map(p => `<option value="${p.id}">🇮🇩 ${p.name} [${p.language.toUpperCase()}]</option>`).join('')}
    </optgroup>`;
  }

  if (otherPresets.length > 0) {
    html += `<optgroup label="Other Voice Presets">
      ${otherPresets.map(p => `<option value="${p.id}">🎙️ ${p.name} [${p.language.toUpperCase()}]</option>`).join('')}
    </optgroup>`;
  }

  elIndonesiaRayaVoicePreset.innerHTML = html;

  const settings = Storage.getSettings();
  if (settings.indonesiaRayaVoicePresetId) {
    elIndonesiaRayaVoicePreset.value = settings.indonesiaRayaVoicePresetId;
  }
}

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'info') {
  if (!elToastContainer) return;

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    error: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    info: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  };

  toast.className = `toast glass-panel px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 shadow-2xl ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  elToastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

// Auto-boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}
