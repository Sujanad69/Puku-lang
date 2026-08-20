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
  saveUserProgress,
  INITIAL_PROGRESS
} from './utils/storage';
import { UNITS_DATA, ALL_WORDS_FLAT } from './data/portugueseData';
import { playSuccessSound, playTone, speakPt } from './utils/audio';
import { calculateSRSUpdate, getSRSStats, seedInitialSRSRecords } from './utils/srsEngine';

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
import { AuthModal } from './components/AuthModal';
import { AuthWelcomeScreen } from './components/AuthWelcomeScreen';
import { LovePhrasesModal } from './components/LovePhrasesModal';
import { FlashcardModal } from './components/FlashcardModal';
import { StoryModeModal } from './components/StoryModeModal';
import { SurvivalSimulatorModal } from './components/SurvivalSimulatorModal';
import { NepaliBridgeModal } from './components/NepaliBridgeModal';
import { PortugalJourneyMapModal } from './components/PortugalJourneyMapModal';
import { EuroCashierModal } from './components/EuroCashierModal';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { ArcadeHubSection } from './components/ArcadeHubSection';
import { LisboaHeroBanner } from './components/LisboaHeroBanner';
import { LisboaTabNav, HomeTab } from './components/LisboaTabNav';
import { DiscoveryCarousel } from './components/DiscoveryCarousel';
import { getDailyQuests } from './utils/quests';
import { getNepalDateString } from './utils/date';
import { PlaneIcon, WaveformIcon, ChevronRightIcon } from './components/icons/AppleIcons';
import { MapPin, Coins, Gem, Sparkles, Gift, Brain, Lock, Check } from 'lucide-react';
import { FlagPortugal, FlagNepal, PremiumTrophy, GoldCoin } from './components/icons/PremiumIcons';

export default function App() {
  const { 
    progress, 
    setProgress, 
    user, 
    loading,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    sendPasswordReset,
    logout 
  } = useFirebaseProgress();

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
  const [homeTab, setHomeTab] = useState<HomeTab>('path');

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

  // Greeting based on time and selected language (Nepal Time)
  const getGreeting = () => {
    const nepalTimeOptions: Intl.DateTimeFormatOptions = { 
      timeZone: 'Asia/Kathmandu',
      hour: 'numeric',
      hour12: false
    };
    const hour = parseInt(new Intl.DateTimeFormat('en-US', nepalTimeOptions).format(new Date()), 10);
    
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
      const isAlreadyWeak = prev.weakWords.some(w => w.pt === word.pt);
      const updatedWeak = isAlreadyWeak ? prev.weakWords : [...prev.weakWords, word];
      
      // Update SRS as 'again' / due
      const currentSRS = prev.srsRecords?.[word.pt];
      const updatedItem = calculateSRSUpdate(currentSRS, 'again', {
        pt: word.pt,
        en: word.en,
        phonetic: word.phonetic,
        nepali: word.nepali,
      });

      return {
        ...prev,
        weakWords: updatedWeak,
        srsRecords: {
          ...(prev.srsRecords || {}),
          [word.pt]: updatedItem,
        },
      };
    });
  };

  const handleRemoveWeakWord = (wordPt: string) => {
    setProgress(prev => {
      const currentSRS = prev.srsRecords?.[wordPt];
      const wordObj = ALL_WORDS_FLAT.find(w => w.pt === wordPt) || { pt: wordPt, en: wordPt };
      const updatedItem = calculateSRSUpdate(currentSRS, 'good', wordObj);

      return {
        ...prev,
        weakWords: prev.weakWords.filter(w => w.pt !== wordPt),
        srsRecords: {
          ...(prev.srsRecords || {}),
          [wordPt]: updatedItem,
        },
      };
    });
  };

  // Quest Progress Incrementer
  const incrementQuestProgress = (type: 'quiz' | 'survival' | 'cashier' | 'map' | 'perfect') => {
    const today = getNepalDateString();
    const questMap: Record<string, string> = {
      quiz: 'quest_quiz',
      perfect: 'quest_perfect',
      survival: 'quest_survival',
      cashier: 'quest_cashier',
      map: 'quest_map',
    };
    const targetQuestId = questMap[type];
    if (!targetQuestId) return;

    setProgress(prev => {
      const quests = { ...(prev.quests || {}) };
      const currentEntry = quests[targetQuestId] && quests[targetQuestId].date === today
        ? quests[targetQuestId]
        : { current: 0, isClaimed: false, date: today };

      quests[targetQuestId] = {
        ...currentEntry,
        current: currentEntry.current + 1,
        date: today,
      };

      return {
        ...prev,
        quests,
      };
    });
  };

  // Unit Complete Handler
  const handleUnitComplete = (unitId: string, earnedXP: number, earnedCoins: number) => {
    playSuccessSound();
    incrementQuestProgress('quiz');
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
    incrementQuestProgress('quiz');
    const isFlawless = score === total;
    const isHighScore = score >= Math.ceil(total * 0.8);
    // Gems are ultra-rare prestige tokens: earned ONLY on 100% flawless mastery!
    const gemReward = isFlawless ? 1 : 0;
    const coinReward = isFlawless ? Math.max(earnedCoins, 30) : isHighScore ? Math.max(earnedCoins, 20) : Math.max(earnedCoins, 10);
    const xpReward = isFlawless ? Math.max(earnedXP, 40) : Math.max(earnedXP, 25);

    if (isFlawless) {
      incrementQuestProgress('perfect');
    }

    setProgress(prev => ({
      ...prev,
      xp: prev.xp + xpReward,
      todayXP: prev.todayXP + xpReward,
      coins: prev.coins + coinReward,
      gems: prev.gems + gemReward,
      hearts: isQuizRecoveryMode ? Math.min(5, prev.hearts + 1) : prev.hearts,
    }));

    if (isFlawless) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      showToast(`FLAWLESS 100%! +${xpReward} XP, +${coinReward} Coins, and +1 Rare Gem 💎!`);
      updateSpeech('🎉', 'PERFECT SCORE! Sujan is so proud of you! +1 Rare Gem earned! 💎');
    } else if (isHighScore) {
      showToast(`Great Score: ${score}/${total}! +${xpReward} XP & +${coinReward} Coins 🪙!`);
      updateSpeech('🐵', `Super work! Score: ${score}/${total}! Keep going to earn Gems on 100%! 🌟`);
    } else {
      showToast(`Quiz Complete! Score: ${score}/${total}. +${xpReward} XP & +${coinReward} Coins 🪙!`);
      updateSpeech('🐵', `Good practice! You got ${score}/${total} right! Keep going!`);
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

  // Economy Shop Transactions
  const handleBuyHeartRefill = () => {
    setProgress(prev => ({
      ...prev,
      hearts: 5,
      coins: Math.max(0, prev.coins - 100),
    }));
  };

  const handleBuyStreakFreeze = () => {
    setProgress(prev => ({
      ...prev,
      gems: Math.max(0, prev.gems - 2),
      streakFrozen: true,
      streakFreezeCount: (prev.streakFreezeCount || 0) + 1,
    }));
  };

  const handleConvertCoinsToGem = () => {
    setProgress(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins - 300),
      gems: prev.gems + 1,
    }));
  };

  // Claim Daily Quest Reward
  const handleClaimQuest = (questId: string, xp: number, coins: number, gems: number) => {
    const today = getNepalDateString();
    setProgress(prev => {
      const quests = { ...(prev.quests || {}) };
      const currentEntry = quests[questId] || { current: 0, isClaimed: false, date: today };
      quests[questId] = {
        ...currentEntry,
        isClaimed: true,
        date: today,
      };

      return {
        ...prev,
        xp: prev.xp + xp,
        todayXP: prev.todayXP + xp,
        coins: prev.coins + coins,
        gems: prev.gems + gems,
        quests,
      };
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  };

  const handleCompleteSurvivalScenario = (scenarioId: string, xpEarned: number, coinsEarned: number) => {
    const isRareGem = Math.random() < 0.15; // 15% bonus gem chance
    const gemGain = isRareGem ? 1 : 0;
    incrementQuestProgress('survival');
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + xpEarned,
      todayXP: prev.todayXP + xpEarned,
      coins: prev.coins + coinsEarned,
      gems: prev.gems + gemGain,
    }));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
    showToast(
      isRareGem
        ? `Portugal Mission Mastered! +${xpEarned} XP, +${coinsEarned} Coins & +1 Gem!`
        : `Portugal Mission Mastered! +${xpEarned} XP & +${coinsEarned} Coins!`
    );
  };

  const selectedUnit = isGlobalArcade && globalArcadeUnit ? globalArcadeUnit : (UNITS_DATA[selectedUnitId] || UNITS_DATA.unit1);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060e1d] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!progress.hasSeenOnboarding) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-black text-white' : 'bg-transparent text-black'} relative`}>
        <OnboardingModal 
          lang={lang} 
          onComplete={(prefs) => {
            setProgress(prev => ({ 
              ...prev, 
              hasSeenOnboarding: true,
              dailyGoalXP: prefs?.dailyGoalXP || prev.dailyGoalXP || 50
            }));
            if (prefs?.nickname) {
              updateSpeech('🎉', `Bem-vinda, ${prefs.nickname}! Let's start Unit 1! ✨`);
            }
          }} 
        />
      </div>
    );
  }

  if (!user) {
    return (
      <AuthWelcomeScreen
        loginWithGoogle={loginWithGoogle}
        loginWithEmail={loginWithEmail}
        signupWithEmail={signupWithEmail}
        sendPasswordReset={sendPasswordReset}
        onSuccess={(msg) => {
          showToast(msg);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-black text-white' : 'bg-transparent text-black'} pb-32 md:pb-40 transition-colors duration-300`} style={{ fontFamily: 'var(--ios-font-stack)' }}>
      {/* Top Dynamic Mascot Island Bar */}
      <MascotIsland
        user={user}
        onOpenAuth={() => setActiveModal('auth')}
        logout={logout}
        progress={progress}
        speechText={speechText}
        emoji={mascotEmoji}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        lang={lang}
        onToggleLang={() => setLang(prev => prev === 'pt' ? 'en' : 'pt')}
        onOpenVault={() => setActiveModal('vault')}
        onOpenQuests={() => setActiveModal('quests')}
        onOpenVoiceSettings={() => setActiveModal('voiceSettings')}
        onGoHome={() => setActiveModal('none')}
      />

      {/* Main Content Area */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Back Button bar if inside specific tool sub-modals */}
        {(activeModal !== 'none' && activeModal !== 'wardrobe' && activeModal !== 'vault') && (
          <div className="mb-8 flex items-center justify-between ios-card p-4">
            <button
              onClick={() => setActiveModal('none')}
              className="flex items-center gap-2 font-bold text-[15px] text-[#0a84ff] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <svg width="20" height="20" className="stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              <span>{lang === 'pt' ? 'Voltar' : 'Back'}</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-1.5">
              {activeModal === 'study' && (lang === 'pt' ? 'Módulo de Estudo' : 'Study Lounge')}
              {activeModal === 'quiz' && (lang === 'pt' ? 'Prática Interativa' : 'Practice Quiz')}
              {activeModal === 'story' && (lang === 'pt' ? 'História Interativa' : 'Story Mode')}
              {activeModal === 'memory' && (lang === 'pt' ? 'Jogo da Memória' : 'Memory Game')}
              {activeModal === 'chat' && (lang === 'pt' ? 'Tutor com IA' : 'AI Partner')}
              {activeModal === 'culture' && (lang === 'pt' ? 'Guias de Cultura' : 'Culture Guides')}
              {activeModal === 'survival' && (
                <span className="flex items-center gap-1.5">
                  {lang === 'pt' ? 'Simulador de Sobrevivência' : 'Portugal Survival Lab'}
                  <FlagPortugal size={16} />
                </span>
              )}
              {activeModal === 'nepaliBridge' && (
                <span className="flex items-center gap-1.5">
                  {lang === 'pt' ? 'Ponte Nepalês-Português' : 'Nepali ➔ PT-PT Bridge'}
                  <FlagNepal size={14} />
                </span>
              )}
            </span>
          </div>
        )}

        {/* TAB 1: LEARNING MATERIALS ONLY */}
        {activeModal === 'none' && (
          <main className="space-y-6 ios-fade-in max-w-4xl mx-auto">
            
            {/* Minimal Luxury Hero Banner */}
            <LisboaHeroBanner
              progress={progress}
              lang={lang}
              onContinueNextLesson={(unitId) => handleOpenUnit(unitId)}
              onOpenQuests={() => setActiveModal('quests')}
            />

            {/* Segmented Studio Control Tabs */}
            <LisboaTabNav
              activeTab={homeTab}
              onChangeTab={(tab) => setHomeTab(tab)}
              lang={lang}
            />

            {/* TAB CONTENT 1: LEARNING PATH & DISCOVERY */}
            {homeTab === 'path' && (
              <div className="space-y-6 ios-fade-in">
                {/* Horizontal Quick Discovery Strip */}
                <DiscoveryCarousel
                  lang={lang}
                  onOpenCashier={() => setActiveModal('cashier')}
                  onOpenSurvival={() => setActiveModal('survival')}
                  onOpenMap={() => setActiveModal('map')}
                  onOpenBridge={() => setActiveModal('nepaliBridge')}
                  onOpenSpeaking={() => handleStartGlobalGame('speaking')}
                  onOpenLove={() => setActiveModal('lovePhrases')}
                />

                {/* European Portuguese Learning Modules */}
                <UnitListCard onSelectUnit={handleOpenUnit} progress={progress} />
              </div>
            )}

            {/* TAB CONTENT 2: PRACTICE ARENA & MINI-GAMES */}
            {homeTab === 'arcade' && (
              <div className="ios-fade-in">
                <ArcadeHubSection
                  progress={progress}
                  lang={lang}
                  onStartGlobalGame={handleStartGlobalGame}
                  onOpenSurvival={() => setActiveModal('survival')}
                  onOpenCashier={() => setActiveModal('cashier')}
                  onOpenMap={() => setActiveModal('map')}
                  onOpenBridge={() => setActiveModal('nepaliBridge')}
                  onOpenStory={handleStartStory}
                  onOpenLovePhrases={() => setActiveModal('lovePhrases')}
                  onOpenQuests={() => setActiveModal('quests')}
                />
              </div>
            )}

            {/* TAB CONTENT 3: LOVE DIALOGUES & VOCABULARY VAULT */}
            {homeTab === 'vault' && (
              <div className="space-y-6 ios-fade-in">
                {/* Love Language Card */}
                <LoveLanguageCard onOpenLoveUnit={() => setActiveModal('lovePhrases')} />

                {/* Interactive Daily Quests Widget */}
                {(() => {
                  const activeQuests = getDailyQuests(progress);
                  const completedCount = activeQuests.filter(q => q.current >= q.target).length;
                  const pendingClaim = activeQuests.some(q => q.current >= q.target && !q.isClaimed);
                  const firstIncomplete = activeQuests.find(q => q.current < q.target) || activeQuests[0];
                  const overallPercent = Math.min(100, Math.floor((completedCount / activeQuests.length) * 100));

                  return (
                    <div 
                      onClick={() => {
                        playTone(550, 'sine', 0.05);
                        triggerHaptic('light');
                        setActiveModal('quests');
                      }}
                      className="ios-card ios-glass p-5 sm:p-6 cursor-pointer group relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                        <div className="shrink-0 relative">
                          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 text-amber-500 group-hover:scale-105 transition-transform">
                            {pendingClaim ? <Gift className="w-6 h-6 text-emerald-500 animate-bounce" /> : <PremiumTrophy size={24} />}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border-2 border-white dark:border-slate-900 ${
                            pendingClaim ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                          }`}>
                            {completedCount}/{activeQuests.length}
                          </div>
                        </div>

                        <div className="flex-1 text-center sm:text-left min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight group-hover:text-amber-500 transition-colors">
                                {lang === 'pt' ? 'Missões Diárias & Recompensas' : 'Daily Quests & Rewards'}
                              </h3>
                              {pendingClaim && (
                                <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                                  Claim Ready!
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                              <span className="flex items-center gap-1">{progress.coins} <GoldCoin size={14} /></span>
                              <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">{progress.gems} <Gem size={13} /></span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
                            {firstIncomplete 
                              ? `${lang === 'pt' ? firstIncomplete.titlePt : firstIncomplete.title} • ${firstIncomplete.current}/${firstIncomplete.target} (${firstIncomplete.description})`
                              : 'All daily quests completed today! Tap to open Coin & Gem Vault.'}
                          </p>

                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                completedCount === activeQuests.length ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${overallPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            {lang === 'pt' ? 'Ver Missões' : 'Open'} <ChevronRightIcon className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Spaced Repetition (SRS) Memory Vault Widget */}
                {(() => {
                  const records = seedInitialSRSRecords(progress, ALL_WORDS_FLAT);
                  const stats = getSRSStats(records);

                  return (
                    <div 
                      onClick={() => {
                        playTone(550, 'sine', 0.05);
                        triggerHaptic('light');
                        setActiveModal('vault');
                      }}
                      className="ios-card ios-glass p-5 sm:p-6 cursor-pointer group relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                            <Brain className="w-6 h-6 text-indigo-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                {lang === 'pt' ? 'Cofre de Repetição Espaçada (SRS)' : 'Spaced Repetition (SRS) Vault'}
                              </h3>
                              {stats.dueCount > 0 && (
                                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                  {stats.dueCount} Due
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                              {stats.dueCount > 0
                                ? `${stats.dueCount} terms scheduled for memory retention today (${stats.averageRetention}% retention)`
                                : `All ${stats.totalTracked} terms on schedule • ${stats.averageRetention}% Memory Health`}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTone(550, 'sine', 0.05);
                            triggerHaptic('medium');
                            setActiveModal('vault');
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all cursor-pointer shadow-md active:scale-95 text-center shrink-0"
                        >
                          {stats.dueCount > 0
                            ? (lang === 'pt' ? '⚡ Revisar Agora' : '⚡ Review Due Words')
                            : (lang === 'pt' ? 'Abrir Cofre' : 'Open Vault')}
                        </button>
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}

          </main>
        )}

        {/* TAB 2: STYLE SUJAN 3D STUDIO ONLY */}
        {activeModal === 'wardrobe' && (
          <div className="fixed inset-0 z-50 ios-modal-scale-in">
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
          <main className="w-full max-w-4xl mx-auto space-y-6 ios-fade-in">
            <VaultAndStatsModal
              progress={progress}
              onClose={() => setActiveModal('none')}
              onOpenQuests={() => setActiveModal('quests')}
              onUpdateSRS={(updatedRecords, earnedXP = 0, earnedCoins = 0) => {
                setProgress(prev => ({
                  ...prev,
                  srsRecords: updatedRecords,
                  xp: prev.xp + earnedXP,
                  todayXP: prev.todayXP + earnedXP,
                  coins: prev.coins + earnedCoins,
                }));
                if (earnedXP > 0) {
                  showToast(lang === 'pt' ? `🧠 Memória SRS atualizada! +${earnedXP} XP!` : `🧠 SRS Repetition Updated! +${earnedXP} XP!`);
                }
              }}
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
          </main>
        )}

        {/* DAILY QUESTS & REWARD VAULT MODAL */}
        {activeModal === 'quests' && (
          <DailyQuestsModal
            progress={progress}
            lang={lang}
            onClose={() => setActiveModal('none')}
            onClaimQuest={handleClaimQuest}
            onOpenSurvival={() => setActiveModal('survival')}
            onOpenCashier={() => setActiveModal('cashier')}
            onOpenMap={() => setActiveModal('map')}
            onOpenWardrobe={() => setActiveModal('wardrobe')}
            onBuyHeartRefill={handleBuyHeartRefill}
            onBuyStreakFreeze={handleBuyStreakFreeze}
            onConvertCoinsToGem={handleConvertCoinsToGem}
          />
        )}

        
        
        {/* UNIT HUB MODAL (Full Screen Glossary + Games) */}
        {showUnitHub && selectedUnit && (
          <div className="fixed inset-0 z-[90] flex flex-col bg-[#F9FAFB] dark:bg-[#09090b] ios-modal-scale-in">
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
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm ios-fade-in">
            <div className="absolute inset-0" onClick={() => setShowLessonSelector(false)} />
            <div className="relative w-full max-w-md bg-white dark:bg-[#18181b] rounded-t-[32px] p-6 pb-safe-offset-6 ios-modal-slide-up">
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
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold ${
                          isLocked ? 'bg-slate-200 dark:bg-white/10 text-slate-400' : isCompleted ? 'bg-[#58cc02] text-white' : 'bg-[#1CB0F6] text-white'
                        }`}>
                          {isCompleted ? <Check className="w-5 h-5 text-white" /> : isLocked ? <Lock className="w-4 h-4 text-slate-400" /> : i + 1}
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
              const xpGain = gameMode === 'guided' ? 25 : 15;
              const coinGain = gameMode === 'guided' ? 6 : 3;
              const isRareGem = Math.random() < 0.08; // 8% chance to drop 1 rare gem
              const gemGain = isRareGem ? 1 : 0;
              const newXP = progress.xp + xpGain;
              const newCoins = progress.coins + coinGain;
              const newGems = progress.gems + gemGain;
              
              let updatedCompletedLessons = progress.completedLessons || {};
              let updatedCompletedUnits = progress.completedUnits || [];
              
              if (gameMode === 'guided' && !isGlobalArcade) {
                const currentLessons = progress.completedLessons?.[selectedUnit.id] || 0;
                const nextLessonLevel = Math.max(currentLessons, selectedLessonIndex + 1);
                updatedCompletedLessons = { ...updatedCompletedLessons, [selectedUnit.id]: nextLessonLevel };
                
                if (!updatedCompletedUnits.includes(selectedUnit.id)) {
                  updatedCompletedUnits = [...updatedCompletedUnits, selectedUnit.id];
                }
              }

              setProgress(prev => ({
                ...prev,
                xp: newXP,
                todayXP: prev.todayXP + xpGain,
                coins: newCoins,
                gems: newGems,
                completedLessons: updatedCompletedLessons,
                completedUnits: updatedCompletedUnits
              }));

              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000);
              updateSpeech('🎉', isRareGem 
                ? `LUCKY DROP! You found a rare Gem 💎! +${xpGain} XP & +${coinGain} Coins!` 
                : gameMode === 'guided' 
                  ? `Lesson complete! Sujan is so proud of you! +${xpGain} XP & +${coinGain} Coins!` 
                  : `Great practice! +${xpGain} XP & +${coinGain} Coins!`
              );
              setActiveModal('none');
              setIsGlobalArcade(false);
              
              window.dispatchEvent(new CustomEvent('show-toast', { 
                detail: { 
                  title: isRareGem ? '✨ Rare Gem Found! 💎' : (gameMode === 'guided' ? 'Lesson Complete!' : 'Arcade Complete!'), 
                  message: `+${xpGain} XP & +${coinGain} Coins 🪙` + (isRareGem ? ' & +1 Rare Gem 💎!' : ''), 
                  icon: isRareGem ? '💎' : '🎉' 
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
              showToast(`Memory Match Cleared! +${xp} XP & +${coins} Coins!`);
            }}
          />
        )}

        {activeModal === 'chat' && (
          <div className="ios-fade-in">
            <AITutorChat onClose={() => setActiveModal('none')} />
          </div>
        )}

        {activeModal === 'culture' && (
          <CultureGuidesModal onClose={() => setActiveModal('none')} />
        )}

        {activeModal === 'lovePhrases' && (
          <LovePhrasesModal
            unit={UNITS_DATA.unit7}
            onClose={() => setActiveModal('none')}
            onStartPractice={(words) => {
              setSelectedUnitId('unit7');
              setSelectedLessonIndex(0);
              setGameMode('guided');
              setActiveModal('study');
            }}
            onStartQuiz={(words) => {
              handleStartQuiz(words, true, false, false);
            }}
          />
        )}

        {activeModal === 'survival' && (
          <SurvivalSimulatorModal
            onClose={() => setActiveModal('none')}
            onCompleteScenario={handleCompleteSurvivalScenario}
          />
        )}

        {activeModal === 'nepaliBridge' && (
          <NepaliBridgeModal
            onClose={() => setActiveModal('none')}
          />
        )}

        {activeModal === 'map' && (
          <PortugalJourneyMapModal
            onClose={() => setActiveModal('none')}
            onReward={(xp, coins) => {
              incrementQuestProgress('map');
              setProgress(prev => ({
                ...prev,
                xp: prev.xp + xp,
                todayXP: prev.todayXP + xp,
                coins: prev.coins + coins,
              }));
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3500);
              showToast(`Landmark Mastered! +${xp} XP & +${coins} Coins!`);
            }}
          />
        )}

        {activeModal === 'cashier' && (
          <EuroCashierModal
            onClose={() => setActiveModal('none')}
            onReward={(xp, coins) => {
              incrementQuestProgress('cashier');
              setProgress(prev => ({
                ...prev,
                xp: prev.xp + xp,
                todayXP: prev.todayXP + xp,
                coins: prev.coins + coins,
              }));
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3500);
              showToast(`Cashier Shift Complete! +${xp} XP & +${coins} Coins!`);
            }}
          />
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
            const coinGain = 15;
            const gemGain = 1;
            setProgress(prev => ({
              ...prev,
              xp: prev.xp + xp,
              todayXP: prev.todayXP + xp,
              coins: prev.coins + coinGain,
              gems: prev.gems + gemGain,
            }));
            setActiveModal('none');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3500);
            showToast(`Story Completed! +${xp} XP, +${coinGain} Coins & +1 Gem 💎!`);
          }}
        />
      )}

      {activeModal === 'voiceSettings' && (
        <VoiceSettingsModal
          onClose={() => setActiveModal('none')}
          lang={lang}
        />
      )}

      {activeModal === 'auth' && (
        <AuthModal
          isOpen={activeModal === 'auth'}
          onClose={() => setActiveModal('none')}
          loginWithGoogle={loginWithGoogle}
          loginWithEmail={loginWithEmail}
          signupWithEmail={signupWithEmail}
          sendPasswordReset={sendPasswordReset}
          onSuccess={(msg) => {
            showToast(msg);
            setActiveModal('none');
          }}
        />
      )}
      <DynamicIslandToast />
      <ConfettiEffect active={showConfetti} />
      <PukuCompanion />
      
      {/* Floating Minimalist iOS Glass Tab Bar */}
      {user && progress.hasSeenOnboarding && ['none', 'wardrobe', 'vault'].includes(activeModal) && (
        <FloatingGlassTabBar
          activeModal={activeModal}
          onChangeTab={setActiveModal}
          lang={lang}
        />
      )}
    </div>
  );
}
