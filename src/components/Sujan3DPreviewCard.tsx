import React, { useState } from 'react';
import { OutfitItem } from '../types';

const SvgTag = () => (
  <svg className="svg-icon" style={{ color: '#58cc02', width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
);

const ThemeMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);

const ThemeSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);

const SvgExpand = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
);

interface Sujan3DPreviewCardProps {
  currentOutfit: OutfitItem;
  onOpenWardrobe: () => void;
}

export const Sujan3DPreviewCard: React.FC<Sujan3DPreviewCardProps> = ({
  currentOutfit,
  onOpenWardrobe,
}) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  return (
    <div>
      <div className="dash-boutique-label font-black text-[1.1rem] text-black tracking-[0.5px] mt-[30px] mb-[4px] flex items-center gap-2">
        <SvgTag />
        <span>Style Sujan ✨</span>
      </div>
      <div className="dash-boutique-sub text-[0.85rem] font-semibold text-[#8e8e93] mb-4 leading-[1.4]">
        Every lesson you complete earns coins to upgrade my style. I want to look my absolute best for you! 🤍
      </div>

      <div
        className={`dash-avatar-card w-full h-[440px] rounded-[36px] overflow-hidden relative shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-10 border border-black/5 transition-colors duration-300 ${
          isDarkTheme ? 'dash-theme-dark' : 'dash-theme-light'
        }`}
        style={{
          background: isDarkTheme
            ? 'radial-gradient(circle at 50% 50%, #2c2c2e 0%, #050505 100%)'
            : 'radial-gradient(circle at 50% 50%, #ffffff 0%, #e0e0e5 100%)',
        }}
      >
        <button
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className="dash-scene-pill absolute top-4 left-4 z-20 bg-[rgba(28,28,30,0.5)] backdrop-blur-[20px] rounded-[30px] flex items-center px-[14px] py-[8px] gap-2 border border-white/15 text-white cursor-pointer active:scale-95 transition-transform"
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {isDarkTheme ? <ThemeMoon /> : <ThemeSun />}
          </span>
          <span className="text-[0.75rem] font-bold ml-1">Theme</span>
        </button>

        <button
          onClick={onOpenWardrobe}
          className="expand-btn absolute bottom-4 right-4 z-20 bg-black/40 backdrop-blur-[15px] border border-white/20 text-white rounded-full w-[44px] h-[44px] flex justify-center items-center cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.15)] active:scale-90 transition-transform"
          title="Full Screen Wardrobe"
        >
          <SvgExpand />
        </button>

        <model-viewer
          id="dash-avatar-viewer"
          src={currentOutfit.url}
          camera-controls
          autoplay
          seamless-poster
          camera-target="0m 1.15m 0m"
          camera-orbit="0deg 85deg 1.7m"
          field-of-view="30deg"
          environment-image="https://sujanad69.github.io/Pukumodel/studio_small_08_2k.hdr"
          exposure="1.0"
          shadow-intensity="1.5"
          shadow-softness="1"
          style={{ width: '100%', height: '100%', outline: 'none' }}
        />
      </div>
    </div>
  );
};
