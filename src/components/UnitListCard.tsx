import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UNITS_DATA } from '../data/portugueseData';
import { Unit, UserProgress, VocabWord } from '../types';
import { playTone, playErrorSound, speakPt } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { WordDetailPreviewModal } from './WordDetailPreviewModal';
import {
  MessageSquare,
  Coffee,
  MapPin,
  Home,
  ShoppingBag,
  Heart,
  User,
  Sparkles,
  Eye,
  Volume2,
  ChevronDown,
  ChevronUp,
  BookOpen
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
  const [expandedChapterNum, setExpandedChapterNum] = useState<number | null>(null);
  const [previewWord, setPreviewWord] = useState<VocabWord | null>(null);
  const [previewChapterTitle, setPreviewChapterTitle] = useState<string>('');
  const [playingWordPt, setPlayingWordPt] = useState<string | null>(null);

  const units = Object.values(UNITS_DATA).filter(u => u.id.startsWith('unit'));
  const currentXP = progress?.xp || 0;
  const currentIndex = Math.min(units.length - 1, Math.floor(currentXP / 100));

  const getOffset = (index: number) => {
    const pattern = [0, -32, -48, -32, 0, 32, 48, 32];
    return pattern[index % pattern.length];
  };

  // Group units by Chapter
  const groupedUnits: { chapter: { num: number; title: string; desc: string }; units: { unit: Unit; globalIdx: number }[] }[] = [];
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

  const toggleChapterWordPreview = (chapterNum: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playTone(520, 'sine', 0.03);
    triggerHaptic('light');
    setExpandedChapterNum(prev => (prev === chapterNum ? null : chapterNum));
  };

  const handleOpenWordPreview = (word: VocabWord, chapterTitle: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playTone(580, 'sine', 0.04);
    triggerHaptic('medium');
    setPreviewChapterTitle(chapterTitle);
    setPreviewWord(word);
  };

  const handleQuickPlayWord = (wordPt: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlayingWordPt(wordPt);
    playTone(550, 'sine', 0.03);
    speakPt(wordPt);
    setTimeout(() => {
      setPlayingWordPt(cur => (cur === wordPt ? null : cur));
    }, 1800);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-4 max-w-lg mx-auto pb-28 relative font-['Courier_New',Courier,monospace]"
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

      {groupedUnits.map((group, groupIdx) => {
        const isChapterExpanded = expandedChapterNum === group.chapter.num;
        // Collect all words across units in this chapter
        const chapterWords = group.units.flatMap(u => u.unit.words);

        return (
          <div key={groupIdx} className="mb-14 relative">
            
            {/* Chapter Header Banner */}
            <motion.div 
              variants={chapterVariants}
              className="w-full px-4 sm:px-5 mb-8"
            >
              <div className="relative overflow-hidden ios-card ios-glass p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 shadow-sm">
                
                {/* Decorative Geometry */}
                <div className="absolute right-0 top-0 bottom-0 w-32 opacity-5 pointer-events-none">
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-blue-600">
                    <path d="M50 0 L100 50 L50 100 L0 50 Z" />
                    <circle cx="50" cy="50" r="25" />
                    <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </div>

                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/50 rounded-2xl border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center font-black text-lg text-blue-600 dark:text-blue-400 shrink-0 shadow-xs">
                      {group.chapter.num}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
                        {group.chapter.title}
                      </h2>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                        {group.chapter.desc}
                      </p>
                    </div>
                  </div>

                  {/* Chapter Eye Preview Action Button */}
                  <button
                    onClick={(e) => toggleChapterWordPreview(group.chapter.num, e)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 active:scale-95 border ${
                      isChapterExpanded
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                        : 'bg-blue-50 dark:bg-white/[0.06] text-blue-600 dark:text-blue-400 hover:bg-blue-100 border-blue-200/60 dark:border-white/10'
                    }`}
                    title="Preview Chapter Words & Love Examples"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Preview</span>
                    <span>({chapterWords.length})</span>
                    {isChapterExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expandable Chapter Words Preview Grid */}
                <AnimatePresence>
                  {isChapterExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-400 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                            <span>Chapter Words • Tap 👁️ for Love Examples</span>
                          </span>
                          <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400">
                            ❤️ Sujan & Amisha
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                          {chapterWords.map((word, wIdx) => {
                            const isPlaying = playingWordPt === word.pt;

                            return (
                              <div
                                key={wIdx}
                                onClick={(e) => handleOpenWordPreview(word, group.chapter.title, e)}
                                className="p-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {word.pt}
                                    </span>
                                    {word.phonetic && (
                                      <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-normal truncate max-w-[90px]">
                                        /{word.phonetic}/
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                    <span>{word.en}</span>
                                    {word.nepali && (
                                      <span className="text-rose-400">• {word.nepali}</span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {/* Audio Button */}
                                  <button
                                    onClick={(e) => handleQuickPlayWord(word.pt, e)}
                                    className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                    title="Listen pt-PT"
                                  >
                                    <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-blue-500' : ''}`} />
                                  </button>

                                  {/* Preview Eye SVG Icon */}
                                  <button
                                    onClick={(e) => handleOpenWordPreview(word, group.chapter.title, e)}
                                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-xs border border-blue-200/50 dark:border-blue-800/50"
                                    title="Preview Love Examples & Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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

                    {/* The Interactive Learning Node with Framer Motion */}
                    <motion.div 
                      className={`relative z-10 flex flex-col items-center group ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                      style={{ transform: `translateX(${offsetX}%)` }}
                      whileHover={!isLocked ? { scale: 1.05, y: -2 } : {}}
                      whileTap={!isLocked ? { scale: 0.94 } : {}}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      onClick={() => handleUnitClick(unit.id, isLocked)}
                    >
                      {/* Start indicator for current */}
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
                        <div className={`absolute inset-0 ${nodeShadow} rounded-full translate-y-[6px]`}></div>
                        
                        <div className={`relative flex items-center justify-center w-[74px] h-[74px] ${nodeBg} rounded-full border-4 ${isCurrent ? 'border-blue-300 ring-4 ring-blue-500/20 animate-pulse' : 'border-white dark:border-slate-900'} shadow-sm transition-all`}>
                          <div>
                            {icon}
                          </div>
                        </div>
                      </div>
                      
                      {/* Node Label with Quick Eye Preview Trigger */}
                      <div className="mt-5 mb-8 text-center px-3 max-w-[170px] flex flex-col items-center">
                        <span className={`text-xs font-bold ${isLocked ? 'text-slate-400' : 'text-slate-800 dark:text-slate-200'} tracking-tight leading-tight block truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                          {unit.title.split(': ')[1] || unit.title}
                        </span>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            {unit.words.length} words
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (unit.words.length > 0) {
                                handleOpenWordPreview(unit.words[0], unit.title, e);
                              }
                            }}
                            className="p-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] flex items-center gap-0.5 cursor-pointer transition-colors"
                            title="Preview first word examples"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Global Word Detail Preview Modal */}
      {previewWord && (
        <WordDetailPreviewModal
          word={previewWord}
          chapterTitle={previewChapterTitle}
          onClose={() => setPreviewWord(null)}
        />
      )}
    </motion.div>
  );
};
