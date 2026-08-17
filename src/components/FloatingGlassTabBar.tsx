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
  let currentTab: 'learn' | 'style' | 'achievements' | 'chat' = 'learn';
  if (activeModal === 'wardrobe') {
    currentTab = 'style';
  } else if (activeModal === 'vault') {
    currentTab = 'achievements';
  } else if (activeModal === 'chat') {
    currentTab = 'chat';
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
    chat: lang === 'pt' ? 'Chat' : 'Tutor',
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[9999]">
      <nav className="flex items-center justify-center sm:justify-center md:gap-4 gap-2 px-4 py-3 sm:py-4 bg-white dark:bg-black border-t border-black/10 dark:border-white/10 pb-[max(env(safe-area-inset-bottom),0.75rem)] w-full">
        
        {/* Tab 1: Learn */}
        <button
          onClick={() => handleSelect('none')}
          className={`relative flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs tracking-tight transition-colors duration-300 cursor-pointer select-none ${
            currentTab === 'learn'
              ? 'text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          {currentTab === 'learn' && (
            <motion.div
              layoutId="tab-bubble"
              className="absolute inset-0 bg-[#2563eb] rounded-xl shadow-none"
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
          className={`relative flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs tracking-tight transition-colors duration-300 cursor-pointer select-none ${
            currentTab === 'style'
              ? 'text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          {currentTab === 'style' && (
            <motion.div
              layoutId="tab-bubble"
              className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-none"
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
          className={`relative flex-1 min-w-[95px] flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs tracking-tight transition-colors duration-300 cursor-pointer select-none ${
            currentTab === 'achievements'
              ? 'text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          {currentTab === 'achievements' && (
            <motion.div
              layoutId="tab-bubble"
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-none"
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
