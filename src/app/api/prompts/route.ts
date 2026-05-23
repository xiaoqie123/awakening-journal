import { NextResponse } from 'next/server';
import { getPrompts } from '@/lib/data-utils';

export async function GET() {
  const prompts = await getPrompts();
  return NextResponse.json(prompts);
}
