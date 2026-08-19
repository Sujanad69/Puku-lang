import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SRSItem, SRSReviewQuality } from '../types';
import { calculateSRSUpdate, getDaysDifference, getTodayDateString } from '../utils/srsEngine';
import { speakPt, playTone, playSuccessSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { AudioWaveVisualizer } from './AudioWaveVisualizer';
import {
  X,
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Brain,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  Search,
} from 'lucide-react';
import { FlagNepal } from './icons/PremiumIcons';

interface SRSReviewSessionModalProps {
  initialQueue: SRSItem[];
  allRecords: Record<string, SRSItem>;
  onSaveProgress: (updatedRecords: Record<string, SRSItem>, earnedXP: number, earnedCoins: number) => void;
  onClose: () => void;
}

export const SRSReviewSessionModal: React.FC<SRSReviewSessionModalProps> = ({
  initialQueue,
  allRecords,
  onSaveProgress,
  onClose,
}) => {
  const [queue, setQueue] = useState<SRSItem[]>(() => [...initialQueue]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [updatedMap, setUpdatedMap] = useState<Record<string, SRSItem>>(() => ({ ...allRecords }));
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const currentItem = queue[currentIndex];
  const progressPercent = queue.length > 0 ? Math.round((currentIndex / queue.length) * 100) : 100;

  const handlePlayAudio = (text: string) => {
    setIsPlayingAudio(true);
    playTone(580, 'sine', 0.05);
    speakPt(text);
    setTimeout(() => setIsPlayingAudio(false), 1600);
  };

  const handleRate = (quality: SRSReviewQuality) => {
    if (!currentItem) return;

    triggerHaptic(quality === 'again' ? 'error' : quality === 'easy' ? 'success' : 'medium');
    if (quality === 'again') {
      playTone(330, 'square', 0.08);
    } else {
      playTone(550, 'sine', 0.05);
    }

    const updatedItem = calculateSRSUpdate(currentItem, quality, {
      pt: currentItem.wordPt,
      en: currentItem.en,
      phonetic: currentItem.phonetic,
      nepali: currentItem.nepali,
    });

    const newMap = {
      ...updatedMap,
      [currentItem.wordPt]: updatedItem,
    };
    setUpdatedMap(newMap);

    // If rated 'again', re-insert at the end of current session queue to enforce retention!
    if (quality === 'again') {
      setQueue((prev) => [...prev, updatedItem]);
    }

    setReviewedCount((prev) => prev + 1);
    setIsFlipped(false);

    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Session finished
      setSessionCompleted(true);
      playSuccessSound();
      const earnedXP = (reviewedCount + 1) * 5;
      const earnedCoins = Math.max(5, Math.floor((reviewedCount + 1) * 2));
      onSaveProgress(newMap, earnedXP, earnedCoins);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md ios-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] bg-white dark:bg-[#11131a] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">SRS Memory Workout</h2>
              <p className="text-xs text-indigo-100 font-medium">Spaced interval review to beat the forgetting curve</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        {!sessionCompleted && (
          <div className="px-6 pt-4 pb-2 bg-slate-50 dark:bg-[#161822] flex items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
              {currentIndex + 1} / {queue.length}
            </span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col justify-center">
          {sessionCompleted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 space-y-5"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  <span>Workout Complete!</span>
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  You reviewed <span className="font-bold text-slate-800 dark:text-white">{reviewedCount} words</span>. Your memory intervals have been recalculated!
                </p>
              </div>

              {/* Rewards Summary */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>+{reviewedCount * 5} XP</span>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Retention Boosted</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Return to Vault
                </button>
              </div>
            </motion.div>
          ) : currentItem ? (
            <div className="space-y-6">
              {/* Spaced Repetition Card */}
              <motion.div
                key={currentItem.wordPt}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-[#161822] border-2 border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 text-center space-y-4 shadow-sm"
              >
                {/* Level / Interval Indicator */}
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
                    SRS Level {currentItem.level} • {currentItem.intervalDays}d interval
                  </span>

                  <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Lapses: {currentItem.lapses}</span>
                  </span>
                </div>

                {/* Target Portuguese Word */}
                <div className="pt-2">
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {currentItem.wordPt}
                  </h3>

                  {currentItem.phonetic && (
                    <div className="mt-2 inline-flex items-center gap-2 text-sm font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-xl border border-blue-200/60 dark:border-blue-800">
                      <span>/{currentItem.phonetic}/</span>
                      <AudioWaveVisualizer isPlaying={isPlayingAudio} size="xs" color="blue" barsCount={5} />
                    </div>
                  )}
                </div>

                {/* Audio Trigger */}
                <div>
                  <button
                    onClick={() => handlePlayAudio(currentItem.wordPt)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-blue-600 text-white ring-4 ring-blue-300 scale-105'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <Volume2 className="w-4 h-4 text-blue-500" />
                    <span>Listen Lisbon Accent</span>
                  </button>
                </div>

                {/* Hidden / Revealed Content */}
                <div className="pt-2">
                  {isFlipped ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-2xl bg-white dark:bg-[#1f2230] border border-slate-200/80 dark:border-slate-700 space-y-1.5 shadow-xs"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Meaning</span>
                      <p className="text-lg font-black text-slate-800 dark:text-white">
                        {currentItem.en}
                      </p>
                      {currentItem.nepali && (
                        <p className="text-xs font-bold text-rose-500 dark:text-rose-400 flex items-center justify-center gap-1">
                          <FlagNepal size={12} />
                          <span>{currentItem.nepali}</span>
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setIsFlipped(true);
                        handlePlayAudio(currentItem.wordPt);
                      }}
                      className="w-full py-4 rounded-2xl bg-white dark:bg-[#1f2230] border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 text-slate-600 dark:text-slate-300 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4 text-indigo-500" />
                      <span>Tap to Reveal Meaning</span>
                    </button>
                  )}
                </div>
              </motion.div>

              {/* 4 SRS Rating Buttons (Only shown when flipped) */}
              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                    How well did you recall this?
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Again */}
                    <button
                      onClick={() => handleRate('again')}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="text-xs font-black">Again</span>
                      <span className="text-[10px] font-semibold opacity-75">&lt; 10 mins</span>
                    </button>

                    {/* Hard */}
                    <button
                      onClick={() => handleRate('hard')}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="text-xs font-black">Hard</span>
                      <span className="text-[10px] font-semibold opacity-75">+1 day</span>
                    </button>

                    {/* Good */}
                    <button
                      onClick={() => handleRate('good')}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="text-xs font-black">Good</span>
                      <span className="text-[10px] font-semibold opacity-75">
                        {currentItem.level === 0 ? '+1d' : currentItem.level === 1 ? '+3d' : currentItem.level === 2 ? '+7d' : '+14d'}
                      </span>
                    </button>

                    {/* Easy */}
                    <button
                      onClick={() => handleRate('easy')}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="text-xs font-black">Easy</span>
                      <span className="text-[10px] font-semibold opacity-75">
                        {currentItem.level <= 1 ? '+7d' : '+30d'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <p>No words in queue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
