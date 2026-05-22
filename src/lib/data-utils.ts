import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { JournalEntry, JournalMeta, SiteMeta, Quote, Prompt, Achievement } from './types';

// ===== Path configuration =====
const DATA_DIR = path.join(process.cwd(), 'data');
const JOURNAL_DIR = path.join(DATA_DIR, 'journal');
const META_PATH = path.join(DATA_DIR, 'meta.json');
const QUOTES_PATH = path.join(DATA_DIR, 'quotes.json');
const PROMPTS_PATH = path.join(DATA_DIR, 'prompts.json');
const ACHIEVEMENTS_PATH = path.join(DATA_DIR, 'achievements.json');
const FOOTPRINTS_PATH = path.join(DATA_DIR, 'footprints.json');

// ===== Journal reading =====

/** Get all journal metadata, sorted by date descending */
export function getAllJournalMetas(): JournalMeta[] {
  ensureDir(JOURNAL_DIR);
  const files = fs.readdirSync(JOURNAL_DIR).filter(f => f.endsWith('.md'));

  const metas: JournalMeta[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(JOURNAL_DIR, file), 'utf-8');
    const { data } = matter(raw);
    metas.push({
      slug: file.replace('.md', ''),
      title: data.title || undefined,
      category: data.category || '其他',
      tags: data.tags || [],
      mood: data.mood || 3,
      wordCount: data.wordCount || 0,
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || data.createdAt || '',
    });
  }

  return metas.sort((a, b) => b.slug.localeCompare(a.slug));
}

/** Get a single journal entry by slug */
export function getJournalBySlug(slug: string): JournalEntry | null {
  const filePath = path.join(JOURNAL_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title || undefined,
      category: data.category || '其他',
      tags: data.tags || [],
      mood: data.mood || 3,
      wordCount: data.wordCount || content.length,
      createdAt: data.createdAt || slug,
      updatedAt: data.updatedAt || data.createdAt || slug,
    },
    content: content.trim(),
  };
}

/** Get a random past journal entry */
export function getRandomJournal(): JournalEntry | null {
  const metas = getAllJournalMetas();
  if (metas.length === 0) return null;
  const randomMeta = metas[Math.floor(Math.random() * metas.length)];
  return getJournalBySlug(randomMeta.slug);
}

// ===== Site metadata =====

export function getSiteMeta(): SiteMeta {
  ensureDir(DATA_DIR);
  if (!fs.existsSync(META_PATH)) {
    const defaultMeta: SiteMeta = {
      currentStreak: 0,
      longestStreak: 0,
      totalEntries: 0,
      totalWords: 0,
      lastEntryDate: null,
      achievements: [],
      streakHistory: [],
    };
    fs.writeFileSync(META_PATH, JSON.stringify(defaultMeta, null, 2));
    return defaultMeta;
  }
  return JSON.parse(fs.readFileSync(META_PATH, 'utf-8'));
}

export function updateSiteMeta(updates: Partial<SiteMeta>): SiteMeta {
  const current = getSiteMeta();
  const updated = { ...current, ...updates };
  fs.writeFileSync(META_PATH, JSON.stringify(updated, null, 2));
  return updated;
}

// ===== Reward system data =====

export function getQuotes(): Quote[] {
  if (!fs.existsSync(QUOTES_PATH)) return [];
  return JSON.parse(fs.readFileSync(QUOTES_PATH, 'utf-8'));
}

/**
 * Variable reward: returns a random quote weighted by rarity
 * common: 70%, rare: 20%, epic: 8%, legendary: 2%
 */
export function getRandomQuote(): Quote {
  const quotes = getQuotes();
  if (quotes.length === 0) {
    return { id: 'default', text: '觉察是改变的开始。', author: '卡尔·荣格', rarity: 'common' };
  }

  const weighted = quotes.flatMap(q => {
    const weight =
      q.rarity === 'legendary' ? 2 :
      q.rarity === 'epic' ? 8 :
      q.rarity === 'rare' ? 20 : 70;
    return Array(weight).fill(q);
  });

  return weighted[Math.floor(Math.random() * weighted.length)];
}

export function getPrompts(): Prompt[] {
  if (!fs.existsSync(PROMPTS_PATH)) return [];
  return JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf-8')).filter((p: Prompt) => p.active);
}

export function getAchievements(): Achievement[] {
  if (!fs.existsSync(ACHIEVEMENTS_PATH)) return [];
  return JSON.parse(fs.readFileSync(ACHIEVEMENTS_PATH, 'utf-8'));
}

// ===== Utility functions =====

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Calculate current and longest streak from journal meta list */
export function calculateStreak(metas: JournalMeta[]): { current: number; longest: number } {
  if (metas.length === 0) return { current: 0, longest: 0 };

  const dates = metas.map(m => m.slug).sort().reverse();

  let longest = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Calculate current streak
  let current = 0;
  const hasToday = dates.includes(today);
  const hasYesterday = dates.includes(yesterday);

  if (hasToday || hasYesterday) {
    current = 1;
    const startDate = hasToday ? today : yesterday;
    let checkDate = new Date(startDate);

    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const dateStr = checkDate.toISOString().slice(0, 10);
      if (dates.includes(dateStr)) {
        current++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;

    if (Math.round(diff) === 1) {
      tempStreak++;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak);

  return { current, longest };
}
