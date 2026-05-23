import matter from 'gray-matter';
import { JournalEntry, JournalMeta, SiteMeta, Quote, Prompt, Achievement } from './types';
import { readFile, writeFile, readJson, writeJson, fileExists, listDir } from './storage';

// ===== Path configuration =====
const JOURNAL_DIR = 'data/journal';
const META_PATH = 'data/meta.json';
const QUOTES_PATH = 'data/quotes.json';
const PROMPTS_PATH = 'data/prompts.json';
const ACHIEVEMENTS_PATH = 'data/achievements.json';
const FOOTPRINTS_PATH = 'data/footprints.json';

// ===== Journal reading =====

/** Get all journal metadata, sorted by date descending */
export async function getAllJournalMetas(): Promise<JournalMeta[]> {
  const files = await listDir(JOURNAL_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  const metas: JournalMeta[] = [];
  for (const file of mdFiles) {
    const raw = await readFile(file);
    const { data } = matter(raw);
    const slug = file.replace(`${JOURNAL_DIR}/`, '').replace('.md', '');
    metas.push({
      slug,
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
export async function getJournalBySlug(slug: string): Promise<JournalEntry | null> {
  const filePath = `${JOURNAL_DIR}/${slug}.md`;
  if (!(await fileExists(filePath))) return null;

  const raw = await readFile(filePath);
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
export async function getRandomJournal(): Promise<JournalEntry | null> {
  const metas = await getAllJournalMetas();
  if (metas.length === 0) return null;
  const randomMeta = metas[Math.floor(Math.random() * metas.length)];
  return getJournalBySlug(randomMeta.slug);
}

// ===== Site metadata =====

export async function getSiteMeta(): Promise<SiteMeta> {
  if (!(await fileExists(META_PATH))) {
    const defaultMeta: SiteMeta = {
      currentStreak: 0,
      longestStreak: 0,
      totalEntries: 0,
      totalWords: 0,
      lastEntryDate: null,
      achievements: [],
      streakHistory: [],
    };
    await writeJson(META_PATH, defaultMeta);
    return defaultMeta;
  }
  return readJson<SiteMeta>(META_PATH);
}

export async function updateSiteMeta(updates: Partial<SiteMeta>): Promise<SiteMeta> {
  const current = await getSiteMeta();
  const updated = { ...current, ...updates };
  await writeJson(META_PATH, updated);
  return updated;
}

// ===== Reward system data =====

export async function getQuotes(): Promise<Quote[]> {
  if (!(await fileExists(QUOTES_PATH))) return [];
  return readJson<Quote[]>(QUOTES_PATH);
}

/**
 * Variable reward: returns a random quote weighted by rarity
 * common: 70%, rare: 20%, epic: 8%, legendary: 2%
 */
export async function getRandomQuote(): Promise<Quote> {
  const quotes = await getQuotes();
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

export async function getPrompts(): Promise<Prompt[]> {
  if (!(await fileExists(PROMPTS_PATH))) return [];
  const prompts = await readJson<Prompt[]>(PROMPTS_PATH);
  return prompts.filter(p => p.active);
}

export async function getAchievements(): Promise<Achievement[]> {
  if (!(await fileExists(ACHIEVEMENTS_PATH))) return [];
  return readJson<Achievement[]>(ACHIEVEMENTS_PATH);
}

// ===== Utility functions =====

/** Calculate current and longest streak from journal meta list (sync — pure computation) */
export function calculateStreak(metas: JournalMeta[]): { current: number; longest: number } {
  if (metas.length === 0) return { current: 0, longest: 0 };

  const dates = metas.map(m => m.slug).sort().reverse();

  let longest = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

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
