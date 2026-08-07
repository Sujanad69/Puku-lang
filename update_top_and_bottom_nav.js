import fs from 'fs';

// Mascot Island Update
let mascotCode = fs.readFileSync('src/components/MascotIsland.tsx', 'utf8');

// The user wants to remove Left: Brand Logo & Title
mascotCode = mascotCode.replace(/{\/\* Left: Brand Logo & Title \*\/}.*?{\/\* Center: Speech Bubble Pill \*\/}/s, '{/* Center: Speech Bubble Pill */}');

// The user wants to remove Streak
mascotCode = mascotCode.replace(/{\/\* Streak \*\/}.*?{\/\* Hearts \*\/}/s, '{/* Hearts */}');

fs.writeFileSync('src/components/MascotIsland.tsx', mascotCode);

// Tab bar update
let tabCode = fs.readFileSync('src/components/FloatingGlassTabBar.tsx', 'utf8');

// Update tab container
const oldTabContainer = `<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-sm sm:max-w-md pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between gap-1 p-1.5 rounded-full bg-white/70 dark:bg-[#111111]/70 backdrop-blur-3xl border border-white/60 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.2)]">`;

const newTabContainer = `<div className="fixed bottom-0 left-0 w-full z-[9999]">
      <nav className="flex items-center justify-center sm:justify-center md:gap-4 gap-2 px-4 py-3 sm:py-4 bg-white dark:bg-black border-t border-black/10 dark:border-white/10 pb-[max(env(safe-area-inset-bottom),0.75rem)] w-full">`;

tabCode = tabCode.replace(oldTabContainer, newTabContainer);

// Also change the buttons style a bit to fit a fixed bottom bar.
tabCode = tabCode.replace(/rounded-full shadow-\[0_4px_16px_rgba\(88,204,2,0\.4\)\]/g, 'rounded-xl shadow-none');
tabCode = tabCode.replace(/rounded-full shadow-\[0_4px_16px_rgba\(255,150,0,0\.4\)\]/g, 'rounded-xl shadow-none');
tabCode = tabCode.replace(/rounded-full shadow-\[0_4px_16px_rgba\(147,51,234,0\.4\)\]/g, 'rounded-xl shadow-none');
tabCode = tabCode.replace(/rounded-full/g, 'rounded-xl');

fs.writeFileSync('src/components/FloatingGlassTabBar.tsx', tabCode);

console.log("Done");
