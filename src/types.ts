export interface VocabWord {
  pt: string;
  en: string;
  phonetic?: string;
  nepali?: string;
  nepaliPhonetic?: string;
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

export interface DailyQuest {
  id: string;
  title: string;
  titlePt: string;
  description: string;
  nepaliHint: string;
  icon: string;
  target: number;
  current: number;
  rewardXP: number;
  rewardCoins: number;
  rewardGems: number;
  isClaimed: boolean;
  type: 'xp' | 'quiz' | 'survival' | 'cashier' | 'map' | 'weakWords' | 'perfect';
}

export type SRSReviewQuality = 'again' | 'hard' | 'good' | 'easy';

export interface SRSItem {
  wordPt: string;
  en: string;
  phonetic?: string;
  nepali?: string;
  level: number; // 0 to 5 (0: New/Due, 1: 1d, 2: 3d, 3: 7d, 4: 14d, 5: 30d/Mature)
  intervalDays: number;
  lastReviewedAt: string; // ISO string
  nextReviewAt: string; // YYYY-MM-DD
  repetitions: number;
  easeFactor: number;
  lapses: number;
  history?: Array<{
    date: string;
    quality: SRSReviewQuality;
  }>;
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
  srsRecords?: Record<string, SRSItem>;
  todayXP: number;
  dailyGoalXP: number;
  remindersEnabled: boolean;
  themeDark: boolean;
  streakFrozen?: boolean;
  hasSeenOnboarding?: boolean;
  completedUnits: string[];
  completedLessons?: Record<string, number>;
  quests?: Record<string, { current: number; isClaimed: boolean; date: string }>;
  dailyQuestsDate?: string;
  streakFreezeCount?: number;
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
  | 'auth'
  | 'study'
  | 'lovePhrases'
  | 'flashcards'
  | 'story'
  | 'quiz'
  | 'memory'
  | 'culture'
  | 'wardrobe'
  | 'chat'
  | 'vault'
  | 'reminders'
  | 'survival'
  | 'nepaliBridge'
  | 'map'
  | 'cashier'
  | 'quests';
