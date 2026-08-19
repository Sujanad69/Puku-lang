import React, { useState } from 'react';
import { triggerHaptic } from '../utils/haptics';
import { playSuccessSound, playErrorSound, playTone, speakPt } from '../utils/audio';
import { X, Volume2, Sparkles, BookOpen, ChevronRight, Heart, CheckCircle2, XCircle } from 'lucide-react';

interface StoryModeModalProps {
  onClose: () => void;
  onComplete: (xp: number) => void;
}

export const StoryModeModal: React.FC<StoryModeModalProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const story = [
    {
      text: "Sujan and Amisha are walking by the Douro River in Porto. Sujan looks warmly at her and says...",
      dialogue: "Amisha, tu és tão ______.",
      options: ["linda", "feia", "gato"],
      correct: "linda",
      en: "Amisha, you are so beautiful.",
      fullPt: "Amisha, tu és tão linda."
    },
    {
      text: "She smiles and blushes. They stop by a charming old café in Ribeira. Amisha wants to order.",
      dialogue: "Eu ______ um pastel de nata, por favor.",
      options: ["quero", "não", "adeus"],
      correct: "quero",
      en: "I want a pastel de nata, please.",
      fullPt: "Eu quero um pastel de nata, por favor."
    },
    {
      text: "The waiter brings the fresh warm pastry. They share it, and Sujan gently holds her hand.",
      dialogue: "Eu ______-te muito, Puntey.",
      options: ["odeio", "amo", "como"],
      correct: "amo",
      en: "I love you very much, Puntey.",
      fullPt: "Eu amo-te muito, Puntey."
    }
  ];

  const current = story[step];
  const progress = ((step + 1) / story.length) * 100;

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    
    if (opt === current.correct) {
      playSuccessSound();
      triggerHaptic('success');
      speakPt(current.fullPt);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { title: 'Lovely!', message: '+20 XP', icon: '❤️' }}));
    } else {
      playErrorSound();
      triggerHaptic('error');
    }
  };

  const handleNext = () => {
    if (step < story.length - 1) {
      playTone(560, 'sine', 0.04);
      triggerHaptic('light');
      setStep(step + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(60);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] bg-white dark:bg-[#12141a] border border-slate-200/60 dark:border-slate-800/80 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* ================= HEADER BANNER ================= */}
        <div className="relative bg-gradient-to-br from-[#7e22ce] via-[#9333ea] to-[#c026d3] p-6 text-white text-center overflow-hidden shrink-0">
          
          {/* Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-200 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-pink-300 rounded-full blur-2xl"></div>
          </div>

          {/* Top Actions Bar (No overlap on mobile) */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
            <div className="flex-1" />

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-xs max-w-[200px] sm:max-w-none truncate">
              <BookOpen className="w-3.5 h-3.5 text-purple-200 shrink-0" />
              <span className="truncate">Story • Porto Romance</span>
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
            Romance no Porto 🇵🇹
          </h2>

          <p className="text-xs sm:text-sm text-purple-100 font-medium mt-1 max-w-md mx-auto leading-relaxed">
            Follow the story dialogue and select the missing Portuguese words.
          </p>

          {/* Progress Indicator */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex items-center justify-between text-[11px] font-bold text-purple-100 mb-1 px-1">
              <span>Scene {step + 1} of {story.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-black/25 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-amber-300 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

        </div>

        {/* ================= CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Visual Scene Banner */}
          <div className="w-full h-32 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 border border-purple-200/60 dark:border-purple-900/40 flex items-center justify-center relative overflow-hidden">
            <span className="text-5xl select-none drop-shadow-md">👩🏽‍❤️‍👨🏽</span>
          </div>

          {/* Story Narrative */}
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            {current.text}
          </p>

          {/* Dialogue Fill Box */}
          <div className="bg-slate-50 dark:bg-[#181a22] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white text-center leading-relaxed">
              {current.dialogue.split('______').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className={`inline-block min-w-[90px] border-b-2 px-2 py-0.5 mx-1 transition-all ${
                      isAnswered 
                        ? (selectedOption === current.correct 
                            ? 'text-purple-600 dark:text-purple-400 border-purple-500 font-black' 
                            : 'text-rose-500 border-rose-500 font-bold') 
                        : 'border-slate-400 dark:border-slate-600 text-transparent'
                    }`}>
                      {isAnswered ? selectedOption : '______'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </h3>

            {isAnswered && (
              <div className="pt-2 text-center border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">"{current.en}"</span>
                <button
                  onClick={() => speakPt(current.fullPt)}
                  className="h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center hover:scale-105 cursor-pointer"
                  title="Listen"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Option Choices */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Select Missing Word:
            </span>

            <div className="grid grid-cols-1 gap-2">
              {current.options.map((opt) => {
                let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-400';
                
                if (isAnswered) {
                  if (opt === current.correct) {
                    btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-black shadow-xs';
                  } else if (opt === selectedOption) {
                    btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100';
                  } else {
                    btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 border-transparent';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 rounded-2xl font-black text-base border transition-all cursor-pointer flex items-center justify-between shadow-xs ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && opt === current.correct && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    {isAnswered && opt === selectedOption && opt !== current.correct && (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1015] shrink-0 flex items-center justify-between gap-3">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Story Dialogue Practice</span>
          </span>

          {isAnswered ? (
            <button
              onClick={handleNext}
              className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{step === story.length - 1 ? 'Finish Story' : 'Next Scene'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
            >
              Exit Story
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
