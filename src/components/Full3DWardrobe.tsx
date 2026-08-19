import React, { useState, useRef, useEffect } from 'react';
import { OutfitItem, UserProgress } from '../types';
import { OUTFITS_DATA } from '../data/outfitsData';
import { playTone, playSuccessSound } from '../utils/audio';
import { StudioStageBackground } from './StudioStageBackground';

// Crisp Apple HIG Minimal Vector Icons
const SvgCoin = ({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="9.5"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const SvgGem = ({ size = 20, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polygon points="12 2 2 7 12 22 22 7 12 2"></polygon>
    <polyline points="2 7 12 7 22 7"></polyline>
    <polyline points="12 22 12 7"></polyline>
  </svg>
);

const SvgClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SvgBigLock = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-white mb-3 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
    <rect x="3" y="11" width="18" height="11" rx="3" ry="3"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const SvgSmallLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2.5" ry="2.5"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const ThemeSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const ThemeMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

interface Full3DWardrobeProps {
  progress: UserProgress;
  onClose: () => void;
  onEquipOutfit: (id: string) => void;
  onBuyOutfit: (outfit: OutfitItem) => boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Full3DWardrobe: React.FC<Full3DWardrobeProps> = ({
  progress,
  onClose,
  onEquipOutfit,
  onBuyOutfit,
  theme,
  onToggleTheme,
}) => {
  const isDarkTheme = theme === 'dark';
  const initialOutfit = OUTFITS_DATA.find(o => o.id === progress.currentOutfitId) || OUTFITS_DATA[0];
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem>(initialOutfit);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.setAttribute('loading', 'eager');
      viewerRef.current.setAttribute('power-preference', 'high-performance');
      // If model has animation, ensure it plays at full 60fps smoothly
      if (viewerRef.current.play) {
        try {
          viewerRef.current.play({ repetitions: Infinity });
        } catch {
          // Ignored
        }
      }
    }
  }, [selectedOutfit]);

  const isOwned = (id: string) => progress.purchasedOutfits.includes(id);
  const currentlyOwned = isOwned(selectedOutfit.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectOutfit = (outfit: OutfitItem) => {
    playTone(600, 'sine', 0.04);
    setSelectedOutfit(outfit);
    
    if (isOwned(outfit.id)) {
      onEquipOutfit(outfit.id);
      showToast(`Equipped: ${outfit.name}! ✨`);
    }
  };

  const handleBuy = () => {
    const success = onBuyOutfit(selectedOutfit);
    if (success) {
      playSuccessSound();
      showToast(`${selectedOutfit.name} Unlocked! ✨`);
      onEquipOutfit(selectedOutfit.id);
    } else {
      if (selectedOutfit.currency === 'gem') {
        showToast(`Not enough Gems! Earn them by scoring 100% on quizzes. 💎`);
      } else {
        showToast(`Not enough Coins! Complete lessons to earn more. 🪙`);
      }
    }
  };

  const pillStyle = isDarkTheme 
    ? { 
        backgroundColor: 'rgba(28, 28, 30, 0.85)', 
        color: '#ffffff', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 12px 36px rgba(0, 0, 0, 0.5)'
      }
    : { 
        backgroundColor: 'rgba(255, 255, 255, 0.85)', 
        color: '#000000', 
        border: '1px solid rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 8px 24px rgba(0, 0, 0, 0.08)'
      };

  return (
    <div 
      className={`fixed inset-0 z-[1000] ${isDarkTheme ? 'bg-[#000000]' : 'bg-[#f2f2f7]'} flex flex-col overflow-hidden pointer-events-auto transition-colors duration-400 fade-in`}
    >
      {/* Top Header Floating Glass Capsule System */}
      <div className="absolute top-0 left-0 w-full pt-[max(50px,env(safe-area-inset-top))] px-5 pb-5 flex justify-between items-start z-20 pointer-events-none">
        
        {/* Left: Studio Theme Capsule */}
        <div 
          onClick={onToggleTheme}
          style={pillStyle}
          className="pointer-events-auto rounded-[20px] transition-all duration-300 h-11 flex items-center justify-center shrink-0 whitespace-nowrap px-4 cursor-pointer active:scale-95"
        >
          <span style={{ display: 'flex' }}>
            {isDarkTheme ? <ThemeMoon /> : <ThemeSun />}
          </span>
          <span className="text-xs font-bold tracking-tight ml-2">Studio</span>
        </div>

        {/* Right: Currency Badges & Native Close Action */}
        <div className="flex gap-2.5 items-center pointer-events-auto">
          {/* Gems Pill */}
          <div 
            style={pillStyle} 
            className="rounded-[20px] transition-all duration-300 h-11 flex items-center justify-center shrink-0 whitespace-nowrap px-3.5 font-bold text-xs gap-1.5"
          >
            <SvgGem size={17} style={{ color: '#bf5af2' }} />
            <span style={{ color: '#bf5af2' }}>{progress.gems}</span>
          </div>

          {/* Coins Pill */}
          <div 
            style={pillStyle} 
            className="rounded-[20px] transition-all duration-300 h-11 flex items-center justify-center shrink-0 whitespace-nowrap px-3.5 font-bold text-xs gap-1.5"
          >
            <SvgCoin size={17} style={{ color: '#ffd60a' }} />
            <span style={{ color: '#ffd60a' }}>{progress.coins}</span>
          </div>

          {/* Close Capsule */}
          <div 
            onClick={onClose}
            style={pillStyle}
            className="w-11 px-0 cursor-pointer rounded-[20px] transition-all duration-300 h-11 flex items-center justify-center shrink-0 active:scale-95"
          >
            <SvgClose />
          </div>
        </div>
      </div>

      {/* Dynamic Toast Pill */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 bg-[#1c1c1e]/90 text-white px-6 py-3 rounded-full font-bold text-xs shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl border border-white/10 z-[1000000] transition-all duration-400 text-center pointer-events-none flex items-center gap-2 ${
          toastMessage ? 'bottom-[230px] opacity-100 scale-100' : '-bottom-[100px] opacity-0 scale-95'
        }`}
      >
        {toastMessage}
      </div>

      {/* Lock / Unlock Callout Surface */}
      <div 
        className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-opacity duration-300 z-15 ${
          currentlyOwned ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        <SvgBigLock />
        
        <button
          onClick={handleBuy}
          className={`border-none px-7 py-3.5 rounded-[18px] font-bold text-[14px] cursor-pointer flex items-center gap-2 transition-all duration-200 active:scale-95 text-white ${
            selectedOutfit.currency === 'gem' 
              ? 'bg-gradient-to-r from-[#bf5af2] to-[#af52de] shadow-[0_8px_24px_rgba(191,90,242,0.4)] border border-white/20' 
              : 'bg-gradient-to-r from-[#0a84ff] to-[#0066ff] shadow-[0_8px_24px_rgba(10,132,255,0.45)] border border-white/20'
          }`}
        >
          Unlock • {selectedOutfit.cost}
          {selectedOutfit.currency === 'gem' 
            ? <SvgGem size={18} style={{ color: 'white' }} />
            : <SvgCoin size={18} style={{ color: 'white' }} />
          }
        </button>
      </div>

      {/* 3D Character Studio Stage Viewport - Smooth Hardware Rendered */}
      <div className="relative flex-1 w-full h-full">
        {/* Avaturn.me 3D Studio Stage Background (Cyclorama, Lighting Cones & Pedestal Turntable) */}
        <StudioStageBackground
          isDark={isDarkTheme}
        />

        <model-viewer
          ref={viewerRef}
          id="fs-avatar-viewer"
          src={selectedOutfit.url}
          camera-controls
          autoplay
          seamless-poster
          loading="eager"
          power-preference="high-performance"
          interpolation-decay="100"
          animation-crossfade-duration="300"
          camera-target="0m 1.05m 0m"
          camera-orbit="0deg 85deg 4.2m"
          field-of-view="25deg"
          min-field-of-view="10deg"
          max-field-of-view="45deg"
          environment-image="https://sujanad69.github.io/Pukumodel/studio_small_08_2k.hdr"
          exposure="1.0"
          shadow-intensity="0.8"
          shadow-softness="0.5"
          style={{ 
            width: '100%', 
            height: '100%', 
            outline: 'none', 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            zIndex: 10,
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        >
        </model-viewer>
      </div>

      {/* Floating Outfit Selector Bottom Deck */}
      <div 
        className="absolute bottom-[calc(90px+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 w-[94%] max-w-[460px] py-4 px-3.5 z-20 rounded-[28px] pointer-events-auto"
        style={pillStyle}
      >
        <div className="flex gap-3.5 overflow-x-auto py-1 px-1 no-scrollbar touch-pan-x">
          {OUTFITS_DATA.map((outfit: OutfitItem) => {
            const owned = isOwned(outfit.id);
            const isSelected = selectedOutfit.id === outfit.id;
            const isGem = outfit.currency === 'gem';

            return (
              <button
                key={outfit.id}
                onClick={() => handleSelectOutfit(outfit)}
                className={`shrink-0 bg-transparent border-none w-[72px] cursor-pointer flex flex-col items-center gap-1.5 transition-all duration-200 ${
                  isSelected ? 'opacity-100 -translate-y-1' : 'opacity-65 hover:opacity-90'
                }`}
              >
                {/* Thumbnail Container */}
                <div 
                  className={`w-[68px] h-[68px] relative mx-auto rounded-[18px] p-[2.5px] border-[2.5px] transition-all box-border ${
                    isSelected 
                      ? isGem 
                        ? 'border-[#bf5af2] shadow-[0_0_16px_rgba(191,90,242,0.45)]'
                        : 'border-[#0a84ff] shadow-[0_0_16px_rgba(10,132,255,0.5)]'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={outfit.thumb}
                    alt={outfit.name}
                    className="w-full h-full object-cover bg-[#2c2c2e] rounded-[13px]"
                  />
                  {/* Lock Overlay on Card if unowned */}
                  {!owned && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-[13px] flex items-center justify-center">
                      <span className="text-white flex"><SvgSmallLock /></span>
                    </div>
                  )}
                </div>

                {/* Outfit Name */}
                <span
                  className={`text-[10px] font-bold text-center flex items-center justify-center leading-tight h-[22px] w-full ${
                    isSelected 
                      ? isGem ? 'text-[#bf5af2]' : 'text-[#0a84ff]'
                      : isDarkTheme ? 'text-zinc-300' : 'text-zinc-700'
                  }`}
                  style={{ whiteSpace: 'normal' }}
                >
                  {outfit.name}
                </span>

                {/* Price Pill / Owned Status */}
                {owned ? (
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Equipped
                  </span>
                ) : (
                  <span 
                    className={`text-[10px] font-bold text-center flex items-center justify-center gap-1 w-full ${
                      isSelected 
                        ? isGem ? 'text-[#bf5af2]' : 'text-[#ffd60a]'
                        : isGem ? 'text-[#bf5af2]' : 'text-zinc-400'
                    }`}
                  >
                    {outfit.cost} 
                    {isGem 
                      ? <SvgGem size={11} />
                      : <SvgCoin size={11} />
                    }
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
