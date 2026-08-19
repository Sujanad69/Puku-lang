import React, { useState, useEffect } from 'react';
import { VocabWord } from '../types';
import { speakPt, speakEn, playSuccessSound, playTone, playErrorSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { X, Volume2, Sparkles, CheckCircle2, RotateCw, Trophy, Grid2X2 } from 'lucide-react';

interface MemoryGameModalProps {
  allWords: VocabWord[];
  onClose: () => void;
  onWin: (earnedXP: number, earnedCoins: number) => void;
}

interface CardItem {
  uid: string;
  wordId: string;
  text: string;
  lang: 'pt' | 'en';
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGameModal: React.FC<MemoryGameModalProps> = ({
  allWords,
  onClose,
  onWin,
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    // Pick 4 random words
    const sample = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 4);
    const cardList: CardItem[] = [];

    sample.forEach((w, idx) => {
      cardList.push({
        uid: `pt-${idx}-${Date.now()}`,
        wordId: w.pt,
        text: w.pt,
        lang: 'pt',
        isFlipped: false,
        isMatched: false,
      });
      cardList.push({
        uid: `en-${idx}-${Date.now()}`,
        wordId: w.pt,
        text: w.en,
        lang: 'en',
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(cardList.sort(() => 0.5 - Math.random()));
    setSelectedCards([]);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, [allWords]);

  const handleCardClick = (card: CardItem) => {
    if (card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    playTone(550, 'sine', 0.04);
    triggerHaptic('light');

    // Speech audio
    if (card.lang === 'pt') {
      speakPt(card.text);
    } else {
      speakEn(card.text);
    }

    // Flip card
    const updated = cards.map(c => (c.uid === card.uid ? { ...c, isFlipped: true } : c));
    setCards(updated);

    const nextSelected = [...selectedCards, card];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      const [c1, c2] = nextSelected;

      if (c1.wordId === c2.wordId) {
        // MATCH!
        playSuccessSound();
        triggerHaptic('success');
        setTimeout(() => {
          setCards(prev =>
            prev.map(c => (c.wordId === c1.wordId ? { ...c, isMatched: true } : c))
          );
          setSelectedCards([]);

          // Check if all matched
          const remaining = updated.filter(c => !c.isMatched && c.wordId !== c1.wordId);
          if (remaining.length === 0) {
            setIsWon(true);
            onWin(40, 10);
          }
        }, 400);
      } else {
        // MISMATCH!
        playErrorSound();
        triggerHaptic('error');
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.uid === c1.uid || c.uid === c2.uid ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const matchedCount = cards.filter(c => c.isMatched).length / 2;
  const totalPairs = cards.length / 2;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] bg-white dark:bg-[#12141a] border border-slate-200/60 dark:border-slate-800/80 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* ================= HEADER BANNER ================= */}
        <div className="relative bg-gradient-to-br from-[#047857] via-[#059669] to-[#10b981] p-6 text-white text-center overflow-hidden shrink-0">
          
          {/* Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-200 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-teal-300 rounded-full blur-2xl"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-md"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 mb-2 shadow-xs">
            <Grid2X2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>Memory Card Match Game</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Jogo da Memória 🧠
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1 max-w-md mx-auto leading-relaxed">
            Match Portuguese vocabulary with their correct English definitions!
          </p>

          {/* Pairs progress */}
          <div className="mt-3 inline-flex items-center gap-2 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-emerald-100">
            <span>Pairs Found:</span>
            <span className="font-mono text-white">{matchedCount} / {totalPairs || 4}</span>
          </div>

        </div>

        {/* ================= CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          
          {isWon ? (
            <div className="text-center space-y-4 max-w-sm mx-auto py-6 ios-modal-scale-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-center shadow-lg animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Parabéns, Amisha! 🎉
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  You successfully matched all the Portuguese memory pairs!
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  +40 XP ⭐
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/50 px-3.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  +10 Coins 🪙
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={initGame}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg mx-auto">
              {cards.map(card => {
                const isRevealed = card.isFlipped || card.isMatched;

                return (
                  <button
                    key={card.uid}
                    onClick={() => handleCardClick(card)}
                    disabled={card.isMatched}
                    className={`flex h-28 sm:h-32 flex-col items-center justify-center rounded-2xl p-3 text-center transition-all cursor-pointer select-none ${
                      card.isMatched
                        ? 'border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 opacity-60 cursor-default'
                        : isRevealed
                        ? 'border-2 border-emerald-500 bg-white dark:bg-slate-900 shadow-md ring-4 ring-emerald-500/20 scale-[1.02]'
                        : 'border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#181a22] text-slate-700 dark:text-slate-300 hover:border-emerald-400 active:scale-95 shadow-xs'
                    }`}
                  >
                    {isRevealed ? (
                      <div className="space-y-1.5 w-full">
                        <p className="font-black text-sm text-slate-900 dark:text-white leading-tight line-clamp-2">
                          {card.text}
                        </p>
                        <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          card.lang === 'pt'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        }`}>
                          {card.lang === 'pt' ? '🇵🇹 PT' : '🇬🇧 EN'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 opacity-40">
                        <Sparkles className="w-6 h-6 text-emerald-500" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Match
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1015] shrink-0 flex items-center justify-between gap-3">
          <button
            onClick={initGame}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Shuffle New Words</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};
