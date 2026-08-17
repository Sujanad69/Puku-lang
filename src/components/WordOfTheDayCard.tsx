import React, { useState } from 'react';
import { WORDS_OF_THE_DAY } from '../data/portugueseData';
import { speakPt } from '../utils/audio';

export const WordOfTheDayCard: React.FC = () => {
  const [index] = useState(0);
  const wotd = WORDS_OF_THE_DAY[index];

  const handleSpeak = () => {
    speakPt(wotd.pt);
  };

  return (
    <div className="wotd-card relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] p-6 text-white shadow-[0_12px_30px_rgba(88,204,2,0.3)] flex justify-between items-center mb-6">
      {/* Lisbon Bridge SVG Background */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-[75%] w-full opacity-15 z-[1]"
        viewBox="0 0 200 80"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
      >
        <rect x="45" y="10" width="6" height="70" fill="rgba(255,255,255,0.25)" />
        <rect x="145" y="10" width="6" height="70" fill="rgba(255,255,255,0.25)" />
        <path d="M45 30 L51 25 M45 40 L51 35 M45 50 L51 45" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <path d="M145 30 L151 25 M145 40 L151 35 M145 50 L151 45" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <path d="M-20 0 Q 48 65 100 65 Q 152 65 220 0" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
        <path d="M48 10 L48 60 M55 25 L55 60 M65 40 L65 60 M75 52 L75 60 M85 60 L85 60 M148 10 L148 60 M141 25 L141 60 M131 40 L131 60 M121 52 L121 60" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <rect x="0" y="60" width="200" height="4" fill="rgba(255,255,255,0.4)" />
      </svg>

      {/* Animated Cloud */}
      <svg
        className="wotd-cloud-anim pointer-events-none absolute top-[15px] h-[60px] w-[60px] opacity-20 z-[1]"
        viewBox="0 0 24 24"
        fill="#ffffff"
      >
        <path d="M17.5 19c-2.5 0-4.5-2-4.5-4.5 0-.4.1-.8.2-1.2C12.7 12.5 11.9 12 11 12c-1.7 0-3 1.3-3 3 0 .4.1.8.2 1.2-1.9.4-3.2 2-3.2 4.3 0 2.5 2 4.5 4.5 4.5h8c2.5 0 4.5-2 4.5-4.5S20 19 17.5 19z" />
      </svg>

      <div className="relative z-[5]">
        <div className="text-[0.75rem] font-semibold uppercase tracking-[1px] text-white/90 mb-1">
          Word of the Day
        </div>
        <div className="text-[1.6rem] font-bold text-white leading-[1.1]">
          {wotd.pt}
        </div>
        <div className="text-[0.95rem] font-semibold text-white/90 mt-1">
          "{wotd.en}"
        </div>
      </div>

      <button
        onClick={handleSpeak}
        className="relative z-[5] flex h-[54px] w-[54px] min-w-[54px] items-center justify-center rounded-full bg-white text-[#1d4ed8] shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform active:scale-90 cursor-pointer"
        title="Listen to European Portuguese Pronunciation"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
      </button>
    </div>
  );
};
