import matter from 'gray-matter';
import { JournalEntry, JournalMeta, SiteMeta, Quote, Prompt, Achievement } from './types';
import { readFile, writeFile, readJson, writeJson, fileExists, listDir } from './storage';

// ===== Path helpers =====
function journalDir(userId: string) { return `data/users/${userId}/journal`; }
function metaPath(userId: string) { return `data/users/${userId}/meta.json`; }
function cachePath(userId: string) { return `data/users/${userId}/journal-cache.json`; }
const QUOTES_PATH = 'data/quotes.json';
const PROMPTS_PATH = 'data/prompts.json';
const ACHIEVEMENTS_PATH = 'data/achievements.json';
const FOOTPRINTS_PATH = 'data/footprints.json';

// ===== Journal cache (avoids N+1 blob reads) =====

function extractSnippet(content: string, maxLen = 100): string {
  return content
    .trim()
    .replace(/^#.*$/gm, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, maxLen)
    .replace(/\\s+\\S*$/, '');
}

async function readJournalCache(userId: string): Promise<JournalMeta[] | null> {
  try {
    if (await fileExists(cachePath(userId))) {
      return await readJson<JournalMeta[]>(cachePath(userId));
    }
  } catch { /* cache corrupted, rebuild */ }
  return null;
}

async function writeJournalCache(userId: string, metas: JournalMeta[]): Promise<void> {
  await writeJson(cachePath(userId), metas);
}

async function buildJournalMetas(userId: string): Promise<JournalMeta[]> {
  const dir = journalDir(userId);
  const files = await listDir(dir);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  const metas: JournalMeta[] = [];
  for (const file of mdFiles) {
    const raw = await readFile(file);
    const { data, content } = matter(raw);
    const slug = file.replace(`${dir}/`, '').replace('.md', '');
    metas.push({
      slug,
      title: data.title || undefined,
      snippet: extractSnippet(content),
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

// ===== Journal reading =====

export async function getAllJournalMetas(userId: string): Promise<JournalMeta[]> {
  const cached = await readJournalCache(userId);
  if (cached) return cached;

  const metas = await buildJournalMetas(userId);
  await writeJournalCache(userId, metas);
  return metas;
}

export async function invalidateJournalCache(userId: string): Promise<void> {
  const metas = await buildJournalMetas(userId);
  await writeJournalCache(userId, metas);
}

export async function getJournalBySlug(userId: string, slug: string): Promise<JournalEntry | null> {
  const filePath = `${journalDir(userId)}/${slug}.md`;
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

export async function getRandomJournal(userId: string): Promise<JournalEntry | null> {
  const metas = await getAllJournalMetas(userId);
  if (metas.length === 0) return null;
  const randomMeta = metas[Math.floor(Math.random() * metas.length)];
  return getJournalBySlug(userId, randomMeta.slug);
}

// ===== Site metadata =====

export async function getSiteMeta(userId: string): Promise<SiteMeta> {
  const p = metaPath(userId);
  if (!(await fileExists(p))) {
    const defaultMeta: SiteMeta = {
      currentStreak: 0,
      longestStreak: 0,
      totalEntries: 0,
      totalWords: 0,
      lastEntryDate: null,
      achievements: [],
      streakHistory: [],
    };
    await writeJson(p, defaultMeta);
    return defaultMeta;
  }
  return readJson<SiteMeta>(p);
}

export async function updateSiteMeta(userId: string, updates: Partial<SiteMeta>): Promise<SiteMeta> {
  const current = await getSiteMeta(userId);
  const updated = { ...current, ...updates };
  await writeJson(metaPath(userId), updated);
  return updated;
}

// ===== Reward system data (shared — no userId) =====

export async function getQuotes(): Promise<Quote[]> {
  if (!(await fileExists(QUOTES_PATH))) return [];
  return readJson<Quote[]>(QUOTES_PATH);
}

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

// ===== Utility =====

export function calculateStreak(
  metas: JournalMeta[],
  restDays: string[] = [],
): { current: number; longest: number } {
  const allDates = new Set([...metas.map(m => m.slug), ...restDays]);

  if (metas.length === 0 && restDays.length === 0) return { current: 0, longest: 0 };

  const dates = [...allDates].sort().reverse();

  let longest = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let current = 0;
  const hasToday = allDates.has(today);
  const hasYesterday = allDates.has(yesterday);

  if (hasToday || hasYesterday) {
    current = 1;
    const startDate = hasToday ? today : yesterday;
    let checkDate = new Date(startDate);

    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const dateStr = checkDate.toISOString().slice(0, 10);
      if (allDates.has(dateStr)) {
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
