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
      <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-3xl border border-white/60 dark:border-white/10 p-2 sm:px-4 sm:py-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all">
        
        {/* Center: Speech Bubble Pill */}
        <div className="flex flex-1 max-w-xs sm:max-w-md items-center gap-2 rounded-full bg-slate-100/80 dark:bg-black/80 px-3 py-1 border border-black/5 dark:border-white/10 min-w-0">
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
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-black/50 text-slate-700 dark:text-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-black/5 dark:border-white/10"
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
            className="flex h-8 px-2.5 items-center justify-center gap-1 rounded-full bg-slate-100 dark:bg-black/50 text-slate-900 dark:text-white font-black text-[11px] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-black/5 dark:border-white/10"
            title={lang === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
          >
            <span>{lang === 'pt' ? '🇵🇹 PT' : '🇬🇧 EN'}</span>
          </button>

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
