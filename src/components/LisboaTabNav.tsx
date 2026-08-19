import React from 'react';
import { playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { Compass, Gamepad2, Heart } from 'lucide-react';

export type HomeTab = 'path' | 'arcade' | 'vault';

interface LisboaTabNavProps {
  activeTab: HomeTab;
  onChangeTab: (tab: HomeTab) => void;
  lang: 'pt' | 'en';
}

export const LisboaTabNav: React.FC<LisboaTabNavProps> = ({
  activeTab,
  onChangeTab,
  lang,
}) => {
  const tabs = [
    {
      id: 'path' as HomeTab,
      label: lang === 'pt' ? 'Trilha' : 'Path',
      icon: Compass,
    },
    {
      id: 'arcade' as HomeTab,
      label: lang === 'pt' ? 'Arcade' : 'Arcade',
      icon: Gamepad2,
    },
    {
      id: 'vault' as HomeTab,
      label: lang === 'pt' ? 'Amor & Vocab' : 'Love & Vocab',
      icon: Heart,
    },
  ];

  return (
    <div className="flex items-center justify-center py-2 px-2 w-full">
      <div className="inline-flex p-1 rounded-[22px] bg-[#1c1c1e]/85 backdrop-blur-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playTone(550, 'sine', 0.03);
                triggerHaptic('light');
                onChangeTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-[18px] text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap ${
                isActive
                  ? 'bg-[#2c2c2e] text-[#0a84ff] shadow-[0_2px_10px_rgba(0,0,0,0.45)] scale-[1.02]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
