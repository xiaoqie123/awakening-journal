import { NextResponse } from 'next/server';
import { getPrompts } from '@/lib/data-utils';

export async function GET() {
  const prompts = getPrompts();
  return NextResponse.json(prompts);
}
