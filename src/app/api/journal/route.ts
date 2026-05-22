import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSiteMeta, updateSiteMeta, getRandomQuote, calculateStreak, getAllJournalMetas } from '@/lib/data-utils';
import { Quote, MoodLevel, Category } from '@/lib/types';

const JOURNAL_DIR = path.join(process.cwd(), 'data', 'journal');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, mood, category, tags, prompt } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
    }

    if (!fs.existsSync(JOURNAL_DIR)) {
      fs.mkdirSync(JOURNAL_DIR, { recursive: true });
    }

    const today = new Date();
    const slug = today.toISOString().slice(0, 10);
    const wordCount = content.replace(/\s/g, '').length;

    // Build YAML frontmatter
    const frontmatter = {
      title: prompt || '觉醒记录',
      category: category || '其他',
      tags: tags || [],
      mood: mood || 3,
      wordCount,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
    };

    const yaml = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:\n  - ${value.join('\n  - ')}`;
        }
        return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
      })
      .join('\n');

    const fileContent = `---\n${yaml}\n---\n\n${content.trim()}\n`;

    const filePath = path.join(JOURNAL_DIR, `${slug}.md`);
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    // Update site metadata
    const currentMeta = getSiteMeta();
    const allMetas = getAllJournalMetas();
    const { current: newStreak, longest: newLongest } = calculateStreak(allMetas);

    // Avoid double-counting if already wrote today
    const isNewEntry = currentMeta.lastEntryDate !== slug;

    const updatedMeta = updateSiteMeta({
      currentStreak: newStreak,
      longestStreak: Math.max(currentMeta.longestStreak, newLongest),
      totalEntries: isNewEntry ? currentMeta.totalEntries + 1 : currentMeta.totalEntries,
      totalWords: currentMeta.totalWords + wordCount,
      lastEntryDate: slug,
      streakHistory: [
        ...currentMeta.streakHistory,
        { date: slug, hasEntry: true },
      ],
    });

    // Variable reward
    const reward: Quote = getRandomQuote();

    // Check for milestone achievements
    const newAchievements: string[] = [];
    if (newStreak === 7) newAchievements.push('7天觉醒者');
    if (newStreak === 21) newAchievements.push('21天元认知践行者');
    if (updatedMeta.totalWords >= 10000 && currentMeta.totalWords < 10000) newAchievements.push('万字觉醒');

    return NextResponse.json({
      success: true,
      slug,
      reward,
      newAchievements,
      streak: newStreak,
    });
  } catch (error) {
    console.error('保存日记失败:', error);
    return NextResponse.json({ error: '保存失败' }, { status: 500 });
  }
}
