import React from 'react';
import { ActiveModal } from '../types';
import { playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

interface FloatingGlassTabBarProps {
  activeModal: ActiveModal;
  onChangeTab: (modal: ActiveModal) => void;
  lang?: 'pt' | 'en';
}

export const FloatingGlassTabBar: React.FC<FloatingGlassTabBarProps> = ({
  activeModal,
  onChangeTab,
  lang = 'pt',
}) => {
  let currentTab: 'learn' | 'style' | 'activity' = 'learn';
  if (activeModal === 'wardrobe') {
    currentTab = 'style';
  } else if (activeModal === 'vault') {
    currentTab = 'activity';
  } else {
    currentTab = 'learn';
  }

  const handleSelect = (target: 'learn' | 'style' | 'activity') => {
    playTone(550, 'sine', 0.04);
    triggerHaptic('light');
    if (target === 'learn') {
      onChangeTab('none');
    } else if (target === 'style') {
      onChangeTab('wardrobe');
    } else if (target === 'activity') {
      onChangeTab('vault');
    }
  };

  const labels = {
    learn: lang === 'pt' ? 'Aprender' : 'Learn',
    style: lang === 'pt' ? 'Estilo' : 'Style',
    activity: lang === 'pt' ? 'Atividade' : 'Activity',
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[9999] pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-center max-w-lg mx-auto sm:max-w-md md:gap-3 gap-1.5 px-3.5 py-2.5 bg-white/80 dark:bg-[#1c1c1e]/85 backdrop-blur-2xl border-t border-black/[0.08] dark:border-white/[0.1] rounded-t-[24px] shadow-[0_-10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-12px_40px_rgba(0,0,0,0.7)] pb-[max(env(safe-area-inset-bottom),0.75rem)] w-full">
        
        {/* Tab 1: Learn */}
        <button
          onClick={() => handleSelect('learn')}
          className={`relative flex-1 min-w-[85px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-[14px] font-semibold text-xs tracking-tight transition-all duration-200 cursor-pointer select-none active:scale-95 ${
            currentTab === 'learn'
              ? 'text-white'
              : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {currentTab === 'learn' && (
            <motion.div
              layoutId="ios-tab-pill"
              className="absolute inset-0 bg-[#0a84ff] rounded-[14px] shadow-[0_4px_14px_rgba(10,132,255,0.45)]"
              transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span className="font-bold">{labels.learn}</span>
          </span>
        </button>

        {/* Tab 2: Style */}
        <button
          onClick={() => handleSelect('style')}
          className={`relative flex-1 min-w-[85px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-[14px] font-semibold text-xs tracking-tight transition-all duration-200 cursor-pointer select-none active:scale-95 ${
            currentTab === 'style'
              ? 'text-white'
              : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {currentTab === 'style' && (
            <motion.div
              layoutId="ios-tab-pill"
              className="absolute inset-0 bg-gradient-to-r from-[#ff9f0a] to-[#ff375f] rounded-[14px] shadow-[0_4px_14px_rgba(255,159,10,0.45)]"
              transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
            </svg>
            <span className="font-bold">{labels.style}</span>
          </span>
        </button>

        {/* Tab 3: Activity */}
        <button
          onClick={() => handleSelect('activity')}
          className={`relative flex-1 min-w-[85px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-[14px] font-semibold text-xs tracking-tight transition-all duration-200 cursor-pointer select-none active:scale-95 ${
            currentTab === 'activity'
              ? 'text-white'
              : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {currentTab === 'activity' && (
            <motion.div
              layoutId="ios-tab-pill"
              className="absolute inset-0 bg-gradient-to-r from-[#bf5af2] to-[#5e5ce6] rounded-[14px] shadow-[0_4px_14px_rgba(191,90,242,0.45)]"
              transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Activity className="w-4 h-4" strokeWidth={2.4} />
            <span className="font-bold">{labels.activity}</span>
          </span>
        </button>
      </nav>
    </div>
  );
};
