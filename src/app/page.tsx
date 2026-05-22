import Link from 'next/link';
import { PenLine, Flame, BookOpen, TrendingUp, ArrowRight, Library } from 'lucide-react';
import { getSiteMeta, getRandomQuote, getPrompts } from '@/lib/data-utils';
import SubscribeForm from '@/components/SubscribeForm';

export default function HomePage() {
  const meta = getSiteMeta();
  const quote = getRandomQuote();
  const prompts = getPrompts();
  const todayPrompt = prompts[Math.floor(Math.random() * prompts.length)] ||
    { id: 'default', text: '今天我觉察到了什么？' };

  const isRareQuote = quote.rarity === 'epic' || quote.rarity === 'legendary';

  return (
    <div className="space-y-10">
      {/* ===== Hero / Prompt ===== */}
      <section className="text-center py-8 sm:py-16">
        <p className="text-sm uppercase tracking-widest text-sage-500 dark:text-sage-400 mb-4">
          每日觉醒记录
        </p>
        <h1 className="text-2xl sm:text-3xl font-heading font-medium text-ink dark:text-[#E8E6E3] mb-3 max-w-reading mx-auto leading-relaxed">
          「{todayPrompt.text}」
        </h1>
        <p className="text-ink-muted dark:text-[#9A9A9E] mb-8 text-sm">
          哪怕只写一句话，觉察就已发生。
        </p>

        {/* Fogg Behavior Model: large CTA reduces friction */}
        <Link
          href="/write"
          className="
            inline-flex items-center gap-3 px-8 py-4
            bg-sage-500 hover:bg-sage-600 dark:bg-sage-400 dark:hover:bg-sage-300
            text-white dark:text-deep-900
            rounded-2xl text-lg font-medium
            shadow-lg shadow-sage-500/20 dark:shadow-sage-400/20
            hover:shadow-xl hover:shadow-sage-500/30
            transform hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300
          "
        >
          <PenLine size={22} />
          <span>开始今日觉醒记录</span>
          <ArrowRight size={18} className="animate-pulse-gentle" />
        </Link>
      </section>

      {/* ===== Stats cards ===== */}
      <section className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Streak */}
        <div className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 shadow-sm border border-warm-200 dark:border-deep-700 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-ink-muted dark:text-[#9A9A9E] text-sm mb-2">
            <Flame size={16} className="text-gold-500" />
            <span>连续记录</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-ink dark:text-[#E8E6E3]">
            {meta.currentStreak}
            <span className="text-lg font-normal text-ink-muted ml-1">天</span>
          </p>
          {meta.currentStreak > 0 && (
            <p className="text-xs text-verdant-500 mt-1">
              🔥 Streak 进行中
            </p>
          )}
        </div>

        {/* Total words */}
        <div className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 shadow-sm border border-warm-200 dark:border-deep-700 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-ink-muted dark:text-[#9A9A9E] text-sm mb-2">
            <BookOpen size={16} />
            <span>总字数</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-ink dark:text-[#E8E6E3]">
            {meta.totalWords.toLocaleString()}
          </p>
          <p className="text-xs text-ink-muted mt-1">
            {meta.totalEntries} 篇日记
          </p>
        </div>
      </section>

      {/* ===== Wisdom quote (variable reward) ===== */}
      <section>
        <div
          className={`
            relative overflow-hidden rounded-2xl p-6 sm:p-8
            bg-white dark:bg-deep-800
            border border-warm-200 dark:border-deep-700
            shadow-sm
            ${isRareQuote ? 'border-sage-300 dark:border-sage-500/30' : ''}
          `}
        >
          {isRareQuote && (
            <div
              className="absolute inset-0 opacity-20 bg-gradient-to-r from-sage-300 via-gold-300 to-aura-purple animate-aurora"
              style={{ backgroundSize: '200% 200%' }}
            />
          )}

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-wider text-ink-light dark:text-[#6B6B70] mb-3">
              ✨ 今日智慧语录
              {quote.rarity === 'legendary' && ' — 稀有启示'}
              {quote.rarity === 'epic' && ' — 珍贵洞见'}
            </p>
            <blockquote className="text-lg sm:text-xl text-ink dark:text-[#E8E6E3] leading-relaxed mb-3 font-body italic max-w-reading">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <cite className="text-sm text-ink-muted dark:text-[#9A9A9E] not-italic">
              —— {quote.author}
              {quote.source && <span>，《{quote.source}》</span>}
            </cite>
          </div>
        </div>
      </section>

      {/* ===== Quick links ===== */}
      <section className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard"
          className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-deep-800 border border-warm-200 dark:border-deep-700 hover:border-sage-300 dark:hover:border-sage-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-sage-500" />
            <span className="text-sm font-medium">查看成长仪表盘</span>
          </div>
          <ArrowRight size={16} className="text-ink-light group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/library"
          className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-deep-800 border border-warm-200 dark:border-deep-700 hover:border-sage-300 dark:hover:border-sage-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Library size={18} className="text-sage-500" />
            <span className="text-sm font-medium">浏览内容图书馆</span>
          </div>
          <ArrowRight size={16} className="text-ink-light group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* ===== Subscribe ===== */}
      <section className="bg-white dark:bg-deep-800 rounded-2xl p-6 sm:p-8 border border-warm-200 dark:border-deep-700">
        <h2 className="text-lg font-heading font-medium mb-2">📬 订阅觉醒周报</h2>
        <p className="text-sm text-ink-muted dark:text-[#9A9A9E] mb-4">
          每周一封邮件，分享觉醒心得、认知科学精华和实践方法。不打扰，可随时退订。
        </p>
        <SubscribeForm />
      </section>
    </div>
  );
}
