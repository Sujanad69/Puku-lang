import React, { useState, useMemo } from 'react';
import { WORDS_OF_THE_DAY } from '../data/portugueseData';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { Volume2, Sparkles, Calendar } from 'lucide-react';

export const WordOfTheDayCard: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Strictly ONE single word for today based on calendar date in Nepal (NPT)
  const { todayWord, dateString } = useMemo(() => {
    const now = new Date();
    
    // Get current date components in Nepal timezone
    const nepalTimeOptions: Intl.DateTimeFormatOptions = { 
      timeZone: 'Asia/Kathmandu',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    const nepalDateString = new Intl.DateTimeFormat('en-US', nepalTimeOptions).format(now);
    const [month, day, year] = nepalDateString.split('/').map(Number);
    
    // Create a local date object using Nepal's year, month, and day to calculate day of year safely
    const nepalDate = new Date(year, month - 1, day);
    const startOfYear = new Date(year, 0, 0);
    const diff = nepalDate.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const index = Math.abs(dayOfYear) % WORDS_OF_THE_DAY.length;

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      month: 'short',
      day: 'numeric'
    }).format(now);

    return {
      todayWord: WORDS_OF_THE_DAY[index] || WORDS_OF_THE_DAY[0],
      dateString: formattedDate
    };
  }, []);

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playTone(550, 'sine', 0.05);
    triggerHaptic('light');
    setIsPlaying(true);
    speakPt(todayWord.pt);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <div 
      onClick={() => handleSpeak()}
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] p-6 text-white shadow-md border border-blue-400/30 flex flex-col justify-between min-h-[220px] cursor-pointer active:scale-[0.99] transition-all"
    >
      {/* ================= BACKGROUND: PONTE 25 DE ABRIL & HIGH-DECK LOOPING TRAM ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        
        {/* Sky Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-400/15 rounded-full blur-2xl"></div>
        <div className="absolute top-0 left-1/3 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl"></div>

        {/* Soft Drifting Clouds */}
        <svg
          className="wotd-cloud-anim absolute top-2 right-8 h-4 w-10 opacity-25"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M17.5 19c-2.5 0-4.5-2-4.5-4.5 0-.4.1-.8.2-1.2C12.7 12.5 11.9 12 11 12c-1.7 0-3 1.3-3 3 0 .4.1.8.2 1.2-1.9.4-3.2 2-3.2 4.3 0 2.5 2 4.5 4.5 4.5h8c2.5 0 4.5-2 4.5-4.5S20 19 17.5 19z" />
        </svg>

        {/* Distant Shoreline & Cristo Rei / Almada Hills Silhouette */}
        <svg
          className="absolute bottom-[44px] left-0 w-full h-8 opacity-20"
          viewBox="0 0 400 30"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          {/* Gentle hills + Sanctuary of Christ the King (Cristo Rei) monument */}
          <path d="M0 30 L0 20 Q60 12 110 18 T200 14 Q230 10 250 16 T310 12 L318 12 L318 4 L322 4 L322 12 L330 12 Q360 18 400 20 L400 30 Z" fill="#93c5fd" />
        </svg>

        {/* ================= PONTE 25 DE ABRIL SVG (ICONIC RED SUSPENSION BRIDGE) ================= */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[95px] opacity-55 pointer-events-none z-[1]"
          viewBox="0 0 400 95"
          preserveAspectRatio="none"
        >
          {/* OVERHEAD CATENARY POWER WIRE (For Tram Pantograph) */}
          <line x1="0" y1="34" x2="400" y2="34" stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />

          {/* MAIN SUSPENSION CABLES (Parabolic Curves from Anchorages through Towers) */}
          <path
            d="M -10 48 Q 55 68 115 15 Q 195 72 275 15 Q 335 68 410 48"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.2"
            opacity="0.95"
          />
          <path
            d="M -10 49 Q 55 69 115 16 Q 195 73 275 16 Q 335 69 410 49"
            fill="none"
            stroke="#fca5a5"
            strokeWidth="0.7"
            opacity="0.7"
          />

          {/* VERTICAL SUSPENDER CABLES */}
          <g stroke="#fca5a5" strokeWidth="0.7" opacity="0.65">
            {/* Left Span Suspenders */}
            <line x1="20" y1="52" x2="20" y2="58" />
            <line x1="40" y1="57" x2="40" y2="58" />
            <line x1="60" y1="60" x2="60" y2="58" />
            <line x1="80" y1="53" x2="80" y2="58" />
            <line x1="100" y1="38" x2="100" y2="58" />

            {/* Central Main Span Suspenders */}
            <line x1="135" y1="34" x2="135" y2="58" />
            <line x1="155" y1="48" x2="155" y2="58" />
            <line x1="175" y1="58" x2="175" y2="58" />
            <line x1="195" y1="62" x2="195" y2="58" />
            <line x1="215" y1="58" x2="215" y2="58" />
            <line x1="235" y1="48" x2="235" y2="58" />
            <line x1="255" y1="34" x2="255" y2="58" />

            {/* Right Span Suspenders */}
            <line x1="290" y1="38" x2="290" y2="58" />
            <line x1="310" y1="53" x2="310" y2="58" />
            <line x1="330" y1="60" x2="330" y2="58" />
            <line x1="350" y1="57" x2="350" y2="58" />
            <line x1="370" y1="52" x2="370" y2="58" />
          </g>

          {/* LEFT SUSPENSION TOWER (Iconic X-braced Crimson Red Steel Lattice) */}
          <g>
            {/* Concrete Pier Base in Water */}
            <rect x="110" y="70" width="12" height="25" fill="#334155" rx="1" />
            
            {/* Left Tower Vertical Steel Columns */}
            <rect x="111" y="8" width="3.5" height="66" fill="#dc2626" />
            <rect x="118.5" y="8" width="3.5" height="66" fill="#dc2626" />
            
            {/* Tower Top Cap & Saddle */}
            <rect x="109" y="5" width="15" height="3.5" fill="#b91c1c" rx="0.5" />
            <rect x="112" y="3" width="9" height="2.5" fill="#ef4444" rx="0.5" />

            {/* X-Bracing and Horizontal Struts (Ponte 25 de Abril Lattice) */}
            <line x1="111" y1="12" x2="122" y2="24" stroke="#ef4444" strokeWidth="0.9" />
            <line x1="122" y1="12" x2="111" y2="24" stroke="#ef4444" strokeWidth="0.9" />
            <line x1="111" y1="24" x2="122" y2="24" stroke="#b91c1c" strokeWidth="1.2" />

            <line x1="111" y1="26" x2="122" y2="40" stroke="#ef4444" strokeWidth="0.9" />
            <line x1="122" y1="26" x2="111" y2="40" stroke="#ef4444" strokeWidth="0.9" />
            <line x1="111" y1="40" x2="122" y2="40" stroke="#b91c1c" strokeWidth="1.2" />

            <line x1="111" y1="42" x2="122" y2="56" stroke="#ef4444" strokeWidth="0.9" />
            <line x1="122" y1="42" x2="111" y2="56" stroke="#ef4444" strokeWidth="0.9" />
          </g>

          {/* RIGHT SUSPENSION TOWER (Matching Twin Crimson Red Steel Lattice) */}
          <g>
            {/* Concrete Pier Base in Water */}
            <rect x="270" y="70" width="12" height="25" fill="#334155" rx="1" />
            
            {/* Right Tower Vertical Steel Columns */}
            <rect x="271" y="8" width="3.5" height="66" fill="#dc2626" />
            <rect x="278.5" y="8" width="3.5" height="66" fill="#dc2626" />
            
            {/* Tower Top Cap & Saddle */}
            <rect x="269" y="5" width="15" height="3.5" fill="#b91c1c" rx="0.5" />
            <rect x="272" y="3" width="9" height="2.5" fill="#ef4444" rx="0.5" />

            {/* X-Bracing and Horizontal Struts */}
            <line x1="271" y1="12" x2="282" y2="24" stroke="#ef4444" strokeWidth="0.9" />
            <line x1="282" y1="12" x2="271" y2="24" stroke="#ef4444" strokeWidth="0.9" />
            <line x1="271" y1="24" x2="282" y2="24" stroke="#b91c1c" strokeWidth="1.2" />

            <line x1="271" y1="26" x2="282" y2="40" stroke="#ef4444" strokeWidth="0.9" />
            <line x1="282" y1="26" x2="271" y2="40" stroke="#ef4444" strokeWidth="0.9" />
            <line x1="271" y1="40" x2="282" y2="40" stroke="#b91c1c" strokeWidth="1.2" />

            <line x1="271" y1="42" x2="282" y2="56" stroke="#ef4444" strokeWidth="0.9" />
            <line x1="282" y1="42" x2="271" y2="56" stroke="#ef4444" strokeWidth="0.9" />
          </g>

          {/* ================= HIGH SUSPENDED BRIDGE DECK TRUSS & RAIL LINE ================= */}
          {/* Lower Stiffening Truss Girder */}
          <rect x="0" y="58" width="400" height="7" fill="#dc2626" />
          <rect x="0" y="64" width="400" height="2" fill="#991b1b" />
          
          {/* Truss Cross Patterns */}
          <g stroke="#b91c1c" strokeWidth="0.8">
            <line x1="0" y1="58" x2="400" y2="58" />
            <line x1="0" y1="65" x2="400" y2="65" />
          </g>

          {/* DEDICATED TRAM STEEL RAIL TRACKS (Clear Elevated Silver Tracks) */}
          <line x1="0" y1="57" x2="400" y2="57" stroke="#f8fafc" strokeWidth="1.2" opacity="0.9" />
          <line x1="0" y1="58.2" x2="400" y2="58.2" stroke="#38bdf8" strokeWidth="0.8" opacity="0.8" />
          
          {/* Track Railway Sleepers / Ties */}
          <g stroke="#ffffff" strokeWidth="0.8" opacity="0.4">
            {Array.from({ length: 40 }).map((_, i) => (
              <line key={i} x1={i * 10} y1="56.5" x2={i * 10} y2="58.5" />
            ))}
          </g>
        </svg>

        {/* ================= CONTINUOUS LOOPING TRAM RIDING DIRECTLY ON THE BRIDGE TRACK ================= */}
        {/* Placed at bottom-[37px] so wheels roll precisely on the bridge deck rail at y=57 of 95px */}
        <div className="ponte-tram-anim absolute bottom-[37px] left-0 pointer-events-none z-[2]">
          <svg width="72" height="28" viewBox="0 0 72 28" fill="none" className="drop-shadow-lg">
            
            {/* Pantograph / Trolley Pole (Reaching up and touching overhead catenary wire) */}
            <path d="M36 8 L41 1 L47 1" stroke="#f8fafc" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="38" y1="1" x2="49" y2="1" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />

            {/* Tram Cream Curved Roof */}
            <rect x="6" y="7" width="60" height="3" rx="1.5" fill="#fefce8" />

            {/* Iconic Lisbon Yellow Tram Body */}
            <rect x="6" y="9.5" width="60" height="13.5" rx="2.5" fill="#f59e0b" />
            <rect x="7" y="10" width="58" height="2" fill="#fbbf24" opacity="0.95" />

            {/* Traditional Lisbon Red Trim Strip */}
            <rect x="6" y="18.8" width="60" height="1.4" fill="#dc2626" opacity="0.95" />

            {/* Dark Window Frames */}
            <g fill="#0f172a">
              {/* Front Windshield */}
              <rect x="8" y="11" width="7.5" height="6.5" rx="1" />
              {/* Passenger Side Windows */}
              <rect x="19" y="11" width="8" height="6.5" rx="0.8" />
              <rect x="30" y="11" width="8" height="6.5" rx="0.8" />
              <rect x="41" y="11" width="8" height="6.5" rx="0.8" />
              <rect x="52" y="11" width="8" height="6.5" rx="0.8" />
              {/* Rear Window */}
              <rect x="62" y="11" width="3" height="6.5" rx="0.6" />
            </g>

            {/* Warm Interior Golden Light Glow from Windows */}
            <g fill="#fef08a" opacity="0.65">
              <rect x="9" y="12" width="5.5" height="4.5" rx="0.5" />
              <rect x="20" y="12" width="6" height="4.5" rx="0.5" />
              <rect x="31" y="12" width="6" height="4.5" rx="0.5" />
              <rect x="42" y="12" width="6" height="4.5" rx="0.5" />
              <rect x="53" y="12" width="6" height="4.5" rx="0.5" />
            </g>

            {/* Front Headlight with Forward Beam */}
            <circle cx="8" cy="18" r="1.5" fill="#ffffff" />
            <circle cx="8" cy="18" r="3.5" fill="#fef08a" opacity="0.5" />

            {/* Route Number Badge "28" */}
            <rect x="11" y="8" width="9" height="2.2" rx="0.6" fill="#1e293b" />
            <rect x="13" y="8.6" width="5" height="1" fill="#fbbf24" />

            {/* Tram Metal Chassis Base */}
            <rect x="8" y="22.5" width="56" height="1.5" fill="#1e293b" />

            {/* Steel Wheels Rolling on Bridge Rail Track */}
            <g fill="#0f172a">
              <circle cx="16" cy="24.5" r="2.2" fill="#0f172a" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="26" cy="24.5" r="2.2" fill="#0f172a" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="46" cy="24.5" r="2.2" fill="#0f172a" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="56" cy="24.5" r="2.2" fill="#0f172a" stroke="#e2e8f0" strokeWidth="0.8" />

              {/* Wheel Chrome Hubs */}
              <circle cx="16" cy="24.5" r="0.8" fill="#f8fafc" />
              <circle cx="26" cy="24.5" r="0.8" fill="#f8fafc" />
              <circle cx="46" cy="24.5" r="0.8" fill="#f8fafc" />
              <circle cx="56" cy="24.5" r="0.8" fill="#f8fafc" />
            </g>
          </svg>
        </div>

        {/* ================= RIO TEJO (TAGUS RIVER WATER WAVES AT BOTTOM) ================= */}
        <div className="absolute bottom-0 left-0 w-full h-6 overflow-hidden opacity-35 z-[3]">
          <svg className="wotd-water-anim w-[120%] h-full" viewBox="0 0 500 24" preserveAspectRatio="none">
            <path
              d="M0 10 Q 25 4, 50 10 T 100 10 T 150 10 T 200 10 T 250 10 T 300 10 T 350 10 T 400 10 T 450 10 T 500 10 L 500 24 L 0 24 Z"
              fill="#60a5fa"
            />
            <path
              d="M0 15 Q 25 9, 50 15 T 100 15 T 150 15 T 200 15 T 250 15 T 300 15 T 350 15 T 400 15 T 450 15 T 500 15 L 500 24 L 0 24 Z"
              fill="#38bdf8"
              opacity="0.7"
            />
          </svg>
        </div>

      </div>

      {/* ================= FOREGROUND CONTENT ================= */}
      <div className="relative z-10 space-y-1">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-extrabold tracking-wider uppercase text-blue-100 backdrop-blur-md border border-white/15 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Word of the Day</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-100 bg-black/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-white/10">
            <Calendar className="w-3 h-3 opacity-80" />
            <span>{dateString}</span>
          </div>
        </div>

        {/* Word and Meaning */}
        <div className="pt-2">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-xs">
              {todayWord.pt}
            </h3>
            <span className="text-[11px] font-mono text-blue-100 bg-black/25 px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
              /{todayWord.phonetic}/
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-blue-50 pt-1 leading-snug drop-shadow-xs">
            {todayWord.en}
          </p>

          {/* Example Sentence if available */}
          {todayWord.examplePt && (
            <p className="text-[11px] text-blue-100/80 italic pt-1 font-medium line-clamp-1">
              "{todayWord.examplePt}"
            </p>
          )}
        </div>

      </div>

      {/* Footer Pronunciation & Bridge Label */}
      <div className="relative z-10 pt-3 flex items-center justify-between border-t border-white/15 text-xs">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
            {todayWord.type || "word"}
          </span>
          <span className="text-[11px] text-blue-100 font-medium flex items-center gap-1">
            <span>Ponte 25 de Abril • Lisboa</span>
          </span>
        </div>

        <button
          onClick={(e) => handleSpeak(e)}
          className={`flex h-9 px-3 items-center justify-center gap-1.5 rounded-full bg-white text-blue-600 shadow-md transition-all active:scale-90 hover:scale-105 cursor-pointer ${
            isPlaying ? 'ring-4 ring-white/50 scale-105' : ''
          }`}
          title="Listen to European Portuguese Pronunciation"
        >
          <Volume2 className={`w-4 h-4 text-blue-600 ${isPlaying ? 'animate-bounce' : ''}`} />
          {isPlaying && (
            <div className="flex items-center gap-0.5 h-3">
              {[1, 2, 3].map(b => (
                <span 
                  key={b} 
                  className="w-0.5 bg-blue-600 rounded-full animate-pulse"
                  style={{ height: `${(b * 3) % 8 + 3}px`, animationDelay: `${b * 120}ms` }}
                />
              ))}
            </div>
          )}
        </button>
      </div>

    </div>
  );
};
