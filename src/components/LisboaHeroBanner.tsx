import React, { useState, useMemo, useEffect } from 'react';
import { UserProgress } from '../types';
import { WORDS_OF_THE_DAY } from '../data/portugueseData';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { Flame, Volume2, Sun, Clock, Sparkles, BookOpen } from 'lucide-react';
import { FlagNepal } from './icons/PremiumIcons';

interface LisboaHeroBannerProps {
  progress: UserProgress;
  lang: 'pt' | 'en';
  onContinueNextLesson?: (unitId: string) => void;
  onOpenQuests?: () => void;
}

export const LisboaHeroBanner: React.FC<LisboaHeroBannerProps> = ({
  progress,
  lang,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const { todayWord, dateString } = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const index = Math.abs(dayOfYear) % WORDS_OF_THE_DAY.length;

    const formattedDate = now.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    return {
      todayWord: WORDS_OF_THE_DAY[index] || WORDS_OF_THE_DAY[0],
      dateString: formattedDate
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return lang === 'pt' ? 'Bom dia' : 'Good morning';
    if (hour < 18) return lang === 'pt' ? 'Boa tarde' : 'Good afternoon';
    return lang === 'pt' ? 'Boa noite' : 'Good evening';
  };

  const handleSpeakWord = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playTone(550, 'sine', 0.04);
    triggerHaptic('light');
    setIsPlayingAudio(true);
    speakPt(todayWord.pt);
    setTimeout(() => setIsPlayingAudio(false), 2000);
  };

  // Calculate daily goal percentage
  const dailyGoalXP = progress.dailyGoalXP || 50;
  const progressPercent = Math.min(100, Math.round((progress.todayXP / dailyGoalXP) * 100));
  const strokeDasharray = 100.5; // 2 * pi * r (r=16)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progressPercent) / 100;

  return (
    <section 
      onClick={handleSpeakWord}
      className="relative overflow-hidden rounded-[32px] text-white shadow-[0_14px_40px_-10px_rgba(0,122,255,0.4)] cursor-pointer transition-transform active:scale-[0.98] group p-6 sm:p-8"
      style={{
        background: 'linear-gradient(135deg, #071329 0%, #034078 35%, #0284c7 65%, #0d9488 85%, #007AFF 100%)',
        backgroundSize: '250% 250%',
        animation: 'oceanGradient 16s ease infinite'
      }}
    >
      <style>
        {`
          @keyframes oceanGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes ptAura1 {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            33% { transform: translate(25%, -15%) scale(1.15) rotate(90deg); }
            66% { transform: translate(-15%, 20%) scale(0.9) rotate(180deg); }
            100% { transform: translate(0, 0) scale(1) rotate(360deg); }
          }
          @keyframes ptAura2 {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            50% { transform: translate(-25%, 25%) scale(1.05) rotate(-90deg); }
            100% { transform: translate(0, 0) scale(1) rotate(-180deg); }
          }
          @keyframes ptAuraGold {
            0% { transform: translate(-10%, 10%) scale(0.9); opacity: 0.25; }
            50% { transform: translate(20%, -20%) scale(1.2); opacity: 0.45; }
            100% { transform: translate(-10%, 10%) scale(0.9); opacity: 0.25; }
          }
          @keyframes driveRight {
            from { transform: translateX(-200px); }
            to { transform: translateX(1200px); }
          }
          @keyframes driveLeft {
            from { transform: translateX(1200px); }
            to { transform: translateX(-300px); }
          }
          @keyframes lisbonSeagulls {
            0% { transform: translate(-100px, 20px) scale(0.7); opacity: 0; }
            15% { opacity: 0.8; }
            85% { opacity: 0.8; }
            100% { transform: translate(1100px, -40px) scale(0.9); opacity: 0; }
          }
          @keyframes waveRipple {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-25px); }
          }
        `}
      </style>

      {/* ================= iOS PORTUGAL FLUID AURA BACKGROUND ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-70">
         {/* Deep Ocean Blue Aura */}
         <div className="absolute top-[-25%] left-[-15%] w-[85%] h-[85%] bg-[#0055ff] rounded-full blur-[80px] animate-[ptAura1_15s_ease-in-out_infinite]" />
         {/* Portuguese Emerald & Cyan Aura */}
         <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-[#00b4d8] rounded-full blur-[75px] animate-[ptAura2_18s_ease-in-out_infinite]" />
         {/* Warm Portuguese Gold Aura (Sunset over Tagus River) */}
         <div className="absolute top-[10%] right-[20%] w-[50%] h-[50%] bg-[#f59e0b] rounded-full blur-[90px] animate-[ptAuraGold_12s_ease-in-out_infinite]" />
      </div>

      {/* ================= LISBON HISTORIC ARCHITECTURE & 25 DE ABRIL DOUBLE DECK BRIDGE ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.28] mix-blend-overlay">
        <svg className="absolute bottom-[-2%] w-full h-[200px]" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMax slice">
          
          {/* Lisbon Historic Skyline / Belém Tower & Castle Hill Silhouettes */}
          <g fill="white" opacity="0.35">
            {/* Belém Tower Silhouette (Left bank) */}
            <path d="M 40 140 L 40 105 L 45 105 L 45 95 L 55 95 L 55 80 L 70 80 L 70 95 L 80 95 L 80 105 L 85 105 L 85 140 Z" />
            <path d="M 58 75 L 67 75 L 67 80 L 58 80 Z" />
            <circle cx="62" cy="73" r="2.5" />
            {/* Jerónimos Arches & Lisbon Dome */}
            <path d="M 95 140 L 95 115 Q 110 95 125 115 L 125 140 Z" />
            <path d="M 130 140 L 130 110 Q 145 85 160 110 L 160 140 Z" />
            {/* Alfama Hillside houses & Santa Justa spire */}
            <path d="M 820 140 L 820 100 L 835 85 L 850 100 L 850 140 Z" />
            <path d="M 855 140 L 855 70 L 860 65 L 865 70 L 865 140 Z" />
            <path d="M 870 140 L 870 90 L 890 90 L 910 110 L 910 140 Z" />
            <path d="M 915 140 L 915 80 L 935 80 L 950 100 L 950 140 Z" />
          </g>

          {/* Soaring Seagulls over Tagus River */}
          <g className="animate-[lisbonSeagulls_24s_linear_infinite]">
            <path d="M 0 35 Q 10 25 20 35 Q 30 25 40 35" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
            <path d="M 50 48 Q 58 40 66 48 Q 74 40 82 48" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
          </g>
          <g className="animate-[lisbonSeagulls_32s_linear_infinite]" style={{ animationDelay: '-14s' }}>
            <path d="M 0 25 Q 12 12 24 25 Q 36 12 48 25" fill="none" stroke="white" strokeWidth="2" opacity="0.75" />
          </g>

          {/* Tagus River Ripples */}
          <g fill="none" stroke="white" strokeWidth="1" opacity="0.25" className="animate-[waveRipple_6s_ease-in-out_infinite]">
            <path d="M 0 155 Q 100 150 200 155 T 400 155 T 600 155 T 800 155 T 1000 155" />
            <path d="M 0 170 Q 120 165 240 170 T 480 170 T 720 170 T 960 170" strokeWidth="1.5" opacity="0.3" />
          </g>

          {/* 25 DE ABRIL DOUBLE DECK BRIDGE */}
          {/* Main Suspension Cables */}
          <path d="M -100 0 Q 250 120 500 0 T 1100 0" fill="none" stroke="white" strokeWidth="3" opacity="0.75"/>
          
          {/* Vertical Suspenders */}
          <g stroke="white" strokeWidth="1.2" opacity="0.4">
            {Array.from({ length: 22 }).map((_, i) => (
              <line key={i} x1={i * 46} y1={Math.pow((i*46 - 500)/250, 2) * 30} x2={i * 46} y2="120" />
            ))}
          </g>

          {/* Main Bridge Tower */}
          <rect x="475" y="-20" width="50" height="170" fill="none" stroke="white" strokeWidth="3.5" opacity="0.9"/>
          {/* Tower X-bracing */}
          <path d="M 475 10 L 525 40 M 525 10 L 475 40 M 475 50 L 525 80 M 525 50 L 475 80 M 475 90 L 525 120 M 525 90 L 475 120" stroke="white" strokeWidth="2" opacity="0.65"/>

          {/* Top Deck (Highway) */}
          <line x1="0" y1="120" x2="1000" y2="120" stroke="white" strokeWidth="4.5" opacity="0.95"/>
          
          {/* Bottom Deck (Railway) */}
          <line x1="0" y1="136" x2="1000" y2="136" stroke="white" strokeWidth="2.5" opacity="0.8"/>
          
          {/* Deck Truss / Diamond Lattice */}
          <path d={Array.from({length: 100}).map((_,i) => `M ${i*10} 120 L ${i*10 + 5} 136 L ${i*10 + 10} 120`).join(' ')} stroke="white" strokeWidth="0.8" fill="none" opacity="0.5"/>

          {/* ================= HIGHWAY TRAFFIC (Top Deck - Running Cars) ================= */}
          <g className="animate-[driveRight_12s_linear_infinite]">
            <rect x="0" y="114" width="16" height="5" rx="2" fill="white" opacity="0.95"/>
            <rect x="45" y="113" width="18" height="6" rx="2" fill="white" opacity="0.8"/>
            <rect x="95" y="112" width="20" height="7" rx="2" fill="white" opacity="0.85"/>
          </g>
          <g className="animate-[driveRight_19s_linear_infinite]" style={{ animationDelay: '-6s' }}>
            <rect x="0" y="110" width="32" height="9" rx="2" fill="white" opacity="0.85"/>
            <rect x="70" y="114" width="15" height="5" rx="2" fill="white" opacity="0.9"/>
          </g>
          <g className="animate-[driveRight_8s_linear_infinite]" style={{ animationDelay: '-3s' }}>
             <rect x="0" y="114" width="16" height="5" rx="2" fill="white" opacity="1"/>
          </g>

          {/* ================= RAILWAY TRAFFIC (Bottom Deck - Looping Trains) ================= */}
          <g className="animate-[driveLeft_16s_linear_infinite]">
            <rect x="0" y="124" width="180" height="10" rx="2" fill="white" opacity="0.95"/>
            {/* Red & Green Portugal Train Striping */}
            <rect x="0" y="127" width="180" height="2" fill="#034078" opacity="0.6"/>
            {/* Train Windows */}
            {Array.from({ length: 11 }).map((_, i) => (
              <rect key={`w1-${i}`} x={8 + i * 15} y="125" width="9" height="4" rx="0.5" fill="#0A192F" opacity="0.85"/>
            ))}
          </g>
          
          <g className="animate-[driveLeft_22s_linear_infinite]" style={{ animationDelay: '-11s' }}>
            <rect x="0" y="124" width="240" height="10" rx="2" fill="white" opacity="0.9"/>
            {/* Train Windows */}
            {Array.from({ length: 15 }).map((_, i) => (
              <rect key={`w2-${i}`} x={8 + i * 15} y="125" width="9" height="4" rx="0.5" fill="#0A192F" opacity="0.85"/>
            ))}
          </g>

        </svg>
      </div>

      {/* Internal Glossy Overlay */}
      <div className="absolute inset-0 rounded-[32px] border border-white/20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* ================= FOREGROUND CONTENT ================= */}

      {/* Top Glass Pill: Date, Weather, Time, Streak */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-full shadow-lg">
          <div className="flex items-center gap-1.5 opacity-90">
            <Sun className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold tracking-wide">22°</span>
          </div>
          <div className="w-px h-3 bg-white/30" />
          <div className="flex items-center gap-1.5 opacity-90">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold tracking-wide">{currentTime || '...'}</span>
          </div>
          <div className="w-px h-3 bg-white/30" />
          <div className="flex items-center gap-1 text-rose-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="text-[11px] font-black tracking-wide">{progress.streak}</span>
          </div>
        </div>

        {/* Date Text */}
        <div className="text-right">
          <p className="text-[10px] font-bold opacity-90 tracking-wide uppercase">
            {dateString}
          </p>
        </div>
      </div>

      {/* Greeting */}
      <div className="relative z-10 mb-6">
        <h1 className="text-3xl sm:text-4xl font-normal tracking-tight mb-1 opacity-95">
          {getGreeting()}, <span className="font-bold">Amisha.</span>
        </h1>
        <p className="text-[13px] font-medium opacity-80 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {lang === 'pt' ? 'Continue sua jornada.' : 'Continue your journey.'}
        </p>
      </div>

      {/* Dictionary-Style Word of the Day Card */}
      <div className="relative z-10 flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 shadow-xl transition-colors hover:bg-white/15">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <BookOpen className="w-3 h-3 text-blue-100 opacity-80" />
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-blue-100 opacity-90">
              {lang === 'pt' ? 'Palavra do Dia' : 'Word of the Day'}
            </span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm truncate">
              {todayWord.pt}
            </h2>
            <span className="text-[13px] font-medium text-white/70 italic">
              /{todayWord.phonetic}/
            </span>
          </div>
          
          <p className="text-[13px] sm:text-sm font-medium text-white/90 truncate flex items-center flex-wrap gap-1">
            <span>{todayWord.en}</span>
            {todayWord.nepali && (
              <span className="text-white/70 ml-1 text-xs inline-flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded">
                <FlagNepal size={12} />
                <span>{todayWord.nepali}</span>
              </span>
            )}
          </p>
        </div>
        
        {/* Play Audio Button with Mini XP Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          {/* SVG Progress Ring */}
          <svg className="absolute w-[52px] h-[52px] -rotate-90 pointer-events-none drop-shadow-sm">
            <circle 
              cx="26" cy="26" r="16" 
              fill="none" 
              stroke="rgba(255,255,255,0.15)" 
              strokeWidth="2.5" 
            />
            <circle 
              cx="26" cy="26" r="16" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Interactive Play Button */}
          <button
            className={`relative z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-sm transition-all hover:bg-white/30 active:scale-90 ${isPlayingAudio ? 'scale-90 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''}`}
            title="Ouça a pronúncia (Hear pronunciation)"
          >
            {isPlayingAudio ? (
              <div className="flex gap-[2px] items-end h-3">
                <span className="w-[3px] bg-white rounded-t-sm h-full animate-[audioWave1_0.5s_ease-in-out_infinite_alternate]" />
                <span className="w-[3px] bg-white rounded-t-sm h-1/2 animate-[audioWave2_0.4s_ease-in-out_infinite_alternate]" />
                <span className="w-[3px] bg-white rounded-t-sm h-3/4 animate-[audioWave3_0.6s_ease-in-out_infinite_alternate]" />
              </div>
            ) : (
              <Volume2 className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
