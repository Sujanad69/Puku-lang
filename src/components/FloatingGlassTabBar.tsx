import React from 'react';
import { ActiveModal } from '../types';
import { playTone } from '../utils/audio';

interface FloatingGlassTabBarProps {
  activeModal: ActiveModal;
  onChangeTab: (tab: ActiveModal) => void;
  lang?: 'pt' | 'en';
}

export const FloatingGlassTabBar: React.FC<FloatingGlassTabBarProps> = ({
  activeModal,
  onChangeTab,
  lang = 'pt',
}) => {
  // Determine active tab among the 3 main tabs
  let currentTab: 'learn' | 'style' | 'achievements' = 'learn';
  if (activeModal === 'wardrobe') {
    currentTab = 'style';
  } else if (activeModal === 'vault') {
    currentTab = 'achievements';
  } else {
    currentTab = 'learn';
  }

  const handleSelect = (targetModal: ActiveModal) => {
    playTone(550, 'sine', 0.04);
    onChangeTab(targetModal);
  };

  // Single word labels for iOS minimalist style
  const labels = {
    learn: lang === 'pt' ? 'Aprender' : 'Learn',
    style: lang === 'pt' ? 'Estilo' : 'Style',
    achievements: lang === 'pt' ? 'Conquistas' : 'Vault',
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-sm sm:max-w-md pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between gap-1 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/85 backdrop-blur-3xl border border-white/70 dark:border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all overflow-x-auto no-scrollbar snap-x">
        
        {/* Tab 1: Learn */}
        <button
          onClick={() => handleSelect('none')}
          className={`flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-black text-xs tracking-tight transition-all duration-300 cursor-pointer select-none snap-center whitespace-nowrap ${
            currentTab === 'learn'
              ? 'bg-[#58cc02] text-white shadow-[0_4px_16px_rgba(88,204,2,0.4)] scale-[1.02]'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          <span>{labels.learn}</span>
        </button>

        {/* Tab 2: Style */}
        <button
          onClick={() => handleSelect('wardrobe')}
          className={`flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-black text-xs tracking-tight transition-all duration-300 cursor-pointer select-none snap-center whitespace-nowrap ${
            currentTab === 'style'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_4px_16px_rgba(255,150,0,0.4)] scale-[1.02]'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
          <span>{labels.style}</span>
        </button>

        {/* Tab 3: Achievements */}
        <button
          onClick={() => handleSelect('vault')}
          className={`flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-black text-xs tracking-tight transition-all duration-300 cursor-pointer select-none snap-center whitespace-nowrap ${
            currentTab === 'achievements'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_16px_rgba(147,51,234,0.4)] scale-[1.02]'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2z"/></svg>
          <span>{labels.achievements}</span>
        </button>

      </nav>
    </div>
  );
};
