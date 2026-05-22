// ===== Core data types =====

/** Mood level 1-5 */
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

/** Journal categories */
export type Category =
  | '认知觉醒'
  | '多巴胺管理'
  | '财富心态'
  | '元认知'
  | '冥想与专注'
  | '其他';

/** Achievement rarity — affects dopamine reward intensity */
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

/** Achievement badge definition */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  condition: {
    type: 'streak' | 'total_words' | 'total_entries' | 'mood_streak' | 'category_master';
    threshold: number;
    category?: Category;
  };
  unlockedAt?: string;
}

/** Journal entry metadata */
export interface JournalMeta {
  slug: string;
  title?: string;
  category: Category;
  tags: string[];
  mood: MoodLevel;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Complete journal entry */
export interface JournalEntry {
  meta: JournalMeta;
  content: string;
}

/** Guided prompts */
export interface Prompt {
  id: string;
  text: string;
  category?: Category;
  active: boolean;
}

/** Wisdom quotes (variable reward) */
export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  rarity: Rarity;
}

/** Global site metadata */
export interface SiteMeta {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  totalWords: number;
  lastEntryDate: string | null;
  achievements: Achievement[];
  streakHistory: { date: string; hasEntry: boolean }[];
}

/** Anonymous footprint of fellow travelers */
export interface Footprint {
  id: string;
  displayName: string;
  streak: number;
  recentInsight: string;
  updatedAt: string;
}
