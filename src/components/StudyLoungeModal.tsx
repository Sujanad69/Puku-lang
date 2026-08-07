import React, { useState } from 'react';
import { Unit, VocabWord } from '../types';
import { speakPt, playTone } from '../utils/audio';

interface StudyLoungeModalProps {
  unit: Unit;
  onBack: () => void;
  onStartQuiz: () => void;
}

export const StudyLoungeModal: React.FC<StudyLoungeModalProps> = ({
  unit,
  onBack,
  onStartQuiz,
}) => {
  const [slowMode, setSlowMode] = useState(false);
  const [activePt, setActivePt] = useState<string | null>(null);

  const handleSpeak = (word: VocabWord) => {
    setActivePt(word.pt);
    playTone(580, 'sine', 0.08);
    speakPt(word.pt, slowMode);
    setTimeout(() => setActivePt(null), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f4f5f8] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 shadow-sm pt-safe">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 active:scale-90 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </button>

        <div className="text-center">
          <h2 className="text-base font-extrabold text-slate-900 leading-tight">
            {unit.title}
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            {unit.words.length} European Portuguese Phrases
          </p>
        </div>

        {/* Slow Audio Toggle Button */}
        <button
          onClick={() => setSlowMode(!slowMode)}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
            slowMode
              ? 'bg-amber-100 text-amber-800 border border-amber-200 shadow-sm'
              : 'bg-slate-100 text-slate-500'
          }`}
          title="Toggle Slow Pronunciation Speed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z"/><path d="M4.82 7.9 8 10"/><path d="M15.18 7.9 12 10"/><path d="M16.93 10H20a2 2 0 0 1 0 4H2"/></svg>
          <span>{slowMode ? '0.65x' : '1.0x'}</span>
        </button>
      </div>

      {/* Intro Notice */}
      <div className="bg-green-50 px-4 py-2.5 text-center border-b border-green-100 flex items-center justify-center gap-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-7.36l-.71.71M6.34 17.66l-.71.71m12.02 0l.71.71M6.34 6.34l.71.71M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
        <p className="text-xs font-bold text-green-800">
          Tap any Portuguese card below to hear authentic European accent!
        </p>
      </div>

      {/* Vocabulary List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-28">
        {unit.words.map((word: VocabWord, idx: number) => {
          const isActive = activePt === word.pt;

          return (
            <div
              key={idx}
              onClick={() => handleSpeak(word)}
              className={`group flex items-center justify-between rounded-2xl border p-4 shadow-sm transition-all cursor-pointer active:scale-[0.98] ${
                isActive
                  ? 'border-[#58cc02] bg-green-50/80 shadow-md ring-2 ring-[#58cc02]/20'
                  : 'border-black/5 bg-white hover:border-[#58cc02]/30'
              }`}
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {word.pt}
                  </h3>
                  {word.phonetic && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                      [{word.phonetic}]
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {word.en}
                </p>

                {word.note && (
                  <p className="mt-1 text-xs font-medium text-slate-400 italic">
                    💡 {word.note}
                  </p>
                )}
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform ${
                  isActive
                    ? 'bg-[#58cc02] text-white scale-110 shadow-md'
                    : 'bg-green-50 text-[#58cc02] group-hover:scale-105'
                }`}
              >
                <svg width="20" height="20" className="fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-black/5 bg-white p-4 shadow-xl pb-safe">
        <div className="mx-auto flex max-w-md gap-3">
          <button
            onClick={onStartQuiz}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#58cc02] py-4 font-extrabold text-white text-base shadow-lg shadow-green-500/20 active:translate-y-1 transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Test My Knowledge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
