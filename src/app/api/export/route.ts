import { NextRequest, NextResponse } from 'next/server';
import { getAllJournalMetas, getJournalBySlug, getSiteMeta } from '@/lib/data-utils';
import { getUserConfig } from '@/lib/user-config';
import { getSessionUserId } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  try {
    const format = request.nextUrl.searchParams.get('format') || 'json';
    const metas = await getAllJournalMetas(userId);
    const siteMeta = await getSiteMeta(userId);
    const userConfig = await getUserConfig(userId);

    if (format === 'markdown') {
      const entries = await Promise.all(
        metas.map(m => getJournalBySlug(userId, m.slug)),
      );
      const mdParts = entries
        .filter(Boolean)
        .map(e => {
          const m = e!.meta;
          return `---
title: "${m.title || m.slug}"
date: ${m.createdAt}
mood: ${m.mood}
category: ${m.category}
tags: [${m.tags.join(', ')}]
---

${e!.content}

`;
        });

      const md = `# 觉醒日志 — 完整导出\n导出时间: ${new Date().toISOString()}\n\n---\n\n${mdParts.join('\n---\n\n')}`;

      return new NextResponse(md, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="awakening-journal-export.md"`,
        },
      });
    }

    const entries = await Promise.all(
      metas.map(async m => {
        const entry = await getJournalBySlug(userId, m.slug);
        return entry;
      }),
    );

    const exportData = {
      exportedAt: new Date().toISOString(),
      stats: {
        totalEntries: siteMeta.totalEntries,
        totalWords: siteMeta.totalWords,
        currentStreak: siteMeta.currentStreak,
        longestStreak: siteMeta.longestStreak,
      },
      config: {
        restDays: userConfig.restDays,
      },
      entries: entries.filter(Boolean),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="awakening-journal-export.json"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
