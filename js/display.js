/**
 * Buana Academy Studio Transition Engine - Wall Display Controller
 * Controls index.html for 10" wall-mounted tablet display.
 */

import { Storage, CATEGORIES } from './storage.js';
import { AudioEngine } from './audio-engine.js';
import { VoiceEngine } from './voice-engine.js';
import { Scheduler } from './scheduler.js';

// DOM Elements
const elClock = document.getElementById('studio-clock');
const elDate = document.getElementById('studio-date');
const elDayBadge = document.getElementById('studio-day-badge');
const elAudioStatus = document.getElementById('audio-status-badge');
const elAudioText = document.getElementById('audio-status-text');

// Hero Session Card Elements
const elHeroCard = document.getElementById('hero-session-card');
const elActiveView = document.getElementById('active-session-view');
const elStandbyView = document.getElementById('standby-session-view');

const elSessionCategory = document.getElementById('session-category-badge');
const elSessionTitle = document.getElementById('session-title');
const elSessionTimeRange = document.getElementById('session-time-range');
const elSessionInstructor = document.getElementById('session-instructor');
const elSessionLocation = document.getElementById('session-location');

// Transition Wrap-up Elements
const elTransitionBanner = document.getElementById('transition-banner');
const elTransitionInstruction = document.getElementById('transition-instruction-text');
const elTransitionCountdownDigits = document.getElementById('transition-countdown-digits');
const elTransitionCountdownBox = document.getElementById('transition-countdown-box');

// Progress Elements
const elProgressBar = document.getElementById('session-progress-bar');
const elProgressPercent = document.getElementById('session-progress-percent');
const elTimeElapsed = document.getElementById('session-time-elapsed');
const elTimeRemaining = document.getElementById('session-time-remaining');

// Standby Elements
const elStandbyNextTitle = document.getElementById('standby-next-title');
const elStandbyNextTime = document.getElementById('standby-next-time');
const elStandbyCountdown = document.getElementById('standby-countdown');

// Footer Card (Next Session)
const elFooterCard = document.getElementById('footer-next-card');
const elNextSessionTitle = document.getElementById('next-session-title');
const elNextSessionCategory = document.getElementById('next-session-category');
const elNextSessionTime = document.getElementById('next-session-time');
const elNextSessionLocation = document.getElementById('next-session-location');
const elNextSessionDayNotice = document.getElementById('next-session-day-notice');

// Audio Activation Overlay
const elAudioModal = document.getElementById('audio-activation-overlay');
const elBtnActivateAudio = document.getElementById('btn-activate-audio');

// Fullscreen Button
const elBtnFullscreen = document.getElementById('btn-toggle-fullscreen');

// Simulator Controls (for quick demoing / testing)
const elSimToggle = document.getElementById('btn-toggle-sim');
const elSimPanel = document.getElementById('simulator-panel');
const elSimTimeInput = document.getElementById('sim-time-input');
const elBtnApplySim = document.getElementById('btn-apply-sim');
const elBtnResetSim = document.getElementById('btn-reset-sim');
const elSimStatus = document.getElementById('sim-status');

// Prayer & Dzikir Bar & Banner Elements
const elPrayerScheduleBar = document.getElementById('prayer-schedule-bar');
const elAnthemBanner = document.getElementById('anthem-banner');
const elPrayerBanner = document.getElementById('prayer-banner');
const elPrayerBannerTag = document.getElementById('prayer-banner-tag');
const elPrayerBannerTitle = document.getElementById('prayer-banner-title');
const elPrayerCountdownDigits = document.getElementById('prayer-countdown-digits');

/**
 * Initialize Wall Display
 */
function initWallDisplay() {
  // 1. Audio unlock handler
  setupAudioUnlock();

  // 2. Fullscreen handler
  setupFullscreen();

  // 3. Simulator tools
  setupSimulator();

  // 4. Start scheduler loop
  Scheduler.start(500);
  Scheduler.onTick(renderState);

  // 5. Update audio status badge on state change
  AudioEngine.onStateChange(updateAudioBadge);
  updateAudioBadge(AudioEngine.getContextState());
}

/**
 * Setup Audio Activation overlay to comply with browser autoplay restrictions
 */
function setupAudioUnlock() {
  const unlockAudio = async () => {
    // Immediately dismiss modal overlay
    if (elAudioModal) {
      elAudioModal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        elAudioModal.style.display = 'none';
      }, 250);
    }

    try {
      VoiceEngine.unlock();
      await AudioEngine.initAudioContext();
      updateAudioBadge('running');
      // Subtle welcome chime to confirm audio is active
      AudioEngine.playSoftTwoTone({ volume: 0.35 });
    } catch (err) {
      console.warn('Audio unlock warning:', err);
      updateAudioBadge('running');
    }
  };

  if (elBtnActivateAudio) {
    elBtnActivateAudio.addEventListener('click', unlockAudio);
  }
  if (elAudioModal) {
    elAudioModal.addEventListener('click', (e) => {
      unlockAudio();
    });
  }
}

function updateAudioBadge(state) {
  if (!elAudioStatus || !elAudioText) return;

  if (state === 'running') {
    elAudioStatus.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    elAudioText.textContent = '🔊 Suara & Lonceng Siap';
  } else {
    elAudioStatus.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 cursor-pointer animate-pulse';
    elAudioText.textContent = '🔔 Sentuh untuk Nyalakan Suara';
    elAudioStatus.onclick = () => AudioEngine.initAudioContext();
  }
}

/**
 * Setup fullscreen toggle
 */
function setupFullscreen() {
  if (!elBtnFullscreen) return;

  elBtnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  document.addEventListener('fullscreenchange', () => {
    const isFull = !!document.fullscreenElement;
    elBtnFullscreen.title = isFull ? 'Keluar Layar Penuh' : 'Layar Penuh';
  });
}

/**
 * Render State onto Display
 */
function renderState(state) {
  const {
    timeFormatted,
    dateFormatted,
    dayName,
    activeSlot,
    nextSlot,
    nextDayName,
    isTransition,
    timeElapsedSec,
    timeRemainingSec,
    totalDurationSec,
    progressRatio,
    transitionCountdownSec,
    timeUntilNextSec,
    prayerEvents,
    activePrayerEvent,
    preparePrayerEvent,
    indonesiaRayaActive
  } = state;

  // 1. Clock & Date
  if (elClock) elClock.textContent = timeFormatted;
  if (elDate) elDate.textContent = dateFormatted;
  if (elDayBadge) elDayBadge.textContent = dayName.toUpperCase();

  // 2. Render Top Prayer & Dzikir Bar
  renderPrayerBar(prayerEvents);

  // 3. Render Indonesia Raya Civic Routine Banner
  if (indonesiaRayaActive) {
    if (elAnthemBanner) {
      elAnthemBanner.classList.remove('hidden');
      elAnthemBanner.classList.add('flex');
    }
  } else {
    if (elAnthemBanner) {
      elAnthemBanner.classList.add('hidden');
      elAnthemBanner.classList.remove('flex');
    }
  }

  // 4. Render Prayer / Adzan Active Banner
  let inPrayerState = false;
  if (activePrayerEvent) {
    inPrayerState = true;
    if (elPrayerBanner) {
      elPrayerBanner.classList.remove('hidden');
      elPrayerBanner.classList.add('flex');
    }
    if (elPrayerBannerTag) {
      elPrayerBannerTag.textContent = activePrayerEvent.type === 'prayer' 
        ? `WAKTU SHALAT ${activePrayerEvent.name.toUpperCase()} (${activePrayerEvent.arabicName})`
        : `${activePrayerEvent.name.toUpperCase()} (${activePrayerEvent.arabicName})`;
    }
    if (elPrayerBannerTitle) {
      elPrayerBannerTitle.textContent = activePrayerEvent.type === 'prayer'
        ? `WAKTU ADZAN: Bersiap Wudhu & Luruskan Shaf Shalat Berjamaah`
        : `Waktos Ibadah & Zikir: Hayu sami-sami ngalap katengtraman`;
    }
    if (elPrayerCountdownDigits) {
      elPrayerCountdownDigits.textContent = 'Waktunya Shalat';
    }
  } else if (preparePrayerEvent) {
    inPrayerState = true;
    if (elPrayerBanner) {
      elPrayerBanner.classList.remove('hidden');
      elPrayerBanner.classList.add('flex');
    }
    if (elPrayerBannerTag) {
      elPrayerBannerTag.textContent = `PERSIAPAN SHALAT ${preparePrayerEvent.name.toUpperCase()} (T-MINUS)`;
    }
    if (elPrayerBannerTitle) {
      elPrayerBannerTitle.textContent = `Bersiap Wudhu • Siapkan Matras Shalat • Masuk Shaf`;
    }
    if (elPrayerCountdownDigits) {
      elPrayerCountdownDigits.textContent = Scheduler.formatDuration(preparePrayerEvent.diffSec);
    }
  } else {
    if (elPrayerBanner) {
      elPrayerBanner.classList.add('hidden');
      elPrayerBanner.classList.remove('flex');
    }
  }

  // 4. Active Session vs Standby View
  if (activeSlot) {
    if (elActiveView) elActiveView.classList.remove('hidden');
    if (elStandbyView) elStandbyView.classList.add('hidden');

    // Category styling
    const categoryConfig = CATEGORIES.find(c => c.name === activeSlot.category) || CATEGORIES[0];
    if (elSessionCategory) {
      elSessionCategory.textContent = activeSlot.category;
      elSessionCategory.className = `px-3.5 py-1 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase ${categoryConfig.badgeClass}`;
    }

    if (elSessionTitle) elSessionTitle.textContent = activeSlot.title;
    if (elSessionTimeRange) elSessionTimeRange.textContent = `${activeSlot.startTime} – ${activeSlot.endTime}`;
    if (elSessionInstructor) elSessionInstructor.textContent = activeSlot.instructor || 'Pengajar Buana';
    if (elSessionLocation) elSessionLocation.textContent = activeSlot.location || 'Studio Utama';

    // Progress details
    const percent = Math.min(100, Math.max(0, Math.round(progressRatio * 100)));
    if (elProgressBar) {
      elProgressBar.style.width = `${percent}%`;
    }
    if (elProgressPercent) elProgressPercent.textContent = `${percent}% Selesai`;
    if (elTimeElapsed) elTimeElapsed.textContent = Scheduler.formatDuration(timeElapsedSec);
    if (elTimeRemaining) elTimeRemaining.textContent = Scheduler.formatDuration(timeRemainingSec);

    // 5. Card Transition States
    if (inPrayerState) {
      if (elHeroCard) {
        elHeroCard.classList.remove('state-normal', 'state-transition', 'state-standby');
        elHeroCard.classList.add('state-prayer');
      }
    } else if (isTransition) {
      if (elHeroCard) {
        elHeroCard.classList.remove('state-normal', 'state-standby', 'state-prayer');
        elHeroCard.classList.add('state-transition');
      }

      if (elTransitionBanner) {
        elTransitionBanner.classList.remove('hidden');
        elTransitionBanner.classList.add('flex');
      }

      if (elTransitionInstruction) {
        elTransitionInstruction.textContent = activeSlot.transitionInstruction || 'WAKTU BERES-BERES: Rapikan Boks Proyek • Bersihkan Matras';
      }

      if (elTransitionCountdownBox) {
        elTransitionCountdownBox.classList.remove('hidden');
      }

      if (elTransitionCountdownDigits) {
        elTransitionCountdownDigits.textContent = Scheduler.formatDuration(transitionCountdownSec);
      }

      if (elProgressBar) {
        elProgressBar.classList.remove('bg-cyan-500', 'bg-emerald-500');
        elProgressBar.classList.add('bg-amber-400');
      }
    } else {
      if (elHeroCard) {
        elHeroCard.classList.remove('state-transition', 'state-standby', 'state-prayer');
        elHeroCard.classList.add('state-normal');
      }

      if (elTransitionBanner) {
        elTransitionBanner.classList.add('hidden');
        elTransitionBanner.classList.remove('flex');
      }

      if (elTransitionCountdownBox) {
        elTransitionCountdownBox.classList.add('hidden');
      }

      if (elProgressBar) {
        elProgressBar.classList.remove('bg-amber-400', 'bg-emerald-500');
        elProgressBar.classList.add('bg-cyan-500');
      }
    }
  } else {
    // 6. Standby State (No active session currently)
    if (elActiveView) elActiveView.classList.add('hidden');
    if (elStandbyView) elStandbyView.classList.remove('hidden');

    if (elHeroCard) {
      elHeroCard.classList.remove('state-normal', 'state-transition');
      elHeroCard.classList.add(inPrayerState ? 'state-prayer' : 'state-standby');
    }

    if (nextSlot) {
      if (elStandbyNextTitle) elStandbyNextTitle.textContent = nextSlot.title;
      if (elStandbyNextTime) {
        const dayPrefix = nextDayName !== dayName ? `${nextDayName} pukul ` : 'Hari ini pukul ';
        elStandbyNextTime.textContent = `${dayPrefix}${nextSlot.startTime} (${nextSlot.category})`;
      }
      if (elStandbyCountdown) {
        if (timeUntilNextSec !== null) {
          elStandbyCountdown.textContent = `Mulai dalam ${Scheduler.formatDuration(timeUntilNextSec)}`;
        } else {
          elStandbyCountdown.textContent = `Jadwal hari ${nextDayName}`;
        }
      }
    } else {
      if (elStandbyNextTitle) elStandbyNextTitle.textContent = 'Belum ada kelas berikutnya';
      if (elStandbyNextTime) elStandbyNextTime.textContent = 'Lihat menu admin untuk jadwal kelas';
      if (elStandbyCountdown) elStandbyCountdown.textContent = 'Studio Santai';
    }
  }

  // 7. Footer Upcoming Card
  if (nextSlot && (activeSlot || nextDayName !== dayName)) {
    if (elFooterCard) elFooterCard.classList.remove('opacity-40');
    if (elNextSessionTitle) elNextSessionTitle.textContent = nextSlot.title;
    if (elNextSessionTime) elNextSessionTime.textContent = `${nextSlot.startTime} – ${nextSlot.endTime}`;
    if (elNextSessionLocation) elNextSessionLocation.textContent = nextSlot.location || 'Studio';

    if (elNextSessionDayNotice) {
      if (nextDayName !== dayName) {
        elNextSessionDayNotice.textContent = `[${nextDayName.toUpperCase()}]`;
        elNextSessionDayNotice.classList.remove('hidden');
      } else {
        elNextSessionDayNotice.classList.add('hidden');
      }
    }

    const nextCat = CATEGORIES.find(c => c.name === nextSlot.category) || CATEGORIES[0];
    if (elNextSessionCategory) {
      elNextSessionCategory.textContent = nextSlot.category;
      elNextSessionCategory.className = `px-2.5 py-0.5 rounded-full text-xs font-medium ${nextCat.badgeClass}`;
    }
  } else if (!activeSlot && nextSlot) {
    if (elFooterCard) elFooterCard.classList.remove('opacity-40');
    if (elNextSessionTitle) elNextSessionTitle.textContent = nextSlot.title;
    if (elNextSessionTime) elNextSessionTime.textContent = `${nextSlot.startTime} – ${nextSlot.endTime}`;
    if (elNextSessionLocation) elNextSessionLocation.textContent = nextSlot.location || 'Studio';
  } else {
    if (elFooterCard) elFooterCard.classList.add('opacity-40');
    if (elNextSessionTitle) elNextSessionTitle.textContent = 'No further sessions scheduled';
    if (elNextSessionTime) elNextSessionTime.textContent = '--:--';
    if (elNextSessionCategory) elNextSessionCategory.textContent = 'Open Space';
  }
}

/**
 * Render Prayer Schedule Bar
 */
function renderPrayerBar(prayerEvents) {
  if (!elPrayerScheduleBar || !prayerEvents) return;

  elPrayerScheduleBar.innerHTML = prayerEvents.map(event => {
    let statusClass = 'text-slate-400 bg-slate-900/60 border-slate-800';
    let dotColor = 'bg-slate-600';

    if (event.status === 'active') {
      statusClass = 'text-emerald-300 bg-emerald-500/20 border-emerald-500/50 shadow-md shadow-emerald-500/20 animate-pulse font-bold';
      dotColor = 'bg-emerald-400 animate-ping';
    } else if (event.status === 'prepare') {
      statusClass = 'text-amber-300 bg-amber-500/20 border-amber-500/50 animate-pulse font-bold';
      dotColor = 'bg-amber-400';
    } else if (event.status === 'upcoming') {
      statusClass = 'text-slate-200 bg-slate-800/80 border-slate-700/80';
      dotColor = 'bg-cyan-400';
    }

    return `
      <div class="px-2.5 py-1 rounded-xl border flex items-center gap-1.5 whitespace-nowrap transition-all ${statusClass}">
        <span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span>
        <span>${event.icon}</span>
        <span class="font-bold">${event.name.split(' ')[0]}</span>
        <span class="text-slate-300 font-mono">${event.time}</span>
      </div>
    `;
  }).join('');
}

/**
 * Interactive Time Simulator (for fast QA / verification without changing OS clock)
 */
function setupSimulator() {
  if (!elSimToggle || !elSimPanel) return;

  elSimToggle.addEventListener('click', () => {
    elSimPanel.classList.toggle('hidden');
  });

  if (elBtnApplySim && elSimTimeInput) {
    elBtnApplySim.addEventListener('click', () => {
      const val = elSimTimeInput.value;
      if (!val) return;
      const [h, m] = val.split(':').map(Number);
      const simulated = new Date();
      simulated.setHours(h, m, 0, 0);
      Scheduler.setSimulatedDate(simulated);
      if (elSimStatus) {
        elSimStatus.textContent = `Simulating: ${val}:00`;
        elSimStatus.classList.remove('hidden');
      }
    });
  }

  if (elBtnResetSim) {
    elBtnResetSim.addEventListener('click', () => {
      Scheduler.setSimulatedDate(null);
      if (elSimStatus) {
        elSimStatus.classList.add('hidden');
      }
    });
  }
}

// Auto-boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWallDisplay);
} else {
  initWallDisplay();
}
