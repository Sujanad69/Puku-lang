import React, { useState } from 'react';
import { VocabWord } from '../types';
import { speakPt, playSuccessSound, playErrorSound, playTone } from '../utils/audio';

interface QuizModalProps {
  quizPool: VocabWord[];
  unitTitle: string;
  isLoveUnit?: boolean;
  isWeakWordsMode?: boolean;
  isRecoveryMode?: boolean;
  onClose: () => void;
  onComplete: (score: number, total: number, earnedXP: number, earnedCoins: number, perfectGem: boolean) => void;
  onLoseHeart: () => void;
  onAddWeakWord: (word: VocabWord) => void;
  onRemoveWeakWord: (wordPt: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  quizPool,
  unitTitle,
  isLoveUnit = false,
  isWeakWordsMode = false,
  isRecoveryMode = false,
  onClose,
  onComplete,
  onLoseHeart,
  onAddWeakWord,
  onRemoveWeakWord,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentWord = quizPool[currentIndex] || quizPool[0];
  const progressPercent = ((currentIndex + 1) / quizPool.length) * 100;

  // Generate 4 multiple choice options
  const [mcqOptions] = useState<string[]>(() => {
    const opts = [currentWord.pt];
    const poolCopy = [...quizPool].filter(w => w.pt !== currentWord.pt);
    while (opts.length < 4 && poolCopy.length > 0) {
      const randIdx = Math.floor(Math.random() * poolCopy.length);
      opts.push(poolCopy[randIdx].pt);
      poolCopy.splice(randIdx, 1);
    }
    return opts.sort(() => 0.5 - Math.random());
  });

  const questionMode = currentIndex % 2 === 0 ? 'mcq' : 'type';

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    checkAnswer(opt === currentWord.pt);
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered) return;

    const normalizedTyped = typedAnswer.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedTarget = currentWord.pt.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const correct = normalizedTyped === normalizedTarget;
    checkAnswer(correct);
  };

  const checkAnswer = (correct: boolean) => {
    setIsAnswered(true);
    setIsCorrect(correct);

    speakPt(currentWord.pt);

    if (correct) {
      playSuccessSound();
      setScore(prev => prev + 1);

      let xpPerCorrect = isWeakWordsMode ? 20 : 10;
      if (isLoveUnit) xpPerCorrect *= 2; // 2x Bonus for Love Language!

      setEarnedXP(prev => prev + xpPerCorrect);
      onRemoveWeakWord(currentWord.pt);
    } else {
      playErrorSound();
      if (!isRecoveryMode) {
        onLoseHeart();
      }
      onAddWeakWord(currentWord);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizPool.length) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setTypedAnswer('');
    } else {
      // Quiz Finished!
      const totalCoins = Math.floor(earnedXP / 4);
      const isPerfect = score + (isCorrect ? 1 : 0) === quizPool.length;
      onComplete(
        score + (isCorrect ? 1 : 0),
        quizPool.length,
        earnedXP,
        totalCoins,
        isPerfect
      );
    }
  };

  const addAccentChar = (char: string) => {
    playTone(500, 'sine', 0.05);
    setTypedAnswer(prev => prev + char);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAFAF5] overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-4 border-gray-100 bg-white px-4 py-3 shadow-sm pt-safe">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 border-b-2 border-gray-200 active:translate-y-0.5"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="flex-1 mx-4">
          <div className="h-3.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-[#58CC02] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-black text-[#58CC02]">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{quizPool.length}</span>
        </div>
      </div>

      {/* Main Quiz Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between max-w-md mx-auto w-full">
        <div className="pt-4 space-y-6">
          {/* Question Box */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1 rounded-2xl bg-[#E5F3FF] border border-[#B3E5FC] px-3 py-1 text-xs font-black text-[#1899D6] uppercase tracking-wider">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-7.36l-.71.71M6.34 17.66l-.71.71m12.02 0l.71.71M6.34 6.34l.71.71M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
              <span>Translate into European Portuguese</span>
            </span>

            <h2 className="text-3xl font-black text-[#4B4B4B] leading-tight">
              "{currentWord.en}"
            </h2>

            <button
              onClick={() => speakPt(currentWord.pt)}
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#58CC02] hover:underline"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              <span>Listen to Portuguese audio</span>
            </button>
          </div>

          {/* Interactive Input based on Question Type */}
          {questionMode === 'mcq' ? (
            <div className="space-y-3 pt-2">
              {mcqOptions.map((option, idx) => {
                let btnStyle = 'border-2 border-gray-100 border-b-4 border-b-gray-200 bg-white text-[#4B4B4B] hover:border-[#1CB0F6] active:border-b-2 active:translate-y-0.5';

                if (isAnswered) {
                  if (option === currentWord.pt) {
                    btnStyle = 'border-2 border-[#58CC02] border-b-4 border-b-[#46A302] bg-[#E8F5E9] text-[#2E7D32]';
                  } else if (option === selectedOption) {
                    btnStyle = 'border-2 border-[#FF4B4B] border-b-4 border-b-[#D33131] bg-[#FFEBEB] text-[#C62828]';
                  } else {
                    btnStyle = 'opacity-40 border-2 border-gray-100 bg-gray-50 text-gray-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`w-full rounded-2xl p-4 text-left font-black text-base transition-all ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleTypeSubmit} className="space-y-4 pt-2">
              <input
                type="text"
                value={typedAnswer}
                onChange={e => setTypedAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Type Portuguese phrase..."
                className="w-full rounded-2xl border-2 border-gray-200 border-b-4 border-b-gray-300 bg-white p-4 text-center text-xl font-black text-[#4B4B4B] outline-none focus:border-[#58CC02] disabled:bg-gray-100"
              />

              {/* Accent Keys Helper */}
              {!isAnswered && (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {['á', 'é', 'í', 'ó', 'ú', 'ã', 'õ', 'ç'].map(char => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => addAccentChar(char)}
                      className="h-10 w-10 rounded-2xl border-2 border-gray-100 border-b-2 border-b-gray-300 bg-white font-black text-[#4B4B4B] active:border-b-0 active:translate-y-0.5"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              )}

              {!isAnswered && (
                <button
                  type="submit"
                  disabled={!typedAnswer.trim()}
                  className="btn-vibrant-green w-full py-4 font-black text-white text-base shadow-lg disabled:opacity-50"
                >
                  Submit Answer
                </button>
              )}
            </form>
          )}
        </div>

        {/* Feedback Sheet upon Answering */}
        {isAnswered && (
          <div
            className={`mt-6 rounded-3xl p-5 border-2 border-b-8 shadow-xl animate-in slide-in-from-bottom-6 duration-300 ${
              isCorrect
                ? 'bg-[#E8F5E9] border-[#58CC02] border-b-[#46A302] text-[#1B5E20]'
                : 'bg-[#FFEBEB] border-[#FF4B4B] border-b-[#D33131] text-[#B71C1C]'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
              )}

              <div className="flex-1">
                <h4 className="text-lg font-black">
                  {isCorrect ? 'Excelente! Correct!' : 'Acho que falhaste!'}
                </h4>
                <p className="mt-1 text-sm font-black">
                  Correct Portuguese: <span className="underline">{currentWord.pt}</span>
                </p>
                {currentWord.phonetic && (
                  <p className="text-xs font-bold text-gray-600">
                    Pronunciation: [{currentWord.phonetic}]
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleNext}
              className={`mt-4 w-full py-3.5 text-base ${
                isCorrect ? 'btn-vibrant-green' : 'btn-vibrant-red'
              }`}
            >
              Continue Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
