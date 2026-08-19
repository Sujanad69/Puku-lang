import React, { useState } from 'react';
import { playSuccessSound, playTone, speakPt } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  Sparkles, 
  Volume2, 
  Heart, 
  Check, 
  ChevronRight, 
  ArrowLeft, 
  Flame, 
  Compass, 
  Award,
  Smile,
  Music,
  Target,
  Rocket
} from 'lucide-react';
import { 
  FlagPortugal, 
  PukuMonkeyIcon, 
  BananaIcon, 
  PremiumTrophy, 
  SparkleStarIcon, 
  LoveHeartIcon 
} from './icons/PremiumIcons';

interface OnboardingModalProps {
  onComplete: (preferences?: { nickname: string; dailyGoalXP: number }) => void;
  lang: 'en' | 'pt';
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, lang }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedNickname, setSelectedNickname] = useState('Amisha');
  const [selectedDailyGoal, setSelectedDailyGoal] = useState<number>(50);
  const [hasTestedAudio, setHasTestedAudio] = useState(false);

  const steps = [
    {
      id: 'welcome',
      tag: 'Made with Love',
      title: 'Bem-vinda, Amisha!',
      subtitle: 'European Portuguese made sweet, simple, and romantic by Sujan.',
      accentColor: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900',
      icon: <PukuMonkeyIcon size={46} />
    },
    {
      id: 'method',
      tag: 'The Natural Method',
      title: 'Learn by Sound & Emotion',
      subtitle: 'No stressful grammar rules! Hear native sounds, see visual cues, and speak with confidence.',
      accentColor: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900',
      icon: <Music className="w-10 h-10 text-white" />
    },
    {
      id: 'mascot',
      tag: 'Your Mascot Companion',
      title: 'Meet Puku & Love Notes',
      subtitle: 'Feed Puku bananas, unlock custom outfits, and discover secret love letters from Sujan along the way.',
      accentColor: 'from-amber-500 to-orange-500',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
      icon: <BananaIcon size={46} />
    },
    {
      id: 'goals',
      tag: 'Personalize Journey',
      title: 'Set Your Learning Rhythm',
      subtitle: 'Choose your daily goal and how you like to be cheered on.',
      accentColor: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
      icon: <Target className="w-10 h-10 text-white" />
    },
    {
      id: 'ready',
      tag: 'Lisbon Awaits',
      title: 'Pronta para Lisboa!',
      subtitle: 'You are all set to start your first lesson. Sujan is so proud of you!',
      accentColor: 'from-violet-600 to-purple-600',
      badgeBg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-900',
      icon: <Rocket className="w-10 h-10 text-white" />
    }
  ];

  const handleNext = () => {
    playTone(600, 'sine', 0.04);
    triggerHaptic('light');
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      playSuccessSound();
      triggerHaptic('success');
      onComplete({
        nickname: selectedNickname,
        dailyGoalXP: selectedDailyGoal
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      playTone(450, 'sine', 0.04);
      triggerHaptic('light');
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleTestSpeech = () => {
    playTone(520, 'sine', 0.05);
    triggerHaptic('medium');
    setHasTestedAudio(true);
    speakPt("Olá Amisha! Bem-vinda a Portugal! O Sujan ama-te muito!");
  };

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-md overflow-hidden rounded-[36px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* Top Header Card */}
        <div className={`relative bg-gradient-to-br ${current.accentColor} p-6 text-white text-center transition-all duration-500 overflow-hidden shrink-0`}>
          
          {/* Animated Background Rings */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Step Indicator Pill & Back Button */}
          <div className="flex items-center justify-between mb-2">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="h-8 px-2.5 rounded-full bg-black/20 hover:bg-black/30 flex items-center gap-1 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div className="w-8"></div>
            )}

            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                playSuccessSound();
                onComplete();
              }}
              className="text-[11px] font-bold text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Skip
            </button>
          </div>

          {/* Big Mascot / Hero Vector Icon */}
          <div className="mx-auto my-2 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 shadow-xl backdrop-blur-md border border-white/30 transform hover:scale-105 transition-transform">
            {current.icon}
          </div>

          <div className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md mb-1.5 border border-white/20">
            {current.tag}
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
            {current.title}
          </h2>
          
          <p className="text-xs text-white/90 mt-1 font-medium leading-relaxed max-w-xs mx-auto">
            {current.subtitle}
          </p>

        </div>

        {/* Step-Specific Interactive Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">

          {/* STEP 1: WELCOME */}
          {currentStep === 0 && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 p-4 border border-rose-100 dark:border-rose-900/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Personal Love Project</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  Sujan created this dedicated app so you can naturally learn the real spoken language of Portugal with fun audio, interactive quizzes, and sweet surprises!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="text-xl">🇵🇹</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">European PT</p>
                  <p className="text-[10px] text-slate-400">Authentic Lisbon Accent</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="text-xl">🇳🇵</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">Nepali Bridge</p>
                  <p className="text-[10px] text-slate-400">Nepali phonetic hints</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: KID-STYLE AUDIO TEST */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                European Portuguese has unique rhythmic sounds (like "sh" for S and silent vowels). Tap below to test your audio:
              </p>

              <button
                onClick={handleTestSpeech}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  hasTestedAudio
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 animate-pulse'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">
                      {hasTestedAudio ? "Audio Verified! 🔊" : "Tap to Listen to Lisbon Audio"}
                    </p>
                    <p className="text-[10px] opacity-80">
                      "Olá Amisha! Bem-vinda a Portugal!"
                    </p>
                  </div>
                </div>

                {hasTestedAudio && (
                  <span className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-200">💡 Pro Tip:</p>
                <p>Every word and sentence has native pronunciation. Repeat out loud after Puku speaks!</p>
              </div>
            </div>
          )}

          {/* STEP 3: MASCOT & REWARDS */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-900/40 flex items-center gap-3">
                <span className="text-3xl">🍌</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Puku the Mascot</h4>
                  <p className="text-[11px] text-amber-900 dark:text-amber-200 font-medium">
                    He lives in the bottom corner. Feed him bananas, check his mood, and listen to Sujan's love letters!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-lg">💎</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] mt-0.5">Gems & Coins</p>
                  <p className="text-[9px] text-slate-400">Earn rewards</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-lg">👗</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] mt-0.5">3D Wardrobe</p>
                  <p className="text-[9px] text-slate-400">Unlock outfits</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-lg">💌</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] mt-0.5">Love Letters</p>
                  <p className="text-[9px] text-slate-400">From Sujan</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GOALS & NICKNAME */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  How should Puku & Sujan call you?
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Amisha", "Puntey", "Maya", "Princess", "Bucha"].map(nick => (
                    <button
                      key={nick}
                      type="button"
                      onClick={() => {
                        playTone(700, 'sine', 0.03);
                        triggerHaptic('light');
                        setSelectedNickname(nick);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedNickname === nick
                          ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {nick}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Daily Learning Goal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { xp: 20, time: '5 mins', label: 'Casual', icon: '🌱' },
                    { xp: 50, time: '10 mins', label: 'Regular', icon: '🔥' },
                    { xp: 100, time: '15 mins', label: 'Intense', icon: '⚡' }
                  ].map(g => (
                    <button
                      key={g.xp}
                      type="button"
                      onClick={() => {
                        playTone(650, 'sine', 0.03);
                        triggerHaptic('light');
                        setSelectedDailyGoal(g.xp);
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedDailyGoal === g.xp
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-base">{g.icon}</span>
                      <p className="text-xs font-bold mt-0.5">{g.time}</p>
                      <p className="text-[10px] text-slate-400">{g.xp} XP / day</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: READY TO LAUNCH */}
          {currentStep === 4 && (
            <div className="space-y-3 text-center py-2">
              <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 p-5 border border-violet-200 dark:border-violet-800/50 space-y-2">
                <p className="text-3xl animate-bounce">🇵🇹✨</p>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Tudo pronto, {selectedNickname}!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Your daily goal is set to <strong>{selectedDailyGoal} XP</strong>. Let's start with Unit 1: Greetings & Lisbon Essentials!
                </p>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                "O amor não tem fronteiras." (Love has no borders.) ❤️
              </p>
            </div>
          )}

        </div>

        {/* Footer Action Button */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 shrink-0">
          <button
            onClick={handleNext}
            className={`w-full py-4 rounded-2xl bg-gradient-to-r ${current.accentColor} text-white font-bold text-sm shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer`}
          >
            <span>{currentStep === steps.length - 1 ? "Bora lá! Start Learning 🚀" : "Continue"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
