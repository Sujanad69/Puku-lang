import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add states for UnitHub and GameMode
if (!app.includes('const [showUnitHub')) {
  app = app.replace(
    "const [showLessonSelector, setShowLessonSelector] = useState(false);",
    "const [showLessonSelector, setShowLessonSelector] = useState(false);\n  const [showUnitHub, setShowUnitHub] = useState(false);\n  const [gameMode, setGameMode] = useState<'guided' | 'match' | 'speaking' | 'builder'>('guided');"
  );
}

// 2. Modify UnitListCard click handler (inside App.tsx where they map over units)
app = app.replace(
  "onClick={() => {\n                  setSelectedUnitId(unit.id);\n                  setShowLessonSelector(true);\n                }}",
  "onClick={() => {\n                  setSelectedUnitId(unit.id);\n                  setShowUnitHub(true);\n                }}"
);

// 3. Update LessonEngine props to pass gameMode
app = app.replace(
  "<LessonEngine\n            unit={selectedUnit}\n            lessonIndex={selectedLessonIndex}",
  "<LessonEngine\n            unit={selectedUnit}\n            lessonIndex={selectedLessonIndex}\n            gameMode={gameMode}"
);

// 4. Inject UnitHubModal JSX
const unitHubJSX = `
        {/* UNIT HUB MODAL (Full Screen Glossary + Games) */}
        {showUnitHub && selectedUnit && (
          <div className="fixed inset-0 z-[90] flex flex-col bg-[#F9FAFB] dark:bg-[#09090b] animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-5 pt-safe border-b border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
              <button onClick={() => setShowUnitHub(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:scale-105 active:scale-95 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white truncate px-4">{selectedUnit.title}</h2>
              <div className="w-10"></div>
            </div>

            {/* Glossary List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 pb-48">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Vocabulary Overview</h3>
                <p className="text-slate-500 font-medium">Review all phrases in this chapter before playing.</p>
              </div>
              
              {selectedUnit.words.map((word, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#18181b] border-2 border-slate-100 dark:border-white/5 shadow-sm" onClick={() => { playTone(580, 'sine', 0.08); speakPt(word.pt); }}>
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate mb-1">{word.pt}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-400 truncate">{word.en}</span>
                      {word.phonetic && <span className="text-sm text-[#1CB0F6] font-medium opacity-80 truncate">• /{word.phonetic}/</span>}
                    </div>
                  </div>
                  <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#1CB0F6]/10 text-[#1CB0F6]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent dark:from-[#09090b] dark:via-[#09090b] pb-safe-offset-5 space-y-3">
              <button 
                onClick={() => { setShowUnitHub(false); setGameMode('guided'); setShowLessonSelector(true); }}
                className="w-full h-14 rounded-2xl font-black text-lg text-white bg-[#58cc02] shadow-[0_4px_0_#46a302] hover:bg-[#61e002] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                START GUIDED PATH
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setShowUnitHub(false); setGameMode('match'); setActiveModal('study'); }}
                  className="h-12 rounded-xl font-bold text-[15px] text-white bg-[#1CB0F6] shadow-[0_4px_0_#1899D6] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Match Pairs
                </button>
                <button 
                  onClick={() => { setShowUnitHub(false); setGameMode('speaking'); setActiveModal('study'); }}
                  className="h-12 rounded-xl font-bold text-[15px] text-white bg-purple-500 shadow-[0_4px_0_#9333ea] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  Speak It
                </button>
                <button 
                  onClick={() => { setShowUnitHub(false); setGameMode('builder'); setActiveModal('study'); }}
                  className="col-span-2 h-12 rounded-xl font-bold text-[15px] text-white bg-orange-500 shadow-[0_4px_0_#ea580c] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Guess & Build Words
                </button>
              </div>
            </div>
          </div>
        )}
`;

if (!app.includes('UNIT HUB MODAL')) {
  app = app.replace(
    "{/* LESSON SELECTOR MODAL */}",
    unitHubJSX + "\n\n        {/* LESSON SELECTOR MODAL */}"
  );
}

fs.writeFileSync('src/App.tsx', app);
