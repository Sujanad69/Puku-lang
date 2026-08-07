import React, { useState, useRef, useEffect } from 'react';
import { OutfitItem, UserProgress } from '../types';
import { OUTFITS_DATA } from '../data/outfitsData';
import { playSuccessSound, playTone } from '../utils/audio';

// SVG Icons to exactly match language.html
const ThemeMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);
const ThemeSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);
const SvgGem = ({ size = 20, style }: { size?: number, style?: React.CSSProperties }) => (
  <svg width={size} height={size} style={{ display: 'inline-block', marginBottom: '2px', ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 22 22 7 12 2"></polygon></svg>
);
const SvgCoin = ({ size = 20, style }: { size?: number, style?: React.CSSProperties }) => (
  <svg width={size} height={size} style={{ display: 'inline-block', marginBottom: '2px', ...style }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8M8 12h8"></path></svg>
);
const SvgClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
);
const SvgBigLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: '80px', height: '80px', color: 'rgba(255,255,255,0.95)', filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.5))', marginBottom: '24px', strokeWidth: 1.2 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const SvgSmallLock = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

interface Full3DWardrobeProps {
  progress: UserProgress;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onClose: () => void;
  onEquipOutfit: (outfitId: string) => void;
  onBuyOutfit: (outfit: OutfitItem) => boolean;
}

export const Full3DWardrobe: React.FC<Full3DWardrobeProps> = ({
  progress,
  theme,
  onToggleTheme,
  onClose,
  onEquipOutfit,
  onBuyOutfit,
}) => {
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem>(() => {
    return OUTFITS_DATA.find(o => o.id === progress.currentOutfitId) || OUTFITS_DATA[0];
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const viewerRef = useRef<any>(null);

  // Track orbit and target to persist across outfit changes
  const activeOrbit = useRef("0deg 85deg 4.2m");
  const activeTarget = useRef("0m 1.05m 0m");

  const isDarkTheme = theme === 'dark';

  const isOwned = (outfitId: string) => {
    return outfitId === 'base' || progress.purchasedOutfits.includes(outfitId);
  };

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    
    const handleCameraChange = (e: any) => {
      if (e.detail.source === 'user-interaction') {
        const orb = viewer.getCameraOrbit();
        const tgt = viewer.getCameraTarget();
        activeOrbit.current = `${orb.theta}rad ${orb.phi}rad ${orb.radius}m`;
        activeTarget.current = `${tgt.x}m ${tgt.y}m ${tgt.z}m`;
      }
    };
    
    const handleLoad = () => {
      viewer.cameraOrbit = activeOrbit.current;
      viewer.cameraTarget = activeTarget.current;
      viewer.jumpCameraToGoal();
    };

    viewer.addEventListener('camera-change', handleCameraChange);
    viewer.addEventListener('load', handleLoad);
    
    return () => {
      viewer.removeEventListener('camera-change', handleCameraChange);
      viewer.removeEventListener('load', handleLoad);
    };
  }, []);

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
        showToast(`Not enough coins! Keep studying. 📚`);
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentlyOwned = isOwned(selectedOutfit.id);

  // Styling based on HTML
  const wrapperStyle = isDarkTheme 
    ? { background: 'radial-gradient(circle at 50% 50%, #2c2c2e 0%, #050505 100%)', color: 'white' }
    : { background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #d1d1d6 100%)', color: '#1c1c1e' };
    
  const pillStyle = isDarkTheme
    ? { background: 'rgba(30, 30, 32, 0.7)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }
    : { background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(30px)', border: '1px solid rgba(0,0,0,0.05)', color: '#1c1c1e' };

  return (
    <div
      style={wrapperStyle}
      className={`fixed inset-0 z-[9999] flex flex-col overflow-hidden pointer-events-auto transition-colors duration-400 animate-in fade-in`}
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
            className="rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 h-12 flex items-center justify-center shrink-0 whitespace-nowrap px-4 font-extrabold text-base gap-1.5"
          >
            <SvgGem size={20} style={{ color: '#b250ff' }} />
            <span style={{ color: '#b250ff' }}>{progress.gems}</span>
          </div>

          {/* Coins Pill */}
          <div 
            style={pillStyle} 
            className="rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 h-12 flex items-center justify-center shrink-0 whitespace-nowrap px-4 font-extrabold text-base gap-1.5"
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
          toastMessage ? 'bottom-[100px]' : '-bottom-[100px]'
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
          className={`border-none px-7 py-3.5 rounded-[30px] font-extrabold text-[1.05rem] cursor-pointer flex items-center gap-1.5 transition-transform duration-200 active:scale-95 text-white ${
            selectedOutfit.currency === 'gem'
              ? 'bg-[#b250ff] shadow-[0_8px_20px_rgba(178,80,255,0.4)]'
              : 'bg-[#58cc02] shadow-[0_8px_20px_rgba(88,204,2,0.4)]'
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
          src={selectedOutfit.url}
          camera-controls
          autoplay
          seamless-poster
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
        />
      </div>

      {/* Floating Outfit Selector Deck */}
      <div 
        className="absolute bottom-[calc(30px+env(safe-area-inset-bottom,20px))] left-1/2 -translate-x-1/2 w-[94%] max-w-[440px] py-[18px] px-3 z-20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] pointer-events-auto h-auto"
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
                        : 'border-[#58cc02] shadow-[0_0_15px_rgba(88,204,2,0.4)]'
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
                      ? isGem ? 'text-[#b250ff] font-extrabold' : 'text-[#58cc02] font-extrabold'
                      : isDarkTheme ? 'text-[#e5e5ea]' : 'text-[#1c1c1e]'
                  }`}
                  style={{ whiteSpace: 'normal' }}
                >
                  {outfit.name}
                </span>

                {/* Price Label */}
                {owned ? (
                  <span className="text-[0.65rem] font-extrabold text-[#8e8e93] text-center flex items-center justify-center gap-1 w-full">
                    Owned
                  </span>
                ) : (
                  <span 
                    className={`text-[0.65rem] font-extrabold text-center flex items-center justify-center gap-1 w-full ${
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
