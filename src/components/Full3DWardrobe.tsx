import React, { useState, useRef, useEffect } from 'react';
import { OutfitItem, UserProgress } from '../types';
import { OUTFITS_DATA } from '../data/outfitsData';
import { playTone, playSuccessSound } from '../utils/audio';

// Basic Icons
const SvgCoin = ({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const SvgGem = ({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polygon points="12 2 2 7 12 22 22 7 12 2"></polygon>
    <polyline points="2 7 12 7 22 7"></polyline>
    <polyline points="12 22 12 7"></polyline>
  </svg>
);

const SvgClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SvgBigLock = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white mb-4 drop-shadow-lg">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const SvgSmallLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const ThemeSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

  
  
  
  const [modelUrls, setModelUrls] = useState<Record<string, string>>({});
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.setAttribute('loading', 'eager');
    }
    
    // Preload all models into Blob URLs for instant parsing and zero network latency on switch
    OUTFITS_DATA.forEach(async (outfit) => {
      try {
        const response = await fetch(outfit.url, { mode: 'cors' });
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        blobUrlsRef.current.push(objectUrl);
        setModelUrls(prev => ({ ...prev, [outfit.id]: objectUrl }));
      } catch (e) {
        // Fallback to network URL on failure
        setModelUrls(prev => ({ ...prev, [outfit.id]: outfit.url }));
      }
    });
    
    return () => {
      // Cleanup blob URLs on unmount
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const activeSrc = modelUrls[selectedOutfit.id] || selectedOutfit.url;




  const isOwned = (id: string) => progress.purchasedOutfits.includes(id);
  const currentlyOwned = isOwned(selectedOutfit.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectOutfit = (outfit: OutfitItem) => {
    playTone(600, 'sine', 0.05);
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
    ? { backgroundColor: '#1c1c1e', color: '#e5e5ea', border: '1px solid rgba(255,255,255,0.1)' }
    : { backgroundColor: '#ffffff', color: '#1c1c1e', border: '1px solid rgba(0,0,0,0.05)' };

  return (
    <div 
      className={`fixed inset-0 z-[1000] ${isDarkTheme ? 'bg-[#000000]' : 'bg-[#f4f5f8]'} flex flex-col overflow-hidden pointer-events-auto transition-colors duration-400 animate-in fade-in`}
    >
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full pt-[max(50px,env(safe-area-inset-top))] px-5 pb-5 flex justify-between items-start z-20 pointer-events-none">
        
        {/* Left: Studio Theme Pill */}
        <div 
          onClick={onToggleTheme}
          style={pillStyle}
          className="pointer-events-auto rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 h-12 flex items-center justify-center shrink-0 whitespace-nowrap px-4 cursor-pointer active:scale-95"
        >
          <span style={{display: 'flex'}}>
            {isDarkTheme 
              ? <ThemeMoon /> 
              : <ThemeSun />
            }
          </span>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.9, marginLeft: '8px' }}>Studio</div>
        </div>

        {/* Right: Currency & Close */}
        <div className="flex gap-[10px] items-center pointer-events-auto">
          {/* Gems Pill */}
          <div 
            style={pillStyle} 
            className="rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 h-12 flex items-center justify-center shrink-0 whitespace-nowrap px-4 font-bold text-base gap-1.5"
          >
            <SvgGem size={20} style={{ color: '#b250ff' }} />
            <span style={{ color: '#b250ff' }}>{progress.gems}</span>
          </div>

          {/* Coins Pill */}
          <div 
            style={pillStyle} 
            className="rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 h-12 flex items-center justify-center shrink-0 whitespace-nowrap px-4 font-bold text-base gap-1.5"
          >
            <SvgCoin size={20} style={{ color: '#ff9600' }} />
            <span style={{ color: '#ff9600' }}>{progress.coins}</span>
          </div>

          {/* Close Button */}
          <div 
            onClick={onClose}
            style={pillStyle}
            className="w-12 px-0 cursor-pointer rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 h-12 flex items-center justify-center shrink-0 active:scale-95"
          >
            <SvgClose />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 bg-[#1d1d1f] text-white px-7 py-3.5 rounded-[30px] font-bold text-[0.9rem] shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-[1000000] transition-all duration-500 text-center pointer-events-none flex items-center gap-2 ${
          toastMessage ? 'bottom-[220px]' : '-bottom-[100px]'
        }`}
      >
        {toastMessage}
      </div>

      {/* Lock / Unlock Overlay Card */}
      <div 
        className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-opacity duration-300 z-15 ${
          currentlyOwned ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        <SvgBigLock />
        
        <button
          onClick={handleBuy}
          className={`border-none px-7 py-3.5 rounded-[30px] font-semibold text-[1.05rem] cursor-pointer flex items-center gap-1.5 transition-transform duration-200 active:scale-95 text-white ${
            selectedOutfit.currency === 'gem' 
              ? 'bg-[#b250ff] shadow-[0_8px_20px_rgba(178,80,255,0.4)]' 
              : 'bg-[#2563eb] shadow-[0_8px_20px_rgba(37,99,235,0.4)]'
          }`}
        >
          Unlock • {selectedOutfit.cost}
          {selectedOutfit.currency === 'gem' 
            ? <SvgGem size={20} style={{ color: 'white', marginBottom: 0 }} />
            : <SvgCoin size={20} style={{ color: 'white', marginBottom: 0 }} />
          }
        </button>
      </div>

      {/* 3D Character Viewport - Fully Rotatable */}
      <div className="relative flex-1 w-full h-full">
        <model-viewer
          ref={viewerRef}
          id="fs-avatar-viewer"
          src={activeSrc}
          camera-controls
          autoplay
          seamless-poster
          loading="eager"
          camera-target="0m 1.05m 0m"
          camera-orbit="0deg 85deg 4.2m"
          field-of-view="25deg"
          min-field-of-view="10deg"
          max-field-of-view="45deg"
          environment-image="https://sujanad69.github.io/Pukumodel/studio_small_08_2k.hdr"
          exposure="1.0"
          shadow-intensity="1.5"
          shadow-softness="1"
          style={{ width: '100%', height: '100%', outline: 'none', position: 'absolute', top: 0, left: 0, zIndex: 5 }}
        >
        </model-viewer>
      </div>

      {/* Floating Outfit Selector Deck */}
      <div 
        className="absolute bottom-[calc(95px+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 w-[94%] max-w-[440px] py-[18px] px-3 z-20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] pointer-events-auto h-auto"
        style={pillStyle}
      >
        <div className="flex gap-4 overflow-x-auto py-1.5 px-1.5 no-scrollbar touch-pan-x">
          {OUTFITS_DATA.map((outfit: OutfitItem) => {
            const owned = isOwned(outfit.id);
            const isSelected = selectedOutfit.id === outfit.id;
            const isGem = outfit.currency === 'gem';

            return (
              <button
                key={outfit.id}
                onClick={() => handleSelectOutfit(outfit)}
                className={`shrink-0 bg-transparent border-none w-[72px] cursor-pointer flex flex-col items-center gap-2 transition-all duration-200 ${
                  isSelected ? 'opacity-100 -translate-y-1' : 'opacity-60'
                }`}
              >
                {/* Thumbnail Container */}
                <div 
                  className={`w-[72px] h-[72px] relative mx-auto rounded-[20px] p-[3px] border-[3px] transition-all box-border ${
                    isSelected 
                      ? isGem 
                        ? 'border-[#b250ff] shadow-[0_0_15px_rgba(178,80,255,0.4)]'
                        : 'border-[#2563eb] shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={outfit.thumb}
                    alt={outfit.name}
                    className="w-full h-full object-cover bg-[#2c2c2e] rounded-[14px]"
                  />
                  {/* Lock Overlay on Card if unowned */}
                  {!owned && (
                    <div className="absolute top-[3px] left-[3px] right-[3px] bottom-[3px] bg-[rgba(0,0,0,0.65)] rounded-[14px] flex items-center justify-center">
                      <span className="text-white flex"><SvgSmallLock /></span>
                    </div>
                  )}
                </div>

                {/* Outfit Name */}
                <span
                  className={`text-[0.65rem] font-semibold text-center flex items-center justify-center leading-[1.15] h-[26px] w-full ${
                    isSelected 
                      ? isGem ? 'text-[#b250ff] font-semibold' : 'text-[#2563eb] font-semibold'
                      : isDarkTheme ? 'text-[#e5e5ea]' : 'text-[#1c1c1e]'
                  }`}
                  style={{ whiteSpace: 'normal' }}
                >
                  {outfit.name}
                </span>

                {/* Price Label */}
                {owned ? (
                  <span className="text-[0.65rem] font-semibold text-[#8e8e93] text-center flex items-center justify-center gap-1 w-full">
                    Owned
                  </span>
                ) : (
                  <span 
                    className={`text-[0.65rem] font-semibold text-center flex items-center justify-center gap-1 w-full ${
                      isSelected 
                        ? isGem ? 'text-[#b250ff]' : 'text-[#ff9600]'
                        : isGem ? 'text-[#b250ff]' : 'text-[#8e8e93]'
                    }`}
                  >
                    {outfit.cost} 
                    {isGem 
                      ? <SvgGem size={10} style={{ marginBottom: 0 }} />
                      : <SvgCoin size={10} style={{ marginBottom: 0 }} />
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
