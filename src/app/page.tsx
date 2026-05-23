import Link from 'next/link';
import { PenLine, Flame, BookOpen, FileText, ChevronRight } from 'lucide-react';
import { getCachedSiteMeta, getCachedRandomQuote, getCachedPrompts, getCachedAllJournalMetas } from '@/lib/data-utils';
import { getUserConfig } from '@/lib/user-config';
import { verifySession } from '@/lib/auth/session';
import SubscribeForm from '@/components/SubscribeForm';
import RandomLookLink from '@/components/RandomLookLink';
import FootprintsBanner from '@/components/FootprintsBanner';
import MoodAtmosphere from '@/components/MoodAtmosphere';

export default async function HomePage() {
  const { userId } = await verifySession();
  const meta = await getCachedSiteMeta(userId);
  const quote = await getCachedRandomQuote();
  const prompts = await getCachedPrompts();
  const userConfig = await getUserConfig(userId);
  const allMetas = await getCachedAllJournalMetas(userId);
  const todayPrompt = prompts[Math.floor(Math.random() * prompts.length)] ||
    { id: 'default', text: '今天我觉察到了什么？' };

  const isRareQuote = quote.rarity === 'epic' || quote.rarity === 'legendary';
  const isNewUser = meta.totalEntries === 0;
  const latestMood = allMetas.length > 0 ? allMetas[0].mood : null;

  return (
    <>
      <MoodAtmosphere mood={latestMood} />
      <div className="space-y-8">
      {/* ===== Hero ===== */}
      <section className="text-center py-10 sm:py-16">
        {isNewUser ? (
          <>
            <div className="mb-6">
              <span className="text-4xl block mb-4">🌙</span>
              <h1 className="text-2xl sm:text-3xl font-heading font-medium text-ink dark:text-[#E8E6E3] mb-3">
                欢迎来到觉醒日志
              </h1>
              <p className="text-sm text-ink-muted dark:text-[#9A9A9E] mb-2 max-w-sm mx-auto leading-relaxed">
                这是一个属于你自己的安静角落。
              </p>
              <p className="text-sm text-ink-muted dark:text-[#9A9A9E] max-w-sm mx-auto leading-relaxed">
                没有点赞、没有关注、没有算法——只有你和你的觉察。
              </p>
            </div>

            <div className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 border border-warm-200 dark:border-deep-700 max-w-sm mx-auto mb-8 text-left">
              <p className="text-xs font-medium text-ink dark:text-[#E8E6E3] mb-3">✨ 从这里开始：</p>
              <ol className="space-y-2 text-xs text-ink-muted dark:text-[#9A9A9E] leading-relaxed">
                <li><span className="font-medium text-sage-500">1.</span> 每天回答一个引导问题，哪怕只写一句</li>
                <li><span className="font-medium text-sage-500">2.</span> 累了就申请休日——不中断记录，也不勉强自己</li>
                <li><span className="font-medium text-sage-500">3.</span> 随时翻看过去的自己，感受时间的力量</li>
              </ol>
            </div>

            <Link
              href="/write"
              className="inline-flex items-center gap-3 px-8 py-4 bg-sage-500 hover:bg-sage-600 dark:bg-sage-400 dark:hover:bg-sage-300 text-white dark:text-deep-900 rounded-2xl text-lg font-medium shadow-lg shadow-sage-500/20 dark:shadow-sage-400/20 hover:shadow-xl hover:shadow-sage-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <PenLine size={22} />
              <span>写下第一篇记录</span>
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-heading font-medium text-ink dark:text-[#E8E6E3] mb-3 max-w-reading mx-auto leading-relaxed">
              「{todayPrompt.text}」
            </h1>
            <p className="text-sm text-ink-muted dark:text-[#9A9A9E] mb-6">今天，从这里开始觉察。</p>

            <Link
              href="/write"
              className="inline-flex items-center gap-3 px-8 py-4 bg-sage-500 hover:bg-sage-600 dark:bg-sage-400 dark:hover:bg-sage-300 text-white dark:text-deep-900 rounded-2xl text-lg font-medium shadow-lg shadow-sage-500/20 dark:shadow-sage-400/20 hover:shadow-xl hover:shadow-sage-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <PenLine size={22} />
              <span>开始记录</span>
            </Link>

            <div className="mt-3">
              <RandomLookLink />
            </div>

            {/* Personal stats row */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-8">
              <div className="bg-white dark:bg-deep-800 rounded-xl p-3 border border-warm-200 dark:border-deep-700">
                <Flame size={18} className="text-gold-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-ink dark:text-[#E8E6E3]">{meta.currentStreak}<span className="text-xs font-normal text-ink-light">天</span></p>
                <p className="text-xs text-ink-light">连续</p>
              </div>
              <div className="bg-white dark:bg-deep-800 rounded-xl p-3 border border-warm-200 dark:border-deep-700">
                <FileText size={18} className="text-sage-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-ink dark:text-[#E8E6E3]">{meta.totalEntries}<span className="text-xs font-normal text-ink-light">篇</span></p>
                <p className="text-xs text-ink-light">记录</p>
              </div>
              <div className="bg-white dark:bg-deep-800 rounded-xl p-3 border border-warm-200 dark:border-deep-700">
                <BookOpen size={18} className="text-sage-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-ink dark:text-[#E8E6E3]">{meta.totalWords.toLocaleString()}</p>
                <p className="text-xs text-ink-light">字数</p>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ===== Recent entries (returning users) ===== */}
      {!isNewUser && allMetas.length > 0 && (
        <section className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 border border-warm-200 dark:border-deep-700">
          <h2 className="text-sm font-medium mb-4">最近记录</h2>
          <div className="space-y-2">
            {allMetas.slice(0, 5).map(entry => (
              <Link
                key={entry.slug}
                href={`/library/${entry.slug}`}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-warm-50 dark:hover:bg-deep-700 transition-colors group"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {['', '😔', '😕', '😐', '🙂', '😊'][entry.mood] || '😐'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink dark:text-[#E8E6E3] truncate">
                    {entry.title || entry.slug}
                  </p>
                  {entry.snippet && (
                    <p className="text-xs text-ink-light dark:text-[#6B6B70] mt-0.5 line-clamp-2">
                      {entry.snippet}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-ink-light">{entry.slug}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-sage-50 dark:bg-sage-500/10 text-sage-600 dark:text-sage-400">
                      {entry.category}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-ink-light flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
          {allMetas.length > 5 && (
            <Link href="/library" className="inline-flex items-center gap-1 mt-4 text-xs text-sage-500 hover:text-sage-600 transition-colors">
              查看全部 {allMetas.length} 篇 →
            </Link>
          )}
        </section>
      )}

      {/* ===== Wisdom quote ===== */}
      {(
        <section>
          <div className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-white dark:bg-deep-800 border border-warm-200 dark:border-deep-700 shadow-sm ${isRareQuote ? 'border-sage-300 dark:border-sage-500/30' : ''}`}>
            {isRareQuote && (
              <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-sage-300 via-gold-300 to-aura-purple animate-aurora" style={{ backgroundSize: '200% 200%' }} />
            )}
            <div className="relative z-10">
              <p className="text-xs text-ink-light dark:text-[#6B6B70] mb-3">
                ✨ 智慧语录{quote.rarity === 'legendary' && ' — 稀有启示'}{quote.rarity === 'epic' && ' — 珍贵洞见'}
              </p>
              <blockquote className="text-lg sm:text-xl text-ink dark:text-[#E8E6E3] leading-relaxed mb-3 font-body italic max-w-reading">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <cite className="text-sm text-ink-muted dark:text-[#9A9A9E] not-italic">
                —— {quote.author}{quote.source && <span>，《{quote.source}》</span>}
              </cite>
            </div>
          </div>
        </section>
      )}

      {/* ===== Footprints ===== */}
      {!isNewUser && <FootprintsBanner />}

      {/* ===== Subscribe ===== */}
      <section className="bg-white dark:bg-deep-800 rounded-2xl p-6 sm:p-8 border border-warm-200 dark:border-deep-700">
        <h2 className="text-lg font-heading font-medium mb-2">📬 订阅觉醒周报</h2>
        <p className="text-sm text-ink-muted dark:text-[#9A9A9E] mb-4">
          每周一封邮件，分享觉醒心得、认知科学精华和实践方法。不打扰，可随时退订。
        </p>
        <SubscribeForm />
      </section>

      {/* ===== Streak ===== */}
      {!isNewUser && (
        <div className="text-center py-4">
          <p className="text-xs text-ink-light dark:text-[#6B6B70] inline-flex items-center gap-1">
            <Flame size={12} className={meta.currentStreak > 0 ? 'text-gold-400' : 'text-ink-light'} />
            已连续记录 {meta.currentStreak} 天
            {userConfig.restDays.length > 0 && (
              <span className="text-ink-light/60">· 本月已休 {userConfig.restDaysUsed}/2 天</span>
            )}
          </p>
        </div>
      )}
    </div>
    </>
  );
}
