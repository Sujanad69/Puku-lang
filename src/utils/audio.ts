const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playTone = (freq: number, type: OscillatorType, duration: number, vol = 0.1) => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const speakPt = (text: string, slowMode: boolean = false) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    utterance.rate = slowMode ? 0.6 : 0.85;
    window.speechSynthesis.speak(utterance);
  }
};

export const playSuccessSound = () => {
  playTone(440, 'sine', 0.1);
  setTimeout(() => playTone(660, 'sine', 0.2), 100);
};

export const playErrorSound = () => {
  playTone(330, 'square', 0.1);
  setTimeout(() => playTone(220, 'square', 0.2), 100);
};

export const speakEn = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
};
