import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { getJournalBySlug, getAllJournalMetas } from '@/lib/data-utils';
import { MOOD_LABELS } from '@/lib/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const metas = getAllJournalMetas();
  return metas.map(m => ({ slug: m.slug }));
}

export default async function JournalDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = getJournalBySlug(slug);

  if (!entry) notFound();

  return (
    <div className="max-w-reading mx-auto space-y-6">
      {/* Back nav */}
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-ink-muted dark:text-[#9A9A9E] hover:text-ink dark:hover:text-[#E8E6E3] transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        返回图书馆
      </Link>

      {/* Meta header */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-ink-light">
          <Calendar size={14} />
          <time dateTime={entry.meta.createdAt}>{entry.meta.slug}</time>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-medium text-ink dark:text-[#E8E6E3]">
          {entry.meta.title || '无标题'}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mood */}
          <span className="inline-flex items-center gap-1 text-sm text-ink-muted dark:text-[#9A9A9E]">
            情绪: {MOOD_LABELS[entry.meta.mood] || entry.meta.mood}/5
          </span>

          {/* Category */}
          <span className="px-2.5 py-0.5 rounded-full text-xs bg-sage-100 dark:bg-sage-500/20 text-sage-600 dark:text-sage-400">
            {entry.meta.category}
          </span>

          {/* Tags */}
          {entry.meta.tags.map(t => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-warm-200 dark:bg-deep-700 text-ink-muted"
            >
              <Tag size={10} />
              {t}
            </span>
          ))}
        </div>

        <div className="text-xs text-ink-light">
          {entry.meta.wordCount} 字
        </div>
      </header>

      {/* Divider */}
      <hr className="border-warm-200 dark:border-deep-700" />

      {/* Content */}
      <article className="prose-reading text-body-lg text-ink dark:text-[#E8E6E3] leading-[1.85] font-body whitespace-pre-wrap">
        {entry.content}
      </article>

      {/* Footer nav */}
      <footer className="pt-8 border-t border-warm-200 dark:border-deep-700 flex justify-between">
        <Link
          href="/library"
          className="text-sm text-sage-500 hover:text-sage-600 dark:text-sage-400 transition-colors"
        >
          ← 返回图书馆
        </Link>
        <Link
          href="/write"
          className="text-sm text-sage-500 hover:text-sage-600 dark:text-sage-400 transition-colors"
        >
          继续记录 →
        </Link>
      </footer>
    </div>
  );
}
