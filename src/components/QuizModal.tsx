import React, { useState, useEffect } from 'react';
import { triggerHaptic } from '../utils/haptics';
import { VocabWord } from '../types';
import { speakPt, playSuccessSound, playErrorSound, playTone } from '../utils/audio';
import { 
  X, 
  Volume2, 
  Sparkles, 
  Mic, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  HelpCircle, 
  Heart,
  Keyboard,
  Layers
} from 'lucide-react';

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

  // Sentence blocks
  const [sentenceBlocks, setSentenceBlocks] = useState<{word: string, id: number}[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<{word: string, id: number}[]>([]);

  // MCQ Options for current question
  const [mcqOptions, setMcqOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!currentWord) return;
    const opts = [currentWord.pt];
    const poolCopy = [...quizPool].filter(w => w.pt !== currentWord.pt);
    while (opts.length < 4 && poolCopy.length > 0) {
      const randIdx = Math.floor(Math.random() * poolCopy.length);
      opts.push(poolCopy[randIdx].pt);
      poolCopy.splice(randIdx, 1);
    }
    setMcqOptions(opts.sort(() => 0.5 - Math.random()));
  }, [currentIndex, currentWord, quizPool]);

  const [questionModes, setQuestionModes] = useState<('mcq' | 'type' | 'voice' | 'sentence')[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState('');

  useEffect(() => {
    if (quizPool[currentIndex]) {
      const words = quizPool[currentIndex].pt.split(' ');
      let distractors = ['a', 'o', 'que', 'muito', 'de'];
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
      setQuestionModes(prev => prev.map((m, i) => i === currentIndex ? 'mcq' : m));
      return;
    }
    
    try {
      setIsListening(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-PT';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event: any) => {
        try {
          const transcript = event.results[0][0].transcript;
          setVoiceResult(transcript);
          setIsListening(false);
          
          const normalizedSpoken = transcript.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '');
          const normalizedTarget = currentWord.pt.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '');
          
          const isMatch = normalizedSpoken === normalizedTarget || normalizedSpoken.includes(normalizedTarget);
          checkAnswer(isMatch);
        } catch {
          setIsListening(false);
        }
      };
      
      recognition.onerror = (e: any) => {
        console.warn('Voice recognition error:', e);
        setIsListening(false);
        // Switch to MCQ if audio device / microphone is not working
        setQuestionModes(prev => prev.map((m, i) => i === currentIndex ? 'mcq' : m));
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition audio device:', err);
      setIsListening(false);
      // Fallback seamlessly to multiple choice mode
      setQuestionModes(prev => prev.map((m, i) => i === currentIndex ? 'mcq' : m));
    }
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
    checkAnswer(isCorrectAnswer);
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
      if (isLoveUnit) xpPerCorrect *= 2;

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
      playTone(560, 'sine', 0.04);
      triggerHaptic('light');
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setTypedAnswer('');
      setVoiceResult('');
    } else {
      const totalCoins = earnedXP;
      const finalScore = score + (isCorrect ? 1 : 0);
      const isPerfect = finalScore === quizPool.length;
      
      if (isPerfect || finalScore >= 3) {
        playSuccessSound();
      }

      window.dispatchEvent(new CustomEvent('puku:lesson_complete', { 
        detail: { isPerfect, score: finalScore } 
      }));

      onComplete(
        finalScore,
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

  // Header Gradient selection
  const headerGradient = isLoveUnit
    ? 'from-[#e11d48] via-[#f43f5e] to-[#fb7185]'
    : isWeakWordsMode
    ? 'from-[#e11d48] via-[#ea580c] to-[#f97316]'
    : 'from-[#1d4ed8] via-[#2563eb] to-[#3b82f6]';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] bg-white dark:bg-[#12141a] border border-slate-200/60 dark:border-slate-800/80 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* ================= HEADER BANNER ================= */}
        <div className={`relative bg-gradient-to-br ${headerGradient} p-6 text-white text-center overflow-hidden shrink-0`}>
          
          {/* Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-white rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-white rounded-full blur-2xl"></div>
          </div>

          {/* Top Actions Bar (No overlap on mobile) */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
            <div className="flex-1" />

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-xs max-w-[200px] sm:max-w-none truncate">
              {isLoveUnit ? (
                <>
                  <Heart className="w-3.5 h-3.5 text-rose-200 fill-current shrink-0" />
                  <span className="truncate">Love Quiz • Sujan & Amisha</span>
                </>
              ) : isWeakWordsMode ? (
                <>
                  <HelpCircle className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                  <span className="truncate">Weak Words Workout</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                  <span className="truncate">{unitTitle} Quiz</span>
                </>
              )}
            </div>

            {/* Close Button */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-md shrink-0"
                title="Close Quiz"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {isLoveUnit ? 'Romantic Quiz ❤️' : isWeakWordsMode ? 'Weak Words Workout ⚡' : `${unitTitle} Quiz`}
          </h2>

          <p className="text-xs sm:text-sm text-white/90 font-medium mt-1 max-w-md mx-auto leading-relaxed">
            Question {currentIndex + 1} of {quizPool.length} • Score: {score}
          </p>

          {/* Progress Indicator */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex items-center justify-between text-[11px] font-bold text-white/90 mb-1 px-1">
              <span>Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 w-full bg-black/25 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-amber-300 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

        </div>

        {/* ================= QUIZ CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Question Card */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#181a22] p-6 text-center space-y-3 shadow-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Translate into European Portuguese</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              "{currentWord.en}"
            </h3>

            {currentWord.nepali && (
              <p className="text-xs font-bold text-rose-500">
                🇳🇵 {currentWord.nepali}
              </p>
            )}

            <button
              onClick={() => speakPt(currentWord.pt)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer pt-1"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Portuguese audio</span>
            </button>
          </div>

          {/* Interactive Modes */}
          {questionMode === 'mcq' ? (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                Choose the correct option:
              </span>

              <div className="grid grid-cols-1 gap-2">
                {mcqOptions.map((opt, idx) => {
                  let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-400';

                  if (isAnswered) {
                    if (opt === currentWord.pt) {
                      btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-black';
                    } else if (opt === selectedOption) {
                      btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100';
                    } else {
                      btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 border-transparent';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isAnswered}
                      className={`p-4 rounded-2xl border font-black text-base transition-all cursor-pointer flex items-center justify-between shadow-xs ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && opt === currentWord.pt && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )}
                      {isAnswered && opt === selectedOption && opt !== currentWord.pt && (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : questionMode === 'sentence' ? (
            <div className="space-y-4">
              <div className="min-h-[85px] p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap gap-2 items-center justify-center">
                {selectedBlocks.length === 0 ? (
                  <span className="text-xs font-semibold text-slate-400">
                    Tap word tiles below to construct the sentence
                  </span>
                ) : (
                  selectedBlocks.map(block => (
                    <button
                      key={block.id}
                      onClick={() => handleBlockClick(block, true)}
                      disabled={isAnswered}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm shadow-sm cursor-pointer active:scale-95"
                    >
                      {block.word}
                    </button>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {sentenceBlocks.map(block => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block, false)}
                    disabled={isAnswered}
                    className="px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:border-blue-400 active:scale-95 cursor-pointer shadow-xs"
                  >
                    {block.word}
                  </button>
                ))}
              </div>

              {!isAnswered && (
                <button
                  onClick={handleSentenceSubmit}
                  disabled={selectedBlocks.length === 0}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white transition-all shadow-md active:scale-98 disabled:opacity-40 cursor-pointer"
                >
                  Check Sentence
                </button>
              )}
            </div>
          ) : questionMode === 'voice' ? (
            <div className="space-y-4 text-center py-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Speak Portuguese phrase into your microphone:
              </p>

              <button
                onClick={handleVoiceRecord}
                disabled={isAnswered || isListening}
                className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 scale-110 animate-pulse text-white ring-8 ring-rose-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105'
                }`}
              >
                <Mic className="w-8 h-8" />
              </button>

              {isListening && (
                <p className="text-xs font-bold text-rose-500 animate-pulse">
                  Listening to Lisbon Portuguese... Speak clearly now!
                </p>
              )}

              {voiceResult && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-xs mx-auto">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">You said:</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">"{voiceResult}"</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleTypeSubmit} className="space-y-3">
              <input
                type="text"
                value={typedAnswer}
                onChange={e => setTypedAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Type European Portuguese translation..."
                className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center text-lg font-black text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />

              {!isAnswered && (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {['á', 'é', 'í', 'ó', 'ú', 'ã', 'õ', 'ç'].map(char => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => addAccentChar(char)}
                      className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm text-slate-800 dark:text-slate-200 active:scale-90 cursor-pointer"
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
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white transition-all shadow-md active:scale-98 disabled:opacity-40 cursor-pointer"
                >
                  Submit Translation
                </button>
              )}
            </form>
          )}

          {/* Feedback Sheet upon Answering */}
          {isAnswered && (
            <div
              className={`rounded-3xl p-5 border shadow-lg space-y-3 ios-modal-slide-up ${
                isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1 flex-1">
                  <h4 className="text-base font-black">
                    {isCorrect ? 'Excelente! Correct!' : 'Acho que falhaste!'}
                  </h4>
                  <p className="text-xs font-bold">
                    Correct Portuguese: <span className="underline">{currentWord.pt}</span>
                  </p>
                  {currentWord.phonetic && (
                    <p className="text-[11px] opacity-80">
                      Pronunciation: /{currentWord.phonetic}/
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleNext}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs text-white shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isCorrect ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <span>{currentIndex + 1 < quizPool.length ? 'Next Question' : 'View Quiz Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1015] shrink-0 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-semibold">
            {quizPool.length - currentIndex} questions remaining
          </span>

          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
          >
            Quit Quiz
          </button>
        </div>

      </div>

    </div>
  );
};
