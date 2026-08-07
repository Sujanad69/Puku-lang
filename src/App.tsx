import React, { useState, useEffect } from 'react';
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
import { playSuccessSound } from './utils/audio';

import { MascotIsland } from './components/MascotIsland';
import { WordOfTheDayCard } from './components/WordOfTheDayCard';
import { LoveLanguageCard } from './components/LoveLanguageCard';
import { UnitListCard } from './components/UnitListCard';
import { StudyLoungeModal } from './components/StudyLoungeModal';
import { QuizModal } from './components/QuizModal';
import { MemoryGameModal } from './components/MemoryGameModal';
import { Full3DWardrobe } from './components/Full3DWardrobe';
import { AITutorChat } from './components/AITutorChat';
import { CultureGuidesModal } from './components/CultureGuidesModal';
import { VaultAndStatsModal } from './components/VaultAndStatsModal';
import { FloatingGlassTabBar } from './components/FloatingGlassTabBar';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit1');
  const [speechText, setSpeechText] = useState('Olá! Ready to learn European Portuguese today? ✨');
  const [mascotEmoji, setMascotEmoji] = useState('🐵');
  const [toastText, setToastText] = useState<string | null>(null);

  // Theme & Language Controls
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  // Quiz State
  const [quizPool, setQuizPool] = useState<VocabWord[]>([]);
  const [isQuizLoveUnit, setIsQuizLoveUnit] = useState(false);
  const [isQuizWeakMode, setIsQuizWeakMode] = useState(false);
  const [isQuizRecoveryMode, setIsQuizRecoveryMode] = useState(false);

  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

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
      if (hour < 12) return 'Bom dia, Puku! 🇵🇹';
      if (hour < 20) return 'Boa tarde, Puku! 🇵🇹';
      return 'Boa noite, Puku! 🇵🇹';
    } else {
      if (hour < 12) return 'Good Morning, Puku! 🇵🇹';
      if (hour < 20) return 'Good Afternoon, Puku! 🇵🇹';
      return 'Good Evening, Puku! 🇵🇹';
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
  const handleOpenUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setActiveModal('study');
    const u = UNITS_DATA[unitId];
    if (u) {
      updateSpeech('📚', `Explore ${u.title}! Tap words to listen to the accent!`);
    }
  };

  // Start Quiz for Unit or Practice
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

  const selectedUnit = UNITS_DATA[selectedUnitId] || UNITS_DATA.unit1;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f8f9fa] text-[#1c1c1e]'} font-sans pb-28 transition-colors duration-300`}>
      {/* Top Dynamic Mascot Island Bar */}
      <MascotIsland
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
          <div className="mb-6 flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-xs">
            <button
              onClick={() => setActiveModal('none')}
              className="flex items-center gap-2 font-black text-sm text-[#58cc02] hover:underline cursor-pointer"
            >
              <svg width="20" height="20" className="stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
              <span>{lang === 'pt' ? 'Voltar para Aprender' : 'Back to Learning'}</span>
            </button>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              {activeModal === 'study' && (lang === 'pt' ? 'Módulo de Estudo' : 'Study Lounge')}
              {activeModal === 'quiz' && (lang === 'pt' ? 'Prática Interativa' : 'Practice Quiz')}
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
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {getGreeting()}
                </h1>
                <p className="mt-1 text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400">
                  {lang === 'pt' ? 'Português Europeu para o Sujan' : 'European Portuguese for Sujan'} • Day {progress.streak} Streak 🔥
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-black/5 dark:border-white/10 self-start md:self-auto">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs font-black text-xs text-amber-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.59.833-6 1.83 2.122 3.654 4.542 2.667 8 .5 0 1-.5 1-1.5 1 2 0 5-2.5 5a2.5 2.5 0 0 1-2.5-2.5z"/><path d="M12 22a7.5 7.5 0 0 1-7.5-7.5c0-4.088 3.518-6.19 3.99-6.438.2-.102.443-.075.617.067.174.143.23.38.136.589-1.298 2.879-1.378 4.708-.239 6.208a3.5 3.5 0 0 0 5.012-.016c1.127-1.488 1.05-3.32-.236-6.197-.092-.206-.037-.442.134-.586.17-.144.412-.172.611-.072C14.986 8.317 19.5 10.422 19.5 14.5 19.5 18.636 16.136 22 12 22z"/></svg>
                  <span>{progress.streak} {lang === 'pt' ? 'Dias' : 'Days'}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs font-black text-xs text-rose-500">
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
                  <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-indigo-600 shadow-sm">
                    1/3
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-black mb-1">Daily Quest</h3>
                  <p className="text-indigo-100 text-sm font-semibold mb-4">Complete 3 lessons to earn a special gem!</p>
                  <div className="w-full bg-black/20 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[33%] rounded-full shadow-[0_2px_0_rgba(255,255,255,0.4)_inset]"></div>
                  </div>
                </div>
                <button onClick={() => window.alert("Daily Quests update at midnight!")} className="shrink-0 bg-white text-indigo-600 font-extrabold px-6 py-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-none transition-all">
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

            {/* European Portuguese Learning Modules */}
            <UnitListCard onSelectUnit={handleOpenUnit} />

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

        {/* SUB-MODALS & INTERACTIVE PRACTICE */}
        {activeModal === 'study' && (
          <StudyLoungeModal
            unit={selectedUnit}
            onBack={() => setActiveModal('none')}
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
          <div className="fixed bottom-20 left-1/2 z-[10000] -translate-x-1/2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-7 py-3 text-xs font-black shadow-2xl border border-white/20 max-w-sm text-center">
            {toastText}
          </div>
        )}

      </div>

      {/* Floating Minimalist iOS Glass Tab Bar */}
      <FloatingGlassTabBar
        activeModal={activeModal}
        onChangeTab={setActiveModal}
        lang={lang}
      />
    </div>
  );
}
