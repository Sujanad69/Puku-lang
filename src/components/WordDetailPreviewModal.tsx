import React, { useState } from 'react';
import { VocabWord } from '../types';
import { getWordDetailedInfo, WordExample } from '../utils/wordExamples';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  X, 
  Volume2, 
  Sparkles, 
  Heart, 
  MapPin, 
  Info, 
  Eye, 
  Layers,
  CheckCircle2,
  Mic,
  Copy,
  Share2
} from 'lucide-react';
import { FlagPortugal, FlagNepal } from './icons/PremiumIcons';
import { AudioWaveVisualizer } from './AudioWaveVisualizer';

interface WordDetailPreviewModalProps {
  word: VocabWord | null;
  chapterTitle?: string;
  onClose: () => void;
}

export const WordDetailPreviewModal: React.FC<WordDetailPreviewModalProps> = ({
  word,
  chapterTitle,
  onClose,
}) => {
  if (!word) return null;

  const [activePlayingSentence, setActivePlayingSentence] = useState<string | null>(null);
  const [isPlayingMainWord, setIsPlayingMainWord] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const info = getWordDetailedInfo(word);

  const handlePlayWord = (slow: boolean = false) => {
    playTone(550, 'sine', 0.04);
    triggerHaptic('light');
    setIsPlayingMainWord(true);
    speakPt(word.pt, slow);
    setTimeout(() => setIsPlayingMainWord(false), 2000);
  };

  const handlePlaySentence = (sentencePt: string) => {
    playTone(580, 'sine', 0.04);
    triggerHaptic('medium');
    setActivePlayingSentence(sentencePt);
    speakPt(sentencePt);
    setTimeout(() => setActivePlayingSentence(null), 3500);
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(`${word.pt} - ${word.en} (${word.nepali || ''})`);
      setCopied(true);
      playTone(600, 'sine', 0.04);
      triggerHaptic('success');
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl ios-fade-in font-['Courier_New',Courier,monospace]">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col max-h-[90vh] ios-modal-scale-in">
        
        {/* Header Bar */}
        <div className="relative p-5 pb-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Word Preview & Examples
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black border border-rose-500/20">
                  pt-PT
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium truncate max-w-[240px]">
                {chapterTitle || 'European Portuguese Vocabulary'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
              title="Copy Word"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                playTone(450, 'sine', 0.03);
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Main Word Hero Card */}
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 shadow-xl shadow-blue-500/15">
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                  {info.partOfSpeech}
                </span>
                <span className="text-xl">🇵🇹</span>
              </div>

              {/* Portuguese Word Title */}
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5 drop-shadow-sm">
                {word.pt}
              </h2>

              {/* Phonetic Pronunciation Guide */}
              {word.phonetic && (
                <p className="text-xs text-blue-100/90 font-medium mb-3">
                  🗣️ Pronunciation: <span className="font-bold underline decoration-blue-300">{word.phonetic}</span>
                </p>
              )}

              {/* English & Nepali Translations */}
              <div className="mt-4 pt-3 border-t border-white/20 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <span>🇬🇧</span>
                  <span>{word.en}</span>
                </div>
                {word.nepali && (
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-200">
                    <span>🇳🇵</span>
                    <span>{word.nepali}</span>
                    {word.nepaliPhonetic && (
                      <span className="text-[10px] text-white/70 font-normal">({word.nepaliPhonetic})</span>
                    )}
                  </div>
                )}
              </div>

              {/* Audio Playback Controls */}
              <div className="mt-5 flex items-center gap-2.5">
                <button
                  onClick={() => handlePlayWord(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 shadow-md ${
                    isPlayingMainWord 
                      ? 'bg-white text-blue-700 ring-2 ring-white/50' 
                      : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingMainWord ? 'animate-bounce' : ''}`} />
                  <span>Listen pt-PT</span>
                  {isPlayingMainWord && <AudioWaveVisualizer isPlaying size="xs" color="blue" barsCount={3} />}
                </button>

                <button
                  onClick={() => handlePlayWord(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 text-xs font-black transition-all cursor-pointer active:scale-95 border border-white/15"
                  title="Slow Pronunciation"
                >
                  0.6x Slow
                </button>
              </div>

            </div>
          </div>

          {/* Sujan & Amisha Love Story Example Card */}
          {info.examples.map((example, idx) => {
            const isLove = example.type === 'love';
            const isPlayingThis = activePlayingSentence === example.pt;

            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all ${
                  isLove
                    ? 'bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent border-rose-500/30 dark:border-rose-500/20'
                    : 'bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border-blue-500/30 dark:border-blue-500/20'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wide text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{example.title}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handlePlaySentence(example.pt)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                      isPlayingThis
                        ? isLove 
                          ? 'bg-rose-500 text-white scale-105' 
                          : 'bg-blue-600 text-white scale-105'
                        : isLove
                          ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-blue-500/15 hover:bg-blue-500/25 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingThis ? 'animate-bounce' : ''}`} />
                    <span>{isPlayingThis ? 'Speaking...' : 'Play Example'}</span>
                  </button>
                </div>

                {/* Portuguese Sentence */}
                <p className={`text-sm font-black leading-relaxed ${
                  isLove ? 'text-rose-700 dark:text-rose-300' : 'text-slate-900 dark:text-zinc-200'
                }`}>
                  "{example.pt}"
                </p>

                {/* English Meaning */}
                <p className="text-xs text-slate-600 dark:text-zinc-400 font-medium mt-2 leading-relaxed">
                  🇬🇧 {example.en}
                </p>

                {/* Nepali Meaning */}
                {example.nepali && (
                  <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1.5 pt-1.5 border-t border-black/[0.05] dark:border-white/[0.06] leading-relaxed">
                    🇳🇵 {example.nepali}
                  </p>
                )}
              </div>
            );
          })}

          {/* Lisbon Local Tip & Grammar Note */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-zinc-200">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">💡</span>
              <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Lisbon Local Tip & Pronunciation
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium leading-relaxed">
              {info.lisbonTip}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-black/[0.06] dark:border-white/[0.08] bg-slate-50 dark:bg-[#1c1c1e] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Dedicated for Amisha with love from Sujan</span>
          </span>

          <button
            onClick={() => {
              playTone(450, 'sine', 0.03);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:opacity-90 transition-opacity cursor-pointer active:scale-95"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
