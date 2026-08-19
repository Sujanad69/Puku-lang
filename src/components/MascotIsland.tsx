import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserProgress } from '../types';
import { 
  User as UserIcon, 
  LogIn, 
  LogOut, 
  Coins, 
  Gem, 
  Heart, 
  Sun, 
  Moon, 
  Globe, 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  Flame, 
  Activity, 
  X 
} from 'lucide-react';
import { playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

interface MascotIslandProps {
  user?: User | null;
  onOpenAuth: () => void;
  logout?: () => void;
  progress: UserProgress;
  speechText: string;
  emoji: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  lang: 'pt' | 'en';
  onToggleLang: () => void;
  onOpenVault: () => void;
  onOpenQuests: () => void;
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
  onOpenQuests,
  onGoHome,
  user,
  onOpenAuth,
  logout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    playTone(550, 'sine', 0.03);
    triggerHaptic('light');
    setIsMenuOpen(prev => !prev);
  };

  return (
    <header className="sticky top-0 z-50 w-full pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between bg-[#ffffff]/80 dark:bg-[#000000]/80 backdrop-blur-2xl border-b border-black/[0.08] dark:border-white/[0.08] px-4 sm:px-6 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all">
        
        {/* Left: Mascot & Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              playTone(500, 'sine', 0.04);
              onGoHome();
            }} 
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer group active:scale-[0.97]"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-tr from-amber-400 via-rose-500 to-[#0a84ff] text-xl shadow-[0_4px_12px_rgba(10,132,255,0.25)] group-hover:scale-105 transition-transform duration-300">
              <span className="drop-shadow-sm">{emoji}</span>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#30d158] ring-2 ring-white dark:ring-black" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white leading-none font-['Courier_New',Courier,monospace]">
                  Puku
                </span>
                <span className="rounded-full bg-[#0a84ff]/10 dark:bg-[#0a84ff]/20 px-2 py-0.5 text-[9px] font-bold text-[#007aff] dark:text-[#0a84ff] border border-[#0a84ff]/20">
                  PT-PT 🇵🇹
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 truncate max-w-[130px] sm:max-w-[220px] mt-0.5">
                {speechText || 'with Sujan ❤️'}
              </p>
            </div>
          </button>
        </div>

        {/* Right: iOS Nav Capsules (Unified Stats + Profile Menu) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 1. Unified Game Stats Capsule (Hearts, Coins, Gems) */}
          <button
            onClick={() => {
              playTone(550, 'sine', 0.04);
              triggerHaptic('light');
              onOpenQuests();
            }}
            className="flex items-center gap-2 sm:gap-2.5 px-3.5 py-1.5 rounded-[14px] bg-black/[0.04] dark:bg-[#1c1c1e] hover:bg-black/[0.08] dark:hover:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] text-xs font-bold transition-all cursor-pointer group active:scale-95 shadow-xs"
            title="Daily Quests, Hearts & Rewards"
          >
            {/* Hearts */}
            <span className="flex items-center gap-1 text-[#ff375f] dark:text-[#ff375f]">
              <Heart className="w-3.5 h-3.5 fill-[#ff375f] text-[#ff375f]" />
              <span>{progress.hearts}</span>
            </span>

            <span className="h-3 w-px bg-black/[0.1] dark:bg-white/[0.12]" />

            {/* Coins */}
            <span className="flex items-center gap-1 text-[#ff9f0a] dark:text-[#ffd60a]">
              <Coins className="w-3.5 h-3.5 text-[#ff9f0a] dark:text-[#ffd60a]" />
              <span>{progress.coins}</span>
            </span>

            {/* Gems */}
            <span className="hidden sm:inline-flex items-center gap-1 text-[#bf5af2] dark:text-[#bf5af2]">
              <span className="h-3 w-px bg-black/[0.1] dark:bg-white/[0.12] mr-1.5" />
              <Gem className="w-3.5 h-3.5 text-[#bf5af2]" />
              <span>{progress.gems}</span>
            </span>
          </button>

          {/* 2. Unified Settings & Account Menu Popover */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className={`flex h-9 items-center gap-1.5 px-3 rounded-[14px] border transition-all cursor-pointer active:scale-95 ${
                isMenuOpen
                  ? 'bg-[#0a84ff] text-white border-transparent shadow-[0_4px_14px_rgba(10,132,255,0.4)]'
                  : 'bg-black/[0.04] dark:bg-[#1c1c1e] text-slate-700 dark:text-zinc-200 border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-[#2c2c2e]'
              }`}
              title="Account & App Settings"
            >
              {user ? (
                <div className="flex items-center gap-1.5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" className="w-5 h-5 rounded-full object-cover ring-1 ring-[#0a84ff]" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#0a84ff] text-white flex items-center justify-center text-[10px] font-black">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                  <span className="hidden md:inline text-xs font-bold max-w-[80px] truncate">
                    {user.displayName || 'Amisha'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs font-bold">Menu</span>
                </div>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Popover Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-[20px] bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] ios-modal-scale-in z-50">
                
                {/* Account / User Header */}
                <div className="p-3 mb-2.5 rounded-[16px] bg-black/[0.03] dark:bg-[#2c2c2e]/60 border border-black/[0.04] dark:border-white/[0.06]">
                  {user ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-[#0a84ff]" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#0a84ff] text-white flex items-center justify-center text-xs font-black shrink-0">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {user.displayName || 'Amisha'}
                          </p>
                          <p className="text-[10px] font-semibold text-[#30d158] dark:text-[#30d158] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" /> Cloud Synced
                          </p>
                        </div>
                      </div>

                      {logout && (
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            logout();
                          }}
                          className="p-2 rounded-[12px] text-[#ff453a] hover:bg-[#ff453a]/10 transition-colors cursor-pointer active:scale-95"
                          title="Sign Out"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Guest Learner
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                          Sign in to sync streaks & XP
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenAuth();
                        }}
                        className="px-3 py-1.5 rounded-[12px] bg-[#0a84ff] hover:bg-[#007aff] text-white text-[11px] font-bold transition-all cursor-pointer shadow-[0_2px_8px_rgba(10,132,255,0.4)] active:scale-95"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Toggle Rows */}
                <div className="space-y-1.5">
                  
                  {/* Theme Switcher */}
                  <div className="flex items-center justify-between p-2 rounded-[14px] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#ffd60a]/15 text-[#ff9f0a] dark:text-[#ffd60a]">
                        {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                        {theme === 'dark' ? 'Night OLED' : 'Day Theme'}
                      </span>
                    </div>
                    <button
                      onClick={onToggleTheme}
                      className="px-2.5 py-1 rounded-[10px] bg-black/[0.05] dark:bg-[#2c2c2e] text-[11px] font-bold text-slate-700 dark:text-zinc-200 hover:bg-[#0a84ff] hover:text-white transition-all cursor-pointer active:scale-95"
                    >
                      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                    </button>
                  </div>

                  {/* Language Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-[14px] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#0a84ff]/15 text-[#0a84ff]">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                        UI Language
                      </span>
                    </div>
                    <button
                      onClick={onToggleLang}
                      className="px-2.5 py-1 rounded-[10px] bg-black/[0.05] dark:bg-[#2c2c2e] text-[11px] font-bold text-[#0a84ff] hover:bg-[#0a84ff] hover:text-white transition-all cursor-pointer active:scale-95"
                    >
                      {lang === 'pt' ? '🇵🇹 Português' : '🇬🇧 English'}
                    </button>
                  </div>
                </div>

                {/* Navigation Shortlinks */}
                <div className="mt-3 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08] grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenQuests();
                    }}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-[12px] bg-[#ff9f0a]/10 text-[#ff9f0a] dark:text-[#ffd60a] text-xs font-bold hover:bg-[#ff9f0a]/20 transition-colors cursor-pointer active:scale-95"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Daily Quests</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenVault();
                    }}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-[12px] bg-[#bf5af2]/10 text-[#bf5af2] text-xs font-bold hover:bg-[#bf5af2]/20 transition-colors cursor-pointer active:scale-95"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#bf5af2]" />
                    <span>Activity Rings</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full mt-2.5 py-1.5 text-center text-[11px] font-semibold text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  Close Menu
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
