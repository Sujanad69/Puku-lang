import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UNITS_DATA } from '../data/portugueseData';
import { Unit, UserProgress } from '../types';
import { playTone, playErrorSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import {
  MessageSquare,
  Coffee,
  MapPin,
  Home,
  ShoppingBag,
  Heart,
  User,
  Sparkles,
} from 'lucide-react';

interface UnitListCardProps {
  onSelectUnit: (unitId: string) => void;
  progress?: UserProgress;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-7 h-7" />,
  Coffee: <Coffee className="w-7 h-7" />,
  MapPin: <MapPin className="w-7 h-7" />,
  Home: <Home className="w-7 h-7" />,
  ShoppingBag: <ShoppingBag className="w-7 h-7" />,
  Heart: <Heart className="w-7 h-7 fill-current" />,
  User: <User className="w-7 h-7" />,
  Sparkles: <Sparkles className="w-7 h-7" />,
};

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Framer Motion Animation Variants for Apple-like smooth stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const chapterVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 280,
    },
  },
};

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 22,
      stiffness: 260,
    },
  },
};

export const UnitListCard: React.FC<UnitListCardProps> = ({ onSelectUnit, progress }) => {
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const units = Object.values(UNITS_DATA).filter(u => u.id.startsWith('unit'));
  
  const currentXP = progress?.xp || 0;
  // 100 XP per unit logic for unlock
  const currentIndex = Math.min(units.length - 1, Math.floor(currentXP / 100));

  const getOffset = (index: number) => {
    const pattern = [0, -32, -48, -32, 0, 32, 48, 32];
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

  const handleUnitClick = (unitId: string, isLocked: boolean) => {
    if (isLocked) {
      playErrorSound();
      triggerHaptic('error');
      setLockedNotice('Complete previous lessons to unlock this milestone! 🎯');
      setTimeout(() => setLockedNotice(null), 3000);
    } else {
      playTone(560, 'sine', 0.05);
      triggerHaptic('medium');
      onSelectUnit(unitId);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-4 max-w-lg mx-auto pb-28 relative"
    >
      {/* Non-intrusive Locked Toast notice */}
      {lockedNotice && (
        <motion.div 
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md border border-slate-700/50 flex items-center gap-2 pointer-events-none"
        >
          <span>🔒</span>
          <span>{lockedNotice}</span>
        </motion.div>
      )}

      {groupedUnits.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-14 relative">
          
          {/* Chapter Header Banner (Apple & Azulejo styled with spring motion) */}
          <motion.div 
            variants={chapterVariants}
            className="w-full px-5 mb-8"
          >
            <div className="relative overflow-hidden ios-card ios-glass p-5">
              {/* Subtle Portuguese Azulejo Tile Geometry */}
              <div className="absolute right-0 top-0 bottom-0 w-32 opacity-5 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-blue-600">
                  <path d="M50 0 L100 50 L50 100 L0 50 Z" />
                  <circle cx="50" cy="50" r="25" />
                  <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </div>

              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-2xl border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center font-bold text-lg text-blue-600 dark:text-blue-400 shrink-0 shadow-xs">
                  {group.chapter.num}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
                    {group.chapter.title}
                  </h2>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                    {group.chapter.desc}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Connected Path Nodes */}
          <div className="relative flex flex-col items-center">
            {group.units.map(({ unit, globalIdx }, localIdx) => {
              const offsetX = getOffset(localIdx);
              const nextOffsetX = localIdx < group.units.length - 1 ? getOffset(localIdx + 1) : null;
              
              const isCompleted = globalIdx < currentIndex;
              const isCurrent = globalIdx === currentIndex;
              const isLocked = globalIdx > currentIndex;
              
              let nodeBg = 'bg-blue-600 text-white';
              let nodeShadow = 'bg-blue-800';
              let icon = ICON_MAP[unit.iconName] || <CheckIcon />;
              
              if (isCompleted) {
                nodeBg = 'bg-amber-400 text-amber-950';
                nodeShadow = 'bg-amber-600';
                icon = <CheckIcon />;
              } else if (isLocked) {
                nodeBg = 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-700';
                nodeShadow = 'bg-slate-200 dark:bg-slate-900';
                icon = <LockIcon />;
              }

              return (
                <motion.div 
                  key={unit.id}
                  variants={nodeVariants}
                  className="relative flex flex-col items-center w-full"
                  style={{ marginBottom: nextOffsetX !== null ? '0' : '16px' }}
                >
                  {/* Connecting Path */}
                  {nextOffsetX !== null && (
                    <svg className="absolute pointer-events-none z-0" style={{
                      top: '60px', 
                      width: '100%',
                      height: '130px', 
                      left: 0
                    }}>
                      <path 
                        d={`M ${50 + offsetX}%, 0 C ${50 + offsetX}%, 60 ${50 + nextOffsetX}%, 60 ${50 + nextOffsetX}%, 130`}
                        fill="none"
                        stroke={isCompleted ? "#FBBF24" : "#E2E8F0"}
                        strokeWidth="12"
                        strokeLinecap="round"
                        className={isCompleted ? "" : "dark:stroke-slate-800"}
                      />
                    </svg>
                  )}

                  {/* The Interactive Learning Node with Framer Motion hover & spring tap */}
                  <motion.div 
                    className={`relative z-10 flex flex-col items-center group ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                    style={{ transform: `translateX(${offsetX}%)` }}
                    whileHover={!isLocked ? { scale: 1.05, y: -2 } : {}}
                    whileTap={!isLocked ? { scale: 0.94 } : {}}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    onClick={() => handleUnitClick(unit.id, isLocked)}
                  >
                    {/* Crown / Start indicator for current */}
                    {isCurrent && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="absolute -top-7 animate-bounce bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md border-2 border-white dark:border-slate-900 z-20 flex items-center gap-1"
                      >
                        <span>START</span>
                      </motion.div>
                    )}

                    {/* 3D Button wrapper */}
                    <div className="relative">
                      {/* Button Bottom Shadow Layer */}
                      <div className={`absolute inset-0 ${nodeShadow} rounded-full translate-y-[6px]`}></div>
                      
                      {/* Button Top Layer */}
                      <div className={`relative flex items-center justify-center w-[74px] h-[74px] ${nodeBg} rounded-full border-4 ${isCurrent ? 'border-blue-300 ring-4 ring-blue-500/20 animate-pulse' : 'border-white dark:border-slate-900'} shadow-sm transition-all`}>
                        <div>
                          {icon}
                        </div>
                      </div>
                    </div>
                    
                    {/* Node Label */}
                    <div className="mt-5 mb-8 text-center px-3 max-w-[160px]">
                      <span className={`text-xs font-bold ${isLocked ? 'text-slate-400' : 'text-slate-800 dark:text-slate-200'} tracking-tight leading-tight block truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                        {unit.title.split(': ')[1] || unit.title}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {unit.words.length} words
                      </span>
                    </div>

                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </motion.div>
  );
};
