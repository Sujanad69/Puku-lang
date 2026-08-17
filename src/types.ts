export interface VocabWord {
  pt: string;
  en: string;
  phonetic?: string;
  note?: string;
  category?: string;
}

export interface Unit {
  id: string;
  chapterNum: number;
  chapterTitle: string;
  chapterDesc: string;
  title: string;
  desc: string;
  color: string;
  iconName: string;
  words: VocabWord[];
}

export interface OutfitItem {
  id: string;
  name: string;
  cost: number;
  currency: 'coin' | 'gem';
  thumb: string;
  url: string;
  description: string;
}

export interface UserProgress {
  xp: number;
  coins: number;
  gems: number;
  hearts: number;
  streak: number;
  lastPlayDate: string;
  purchasedOutfits: string[];
  currentOutfitId: string;
  weakWords: VocabWord[];
  masteredWords: string[];
  todayXP: number;
  dailyGoalXP: number;
  remindersEnabled: boolean;
  themeDark: boolean;
  streakFrozen?: boolean;
  hasSeenOnboarding?: boolean;
  completedUnits: string[];
  completedLessons?: Record<string, number>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'sujan';
  text: string;
  translation?: string;
  timestamp: string;
}

export type ActiveModal = 
  | 'none'
  | 'study'
  | 'flashcards'
  | 'story'
  | 'quiz'
  | 'memory'
  | 'culture'
  | 'wardrobe'
  | 'chat'
  | 'vault'
  | 'reminders';
