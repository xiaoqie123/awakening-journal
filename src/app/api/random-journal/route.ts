import { NextResponse } from 'next/server';
import { getRandomJournal } from '@/lib/data-utils';
import { getSessionUserId } from '@/lib/auth/session';

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  try {
    const entry = await getRandomJournal(userId);
    if (!entry) {
      return NextResponse.json({ slug: null }, { status: 404 });
    }
    return NextResponse.json({ slug: entry.meta.slug });
  } catch {
    return NextResponse.json({ slug: null }, { status: 500 });
  }
}
