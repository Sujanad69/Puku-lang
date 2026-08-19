import React, { useState, useMemo } from 'react';
import { UserProgress, VocabWord, SRSItem, SRSReviewQuality } from '../types';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  getSRSStats, 
  calculateSRSUpdate, 
  getTodayDateString, 
  seedInitialSRSRecords,
  SRS_LEVELS_LABEL 
} from '../utils/srsEngine';
import { ALL_WORDS_FLAT } from '../data/portugueseData';
import { SRSReviewSessionModal } from './SRSReviewSessionModal';
import { AppleActivityDashboard } from './AppleActivityDashboard';
import { 
  X, 
  Volume2, 
  Flame, 
  Trophy, 
  Coins, 
  Gem, 
  Heart, 
  Bell, 
  Sparkles,
  Brain,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Play,
  Search,
  Activity,
} from 'lucide-react';

interface VaultAndStatsModalProps {
  progress: UserProgress;
  initialTab?: VaultTab;
  onClose?: () => void;
  onStartWeakWords: () => void;
  onToggleReminders: () => void;
  onOpenQuests?: () => void;
  onUpdateSRS?: (updatedRecords: Record<string, SRSItem>, earnedXP?: number, earnedCoins?: number) => void;
}

type VaultTab = 'activity' | 'srs' | 'weak';

export const VaultAndStatsModal: React.FC<VaultAndStatsModalProps> = ({
  progress,
  initialTab = 'activity',
  onClose,
  onStartWeakWords,
  onToggleReminders,
  onOpenQuests,
  onUpdateSRS,
}) => {
  const [activeTab, setActiveTab] = useState<VaultTab>(initialTab);
  const [srsFilter, setSrsFilter] = useState<'all' | 'due' | 'learning' | 'mature'>('due');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingWordPt, setPlayingWordPt] = useState<string | null>(null);
  const [showReviewSession, setShowReviewSession] = useState(false);
  const [sessionQueue, setSessionQueue] = useState<SRSItem[]>([]);

  // Ensure SRS records are populated from existing vocabulary if empty
  const srsRecords = useMemo(() => {
    return seedInitialSRSRecords(progress, ALL_WORDS_FLAT);
  }, [progress]);

  const srsStats = useMemo(() => {
    return getSRSStats(srsRecords);
  }, [srsRecords]);

  const today = getTodayDateString();

  const handlePlayAudio = (wordPt: string) => {
    setPlayingWordPt(wordPt);
    playTone(560, 'sine', 0.05);
    speakPt(wordPt);
    setTimeout(() => {
      setPlayingWordPt((current) => (current === wordPt ? null : current));
    }, 1600);
  };

  const handleStartReview = (items: SRSItem[]) => {
    triggerHaptic('medium');
    setSessionQueue(items.length > 0 ? items : Object.values(srsRecords).slice(0, 10));
    setShowReviewSession(true);
  };

  const handleQuickRate = (item: SRSItem, quality: SRSReviewQuality) => {
    triggerHaptic('light');
    if (quality === 'again') {
      playTone(330, 'square', 0.08);
    } else {
      playTone(550, 'sine', 0.05);
    }

    const updatedItem = calculateSRSUpdate(item, quality, {
      pt: item.wordPt,
      en: item.en,
      phonetic: item.phonetic,
      nepali: item.nepali,
    });

    const newMap = {
      ...srsRecords,
      [item.wordPt]: updatedItem,
    };

    if (onUpdateSRS) {
      onUpdateSRS(newMap, 2, 0);
    }
  };

  // Filtered SRS list for the browser tab
  const filteredSRSItems = useMemo(() => {
    const list: SRSItem[] = Object.values(srsRecords);
    return list.filter((item: SRSItem) => {
      // Filter by status
      if (srsFilter === 'due' && (item.nextReviewAt > today && item.level > 0)) return false;
      if (srsFilter === 'learning' && (item.level < 1 || item.level >= 4 || item.nextReviewAt <= today)) return false;
      if (srsFilter === 'mature' && (item.level < 4 || item.nextReviewAt <= today)) return false;

      // Filter by search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.wordPt.toLowerCase().includes(q) ||
          item.en.toLowerCase().includes(q) ||
          (item.nepali && item.nepali.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [srsRecords, srsFilter, searchQuery, today]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-28 pt-2 px-3 sm:px-4 ios-fade-in">
      
      {/* Active SRS Review Session Overlay */}
      {showReviewSession && (
        <SRSReviewSessionModal
          initialQueue={sessionQueue}
          allRecords={srsRecords}
          onClose={() => setShowReviewSession(false)}
          onSaveProgress={(updated, xp, coins) => {
            if (onUpdateSRS) {
              onUpdateSRS(updated, xp, coins);
            }
          }}
        />
      )}

      {/* ================= HEADER HERO BANNER ================= */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 p-6 text-white shadow-xl border border-white/10">
        
        {/* Subtle Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-300 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-300 rounded-full blur-2xl"></div>
        </div>

        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 mb-2.5 shadow-xs">
          <Brain className="w-3.5 h-3.5 text-indigo-100" />
          <span>Activity & Memory Vault</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight flex items-center gap-2">
          <span>Your Daily Progress</span>
          <Activity className="w-6 h-6 text-cyan-300" />
        </h2>

        <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1 max-w-lg leading-relaxed">
          Track your Apple Activity Rings, daily XP output, vocabulary retention, and spaced repetition memory bank.
        </p>

        {/* Segmented Control Bar */}
        <div className="flex items-center gap-1.5 mt-5 p-1 bg-black/30 backdrop-blur-md rounded-2xl max-w-md border border-white/10">
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('activity');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-white text-indigo-900 shadow-sm font-black'
                : 'text-indigo-100 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activity Rings</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('srs');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'srs'
                ? 'bg-white text-indigo-900 shadow-sm font-black'
                : 'text-indigo-100 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Spaced SRS</span>
            {srsStats.dueCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {srsStats.dueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('weak');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'weak'
                ? 'bg-white text-indigo-900 shadow-sm font-black'
                : 'text-indigo-100 hover:text-white'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Weak ({progress?.weakWords?.length || 0})</span>
          </button>
        </div>

      </div>

      {/* ================= CONTENT BODY ================= */}
      <div className="space-y-5 min-w-0">
        
        {/* TAB 1: APPLE ACTIVITY DASHBOARD & OVERALL STATS */}
        {activeTab === 'activity' && (
          <div className="space-y-5 ios-fade-in min-w-0">
            
            {/* Apple Activity Rings & Recharts Dashboard */}
            <AppleActivityDashboard
              progress={progress}
              srsRecords={srsRecords}
              onOpenSRSReview={() => {
                const allItems: SRSItem[] = Object.values(srsRecords);
                const due = allItems.filter((i) => i.nextReviewAt <= today || i.level === 0);
                handleStartReview(due.length > 0 ? due : allItems.slice(0, 8));
              }}
            />

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="ios-card ios-glass p-4 text-center space-y-1 rounded-2xl border border-white/10">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Total XP</span>
                <div className="flex items-center justify-center gap-1.5 text-xl font-black text-blue-600 dark:text-blue-400">
                  <Trophy className="w-5 h-5" />
                  <span>{progress?.xp || 0}</span>
                </div>
              </div>

              <div 
                onClick={() => {
                  if (onOpenQuests) {
                    onOpenQuests();
                  }
                }}
                className="ios-card ios-glass p-4 text-center space-y-1 cursor-pointer hover:border-amber-400 transition-colors rounded-2xl border border-white/10"
                title="View Daily Quests"
              >
                <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                  Coins <Sparkles className="w-2.5 h-2.5" />
                </span>
                <div className="flex items-center justify-center gap-1.5 text-xl font-black text-amber-500">
                  <Coins className="w-5 h-5" />
                  <span>{progress?.coins || 0}</span>
                </div>
              </div>

              <div 
                onClick={() => {
                  if (onOpenQuests) {
                    onOpenQuests();
                  }
                }}
                className="ios-card ios-glass p-4 text-center space-y-1 cursor-pointer hover:border-purple-400 transition-colors rounded-2xl border border-white/10"
                title="View Gem Vault"
              >
                <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1">
                  Gems <Sparkles className="w-2.5 h-2.5" />
                </span>
                <div className="flex items-center justify-center gap-1.5 text-xl font-black text-purple-600 dark:text-purple-400">
                  <Gem className="w-5 h-5" />
                  <span>{progress?.gems || 0}</span>
                </div>
              </div>

              <div className="ios-card ios-glass p-4 text-center space-y-1 rounded-2xl border border-white/10">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Hearts</span>
                <div className="flex items-center justify-center gap-1.5 text-xl font-black text-rose-500">
                  <Heart className="w-5 h-5 fill-current" />
                  <span>{progress?.hearts ?? 5}/5</span>
                </div>
              </div>
            </div>

            {/* Daily Study Reminders */}
            <div className="ios-card ios-glass flex items-center justify-between p-5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Bell className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Daily Study Reminders</h4>
                  <p className="text-xs font-medium text-slate-400">
                    Receive encouraging reminders to keep your streak active
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onToggleReminders();
                }}
                className={`h-7 w-12 rounded-full p-1 transition-colors cursor-pointer ${
                  progress?.remindersEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition-transform ${
                    progress?.remindersEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SPACED REPETITION (SRS) */}
        {activeTab === 'srs' && (
          <div className="space-y-5 ios-fade-in min-w-0">
            
            {/* Due For Review Hero Banner */}
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 text-white shadow-lg space-y-4 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                    <Clock className="w-3 h-3" />
                    <span>SRS Review Queue</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    {srsStats.dueCount > 0
                      ? `${srsStats.dueCount} Words Due for Review!`
                      : 'Memory Bank is 100% Up to Date!'}
                  </h3>
                  <p className="text-xs text-indigo-100 font-medium max-w-md">
                    {srsStats.dueCount > 0
                      ? 'Practice now to lock these terms into long-term European Portuguese fluency.'
                      : 'Great job! No words are currently decaying. You can still practice ahead.'}
                  </p>
                </div>

                <button
                  onClick={() => handleStartReview(srsStats.dueToday.length > 0 ? srsStats.dueToday : Object.values(srsRecords).slice(0, 10))}
                  className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-900 font-black text-xs shadow-md hover:bg-indigo-50 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-indigo-600" />
                  <span>{srsStats.dueCount > 0 ? 'Review Due Words Now' : 'Practice Flashcards'}</span>
                </button>
              </div>

              {/* Retention Stability Bar */}
              <div className="pt-2 border-t border-white/20">
                <div className="flex justify-between text-xs font-bold text-indigo-100 mb-1.5">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Average Memory Retention</span>
                  </span>
                  <span className="font-black text-white">{srsStats.averageRetention}% Stability</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/25 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-pink-300 via-amber-300 to-emerald-300 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(100, srsStats.averageRetention)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3 SRS Memory Breakdown Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div
                onClick={() => setSrsFilter('due')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  srsFilter === 'due'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 ring-2 ring-rose-400/20 shadow-sm'
                    : 'bg-white dark:bg-[#181a22] border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase text-rose-500 block">Due Now</span>
                <span className="text-xl font-black text-rose-600 dark:text-rose-400">{srsStats.dueCount}</span>
              </div>

              <div
                onClick={() => setSrsFilter('learning')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  srsFilter === 'learning'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                    : 'bg-white dark:bg-[#181a22] border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase text-amber-500 block">In Learning</span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400">{srsStats.learningCount}</span>
              </div>

              <div
                onClick={() => setSrsFilter('mature')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  srsFilter === 'mature'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm'
                    : 'bg-white dark:bg-[#181a22] border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase text-emerald-500 block">Mastered</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{srsStats.matureCount}</span>
              </div>
            </div>

            {/* Filter Tabs & Search Header */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 dark:bg-[#1c1c1e] rounded-2xl border border-black/5 dark:border-white/10">
                {(['due', 'learning', 'mature', 'all'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      triggerHaptic('light');
                      setSrsFilter(filter);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                      srsFilter === filter
                        ? 'bg-white dark:bg-[#2c2c2e] text-slate-900 dark:text-white shadow-xs font-black'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {filter} ({
                      filter === 'due'
                        ? srsStats.dueCount
                        : filter === 'learning'
                        ? srsStats.learningCount
                        : filter === 'mature'
                        ? srsStats.matureCount
                        : srsStats.totalCount
                    })
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vocabulary..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Vocabulary Card List */}
            <div className="space-y-2.5">
              {filteredSRSItems.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-[#1c1c1e] rounded-2xl border border-slate-200/60 dark:border-white/5 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No vocabulary items matching this filter
                  </h4>
                  <p className="text-xs text-slate-400">
                    Switch filters or practice lessons in the Learn tab to unlock more words.
                  </p>
                </div>
              ) : (
                filteredSRSItems.map((item) => (
                  <div
                    key={item.wordPt}
                    className="p-4 bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handlePlayAudio(item.wordPt)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          playingWordPt === item.wordPt
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
                        }`}
                        title="Listen to PT-PT Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900 dark:text-white truncate">
                            {item.wordPt}
                          </span>
                          {item.phonetic && (
                            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline truncate">
                              /{item.phonetic}/
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.en} {item.nepali && <span className="text-amber-500 font-medium">({item.nepali})</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                        item.level >= 4
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800/60'
                          : item.level >= 1
                          ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800/60'
                          : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800/60'
                      }`}>
                        {SRS_LEVELS_LABEL[item.level as keyof typeof SRS_LEVELS_LABEL]?.name || `Level ${item.level}`}
                      </span>

                      {/* Quick Rate Button */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuickRate(item, 'again')}
                          className="px-2 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-lg text-[10px] font-bold border border-rose-200 dark:border-rose-800/40 hover:bg-rose-100 cursor-pointer"
                          title="Rate Again"
                        >
                          Again
                        </button>
                        <button
                          onClick={() => handleQuickRate(item, 'good')}
                          className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 cursor-pointer"
                          title="Rate Good"
                        >
                          Good
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 3: WEAK WORDS */}
        {activeTab === 'weak' && (
          <div className="space-y-5 ios-fade-in min-w-0">
            
            {/* Weak Words Hero Banner */}
            <div className="p-6 bg-gradient-to-br from-rose-600 to-amber-600 rounded-[28px] text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
              <div className="space-y-1">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Targeted Mistake Practice</span>
                </h3>
                <p className="text-xs text-rose-100 font-medium max-w-md">
                  Review words you have previously missed during quizzes to turn weaknesses into permanent mastery.
                </p>
              </div>

              {progress?.weakWords?.length > 0 && (
                <button
                  onClick={onStartWeakWords}
                  className="px-5 py-3 bg-white text-rose-700 rounded-2xl font-black text-xs shadow-md hover:bg-rose-50 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  Practice {progress.weakWords.length} Weak Words
                </button>
              )}
            </div>

            {/* Weak Words Cards */}
            {(!progress?.weakWords || progress.weakWords.length === 0) ? (
              <div className="p-10 text-center bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 dark:text-white">
                  No Weak Words! Outstanding!
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You haven&apos;t missed any words recently. Keep practicing new lessons to expand your vocabulary.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {progress.weakWords.map((word) => (
                  <div
                    key={word.pt}
                    className="p-4 bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePlayAudio(word.pt)}
                        className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer hover:bg-rose-100"
                        title="Listen to PT-PT Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <div>
                        <div className="font-black text-sm text-slate-900 dark:text-white">
                          {word.pt}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {word.en} {word.nepali && <span className="text-amber-500 font-medium">({word.nepali})</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onStartWeakWords}
                      className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800/40 hover:bg-rose-100 cursor-pointer"
                    >
                      Drill Now
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
