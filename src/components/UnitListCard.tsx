import React from 'react';
import { UNITS_DATA } from '../data/portugueseData';
import { Unit, UserProgress } from '../types';

interface UnitListCardProps {
  onSelectUnit: (unitId: string) => void;
  progress?: UserProgress;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  MessageSquare: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Coffee: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>,
  MapPin: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Home: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  ShoppingBag: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Heart: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
};

const LockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const UnitListCard: React.FC<UnitListCardProps> = ({ onSelectUnit, progress }) => {
  const units = Object.values(UNITS_DATA).filter(u => u.id.startsWith('unit'));
  
  const currentXP = progress?.xp || 0;
  // 100 XP per unit logic for unlock
  const currentIndex = Math.min(units.length - 1, Math.floor(currentXP / 100));

  const getOffset = (index: number) => {
    const pattern = [0, -35, -50, -35, 0, 35, 50, 35];
    return pattern[index % pattern.length];
  };

  
  // Group units by Chapter
  const groupedUnits: { chapter: {num: number, title: string, desc: string}, units: {unit: Unit, globalIdx: number}[] }[] = [];
  units.forEach((unit, globalIdx) => {
    let chapter = groupedUnits.find(g => g.chapter.num === unit.chapterNum);
    if (!chapter) {
      chapter = { chapter: { num: unit.chapterNum, title: unit.chapterTitle, desc: unit.chapterDesc }, units: [] };
      groupedUnits.push(chapter);
    }
    chapter.units.push({ unit, globalIdx });
  });

  return (
    <div className="py-4 max-w-lg mx-auto pb-24">
      {groupedUnits.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-12 animate-in fade-in slide-in-from-bottom-4 relative">
          
          {/* Chapter Header Banner */}
          <div className="w-full flex flex-col items-start px-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xl text-[#2563eb]">
                {group.chapter.num}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-tight">
                  {group.chapter.title}
                </h2>
                <p className="text-sm sm:text-base font-bold text-slate-400">
                  {group.chapter.desc}
                </p>
              </div>
            </div>
            <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-800 mt-4 rounded-full"></div>
          </div>

          <div className="relative flex flex-col items-center">
            {group.units.map(({ unit, globalIdx }, localIdx) => {
              const offsetX = getOffset(localIdx);
              // Calculate next offset strictly for visual paths
              const nextOffsetX = localIdx < group.units.length - 1 ? getOffset(localIdx + 1) : null;
              
              const isCompleted = globalIdx < currentIndex;
              const isCurrent = globalIdx === currentIndex;
              const isLocked = globalIdx > currentIndex;
              
              let nodeBg = 'bg-[#3B82F6]'; 
              let nodeShadow = 'bg-[#1d4ed8]'; 
              let icon = ICON_MAP[unit.iconName] || <CheckIcon />;
              
              if (isCompleted) {
                nodeBg = 'bg-amber-400';
                nodeShadow = 'bg-amber-600';
                icon = <CheckIcon />;
              } else if (isLocked) {
                nodeBg = 'bg-slate-200 dark:bg-slate-800';
                nodeShadow = 'bg-slate-300 dark:bg-slate-900';
                icon = <LockIcon />;
              }

              return (
                <div key={unit.id} className="relative flex flex-col items-center w-full" style={{ marginBottom: nextOffsetX !== null ? '0' : '20px' }}>
                  
                  {/* Connecting Path */}
                  {nextOffsetX !== null && (
                    <svg className="absolute pointer-events-none z-0" style={{
                      top: '65px', 
                      width: '100%',
                      height: '130px', 
                      left: 0
                    }}>
                      <path 
                        d={`M ${50 + offsetX}%, 0 C ${50 + offsetX}%, 60 ${50 + nextOffsetX}%, 60 ${50 + nextOffsetX}%, 130`}
                        fill="none"
                        stroke={isCompleted ? "#FBBF24" : "#E2E8F0"}
                        strokeWidth="16"
                        strokeLinecap="round"
                        className={isCompleted ? "" : "dark:stroke-slate-800"}
                      />
                    </svg>
                  )}

                  {/* The Node */}
                  <div 
                    className={`relative z-10 flex flex-col items-center group ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                    style={{ transform: `translateX(${offsetX}%)` }}
                    onClick={() => {
                      if (isLocked) {
                        alert('Complete previous lessons to unlock this one!');
                      } else {
                        onSelectUnit(unit.id);
                      }
                    }}
                  >
                    {/* Crown for current */}
                    {isCurrent && (
                      <div className="absolute -top-6 animate-bounce bg-amber-400 text-amber-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg border-2 border-white z-20 flex items-center gap-1">
                        <span>Start</span>
                      </div>
                    )}

                    {/* 3D Button wrapper */}
                    <div className={`relative transition-transform duration-200 ${isLocked ? '' : 'active:scale-95'}`}>
                      {/* Button Bottom Shadow Layer */}
                      <div className={`absolute inset-0 ${nodeShadow} rounded-full translate-y-[8px]`}></div>
                      
                      {/* Button Top Layer */}
                      <div className={`relative flex items-center justify-center w-[80px] h-[80px] ${nodeBg} ${isLocked ? 'text-slate-400 dark:text-slate-600 border-slate-300 dark:border-slate-700' : 'text-white border-[#60a5fa]'} rounded-full border-4 shadow-sm transition-transform`}>
                        <div className={`${isLocked ? 'opacity-50' : 'drop-shadow-md'}`}>
                          {icon}
                        </div>
                      </div>
                    </div>
                    
                    {/* Label */}
                    <div className="mt-6 mb-8 text-center px-4 max-w-[150px]">
                      <span className={`text-sm font-bold ${isLocked ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'} tracking-tight leading-tight block`}>
                        {unit.title.split(': ')[1] || unit.title}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
