import React, { useState } from 'react';
import { playSuccessSound } from '../utils/audio';

interface OnboardingModalProps {
  onComplete: () => void;
  lang: 'en' | 'pt';
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, lang }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome, Puntey! ❤️",
      desc: "Sujan made this app just for you. Get ready to learn European Portuguese in the fun, sweet, and easy way!",
      emoji: "🙈",
      color: "bg-rose-500",
      imgPlaceholder: "https://images.unsplash.com/photo-1518020382113-a78b54b8bb26?auto=format&fit=crop&w=400&q=80" // Monkey or cute romantic pic
    },
    {
      title: "Learn Like a Kid 👶",
      desc: "Don't stress about grammar! See the word, hear how to say it, and try repeating it out loud. Just like how kids learn!",
      emoji: "🧠",
      color: "bg-blue-500",
      imgPlaceholder: "https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&w=400&q=80" // Books/learning
    },
    {
      title: "Mistakes are Okay! 💫",
      desc: "Puku is here to help you. If you get it wrong, we'll practice it again. Plus, you get rewards and cute outfits for learning!",
      emoji: "✨",
      color: "bg-amber-500",
      imgPlaceholder: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80" // Positive vibes
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      playSuccessSound();
      onComplete();
    }
  };

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-xl transition-all">
      <div className="relative mx-4 w-full max-w-sm overflow-hidden rounded-[40px] bg-white shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 fade-in duration-500">
        
        {/* Top Image Section */}
        <div className={`relative h-64 w-full ${current.color} transition-colors duration-500 overflow-hidden`}>
          <img 
            src={current.imgPlaceholder} 
            alt="Step graphic"
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl shadow-lg backdrop-blur-md ring-1 ring-white/50">
              {current.emoji}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="flex gap-1.5 mb-6">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i === step ? current.color : 'bg-slate-100'
                }`}
              />
            ))}
          </div>

          <h2 className="mb-3 text-2xl font-black tracking-tight text-slate-900">
            {current.title}
          </h2>
          <p className="text-sm font-medium text-slate-500 leading-relaxed min-h-[80px]">
            {current.desc}
          </p>

          <button
            onClick={handleNext}
            className={`mt-8 flex w-full items-center justify-center rounded-2xl ${current.color} py-4 text-base font-bold text-white shadow-lg active:scale-[0.98] transition-all`}
          >
            {step === steps.length - 1 ? "Start Learning!" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};
