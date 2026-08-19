import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserProgress } from '../types';
import { 
  LogOut, 
  Sun, 
  Moon, 
  Globe, 
} from 'lucide-react';
import { playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';

// Crisp Apple HIG Minimal Vector Icons (Exact same as 3D Outfit panel)
const SvgCoin = ({ size = 15, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="9.5"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const SvgGem = ({ size = 15, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polygon points="12 2 2 7 12 22 22 7 12 2"></polygon>
    <polyline points="2 7 12 7 22 7"></polyline>
    <polyline points="12 22 12 7"></polyline>
  </svg>
);

const SvgHeart = ({ size = 15, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const SvgSettings = ({ size = 15, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// Vector SVG Monkey Mascot Logo
const MonkeyLogoSVG: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left Ear */}
    <circle cx="6.5" cy="15" r="4.5" fill="#f59e0b" />
    <circle cx="6.5" cy="15" r="2.5" fill="#fde68a" />
    {/* Right Ear */}
    <circle cx="25.5" cy="15" r="4.5" fill="#f59e0b" />
    <circle cx="25.5" cy="15" r="2.5" fill="#fde68a" />
    {/* Main Head */}
    <ellipse cx="16" cy="16" rx="10.5" ry="9.5" fill="#d97706" />
    {/* Inner Face Mask */}
    <path
      d="M10 13a4.5 4.5 0 0 1 6-1 4.5 4.5 0 0 1 6 1c1.5 2 1.5 5 0 7-1.5 2-4.5 3-6 3s-4.5-1-6-3c-1.5-2-1.5-5 0-7z"
      fill="#fef3c7"
    />
    {/* Eyes */}
    <ellipse cx="12.5" cy="14" rx="1.3" ry="1.6" fill="#1e293b" />
    <circle cx="12.9" cy="13.5" r="0.5" fill="#ffffff" />
    <ellipse cx="19.5" cy="14" rx="1.3" ry="1.6" fill="#1e293b" />
    <circle cx="19.9" cy="13.5" r="0.5" fill="#ffffff" />
    {/* Snout / Muzzle */}
    <ellipse cx="16" cy="18" rx="3.2" ry="2.2" fill="#fed7aa" />
    {/* Nose nostrils */}
    <circle cx="15.2" cy="17.5" r="0.5" fill="#78350f" />
    <circle cx="16.8" cy="17.5" r="0.5" fill="#78350f" />
    {/* Smile */}
    <path
      d="M14.2 19c.6.8 3 .8 3.6 0"
      stroke="#78350f"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  </svg>
);

interface MascotIslandProps {
  user?: User | null;
  onOpenAuth: () => void;
  logout?: () => void;
  progress: UserProgress;
  speechText?: string;
  emoji?: string;
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
  theme,
  onToggleTheme,
  lang,
  onToggleLang,
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
    <header className="sticky top-0 z-40 w-full pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between px-4 sm:px-8 py-3 bg-white/75 dark:bg-black/65 backdrop-blur-2xl border-b border-black/[0.04] dark:border-white/[0.06] transition-all">
        
        {/* Left: SVG Monkey Logo + PUKU */}
        <button 
          onClick={() => {
            playTone(500, 'sine', 0.03);
            onGoHome();
          }} 
          className="flex items-center gap-2.5 hover:opacity-85 transition-all cursor-pointer group active:scale-95"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 group-hover:scale-105 transition-transform">
            <MonkeyLogoSVG className="w-6 h-6" />
          </div>
          <span className="text-sm sm:text-base font-black tracking-wider text-slate-900 dark:text-white uppercase font-['Courier_New',Courier,monospace]">
            PUKU
          </span>
        </button>

        {/* Right: Same SVG Hearts, Coins, Gems as 3D Outfit Panel + Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Stats Glass Capsule: Hearts, Coins, Gems */}
          <button
            onClick={() => {
              playTone(550, 'sine', 0.03);
              triggerHaptic('light');
              onOpenQuests();
            }}
            className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.07] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] border border-black/[0.04] dark:border-white/[0.08] text-xs font-bold transition-all cursor-pointer active:scale-95 font-['Courier_New',Courier,monospace]"
            title="Quests, Hearts, Coins & Gems"
          >
            {/* SVG Heart */}
            <span className="flex items-center gap-1.5 text-[#ff375f]">
              <SvgHeart size={15} style={{ color: '#ff375f' }} />
              <span>{progress?.hearts ?? 5}</span>
            </span>

            <span className="h-3 w-px bg-black/10 dark:bg-white/15" />

            {/* SVG Coin */}
            <span className="flex items-center gap-1.5 text-[#ffd60a]">
              <SvgCoin size={15} style={{ color: '#ffd60a' }} />
              <span>{progress?.coins ?? 0}</span>
            </span>

            <span className="h-3 w-px bg-black/10 dark:bg-white/15" />

            {/* SVG Gem */}
            <span className="flex items-center gap-1.5 text-[#bf5af2]">
              <SvgGem size={15} style={{ color: '#bf5af2' }} />
              <span>{progress?.gems ?? 0}</span>
            </span>
          </button>

          {/* Settings Trigger */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all cursor-pointer active:scale-95 ${
                isMenuOpen
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-black/[0.04] dark:bg-white/[0.07] text-slate-700 dark:text-zinc-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.12] border border-black/[0.04] dark:border-white/[0.08]'
              }`}
              title="Settings & Account"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <SvgSettings size={15} />
              )}
            </button>

            {/* Popover Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.1] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] ios-modal-scale-in z-50 font-['Courier_New',Courier,monospace]">
                
                {/* Account / User Section */}
                <div className="p-2.5 mb-2 rounded-xl bg-black/[0.03] dark:bg-[#2c2c2e]/60 border border-black/[0.04] dark:border-white/[0.06]">
                  {user ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.displayName || 'Learner'}
                        </p>
                        <p className="text-[10px] text-[#30d158] font-semibold">
                          Cloud Synced
                        </p>
                      </div>

                      {logout && (
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            logout();
                          }}
                          className="p-1.5 rounded-lg text-[#ff453a] hover:bg-[#ff453a]/10 transition-colors cursor-pointer"
                          title="Sign Out"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Guest Mode
                      </p>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenAuth();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#0a84ff] hover:bg-[#007aff] text-white text-[10px] font-bold transition-all cursor-pointer active:scale-95"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Preferences */}
                <div className="space-y-1 text-xs">
                  
                  {/* Theme Switcher */}
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-zinc-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                      <span className="font-bold text-slate-700 dark:text-zinc-300">Theme</span>
                    </div>
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        onToggleTheme();
                      }}
                      className="px-2 py-0.5 rounded-lg bg-black/[0.05] dark:bg-white/[0.1] text-[10px] font-bold text-slate-700 dark:text-zinc-300"
                    >
                      {theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                  </div>

                  {/* Language Switcher */}
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-bold text-slate-700 dark:text-zinc-300">UI Lang</span>
                    </div>
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        onToggleLang();
                      }}
                      className="px-2 py-0.5 rounded-lg bg-black/[0.05] dark:bg-white/[0.1] text-[10px] font-bold text-slate-700 dark:text-zinc-300"
                    >
                      {lang === 'pt' ? 'PT' : 'EN'}
                    </button>
                  </div>

                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
