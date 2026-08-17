import React from 'react';
import { User } from 'firebase/auth';
import { UserProgress } from '../types';

interface MascotIslandProps {
  user?: User | null;
  login?: () => void;
  logout?: () => void;
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
  user,
  login,
  logout
}) => {
  return (
    <header className="sticky top-0 z-50 w-full pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/10 dark:border-white/10 px-4 py-3 shadow-sm transition-all">
        
        {/* Left: Mascot */}
        <div className="flex items-center gap-3">
          <button onClick={onGoHome} className="text-2xl hover:scale-105 transition-transform active:scale-95 cursor-pointer">
            {emoji}
          </button>
          
          <div className="hidden sm:block text-xs font-medium opacity-80 max-w-[200px] truncate">
             {speechText}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Day / Night Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-black text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-[#1a1a1a] active:scale-95 transition-all cursor-pointer border border-black/5 dark:border-white/10"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            )}
          </button>

          {/* EN / PT Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex h-9 px-3 items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-black text-slate-900 dark:text-white font-semibold text-xs hover:bg-slate-200 dark:hover:bg-[#1a1a1a] active:scale-95 transition-all cursor-pointer border border-black/5 dark:border-white/10"
            title={lang === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
          >
            <span>{lang === 'pt' ? 'PT' : 'EN'}</span>
          </button>

          {/* Sign In/Out */}
          <button
            onClick={user ? logout : login}
            className="flex h-9 px-3 items-center justify-center gap-2 rounded-xl bg-[#2563eb] text-white font-semibold text-xs hover:bg-[#1d4ed8] active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            {user && user.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-5 h-5 rounded-full" />
            ) : null}
            <span>{user ? 'Sign Out' : 'Sign In'}</span>
          </button>

          {/* Hearts */}
          <button
            onClick={onOpenVault}
            className="flex h-9 items-center justify-center gap-1.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer active:scale-95"
            title="Hearts"
          >
            <span>{progress.hearts}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>

        </div>
      </div>
    </header>
  );
};
