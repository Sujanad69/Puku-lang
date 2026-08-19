import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';
import { playTone } from '../utils/audio';
import { ChevronRightIcon } from './icons/AppleIcons';
import { Heart } from 'lucide-react';
import { FlagNepal } from './icons/PremiumIcons';

interface LoveLanguageCardProps {
  onOpenLoveUnit: () => void;
}

const LOVE_SNIPPETS = [
  { pt: "Amo-te com todo o meu coração", en: "I love you with all my heart", np: "म तिमीलाई हृदयदेखि नै माया गर्छु" },
  { pt: "Tenho tantas saudades tuas", en: "I miss you so much", np: "मलाई तिम्रो धेरै याद आउँछ" },
  { pt: "És o amor da minha vida", en: "You are the love of my life", np: "तिमी मेरो जीवनको माया हौ" },
  { pt: "Mal posso esperar por te ver", en: "I can't wait to see you", np: "तिमीलाई भेट्न आतुर छु" },
  { pt: "Beijinhos doces para ti", en: "Sweet kisses for you", np: "तिमीलाई मीठो चुम्बनहरू" },
];

export const LoveLanguageCard: React.FC<LoveLanguageCardProps> = ({ onOpenLoveUnit }) => {
  const [snippetIndex, setSnippetIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSnippetIndex(prev => (prev + 1) % LOVE_SNIPPETS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const snippet = LOVE_SNIPPETS[snippetIndex];

  const handleClick = () => {
    playTone(620, 'sine', 0.05);
    triggerHaptic('light');
    onOpenLoveUnit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 280, delay: 0.1 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="group relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#ff375f] via-[#e11d48] to-[#99002b] p-5 sm:p-6 text-white shadow-[0_12px_32px_rgba(255,55,95,0.25)] border border-white/20 flex flex-col justify-between min-h-[170px] cursor-pointer transition-all active:scale-[0.98]"
    >
      {/* Floating Animated Romantic SVGs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg 
          className="ldr-heart-anim absolute left-[12%] -bottom-4 h-8 w-8 fill-white/20 text-transparent" 
          style={{ animationDelay: '0s', animationDuration: '3.5s' }}
          viewBox="0 0 24 24"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>

        <svg 
          className="ldr-heart-anim absolute left-[45%] -bottom-4 h-6 w-6 fill-white/15 text-transparent" 
          style={{ animationDelay: '1.2s', animationDuration: '4s' }}
          viewBox="0 0 24 24"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>

        <svg 
          className="ldr-heart-anim absolute right-[18%] -bottom-4 h-9 w-9 fill-white/20 text-transparent" 
          style={{ animationDelay: '2s', animationDuration: '3.8s' }}
          viewBox="0 0 24 24"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      </div>

      {/* Card Content */}
      <div className="relative z-10 space-y-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold tracking-wide uppercase text-white backdrop-blur-md border border-white/20">
            <Heart className="w-3 h-3 fill-white text-white" />
            <span>Messages for Sujan</span>
          </div>

          <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-black/25 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10">
            Love Unit
          </span>
        </div>

        <div className="pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={snippet.pt}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                "{snippet.pt}"
              </h3>
              <p className="text-xs font-semibold text-rose-100 italic pt-0.5 flex items-center gap-1">
                <FlagNepal size={12} />
                <span>{snippet.np}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pt-3 flex items-center justify-between border-t border-white/20 text-xs">
        <span className="text-[11px] text-rose-100 font-medium truncate max-w-[65%]">
          "{snippet.en}"
        </span>

        <div className="flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-0.5 transition-transform shrink-0">
          <span>Explore phrases</span>
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
};
