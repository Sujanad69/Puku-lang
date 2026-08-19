import React, { useState } from 'react';
import { Unit, VocabWord } from '../types';
import { speakPt, playTone, playSuccessSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  Heart, 
  Volume2, 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  Play, 
  BookOpen, 
  Send,
  Flame,
  MessageCircleHeart
} from 'lucide-react';
import { FlagNepal } from './icons/PremiumIcons';

interface LovePhrasesModalProps {
  unit: Unit;
  onClose: () => void;
  onStartPractice: (words: VocabWord[]) => void;
  onStartQuiz: (words: VocabWord[]) => void;
}

const SUJAN_LOVE_LETTERS = [
  {
    title: "Para a Minha Princesa Amisha",
    textPt: "Amisha, és a pessoa mais especial do meu mundo. Cada palavra em português que aprendes aproxima-nos ainda mais. Mal posso esperar para passear contigo pelas ruas de Lisboa, comer pastéis de nata e dizer-te ao ouvido: amo-te com todo o meu coração!",
    textEn: "Amisha, you are the most special person in my world. Every Portuguese word you learn brings us even closer. I can't wait to walk with you through the streets of Lisbon, eat pastéis de nata, and whisper to you: I love you with all my heart!",
    textNp: "अमिशा, तिमी मेरो संसारको सबैभन्दा विशेष मान्छे हौ। तिमीले सिक्ने प्रत्येक पोर्चुगिज शब्दले हामीलाई अझ नजिक ल्याउँछ। लिस्बनको सडकमा तिमीसँग हात समातेर हिँड्न म आतुर छु। म तिमीलाई हृदयदेखि नै धेरै माया गर्छु!",
    date: "From Sujan with Eternal Love"
  }
];

export const LovePhrasesModal: React.FC<LovePhrasesModalProps> = ({
  unit,
  onClose,
  onStartPractice,
  onStartQuiz
}) => {
  const [activeTab, setActiveTab] = useState<'phrases' | 'letter' | 'practice'>('phrases');
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [isPlayingLetter, setIsPlayingLetter] = useState(false);

  const handleSpeakWord = (word: VocabWord) => {
    playTone(600, 'sine', 0.05);
    triggerHaptic('light');
    setPlayingWord(word.pt);
    speakPt(word.pt);
    setTimeout(() => setPlayingWord(null), 2200);
  };

  const handleCopy = (text: string, pt: string) => {
    navigator.clipboard.writeText(text);
    triggerHaptic('success');
    setCopiedWord(pt);
    setTimeout(() => setCopiedWord(null), 2000);
  };

  const handlePlayLetter = () => {
    playTone(520, 'sine', 0.06);
    triggerHaptic('medium');
    setIsPlayingLetter(true);
    speakPt(SUJAN_LOVE_LETTERS[0].textPt);
    setTimeout(() => setIsPlayingLetter(false), 8000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] bg-white dark:bg-[#150a10] border border-rose-200/60 dark:border-rose-900/50 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* ================= ROMANTIC HEADER BANNER ================= */}
        <div className="relative bg-gradient-to-br from-[#e11d48] via-[#f43f5e] to-[#fb7185] p-6 text-white text-center overflow-hidden shrink-0">
          
          {/* Animated Glowing Floating Hearts */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <svg 
              className="ldr-heart-anim absolute left-[8%] -bottom-4 h-8 w-8 fill-white/25 text-transparent" 
              style={{ animationDelay: '0s', animationDuration: '3.5s' }}
              viewBox="0 0 24 24"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>

            <svg 
              className="ldr-heart-anim absolute right-[12%] -bottom-4 h-9 w-9 fill-white/20 text-transparent" 
              style={{ animationDelay: '1.5s', animationDuration: '4s' }}
              viewBox="0 0 24 24"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </div>

          {/* Top Actions Bar (No overlap on mobile) */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
            <div className="flex-1" />

            {/* Romantic Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-xs max-w-[200px] sm:max-w-none truncate">
              <Heart className="w-3.5 h-3.5 fill-current text-white animate-pulse shrink-0" />
              <span className="truncate">Love Unit • Sujan ❤️ Amisha</span>
            </div>

            {/* Close Button */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-md shrink-0"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Palavras de Amor ❤️
          </h2>
          
          <p className="text-xs sm:text-sm text-rose-100 font-medium mt-1 max-w-md mx-auto leading-relaxed">
            Sweet romantic European Portuguese phrases, love letters, and Nepali expressions from Sujan to Amisha.
          </p>

          {/* Navigation Pill Tabs */}
          <div className="flex items-center justify-center gap-1.5 mt-4 p-1 rounded-2xl bg-black/20 backdrop-blur-md max-w-sm mx-auto">
            <button
              onClick={() => {
                playTone(600, 'sine', 0.03);
                setActiveTab('phrases');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'phrases'
                  ? 'bg-white text-rose-600 shadow-md scale-[1.02]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <MessageCircleHeart className="w-3.5 h-3.5" />
              <span>Phrases</span>
            </button>

            <button
              onClick={() => {
                playTone(600, 'sine', 0.03);
                setActiveTab('letter');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'letter'
                  ? 'bg-white text-rose-600 shadow-md scale-[1.02]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Love Letter</span>
            </button>

            <button
              onClick={() => {
                playTone(600, 'sine', 0.03);
                setActiveTab('practice');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'practice'
                  ? 'bg-white text-rose-600 shadow-md scale-[1.02]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice</span>
            </button>
          </div>

        </div>

        {/* ================= TAB 1: ALL LOVE PHRASES ================= */}
        {activeTab === 'phrases' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{unit.words.length} Romantic Phrases</span>
              </span>

              <button
                onClick={() => onStartQuiz(unit.words)}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Take Love Quiz</span>
                <span>→</span>
              </button>
            </div>

            {unit.words.map((word, idx) => {
              const isPlaying = playingWord === word.pt;
              const isCopied = copiedWord === word.pt;

              return (
                <div
                  key={idx}
                  onClick={() => handleSpeakWord(word)}
                  className={`group relative rounded-2xl p-4 transition-all duration-200 border cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 dark:border-rose-500 shadow-md scale-[1.01]'
                      : 'bg-slate-50 dark:bg-[#1e1018] border-rose-100 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    
                    {/* Left details */}
                    <div className="space-y-1 flex-1 min-w-0">
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                          {word.pt}
                        </h4>

                        {word.phonetic && (
                          <span className="text-[11px] font-mono font-medium text-rose-600 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded-md">
                            /{word.phonetic}/
                          </span>
                        )}
                      </div>

                      {/* English Meaning */}
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        "{word.en}"
                      </p>

                      {/* Nepali Bridge Hint */}
                      {word.nepali && (
                        <p className="text-[11px] font-medium text-rose-600/90 dark:text-rose-400/90 flex items-center gap-1">
                          <span>🇳🇵</span>
                          <span>{word.nepali}</span>
                          {word.nepaliPhonetic && (
                            <span className="opacity-75">({word.nepaliPhonetic})</span>
                          )}
                        </p>
                      )}

                      {/* Romantic Context Note */}
                      {word.note && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic pt-0.5">
                          💡 {word.note}
                        </p>
                      )}
                    </div>

                    {/* Right Action Icons */}
                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      
                      {/* Copy Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(`${word.pt} - ${word.en}`, word.pt);
                        }}
                        className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Copy Phrase"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Audio Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeakWord(word);
                        }}
                        className={`h-9 w-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                          isPlaying
                            ? 'bg-rose-500 text-white ring-4 ring-rose-300 dark:ring-rose-800'
                            : 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:bg-rose-500 hover:text-white'
                        }`}
                        title="Listen in Lisbon Portuguese"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* ================= TAB 2: SUJAN'S LOVE LETTER ================= */}
        {activeTab === 'letter' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            <div className="relative rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 dark:from-[#220e17] dark:via-[#1c0a13] dark:to-[#170a0e] p-6 sm:p-8 border border-rose-200 dark:border-rose-900/40 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between border-b border-rose-200/60 dark:border-rose-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💌</span>
                  <div>
                    <h3 className="text-base font-black text-rose-900 dark:text-rose-100">
                      {SUJAN_LOVE_LETTERS[0].title}
                    </h3>
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                      {SUJAN_LOVE_LETTERS[0].date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePlayLetter}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isPlayingLetter
                      ? 'bg-rose-500 text-white ring-4 ring-rose-300'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingLetter ? 'Playing...' : 'Listen Letter'}</span>
                </button>
              </div>

              {/* Portuguese Text */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                  🇵🇹 European Portuguese
                </span>
                <p className="text-sm sm:text-base font-serif italic text-slate-800 dark:text-rose-100 leading-relaxed bg-white/60 dark:bg-black/30 p-4 rounded-2xl border border-rose-100 dark:border-rose-950/40">
                  "{SUJAN_LOVE_LETTERS[0].textPt}"
                </p>
              </div>

              {/* English Translation */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  🇬🇧 English Meaning
                </span>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed pl-2">
                  "{SUJAN_LOVE_LETTERS[0].textEn}"
                </p>
              </div>

              {/* Nepali Bridge */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 dark:text-rose-400 flex items-center gap-1">
                  <FlagNepal size={12} /> नेपाली अनुवाद
                </span>
                <p className="text-xs font-medium text-slate-700 dark:text-rose-200/90 leading-relaxed pl-2">
                  "{SUJAN_LOVE_LETTERS[0].textNp}"
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 3: PRACTICE & QUIZ ================= */}
        {activeTab === 'practice' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-center">
            
            <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-[#200e18] dark:to-[#170a11] p-6 border border-rose-200 dark:border-rose-900/50 space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-8 h-8 text-rose-500 fill-current animate-pulse" />
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Learn with Love
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Practice saying these sweet words out loud! Earn extra XP, hearts, and unlock special Puku reactions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={() => onStartPractice(unit.words)}
                className="p-4 rounded-2xl bg-white dark:bg-[#1e1018] border-2 border-rose-200 dark:border-rose-900/50 hover:border-rose-500 text-slate-900 dark:text-white font-bold text-xs flex flex-col items-center gap-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
              >
                <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span>Guided Lesson Mode</span>
                <span className="text-[10px] text-slate-400 font-normal">Step-by-step discovery</span>
              </button>

              <button
                onClick={() => onStartQuiz(unit.words)}
                className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs flex flex-col items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                <div className="h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span>Love Quiz Challenge</span>
                <span className="text-[10px] text-rose-100 font-normal">Translate & Speak (+XP)</span>
              </button>
            </div>

          </div>
        )}

        {/* ================= MODAL FOOTER ================= */}
        <div className="p-4 sm:p-5 border-t border-rose-100 dark:border-rose-950 bg-slate-50 dark:bg-[#12070e] shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold">
            <Heart className="w-4 h-4 fill-current animate-pulse" />
            <span className="hidden sm:inline">Made with love by Sujan for Amisha</span>
            <span className="sm:hidden">For Amisha</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartQuiz(unit.words)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#f43f5e] hover:from-[#be123c] hover:to-[#e11d48] text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Love Quiz</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
