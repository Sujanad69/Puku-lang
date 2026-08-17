import fs from 'fs';

const data = `import { Unit } from '../types';

export const UNITS_DATA: Record<string, Unit> = {
  unit1: {
    id: 'unit1', chapterNum: 1, chapterTitle: 'Chapter 1: The Absolute Basics',
    chapterDesc: 'Greetings & Politeness (Phrases 1-10)',
    title: 'Greetings & Politeness', desc: 'Hello, please, and thank you.', color: '#3B82F6', iconName: 'MessageSquare',
    words: [
      { pt: "Olá", en: "Hello", phonetic: "oh-LAH" },
      { pt: "Bom dia", en: "Good morning", phonetic: "bom DEE-ah" },
      { pt: "Boa tarde", en: "Good afternoon", phonetic: "BOH-ah TAR-deh" },
      { pt: "Boa noite", en: "Good night", phonetic: "BOH-ah NOY-teh" },
      { pt: "Tudo bem?", en: "How are you? / All good?", phonetic: "TOO-doo beng" },
      { pt: "Por favor", en: "Please", phonetic: "poor fah-VOHR" },
      { pt: "Obrigado", en: "Thank you (said by man)", phonetic: "oh-bree-GAH-doo" },
      { pt: "Obrigada", en: "Thank you (said by woman)", phonetic: "oh-bree-GAH-dah" },
      { pt: "Com licença", en: "Excuse me", phonetic: "kom lee-SEN-sah" },
      { pt: "Desculpe", en: "Sorry", phonetic: "des-KOOL-peh" }
    ]
  },
  unit2: {
    id: 'unit2', chapterNum: 2, chapterTitle: 'Chapter 2: Introductions & Survival',
    chapterDesc: 'Who are you? (Phrases 11-20)',
    title: 'Introductions & Survival', desc: 'Making yourself understood.', color: '#10B981', iconName: 'User',
    words: [
      { pt: "Como te chamas?", en: "What is your name?", phonetic: "KOH-moo teh SHAH-mash" },
      { pt: "Chamo-me...", en: "My name is...", phonetic: "SHAH-moo-meh" },
      { pt: "Muito prazer", en: "Nice to meet you", phonetic: "MWIN-too pra-ZEHR" },
      { pt: "Fala inglês?", en: "Do you speak English?", phonetic: "FAH-lah een-GLESH" },
      { pt: "Mais devagar, por favor", en: "Slower, please", phonetic: "mysh de-vah-GAR" },
      { pt: "Não compreendo", en: "I don't understand", phonetic: "nowng kom-pree-EN-doo" },
      { pt: "Não falo português", en: "I don't speak Portuguese", phonetic: "nowng FAH-loo poor-too-GHESH" },
      { pt: "Como se diz...?", en: "How do you say...?", phonetic: "KOH-moo seh deesh" },
      { pt: "Sim", en: "Yes", phonetic: "sing" },
      { pt: "Não", en: "No", phonetic: "nowng" }
    ]
  },
  unit3: {
    id: 'unit3', chapterNum: 3, chapterTitle: 'Chapter 3: Essential Needs & Dining',
    chapterDesc: 'Eating and drinking (Phrases 21-30)',
    title: 'Essential Needs & Dining', desc: 'Cafes and restaurants.', color: '#F59E0B', iconName: 'Coffee',
    words: [
      { pt: "Onde é a casa de banho?", en: "Where is the bathroom?", phonetic: "OHND eh ah KAH-zah deh BAHN-yoo" },
      { pt: "Eu queria um café", en: "I would like a coffee", phonetic: "eh-oo KREE-ah oong kah-FEH" },
      { pt: "Uma água, por favor", en: "A water, please", phonetic: "OO-mah AH-gwah" },
      { pt: "A conta, por favor", en: "The bill, please", phonetic: "ah KOHN-tah" },
      { pt: "Quanto custa?", en: "How much does it cost?", phonetic: "KWAHN-too KOOSH-tah" },
      { pt: "É muito caro", en: "It's very expensive", phonetic: "eh MWIN-too KAH-roo" },
      { pt: "Multibanco?", en: "Do you take card?", phonetic: "mool-tee-BAHN-koo" },
      { pt: "Delicioso", en: "Delicious", phonetic: "deh-lee-see-OH-zoo" },
      { pt: "Estou com fome", en: "I am hungry", phonetic: "sh-TOH kom FOM" },
      { pt: "Saúde!", en: "Cheers! / Bless you!", phonetic: "sah-OOD" }
    ]
  },
  unit4: {
    id: 'unit4', chapterNum: 4, chapterTitle: 'Chapter 4: Getting Around & Time',
    chapterDesc: 'Navigation and time words (Phrases 31-40)',
    title: 'Getting Around & Time', desc: 'Navigating Portugal.', color: '#EF4444', iconName: 'Map',
    words: [
      { pt: "Que horas são?", en: "What time is it?", phonetic: "keh OH-rash sowng" },
      { pt: "Hoje", en: "Today", phonetic: "OZH" },
      { pt: "Amanhã", en: "Tomorrow", phonetic: "ah-man-YAHNG" },
      { pt: "Ontem", en: "Yesterday", phonetic: "ON-teng" },
      { pt: "Onde é a estação?", en: "Where is the station?", phonetic: "OHND eh ah sh-tah-SOWNG" },
      { pt: "O bilhete", en: "The ticket", phonetic: "oo bee-LYEH-teh" },
      { pt: "Perto", en: "Near / Close", phonetic: "PEHR-too" },
      { pt: "Longe", en: "Far", phonetic: "LONZH" },
      { pt: "À esquerda", en: "To the left", phonetic: "ah sh-KEHR-dah" },
      { pt: "À direita", en: "To the right", phonetic: "ah dee-RAY-tah" }
    ]
  },
  unit5: {
    id: 'unit5', chapterNum: 5, chapterTitle: 'Chapter 5: Expressing Yourself',
    chapterDesc: 'Harder phrases and verbs (Phrases 41-50)',
    title: 'Expressing Yourself', desc: 'Opinions and actions.', color: '#8B5CF6', iconName: 'Sparkles',
    words: [
      { pt: "Eu gosto de Portugal", en: "I like Portugal", phonetic: "eh-oo GOSH-too deh poor-too-GAHL" },
      { pt: "Não gosto disso", en: "I don't like that", phonetic: "nowng GOSH-too DEE-soo" },
      { pt: "Eu não sei", en: "I don't know", phonetic: "eh-oo nowng say" },
      { pt: "O que é isto?", en: "What is this?", phonetic: "oo keh eh EESH-too" },
      { pt: "Eu preciso de ajuda", en: "I need help", phonetic: "eh-oo pre-SEE-zoo deh ah-ZHOO-dah" },
      { pt: "Estou a aprender", en: "I am learning", phonetic: "sh-TOH ah ah-pren-DEHR" },
      { pt: "O que vais fazer?", en: "What are you going to do?", phonetic: "oo keh vysh fah-ZEHR" },
      { pt: "Vou trabalhar", en: "I am going to work", phonetic: "voh trah-bah-LYAR" },
      { pt: "Eu acho que sim", en: "I think so", phonetic: "eh-oo AH-shoo keh sing" },
      { pt: "Amo-te", en: "I love you", phonetic: "AH-moo teh" }
    ]
  }
};

export const WORDS_OF_THE_DAY = [
  { pt: "Saudade", en: "A feeling of longing, melancholy, or nostalgia", phonetic: "sow-DAH-deh", type: "noun" },
  { pt: "Desenrascanço", en: "The ability to solve a problem without adequate tools", phonetic: "de-zen-rahs-KAHN-soo", type: "noun" },
  { pt: "Cafuné", en: "The act of running your fingers through someone's hair", phonetic: "kah-foo-NEH", type: "noun" },
  { pt: "Apaixonar", en: "To fall in love", phonetic: "ah-py-shoo-NAR", type: "verb" }
];

export const CULTURE_ARTICLES = [
  {
    id: "greetings",
    title: "The Art of the Double Kiss",
    emoji: "😘",
    summary: "How to greet people in Portugal without making things awkward.",
    content: "In Portugal, the standard greeting between women, or a man and a woman, is two kisses on the cheeks, starting with the right cheek. Men typically shake hands with other men.",
    audioPhrase: "Dois beijinhos",
    audioEn: "Two kisses"
  },
  {
    id: "coffee",
    title: "How to Order Coffee",
    emoji: "☕",
    summary: "A 'bica', a 'meia de leite', or a 'galão'? Learn the coffee code.",
    content: "If you want an espresso in Lisbon, ask for a 'bica'. In Porto, it's a 'cimbalino'. A 'galão' is a tall glass of milky coffee, and a 'meia de leite' is half milk, half coffee in a cup.",
    audioPhrase: "Queria uma bica, por favor",
    audioEn: "I'd like an espresso, please"
  }
];

export const ALL_WORDS_FLAT = Object.values(UNITS_DATA).flatMap((u: any) => u.words);
`;

fs.writeFileSync('src/data/portugueseData.ts', data);
