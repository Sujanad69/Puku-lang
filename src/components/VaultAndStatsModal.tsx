import React, { useState, useMemo } from 'react';
import { UserProgress, VocabWord, SRSItem, SRSReviewQuality } from '../types';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  getSRSStats, 
  calculateSRSUpdate, 
  calculateRetentionScore, 
  getDaysDifference, 
  getTodayDateString, 
  seedInitialSRSRecords,
  SRS_LEVELS_LABEL 
} from '../utils/srsEngine';
import { ALL_WORDS_FLAT } from '../data/portugueseData';
import { AudioWaveVisualizer } from './AudioWaveVisualizer';
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
  RotateCw, 
  Sparkles,
  BarChart3,
  Brain,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Play,
  Search,
  Layers,
  Activity,
  Award,
} from 'lucide-react';

interface VaultAndStatsModalProps {
  progress: UserProgress;
  initialTab?: VaultTab;
  onClose: () => void;
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xl ios-fade-in overflow-y-auto">
      
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

      <div className="ios-card relative w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh] rounded-[32px] border border-white/10 my-auto">
        
        {/* ================= HEADER BANNER ================= */}
        <div className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 p-5 sm:p-6 text-white text-center overflow-hidden shrink-0">
          
          {/* Subtle Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-300 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-300 rounded-full blur-2xl"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-md"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 mb-2 shadow-xs">
            <Brain className="w-3.5 h-3.5 text-indigo-100" />
            <span>Activity Dashboard & Memory Vault</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight flex items-center justify-center gap-2">
            <span>Activity & Memory Vault</span>
            <Activity className="w-6 h-6 text-cyan-300" />
          </h2>

          <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1 max-w-md mx-auto leading-relaxed">
            Spaced repetition schedules reviews right before you forget.
          </p>

          {/* Segmented Navigation Bar */}
          <div className="flex items-center justify-center gap-1.5 mt-5 p-1 bg-black/25 backdrop-blur-md rounded-2xl max-w-md mx-auto border border-white/10">
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-w-0">
          
          {/* TAB 1: APPLE ACTIVITY DASHBOARD & OVERALL STATS */}
          {activeTab === 'activity' && (
            <div className="space-y-4 ios-fade-in min-w-0">
              
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
                <div className="ios-card ios-glass p-4 text-center space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Total XP</span>
                  <div className="flex items-center justify-center gap-1.5 text-xl font-black text-blue-600 dark:text-blue-400">
                    <Trophy className="w-5 h-5" />
                    <span>{progress?.xp || 0}</span>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    if (onOpenQuests) {
                      onClose();
                      onOpenQuests();
                    }
                  }}
                  className="ios-card ios-glass p-4 text-center space-y-1 cursor-pointer hover:border-amber-400 transition-colors"
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
                      onClose();
                      onOpenQuests();
                    }
                  }}
                  className="ios-card ios-glass p-4 text-center space-y-1 cursor-pointer hover:border-purple-400 transition-colors"
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

                <div className="ios-card ios-glass p-4 text-center space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Hearts</span>
                  <div className="flex items-center justify-center gap-1.5 text-xl font-black text-rose-500">
                    <Heart className="w-5 h-5 fill-current" />
                    <span>{progress?.hearts ?? 5}/5</span>
                  </div>
                </div>
              </div>

              {/* Daily Study Reminders */}
              <div className="ios-card ios-glass flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <Bell className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">Daily Study Reminders</h4>
                    <p className="text-xs font-medium text-slate-400">
                      Receive encouraging reminders to keep your streak
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
            <div className="space-y-4 ios-fade-in min-w-0">
              
              {/* Due For Review Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-5 sm:p-6 text-white shadow-lg space-y-4">
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
                    <p className="text-xs text-indigo-100 font-medium">
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
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    srsFilter === 'due'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 ring-2 ring-rose-400/20'
                      : 'bg-slate-50 dark:bg-[#181a22] border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase text-rose-500 block">Due Now</span>
                  <span className="text-xl font-black text-rose-600 dark:text-rose-400">{srsStats.dueCount}</span>
                </div>

                <div
                  onClick={() => setSrsFilter('learning')}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    srsFilter === 'learning'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/20'
                      : 'bg-slate-50 dark:bg-[#181a22] border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase text-amber-500 block">In Learning</span>
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">{srsStats.learningCount}</span>
                </div>

                <div
                  onClick={() => setSrsFilter('mature')}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    srsFilter === 'mature'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-slate-50 dark:bg-[#181a22] border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase text-emerald-500 block">Mastered</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{srsStats.matureCount}</span>
                </div>
              </div>

              {/* Filter Tabs & Search Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
                {/* Status Segment */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#181a22] p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                  <button
                    onClick={() => setSrsFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      srsFilter === 'all'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-black'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    All ({srsStats.totalTracked})
                  </button>
                  <button
                    onClick={() => setSrsFilter('due')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      srsFilter === 'due'
                        ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-xs font-black'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Due ({srsStats.dueCount})
                  </button>
                  <button
                    onClick={() => setSrsFilter('learning')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      srsFilter === 'learning'
                        ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-xs font-black'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Learning ({srsStats.learningCount})
                  </button>
                  <button
                    onClick={() => setSrsFilter('mature')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      srsFilter === 'mature'
                        ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs font-black'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Mastered ({srsStats.matureCount})
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search words..."
                    className="w-full sm:w-44 pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-[#181a22] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* SRS Word Item Cards */}
              <div className="space-y-2.5">
                {filteredSRSItems.length > 0 ? (
                  filteredSRSItems.map((item) => {
                    const isDue = item.nextReviewAt <= today || item.level === 0;
                    const diff = getDaysDifference(item.nextReviewAt, today);
                    const retention = calculateRetentionScore(item);
                    const isPlaying = playingWordPt === item.wordPt;

                    const levelInfo = SRS_LEVELS_LABEL[item.level] || SRS_LEVELS_LABEL[0];

                    return (
                      <div
                        key={item.wordPt}
                        className={`rounded-2xl border p-4 transition-all duration-200 bg-white dark:bg-[#161822] shadow-2xs hover:shadow-sm ${
                          isDue
                            ? 'border-rose-300/80 dark:border-rose-900/60 bg-rose-50/20'
                            : 'border-slate-200/80 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Word Info */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-black text-slate-900 dark:text-white">
                                {item.wordPt}
                              </h4>
                              {item.phonetic && (
                                <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                                  /{item.phonetic}/
                                </span>
                              )}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${levelInfo.color}`}>
                                {levelInfo.badge}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                              <span className="font-semibold">{item.en}</span>
                              {item.nepali && (
                                <span className="text-rose-500 font-medium">({item.nepali})</span>
                              )}
                            </div>
                          </div>

                          {/* Retention & Schedule Info */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right text-xs">
                              <div className="font-bold flex items-center justify-end gap-1">
                                <span className={isDue ? 'text-rose-600 font-black' : 'text-slate-700 dark:text-slate-300'}>
                                  {isDue
                                    ? 'Due Today'
                                    : diff === 1
                                    ? 'Review Tomorrow'
                                    : `Review in ${diff}d`}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">
                                Retention: {retention}%
                              </span>
                            </div>

                            {/* Audio Listen Button with Visualizer */}
                            <button
                              onClick={() => handlePlayAudio(item.wordPt)}
                              className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                isPlaying
                                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600'
                              }`}
                              title="Listen Pronunciation"
                            >
                              {isPlaying ? (
                                <AudioWaveVisualizer isPlaying={true} size="xs" color="white" barsCount={3} />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </button>

                            {/* Direct Quick Rate Action */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickRate(item, 'again')}
                                title="Reset / Lapse interval"
                                className="px-2 py-1 rounded-lg text-[10px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-200 transition-colors cursor-pointer"
                              >
                                Again
                              </button>
                              <button
                                onClick={() => handleQuickRate(item, 'good')}
                                title="Increment SRS interval"
                                className="px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer"
                              >
                                +Good
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#181a22] border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-semibold">
                    No words found for this filter.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: WEAK WORDS REVIEW */}
          {activeTab === 'weak' && (
            <div className="space-y-3 ios-fade-in min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">Weak Words Review</h4>
                  <p className="text-xs font-semibold text-slate-400">
                    {progress?.weakWords?.length || 0} words flagged for extra practice
                  </p>
                </div>

                {(progress?.weakWords?.length || 0) > 0 && (
                  <button
                    onClick={onStartWeakWords}
                    className="flex items-center gap-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm active:scale-95 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Practice Weak Words</span>
                  </button>
                )}
              </div>

              {(progress?.weakWords?.length || 0) > 0 ? (
                <div className="space-y-2 pt-1">
                  {progress.weakWords.map((w: VocabWord, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => handlePlayAudio(w.pt)}
                      className="flex items-center justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-3.5 text-xs cursor-pointer hover:border-rose-300 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{w.pt}</span>
                        <span className="block text-slate-400">"{w.en}"</span>
                      </div>

                      <button className="h-8 w-8 flex items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 p-6 text-center space-y-1">
                  <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                    No weak words right now!
                  </p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                    Your European Portuguese memory is sharp! Check the Spaced Repetition tab for scheduled reviews.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1015] shrink-0 flex items-center justify-between gap-3">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Spaced reviews protect your long-term memory!</span>
          </span>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Close Vault
          </button>
        </div>

      </div>

    </div>
  );
};
