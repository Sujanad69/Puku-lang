cat << 'INNER_EOF' > src/components/FloatingGlassTabBar.tsx
import React from 'react';
import { ActiveModal } from '../types';
import { playTone } from '../utils/audio';
import { motion } from 'motion/react';

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

  const labels = {
    learn: lang === 'pt' ? 'Aprender' : 'Learn',
    style: lang === 'pt' ? 'Estilo' : 'Style',
    achievements: lang === 'pt' ? 'Conquistas' : 'Vault',
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-sm sm:max-w-md pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between gap-1 p-1.5 rounded-full bg-white/70 dark:bg-[#111111]/70 backdrop-blur-3xl border border-white/60 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
        
        {/* Tab 1: Learn */}
        <button
          onClick={() => handleSelect('none')}
          className={`relative flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-black text-xs tracking-tight transition-colors duration-300 cursor-pointer select-none ${
            currentTab === 'learn'
              ? 'text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          {currentTab === 'learn' && (
            <motion.div
              layoutId="tab-bubble"
              className="absolute inset-0 bg-[#58cc02] rounded-full shadow-[0_4px_16px_rgba(88,204,2,0.4)]"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span>{labels.learn}</span>
          </span>
        </button>

        {/* Tab 2: Style */}
        <button
          onClick={() => handleSelect('wardrobe')}
          className={`relative flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-black text-xs tracking-tight transition-colors duration-300 cursor-pointer select-none ${
            currentTab === 'style'
              ? 'text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          {currentTab === 'style' && (
            <motion.div
              layoutId="tab-bubble"
              className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_4px_16px_rgba(255,150,0,0.4)]"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
            <span>{labels.style}</span>
          </span>
        </button>

        {/* Tab 3: Achievements */}
        <button
          onClick={() => handleSelect('vault')}
          className={`relative flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-black text-xs tracking-tight transition-colors duration-300 cursor-pointer select-none ${
            currentTab === 'achievements'
              ? 'text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          {currentTab === 'achievements' && (
            <motion.div
              layoutId="tab-bubble"
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-[0_4px_16px_rgba(147,51,234,0.4)]"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2z"/></svg>
            <span>{labels.achievements}</span>
          </span>
        </button>
      </nav>
    </div>
  );
};
INNER_EOF
chmod +x fix_tabbar.sh
./fix_tabbar.sh