import React, { useState } from 'react';
import { Unit } from '../types';
import { speakPt } from '../utils/audio';

interface FlashcardModalProps {
  unit: Unit;
  onClose: () => void;
  onStartQuiz: () => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({ unit, onClose, onStartQuiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const words = unit.words;

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      // Play a soft flip sound or the pronunciation
      speakPt(words[currentIndex].pt, false);
    }
  };

  const progress = ((currentIndex + 1) / words.length) * 100;
  const word = words[currentIndex];

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between px-6 py-4 pt-safe text-white">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <span className="font-bold tracking-widest uppercase text-xs opacity-80">{unit.title}</span>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20 perspective-[1000px]">
        
        {/* 3D Flippable Container */}
        <div 
          className="relative w-full max-w-sm h-[400px] cursor-pointer transition-transform duration-500 transform-style-3d"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
          onClick={handleFlip}
        >
          {/* Front (Portuguese) */}
          <div className="absolute inset-0 w-full h-full rounded-[32px] bg-white dark:bg-[#1c1c1e] shadow-2xl backface-hidden flex flex-col items-center justify-center p-8 border border-black/5 dark:border-white/10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 text-center">
              {word.pt}
            </h2>
            <div className="w-16 h-16 rounded-full bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb]">
              <svg width="28" height="28" className="fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            </div>
            <p className="absolute bottom-8 text-slate-400 font-semibold text-sm tracking-wide">TAP TO FLIP</p>
          </div>

          {/* Back (English/Details) */}
          <div className="absolute inset-0 w-full h-full rounded-[32px] bg-[#2563eb] text-white shadow-2xl backface-hidden flex flex-col items-center justify-center p-8 transform rotate-y-180 border border-black/5">
            <h2 className="text-3xl font-black mb-4 text-center">
              {word.en}
            </h2>
            {word.phonetic && (
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-6">
                [{word.phonetic}]
              </span>
            )}
            {word.note && (
              <div className="bg-black/10 px-6 py-4 rounded-2xl text-center text-sm font-medium mt-4 leading-relaxed">
                💡 {word.note}
              </div>
            )}
            <p className="absolute bottom-8 text-white/50 font-semibold text-sm tracking-wide">TAP TO FLIP BACK</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-12 w-full max-w-sm">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${
              currentIndex === 0 ? 'bg-white/5 text-white/30' : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <div className="font-bold text-white/70 w-16 text-center text-lg">
            {currentIndex + 1} / {words.length}
          </div>

          <button 
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${
              currentIndex === words.length - 1 ? 'bg-white/5 text-white/30' : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        
        {currentIndex === words.length - 1 && (
          <div className="absolute bottom-10 left-6 right-6 flex justify-center">
            <button
              onClick={() => {
                onClose();
                onStartQuiz();
              }}
              className="w-full max-w-sm flex items-center justify-center gap-2 rounded-[20px] bg-amber-400 py-4 font-black text-amber-900 text-lg shadow-[0_8px_30px_rgba(251,191,36,0.3)] active:scale-95 transition-all animate-in slide-in-from-bottom-4"
            >
              Take the Quiz
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .perspective-\\[1000px\\] { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
