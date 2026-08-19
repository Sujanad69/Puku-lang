import React, { useState } from 'react';
import { CULTURE_ARTICLES } from '../data/portugueseData';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { X, Volume2, Sparkles, Compass, BookOpen, Check } from 'lucide-react';
import { FlagPortugal } from './icons/PremiumIcons';

interface CultureGuidesModalProps {
  onClose: () => void;
}

export const CultureGuidesModal: React.FC<CultureGuidesModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(CULTURE_ARTICLES[0].id);
  const [playingPhrase, setPlayingPhrase] = useState<string | null>(null);

  const activeArticle = CULTURE_ARTICLES.find(a => a.id === activeTab) || CULTURE_ARTICLES[0];

  const handleSpeakPhrase = (text: string) => {
    playTone(550, 'sine', 0.06);
    triggerHaptic('light');
    setPlayingPhrase(text);
    speakPt(text);
    setTimeout(() => setPlayingPhrase(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] bg-white dark:bg-[#12141a] border border-slate-200/60 dark:border-slate-800/80 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* ================= HEADER BANNER ================= */}
        <div className="relative bg-gradient-to-br from-[#0369a1] via-[#0284c7] to-[#0ea5e9] p-6 text-white text-center overflow-hidden shrink-0">
          
          {/* Subtle Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-sky-200 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-cyan-300 rounded-full blur-2xl"></div>
          </div>

          {/* Top Actions Bar (No overlap on mobile) */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
            <div className="flex-1" />

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-xs max-w-[200px] sm:max-w-none truncate">
              <Compass className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              <span className="truncate">Culture & Guides • Portugal</span>
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

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight flex items-center justify-center gap-2">
            <span>Cultura Portuguesa</span>
            <FlagPortugal size={24} />
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 font-medium mt-1 max-w-md mx-auto leading-relaxed">
            Essential etiquette, Lisbon habits, dining rituals, and playful tongue twisters.
          </p>

          {/* Navigation Pill Tabs */}
          <div className="flex gap-2 overflow-x-auto p-1 mt-4 rounded-2xl bg-black/20 backdrop-blur-md max-w-lg mx-auto no-scrollbar">
            {CULTURE_ARTICLES.map(article => {
              const isActive = activeTab === article.id;
              return (
                <button
                  key={article.id}
                  onClick={() => {
                    playTone(600, 'sine', 0.03);
                    setActiveTab(article.id);
                  }}
                  className={`shrink-0 py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-sky-700 shadow-md scale-[1.02]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{article.title}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ================= CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          <div className="rounded-3xl border border-sky-100 dark:border-sky-950 bg-slate-50 dark:bg-[#181a22] p-6 space-y-4 shadow-sm">
            
            <div className="flex items-center gap-2.5 text-sky-600 dark:text-sky-400 font-black text-lg border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3>{activeArticle.title}</h3>
            </div>

            {activeArticle.id === 'tongue' ? (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Tap any tongue twister (trava-línguas) to listen and test your Lisbon cadence!
                </p>

                {[
                  { pt: 'O rato roeu a rolha da garrafa do rei da Rússia.', en: 'The mouse gnawed the cork of the King of Russia’s bottle.' },
                  { pt: 'Três pratos de trigo para três tigres tristes.', en: 'Three plates of wheat for three sad tigers.' },
                  { pt: 'A aranha arranha a rã. A rã arranha a aranha.', en: 'The spider scratches the frog. The frog scratches the spider.' },
                ].map((item, idx) => {
                  const isPlaying = playingPhrase === item.pt;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSpeakPhrase(item.pt)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-sky-300'
                      }`}
                    >
                      <div className="space-y-0.5 flex-1 pr-3">
                        <p className="text-sm font-black text-slate-900 dark:text-white">{item.pt}</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">"{item.en}"</p>
                      </div>

                      <button className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-full transition-all ${
                        isPlaying
                          ? 'bg-sky-600 text-white ring-4 ring-sky-300'
                          : 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300'
                      }`}>
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                {activeArticle.content.trim()}
              </div>
            )}

          </div>

        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1015] shrink-0 flex items-center justify-between gap-3">
          <span className="text-xs text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Discover Portugal</span>
          </span>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>

    </div>
  );
};
