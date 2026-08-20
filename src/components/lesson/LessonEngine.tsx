import React, { useState, useEffect, useMemo } from 'react';
import { Unit, VocabWord } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { speakPt, playTone, playSuccessSound } from '../../utils/audio';
import { AudioWaveVisualizer } from '../AudioWaveVisualizer';
import { SpeakingStage } from './SpeakingStage';
import { WordDetailPreviewModal } from '../WordDetailPreviewModal';
import { Volume2, Sparkles, Eye } from 'lucide-react';

interface LessonEngineProps {
  unit: Unit;
  lessonIndex: number;
  gameMode?: 'guided' | 'match' | 'speaking' | 'builder';
  onClose: () => void;
  onComplete: () => void;
}

type LessonStage = 'discover' | 'immersion' | 'speaking' | 'match' | 'builder' | 'chat';

export const LessonEngine: React.FC<LessonEngineProps> = ({ unit, lessonIndex, gameMode = 'guided', onClose, onComplete }) => {
  const [currentStage, setCurrentStage] = useState<LessonStage>(gameMode === 'guided' ? 'discover' : (gameMode as LessonStage));
  const [progressPercent, setProgressPercent] = useState(0);

  const isLoveUnit = unit.id === 'unit7';

  // Grab words for this specific lesson
  const WORDS_PER_LESSON = unit.words.length;
  const shuffledWords = useMemo(() => [...unit.words].sort(() => Math.random() - 0.5), [unit.words]);
  const lessonWords = useMemo(() => {
    if (gameMode !== 'guided') {
      return [...unit.words].sort(() => Math.random() - 0.5).slice(0, 10);
    }
    const start = lessonIndex * WORDS_PER_LESSON;
    return unit.words.slice(start, start + WORDS_PER_LESSON);
  }, [unit, lessonIndex, gameMode]);

  const handleStageComplete = (nextStage: LessonStage | 'finish') => {
    playSuccessSound();
    if (gameMode !== 'guided') {
      onComplete();
      return;
    }
    if (nextStage === 'finish') {
      onComplete();
    } else {
      setCurrentStage(nextStage);
      if (nextStage === 'immersion') setProgressPercent(20);
      if (nextStage === 'speaking') setProgressPercent(40);
      if (nextStage === 'match') setProgressPercent(60);
      if (nextStage === 'builder') setProgressPercent(80);
      if (nextStage === 'chat') setProgressPercent(90);
    }
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col overflow-hidden ios-modal-scale-in ${
      isLoveUnit 
        ? 'bg-[#fff1f2] dark:bg-[#12060b]' 
        : 'bg-[#F9FAFB] dark:bg-[#09090b]'
    }`}>
      
      {/* Top Bar */}
      <div className={`flex items-center justify-between px-5 py-4 pt-safe z-20 backdrop-blur-xl border-b ${
        isLoveUnit
          ? 'bg-rose-500/10 border-rose-200/40 dark:border-rose-900/30'
          : 'bg-white/70 dark:bg-black/70 border-black/5 dark:border-white/5'
      }`}>
        <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:scale-105 active:scale-95 transition-transform cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="flex-1 mx-6">
          <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10 shadow-inner">
            <motion.div
              className={`h-full rounded-full shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] ${
                isLoveUnit
                  ? 'bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#fb7185]'
                  : 'bg-gradient-to-r from-[#58cc02] to-[#46a302]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
            />
          </div>
        </div>

        <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm rounded-full ${
          isLoveUnit
            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300'
            : 'text-slate-400 bg-slate-100 dark:bg-white/10'
        }`}>
          {isLoveUnit ? '❤️' : lessonIndex + 1}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {currentStage === 'discover' && (
            <DiscoverStage key="discover" words={lessonWords} isLoveUnit={isLoveUnit} onComplete={() => handleStageComplete('immersion')} />
          )}
          {currentStage === 'immersion' && (
            <ImmersionStage key="immersion" words={shuffledWords.slice(0, 4)} isLoveUnit={isLoveUnit} onComplete={() => handleStageComplete('speaking')} />
          )}
          {currentStage === 'speaking' && (
            <SpeakingStage key="speaking" words={gameMode === 'speaking' ? lessonWords : shuffledWords.slice(0, 3)} isLoveUnit={isLoveUnit} onComplete={() => handleStageComplete(gameMode === 'speaking' ? 'finish' : 'match')} />
          )}
          {currentStage === 'match' && (
            <MatchStage key="match" words={shuffledWords.slice(0, 5)} isLoveUnit={isLoveUnit} onComplete={() => handleStageComplete('builder')} />
          )}
          {currentStage === 'builder' && (
            <BuilderStage key="builder" words={shuffledWords.slice(0, 2)} isLoveUnit={isLoveUnit} onComplete={() => handleStageComplete('chat')} />
          )}
          {currentStage === 'chat' && (
            <ChatStage key="chat" words={shuffledWords.slice(0, 1)} isLoveUnit={isLoveUnit} onComplete={() => handleStageComplete('finish')} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- STAGE 1: DISCOVER ---
const DiscoverStage: React.FC<{ words: VocabWord[], isLoveUnit?: boolean, onComplete: () => void }> = ({ words, isLoveUnit, onComplete }) => {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [previewWord, setPreviewWord] = useState<VocabWord | null>(null);

  const handlePlayWord = (word: VocabWord, idx: number) => {
    setPlayingIdx(idx);
    playTone(580, 'sine', 0.08);
    speakPt(word.pt);
    setTimeout(() => {
      setPlayingIdx(current => (current === idx ? null : current));
    }, 1800);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="flex-1 flex flex-col h-full bg-white dark:bg-[#09090b]">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 pb-32">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              {isLoveUnit ? 'Love Phrases for Sujan ❤️' : 'New Vocabulary'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {isLoveUnit ? 'Listen to these sweet European Portuguese love phrases.' : 'Listen and tap to hear authentic Lisbon pronunciation.'}
            </p>
          </div>
          <div className="space-y-3.5">
            {words.map((word, idx) => {
              const isPlaying = playingIdx === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative overflow-hidden flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer ${
                    isPlaying
                      ? isLoveUnit
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 ring-2 ring-rose-400/30'
                        : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-400 ring-2 ring-blue-400/30'
                      : isLoveUnit
                        ? 'bg-rose-50/50 dark:bg-[#1a0c14] border-rose-100 dark:border-rose-900/40 hover:border-rose-300'
                        : 'bg-white dark:bg-[#18181b] border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-900/40'
                  }`}
                  onClick={() => handlePlayWord(word, idx)}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white truncate">
                        {word.pt}
                      </h3>
                      {isPlaying && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse ${
                          isLoveUnit ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          Speaking
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 truncate">
                        {word.en}
                      </span>

                      {/* Dynamic Pronunciation Guide Capsule with Audio Wave Visualizer */}
                      {word.phonetic && (
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-mono font-bold transition-colors ${
                          isPlaying
                            ? isLoveUnit
                              ? 'bg-rose-500/15 border-rose-400 text-rose-600 dark:text-rose-300'
                              : 'bg-blue-500/15 border-blue-400 text-blue-600 dark:text-blue-300'
                            : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'
                        }`}>
                          <span>/{word.phonetic}/</span>
                          <AudioWaveVisualizer
                            isPlaying={isPlaying}
                            size="xs"
                            barsCount={5}
                            color={isLoveUnit ? 'rose' : 'blue'}
                          />
                        </div>
                      )}

                      {word.nepali && (
                        <span className="text-xs text-rose-500 font-bold truncate bg-rose-500/10 px-2 py-0.5 rounded-md">
                          🇳🇵 {word.nepali}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Preview Eye Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTone(580, 'sine', 0.04);
                        setPreviewWord(word);
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all border border-blue-200/50 dark:border-blue-800/50 cursor-pointer"
                      title="Preview Love Examples"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Audio Button with Visualizer Waves */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayWord(word, idx);
                      }}
                      className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm ${
                        isPlaying
                          ? isLoveUnit
                            ? 'bg-rose-500 text-white shadow-rose-500/30 scale-105'
                            : 'bg-blue-600 text-white shadow-blue-500/30 scale-105'
                          : isLoveUnit
                            ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                            : 'bg-[#1CB0F6]/10 text-[#1CB0F6] hover:bg-[#1CB0F6]/20'
                      }`}
                      title="Play Pronunciation"
                    >
                      {isPlaying ? (
                        <AudioWaveVisualizer
                          isPlaying={true}
                          size="sm"
                          barsCount={5}
                          color="white"
                        />
                      ) : (
                        <Volume2 className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white dark:from-[#09090b] pb-safe-offset-5">
        <div className="max-w-xl mx-auto">
          <button onClick={onComplete} className={`w-full h-14 sm:h-16 rounded-2xl font-black text-lg sm:text-xl text-white active:translate-y-1.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isLoveUnit
              ? 'bg-gradient-to-r from-[#e11d48] to-[#f43f5e] shadow-[0_6px_0_#be123c] hover:brightness-110'
              : 'bg-[#58cc02] shadow-[0_6px_0_#46a302] hover:bg-[#61e002]'
          }`}>
            {isLoveUnit ? 'START ROMANTIC PRACTICE ❤️' : "I'M READY TO PRACTICE"}
          </button>
        </div>
      </div>

      {/* Global Word Detail Preview Modal */}
      {previewWord && (
        <WordDetailPreviewModal
          word={previewWord}
          chapterTitle={isLoveUnit ? "Love Unit" : "Lesson Discovery"}
          onClose={() => setPreviewWord(null)}
        />
      )}
    </motion.div>
  );
};

// --- STAGE 2: IMMERSION (Rosetta Stone Style) ---
const ImmersionStage: React.FC<{ words: VocabWord[], onComplete: () => void }> = ({ words, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<VocabWord[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentWord = words[currentIdx];

  const triggerAudio = (text: string) => {
    setIsPlayingAudio(true);
    speakPt(text);
    setTimeout(() => setIsPlayingAudio(false), 1800);
  };

  useEffect(() => {
    if(!currentWord) return;
    let pool = [...words].filter(w => w.pt !== currentWord.pt).sort(() => Math.random() - 0.5).slice(0, 3);
    pool.push(currentWord);
    setOptions(pool.sort(() => Math.random() - 0.5));
    setTimeout(() => triggerAudio(currentWord.pt), 500);
  }, [currentIdx, currentWord, words]);

  const handleSelect = (selected: VocabWord) => {
    if (selected.pt === currentWord.pt) {
      setIsSuccess(true);
      playSuccessSound();
      triggerAudio(selected.pt);
      setTimeout(() => {
        setIsSuccess(false);
        if (currentIdx < words.length - 1) setCurrentIdx(prev => prev + 1);
        else onComplete();
      }, 1000);
    } else {
      setHasError(true);
      playTone(330, 'square', 0.1);
      setTimeout(() => setHasError(false), 500);
    }
  };

  if(!currentWord) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className="flex-1 flex flex-col h-full bg-[#F9FAFB] dark:bg-[#09090b] p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        <motion.div animate={hasError ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="text-center space-y-6 w-full">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">What do you hear?</h2>

          {/* Enhanced Speaker Button with Dynamic Audio Wave Visualizer */}
          <div className="relative inline-block mx-auto mb-10">
            {isPlayingAudio && (
              <div className="absolute inset-0 rounded-full bg-[#1CB0F6]/20 audio-pulse-ring pointer-events-none" />
            )}
            <button
              onClick={() => triggerAudio(currentWord.pt)}
              className={`relative mx-auto w-24 h-24 rounded-full bg-[#1CB0F6] text-white flex flex-col items-center justify-center shadow-[0_8px_0_#1899D6] active:translate-y-2 active:shadow-none transition-all hover:scale-105 cursor-pointer ${
                isPlayingAudio ? 'ring-4 ring-cyan-300' : ''
              }`}
            >
              <Volume2 className="w-8 h-8 mb-1" />
              <AudioWaveVisualizer
                isPlaying={isPlayingAudio}
                size="xs"
                barsCount={5}
                color="white"
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((opt, idx) => (
              <button key={idx} onClick={() => handleSelect(opt)} disabled={isSuccess} className={`aspect-square rounded-[32px] p-6 flex items-center justify-center text-xl sm:text-2xl font-black transition-all border-2 shadow-sm ${isSuccess && opt.pt === currentWord.pt ? 'bg-[#58cc02]/20 border-[#58cc02] text-[#58cc02] scale-105' : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:border-[#1CB0F6] active:scale-95'}`}>{opt.pt}</button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- STAGE 3: MATCH MAKING (Duolingo Style 2 Columns) ---
const MatchStage: React.FC<{ words: VocabWord[], onComplete: () => void }> = ({ words, onComplete }) => {
  const [leftCol, setLeftCol] = useState<{id: string, text: string, matchId: string, matched: boolean}[]>([]);
  const [rightCol, setRightCol] = useState<{id: string, text: string, matchId: string, matched: boolean}[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [errorCards, setErrorCards] = useState<string[]>([]);

  useEffect(() => {
    // Left column: Portuguese, Right column: English
    const ptCards = words.map(w => ({ id: `pt-${w.pt}`, text: w.pt, matchId: w.pt, matched: false }));
    const enCards = words.map(w => ({ id: `en-${w.pt}`, text: w.en, matchId: w.pt, matched: false }));
    
    setLeftCol(ptCards.sort(() => Math.random() - 0.5));
    setRightCol(enCards.sort(() => Math.random() - 0.5));
  }, [words]);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const leftCard = leftCol.find(c => c.id === selectedLeft);
      const rightCard = rightCol.find(c => c.id === selectedRight);
      
      if (leftCard?.matchId === rightCard?.matchId) {
        // Match!
        playSuccessSound();
        setLeftCol(prev => prev.map(c => c.id === selectedLeft ? { ...c, matched: true } : c));
        setRightCol(prev => prev.map(c => c.id === selectedRight ? { ...c, matched: true } : c));
        setSelectedLeft(null);
        setSelectedRight(null);

        // Check if all matched
        if (leftCol.filter(c => c.id !== selectedLeft).every(c => c.matched)) {
          setTimeout(onComplete, 800);
        }
      } else {
        // Mismatch
        playTone(330, 'square', 0.1);
        setErrorCards([selectedLeft, selectedRight]);
        setTimeout(() => {
          setErrorCards([]);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
      }
    }
  }, [selectedLeft, selectedRight, leftCol, rightCol, onComplete]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className="flex-1 flex flex-col h-full bg-[#F9FAFB] dark:bg-[#09090b] p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 text-center">Tap the matching pairs</h2>
        
        <div className="flex w-full gap-4">
          {/* Left Column (PT) */}
          <div className="flex-1 flex flex-col gap-3">
            {leftCol.map(card => {
              const isSelected = selectedLeft === card.id;
              const isError = errorCards.includes(card.id);
              if (card.matched) return <motion.div key={card.id} initial={{opacity: 1}} animate={{opacity: 0, scale: 0.8}} className="h-16 bg-transparent" />;
              
              return (
                <motion.button key={card.id} animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}} onClick={() => { if(!errorCards.length) { setSelectedLeft(card.id); speakPt(card.text); } }} className={`h-16 px-4 rounded-2xl flex items-center justify-center text-center font-bold text-[15px] border-2 shadow-[0_4px_0_rgba(0,0,0,0.05)] active:translate-y-1 active:shadow-none ${isSelected ? 'bg-[#1CB0F6]/10 border-[#1CB0F6] text-[#1CB0F6]' : isError ? 'bg-red-50 border-red-500 text-red-500' : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200'}`}>
                  {card.text}
                </motion.button>
              );
            })}
          </div>
          {/* Right Column (EN) */}
          <div className="flex-1 flex flex-col gap-3">
            {rightCol.map(card => {
              const isSelected = selectedRight === card.id;
              const isError = errorCards.includes(card.id);
              if (card.matched) return <motion.div key={card.id} initial={{opacity: 1}} animate={{opacity: 0, scale: 0.8}} className="h-16 bg-transparent" />;
              
              return (
                <motion.button key={card.id} animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}} onClick={() => { if(!errorCards.length) { setSelectedRight(card.id); playTone(440, 'sine', 0.05); } }} className={`h-16 px-4 rounded-2xl flex items-center justify-center text-center font-bold text-[15px] border-2 shadow-[0_4px_0_rgba(0,0,0,0.05)] active:translate-y-1 active:shadow-none ${isSelected ? 'bg-[#1CB0F6]/10 border-[#1CB0F6] text-[#1CB0F6]' : isError ? 'bg-red-50 border-red-500 text-red-500' : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200'}`}>
                  {card.text}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- STAGE 4: BUILDER ---
const BuilderStage: React.FC<{ words: VocabWord[], onComplete: () => void }> = ({ words, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<{id: string, text: string}[]>([]);
  const [hasError, setHasError] = useState(false);

  const currentWord = words[currentIdx];
  const targetWords = currentWord?.pt.split(' ') || [];

  useEffect(() => {
    if(!currentWord) return;
    let pool = [...targetWords];
    const distractors = ['o', 'a', 'um', 'uma', 'e', 'não', 'muito'];
    pool.push(...distractors.sort(() => Math.random() - 0.5).slice(0, 3));
    setAvailableBlocks(pool.sort(() => Math.random() - 0.5).map((w, i) => ({ id: `${w}-${i}`, text: w })));
    setSelectedBlocks([]);
  }, [currentIdx, currentWord]);

  if(!currentWord) return null;

  const handleSelectBlock = (blockId: string, text: string) => { setSelectedBlocks(prev => [...prev, text]); setAvailableBlocks(prev => prev.filter(b => b.id !== blockId)); };
  const handleRemoveBlock = (index: number) => { const text = selectedBlocks[index]; setSelectedBlocks(prev => prev.filter((_, i) => i !== index)); setAvailableBlocks(prev => [...prev, { id: `${text}-${Date.now()}`, text }]); };
  const checkAnswer = () => {
    if (selectedBlocks.join(' ') === currentWord.pt) {
      playSuccessSound();
      if (currentIdx < words.length - 1) setCurrentIdx(prev => prev + 1);
      else onComplete();
    } else {
      setHasError(true);
      playTone(330, 'square', 0.1);
      setTimeout(() => setHasError(false), 500);
      setSelectedBlocks([]);
      let pool = [...targetWords];
      pool.push(...['o', 'a', 'um', 'uma', 'e', 'não', 'muito'].sort(() => Math.random() - 0.5).slice(0, 3));
      setAvailableBlocks(pool.sort(() => Math.random() - 0.5).map((w, i) => ({ id: `${w}-${i}`, text: w })));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="flex-1 flex flex-col h-full bg-[#F9FAFB] dark:bg-[#09090b] p-6 pb-safe-offset-5">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 text-center mt-4">Translate this sentence</h2>
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400 text-center mb-8">{currentWord.en}</p>
        <motion.div animate={hasError ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="flex-1 flex flex-col justify-center">
          <div className="min-h-[120px] p-4 rounded-3xl bg-white dark:bg-[#18181b] border-2 border-dashed border-slate-300 flex flex-wrap gap-2 items-start shadow-inner mb-12">
            {selectedBlocks.map((text, idx) => (
              <motion.button layoutId={`block-${text}-${idx}`} key={idx} onClick={() => handleRemoveBlock(idx)} className="px-4 py-2 bg-white border-2 border-slate-200 rounded-2xl font-bold text-lg text-slate-700 shadow-[0_4px_0_#e2e8f0] active:translate-y-1 active:shadow-none">{text}</motion.button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <AnimatePresence>
              {availableBlocks.map(block => (
                <motion.button layoutId={`block-avail-${block.id}`} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key={block.id} onClick={() => handleSelectBlock(block.id, block.text)} className="px-4 py-2 bg-white border-2 border-slate-200 rounded-2xl font-bold text-lg text-slate-700 shadow-[0_4px_0_#e2e8f0] hover:border-[#1CB0F6] active:translate-y-1 active:shadow-none">{block.text}</motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
        <button onClick={checkAnswer} disabled={selectedBlocks.length === 0} className={`w-full h-14 sm:h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${selectedBlocks.length > 0 ? 'text-white bg-[#58cc02] shadow-[0_6px_0_#46a302] hover:bg-[#61e002] active:translate-y-1.5 active:shadow-none' : 'text-slate-400 bg-slate-200 cursor-not-allowed'}`}>CHECK</button>
      </div>
    </motion.div>
  );
};

// --- STAGE 5: CHAT ---
const ChatStage: React.FC<{ words: VocabWord[], onComplete: () => void }> = ({ words, onComplete }) => {
  const targetWord = words[0];
  const [messages, setMessages] = useState<{sender: 'sujan'|'user', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if(targetWord) {
      setMessages([{ sender: 'sujan', text: `Olá amor! How do you say "${targetWord.en}" in Portuguese?` }]);
    }
  }, [targetWord]);

  if(!targetWord) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    if (input.toLowerCase().includes(targetWord.pt.toLowerCase())) {
      playSuccessSound();
      setMessages(prev => [...prev, { sender: 'sujan', text: 'Perfeito! You are doing amazing ❤️' }]);
      setTimeout(onComplete, 2000);
    } else {
      setHasError(true);
      playTone(330, 'square', 0.1);
      setTimeout(() => setHasError(false), 500);
      setMessages(prev => [...prev, { sender: 'sujan', text: `Oops, not quite! Try to use "${targetWord.pt}"` }]);
    }
    setInput('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="flex-1 flex flex-col h-full bg-white dark:bg-[#09090b]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-3xl px-5 py-3 ${m.sender === 'user' ? 'bg-[#1CB0F6] text-white rounded-br-sm' : 'bg-slate-100 dark:bg-[#27272a] text-slate-800 dark:text-white rounded-bl-sm'}`}>
              <p className="font-medium text-[15px] leading-relaxed">{m.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div animate={hasError ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="p-4 bg-white dark:bg-[#09090b] border-t border-slate-100 dark:border-white/5 pb-safe-offset-4">
        <div className="flex gap-2 max-w-lg mx-auto">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 bg-slate-100 dark:bg-[#27272a] border-0 rounded-full px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1CB0F6] transition-all text-[15px] dark:text-white" autoFocus />
          <button onClick={handleSend} disabled={!input.trim()} className="w-12 h-12 rounded-full bg-[#1CB0F6] text-white flex items-center justify-center disabled:opacity-50 disabled:bg-slate-200"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
        </div>
      </motion.div>
    </motion.div>
  );
};
