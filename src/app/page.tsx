import Link from 'next/link';
import { PenLine, Flame, TrendingUp, Library } from 'lucide-react';
import { getSiteMeta, getRandomQuote, getPrompts } from '@/lib/data-utils';
import { getUserConfig } from '@/lib/user-config';
import SubscribeForm from '@/components/SubscribeForm';
import RandomLookLink from '@/components/RandomLookLink';

export default async function HomePage() {
  const meta = await getSiteMeta();
  const quote = await getRandomQuote();
  const prompts = await getPrompts();
  const userConfig = await getUserConfig();
  const todayPrompt = prompts[Math.floor(Math.random() * prompts.length)] ||
    { id: 'default', text: '今天我觉察到了什么？' };

  const isRareQuote = quote.rarity === 'epic' || quote.rarity === 'legendary';

  return (
    <div className="space-y-8">
      {/* ===== Hero / Prompt (主视觉，居上) ===== */}
      <section className="text-center py-10 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-heading font-medium text-ink dark:text-[#E8E6E3] mb-4 max-w-reading mx-auto leading-relaxed">
          「{todayPrompt.text}」
        </h1>
        <p className="text-sm text-ink-muted dark:text-[#9A9A9E] mb-8">
          今天，从这里开始觉察。
        </p>

        {/* CTA button */}
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
          <span>开始记录</span>
        </Link>

        {/* Subtle random look link */}
        <div className="mt-3">
          <RandomLookLink />
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
            <p className="text-xs text-ink-light dark:text-[#6B6B70] mb-3">
              ✨ 智慧语录
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
      <section className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/dashboard"
          className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-deep-800 border border-warm-200 dark:border-deep-700 hover:border-sage-300 dark:hover:border-sage-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-sage-500" />
            <span className="text-sm">查看成长仪表盘</span>
          </div>
          <span className="text-xs text-ink-light group-hover:translate-x-1 transition-transform">→</span>
        </Link>

        <Link
          href="/library"
          className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-deep-800 border border-warm-200 dark:border-deep-700 hover:border-sage-300 dark:hover:border-sage-500/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Library size={18} className="text-sage-500" />
            <span className="text-sm">浏览内容图书馆</span>
          </div>
          <span className="text-xs text-ink-light group-hover:translate-x-1 transition-transform">→</span>
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

      {/* ===== Subtle streak indicator (底部弱化) ===== */}
      <div className="text-center py-4">
        <p className="text-xs text-ink-light dark:text-[#6B6B70] inline-flex items-center gap-1">
          <Flame size={12} className={meta.currentStreak > 0 ? 'text-gold-400' : 'text-ink-light'} />
          已连续记录 {meta.currentStreak} 天
          {userConfig.restDays.length > 0 && (
            <span className="text-ink-light/60">
              · 本月已休 {userConfig.restDaysUsed}/2 天
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
