import { VoiceSettings } from '../types';

export const STORAGE_KEY_VOICE_SETTINGS = 'puku_voice_settings_v2';

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  preset: 'joana',
  rate: 0.85,
  pitch: 1.05,
};

// Global audio playback state broadcaster for Apple Dynamic Island & UI equalizers
export interface AudioPlaybackState {
  isPlaying: boolean;
  text: string;
  lang?: string;
  rate?: number;
}

const playbackListeners = new Set<(state: AudioPlaybackState) => void>();
let currentPlaybackState: AudioPlaybackState = {
  isPlaying: false,
  text: '',
  lang: 'pt-PT',
  rate: 0.85,
};

export const subscribeAudioState = (listener: (state: AudioPlaybackState) => void) => {
  playbackListeners.add(listener);
  listener(currentPlaybackState);
  return () => {
    playbackListeners.delete(listener);
  };
};

export const notifyPlaybackChange = (isPlaying: boolean, text: string = '', lang: string = 'pt-PT', rate: number = 0.85) => {
  currentPlaybackState = { isPlaying, text, lang, rate };
  playbackListeners.forEach((fn) => {
    try {
      fn(currentPlaybackState);
    } catch (_) {}
  });

  // Also dispatch window custom event for broad app accessibility
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app-audio-playback', {
        detail: currentPlaybackState,
      })
    );
  }
};

/**
 * Load Voice Settings from LocalStorage
 */
export const loadVoiceSettings = (): VoiceSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOICE_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_VOICE_SETTINGS,
        ...parsed,
      };
    }
  } catch (_) {}
  return DEFAULT_VOICE_SETTINGS;
};

/**
 * Save Voice Settings to LocalStorage
 */
export const saveVoiceSettings = (settings: VoiceSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY_VOICE_SETTINGS, JSON.stringify(settings));
  } catch (_) {}
};

/**
 * Sound synthesis helper for button clicks, haptic feedback and quiz results
 */
export const playTone = (freq: number = 440, type: OscillatorType = 'sine', duration: number = 0.08, volume: number = 0.12) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (_) {}
};

export const playSuccessSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + index * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  } catch (_) {}
};

export const playErrorSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [330, 260];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + index * 0.12;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  } catch (_) {}
};

/**
 * Retrieve available system speech synthesis voices
 */
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices() || [];
};

const MALE_KEYWORDS = [
  'cristiano', 'duarte', 'helder', 'hélder', 'joaquim', 'jorge', 'joao', 'joão',
  'rodrigo', 'felipe', 'daniel', 'ricardo', 'thiago', 'antonio', 'antónio',
  'manoel', 'manuel', 'miguel', 'pedro', 'tiago', 'andre', 'andré',
  'bernardo', 'vasco', 'afonso', 'goncalo', 'gonçalo', 'guilherme',
  'salvador', 'tomas', 'tomás', 'martim', 'lourenco', 'lourenço',
  'vicente', 'male', 'homem', 'masculin', 'guy', 'david', 'george'
];

const FEMALE_KEYWORDS = [
  'joana', 'luciana', 'catarina', 'ines', 'inês', 'raquel', 'maria', 'ana',
  'beatriz', 'carolina', 'leonor', 'matilde', 'mariana', 'sofia',
  'francisca', 'lara', 'alice', 'camila', 'clara', 'laura', 'margarida',
  'female', 'mulher', 'feminin', 'zira'
];

const isVoiceMale = (v: SpeechSynthesisVoice): boolean => {
  const name = v.name.toLowerCase();
  return MALE_KEYWORDS.some(k => name.includes(k));
};

const isVoiceFemale = (v: SpeechSynthesisVoice): boolean => {
  const name = v.name.toLowerCase();
  return FEMALE_KEYWORDS.some(k => name.includes(k));
};

/**
 * Finds the best matching voice for European Portuguese & specific gender
 */
export const findBestPtVoice = (
  voices: SpeechSynthesisVoice[], 
  preferredURI?: string, 
  preferredGender?: 'female' | 'male'
): SpeechSynthesisVoice | null => {
  if (!voices || voices.length === 0) return null;

  // 1. Direct URI match if user explicitly selected a voice in dropdown
  if (preferredURI) {
    const directMatch = voices.find(v => v.voiceURI === preferredURI);
    if (directMatch) return directMatch;
  }

  // 2. Filter European Portuguese voices (pt-PT / pt_PT)
  const ptPtVoices = voices.filter(v => 
    v.lang.toLowerCase().replace('_', '-') === 'pt-pt' || 
    v.lang.toLowerCase().includes('pt-pt') ||
    v.name.toLowerCase().includes('portugal')
  );

  // 3. Filter All Portuguese voices (pt-PT, pt-BR, pt)
  const allPtVoices = voices.filter(v => v.lang.toLowerCase().startsWith('pt'));

  if (preferredGender === 'male') {
    // A) Try pt-PT Male voice (Duarte, Helder, Joaquim, Jorge, Cristiano, etc.)
    const ptPtMale = ptPtVoices.find(v => isVoiceMale(v));
    if (ptPtMale) return ptPtMale;

    // B) Try all Portuguese Male voices (Felipe, Daniel, Ricardo, Antonio, etc.)
    const anyPtMale = allPtVoices.find(v => isVoiceMale(v));
    if (anyPtMale) return anyPtMale;

    // C) Try any non-explicitly female pt-PT voice
    const ptPtNeutral = ptPtVoices.find(v => !isVoiceFemale(v));
    if (ptPtNeutral) return ptPtNeutral;

    // D) Fallback to pt-PT voice (we apply deep pitch modulation 0.72 in speakPt)
    if (ptPtVoices.length > 0) return ptPtVoices[0];
    if (allPtVoices.length > 0) return allPtVoices[0];
  } else if (preferredGender === 'female') {
    // A) Try pt-PT Female voice (Joana, Luciana, Catarina, Raquel, etc.)
    const ptPtFemale = ptPtVoices.find(v => isVoiceFemale(v));
    if (ptPtFemale) return ptPtFemale;

    // B) Try any Portuguese female voice
    const anyPtFemale = allPtVoices.find(v => isVoiceFemale(v));
    if (anyPtFemale) return anyPtFemale;

    // C) Fallback to pt-PT voice
    if (ptPtVoices.length > 0) return ptPtVoices[0];
    if (allPtVoices.length > 0) return allPtVoices[0];
  }

  // Default: Prefer pt-PT then any Portuguese
  if (ptPtVoices.length > 0) return ptPtVoices[0];
  if (allPtVoices.length > 0) return allPtVoices[0];

  // System fallback
  return voices.find(v => v.default) || voices[0] || null;
};

/**
 * Main European Portuguese Speech Player
 */
export const speakPt = (
  text: string, 
  options?: boolean | { slowMode?: boolean; forceRate?: number; forcePitch?: number }
) => {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const settings = loadVoiceSettings();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';

    // Calculate Rate and Pitch based on preset & options
    let rate = settings.rate || 0.85;
    let pitch = settings.pitch || 1.0;

    if (settings.preset === 'joana') {
      rate = 0.85;
      pitch = 1.05;
    } else if (settings.preset === 'cristiano') {
      // Cristiano Lisbon deep male resonance timbre
      rate = 0.86;
      pitch = 0.72; // Genuine deep male pitch modulation
    } else if (settings.preset === 'lisbon_natural') {
      rate = 0.75;
      pitch = 1.0;
    } else if (settings.preset === 'porto_express') {
      rate = 1.0;
      pitch = 1.0;
    }

    const isSlow = typeof options === 'boolean' ? options : options?.slowMode;
    const forceRate = typeof options === 'object' && options ? options.forceRate : undefined;
    const forcePitch = typeof options === 'object' && options ? options.forcePitch : undefined;

    if (isSlow) {
      rate = 0.6;
    } else if (forceRate !== undefined) {
      rate = forceRate;
    }

    if (forcePitch !== undefined) {
      pitch = forcePitch;
    }

    utterance.rate = Math.max(0.4, Math.min(1.8, rate));
    utterance.pitch = Math.max(0.4, Math.min(1.6, pitch));

    // Assign Voice
    const voices = getAvailableVoices();
    const gender = settings.preset === 'joana' ? 'female' : settings.preset === 'cristiano' ? 'male' : undefined;
    const selectedVoice = findBestPtVoice(voices, settings.voiceURI, gender);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    let isFinished = false;
    const finishSpeech = () => {
      if (!isFinished) {
        isFinished = true;
        notifyPlaybackChange(false, '');
      }
    };

    utterance.onstart = () => {
      notifyPlaybackChange(true, text, 'pt-PT', rate);
    };

    utterance.onend = () => {
      finishSpeech();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      finishSpeech();
    };

    window.speechSynthesis.speak(utterance);

    // Fallback safety timeout in case onend doesn't trigger on some mobile browsers
    const estimatedDuration = Math.max(1200, (text.length * 90) / rate);
    setTimeout(() => {
      if (currentPlaybackState.isPlaying && currentPlaybackState.text === text) {
        finishSpeech();
      }
    }, estimatedDuration + 800);

  } catch (err) {
    console.warn('Speech synthesis failed:', err);
    notifyPlaybackChange(false, '');
  }
};

export const speakEn = (text: string) => {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    const voices = getAvailableVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en')) || null;
    if (enVoice) {
      utterance.voice = enVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('English speech synthesis failed:', err);
  }
};

export const stopSpeech = () => {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch (_) {}
  notifyPlaybackChange(false, '');
};
