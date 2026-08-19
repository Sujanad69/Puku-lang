// Safe, lazy AudioContext handling to prevent "Failed to start the audio device" errors
let audioCtxInstance: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  try {
    if (typeof window === 'undefined') return null;
    if (!audioCtxInstance) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxInstance = new AudioCtxClass();
      }
    }
    if (audioCtxInstance && audioCtxInstance.state === 'suspended') {
      audioCtxInstance.resume().catch(() => {
        // Ignored if user interaction is pending or audio device is locked
      });
    }
    return audioCtxInstance;
  } catch (err) {
    console.warn('Audio device unavailable:', err);
    return null;
  }
};

export const playTone = (freq: number, type: OscillatorType, duration: number, vol = 0.1) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // Graceful fallback if audio device is unavailable
    console.warn('Could not play tone:', err);
  }
};

export const speakPt = (text: string, slowMode: boolean = false) => {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-PT';
      utterance.rate = slowMode ? 0.6 : 0.85;
      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
      };
      window.speechSynthesis.speak(utterance);
    }
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
  }
};

export const playSuccessSound = () => {
  try {
    playTone(440, 'sine', 0.1);
    setTimeout(() => playTone(660, 'sine', 0.2), 100);
  } catch {
    // Ignored
  }
};

export const playErrorSound = () => {
  try {
    playTone(330, 'square', 0.1);
    setTimeout(() => playTone(220, 'square', 0.2), 100);
  } catch {
    // Ignored
  }
};

export const speakEn = (text: string) => {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
      };
      window.speechSynthesis.speak(utterance);
    }
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
  }
};
