/**
 * Buana Academy Studio Transition Engine - Scheduler & Timekeeper Logic
 * Calculates session statuses, elapsed/remaining times, countdown progress,
 * and handles transition/boundary audio event triggers with sub-second accuracy.
 * Also integrates daily Islamic Prayer times (Subuh, Dzuhur, Ashar, Maghrib, Isya),
 * Dzikir Pagi, Shalat Dhuha reminders, Dzikir Petang, and Adzan announcements.
 */

import { Storage, DAYS_OF_WEEK, PRAYER_EVENTS_META } from './storage.js';
import { AudioEngine } from './audio-engine.js';
import { VoiceEngine } from './voice-engine.js';

class SchedulerService {
  constructor() {
    this._listeners = new Set();
    this._intervalId = null;
    this._lastState = null;

    // Trigger debouncers: track which slot IDs, prayer events, and anthem routines have played
    this._playedOpeningSlots = new Set();
    this._playedWarningSlots = new Set();
    this._playedEndSlots = new Set();
    this._playedPrayerTriggers = new Set();
    this._playedAnthemTriggers = new Set();
    this._isAnthemPlaying = false;

    // Support simulated offset for testing if needed
    this._simulatedTimeOffsetMs = 0;

    // Listen to schedule modifications to recalculate immediately
    Storage.onScheduleChange(() => {
      this.tick();
    });
  }

  /**
   * Start timekeeper loop
   */
  start(intervalMs = 500) {
    if (this._intervalId) clearInterval(this._intervalId);
    this.tick();
    this._intervalId = setInterval(() => this.tick(), intervalMs);
  }

  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  /**
   * Subscribe to scheduler state updates (fires on every tick)
   */
  onTick(callback) {
    this._listeners.add(callback);
    if (this._lastState) callback(this._lastState);
    return () => this._listeners.delete(callback);
  }

  /**
   * Set simulated time (useful for debugging specific sessions)
   */
  setSimulatedDate(date) {
    if (!date) {
      this._simulatedTimeOffsetMs = 0;
    } else {
      this._simulatedTimeOffsetMs = date.getTime() - Date.now();
    }
    this.tick();
  }

  getNow() {
    return new Date(Date.now() + this._simulatedTimeOffsetMs);
  }

  /**
   * Convert 'HH:mm' string to total seconds from start of the day
   */
  timeStrToSeconds(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 3600 + (m || 0) * 60;
  }

  /**
   * Format seconds to 'mm:ss' or 'hh:mm:ss'
   */
  formatDuration(totalSec) {
    const sec = Math.max(0, Math.floor(totalSec));
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (hours > 0) {
      return `${hours}h ${pad(mins)}m ${pad(secs)}s`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  }

  /**
   * Core calculus tick
   */
  tick() {
    const now = this.getNow();
    const dayName = DAYS_OF_WEEK[(now.getDay() + 6) % 7]; // Convert JS 0 (Sun) to Monday-based index
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const todaySlots = Storage.getSlotsByDay(dayName);
    const prayerConfig = Storage.getPrayerSchedule();

    let activeSlot = null;
    let nextSlot = null;
    let isTransition = false;
    let timeElapsedSec = 0;
    let timeRemainingSec = 0;
    let totalDurationSec = 0;
    let progressRatio = 0;
    let warningThresholdSec = 600; // default 10m
    let transitionCountdownSec = 0;

    // 1. Identify active session slot
    for (const slot of todaySlots) {
      const startSec = this.timeStrToSeconds(slot.startTime);
      const endSec = this.timeStrToSeconds(slot.endTime);

      if (currentSeconds >= startSec && currentSeconds < endSec) {
        activeSlot = slot;
        totalDurationSec = endSec - startSec;
        timeElapsedSec = currentSeconds - startSec;
        timeRemainingSec = endSec - currentSeconds;
        progressRatio = totalDurationSec > 0 ? timeElapsedSec / totalDurationSec : 0;
        warningThresholdSec = (slot.warningThresholdMin || 10) * 60;

        if (timeRemainingSec <= warningThresholdSec) {
          isTransition = true;
          transitionCountdownSec = timeRemainingSec;
        }
        break;
      }
    }

    // 2. Identify next upcoming session slot
    if (activeSlot) {
      const activeEndSec = this.timeStrToSeconds(activeSlot.endTime);
      nextSlot = todaySlots.find(s => this.timeStrToSeconds(s.startTime) >= activeEndSec) || null;
    } else {
      nextSlot = todaySlots.find(s => this.timeStrToSeconds(s.startTime) > currentSeconds) || null;
    }

    // If no more slots today, find the first slot of the next scheduled day
    let nextDayName = dayName;
    if (!nextSlot) {
      for (let i = 1; i <= 7; i++) {
        const checkDayIndex = (now.getDay() + 6 + i) % 7;
        const checkDay = DAYS_OF_WEEK[checkDayIndex];
        const daySlots = Storage.getSlotsByDay(checkDay);
        if (daySlots.length > 0) {
          nextSlot = daySlots[0];
          nextDayName = checkDay;
          break;
        }
      }
    }

    let timeUntilNextSec = null;
    if (nextSlot && !activeSlot && nextDayName === dayName) {
      const nextStartSec = this.timeStrToSeconds(nextSlot.startTime);
      timeUntilNextSec = Math.max(0, nextStartSec - currentSeconds);
    }

    // 3. Process Prayer & Dzikir Schedule
    const prayerEvents = PRAYER_EVENTS_META.map(meta => {
      const timeStr = prayerConfig[meta.id] || meta.defaultTime;
      const eventSec = this.timeStrToSeconds(timeStr);
      const diffSec = eventSec - currentSeconds;
      
      let status = 'upcoming';
      if (diffSec < -1800) {
        status = 'passed';
      } else if (diffSec <= 0 && diffSec >= -1800) {
        status = 'active'; // In active 30-min prayer/dzikir window
      } else if (diffSec <= (prayerConfig.prepareWarningMin || 10) * 60 && meta.type === 'prayer') {
        status = 'prepare';
      }

      return {
        ...meta,
        time: timeStr,
        eventSec,
        diffSec,
        status
      };
    });

    const activePrayerEvent = prayerEvents.find(p => p.status === 'active') || null;
    const preparePrayerEvent = prayerEvents.find(p => p.status === 'prepare') || null;
    const nextPrayerEvent = prayerEvents.find(p => p.diffSec > 0) || prayerEvents[0];
    const timeUntilNextPrayerSec = nextPrayerEvent ? Math.max(0, nextPrayerEvent.diffSec) : null;

    // 4. Session Audio & Voice Trigger State Machine
    this._handleAudioTriggers({
      activeSlot,
      nextSlot,
      isTransition,
      timeElapsedSec,
      timeRemainingSec,
      currentSeconds
    });

    // 5. Prayer & Dzikir Audio Trigger State Machine
    this._handlePrayerTriggers({
      prayerEvents,
      prayerConfig,
      currentSeconds,
      dayName
    });

    // 6. Indonesia Raya Mandatory Civic Routine Trigger (09:00/10:00 AM)
    const settings = Storage.getSettings();
    this._handleAnthemTrigger({
      currentSeconds,
      dayName,
      settings
    });

    // 7. Construct complete state payload
    const pad = (n) => String(n).padStart(2, '0');
    const timeFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    const dateOptions = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    const dateFormatted = new Intl.DateTimeFormat('en-US', dateOptions).format(now);

    const state = {
      now,
      dayName,
      timeFormatted,
      dateFormatted,
      activeSlot,
      nextSlot,
      nextDayName,
      isTransition,
      timeElapsedSec,
      timeRemainingSec,
      totalDurationSec,
      progressRatio,
      warningThresholdSec,
      transitionCountdownSec,
      timeUntilNextSec,
      audioActive: AudioEngine.isUnlocked,
      // Prayer & Dzikir State
      prayerEvents,
      activePrayerEvent,
      preparePrayerEvent,
      nextPrayerEvent,
      timeUntilNextPrayerSec,
      // Indonesia Raya State
      indonesiaRayaActive: this._isAnthemPlaying,
      indonesiaRayaTime: settings.indonesiaRayaTime || '10:00'
    };

    this._lastState = state;
    this._notify(state);
  }

  /**
   * Evaluates procedural audio and multilingual voice triggers for session transitions
   */
  _handleAudioTriggers({ activeSlot, nextSlot, isTransition, timeElapsedSec, timeRemainingSec }) {
    if (!activeSlot) {
      return;
    }

    const slotCycleKey = `${activeSlot.id}_${activeSlot.day}_${activeSlot.startTime}`;
    const settings = Storage.getSettings();

    // 1. Session Opening Voice Trigger (T-0 start of session, when timeElapsedSec <= 3)
    if (timeElapsedSec <= 3 && !this._playedOpeningSlots.has(slotCycleKey)) {
      this._playedOpeningSlots.add(slotCycleKey);
      console.log(`[Scheduler] 🚀 Triggering Session Opening for "${activeSlot.title}"`);
      AudioEngine.playZenBell({ volume: 0.85 }).catch(e => console.warn('Audio playback error', e));

      if (settings.voiceEnabled !== false && settings.voiceAnnounceOpening !== false) {
        setTimeout(() => {
          const tokens = {
            title: activeSlot.title,
            action: activeSlot.transitionInstruction || 'Focus and collaborate',
            nextTitle: nextSlot ? nextSlot.title : 'the next scheduled session',
            nextTime: nextSlot ? nextSlot.startTime : 'soon',
            minutes: activeSlot.warningThresholdMin || 10
          };

          if (activeSlot.openingVoicePresetId) {
            VoiceEngine.speakFromPreset({
              presetId: activeSlot.openingVoicePresetId,
              tokens,
              settings: { ...settings, voiceTone: 'energetic' }
            }).catch(err => console.warn('Voice preset opening error', err));
          } else {
            VoiceEngine.speakAnnouncement({
              type: 'opening',
              slotTitle: tokens.title,
              actionInstruction: tokens.action,
              nextSlotTitle: tokens.nextTitle,
              nextSlotTime: tokens.nextTime,
              settings: { ...settings, voiceTone: 'energetic' }
            }).catch(err => console.warn('Voice announcement error', err));
          }
        }, 1200);
      }
    }

    // 2. Transition Chime & Voice trigger (e.g. at T-10 min)
    if (isTransition && !this._playedWarningSlots.has(slotCycleKey)) {
      this._playedWarningSlots.add(slotCycleKey);
      console.log(`[Scheduler] 🔔 Triggering Transition Chime & Voice for "${activeSlot.title}"`);
      const preset = activeSlot.audioPreset || 'singing-bowl';
      AudioEngine.playPreset(preset).catch(e => console.warn('Audio playback error', e));

      // Trigger multilingual voice announcement or custom preset after initial chime transient
      if (settings.voiceEnabled !== false && settings.voiceAnnounceWarning !== false) {
        setTimeout(() => {
          const tokens = {
            title: activeSlot.title,
            action: activeSlot.transitionInstruction || 'Store equipment and prepare mats',
            nextTitle: nextSlot ? nextSlot.title : 'the next scheduled session',
            nextTime: nextSlot ? nextSlot.startTime : 'soon',
            minutes: activeSlot.warningThresholdMin || 10
          };

          if (activeSlot.voicePresetId) {
            VoiceEngine.speakFromPreset({
              presetId: activeSlot.voicePresetId,
              tokens,
              settings
            }).catch(err => console.warn('Voice preset announcement error', err));
          } else {
            VoiceEngine.speakAnnouncement({
              type: 'warning',
              slotTitle: tokens.title,
              actionInstruction: tokens.action,
              nextSlotTitle: tokens.nextTitle,
              nextSlotTime: tokens.nextTime,
              warningMinutes: tokens.minutes,
              settings
            }).catch(err => console.warn('Voice announcement error', err));
          }
        }, 1400);
      }
    }

    // 3. Boundary End Gong & Voice trigger (T-0, when session finishes)
    if (timeRemainingSec <= 2 && !this._playedEndSlots.has(slotCycleKey)) {
      this._playedEndSlots.add(slotCycleKey);
      console.log(`[Scheduler] 🥋 Triggering Session End Gong & Voice for "${activeSlot.title}"`);
      const endPreset = activeSlot.endAudioPreset || 'deep-gong';
      AudioEngine.playPreset(endPreset).catch(e => console.warn('Audio playback error', e));

      if (settings.voiceEnabled !== false && settings.voiceAnnounceEnd !== false) {
        setTimeout(() => {
          const tokens = {
            title: activeSlot.title,
            nextTitle: nextSlot ? nextSlot.title : 'the next session',
            nextTime: nextSlot ? nextSlot.startTime : 'soon'
          };

          if (activeSlot.endVoicePresetId) {
            VoiceEngine.speakFromPreset({
              presetId: activeSlot.endVoicePresetId,
              tokens,
              settings
            }).catch(err => console.warn('Voice preset end announcement error', err));
          } else {
            VoiceEngine.speakAnnouncement({
              type: 'end',
              slotTitle: tokens.title,
              nextSlotTitle: tokens.nextTitle,
              nextSlotTime: tokens.nextTime,
              settings
            }).catch(err => console.warn('Voice announcement error', err));
          }
        }, 1400);
      }
    }

    // Clean up old cycle keys periodically
    if (this._playedOpeningSlots.size > 25) this._playedOpeningSlots.clear();
    if (this._playedWarningSlots.size > 25) this._playedWarningSlots.clear();
    if (this._playedEndSlots.size > 25) this._playedEndSlots.clear();
  }

  /**
   * Evaluates Prayer, Adzan & Dzikir Triggers
   */
  _handlePrayerTriggers({ prayerEvents, prayerConfig, currentSeconds, dayName }) {
    const settings = Storage.getSettings();
    if (settings.voiceEnabled === false) return;

    prayerEvents.forEach(event => {
      const eventKey = `${dayName}_${event.id}_${event.time}`;

      // 1. Prepare to Pray Reminder (T-10m before 5 daily prayers)
      if (
        event.type === 'prayer' &&
        prayerConfig.prepareWarningEnabled !== false &&
        event.diffSec <= (prayerConfig.prepareWarningMin || 10) * 60 &&
        event.diffSec > 0
      ) {
        const prepareKey = `${eventKey}_prepare`;
        if (!this._playedPrayerTriggers.has(prepareKey)) {
          this._playedPrayerTriggers.add(prepareKey);
          console.log(`[Scheduler] 🕌 Prepare to Pray reminder for ${event.name}`);
          AudioEngine.playSoftTwoTone({ volume: 0.75 });
          setTimeout(() => {
            VoiceEngine.speakPrayerAnnouncement({
              type: 'preparePrayer',
              prayerName: event.name,
              settings
            });
          }, 1200);
        }
      }

      // 2. Adzan Call for 5 Daily Prayers (T-0)
      if (
        event.hasAdzan &&
        prayerConfig.adzanEnabled !== false &&
        event.diffSec <= 2 &&
        event.diffSec >= -10
      ) {
        const adzanKey = `${eventKey}_adzan`;
        if (!this._playedPrayerTriggers.has(adzanKey)) {
          this._playedPrayerTriggers.add(adzanKey);
          console.log(`[Scheduler] 📢 Adzan Call for ${event.name}`);
          AudioEngine.playAdzanCall({ volume: 0.95 });
          setTimeout(() => {
            VoiceEngine.speakPrayerAnnouncement({
              type: 'adzan',
              prayerName: event.name,
              settings
            });
          }, 3500);
        }
      }

      // 3. Dzikir Pagi Trigger (Morning)
      if (
        event.id === 'dzikirPagi' &&
        prayerConfig.dzikirEnabled !== false &&
        event.diffSec <= 2 &&
        event.diffSec >= -10
      ) {
        const dzikirPagiKey = `${eventKey}_pagi`;
        if (!this._playedPrayerTriggers.has(dzikirPagiKey)) {
          this._playedPrayerTriggers.add(dzikirPagiKey);
          console.log('[Scheduler] 📖 Dzikir Pagi time arrived');
          AudioEngine.playZenBell({ volume: 0.85 });
          setTimeout(() => {
            VoiceEngine.speakPrayerAnnouncement({
              type: 'dzikirPagi',
              settings
            });
          }, 1400);
        }
      }

      // 4. Shalat Dhuha Reminder Trigger (Mid-morning)
      if (
        event.id === 'dhuha' &&
        prayerConfig.dhuhaReminderEnabled !== false &&
        event.diffSec <= 2 &&
        event.diffSec >= -10
      ) {
        const dhuhaKey = `${eventKey}_dhuha`;
        if (!this._playedPrayerTriggers.has(dhuhaKey)) {
          this._playedPrayerTriggers.add(dhuhaKey);
          console.log('[Scheduler] ☀️ Shalat Dhuha reminder triggered');
          AudioEngine.playSoftTwoTone({ volume: 0.85 });
          setTimeout(() => {
            VoiceEngine.speakPrayerAnnouncement({
              type: 'dhuha',
              settings
            });
          }, 1200);
        }
      }

      // 5. Dzikir Petang Trigger (Afternoon after Ashar)
      if (
        event.id === 'dzikirPetang' &&
        prayerConfig.dzikirEnabled !== false &&
        event.diffSec <= 2 &&
        event.diffSec >= -10
      ) {
        const dzikirPetangKey = `${eventKey}_petang`;
        if (!this._playedPrayerTriggers.has(dzikirPetangKey)) {
          this._playedPrayerTriggers.add(dzikirPetangKey);
          console.log('[Scheduler] 📿 Dzikir Petang time arrived');
          AudioEngine.playSingingBowl({ volume: 0.85 });
          setTimeout(() => {
            VoiceEngine.speakPrayerAnnouncement({
              type: 'dzikirPetang',
              settings
            });
          }, 1400);
        }
      }
    });

    if (this._playedPrayerTriggers.size > 50) {
      this._playedPrayerTriggers.clear();
    }
  }

  /**
   * Evaluates Indonesia Raya Mandatory Civic Routine Trigger (09:00 or 10:00 AM)
   */
  _handleAnthemTrigger({ currentSeconds, dayName, settings }) {
    if (!settings || settings.indonesiaRayaEnabled === false) return;
    const anthemTimeStr = settings.indonesiaRayaTime || '10:00';
    const anthemSec = this.timeStrToSeconds(anthemTimeStr);
    const diffSec = anthemSec - currentSeconds;
    const anthemKey = `${dayName}_${anthemTimeStr}_anthem`;

    if (diffSec <= 2 && diffSec >= -15 && !this._playedAnthemTriggers.has(anthemKey)) {
      this._playedAnthemTriggers.add(anthemKey);
      this._isAnthemPlaying = true;
      console.log(`[Scheduler] 🇮🇩 Triggering Lagu Kebangsaan Indonesia Raya at ${anthemTimeStr}`);

      // 1. Opening Ceremonial Chime
      AudioEngine.playZenBell({ volume: 0.9 }).catch(e => console.warn('Anthem bell error', e));

      // 2. Spoken Standing Call
      const hasVoice = settings.voiceEnabled !== false && settings.indonesiaRayaAnnouncementEnabled !== false;
      if (hasVoice) {
        setTimeout(() => {
          VoiceEngine.speakAnthemAnnouncement({
            time: anthemTimeStr,
            presetId: settings.indonesiaRayaVoicePresetId || 'preset_id_anthem',
            settings
          }).catch(err => console.warn('Anthem voice error', err));
        }, 1200);
      }

      // 3. Play Anthem Audio (Procedural Acapella Synth or Custom URL)
      const audioDelay = hasVoice ? 6800 : 1500;
      setTimeout(() => {
        AudioEngine.playIndonesiaRaya({
          customUrl: settings.indonesiaRayaAudioMode === 'custom_url' ? settings.indonesiaRayaCustomUrl : '',
          volume: 0.98
        }).catch(err => console.warn('Anthem audio error', err));

        setTimeout(() => {
          this._isAnthemPlaying = false;
        }, 22000);
      }, audioDelay);
    }

    if (this._playedAnthemTriggers.size > 20) {
      this._playedAnthemTriggers.clear();
    }
  }

  _notify(state) {
    for (const listener of this._listeners) {
      try {
        listener(state);
      } catch (err) {
        console.error('Scheduler listener error:', err);
      }
    }
  }
}

export const Scheduler = new SchedulerService();
