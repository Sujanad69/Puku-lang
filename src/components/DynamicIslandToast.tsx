import React, { useState, useEffect } from 'react';
import { triggerHaptic } from '../utils/haptics';
import { subscribeAudioState, AudioPlaybackState, stopSpeech, speakPt } from '../utils/audio';
import { Volume2, Square, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DynamicIslandToast: React.FC = () => {
  const [toast, setToast] = useState<any>(null);
  const [audioState, setAudioState] = useState<AudioPlaybackState>({
    isPlaying: false,
    text: '',
    lang: 'pt-PT',
    rate: 0.85,
  });

  useEffect(() => {
    const listener = (e: any) => {
      setToast(e.detail);
      triggerHaptic('success');
      setTimeout(() => setToast(null), 3500);
    };
    window.addEventListener('show-toast', listener);

    const unsubAudio = subscribeAudioState((state) => {
      setAudioState(state);
    });

    return () => {
      window.removeEventListener('show-toast', listener);
      unsubAudio();
    };
  }, []);

  const handleReplaySlow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioState.text) {
      triggerHaptic('light');
      speakPt(audioState.text, { slowMode: true });
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    stopSpeech();
  };

  // Determine what to display (Toast has priority if triggered, otherwise active Audio Waveform)
  const isAudioActive = audioState.isPlaying && audioState.text.trim().length > 0;

  return (
    <div className="fixed top-3 left-0 right-0 z-[99999] flex justify-center pointer-events-none px-4 select-none font-['Courier_New',Courier,monospace]">
      <AnimatePresence mode="wait">
        {toast ? (
          <motion.div
            key="toast-pill"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="pointer-events-auto bg-black/90 dark:bg-white/95 text-white dark:text-black px-6 py-3 rounded-[32px] shadow-2xl flex items-center gap-3.5 border border-white/15 dark:border-black/10 backdrop-blur-2xl max-w-md"
          >
            <span className="text-xl drop-shadow-md shrink-0">{toast.icon || '✨'}</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase tracking-widest font-black opacity-60">
                {toast.title || 'PORTUGAL'}
              </span>
              <span className="text-xs font-bold truncate">
                {toast.message}
              </span>
            </div>
          </motion.div>
        ) : isAudioActive ? (
          <motion.div
            key="audio-waveform-pill"
            initial={{ opacity: 0, y: -20, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="pointer-events-auto bg-black/95 dark:bg-[#1c1c1e]/95 text-white px-4 sm:px-5 py-2.5 rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center gap-3.5 border border-white/20 backdrop-blur-2xl max-w-sm sm:max-w-md"
          >
            {/* Animated Speaker Icon */}
            <div className="relative w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-300"></span>
              </span>
            </div>

            {/* Audio Spoken Text */}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-widest font-black text-blue-400">
                  LISBON AUDIO (pt-PT)
                </span>
              </div>
              <span className="text-xs font-bold truncate text-white/95">
                "{audioState.text}"
              </span>
            </div>

            {/* Lively Equalizer Waveform Animation Bars */}
            <div className="flex items-center gap-0.5 sm:gap-1 px-1 h-5 shrink-0">
              {[1, 2, 3, 4, 5, 6].map((bar) => (
                <span
                  key={bar}
                  className="w-1 bg-gradient-to-t from-blue-500 to-cyan-300 rounded-full animate-pulse"
                  style={{
                    height: `${((bar * 7) % 18) + 6}px`,
                    animationDuration: `${0.35 + (bar % 3) * 0.15}s`,
                    animationDelay: `${bar * 60}ms`,
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 shrink-0 pl-1 border-l border-white/15">
              <button
                onClick={handleReplaySlow}
                title="Hear Slow (0.6x)"
                className="p-1 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleStop}
                title="Stop Audio"
                className="p-1 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
