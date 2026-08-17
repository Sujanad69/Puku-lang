import fs from 'fs';

// --- 1. UPDATE TYPES ---
let types = fs.readFileSync('src/types.ts', 'utf8');
if (!types.includes("gameMode?:")) {
  types = types.replace(
    'interface LessonEngineProps {',
    "interface LessonEngineProps {\n  gameMode?: 'guided' | 'match' | 'speaking' | 'builder';"
  );
  fs.writeFileSync('src/types.ts', types);
}

// --- 2. REWRITE PORTUGUESE DATA ---
const newData = `import { Unit } from '../types';

export const UNITS_DATA: Record<string, Unit> = {
  unit1: {
    id: 'unit1',
    chapterNum: 1,
    chapterTitle: 'Chapter 1: Greetings',
    chapterDesc: 'From \"Hello\" to \"How are you?\" - start your journey here.',
    title: 'Hello & Welcome',
    desc: 'The essential European Portuguese greetings.',
    color: '#3B82F6',
    iconName: 'MessageSquare',
    words: [
      { pt: "Olá", en: "Hello", phonetic: "oh-LAH" },
      { pt: "Bom dia", en: "Good morning", phonetic: "bom DEE-ah" },
      { pt: "Boa tarde", en: "Good afternoon", phonetic: "BOH-ah TAR-deh" },
      { pt: "Boa noite", en: "Good night", phonetic: "BOH-ah NOY-teh" },
      { pt: "Como estás?", en: "How are you? (informal)", phonetic: "KOH-moo sh-TASH" },
      { pt: "Como está?", en: "How are you? (formal)", phonetic: "KOH-moo sh-TAH" },
      { pt: "Tudo bem?", en: "All good?", phonetic: "TOO-doo beng" },
      { pt: "Estou bem", en: "I am well", phonetic: "sh-TOH beng" },
      { pt: "Obrigado", en: "Thank you (male)", phonetic: "oh-bree-GAH-doo" },
      { pt: "Obrigada", en: "Thank you (female)", phonetic: "oh-bree-GAH-dah" },
      { pt: "De nada", en: "You're welcome", phonetic: "deh NAH-dah" },
      { pt: "Adeus", en: "Goodbye", phonetic: "ah-DEH-oosh" },
      { pt: "Até logo", en: "See you later", phonetic: "ah-TEH LOH-goo" },
      { pt: "Muito prazer", en: "Nice to meet you", phonetic: "MWIN-too pra-ZEHR" },
      { pt: "Chamo-me...", en: "My name is...", phonetic: "SHAH-moo-meh" }
    ]
  },
  unit2: {
    id: 'unit2',
    chapterNum: 2,
    chapterTitle: 'Chapter 2: Daily Life',
    chapterDesc: 'Navigate everyday situations and basic needs.',
    title: 'Daily Needs & Small Talk',
    desc: 'Express what you want and understand responses.',
    color: '#10B981',
    iconName: 'Sun',
    words: [
      { pt: "Sim", en: "Yes", phonetic: "sing" },
      { pt: "Não", en: "No", phonetic: "nowng" },
      { pt: "Por favor", en: "Please", phonetic: "poor fah-VOHR" },
      { pt: "Com licença", en: "Excuse me", phonetic: "kom lee-SEN-sah" },
      { pt: "Desculpe", en: "Sorry", phonetic: "des-KOOL-peh" },
      { pt: "Eu quero...", en: "I want...", phonetic: "eh-oo KEH-roo" },
      { pt: "Eu gosto de...", en: "I like...", phonetic: "eh-oo GOSH-too deh" },
      { pt: "Não compreendo", en: "I don't understand", phonetic: "nowng kom-pree-EN-doo" },
      { pt: "Fala inglês?", en: "Do you speak English?", phonetic: "FAH-lah een-GLESH" },
      { pt: "Mais devagar", en: "Slower", phonetic: "mysh de-vah-GAR" },
      { pt: "Onde é...?", en: "Where is...?", phonetic: "OHND eh" },
      { pt: "A casa de banho", en: "The bathroom", phonetic: "ah KAH-zah de BAHN-yoo" },
      { pt: "Hoje", en: "Today", phonetic: "OH-zh" },
      { pt: "Amanhã", en: "Tomorrow", phonetic: "ah-man-YAHNG" },
      { pt: "Sempre", en: "Always", phonetic: "SEM-pr" }
    ]
  },
  unit3: {
    id: 'unit3',
    chapterNum: 3,
    chapterTitle: 'Chapter 3: Food & Dining',
    chapterDesc: 'Order food, ask for the bill, and enjoy Portuguese cuisine.',
    title: 'At the Restaurant',
    desc: 'Everything you need to eat out in Portugal.',
    color: '#F59E0B',
    iconName: 'Coffee',
    words: [
      { pt: "O menu", en: "The menu", phonetic: "oo meh-NOO" },
      { pt: "Água", en: "Water", phonetic: "AH-gwah" },
      { pt: "Café", en: "Coffee", phonetic: "kah-FEH" },
      { pt: "Cerveja", en: "Beer", phonetic: "ser-VAY-zhah" },
      { pt: "Vinho", en: "Wine", phonetic: "VEEN-yoo" },
      { pt: "Pão", en: "Bread", phonetic: "powng" },
      { pt: "Queijo", en: "Cheese", phonetic: "KAY-zhoo" },
      { pt: "Carne", en: "Meat", phonetic: "KARN" },
      { pt: "Peixe", en: "Fish", phonetic: "PAY-sh" },
      { pt: "Frango", en: "Chicken", phonetic: "FRAN-goo" },
      { pt: "Delicioso", en: "Delicious", phonetic: "de-lee-see-OH-zoo" },
      { pt: "A conta, por favor", en: "The bill, please", phonetic: "ah KOHN-tah, poor fah-VOHR" },
      { pt: "Quanto custa?", en: "How much does it cost?", phonetic: "KWAHN-too KOOSH-tah" },
      { pt: "Mais um", en: "One more", phonetic: "mysh oong" },
      { pt: "Sem açúcar", en: "Without sugar", phonetic: "seng ah-SOO-kar" }
    ]
  }
};
`;
fs.writeFileSync('src/data/portugueseData.ts', newData);

// --- 3. UPDATE LESSON ENGINE ---
let engine = fs.readFileSync('src/components/lesson/LessonEngine.tsx', 'utf8');

engine = engine.replace(
  "export const LessonEngine: React.FC<LessonEngineProps> = ({ unit, lessonIndex, onClose, onComplete }) => {",
  "export const LessonEngine: React.FC<LessonEngineProps> = ({ unit, lessonIndex, gameMode = 'guided', onClose, onComplete }) => {"
);

engine = engine.replace(
  "const [currentStage, setCurrentStage] = useState<LessonStage>('discover');",
  "const [currentStage, setCurrentStage] = useState<LessonStage>(gameMode === 'guided' ? 'discover' : (gameMode as LessonStage));"
);

engine = engine.replace(
  "const lessonWords = useMemo(() => {\n    const start = lessonIndex * WORDS_PER_LESSON;\n    // We sort the subset, or just take the slice. Let's take the exact slice so the curriculum is deterministic.\n    return unit.words.slice(start, start + WORDS_PER_LESSON);\n  }, [unit, lessonIndex]);",
  "const lessonWords = useMemo(() => {\n    if (gameMode !== 'guided') {\n      return [...unit.words].sort(() => Math.random() - 0.5).slice(0, 10);\n    }\n    const start = lessonIndex * WORDS_PER_LESSON;\n    return unit.words.slice(start, start + WORDS_PER_LESSON);\n  }, [unit, lessonIndex, gameMode]);"
);

engine = engine.replace(
  "const handleStageComplete = (nextStage: LessonStage | 'finish') => {\n    playSuccessSound();\n    if (nextStage === 'finish') {",
  "const handleStageComplete = (nextStage: LessonStage | 'finish') => {\n    playSuccessSound();\n    if (gameMode !== 'guided') {\n      onComplete();\n      return;\n    }\n    if (nextStage === 'finish') {"
);

fs.writeFileSync('src/components/lesson/LessonEngine.tsx', engine);

