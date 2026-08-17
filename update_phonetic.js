import fs from 'fs';
let content = fs.readFileSync('src/components/lesson/LessonEngine.tsx', 'utf8');

content = content.replace(
  '<span className="text-sm font-semibold text-slate-400 dark:text-slate-500 truncate">{word.en}</span>',
  '<span className="text-sm font-semibold text-slate-400 dark:text-slate-500 truncate">{word.en}</span>\n                    {word.phonetic && <span className="text-sm text-[#1CB0F6] font-medium opacity-80 truncate">• /{word.phonetic}/</span>}'
);

fs.writeFileSync('src/components/lesson/LessonEngine.tsx', content);
