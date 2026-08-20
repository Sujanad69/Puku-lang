import React, { useState } from 'react';
import {
  PHONATION_COMPARISONS,
  LISBON_SLANG_EXPRESSIONS,
  CULTURAL_ETIQUETTE_GUIDES,
} from '../data/nepaliBridgeData';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  X, 
  Volume2, 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Heart,
  Globe2
} from 'lucide-react';

interface NepaliBridgeModalProps {
  onClose: () => void;
}

export const NepaliBridgeModal: React.FC<NepaliBridgeModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'phonetics' | 'slang' | 'etiquette'>('phonetics');
  const [selectedPhonationId, setSelectedPhonationId] = useState<string>(PHONATION_COMPARISONS[0].id);
  const [slowAudio, setSlowAudio] = useState<boolean>(false);
  const [activeSpeakingText, setActiveSpeakingText] = useState<string | null>(null);

  const activePhonation = PHONATION_COMPARISONS.find(p => p.id === selectedPhonationId) || PHONATION_COMPARISONS[0];

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playTone(540, 'sine', 0.05);
    triggerHaptic('light');
    setActiveSpeakingText(text);
    speakPt(text, slowAudio);
    setTimeout(() => setActiveSpeakingText(null), 2200);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] bg-white dark:bg-[#12141a] border border-slate-200/60 dark:border-slate-800/80 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* ================= HEADER BANNER ================= */}
        <div className="relative bg-gradient-to-br from-[#4338ca] via-[#4f46e5] to-[#6366f1] p-6 text-white text-center overflow-hidden shrink-0">
          
          {/* Subtle Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-200 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-300 rounded-full blur-2xl"></div>
          </div>
          
          {/* Animated Bridge Scene with Tram and Car */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden border-t-2 border-white/20">
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30"></div> {/* Bridge Deck */}
            {/* Animated Tram */}
            <div className="absolute bottom-1.5 animate-drive-right">
              <div className="text-3xl filter drop-shadow-lg">🚋</div>
            </div>
            {/* Animated Car */}
            <div className="absolute bottom-1.5 animate-drive-left">
              <div className="text-2xl filter drop-shadow-lg transform -scale-x-100">🚗</div>
            </div>
          </div>

          {/* Top Actions Bar (No overlap on mobile) */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
            {/* Speed Toggle in Header */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setSlowAudio(!slowAudio);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all backdrop-blur-md border cursor-pointer ${
                  slowAudio
                    ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-xs'
                    : 'bg-black/20 text-white/90 border-white/15 hover:bg-black/30'
                }`}
                title="Toggle audio pronunciation speed"
              >
                <span>🐢</span>
                <span>{slowAudio ? '0.75x' : '1.0x'}</span>
              </button>
            </div>

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-xs max-w-[180px] sm:max-w-none truncate">
              <Globe2 className="w-3.5 h-3.5 text-indigo-200 shrink-0" />
              <span className="truncate">Nepali ➔ PT-PT Bridge</span>
            </div>

            {/* Close Button */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-md shrink-0"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            नेपाली ➔ पोर्चुगिज ब्रिज
          </h2>

          <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1 max-w-md mx-auto leading-relaxed">
            Nepali phonetic parallels, authentic Lisbon slang, and cultural etiquette.
          </p>

          {/* Navigation Pill Tabs */}
          <div className="flex items-center justify-center gap-1.5 mt-4 p-1 rounded-2xl bg-black/20 backdrop-blur-md max-w-sm mx-auto">
            <button
              onClick={() => {
                playTone(600, 'sine', 0.03);
                setActiveTab('phonetics');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'phonetics'
                  ? 'bg-white text-indigo-600 shadow-md scale-[1.02]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Phonetics</span>
            </button>

            <button
              onClick={() => {
                playTone(600, 'sine', 0.03);
                setActiveTab('slang');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'slang'
                  ? 'bg-white text-indigo-600 shadow-md scale-[1.02]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lisbon Slang</span>
            </button>

            <button
              onClick={() => {
                playTone(600, 'sine', 0.03);
                setActiveTab('etiquette');
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'etiquette'
                  ? 'bg-white text-indigo-600 shadow-md scale-[1.02]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Etiquette</span>
            </button>
          </div>

        </div>

        {/* ================= TAB 1: PHONETICS ================= */}
        {activeTab === 'phonetics' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Pattern Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                Select Sound Pattern:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {PHONATION_COMPARISONS.map(rule => (
                  <button
                    key={rule.id}
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedPhonationId(rule.id);
                    }}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      selectedPhonationId === rule.id
                        ? 'bg-indigo-600 text-white shadow-xs scale-[1.02]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {rule.ptPattern}
                  </button>
                ))}
              </div>
            </div>

            {/* Rule Detail Card */}
            <div className="rounded-3xl border border-indigo-100 dark:border-indigo-950 bg-slate-50 dark:bg-[#181a22] p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="space-y-1">
                <span className="inline-block rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  Pattern: {activePhonation.ptPattern}
                </span>
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  {activePhonation.title}
                </h3>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {activePhonation.titleNepali}
                </p>
              </div>

              {/* Nepali Bridge Callout */}
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <Lightbulb className="w-4 h-4" />
                  <span>नेपाली ध्वनि तुलना (Nepali Sound Bridge):</span>
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {activePhonation.nepaliBridgeRule}
                </p>
                <div className="rounded-xl bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold text-amber-700 dark:text-amber-300 border border-amber-500/15">
                  {activePhonation.devanagariExample}
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {activePhonation.explanation}
              </p>

              {/* Practice Examples */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Practice Audio Examples:
                </h4>

                <div className="space-y-2">
                  {activePhonation.examples.map((item, idx) => {
                    const isPlayingThis = activeSpeakingText === item.pt;

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSpeak(item.pt)}
                        className={`rounded-2xl border p-4 transition-all active:scale-[0.99] cursor-pointer space-y-1.5 shadow-xs ${
                          isPlayingThis
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-400 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                              {item.pt}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              "{item.en}"
                            </span>
                          </div>

                          <button className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                            isPlayingThis
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-300'
                              : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
                          }`}>
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 text-xs">
                          <span className="rounded-md bg-indigo-100 dark:bg-indigo-950/50 px-2 py-0.5 font-bold text-indigo-700 dark:text-indigo-300">
                            🇳🇵 {item.nepaliPhonetic}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">
                            {item.nepaliMeaning}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          💡 {item.audioTip}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 2: LISBON SLANG ================= */}
        {activeTab === 'slang' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            
            <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 p-4 space-y-1">
              <h3 className="text-xs font-bold tracking-tight text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Authentic Lisbon Slang & Everyday Colloquialisms</span>
              </h3>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed font-medium">
                Common Portuguese slang terms paired with lively Nepali equivalents.
              </p>
            </div>

            {LISBON_SLANG_EXPRESSIONS.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSpeak(item.examplePt)}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#181a22] p-4 space-y-2 transition-all hover:border-indigo-300 active:scale-[0.99] cursor-pointer shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                        {item.pt}
                      </h4>
                      <span className="rounded-md bg-indigo-100 dark:bg-indigo-950/50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                        {item.nepaliDevanagari}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                      "{item.en}" • <span className="text-amber-600 dark:text-amber-400 font-semibold">{item.nepaliMeaning}</span>
                    </p>
                  </div>

                  <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {item.usageContext}
                </p>

                {/* Example sentence */}
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span>{item.examplePt}</span>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">Tap to hear 🔊</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    🇳🇵 {item.exampleNepali}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    "{item.exampleEn}"
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* ================= TAB 3: ETIQUETTE ================= */}
        {activeTab === 'etiquette' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {CULTURAL_ETIQUETTE_GUIDES.map(guide => (
              <div
                key={guide.id}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#181a22] p-5 sm:p-6 space-y-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                      {guide.title}
                    </h3>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {guide.titleNepali}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {guide.summary}
                  </p>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    🇳🇵 {guide.summaryNepali}
                  </p>
                </div>

                {/* DO's & DON'Ts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 p-4 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>DO’s</span>
                    </h5>
                    <div className="space-y-1.5">
                      {guide.dos.map((d, i) => (
                        <div key={i} className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                          <p className="font-medium">• {d.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 p-4 space-y-2">
                    <h5 className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>DON’Ts</span>
                    </h5>
                    <div className="space-y-1.5">
                      {guide.donts.map((d, i) => (
                        <div key={i} className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                          <p className="font-medium">• {d.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Note from Sujan */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 space-y-1 text-xs">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 text-xs">
                    <span>💌</span> Sujan’s Special Tip for Amisha:
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-xs font-medium">
                    "{guide.loveNoteFromSujan}"
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1015] shrink-0 flex items-center justify-between gap-3">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
            <Globe2 className="w-4 h-4" />
            <span>Nepali ➔ Lisbon Portuguese Bridge</span>
          </span>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>

    </div>
  );
};
