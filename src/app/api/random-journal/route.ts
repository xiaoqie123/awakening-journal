import { NextResponse } from 'next/server';
import { getRandomJournal } from '@/lib/data-utils';

export async function GET() {
  try {
    const entry = await getRandomJournal();
    if (!entry) {
      return NextResponse.json({ slug: null }, { status: 404 });
    }
    return NextResponse.json({ slug: entry.meta.slug });
  } catch {
    return NextResponse.json({ slug: null }, { status: 500 });
  }
}
