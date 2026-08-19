import React, { useState, useEffect, useCallback, useRef } from 'react';
import { speakPt, playTone, playSuccessSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  MessageCircleHeart, 
  Volume2, 
  X, 
  ChevronRight, 
  RefreshCw,
  Trophy,
  Smile
} from 'lucide-react';

export type PukuOutfit = 'classic' | 'lisbon_cap' | 'scholar' | 'sunglasses' | 'crown' | 'flower';
export type PukuMood = 'happy' | 'love' | 'wink' | 'eating' | 'study' | 'celebrate' | 'sad';

interface MiniQuizQuestion {
  question: string;
  ptPhrase: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const MINI_QUIZ_POOL: MiniQuizQuestion[] = [
  {
    question: "How do you ask for an espresso in Lisbon?",
    ptPhrase: "Uma bica, por favor",
    options: ["Um café longo", "Uma bica, por favor", "Um galão doce"],
    correctIndex: 1,
    explanation: "In Lisbon, a single espresso is called 'uma bica'!"
  },
  {
    question: "What does 'Tenho saudades tuas' mean?",
    ptPhrase: "Tenho saudades tuas",
    options: ["I miss you so much", "See you tomorrow", "You are beautiful"],
    correctIndex: 0,
    explanation: "Saudade is that deep, beautiful Portuguese feeling of longing!"
  },
  {
    question: "How should Amisha say 'Thank you' in Portugal?",
    ptPhrase: "Obrigada",
    options: ["Obrigado", "Obrigada", "Por favor"],
    correctIndex: 1,
    explanation: "Because you are a woman, always say 'Obrigada' with an -a!"
  },
  {
    question: "What is Portugal's famous custard tart called?",
    ptPhrase: "Pastel de nata",
    options: ["Bolo de arroz", "Pastel de nata", "Pão de Deus"],
    correctIndex: 1,
    explanation: "Pastel de nata! Especially delicious with cinnamon & a bica ☕"
  },
  {
    question: "How do you say 'I love you with all my heart'?",
    ptPhrase: "Amo-te com todo o meu coração",
    options: ["Amo-te muito", "Amo-te com todo o meu coração", "És meu amigo"],
    correctIndex: 1,
    explanation: "Sujan's favorite phrase for Amisha! ❤️"
  }
];

const SUJAN_LOVE_NOTES = [
  {
    pt: "Amo-te cada dia mais, minha princesa Amisha.",
    en: "I love you more each day, my princess Amisha.",
    np: "म तिमीलाई हरेक दिन अझ धेरै माया गर्छु, मेरी राजकुमारी अमिशा।",
    mood: "love" as PukuMood
  },
  {
    pt: "Tenho tantas saudades tuas. Estou a contar os dias para te abraçar em Lisboa.",
    en: "I miss you so much. I'm counting the days to hug you in Lisbon.",
    np: "मलाई तिम्रो धेरै याद आउँछ। म लिस्बनमा तिमीलाई अंगाल्ने दिनहरू गन्दै छु।",
    mood: "love" as PukuMood
  },
  {
    pt: "Tu és a mulher mais inteligente, bonita e especial do mundo.",
    en: "You are the smartest, most beautiful, and most special woman in the world.",
    np: "तिमी संसारकै सबैभन्दा ज्ञानी, सुन्दरी र विशेष महिला हौ।",
    mood: "wink" as PukuMood
  },
  {
    pt: "Sujan está muito orgulhoso do teu progresso em português!",
    en: "Sujan is so proud of your Portuguese progress!",
    np: "सुजन तिम्रो पोर्चुगिज सिकाइको प्रगतिमा धेरै गर्व गर्छ!",
    mood: "celebrate" as PukuMood
  },
  {
    pt: "O nosso amor não tem distância. O meu coração é teu para sempre.",
    en: "Our love knows no distance. My heart is yours forever.",
    np: "हाम्रो मायामा कुनै दूरी छैन। मेरो मुटु सधैं तिम्रो हो।",
    mood: "love" as PukuMood
  }
];

const LISBON_CHEAT_CODES = [
  {
    title: "The Silent 'E' Secret",
    pt: "Obrigado / Quente / Leite",
    tip: "In Portugal, unstressed 'e' at the end of words is barely whispered or swallowed! 'Leite' sounds like 'LAYT', not 'lay-chee'."
  },
  {
    title: "The Famous 'SH' Sound",
    pt: "Lisboa / Estás / Dois",
    tip: "In European Portuguese, the letter 'S' before consonants or at the end of words is pronounced like 'SH' (Leesh-boa, esh-tash, doysh)."
  },
  {
    title: "Ordering Coffee like a Local",
    pt: "Uma bica / Um galão / Uma meia de leite",
    tip: "Ask for 'Uma bica' for espresso, 'Um galão' for tall milky coffee in a glass, and 'Uma meia de leite' for half milk in a cup."
  },
  {
    title: "Saying 'Thank You' Correctly",
    pt: "Obrigada (Amisha) / Obrigado (Sujan)",
    tip: "Since Portuguese matches the gender of the speaker: Amisha says 'Obrigada', and Sujan says 'Obrigado'!"
  }
];

const RANDOM_PUKU_PHRASES = [
  { text: "Olá Amisha! Sujan sends you a big kiss from Portugal! 😘", mood: "love" as PukuMood },
  { text: "You are doing amazing! Keep going, my princess! 🌟", mood: "celebrate" as PukuMood },
  { text: "Every day we are closer to walking Lisbon streets together! 🇵🇹❤️", mood: "happy" as PukuMood },
  { text: "Feed me a banana and I will give you +10 Love XP! 🍌", mood: "eating" as PukuMood },
  { text: "Did you know Sujan loves you more than pastéis de nata? 🥐💖", mood: "wink" as PukuMood }
];

export const PukuCompanion: React.FC = () => {
  const [mood, setMood] = useState<PukuMood>('happy');
  const [outfit, setOutfit] = useState<PukuOutfit>('lisbon_cap');
  const [happiness, setHappiness] = useState(85);
  const [bananasFed, setBananasFed] = useState(0);
  const [isOpenHub, setIsOpenHub] = useState(false);
  const [activeTab, setActiveTab] = useState<'talk' | 'love' | 'quiz' | 'tips' | 'wardrobe'>('talk');
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("Olá Amisha! Let's study Portuguese together! 🐒❤️");
  
  const [loveNoteIndex, setLoveNoteIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const bubbleTimeoutRef = useRef<any>(null);

  const showPukuBubble = useCallback((text: string, newMood: PukuMood = 'happy', duration: number = 3500) => {
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    setBubbleText(text);
    setMood(newMood);
    setShowBubble(true);
    bubbleTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
    }, duration);
  }, []);

  const playPukuSound = (type: 'chirp' | 'munch' | 'love' | 'pop') => {
    if (type === 'chirp') {
      playTone(650, 'sine', 0.05, 0.1);
      setTimeout(() => playTone(850, 'sine', 0.06, 0.12), 60);
    } else if (type === 'munch') {
      playTone(320, 'sine', 0.08, 0.15);
      setTimeout(() => playTone(280, 'sine', 0.08, 0.15), 100);
      setTimeout(() => playTone(360, 'sine', 0.1, 0.18), 200);
    } else if (type === 'love') {
      playTone(523.25, 'sine', 0.12, 0.1); // C5
      setTimeout(() => playTone(659.25, 'sine', 0.12, 0.1), 80);  // E5
      setTimeout(() => playTone(783.99, 'sine', 0.15, 0.12), 160); // G5
    } else if (type === 'pop') {
      playTone(700, 'sine', 0.04, 0.08);
    }
  };

  // Feed Banana Mini-Interaction
  const handleFeedBanana = () => {
    playPukuSound('munch');
    triggerHaptic('medium');
    setMood('eating');
    setBananasFed(prev => prev + 1);
    
    const newHappiness = Math.min(100, happiness + 15);
    setHappiness(newHappiness);

    if (newHappiness >= 100) {
      setTimeout(() => {
        playPukuSound('love');
        playSuccessSound();
        triggerHaptic('success');
        setMood('celebrate');
        showPukuBubble("Yummy! Puku loves Amisha so much! +10 Love XP! 🍌💖", 'celebrate', 4000);
      }, 500);
    } else {
      showPukuBubble("Chomp chomp! Delicious! 🍌 Puku feels energized!", 'happy', 2500);
      setTimeout(() => setMood('happy'), 1200);
    }
  };

  const handleAvatarClick = () => {
    playPukuSound('chirp');
    triggerHaptic('light');

    if (!isOpenHub && !showBubble) {
      const randomItem = RANDOM_PUKU_PHRASES[Math.floor(Math.random() * RANDOM_PUKU_PHRASES.length)];
      showPukuBubble(randomItem.text, randomItem.mood, 3200);
    } else if (!isOpenHub && showBubble) {
      setIsOpenHub(true);
      setShowBubble(false);
    }
  };

  const handleSelectQuizOption = (index: number) => {
    if (quizSubmitted) return;
    playPukuSound('pop');
    triggerHaptic('light');
    setSelectedAnswer(index);
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswer === null || quizSubmitted) return;
    setQuizSubmitted(true);
    const currentQ = MINI_QUIZ_POOL[quizIndex % MINI_QUIZ_POOL.length];
    
    if (selectedAnswer === currentQ.correctIndex) {
      playSuccessSound();
      playPukuSound('love');
      triggerHaptic('success');
      setMood('celebrate');
      setQuizScore(prev => prev + 1);
    } else {
      playTone(280, 'sine', 0.15);
      triggerHaptic('error');
      setMood('sad');
    }
  };

  const handleNextQuiz = () => {
    playPukuSound('pop');
    triggerHaptic('light');
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setMood('happy');
    setQuizIndex(prev => (prev + 1) % MINI_QUIZ_POOL.length);
  };

  useEffect(() => {
    const handleCorrect = () => {
      playPukuSound('chirp');
      setMood('celebrate');
      showPukuBubble("Smart girl! Sujan is proud of you! 🌟❤️", 'celebrate', 2500);
    };

    const handleWrong = () => {
      setMood('sad');
      showPukuBubble("Don't worry Puntey, you will get the next one! 💪💕", 'sad', 2500);
    };

    const handleComplete = (e: any) => {
      const isPerfect = e.detail?.isPerfect;
      playSuccessSound();
      setMood('celebrate');
      showPukuBubble(
        isPerfect 
          ? "FLAWLESS! 🏆 Amisha is a Portuguese genius! Sujan loves you! 💖" 
          : "Lesson Done! Great progress today, meri Maya! 🎉",
        'celebrate',
        4000
      );
    };

    window.addEventListener('puku:correct_answer', handleCorrect);
    window.addEventListener('puku:wrong_answer', handleWrong);
    window.addEventListener('puku:lesson_complete', handleComplete);

    const initialTimer = setTimeout(() => {
      showPukuBubble("Olá Amisha! Puku & Sujan are here with you! 🇵🇹❤️", 'happy', 3500);
    }, 1200);

    return () => {
      window.removeEventListener('puku:correct_answer', handleCorrect);
      window.removeEventListener('puku:wrong_answer', handleWrong);
      window.removeEventListener('puku:lesson_complete', handleComplete);
      clearTimeout(initialTimer);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    };
  }, [showPukuBubble]);

  const currentQuiz = MINI_QUIZ_POOL[quizIndex % MINI_QUIZ_POOL.length];
  const currentLoveNote = SUJAN_LOVE_NOTES[loveNoteIndex % SUJAN_LOVE_NOTES.length];
  const currentTip = LISBON_CHEAT_CODES[tipIndex % LISBON_CHEAT_CODES.length];

  return (
    <>
      {/* ================= FLOATING MASCOT COMPANION DOCK ================= */}
      <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end pointer-events-none select-none">
        
        {/* Quick Speech Bubble with Interactive Tap Target */}
        <div 
          onClick={() => {
            setIsOpenHub(true);
            setShowBubble(false);
          }}
          className={`pointer-events-auto cursor-pointer mb-2 max-w-[240px] transform transition-all duration-300 origin-bottom-right ${
            showBubble 
              ? 'scale-100 opacity-100 translate-y-0' 
              : 'scale-90 opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <div className="relative rounded-[20px] bg-[#1c1c1e]/90 text-white px-4 py-2.5 text-xs font-semibold shadow-[0_12px_36px_rgba(0,0,0,0.6)] border border-white/10 backdrop-blur-2xl">
            <p className="leading-snug text-center">{bubbleText}</p>
            <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-[#0a84ff] font-bold">
              <span>Tap to Open Care Hub</span>
              <ChevronRight className="w-3 h-3" />
            </div>
            
            {/* Bubble Tail */}
            <div className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 bg-[#1c1c1e] border-r border-b border-white/10"></div>
          </div>
        </div>

        {/* Mascot Avatar Trigger & Quick Action Ring */}
        <div className="pointer-events-auto relative flex items-center gap-2">
          
          {/* Quick Hub Mini Button */}
          <button
            onClick={() => {
              playPukuSound('pop');
              triggerHaptic('light');
              setIsOpenHub(!isOpenHub);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1c1c1e] text-[#0a84ff] shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/10 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Open Puku Companion Hub"
          >
            {isOpenHub ? <X className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-[#ffd60a]" />}
          </button>

          {/* Interactive Bouncy SVG Monkey Avatar */}
          <div 
            onClick={handleAvatarClick}
            className="group relative cursor-pointer active:scale-90 transition-transform duration-200"
          >
            {/* Pulsing Happiness Glow */}
            <div className={`absolute -inset-1 rounded-full blur-md transition-opacity duration-300 ${
              mood === 'love' ? 'bg-[#ff375f] opacity-60 animate-pulse' :
              mood === 'celebrate' ? 'bg-[#ffd60a] opacity-70 animate-ping' :
              'bg-[#0a84ff] opacity-0 group-hover:opacity-40'
            }`}></div>

            {/* Banana Counter Pill */}
            <div className="absolute -top-1 -left-2 z-20 flex items-center gap-0.5 rounded-full bg-[#ffd60a] px-2 py-0.5 text-[9px] font-black text-black shadow-xs border border-white/40">
              <span>🍌</span>
              <span>{happiness}%</span>
            </div>

            {/* SVG PUKU MASCOT AVATAR */}
            <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] p-1 shadow-2xl border-2 border-white/20 overflow-visible">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
                
                {(mood === 'celebrate' || mood === 'wink') && (
                  <g className="animate-bounce" transform="translate(75, 40)">
                    <circle cx="10" cy="10" r="8" fill="#8B5A2B" />
                    <circle cx="10" cy="10" r="4" fill="#F5CBA7" />
                  </g>
                )}

                {/* Ears */}
                <circle cx="14" cy="46" r="15" fill="#8B5A2B" />
                <circle cx="14" cy="46" r="8" fill="#F5CBA7" />
                <circle cx="86" cy="46" r="15" fill="#8B5A2B" />
                <circle cx="86" cy="46" r="8" fill="#F5CBA7" />

                {/* Head Base */}
                <circle cx="50" cy="52" r="38" fill="#8B5A2B" />
                
                {/* Heart-Shaped Face Mask */}
                <path 
                  d="M 22,50 C 22,24 48,24 50,42 C 52,24 78,24 78,50 C 78,78 68,86 50,86 C 32,86 22,78 22,50 Z" 
                  fill="#F5CBA7" 
                />

                {/* Blushing Cheeks */}
                <ellipse cx="32" cy="62" rx="5.5" ry="3.5" fill="#ff375f" opacity="0.6" />
                <ellipse cx="68" cy="62" rx="5.5" ry="3.5" fill="#ff375f" opacity="0.6" />

                {/* OUTFITS & ACCESSORIES */}
                {outfit === 'lisbon_cap' && (
                  <g transform="translate(18, 8)">
                    <path d="M 12,24 Q 32,18 52,24 L 56,29 Q 32,23 8,29 Z" fill="#0f172a" />
                    <path d="M 12,24 Q 32,6 52,24 L 48,22 Q 32,12 16,22 Z" fill="#0a84ff" stroke="#ffffff" strokeWidth="0.8" />
                    <path d="M 14,24 Q 32,20 50,24" stroke="#ffd60a" strokeWidth="2.5" />
                    <circle cx="32" cy="18" r="3.5" fill="#ffd60a" />
                    <circle cx="32" cy="18" r="1.5" fill="#ff453a" />
                  </g>
                )}

                {outfit === 'scholar' && (
                  <g transform="translate(12, 6)">
                    <polygon points="38,4 72,16 38,26 4,16" fill="#1c1c1e" />
                    <rect x="22" y="21" width="32" height="6" fill="#000000" rx="2" />
                    <line x1="38" y1="16" x2="64" y2="28" stroke="#ffd60a" strokeWidth="1.5" />
                    <circle cx="64" cy="28" r="2.5" fill="#ffd60a" />
                  </g>
                )}

                {outfit === 'crown' && (
                  <g transform="translate(25, 6)">
                    <path d="M 0,22 L 6,8 L 18,16 L 25,4 L 32,16 L 44,8 L 50,22 Z" fill="#ffd60a" stroke="#d97706" strokeWidth="1" />
                    <circle cx="6" cy="8" r="2" fill="#ff453a" />
                    <circle cx="25" cy="4" r="2.5" fill="#0a84ff" />
                    <circle cx="44" cy="8" r="2" fill="#30d158" />
                  </g>
                )}

                {outfit === 'flower' && (
                  <g transform="translate(62, 18)">
                    <circle cx="0" cy="0" r="5" fill="#ff375f" />
                    <circle cx="6" cy="-4" r="4.5" fill="#ff6482" />
                    <circle cx="8" cy="4" r="4.5" fill="#ff6482" />
                    <circle cx="0" cy="8" r="4.5" fill="#ff6482" />
                    <circle cx="-6" cy="3" r="4.5" fill="#ff6482" />
                    <circle cx="2" cy="2" r="3" fill="#ffd60a" />
                  </g>
                )}

                {/* EYES BY MOOD */}
                {mood === 'love' ? (
                  <g>
                    <path d="M 33,52 C 30,47 24,48 24,53 C 24,58 33,64 33,64 C 33,64 42,58 42,53 C 42,48 36,47 33,52 Z" fill="#ff375f" />
                    <path d="M 67,52 C 64,47 58,48 58,53 C 58,58 67,64 67,64 C 67,64 76,58 76,53 C 76,48 70,47 67,52 Z" fill="#ff375f" />
                  </g>
                ) : mood === 'wink' ? (
                  <g>
                    <ellipse cx="36" cy="52" rx="4.5" ry="6" fill="#3E2723" />
                    <circle cx="34" cy="50" r="1.5" fill="white" />
                    <path d="M 60,54 Q 65,48 70,54" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                ) : mood === 'sad' ? (
                  <g>
                    <path d="M 32,54 Q 36,49 40,54" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 60,54 Q 64,49 68,54" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="38" cy="57" r="1.5" fill="#64d2ff" />
                  </g>
                ) : mood === 'eating' ? (
                  <g>
                    <path d="M 31,54 Q 36,48 41,54" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 59,54 Q 64,48 69,54" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                ) : (
                  <g>
                    <ellipse cx="36" cy="52" rx="4.5" ry="6.5" fill="#3E2723" />
                    <circle cx="34.5" cy="49" r="1.8" fill="white" />
                    <ellipse cx="64" cy="52" rx="4.5" ry="6.5" fill="#3E2723" />
                    <circle cx="62.5" cy="49" r="1.8" fill="white" />
                  </g>
                )}

                {/* Sunglasses Accessory */}
                {outfit === 'sunglasses' && (
                  <g transform="translate(18, 44)">
                    <path d="M 6,0 C 6,-4 26,-2 28,0 C 28,10 18,14 6,10 Z" fill="#000000" stroke="#334155" strokeWidth="1" />
                    <path d="M 36,0 C 36,-2 56,-4 58,0 C 58,10 46,14 36,10 Z" fill="#000000" stroke="#334155" strokeWidth="1" />
                    <path d="M 27,2 Q 32,0 37,2" stroke="#000000" strokeWidth="2.5" />
                    <line x1="12" y1="2" x2="20" y2="9" stroke="white" strokeWidth="1.5" opacity="0.4" />
                    <line x1="42" y1="2" x2="50" y2="9" stroke="white" strokeWidth="1.5" opacity="0.4" />
                  </g>
                )}

                {/* Round Scholar Glasses */}
                {outfit === 'scholar' && (
                  <g transform="translate(24, 44)">
                    <circle cx="12" cy="8" r="9" fill="none" stroke="#000000" strokeWidth="1.8" />
                    <circle cx="40" cy="8" r="9" fill="none" stroke="#000000" strokeWidth="1.8" />
                    <line x1="21" y1="8" x2="31" y2="8" stroke="#000000" strokeWidth="1.8" />
                  </g>
                )}

                {/* Nose */}
                <ellipse cx="50" cy="64" rx="4" ry="2.5" fill="#3E2723" opacity="0.85" />

                {/* Mouth & Expression */}
                {mood === 'eating' ? (
                  <g>
                    <ellipse cx="50" cy="74" rx="6" ry="5" fill="#78350f" />
                    <path d="M 46,73 Q 50,78 54,73" fill="#ff375f" />
                    <path d="M 52,72 Q 62,68 68,76" stroke="#ffd60a" strokeWidth="3" strokeLinecap="round" />
                  </g>
                ) : mood === 'sad' ? (
                  <path d="M 44,76 Q 50,71 56,76" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
                ) : (
                  <path d="M 40,71 Q 50,82 60,71" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
                )}
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* ================= PUKU COMPANION TAP TO CARE DASHBOARD ================= */}
      {isOpenHub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl ios-fade-in">
          
          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-[#1c1c1e] border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.85)] flex flex-col max-h-[90vh]">
            
            {/* Modal Header with Puku Status */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#ff375f] via-[#e11d48] to-[#0a84ff] p-5 text-white shrink-0">
              
              <div className="absolute right-2 top-2 opacity-15">
                <Sparkles className="w-28 h-28" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-[16px] bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shadow-inner">
                    🐒
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold tracking-tight">Tap to Care Dashboard</h3>
                      <span className="rounded-full bg-white/25 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                        Sujan & Amisha
                      </span>
                    </div>
                    <p className="text-xs text-rose-100 font-medium">
                      Your Portuguese Companion & Love Messenger
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpenHub(false)}
                  className="h-8 w-8 rounded-full bg-black/25 hover:bg-black/45 flex items-center justify-center text-white transition-colors cursor-pointer active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Puku Happiness Bar & Feed Action */}
              <div className="relative z-10 mt-4 rounded-[18px] bg-white/15 backdrop-blur-md p-3 border border-white/20 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span>Puku's Care Level</span>
                    <span>{happiness}% 🍌</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-black/30">
                    <div 
                      className="h-full bg-[#ffd60a] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,214,10,0.6)]" 
                      style={{ width: `${happiness}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={handleFeedBanana}
                  className="shrink-0 flex items-center gap-1.5 rounded-[12px] bg-[#ffd60a] hover:bg-[#ffdf40] active:scale-95 text-black px-3.5 py-2 text-xs font-bold shadow-[0_2px_8px_rgba(255,214,10,0.4)] transition-all cursor-pointer"
                >
                  <span>🍌 Feed</span>
                  <span className="opacity-70 text-[10px]">({bananasFed})</span>
                </button>
              </div>

            </div>

            {/* Apple Segmented Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-[#2c2c2e]/60 px-2 shrink-0 overflow-x-auto no-scrollbar">
              {[
                { id: 'talk', label: 'Chat', icon: <Smile className="w-3.5 h-3.5" /> },
                { id: 'love', label: 'Love Notes', icon: <Heart className="w-3.5 h-3.5" /> },
                { id: 'quiz', label: 'Mini Quiz', icon: <Trophy className="w-3.5 h-3.5" /> },
                { id: 'tips', label: 'Cheat Codes', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: 'wardrobe', label: 'Outfits', icon: <Sparkles className="w-3.5 h-3.5" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playPukuSound('pop');
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer active:scale-95 ${
                    activeTab === tab.id
                      ? 'border-[#0a84ff] text-[#0a84ff] bg-[#1c1c1e]'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Body Contents */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              
              {/* TAB 1: QUICK CHAT / TALK WITH PUKU */}
              {activeTab === 'talk' && (
                <div className="space-y-4">
                  <div className="rounded-[20px] bg-[#2c2c2e]/60 p-4 border border-white/10 flex items-start gap-3">
                    <span className="text-3xl">🐒</span>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[#0a84ff]">Puku says:</h4>
                      <p className="text-xs text-zinc-200 mt-1 italic font-medium leading-relaxed">
                        "{bubbleText}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          playPukuSound('chirp');
                          const phrase = RANDOM_PUKU_PHRASES[Math.floor(Math.random() * RANDOM_PUKU_PHRASES.length)];
                          showPukuBubble(phrase.text, phrase.mood, 4000);
                        }}
                        className="p-3 rounded-[16px] bg-[#2c2c2e]/70 text-left hover:bg-[#2c2c2e] transition-colors cursor-pointer flex items-center gap-2 border border-white/5 active:scale-95"
                      >
                        <span className="text-xl">✨</span>
                        <div>
                          <p className="text-xs font-bold text-white">Inspire Me</p>
                          <p className="text-[10px] text-zinc-400">Random quote</p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          speakPt("Olá Amisha! Força! Tu consegues aprender português muito rápido!");
                          triggerHaptic('light');
                        }}
                        className="p-3 rounded-[16px] bg-[#2c2c2e]/70 text-left hover:bg-[#2c2c2e] transition-colors cursor-pointer flex items-center gap-2 border border-white/5 active:scale-95"
                      >
                        <span className="text-xl">🔊</span>
                        <div>
                          <p className="text-xs font-bold text-white">Hear Portuguese</p>
                          <p className="text-[10px] text-zinc-400">Puku speaks PT</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SUJAN LOVE NOTES */}
              {activeTab === 'love' && (
                <div className="space-y-4">
                  <div className="rounded-[24px] bg-gradient-to-br from-[#ff375f] to-[#e11d48] p-5 text-white shadow-[0_8px_24px_rgba(255,55,95,0.35)] relative overflow-hidden border border-white/20">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-100 mb-2">
                      <span>💌 Love Note from Sujan</span>
                      <span>{loveNoteIndex + 1}/{SUJAN_LOVE_NOTES.length}</span>
                    </div>

                    <h4 className="text-base font-bold leading-snug">
                      "{currentLoveNote.pt}"
                    </h4>

                    <p className="text-xs text-rose-100 mt-2 italic">
                      "{currentLoveNote.en}"
                    </p>

                    <div className="mt-3 pt-3 border-t border-white/20 text-xs font-medium text-white/90">
                      <span className="opacity-75">🇳🇵 </span>
                      <span>{currentLoveNote.np}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => {
                          playPukuSound('love');
                          speakPt(currentLoveNote.pt);
                        }}
                        className="flex items-center gap-1.5 rounded-full bg-white text-rose-600 px-3.5 py-1.5 text-xs font-bold shadow-xs active:scale-95 transition-transform cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen PT</span>
                      </button>

                      <button
                        onClick={() => {
                          playPukuSound('pop');
                          triggerHaptic('light');
                          setLoveNoteIndex(prev => (prev + 1) % SUJAN_LOVE_NOTES.length);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-rose-100 hover:text-white transition-colors cursor-pointer active:scale-95"
                      >
                        <span>Next Letter</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MINI QUIZ CHALLENGE */}
              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400">
                      Question {quizIndex + 1} of {MINI_QUIZ_POOL.length}
                    </span>
                    <span className="text-xs font-bold text-[#ffd60a] bg-[#ffd60a]/15 px-2.5 py-0.5 rounded-full border border-[#ffd60a]/30">
                      Score: {quizScore} 🏆
                    </span>
                  </div>

                  <div className="rounded-[20px] bg-[#2c2c2e]/60 p-4 border border-white/10">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      {currentQuiz.question}
                    </h4>

                    <div className="mt-3 space-y-2">
                      {currentQuiz.options.map((option, idx) => {
                        let btnStyle = 'bg-[#1c1c1e] border-white/10 text-zinc-200 hover:bg-[#2c2c2e]';
                        
                        if (quizSubmitted) {
                          if (idx === currentQuiz.correctIndex) {
                            btnStyle = 'bg-[#30d158] text-white border-[#30d158] shadow-[0_0_12px_rgba(48,209,88,0.4)]';
                          } else if (selectedAnswer === idx) {
                            btnStyle = 'bg-[#ff453a] text-white border-[#ff453a]';
                          }
                        } else if (selectedAnswer === idx) {
                          btnStyle = 'bg-[#0a84ff] text-white border-[#0a84ff] shadow-[0_0_12px_rgba(10,132,255,0.4)]';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectQuizOption(idx)}
                            className={`w-full p-3 rounded-[14px] border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between active:scale-95 ${btnStyle}`}
                          >
                            <span>{option}</span>
                            {quizSubmitted && idx === currentQuiz.correctIndex && <span>✅</span>}
                            {quizSubmitted && selectedAnswer === idx && idx !== currentQuiz.correctIndex && <span>❌</span>}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="mt-3 p-3 rounded-[14px] bg-[#0a84ff]/15 text-[#64d2ff] text-xs font-medium border border-[#0a84ff]/30">
                        <p>💡 {currentQuiz.explanation}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={selectedAnswer === null}
                        className="w-full py-3 rounded-[16px] bg-[#0a84ff] hover:bg-[#007aff] disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-[0_4px_14px_rgba(10,132,255,0.4)] active:scale-95"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuiz}
                        className="w-full py-3 rounded-[16px] bg-[#0a84ff] hover:bg-[#007aff] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_4px_14px_rgba(10,132,255,0.4)] active:scale-95"
                      >
                        Next Question ➔
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: LISBON CHEAT CODES */}
              {activeTab === 'tips' && (
                <div className="space-y-4">
                  <div className="rounded-[20px] bg-[#0a84ff]/10 p-4 border border-[#0a84ff]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#0a84ff]">
                        🇵🇹 Secret Tip #{tipIndex + 1}
                      </span>
                      <button
                        onClick={() => {
                          playPukuSound('pop');
                          setTipIndex(prev => (prev + 1) % LISBON_CHEAT_CODES.length);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-[#0a84ff] hover:underline cursor-pointer active:scale-95"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Cycle</span>
                      </button>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {currentTip.title}
                    </h4>

                    <div className="p-2.5 rounded-[12px] bg-black/40 font-mono text-xs text-[#64d2ff] font-semibold border border-white/5">
                      {currentTip.pt}
                    </div>

                    <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                      {currentTip.tip}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: PUKU OUTFIT SWITCHER */}
              {activeTab === 'wardrobe' && (
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Choose Puku's Style
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'lisbon_cap', name: 'Lisbon Conductor', icon: '🇵🇹' },
                      { id: 'scholar', name: 'Coimbra Scholar', icon: '🎓' },
                      { id: 'sunglasses', name: 'Algarve Shades', icon: '🕶️' },
                      { id: 'crown', name: 'Queen Amisha', icon: '👑' },
                      { id: 'flower', name: 'Nepal Rhododendron', icon: '🌸' },
                      { id: 'classic', name: 'Natural Puntey', icon: '🐒' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          playPukuSound('pop');
                          triggerHaptic('light');
                          setOutfit(item.id as PukuOutfit);
                          showPukuBubble(`Look at my ${item.name} outfit! ✨`, 'happy', 2500);
                        }}
                        className={`p-3 rounded-[16px] border text-left flex items-center gap-2.5 transition-all cursor-pointer active:scale-95 ${
                          outfit === item.id 
                            ? 'bg-[#0a84ff]/20 border-[#0a84ff] shadow-[0_0_12px_rgba(10,132,255,0.3)]' 
                            : 'bg-[#2c2c2e]/60 border-white/5 hover:bg-[#2c2c2e]'
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{item.name}</p>
                          <p className="text-[10px] text-zinc-400">{outfit === item.id ? 'Equipped' : 'Tap to wear'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-[#141416] flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1 font-medium">
                <span>❤️</span> Made for Amisha by Sujan
              </span>
              <button
                onClick={() => setIsOpenHub(false)}
                className="px-4 py-2 rounded-[12px] bg-white text-black font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Close Hub
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
