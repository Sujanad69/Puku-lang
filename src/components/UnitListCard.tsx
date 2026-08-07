import React from 'react';
import { UNITS_DATA } from '../data/portugueseData';
import { Unit } from '../types';

interface UnitListCardProps {
  onSelectUnit: (unitId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  MessageSquare: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Coffee: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>,
  MapPin: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Home: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  ShoppingBag: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Heart: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
};

export const UnitListCard: React.FC<UnitListCardProps> = ({ onSelectUnit }) => {
  const units = Object.values(UNITS_DATA).filter(u => u.id !== 'unit7'); // Unit 7 handled via Love Language card

  return (
    <div>
      <div className="card-title text-[0.9rem] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[1.2px] mb-4 flex items-center gap-2">
        <svg width="20" height="20" className="stroke-slate-400 dark:stroke-slate-500 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        <span>Learning Modules</span>
      </div>

      <div className="units-container flex flex-col gap-3 mb-6">
        {units.map((unit: Unit) => (
          <div
            key={unit.id}
            onClick={() => onSelectUnit(unit.id)}
            className="unit-card bg-white dark:bg-slate-900 rounded-[24px] p-[20px] flex items-center gap-4 border border-black/5 dark:border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.03)] cursor-pointer transition-transform active:scale-[0.98] hover:border-[#58cc02]"
          >
            <div className="unit-icon w-[54px] h-[54px] min-w-[54px] rounded-[18px] flex items-center justify-center bg-[#f2f2f7] dark:bg-slate-800 text-[#1c1c1e] dark:text-white shrink-0">
              {ICON_MAP[unit.iconName] || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            </div>

            <div className="unit-info flex-1">
              <div className="unit-title font-extrabold text-[1.05rem] text-[#1c1c1e] dark:text-white mb-1">
                {unit.title}
              </div>
              <div className="unit-desc text-[0.8rem] text-slate-500 dark:text-slate-400 font-semibold">
                {unit.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
