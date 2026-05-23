import { describe, it, expect } from 'vitest';
import { calculateStreak } from '@/lib/data-utils';
import type { JournalMeta } from '@/lib/types';

function meta(slugs: string[]): JournalMeta[] {
  return slugs.map(slug => ({
    slug,
    category: '元认知' as const,
    tags: [],
    mood: 3 as const,
    wordCount: 100,
    createdAt: slug,
    updatedAt: slug,
  }));
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

describe('calculateStreak', () => {
  it('returns 0/0 for empty input', () => {
    const result = calculateStreak([]);
    expect(result).toEqual({ current: 0, longest: 0 });
  });

  it('counts today entry as streak 1', () => {
    const today = daysAgo(0);
    const result = calculateStreak(meta([today]));
    expect(result.current).toBe(1);
  });

  it('counts yesterday entry as streak 1 (grace period)', () => {
    const yesterday = daysAgo(1);
    const result = calculateStreak(meta([yesterday]));
    expect(result.current).toBe(1);
  });

  it('does not count 2 days ago as current streak', () => {
    const twoDaysAgo = daysAgo(2);
    const result = calculateStreak(meta([twoDaysAgo]));
    expect(result.current).toBe(0);
  });

  it('counts consecutive days as streak', () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(2)];
    const result = calculateStreak(meta(dates));
    expect(result.current).toBe(3);
  });

  it('breaks streak on gap', () => {
    const dates = [daysAgo(0), daysAgo(1), daysAgo(3), daysAgo(4)];
    const result = calculateStreak(meta(dates));
    expect(result.current).toBe(2);
    expect(result.longest).toBeGreaterThanOrEqual(2);
  });

  it('rest day bridges the streak gap', () => {
    const dates = [daysAgo(0), daysAgo(1)];
    const restDays = [daysAgo(2)];
    const result = calculateStreak(meta(dates), restDays);
    expect(result.current).toBe(3);
  });

  it('rest day only (no entry) still counts as active day', () => {
    const restDays = [daysAgo(0)];
    const result = calculateStreak([], restDays);
    expect(result.current).toBe(1);
  });

  it('multiple rest days in a row bridge consecutive gaps', () => {
    const dates = [daysAgo(0)];
    const restDays = [daysAgo(1), daysAgo(2)];
    const result = calculateStreak(meta(dates), restDays);
    expect(result.current).toBe(3);
  });

  it('rest day before today with no entry today still counts', () => {
    const yesterday = daysAgo(1);
    const restDays = [daysAgo(0)]; // rest today
    const result = calculateStreak(meta([yesterday]), restDays);
    expect(result.current).toBe(2);
  });

  it('tracks longest streak across gaps', () => {
    // 7-day streak → gap → 3-day streak (current)
    const oldStreak = [daysAgo(10), daysAgo(11), daysAgo(12), daysAgo(13), daysAgo(14), daysAgo(15), daysAgo(16)];
    const newStreak = [daysAgo(0), daysAgo(1), daysAgo(2)];
    const result = calculateStreak(meta([...oldStreak, ...newStreak]));
    expect(result.current).toBe(3);
    expect(result.longest).toBe(7);
  });

  it('rest days do not inflate longest streak artificially', () => {
    // 3 entries over 5 days with 2 rest days = 5-day streak
    const dates = [daysAgo(0), daysAgo(1), daysAgo(4)];
    const restDays = [daysAgo(2), daysAgo(3)];
    const result = calculateStreak(meta(dates), restDays);
    expect(result.current).toBe(5);
    expect(result.longest).toBe(5);
  });
});
