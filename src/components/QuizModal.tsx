import React, { useState, useEffect } from 'react';
import { triggerHaptic } from '../utils/haptics';
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
  const [isListeningMode, setIsListeningMode] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentWord = quizPool[currentIndex] || quizPool[0];
  const progressPercent = ((currentIndex + 1) / quizPool.length) * 100;

  // Generate 4 multiple choice options
  const [sentenceBlocks, setSentenceBlocks] = useState<{word: string, id: number}[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<{word: string, id: number}[]>([]);

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

  
  const [questionModes, setQuestionModes] = useState<('mcq' | 'type' | 'voice' | 'sentence')[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState('');

  useEffect(() => {
    if (quizPool[currentIndex]) {
      const words = quizPool[currentIndex].pt.split(' ');
      // Add some random words
      let distractors = ['a', 'o', 'que', 'muito'];
      const allWords = [...words, ...distractors.slice(0, 2)].map((w, i) => ({word: w, id: i})).sort(() => Math.random() - 0.5);
      setSentenceBlocks(allWords);
      setSelectedBlocks([]);
    }
  }, [currentIndex, quizPool]);

  // Initializing question modes
  useEffect(() => {
    setQuestionModes(quizPool.map((_, idx) => {
      if (idx % 4 === 0) return 'mcq';
      if (idx % 4 === 1) return 'sentence';
      if (idx % 4 === 2) return 'type';
      return 'voice';
    }));
  }, [quizPool]);

  const questionMode = questionModes[currentIndex] || 'mcq';

  const handleVoiceRecord = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log("Voice learning is not supported in this browser. Please use Chrome or Safari.");
      // Fallback
      setQuestionModes(prev => prev.map((m, i) => i === currentIndex ? 'mcq' : m));
      return;
    }
    
    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-PT'; // European Portuguese
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceResult(transcript);
      setIsListening(false);
      
      const normalizedSpoken = transcript.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '');
      const normalizedTarget = currentWord.pt.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '');
      
      // Simple string matching (in a real app you might use Levenshtein distance)
      const isMatch = normalizedSpoken === normalizedTarget || normalizedSpoken.includes(normalizedTarget);
      checkAnswer(isMatch);
    };
    
    recognition.onerror = (e) => {
      setIsListening(false);
      console.log("Speech recognition error", e.error);
      console.log("Could not hear you clearly. Please try again.");
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };


  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    checkAnswer(opt === currentWord.pt);
  };

  const handleBlockClick = (block: {word: string, id: number}, fromSelected: boolean) => {
    if (isAnswered) return;
    triggerHaptic('light');
    if (fromSelected) {
      setSelectedBlocks(prev => prev.filter(b => b.id !== block.id));
      setSentenceBlocks(prev => [...prev, block]);
    } else {
      setSentenceBlocks(prev => prev.filter(b => b.id !== block.id));
      setSelectedBlocks(prev => [...prev, block]);
    }
  };

  const handleSentenceSubmit = () => {
    if (isAnswered) return;
    const answer = selectedBlocks.map(b => b.word).join(' ');
    const isCorrectAnswer = answer.toLowerCase().replace(/[^a-z0-9áéíóúãõç]/g, '') === currentWord.pt.toLowerCase().replace(/[^a-z0-9áéíóúãõç]/g, '');
    setIsAnswered(true);
    setIsCorrect(isCorrectAnswer);
    if (isCorrectAnswer) {
      setScore(s => s + 1);
      setEarnedXP(xp => xp + 15);
      playSuccessSound();
      triggerHaptic('success');
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { title: 'Perfect!', message: '+15 XP earned', icon: '🌟' }}));
    } else {
      onLoseHeart();
      onAddWeakWord(currentWord);
      playErrorSound();
      triggerHaptic('error');
    }
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
      triggerHaptic('success');
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { title: 'Correct!', message: '+10 XP earned', icon: '✨' }}));
      setScore(prev => prev + 1);
      window.dispatchEvent(new CustomEvent('puku:correct_answer'));

      let xpPerCorrect = isWeakWordsMode ? 20 : 10;
      if (isLoveUnit) xpPerCorrect *= 2; // 2x Bonus for Love Language!

      setEarnedXP(prev => prev + xpPerCorrect);
      onRemoveWeakWord(currentWord.pt);
    } else {
      playErrorSound();
      triggerHaptic('error');
      window.dispatchEvent(new CustomEvent('puku:wrong_answer'));
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
      const totalCoins = earnedXP;
      const isPerfect = score + (isCorrect ? 1 : 0) === quizPool.length;
      
      window.dispatchEvent(new CustomEvent('puku:lesson_complete', { 
        detail: { isPerfect, score: score + (isCorrect ? 1 : 0) } 
      }));

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
      <div className="flex items-center justify-between  border-gray-100 bg-white px-4 py-3 shadow-sm pt-safe">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 border-b-2 border-gray-200 active:translate-y-0.5"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="flex-1 mx-4">
          <div className="h-3.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-[#2563eb] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-[#2563eb]">
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
            <span className="inline-flex items-center gap-1 rounded-2xl bg-[#E5F3FF] border border-[#B3E5FC] px-3 py-1 text-xs font-bold text-[#1899D6] uppercase tracking-wider">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-7.36l-.71.71M6.34 17.66l-.71.71m12.02 0l.71.71M6.34 6.34l.71.71M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
              <span>Translate into European Portuguese</span>
            </span>

            <h2 className="text-3xl font-bold text-[#4B4B4B] leading-tight">
              "{currentWord.en}"
            </h2>

            <button
              onClick={() => speakPt(currentWord.pt)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] hover:underline"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              <span>Listen to Portuguese audio</span>
            </button>
          </div>

          {/* Interactive Input based on Question Type */}
          {questionMode === 'mcq' ? (
            <div className="space-y-3 pt-2">
              {mcqOptions.map((option, idx) => {
                let btnStyle = 'border border-gray-100  bg-white text-[#4B4B4B] hover:border-[#1CB0F6] active:border-b-2 active:translate-y-0.5';

                if (isAnswered) {
                  if (option === currentWord.pt) {
                    btnStyle = 'border border-[#2563eb]  bg-[#E8F5E9] text-[#2E7D32]';
                  } else if (option === selectedOption) {
                    btnStyle = 'border border-[#FF4B4B]  bg-[#FFEBEB] text-[#C62828]';
                  } else {
                    btnStyle = 'opacity-40 border border-gray-100 bg-gray-50 text-gray-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`w-full rounded-2xl p-4 text-left font-bold text-base transition-all ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

          
          ) : questionMode === 'sentence' ? (
            <div className="space-y-6 pt-2">
              <div className="min-h-[80px] p-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-wrap gap-2 items-start">
                {selectedBlocks.map(block => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block, true)}
                    disabled={isAnswered}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-bold text-[#4B4B4B] shadow-sm hover:border-[#1CB0F6] active:translate-y-0.5"
                  >
                    {block.word}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {sentenceBlocks.map(block => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block, false)}
                    disabled={isAnswered}
                    className="px-4 py-2 bg-white border-2 border-gray-200 border-b-4 rounded-xl font-bold text-[#4B4B4B] hover:bg-gray-50 active:translate-y-1 active:border-b-2 transition-all"
                  >
                    {block.word}
                  </button>
                ))}
              </div>
              {!isAnswered && (
                <button
                  onClick={handleSentenceSubmit}
                  disabled={selectedBlocks.length === 0}
                  className="btn-vibrant-green w-full py-4 font-bold text-white text-base shadow-lg disabled:opacity-50"
                >
                  Check
                </button>
              )}
            </div>
          ) : questionMode === 'voice' ? (
            <div className="space-y-4 pt-2 text-center">
              <p className="text-sm font-semibold text-gray-500 mb-2">Speak the Portuguese translation:</p>
              <button
                onClick={handleVoiceRecord}
                disabled={isAnswered || isListening}
                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-transform ${
                  isListening ? 'bg-rose-500 scale-110 animate-pulse text-white' : 'bg-blue-600 text-white hover:scale-105'
                }`}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </button>
              {isListening && <p className="text-rose-500 font-bold animate-pulse mt-4">Listening...</p>}
              {isAnswered && (
                <div className="mt-4 p-3 bg-gray-100 rounded-xl">
                  <p className="text-xs text-gray-500 font-semibold uppercase">You said:</p>
                  <p className="text-lg font-bold text-gray-800">"{voiceResult}"</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleTypeSubmit}
 className="space-y-4 pt-2">
              <input
                type="text"
                value={typedAnswer}
                onChange={e => setTypedAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Type Portuguese phrase..."
                className="w-full rounded-2xl border border-gray-200  bg-white p-4 text-center text-xl font-bold text-[#4B4B4B] outline-none focus:border-[#2563eb] disabled:bg-gray-100"
              />

              {/* Accent Keys Helper */}
              {!isAnswered && (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {['á', 'é', 'í', 'ó', 'ú', 'ã', 'õ', 'ç'].map(char => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => addAccentChar(char)}
                      className="h-10 w-10 rounded-2xl border border-gray-100 border-b-2 border-b-gray-300 bg-white font-bold text-[#4B4B4B] active:border-b-0 active:translate-y-0.5"
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
                  className="btn-vibrant-green w-full py-4 font-bold text-white text-base shadow-lg disabled:opacity-50"
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
            className={`mt-6 rounded-2xl p-5 border border-b shadow-xl animate-in slide-in-from-bottom-6 duration-300 ${
              isCorrect
                ? 'bg-[#E8F5E9] border-[#2563eb] border-b-[#1d4ed8] text-[#1B5E20]'
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
                <h4 className="text-lg font-bold">
                  {isCorrect ? 'Excelente! Correct!' : 'Acho que falhaste!'}
                </h4>
                <p className="mt-1 text-sm font-bold">
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
