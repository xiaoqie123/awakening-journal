'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Shuffle, Filter, X, ChevronRight } from 'lucide-react';
import { JournalMeta, Category } from '@/lib/types';

const CATEGORIES: Category[] = ['认知觉醒', '多巴胺管理', '财富心态', '元认知', '冥想与专注', '其他'];

const MOOD_EMOJI: Record<number, string> = {
  1: '😔',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😊',
};

interface Props {
  metas: JournalMeta[];
}

export default function LibraryClient({ metas }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    let result = metas;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.title?.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q)) ||
        m.category.includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter(m => m.category === selectedCategory);
    }

    return result;
  }, [metas, search, selectedCategory]);

  const handleRandom = async () => {
    try {
      const res = await fetch('/api/random-journal');
      if (res.redirected) {
        router.push(res.url);
      } else {
        const data = await res.json();
        if (data.slug) router.push(`/library/${data.slug}`);
      }
    } catch {
      // Fallback: pick from current list
      if (metas.length > 0) {
        const random = metas[Math.floor(Math.random() * metas.length)];
        router.push(`/library/${random.slug}`);
      }
    }
  };

  return (
    <div className="max-w-reading mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-medium">内容图书馆</h1>
        <button
          onClick={handleRandom}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-400/20 hover:bg-gold-400/30 dark:bg-gold-500/10 dark:hover:bg-gold-500/20 text-gold-600 dark:text-gold-400 text-sm font-medium transition-colors"
        >
          <Shuffle size={16} />
          <span className="hidden sm:inline">随机穿越</span>
        </button>
      </div>

      {/* Search + filter */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索标题、标签、分类..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-deep-800 border border-warm-200 dark:border-deep-700 text-sm text-ink dark:text-[#E8E6E3] placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-sage-500 text-white'
                : 'bg-warm-200 dark:bg-deep-700 text-ink-muted hover:bg-warm-300 dark:hover:bg-deep-600'
            }`}
          >
            全部
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-sage-500 text-white'
                  : 'bg-warm-200 dark:bg-deep-700 text-ink-muted hover:bg-warm-300 dark:hover:bg-deep-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-ink-light">
        {filtered.length} 篇记录
        {selectedCategory && ` · 分类: ${selectedCategory}`}
        {search && ` · 搜索: "${search}"`}
      </p>

      {/* Entry list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-muted dark:text-[#9A9A9E]">
          <p className="text-lg mb-2">📭 暂无记录</p>
          <p className="text-sm">
            {metas.length === 0 ? '开始你的第一篇觉醒日记吧' : '试试调整筛选条件'}
          </p>
          {metas.length === 0 && (
            <Link
              href="/write"
              className="inline-block mt-4 px-4 py-2 rounded-xl bg-sage-500 text-white text-sm"
            >
              开始记录
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(entry => (
            <Link
              key={entry.slug}
              href={`/library/${entry.slug}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-deep-800 border border-warm-200 dark:border-deep-700 hover:border-sage-300 dark:hover:border-sage-500/30 hover:shadow-sm transition-all group"
            >
              {/* Mood emoji */}
              <span className="text-2xl flex-shrink-0">
                {MOOD_EMOJI[entry.mood] || '😐'}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink dark:text-[#E8E6E3] truncate">
                  {entry.title || entry.slug}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-ink-light">{entry.slug}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-sage-50 dark:bg-sage-500/10 text-sage-600 dark:text-sage-400">
                    {entry.category}
                  </span>
                  <span className="text-xs text-ink-light">{entry.wordCount} 字</span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight size={16} className="text-ink-light flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
