import React from 'react';

interface LoveLanguageCardProps {
  onOpenLoveUnit: () => void;
}

export const LoveLanguageCard: React.FC<LoveLanguageCardProps> = ({ onOpenLoveUnit }) => {
  return (
    <div
      onClick={onOpenLoveUnit}
      className="ldr-card relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#ff2a85] to-[#ff4b2b] px-6 py-[22px] text-white shadow-[0_12px_30px_rgba(255,42,133,0.3)] flex justify-between items-center mb-6 cursor-pointer transition-transform active:scale-95"
    >
      {/* Floating Animated Hearts */}
      <svg className="ldr-heart-anim absolute left-[10%] -bottom-5 h-10 w-10 fill-white/10 text-transparent pointer-events-none z-[1]" viewBox="0 0 24 24" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      <svg className="ldr-heart-anim absolute left-[10%] -bottom-5 h-10 w-10 fill-white/10 text-transparent pointer-events-none z-[1]" viewBox="0 0 24 24" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      <svg className="ldr-heart-anim absolute left-[10%] -bottom-5 h-10 w-10 fill-white/10 text-transparent pointer-events-none z-[1]" viewBox="0 0 24 24" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>

      <div className="relative z-[5]">
        <div className="text-[0.75rem] font-extrabold uppercase tracking-[1px] text-white/90 mb-1">
          Daily Love Language
        </div>
        <div className="text-[1.3rem] font-black text-white leading-[1.1] mb-1">
          Messages for Sujan
        </div>
        <div className="text-[0.85rem] font-semibold text-white flex items-center gap-1.5 mt-1">
          Learn what to text him
        </div>
      </div>

      <div className="relative z-[5] flex h-[44px] w-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
  );
};
