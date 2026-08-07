/**
 * Web Speech API and Audio Synthesizer utilities
 */

export function speakPt(text: string, slow: boolean = false) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-PT';
  utterance.rate = slow ? 0.65 : 0.9;
  utterance.pitch = 1.0;

  // Try to pick an authentic pt-PT voice if available in the browser
  const voices = window.speechSynthesis.getVoices();
  const ptPtVoice = voices.find(v => v.lang === 'pt-PT' || v.lang.startsWith('pt'));
  if (ptPtVoice) {
    utterance.voice = ptPtVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function speakEn(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

// Synthesize pleasant sound effects using Web Audio API
export function playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.15) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio Context not allowed or unsupported
  }
}

export function playSuccessSound() {
  playTone(523.25, 'triangle', 0.12); // C5
  setTimeout(() => playTone(659.25, 'triangle', 0.12), 100); // E5
  setTimeout(() => playTone(783.99, 'triangle', 0.2), 200); // G5
}

export function playErrorSound() {
  playTone(220, 'sawtooth', 0.15); // A3
  setTimeout(() => playTone(185, 'sawtooth', 0.25), 150); // F#3
}

export function playCoinSound() {
  playTone(987.77, 'sine', 0.08); // B5
  setTimeout(() => playTone(1318.51, 'sine', 0.18), 80); // E6
}
