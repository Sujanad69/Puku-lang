import React, { useState } from 'react';
import { CULTURE_ARTICLES } from '../data/portugueseData';
import { speakPt, playTone } from '../utils/audio';

interface CultureGuidesModalProps {
  onClose: () => void;
}

export const CultureGuidesModal: React.FC<CultureGuidesModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(CULTURE_ARTICLES[0].id);

  const activeArticle = CULTURE_ARTICLES.find(a => a.id === activeTab) || CULTURE_ARTICLES[0];

  const handleSpeakPhrase = (text: string) => {
    playTone(550, 'sine', 0.08);
    speakPt(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f4f5f8] overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 shadow-sm pt-safe">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 active:scale-90"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="text-center">
          <h2 className="text-base font-extrabold text-slate-900">Culture & Guides</h2>
          <p className="text-xs font-semibold text-slate-400">European Portuguese Insights</p>
        </div>

        <div className="w-10" />
      </div>

      {/* Tabs Bar */}
      <div className="flex gap-2 overflow-x-auto p-3 bg-white border-b border-black/5 no-scrollbar">
        {CULTURE_ARTICLES.map(article => {
          const isActive = activeTab === article.id;

          return (
            <button
              key={article.id}
              onClick={() => setActiveTab(article.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {article.title}
            </button>
          );
        })}
      </div>

      {/* Article Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-4">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#2563eb] font-black text-xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <h3>{activeArticle.title}</h3>
          </div>

          <div className="text-slate-700 text-sm font-medium leading-relaxed space-y-3">
            {activeArticle.id === 'tongue' ? (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500">
                  Tap any tongue twister below to listen and practice your Portuguese cadence!
                </p>

                {[
                  { pt: 'O rato roeu a rolha da garrafa do rei da Rússia.', en: 'The mouse gnawed the cork of the King of Russia’s bottle.' },
                  { pt: 'Três pratos de trigo para três tigres tristes.', en: 'Three plates of wheat for three sad tigers.' },
                  { pt: 'A aranha arranha a rã. A rã arranha a aranha.', en: 'The spider scratches the frog. The frog scratches the spider.' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSpeakPhrase(item.pt)}
                    className="flex items-center justify-between rounded-2xl border border-black/5 bg-slate-50 p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">{item.pt}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">"{item.en}"</p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-sm">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {activeArticle.content.trim()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
