import React, { useState } from 'react';
import { triggerHaptic } from '../utils/haptics';
import { playSuccessSound, playErrorSound, playTone } from '../utils/audio';

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
      text: "Sujan and Amisha are walking by the Douro River in Porto. Sujan looks at her and says...",
      dialogue: "Amisha, tu és tão ______.",
      options: ["linda", "feia", "gato"],
      correct: "linda",
      en: "Amisha, you are so beautiful."
    },
    {
      text: "She smiles and blushes. They stop by a small café. Amisha wants to order.",
      dialogue: "Eu ______ um pastel de nata, por favor.",
      options: ["quero", "não", "adeus"],
      correct: "quero",
      en: "I want a pastel de nata, please."
    },
    {
      text: "The waiter brings the pastry. They share it. Sujan holds her hand.",
      dialogue: "Eu ______-te muito, Puntey.",
      options: ["odeio", "amo", "como"],
      correct: "amo",
      en: "I love you very much, Puntey."
    }
  ];

  const current = story[step];

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    
    if (opt === current.correct) {
      playSuccessSound();
      triggerHaptic('success');
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { title: 'Lovely!', message: '+20 XP', icon: '❤️' }}));
    } else {
      playErrorSound();
      triggerHaptic('error');
    }
  };

  const handleNext = () => {
    if (step < story.length - 1) {
      setStep(step + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(60);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-white dark:bg-slate-900 flex flex-col animate-in slide-in-from-bottom-10">
      <div className="px-6 py-4 flex items-center justify-between border-b border-black/5 pt-safe">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-black/5 active:scale-95 text-slate-700 dark:text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <span className="font-black text-slate-900 dark:text-white">Romance Story</span>
        <div className="w-10"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32 max-w-lg mx-auto w-full">
        <div className="w-full h-48 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 mb-8 shadow-xl flex items-center justify-center relative overflow-hidden">
          <span className="text-6xl z-10 drop-shadow-lg">👩🏽‍❤️‍👨🏽</span>
          <div className="absolute inset-0 bg-white/20 blur-2xl"></div>
        </div>

        <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6">
          {current.text}
        </p>

        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-black/5 mb-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center leading-tight">
            {current.dialogue.split('______').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`inline-block min-w-[80px] border-b-2 px-2 ${isAnswered ? (selectedOption === current.correct ? 'text-[#2563eb] border-[#2563eb]' : 'text-rose-500 border-rose-500') : 'border-slate-300 text-transparent'}`}>
                    {isAnswered ? selectedOption : '______'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </h3>
          {isAnswered && (
            <p className="text-center mt-4 text-sm font-bold text-slate-500">{current.en}</p>
          )}
        </div>

        <div className="space-y-3">
          {current.options.map((opt) => {
            let style = 'bg-white border border-slate-200 text-slate-700 hover:border-[#2563eb]';
            if (isAnswered) {
              if (opt === current.correct) style = 'bg-[#E8F5E9] border-[#2563eb] text-[#1B5E20] font-black scale-105';
              else if (opt === selectedOption) style = 'bg-[#FFEBEB] border-[#FF4B4B] text-[#C62828] opacity-50';
              else style = 'opacity-30 bg-white border-slate-200';
            }
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl font-bold text-lg transition-all ${style} shadow-sm`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-black/5 animate-in slide-in-from-bottom-10 pt-safe">
          <button
            onClick={handleNext}
            className={`w-full py-4 rounded-2xl font-black text-white text-lg shadow-lg active:scale-95 transition-transform ${selectedOption === current.correct ? 'bg-[#2563eb]' : 'bg-rose-500'}`}
          >
            {step === story.length - 1 ? 'Finish Story' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  );
};
