import React from 'react';
import { UserProgress } from '../types';

interface MascotIslandProps {
  progress: UserProgress;
  speechText: string;
  emoji: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  lang: 'pt' | 'en';
  onToggleLang: () => void;
  onOpenVault: () => void;
  onGoHome: () => void;
}

export const MascotIsland: React.FC<MascotIslandProps> = ({
  progress,
  speechText,
  emoji,
  theme,
  onToggleTheme,
  lang,
  onToggleLang,
  onOpenVault,
  onGoHome,
}) => {
  return (
    <header className="sticky top-2 z-50 mx-auto w-full max-w-4xl px-3 pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/60 dark:border-white/10 p-2 sm:px-4 sm:py-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all">
        
        {/* Left: Brand Logo & Title */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
          title={lang === 'pt' ? 'Ir para o Início' : 'Go Home'}
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#58cc02] text-white font-black text-base sm:text-lg shadow-sm transition-transform group-hover:scale-105">
            🇵🇹
          </div>
          <div className="hidden md:block text-left">
            <span className="font-black text-xs tracking-tight text-slate-900 dark:text-white block leading-tight">
              Aprender Português
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#58cc02] block">
              European PT
            </span>
          </div>
        </button>

        {/* Center: Speech Bubble Pill */}
        <div className="flex flex-1 max-w-xs sm:max-w-md items-center gap-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1 border border-black/5 dark:border-white/10 min-w-0">
          <span className="text-sm sm:text-base shrink-0 animate-bounce">{emoji}</span>
          <p className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
            {speechText}
          </p>
        </div>

        {/* Right: Day/Night Toggle, Language Switch & Stats */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* Day / Night Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-black/5 dark:border-white/10"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            )}
          </button>

          {/* EN / PT Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex h-8 px-2.5 items-center justify-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-[11px] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-black/5 dark:border-white/10"
            title={lang === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
          >
            <span>{lang === 'pt' ? '🇵🇹 PT' : '🇬🇧 EN'}</span>
          </button>

          {/* Streak */}
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-700/40 text-xs font-black text-amber-600 dark:text-amber-400"
            title="Daily Streak"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.59.833-6 1.83 2.122 3.654 4.542 2.667 8 .5 0 1-.5 1-1.5 1 2 0 5-2.5 5a2.5 2.5 0 0 1-2.5-2.5z"/><path d="M12 22a7.5 7.5 0 0 1-7.5-7.5c0-4.088 3.518-6.19 3.99-6.438.2-.102.443-.075.617.067.174.143.23.38.136.589-1.298 2.879-1.378 4.708-.239 6.208a3.5 3.5 0 0 0 5.012-.016c1.127-1.488 1.05-3.32-.236-6.197-.092-.206-.037-.442.134-.586.17-.144.412-.172.611-.072C14.986 8.317 19.5 10.422 19.5 14.5 19.5 18.636 16.136 22 12 22z"/></svg>
            <span>{progress.streak}d</span>
          </div>

          {/* Hearts */}
          <button
            onClick={onOpenVault}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-700/40 text-xs font-black text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
            title="Hearts"
          >
            <span>{progress.hearts}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>

        </div>

      </div>
    </header>
  );
};
