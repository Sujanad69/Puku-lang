import React, { useState } from 'react';
import { Unit } from '../types';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { X, Volume2, Sparkles, ChevronLeft, ChevronRight, RotateCw, Play, Layers, Eye } from 'lucide-react';
import { AudioWaveVisualizer } from './AudioWaveVisualizer';
import { WordDetailPreviewModal } from './WordDetailPreviewModal';

interface FlashcardModalProps {
  unit: Unit;
  onClose: () => void;
  onStartQuiz: () => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({ unit, onClose, onStartQuiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const words = unit.words;

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      playTone(560, 'sine', 0.04);
      triggerHaptic('light');
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      playTone(500, 'sine', 0.04);
      triggerHaptic('light');
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
    }
  };

  const handleFlip = () => {
    playTone(620, 'sine', 0.04);
    triggerHaptic('medium');
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      speakPt(words[currentIndex].pt, false);
    }
  };

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playTone(580, 'sine', 0.05);
    triggerHaptic('light');
    setIsPlayingAudio(true);
    speakPt(words[currentIndex].pt);
    setTimeout(() => setIsPlayingAudio(false), 2000);
  };

  const progress = ((currentIndex + 1) / words.length) * 100;
  const word = words[currentIndex] || words[0];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] bg-white dark:bg-[#12141a] border border-slate-200/60 dark:border-slate-800/80 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* ================= HEADER BANNER ================= */}
        <div className="relative bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] p-6 text-white text-center overflow-hidden shrink-0">
          
          {/* Subtle Ambient Shapes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300 rounded-full blur-2xl"></div>
          </div>

          {/* Top Actions Bar (No overlap on mobile) */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
            <div className="flex-1" />

            {/* Top Pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-xs max-w-[200px] sm:max-w-none truncate">
              <Layers className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <span className="truncate">Flashcards • {unit.title}</span>
            </div>

            {/* Close Button */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-md shrink-0"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Flashcard Deck
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1 max-w-md mx-auto leading-relaxed">
            Flip cards to master pronunciation, English translations, and Lisbon context.
          </p>

          {/* Progress Indicator */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-100 mb-1 px-1">
              <span>Card {currentIndex + 1} of {words.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-black/25 rounded-full overflow-hidden p-0.5 backdrop-blur-xs">
              <div 
                className="h-full bg-amber-300 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

        </div>

        {/* ================= CARD BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          
          {/* 3D Flippable Container */}
          <div 
            className="relative w-full max-w-md h-[270px] sm:h-[290px] cursor-pointer transition-transform duration-500 transform-style-3d select-none"
            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
            onClick={handleFlip}
          >
            {/* FRONT (Portuguese) */}
            <div className="absolute inset-0 w-full h-full rounded-[28px] bg-slate-50 dark:bg-[#181a20] shadow-lg backface-hidden flex flex-col items-center justify-between p-6 sm:p-8 border-2 border-blue-100 dark:border-blue-900/40 hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full">
                  🇵🇹 European PT
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTone(580, 'sine', 0.04);
                      triggerHaptic('medium');
                      setShowPreviewModal(true);
                    }}
                    className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-xs"
                    title="Preview Love Examples"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSpeak}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      isPlayingAudio
                        ? 'bg-blue-600 text-white ring-4 ring-blue-300 scale-105'
                        : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white'
                    }`}
                    title="Listen Pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                    {isPlayingAudio && (
                      <AudioWaveVisualizer isPlaying={true} size="xs" color="white" barsCount={5} />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center space-y-2 my-auto">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {word.pt}
                </h3>
                {word.phonetic && (
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span>/{word.phonetic}/</span>
                    <AudioWaveVisualizer isPlaying={isPlayingAudio} size="xs" color="blue" barsCount={5} />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
                <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Tap card to reveal English</span>
              </div>
            </div>

            {/* BACK (English & Details) */}
            <div className="absolute inset-0 w-full h-full rounded-[28px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg backface-hidden flex flex-col items-center justify-between p-6 sm:p-8 transform rotate-y-180 border border-blue-400">
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-100 bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  🇬🇧 Meaning
                </span>

                <button
                  onClick={handleSpeak}
                  className="h-9 w-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-blue-600 flex items-center justify-center transition-all cursor-pointer"
                  title="Listen in Portuguese"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-2 my-auto">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                  {word.en}
                </h3>

                {word.nepali && (
                  <p className="text-xs font-semibold text-blue-100 bg-black/20 px-3 py-1 rounded-lg inline-block">
                    🇳🇵 {word.nepali}
                  </p>
                )}

                {word.note && (
                  <p className="text-[11px] text-blue-100/90 font-medium max-w-xs mx-auto line-clamp-2">
                    💡 {word.note}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-200">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Tap to flip back</span>
              </div>
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-6 w-full max-w-xs">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`h-11 w-11 rounded-full flex items-center justify-center transition-all border cursor-pointer ${
                currentIndex === 0
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-transparent cursor-not-allowed'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-blue-50 active:scale-95 shadow-xs'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="font-mono font-bold text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
              {currentIndex + 1} / {words.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === words.length - 1}
              className={`h-11 w-11 rounded-full flex items-center justify-center transition-all border cursor-pointer ${
                currentIndex === words.length - 1
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-transparent cursor-not-allowed'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-blue-50 active:scale-95 shadow-xs'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1015] shrink-0 flex items-center justify-between gap-3">
          <button
            onClick={handleFlip}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Flip Card</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStartQuiz();
            }}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Take Unit Quiz</span>
          </button>
        </div>

      </div>

      {/* Global Word Detail Preview Modal */}
      {showPreviewModal && word && (
        <WordDetailPreviewModal
          word={word}
          chapterTitle={unit.title}
          onClose={() => setShowPreviewModal(false)}
        />
      )}

      <style>{`
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
