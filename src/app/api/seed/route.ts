import { NextResponse } from 'next/server';
import { writeJson } from '@/lib/storage';
import quotes from '@/../data/quotes.json';
import prompts from '@/../data/prompts.json';
import achievements from '@/../data/achievements.json';
import footprints from '@/../data/footprints.json';

const META_PATH = 'data/meta.json';
const QUOTES_PATH = 'data/quotes.json';
const PROMPTS_PATH = 'data/prompts.json';
const ACHIEVEMENTS_PATH = 'data/achievements.json';
const FOOTPRINTS_PATH = 'data/footprints.json';
const USER_CONFIG_PATH = 'data/user-config.json';

export async function GET() {
  try {
    const defaultMeta = {
      currentStreak: 0,
      longestStreak: 0,
      totalEntries: 0,
      totalWords: 0,
      lastEntryDate: null,
      achievements: [],
      streakHistory: [],
    };

    const defaultUserConfig = {
      restDaysUsed: 0,
      restDaysResetMonth: '',
      restDays: [],
    };

    await writeJson(META_PATH, defaultMeta);
    await writeJson(QUOTES_PATH, quotes);
    await writeJson(PROMPTS_PATH, prompts);
    await writeJson(ACHIEVEMENTS_PATH, achievements);
    await writeJson(FOOTPRINTS_PATH, footprints);
    await writeJson(USER_CONFIG_PATH, defaultUserConfig);

    return NextResponse.json({ success: true, message: 'Seed data uploaded to Blob Store' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
