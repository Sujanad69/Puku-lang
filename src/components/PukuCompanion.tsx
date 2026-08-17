import React, { useState, useEffect, useCallback } from 'react';

// For event-based reactions (Correct, Wrong, Perfect, Complete)
const EVENT_MESSAGES = {
  correct: [
    "Good job! 🌟",
    "So smart! 😍",
    "That's my girl! ❤️",
    "Correct! Euta kiss! 😘"
  ],
  wrong: [
    "Oops! Try again! 💕",
    "It's okay, next one! 🐒",
    "Ahhh almost! 😅",
    "Don't guess! 👀"
  ],
  perfect: [
    "PERFECT SCORE! 🎓💋",
    "Flawless victory! 🏆",
    "My genius girl! 😎"
  ],
  complete: [
    "Lesson complete! 🎉",
    "So proud of you! 💖",
    "Done for today! ✨"
  ]
};

// Generative grammar parts to create 1000+ unique short messages
const NAMES = ["Amisha", "Puntey", "meri Maya", "bucha", "my love"];
const EMOJIS = ["❤️", "😘", "🐒", "✨", "💕", "💋", "🥰", "🙊", "💖", "👀", "🌸", "🍌", "😂", "😉", "💪"];
const TEMPLATES = [
  "Sujan misses {name}.",
  "Focus, {name}!",
  "Smile, {name}!",
  "Puku loves {name}.",
  "You got this, {name}.",
  "Alchi lagyo, {name}?",
  "Don't guess, {name}!",
  "Study hard, {name}.",
  "{name} = perfect.",
  "Sujan + {name} forever.",
  "Euta kiss for {name}.",
  "Miss you, {name}.",
  "Proud of {name}.",
  "Learn faster, {name}!",
  "{name}, stop staring at me.",
  "Oye {name}, pay attention!",
  "Sujan sent a hug for {name}.",
  "You're beautiful, {name}.",
  "Puku believes in {name}.",
  "{name}'s smile is the best.",
  "Speak louder, {name}!",
  "Almost perfect, {name}.",
  "Sujan is proud of {name}.",
  "Keep the streak, {name}.",
  "Puku needs a banana, {name}.",
  "Good job so far, {name}.",
  "{name} is my favorite.",
  "Don't give up, {name}!",
  "Te amo, {name}.",
  "Bom dia, {name}!",
  "Saudade of {name}.",
  "Beijo for {name}.",
  "You're doing amazing, {name}.",
  "Sujan's {name} is the best.",
  "{name}, tap the correct answer.",
  "I'm watching you, {name}.",
  "Puntey power! Go {name}!",
  "I love your focus, {name}.",
  "{name} looks pretty today.",
  "Kasto ramri dekhiyeki, {name}.",
  "Keep learning, {name}.",
  "My clever {name}.",
  "Sujan's heart belongs to {name}.",
  "Finish the lesson, {name}.",
  "You're so cute, {name}.",
  "Puku is cheering for {name}.",
  "You're a star, {name}.",
  "Aja kasto smart, {name}!",
  "Chito gara, {name}!",
  "Sujan is waiting, {name}."
];

type Expression = 'normal' | 'wink' | 'cool' | 'sad';

export const PukuCompanion: React.FC = () => {
  const [message, setMessage] = useState("Tap me! 🐒");
  const [showBubble, setShowBubble] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [expression, setExpression] = useState<Expression>('normal');

  const showSpecificMessage = useCallback((text: string, expr: Expression, duration = 3000) => {
    setIsTyping(true);
    setShowBubble(true);
    
    setTimeout(() => {
      setMessage(text);
      setExpression(expr);
      setIsTyping(false);
      
      setTimeout(() => {
        setShowBubble(false);
        setTimeout(() => setExpression('normal'), 500); // Revert expression after bubble hides
      }, duration);
    }, 600); // Faster typing speed for short messages
  }, []);

  const triggerRandomMessage = useCallback(() => {
    if (showBubble || isTyping) return;
    
    // Generate a unique random message (Templates * Names * Emojis = 50 * 5 * 15 = 3750 unique combinations!)
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    
    const finalMessage = template.replace("{name}", name) + " " + emoji;
    
    // Pick expression based on emoji/content
    let expr: Expression = 'normal';
    if (["😉", "😘"].includes(emoji)) expr = 'wink';
    if (["😎", "💪"].includes(emoji)) expr = 'cool';
    if (["👀", "🙊"].includes(emoji)) expr = 'wink';
    
    showSpecificMessage(finalMessage, expr, 3500);
  }, [showBubble, isTyping, showSpecificMessage]);

  useEffect(() => {
    // Event listeners
    const handleCorrect = () => {
      if (Math.random() > 0.4) {
         const txt = EVENT_MESSAGES.correct[Math.floor(Math.random() * EVENT_MESSAGES.correct.length)];
         showSpecificMessage(txt, 'wink', 2500);
      }
    };
    const handleWrong = () => {
      if (Math.random() > 0.4) {
         const txt = EVENT_MESSAGES.wrong[Math.floor(Math.random() * EVENT_MESSAGES.wrong.length)];
         showSpecificMessage(txt, 'sad', 2500);
      }
    };
    const handleComplete = (e: any) => {
      const isPerfect = e.detail?.isPerfect;
      const arr = isPerfect ? EVENT_MESSAGES.perfect : EVENT_MESSAGES.complete;
      const txt = arr[Math.floor(Math.random() * arr.length)];
      showSpecificMessage(txt, 'cool', 4000); 
    };

    window.addEventListener('puku:correct_answer', handleCorrect);
    window.addEventListener('puku:wrong_answer', handleWrong);
    window.addEventListener('puku:lesson_complete', handleComplete);

    // Initial greeting ONLY (No more setInterval for random popups)
    const initialTimer = setTimeout(() => {
      showSpecificMessage("Hi Puntey! Tap me! 🐒", 'normal', 3000);
    }, 1500);

    return () => {
      window.removeEventListener('puku:correct_answer', handleCorrect);
      window.removeEventListener('puku:wrong_answer', handleWrong);
      window.removeEventListener('puku:lesson_complete', handleComplete);
      clearTimeout(initialTimer);
    };
  }, [showSpecificMessage]);

  return (
    <div className="fixed bottom-24 right-4 z-[9999] flex flex-col items-end">
      <style>{`
        @keyframes puku-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-puku-float {
          animation: puku-float 3.5s ease-in-out infinite;
        }
        @keyframes puku-svg-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-puku-blink {
          animation: puku-svg-blink 4s infinite;
          transform-origin: 50% 50%;
        }
        @keyframes puku-wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-25deg); }
          75% { transform: rotate(25deg); }
        }
        .animate-puku-wave {
          animation: puku-wave 1.2s ease-in-out infinite;
          transform-origin: bottom right;
        }
      `}</style>

      {/* Chat Bubble - Adjusted for very short messages */}
      <div 
        className={`absolute bottom-[65px] right-2 bg-white px-4 py-2.5 rounded-2xl rounded-br-sm shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-rose-100 min-w-[120px] max-w-[220px] transform transition-all duration-300 origin-bottom-right ${
          showBubble ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        {isTyping ? (
          <div className="flex items-center justify-center gap-1.5 h-5">
            <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <p className="text-[0.9rem] font-medium text-slate-800 leading-tight text-center">{message}</p>
        )}
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-rose-100 transform rotate-45 shadow-[2px_2px_8px_rgba(0,0,0,0.03)]"></div>
      </div>

      {/* SVG Emoji Avatar */}
      <div 
        onClick={triggerRandomMessage}
        className="relative cursor-pointer group animate-puku-float"
      >
        {/* Hover Glow */}
        <div className="absolute inset-2 bg-rose-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-0"></div>
        
        {/* The Waving Paw */}
        <div className={`absolute top-[25px] -left-[10px] ${showBubble && !isTyping ? 'animate-puku-wave opacity-100' : 'opacity-0'} transition-opacity duration-300 z-20`}>
          <svg width="24" height="24" viewBox="0 0 32 32" className="drop-shadow-md">
            <circle cx="16" cy="16" r="12" fill="#8B5A2B" />
            <circle cx="16" cy="16" r="6" fill="#F5CBA7" />
          </svg>
        </div>

        {/* The Monkey Emoji SVG */}
        <svg width="56" height="56" viewBox="0 0 100 100" className="drop-shadow-xl z-10 relative group-hover:scale-105 active:scale-95 transition-transform duration-200">
          {/* Ears */}
          <circle cx="15" cy="45" r="16" fill="#8B5A2B" />
          <circle cx="15" cy="45" r="8" fill="#F5CBA7" />
          <circle cx="85" cy="45" r="16" fill="#8B5A2B" />
          <circle cx="85" cy="45" r="8" fill="#F5CBA7" />
          
          {/* Head */}
          <circle cx="50" cy="50" r="42" fill="#8B5A2B" />
          
          {/* Heart-shaped Face Mask */}
          <path d="M 18,50 C 18,20 48,20 50,40 C 52,20 82,20 82,50 C 82,82 72,90 50,90 C 28,90 18,82 18,50 Z" fill="#F5CBA7" />
          
          {/* Blushing Cheeks */}
          {expression !== 'cool' && (
            <>
              <ellipse cx="30" cy="62" rx="6" ry="4" fill="#FFB6C1" opacity="0.8" />
              <ellipse cx="70" cy="62" rx="6" ry="4" fill="#FFB6C1" opacity="0.8" />
            </>
          )}

          {/* Eyes based on expression */}
          {expression === 'normal' && (
            <g className="animate-puku-blink">
              <ellipse cx="36" cy="52" rx="4.5" ry="6.5" fill="#3E2723" />
              <circle cx="35" cy="49" r="1.5" fill="white" />
              <ellipse cx="64" cy="52" rx="4.5" ry="6.5" fill="#3E2723" />
              <circle cx="63" cy="49" r="1.5" fill="white" />
            </g>
          )}

          {expression === 'sad' && (
            <g>
              {/* Sad eyes - arched lines */}
              <path d="M 32,53 Q 36,49 40,53" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 60,53 Q 64,49 68,53" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="38" cy="56" r="1.5" fill="#81D4FA" /> {/* little tear */}
            </g>
          )}

          {expression === 'wink' && (
            <g>
              {/* Left eye blinking normally */}
              <g className="animate-puku-blink">
                <ellipse cx="36" cy="52" rx="4.5" ry="6.5" fill="#3E2723" />
                <circle cx="35" cy="49" r="1.5" fill="white" />
              </g>
              {/* Right eye winking */}
              <path d="M 60,53 Q 64,49 68,53" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {expression === 'cool' && (
            <g>
              {/* Black Ray-Ban Sunglasses */}
              <path d="M 23,46 C 23,41 45,43 47,46 C 47,56 35,60 23,55 Z" fill="#111" stroke="#333" strokeWidth="1" />
              <path d="M 53,46 C 53,43 77,41 77,46 C 77,55 65,60 53,56 Z" fill="#111" stroke="#333" strokeWidth="1" />
              <path d="M 45,46 Q 50,44 55,46" fill="none" stroke="#111" strokeWidth="3" />
              <path d="M 24,46 L 15,44" fill="none" stroke="#111" strokeWidth="3" />
              <path d="M 76,46 L 85,44" fill="none" stroke="#111" strokeWidth="3" />
              <path d="M 28,47 L 35,54" fill="none" stroke="white" strokeWidth="2" opacity="0.25" />
              <path d="M 58,47 L 65,54" fill="none" stroke="white" strokeWidth="2" opacity="0.25" />
            </g>
          )}

          {/* Nose */}
          <ellipse cx="50" cy="65" rx="4" ry="2.5" fill="#3E2723" opacity="0.9" />
          
          {/* Smile */}
          {expression === 'sad' ? (
            <path d="M 45,74 Q 50,71 55,74" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M 40,73 Q 50,83 60,73" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
          )}
        </svg>
      </div>
    </div>
  );
};
