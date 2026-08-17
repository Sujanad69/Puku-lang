import React, { useState } from 'react';
import { Unit, VocabWord } from '../types';
import { speakPt, playTone, playSuccessSound } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface StudyLoungeModalProps {
  unit: Unit;
  onBack: () => void;
  onStartQuiz: () => void;
  onStartFlashcards: () => void;
}

export const StudyLoungeModal: React.FC<StudyLoungeModalProps> = ({
  unit,
  onBack,
  onStartQuiz
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slowMode, setSlowMode] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);

  const progressPercent = ((currentIndex + 1) / unit.words.length) * 100;
  const currentWord = unit.words[currentIndex];

  const handleSpeak = (word: VocabWord) => {
    playTone(580, 'sine', 0.08);
    speakPt(word.pt, slowMode);
  };

  const handleNext = () => {
    if (currentIndex < unit.words.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finished all cards!
      playSuccessSound();
      onStartQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white dark:bg-[#121212] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      
      {/* Top Header - Duolingo Style Progress Bar */}
      <div className="flex items-center justify-between px-4 py-4 pt-safe z-10 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-black/5 dark:border-white/10">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="flex-1 mx-4">
          <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <motion.div
              className="h-full bg-[#58cc02] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
          </div>
        </div>

        <button
          onClick={() => setSlowMode(!slowMode)}
          className={`flex h-10 w-10 items-center justify-center rounded-2xl font-bold transition-all ${
            slowMode
              ? 'bg-[#58cc02]/20 text-[#58cc02]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
          title="Toggle Slow Audio"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
        </button>
      </div>

      {/* Main Flashcard Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden perspective-1000">
        
        <h2 className="absolute top-8 text-xl font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          New Phrase
        </h2>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100, rotateY: 0 }}
            animate={{ opacity: 1, x: 0, rotateY: isFlipped ? 180 : 0 }}
            exit={{ opacity: 0, x: direction * -100, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full max-w-sm aspect-[3/4] relative cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of Card (Portuguese) */}
            <div 
              className="absolute inset-0 w-full h-full rounded-[32px] bg-white dark:bg-[#1e1e20] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border-2 border-slate-100 dark:border-white/5 flex flex-col items-center justify-center p-8 text-center backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); handleSpeak(currentWord); }}
                className="mb-8 p-6 rounded-full bg-[#1CB0F6] text-white hover:scale-105 active:scale-95 transition-transform shadow-[0_8px_0_#1899D6] active:translate-y-2 active:shadow-none"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              </button>
              
              <h3 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white mb-4 leading-tight">
                {currentWord.pt}
              </h3>
              
              <p className="text-lg font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl">
                {currentWord.phonetic}
              </p>

              <div className="absolute bottom-6 text-sm font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l2-9 5 18 2-9h5"/></svg>
                Tap to Translate
              </div>
            </div>

            {/* Back of Card (English) */}
            <div 
              className="absolute inset-0 w-full h-full rounded-[32px] bg-[#1CB0F6] shadow-[0_20px_40px_-15px_rgba(28,176,246,0.3)] border-2 border-[#1899D6] flex flex-col items-center justify-center p-8 text-center backface-hidden"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <h3 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                {currentWord.en}
              </h3>
              {currentWord.note && (
                <p className="text-white/80 font-bold text-lg bg-black/10 px-6 py-3 rounded-2xl mt-4">
                  💡 {currentWord.note}
                </p>
              )}
            </div>

          </motion.div>
        </AnimatePresence>

      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 sm:p-6 bg-white dark:bg-[#121212] border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 pb-safe">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`h-[60px] px-8 rounded-2xl font-black text-lg transition-all ${
            currentIndex === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
              : 'bg-white text-slate-400 border-2 border-slate-200 shadow-[0_4px_0_#e2e8f0] hover:bg-slate-50 active:translate-y-1 active:shadow-none dark:bg-transparent dark:border-slate-700 dark:shadow-[0_4px_0_#334155]'
          }`}
        >
          BACK
        </button>

        <button
          onClick={handleNext}
          className="flex-1 h-[60px] rounded-2xl font-black text-lg text-white bg-[#58cc02] shadow-[0_6px_0_#58a700] hover:bg-[#61e002] active:translate-y-1.5 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          {currentIndex < unit.words.length - 1 ? 'CONTINUE' : 'START QUIZ'}
        </button>
      </div>

    </div>
  );
};
