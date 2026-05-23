import { NextResponse } from 'next/server';
import { getAllJournalMetas, calculateStreak } from '@/lib/data-utils';
import { writeJson } from '@/lib/storage';
import { getUserConfig } from '@/lib/user-config';

const META_PATH = 'data/meta.json';

export async function GET() {
  try {
    const metas = await getAllJournalMetas();
    const userConfig = await getUserConfig();
    const { current: currentStreak, longest: longestStreak } = calculateStreak(metas, userConfig.restDays);

    let totalEntries = metas.length;
    let totalWords = 0;
    const streakHistory: { date: string; hasEntry: boolean }[] = [];

    for (const m of metas) {
      totalWords += m.wordCount || 0;
      streakHistory.push({ date: m.slug, hasEntry: true });
    }

    // Add rest days to streak history
    for (const d of userConfig.restDays) {
      if (!streakHistory.find(s => s.date === d)) {
        streakHistory.push({ date: d, hasEntry: true });
      }
    }

    const meta = {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      totalEntries,
      totalWords,
      lastEntryDate: metas.length > 0 ? metas[0].slug : null,
      achievements: [],
      streakHistory,
    };

    await writeJson(META_PATH, meta);

    return NextResponse.json({
      success: true,
      meta,
      env: {
        vercelRegion: process.env.VERCEL_REGION || '(not set)',
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message, env: {
      vercelRegion: process.env.VERCEL_REGION || '(not set)',
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    }}, { status: 500 });
  }
}
