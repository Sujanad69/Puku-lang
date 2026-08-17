import { DynamicIslandToast } from './components/DynamicIslandToast';
import { triggerHaptic } from './utils/haptics';
import React, { useState, useEffect } from 'react';
import { useFirebaseProgress } from './hooks/useFirebaseProgress';
import { 
  UserProgress, 
  ActiveModal, 
  OutfitItem, 
  VocabWord 
} from './types';
import { 
  loadUserProgress, 
  saveUserProgress
} from './utils/storage';
import { UNITS_DATA, ALL_WORDS_FLAT } from './data/portugueseData';
import { playSuccessSound, playTone, speakPt } from './utils/audio';

import { MascotIsland } from './components/MascotIsland';
import { WordOfTheDayCard } from './components/WordOfTheDayCard';
import { LoveLanguageCard } from './components/LoveLanguageCard';
import { UnitListCard } from './components/UnitListCard';
import { LessonEngine } from './components/lesson/LessonEngine';
import { QuizModal } from './components/QuizModal';
import { MemoryGameModal } from './components/MemoryGameModal';
import { Full3DWardrobe } from './components/Full3DWardrobe';
import { AITutorChat } from './components/AITutorChat';
import { CultureGuidesModal } from './components/CultureGuidesModal';
import { VaultAndStatsModal } from './components/VaultAndStatsModal';
import { FloatingGlassTabBar } from './components/FloatingGlassTabBar';
import { ConfettiEffect } from './components/ConfettiEffect';
import { PukuCompanion } from './components/PukuCompanion';
import { OnboardingModal } from './components/OnboardingModal';
import { FlashcardModal } from './components/FlashcardModal';
import { StoryModeModal } from './components/StoryModeModal';

export default function App() {
  const { progress, setProgress, user, login, logout } = useFirebaseProgress();
  const [showOnboarding, setShowOnboarding] = useState(!progress.hasSeenOnboarding);
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit1');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [showLessonSelector, setShowLessonSelector] = useState(false);
  const [showUnitHub, setShowUnitHub] = useState(false);
  const [gameMode, setGameMode] = useState<'guided' | 'match' | 'speaking' | 'builder'>('guided');
  const [isGlobalArcade, setIsGlobalArcade] = useState(false);
  const [globalArcadeUnit, setGlobalArcadeUnit] = useState<any>(null);
  const [speechText, setSpeechText] = useState('Olá! Ready to learn European Portuguese today? ✨');
  const [mascotEmoji, setMascotEmoji] = useState('🐵');
  const [toastText, setToastText] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Theme & Language Controls
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<'pt' | 'en'>('en');

  // Quiz State
  const [quizPool, setQuizPool] = useState<VocabWord[]>([]);
  const [isQuizLoveUnit, setIsQuizLoveUnit] = useState(false);
  const [isQuizWeakMode, setIsQuizWeakMode] = useState(false);
  const [isQuizRecoveryMode, setIsQuizRecoveryMode] = useState(false);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Greeting based on time and selected language
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (lang === 'pt') {
      if (hour < 12) return 'Bom dia, Puntey! 🇵🇹';
      if (hour < 20) return 'Boa tarde, Puntey! 🇵🇹';
      return 'Boa noite, Puntey! 🇵🇹';
    } else {
      if (hour < 12) return 'Good Morning, Puntey! 🇵🇹';
      if (hour < 20) return 'Good Afternoon, Puntey! 🇵🇹';
      return 'Good Evening, Puntey! 🇵🇹';
    }
  };

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 3500);
  };

  const updateSpeech = (emoji: string, text: string) => {
    setMascotEmoji(emoji);
    setSpeechText(text);
  };

  // Open Unit Study Lounge
  const handleStartGlobalGame = (mode: 'match' | 'speaking' | 'builder') => {
    const mockUnit = {
      id: 'arcade',
      chapterNum: 0,
      chapterTitle: 'Arcade Mode',
      chapterDesc: 'Practice everything you know!',
      title: 'Global Arcade Practice',
      desc: 'Random words from all units.',
      color: '#8B5CF6',
      iconName: 'Gamepad2',
      words: ALL_WORDS_FLAT
    };
    // @ts-ignore
    setGlobalArcadeUnit(mockUnit);
    setGameMode(mode);
    setIsGlobalArcade(true);
    setActiveModal('study');
  };

  const handleOpenUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setActiveModal('study');
    const u = UNITS_DATA[unitId];
    if (u) {
      updateSpeech('📚', `Explore ${u.title}! Tap words to listen to the accent!`);
    }
  };

  // Start Quiz for Unit or Practice
  const handleStartStory = () => {
    setActiveModal('story');
  };

  const handleStartQuiz = (
    pool: VocabWord[], 
    loveUnit = false, 
    weakMode = false, 
    recoveryMode = false
  ) => {
    setQuizPool(pool);
    setIsQuizLoveUnit(loveUnit);
    setIsQuizWeakMode(weakMode);
    setIsQuizRecoveryMode(recoveryMode);
    setActiveModal('quiz');
    updateSpeech('🎯', 'Take your time and translate carefully!');
  };

  const handleLoseHeart = () => {
    setProgress(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
    updateSpeech('🥺', 'Oops! Lost 1 Heart ❤️. You can refill hearts by practicing weak words!');
  };

  const handleAddWeakWord = (word: VocabWord) => {
    setProgress(prev => {
      if (prev.weakWords.some(w => w.pt === word.pt)) return prev;
      return { ...prev, weakWords: [...prev.weakWords, word] };
    });
  };

  const handleRemoveWeakWord = (wordPt: string) => {
    setProgress(prev => ({
      ...prev,
      weakWords: prev.weakWords.filter(w => w.pt !== wordPt),
    }));
  };

  // Unit Complete Handler
  const handleUnitComplete = (unitId: string, earnedXP: number, earnedCoins: number) => {
    playSuccessSound();
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + earnedXP,
      todayXP: prev.todayXP + earnedXP,
      coins: prev.coins + earnedCoins,
      completedUnits: (prev.completedUnits || []).includes(unitId) ? (prev.completedUnits || []) : [...(prev.completedUnits || []), unitId],
    }));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
    updateSpeech('🎉', 'Lesson complete! Sujan is so proud of you! +50 XP!');
  };

  // Quiz Complete Handler
  const handleQuizComplete = (
    score: number,
    total: number,
    earnedXP: number,
    earnedCoins: number,
    perfectGem: boolean
  ) => {
    playSuccessSound();

    setProgress(prev => ({
      ...prev,
      xp: prev.xp + earnedXP,
      todayXP: prev.todayXP + earnedXP,
      coins: prev.coins + earnedCoins,
      gems: perfectGem ? prev.gems + 1 : prev.gems,
      hearts: isQuizRecoveryMode ? Math.min(5, prev.hearts + 1) : prev.hearts,
    }));

    if (perfectGem) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      showToast(`🏆 Perfect 100%! Earned +${earnedXP} XP, +${earnedCoins} Coins 🪙, and +1 Gem 💎!`);
      updateSpeech('🎉', 'PERFECT SCORE! Sujan is so proud of you! You earned a Gem 💎!');
    } else {
      showToast(`✨ Quiz Complete! Score: ${score}/${total}. Earned +${earnedXP} XP & +${earnedCoins} Coins 🪙!`);
      updateSpeech('🐵', `Great effort! You got ${score}/${total} right! Keep going!`);
    }

    setActiveModal('none');
  };

  // Equipping Outfit
  const handleEquipOutfit = (outfitId: string) => {
    setProgress(prev => ({ ...prev, currentOutfitId: outfitId }));
  };

  // Buying Outfit
  const handleBuyOutfit = (outfit: OutfitItem): boolean => {
    if (outfit.currency === 'gem') {
      if (progress.gems >= outfit.cost) {
        setProgress(prev => ({
          ...prev,
          gems: prev.gems - outfit.cost,
          purchasedOutfits: [...prev.purchasedOutfits, outfit.id],
        }));
        return true;
      }
      return false;
    } else {
      if (progress.coins >= outfit.cost) {
        setProgress(prev => ({
          ...prev,
          coins: prev.coins - outfit.cost,
          purchasedOutfits: [...prev.purchasedOutfits, outfit.id],
        }));
        return true;
      }
      return false;
    }
  };

  const selectedUnit = isGlobalArcade && globalArcadeUnit ? globalArcadeUnit : (UNITS_DATA[selectedUnitId] || UNITS_DATA.unit1);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-black text-slate-100' : 'bg-[#f8f9fa] text-[#1c1c1e]'} font-sans pb-32 md:pb-40 transition-colors duration-300`}>
      {/* Top Dynamic Mascot Island Bar */}
      <MascotIsland
        user={user}
        login={login}
        logout={logout}
        progress={progress}
        speechText={speechText}
        emoji={mascotEmoji}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        lang={lang}
        onToggleLang={() => setLang(prev => prev === 'pt' ? 'en' : 'pt')}
        onOpenVault={() => setActiveModal('vault')}
        onGoHome={() => setActiveModal('none')}
      />

      {/* Main Content Area */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Back Button bar if inside specific tool sub-modals */}
        {(activeModal !== 'none' && activeModal !== 'wardrobe' && activeModal !== 'vault') && (
          <div className="mb-6 flex items-center justify-between bg-white dark:bg-black p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-xs">
            <button
              onClick={() => setActiveModal('none')}
              className="flex items-center gap-2 font-bold text-sm text-[#2563eb] hover:underline cursor-pointer"
            >
              <svg width="20" height="20" className="stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
              <span>{lang === 'pt' ? 'Voltar para Aprender' : 'Back to Learning'}</span>
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {activeModal === 'study' && (lang === 'pt' ? 'Módulo de Estudo' : 'Study Lounge')}
              {activeModal === 'quiz' && (lang === 'pt' ? 'Prática Interativa' : 'Practice Quiz')}
              
        {activeModal === 'story' && (
          <StoryModeModal
            onClose={() => setActiveModal('none')}
            onComplete={(xp) => {
              setProgress(prev => ({
                ...prev,
                xp: prev.xp + xp,
                coins: prev.coins + xp,
                
              }));
              setActiveModal('none');
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
            }}
          />
        )}
  {activeModal === 'memory' && (lang === 'pt' ? 'Jogo da Memória' : 'Memory Game')}
              {activeModal === 'chat' && (lang === 'pt' ? 'Tutor com IA' : 'AI Partner')}
              {activeModal === 'culture' && (lang === 'pt' ? 'Guias de Cultura' : 'Culture Guides')}
            </span>
          </div>
        )}

        {/* TAB 1: LEARNING MATERIALS ONLY */}
        {activeModal === 'none' && (
          <main className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
            
            {/* Minimal Greeting Header Banner */}
            <div className="bg-white dark:bg-black rounded-2xl p-6 border border-black/5 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {getGreeting()}
                </h1>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {lang === 'pt' ? 'Português Europeu para o Sujan' : 'European Portuguese for Sujan'} • Day {progress.streak} Streak 🔥
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/50 p-2 rounded-2xl border border-black/5 dark:border-white/10 self-start md:self-auto">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-black shadow-xs font-bold text-xs text-amber-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.59.833-6 1.83 2.122 3.654 4.542 2.667 8 .5 0 1-.5 1-1.5 1 2 0 5-2.5 5a2.5 2.5 0 0 1-2.5-2.5z"/><path d="M12 22a7.5 7.5 0 0 1-7.5-7.5c0-4.088 3.518-6.19 3.99-6.438.2-.102.443-.075.617.067.174.143.23.38.136.589-1.298 2.879-1.378 4.708-.239 6.208a3.5 3.5 0 0 0 5.012-.016c1.127-1.488 1.05-3.32-.236-6.197-.092-.206-.037-.442.134-.586.17-.144.412-.172.611-.072C14.986 8.317 19.5 10.422 19.5 14.5 19.5 18.636 16.136 22 12 22z"/></svg>
                  <span>{progress.streak} {lang === 'pt' ? 'Dias' : 'Days'}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-black shadow-xs font-bold text-xs text-rose-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  <span>{progress.hearts} {lang === 'pt' ? 'Corações' : 'Hearts'}</span>
                </div>
              </div>
            </div>

            {/* Top Featured Cards: Word of the Day & Love Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WordOfTheDayCard />
              <LoveLanguageCard onOpenLoveUnit={() => handleOpenUnit('unit7')} />
            </div>

            
            {/* Daily Quests Widget */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[28px] p-6 shadow-lg mb-8 text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="shrink-0 relative">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-amber-300" stroke="none"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2z"/></svg>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-600 shadow-sm">
                    1/3
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold mb-1">Daily Quest</h3>
                  <p className="text-indigo-100 text-sm font-semibold mb-4">Complete 3 lessons to earn a special gem!</p>
                  <div className="w-full bg-black/20 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[33%] rounded-full shadow-[0_2px_0_rgba(255,255,255,0.4)_inset]"></div>
                  </div>
                </div>
                <button onClick={() => console.log("Daily Quests update at midnight!")} className="shrink-0 bg-white text-indigo-600 font-semibold px-6 py-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-none transition-all">
                  View Quests
                </button>
              </div>
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="stars" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 5l3.5 10.5 11-1.5-8.5 7 3 11-9.5-6.5L10 32l3-11-8.5-7 11 1.5z" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#stars)" />
                </svg>
              </div>
            </div>

            
            
            {/* Story Mode Button */}
            <div className="flex justify-center mb-8">
              <button onClick={handleStartStory} className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-8 py-3 rounded-full font-black text-lg shadow-[0_8px_30px_rgba(244,63,94,0.4)] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                <span className="text-2xl">📖</span> Play Romance Story
              </button>
            </div>

            {/* European Portuguese Learning Modules */}
            <UnitListCard onSelectUnit={handleOpenUnit} progress={progress} />

{/* Mini Games / Arcade Section */}
            <div className="bg-white dark:bg-[#18181b] rounded-[28px] p-6 border-2 border-slate-100 dark:border-white/5 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#1CB0F6] to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-md">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4"/><path d="M8 10v4"/><circle cx="15" cy="13" r="1"/><circle cx="18" cy="11" r="1"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white">Arcade Hub</h2>
                  <p className="text-[15px] text-slate-500 font-medium">Earn fast XP with quick mini-games!</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={() => handleStartGlobalGame('match')} className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#1CB0F6]/10 text-[#1CB0F6] hover:bg-[#1CB0F6]/20 transition-all border-2 border-[#1CB0F6]/20 active:scale-95 group">
                  <svg className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                  <span className="font-bold text-lg">Match Pairs</span>
                  <span className="text-xs font-semibold opacity-70 mt-1">+20 XP</span>
                </button>
                
                <button onClick={() => handleStartGlobalGame('speaking')} className="flex flex-col items-center justify-center p-5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all border-2 border-purple-500/20 active:scale-95 group">
                  <svg className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  <span className="font-bold text-lg">Speak It</span>
                  <span className="text-xs font-semibold opacity-70 mt-1">+20 XP</span>
                </button>
                
                <button onClick={() => handleStartGlobalGame('builder')} className="flex flex-col items-center justify-center p-5 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 transition-all border-2 border-orange-500/20 active:scale-95 group">
                  <svg className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span className="font-bold text-lg">Builder</span>
                  <span className="text-xs font-semibold opacity-70 mt-1">+20 XP</span>
                </button>
              </div>
            </div>


            

          </main>
        )}

        {/* TAB 2: STYLE SUJAN 3D STUDIO ONLY */}
        {activeModal === 'wardrobe' && (
          <div className="fixed inset-0 z-50 animate-in fade-in zoom-in-95 duration-300">
            <Full3DWardrobe
              progress={progress}
              theme={theme}
              onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              onClose={() => setActiveModal('none')}
              onEquipOutfit={handleEquipOutfit}
              onBuyOutfit={handleBuyOutfit}
            />
          </div>
        )}

        {/* TAB 3: ACHIEVEMENTS & VAULT ONLY */}
        {activeModal === 'vault' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <VaultAndStatsModal
              progress={progress}
              onClose={() => setActiveModal('none')}
              onStartWeakWords={() => {
                if (progress.weakWords.length > 0) {
                  handleStartQuiz(progress.weakWords.slice(0, 5), false, true, false);
                } else {
                  showToast(lang === 'pt' ? "Sem palavras fracas para rever!" : "No weak words to review right now!");
                }
              }}
              onToggleReminders={() => {
                setProgress(prev => ({
                  ...prev,
                  remindersEnabled: !prev.remindersEnabled,
                }));
                showToast(
                  progress.remindersEnabled
                    ? (lang === 'pt' ? 'Lembretes Desativados' : 'Practice Reminders Disabled')
                    : (lang === 'pt' ? 'Lembretes Ativados! 🔔' : 'Practice Reminders Enabled! 🔔')
                );
              }}
            />
          </div>
        )}

        
        
        {/* UNIT HUB MODAL (Full Screen Glossary + Games) */}
        {showUnitHub && selectedUnit && (
          <div className="fixed inset-0 z-[90] flex flex-col bg-[#F9FAFB] dark:bg-[#09090b] animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-5 pt-safe border-b border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
              <button onClick={() => setShowUnitHub(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:scale-105 active:scale-95 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white truncate px-4">{selectedUnit.title}</h2>
              <div className="w-10"></div>
            </div>

            {/* Glossary List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 pb-48">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Vocabulary Overview</h3>
                <p className="text-slate-500 font-medium">Review all phrases in this chapter before playing.</p>
              </div>
              
              {selectedUnit.words.map((word, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#18181b] border-2 border-slate-100 dark:border-white/5 shadow-sm" onClick={() => { playTone(580, 'sine', 0.08); speakPt(word.pt); }}>
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate mb-1">{word.pt}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-400 truncate">{word.en}</span>
                      {word.phonetic && <span className="text-sm text-[#1CB0F6] font-medium opacity-80 truncate">• /{word.phonetic}/</span>}
                    </div>
                  </div>
                  <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#1CB0F6]/10 text-[#1CB0F6]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent dark:from-[#09090b] dark:via-[#09090b] pb-safe-offset-5 space-y-3">
              <button 
                onClick={() => { setShowUnitHub(false); setGameMode('guided'); setShowLessonSelector(true); }}
                className="w-full h-14 rounded-2xl font-black text-lg text-white bg-[#58cc02] shadow-[0_4px_0_#46a302] hover:bg-[#61e002] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                START GUIDED PATH
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setShowUnitHub(false); setGameMode('match'); setActiveModal('study'); }}
                  className="h-12 rounded-xl font-bold text-[15px] text-white bg-[#1CB0F6] shadow-[0_4px_0_#1899D6] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Match Pairs
                </button>
                <button 
                  onClick={() => { setShowUnitHub(false); setGameMode('speaking'); setActiveModal('study'); }}
                  className="h-12 rounded-xl font-bold text-[15px] text-white bg-purple-500 shadow-[0_4px_0_#9333ea] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  Speak It
                </button>
                <button 
                  onClick={() => { setShowUnitHub(false); setGameMode('builder'); setActiveModal('study'); }}
                  className="col-span-2 h-12 rounded-xl font-bold text-[15px] text-white bg-orange-500 shadow-[0_4px_0_#ea580c] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Guess & Build Words
                </button>
              </div>
            </div>
          </div>
        )}


        {/* LESSON SELECTOR MODAL */}
        {showLessonSelector && selectedUnit && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
            <div className="absolute inset-0" onClick={() => setShowLessonSelector(false)} />
            <div className="relative w-full max-w-md bg-white dark:bg-[#18181b] rounded-t-[32px] p-6 pb-safe-offset-6 animate-in slide-in-from-bottom-full duration-300">
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-6" />
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{selectedUnit.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Choose a lesson to practice. This lesson covers all the phrases in this chapter.</p>
              
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 pb-6">
                {Array.from({ length: 1 }).map((_, i) => {
                  const completedCount = progress.completedLessons?.[selectedUnit.id] || 0;
                  const isLocked = i > completedCount;
                  const isCompleted = i < completedCount;
                  const isCurrent = i === completedCount;
                  
                  return (
                    <button
                      key={i}
                      disabled={isLocked}
                      onClick={() => {
                        setSelectedLessonIndex(i);
                        setShowLessonSelector(false);
                        setActiveModal('study');
                      }}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                        isLocked 
                          ? 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-50 cursor-not-allowed'
                          : isCompleted
                            ? 'bg-[#58cc02]/10 border-[#58cc02] text-[#58cc02] hover:bg-[#58cc02]/20'
                            : 'bg-white dark:bg-[#27272a] border-[#1CB0F6] shadow-[0_4px_0_#1899D6] active:translate-y-1 active:shadow-none text-[#1CB0F6]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          isLocked ? 'bg-slate-200 dark:bg-white/10 text-slate-400' : isCompleted ? 'bg-[#58cc02] text-white' : 'bg-[#1CB0F6] text-white'
                        }`}>
                          {isCompleted ? '✓' : isLocked ? '🔒' : i + 1}
                        </div>
                        <div className="text-left">
                          <h3 className={`font-bold text-lg ${isLocked ? 'text-slate-400' : isCompleted ? 'text-[#58cc02]' : 'text-slate-800 dark:text-white'}`}>Lesson {i + 1}</h3>
                          <p className="text-sm font-medium opacity-80">All {selectedUnit.words.length} Phrases</p>
                        </div>
                      </div>
                      {!isLocked && (
                        <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center opacity-50">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}


        {/* SUB-MODALS & INTERACTIVE PRACTICE */}
        {activeModal === 'study' && selectedUnit && (
          <LessonEngine
            unit={selectedUnit}
            lessonIndex={selectedLessonIndex}
            gameMode={gameMode}
            onClose={() => setActiveModal('none')}
            onComplete={() => {
              const xpGain = gameMode === 'guided' ? 50 : 20;
              const coinGain = gameMode === 'guided' ? 10 : 5;
              const newXP = progress.xp + xpGain;
              const newCoins = progress.coins + coinGain;
              
              let updatedCompletedLessons = progress.completedLessons || {};
              let updatedCompletedUnits = progress.completedUnits || [];
              
              if (gameMode === 'guided' && !isGlobalArcade) {
                const currentLessons = progress.completedLessons?.[selectedUnit.id] || 0;
                const nextLessonLevel = Math.max(currentLessons, selectedLessonIndex + 1);
                updatedCompletedLessons = { ...updatedCompletedLessons, [selectedUnit.id]: nextLessonLevel };
                
                if (true && !updatedCompletedUnits.includes(selectedUnit.id)) {
                  updatedCompletedUnits = [...updatedCompletedUnits, selectedUnit.id];
                }
              }

              setProgress(prev => ({
                ...prev,
                xp: newXP,
                todayXP: prev.todayXP + xpGain,
                coins: newCoins,
                completedLessons: updatedCompletedLessons,
                completedUnits: updatedCompletedUnits
              }));

              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000);
              updateSpeech('🎉', gameMode === 'guided' ? 'Lesson complete! Sujan is so proud of you! +' + xpGain + ' XP!' : 'Great practice! +' + xpGain + ' XP earned!');
              setActiveModal('none');
              setIsGlobalArcade(false);
              
              window.dispatchEvent(new CustomEvent('show-toast', { 
                detail: { 
                  title: gameMode === 'guided' ? 'Lesson Complete!' : 'Arcade Complete!', 
                  message: '+' + xpGain + ' XP & ' + coinGain + ' Coins' + (isRareGem ? ' & 1 Gem 💎!' : ' earned'), 
                  icon: '🎉' 
                }
              }));
            }}
          />
        )}

        {activeModal === 'flashcards' && (
          <FlashcardModal
            unit={selectedUnit}
            onClose={() => setActiveModal('study')}
            onStartQuiz={() =>
              handleStartQuiz(
                selectedUnit.words,
                selectedUnit.id === 'unit7',
                false,
                false
              )
            }
          />
        )}

        {activeModal === 'quiz' && (
          <QuizModal
            quizPool={quizPool}
            unitTitle={selectedUnit.title}
            isLoveUnit={isQuizLoveUnit}
            isWeakWordsMode={isQuizWeakMode}
            isRecoveryMode={isQuizRecoveryMode}
            onClose={() => setActiveModal('none')}
            onComplete={handleQuizComplete}
            onLoseHeart={handleLoseHeart}
            onAddWeakWord={handleAddWeakWord}
            onRemoveWeakWord={handleRemoveWeakWord}
          />
        )}

        {activeModal === 'memory' && (
          <MemoryGameModal
            allWords={ALL_WORDS_FLAT}
            onClose={() => setActiveModal('none')}
            onWin={(xp, coins) => {
              setProgress(prev => ({
                ...prev,
                xp: prev.xp + xp,
                
                todayXP: prev.todayXP + xp,
                coins: prev.coins + coins,
              }));
              showToast(`🎉 Memory Match Cleared! +${xp} XP & +${coins} Coins 🪙!`);
            }}
          />
        )}

        {activeModal === 'chat' && (
          <div className="animate-in fade-in duration-300">
            <AITutorChat onClose={() => setActiveModal('none')} />
          </div>
        )}

        {activeModal === 'culture' && (
          <CultureGuidesModal onClose={() => setActiveModal('none')} />
        )}

        {/* Toast Popup */}
        {toastText && (
          <div className="fixed bottom-20 left-1/2 z-[10000] -translate-x-1/2 rounded-full bg-black text-white dark:bg-white dark:text-black px-7 py-3 text-xs font-bold shadow-2xl border border-white/20 max-w-sm text-center">
            {toastText}
          </div>
        )}

      </div>

      
      {/* Global Overlays */}

      {activeModal === 'story' && (
        <StoryModeModal
          onClose={() => setActiveModal('none')}
          onComplete={(xp) => {
            setProgress(prev => ({
              ...prev,
              xp: prev.xp + xp,
                coins: prev.coins + xp,
                
            }));
            setActiveModal('none');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }}
        />
      )}

      {showOnboarding && (
        <OnboardingModal 
          lang={lang} 
          onComplete={() => {
            setProgress(prev => ({ ...prev, hasSeenOnboarding: true }));
            setShowOnboarding(false);
          }} 
        />
      )}
      <DynamicIslandToast />
      <ConfettiEffect active={showConfetti} />
      <PukuCompanion />
      
      {/* Floating Minimalist iOS Glass Tab Bar */
}
      {['none', 'wardrobe', 'vault'].includes(activeModal) && (
        <FloatingGlassTabBar
          activeModal={activeModal}
          onChangeTab={setActiveModal}
          lang={lang}
        />
      )}
    </div>
  );
}
