import { NextRequest, NextResponse } from 'next/server';
import { getUserConfig, updateUserConfig, getAvailableRestDays } from '@/lib/user-config';
import { getSessionUserId } from '@/lib/auth/session';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';

/** GET — check available rest days */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  try {
    const available = await getAvailableRestDays(userId);
    const config = await getUserConfig(userId);
    return NextResponse.json({
      available,
      used: config.restDaysUsed,
      max: 2,
      restDays: config.restDays,
      resetMonth: config.restDaysResetMonth,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST — request a rest day for today */
export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  // Rate limit: 5 requests per minute per IP
  const rlKey = getRateLimitKey(request);
  const rl = rateLimit(rlKey, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: '请求过于频繁，请稍后再试' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  try {
    const body = await request.json();
    const { date } = body;
    const targetDate = date || new Date().toISOString().slice(0, 10);

    const config = await getUserConfig(userId);
    const available = await getAvailableRestDays(userId);

    if (available <= 0) {
      return NextResponse.json(
        { error: '本月休日已用完（每月最多2天）' },
        { status: 400 },
      );
    }

    if (config.restDays.includes(targetDate)) {
      return NextResponse.json(
        { error: '该日期已是休日' },
        { status: 400 },
      );
    }

    const updated = await updateUserConfig(userId, {
      restDaysUsed: config.restDaysUsed + 1,
      restDays: [...config.restDays, targetDate],
    });

    return NextResponse.json({
      success: true,
      restDays: updated.restDays,
      used: updated.restDaysUsed,
      available: Math.max(0, 2 - updated.restDaysUsed),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
