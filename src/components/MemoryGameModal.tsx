import React, { useState, useEffect } from 'react';
import { VocabWord } from '../types';
import { speakPt, speakEn, playSuccessSound, playTone, playErrorSound } from '../utils/audio';

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

  useEffect(() => {
    // Pick 4 random words
    const sample = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 4);
    const cardList: CardItem[] = [];

    sample.forEach((w, idx) => {
      cardList.push({
        uid: `pt-${idx}`,
        wordId: w.pt,
        text: w.pt,
        lang: 'pt',
        isFlipped: false,
        isMatched: false,
      });
      cardList.push({
        uid: `en-${idx}`,
        wordId: w.pt,
        text: w.en,
        lang: 'en',
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(cardList.sort(() => 0.5 - Math.random()));
  }, [allWords]);

  const handleCardClick = (card: CardItem) => {
    if (card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

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
        }, 500);
      } else {
        // MISMATCH!
        playErrorSound();
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f4f5f8] overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 shadow-sm pt-safe">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 active:scale-90"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="text-center">
          <h2 className="text-base font-semibold text-slate-900">Memory Match</h2>
          <p className="text-xs font-semibold text-slate-400">
            Match Portuguese with English pairs!
          </p>
        </div>

        <div className="w-10" />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {isWon ? (
          <div className="text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-500 shadow-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2z"/></svg>
            </div>

            <h3 className="text-3xl font-bold text-slate-900">Parabéns! You Won!</h3>
            <p className="text-sm font-bold text-slate-600">
              Matched all Portuguese pairs!
            </p>

            <div className="flex justify-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-sm font-bold text-green-700">
                +40 XP
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700">
                +10 Coins 🪙
              </span>
            </div>

            <button
              onClick={onClose}
              className="mt-4 rounded-2xl bg-[#2563eb] px-8 py-3.5 font-semibold text-white shadow-lg active:scale-95"
            >
              Collect Rewards & Return
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {cards.map(card => {
              const isRevealed = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.uid}
                  onClick={() => handleCardClick(card)}
                  disabled={card.isMatched}
                  className={`flex h-28 items-center justify-center rounded-2xl border p-3 text-center font-semibold text-base shadow-sm transition-all active:scale-95 ${
                    card.isMatched
                      ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-40 cursor-default'
                      : isRevealed
                      ? 'border-[#2563eb] bg-blue-50 text-blue-900 shadow-md ring-2 ring-blue-200'
                      : 'border-black/10 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {isRevealed ? (
                    <div className="space-y-1">
                      <p className="leading-tight">{card.text}</p>
                      <span className="block text-[10px] font-bold uppercase text-[#2563eb]">
                        {card.lang === 'pt' ? '🇵🇹 Portuguese' : '🇬🇧 English'}
                      </span>
                    </div>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-7.36l-.71.71M6.34 17.66l-.71.71m12.02 0l.71.71M6.34 6.34l.71.71M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
