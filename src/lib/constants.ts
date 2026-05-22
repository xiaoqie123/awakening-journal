import { MoodLevel, Category } from './types';

export const MOOD_LABELS: Record<MoodLevel, string> = {
  1: '低落',
  2: '疲惫',
  3: '平静',
  4: '充实',
  5: '高涨',
};

export const MOOD_EMOJI: Record<MoodLevel, string> = {
  1: '😔',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😊',
};

export const CATEGORIES: Category[] = [
  '认知觉醒',
  '多巴胺管理',
  '财富心态',
  '元认知',
  '冥想与专注',
  '其他',
];
