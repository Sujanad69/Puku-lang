import React from 'react';
import { UserProgress, VocabWord } from '../types';
import { speakPt } from '../utils/audio';

interface VaultAndStatsModalProps {
  progress: UserProgress;
  onClose: () => void;
  onStartWeakWords: () => void;
  onToggleReminders: () => void;
}

export const VaultAndStatsModal: React.FC<VaultAndStatsModalProps> = ({
  progress,
  onClose,
  onStartWeakWords,
  onToggleReminders,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f4f5f8] dark:bg-black text-slate-900 dark:text-slate-100 overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 bg-white dark:bg-black px-4 py-3 shadow-sm pt-safe">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-black/50 text-slate-500 dark:text-slate-300 active:scale-90 cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="text-center">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Vault & Statistics</h2>
          <p className="text-xs font-semibold text-slate-400">Daily Learning Tracker</p>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Stats Area */}
      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-4">
        {/* Streak Hero Card */}
        <div className="rounded-3xl border border-orange-200 dark:border-orange-900/40 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white shadow-xl shadow-orange-500/20 text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-inner">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.59.833-6 1.83 2.122 3.654 4.542 2.667 8 .5 0 1-.5 1-1.5 1 2 0 5-2.5 5a2.5 2.5 0 0 1-2.5-2.5z"/><path d="M12 22a7.5 7.5 0 0 1-7.5-7.5c0-4.088 3.518-6.19 3.99-6.438.2-.102.443-.075.617.067.174.143.23.38.136.589-1.298 2.879-1.378 4.708-.239 6.208a3.5 3.5 0 0 0 5.012-.016c1.127-1.488 1.05-3.32-.236-6.197-.092-.206-.037-.442.134-.586.17-.144.412-.172.611-.072C14.986 8.317 19.5 10.422 19.5 14.5 19.5 18.636 16.136 22 12 22z"/></svg>
          </div>

          <h3 className="text-4xl font-black">{progress.streak} Day Streak 🔥</h3>
          <p className="text-xs font-bold text-orange-100">
            Keep practicing daily to maintain your fire and unlock bonus coins!
          </p>

          <div className="pt-2">
            <div className="flex justify-between text-xs font-extrabold text-orange-100 mb-1">
              <span>Today's Goal: {progress.todayXP}/{progress.dailyGoalXP} XP</span>
              <span>{Math.min(100, Math.floor((progress.todayXP / progress.dailyGoalXP) * 100))}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full bg-amber-300 transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.floor((progress.todayXP / progress.dailyGoalXP) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-black p-4 text-center shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Total XP Earned</span>
            <div className="mt-1 flex items-center justify-center gap-1 text-2xl font-black text-[#58cc02]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2z"/></svg>
              <span>{progress.xp}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-black p-4 text-center shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Coins Collected</span>
            <div className="mt-1 flex items-center justify-center gap-1 text-2xl font-black text-amber-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
              <span>{progress.coins}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-black p-4 text-center shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Gems Earned</span>
            <div className="mt-1 flex items-center justify-center gap-1 text-2xl font-black text-purple-600 dark:text-purple-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 22 22 7 12 2"/></svg>
              <span>{progress.gems}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-black p-4 text-center shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Hearts</span>
            <div className="mt-1 flex items-center justify-center gap-1 text-2xl font-black text-rose-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              <span>{progress.hearts}/5</span>
            </div>
          </div>
        </div>

        {/* Weak Words Section */}
        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-black p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Weak Words Review</h4>
              <p className="text-xs font-semibold text-slate-400">
                {progress.weakWords.length} words need extra practice
              </p>
            </div>

            <button
              onClick={onStartWeakWords}
              className="flex items-center gap-1.5 rounded-full bg-rose-500 hover:bg-rose-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-rose-500/20 active:scale-95 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              <span>Practice Now</span>
            </button>
          </div>

          {progress.weakWords.length > 0 ? (
            <div className="space-y-2 pt-1">
              {progress.weakWords.slice(0, 4).map((w: VocabWord, idx: number) => (
                <div
                  key={idx}
                  onClick={() => speakPt(w.pt)}
                  className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-black/50 p-3 text-xs cursor-pointer hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="font-extrabold text-slate-900 dark:text-white">{w.pt}</span>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">"{w.en}"</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-bold text-[#58cc02] text-center py-2">
              ✨ No weak words right now! Your Portuguese memory is sharp!
            </p>
          )}
        </div>

        {/* Daily Reminder Settings */}
        <div className="flex items-center justify-between rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-black p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Daily Study Reminders</h4>
              <p className="text-xs font-semibold text-slate-400">
                Receive encouraging notifications from Sujan
              </p>
            </div>
          </div>

          <button
            onClick={onToggleReminders}
            className={`h-7 w-12 rounded-full p-1 transition-colors cursor-pointer ${
              progress.remindersEnabled ? 'bg-[#58cc02]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white transition-transform ${
                progress.remindersEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
