import { getAllJournalMetas, getSiteMeta, getAchievements } from '@/lib/data-utils';
import { Flame, BookOpen, FileText, Calendar, Trophy, Lock } from 'lucide-react';
import { Achievement } from '@/lib/types';

export default function DashboardPage() {
  const metas = getAllJournalMetas();
  const siteMeta = getSiteMeta();
  const achievements = getAchievements();

  // Mood data (last 30 entries, chronological order)
  const moodData = metas.slice(0, 30).reverse();
  const avgMood = moodData.length > 0
    ? (moodData.reduce((sum, m) => sum + m.mood, 0) / moodData.length).toFixed(1)
    : '--';

  // Tag frequency
  const tagFrequency: Record<string, number> = {};
  metas.forEach(m => m.tags.forEach(tag => {
    tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
  }));
  const topTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  // Last 7 days heatmap
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const last7DaysStatus = last7Days.map(date => ({
    date,
    hasEntry: metas.some(m => m.slug === date),
  }));

  // Achievement unlock checker
  const checkAchievement = (ach: Achievement): boolean => {
    switch (ach.condition.type) {
      case 'streak':
        return siteMeta.currentStreak >= ach.condition.threshold || siteMeta.longestStreak >= ach.condition.threshold;
      case 'total_words':
        return siteMeta.totalWords >= ach.condition.threshold;
      case 'total_entries':
        return siteMeta.totalEntries >= ach.condition.threshold;
      case 'category_master':
        return metas.filter(m => m.category === ach.condition.category).length >= ach.condition.threshold;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-heading font-medium">个人成长仪表盘</h1>

      {/* Stats cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Flame className="text-gold-500" />}
          label="连续记录"
          value={`${siteMeta.currentStreak}天`}
          sub={`最长 ${siteMeta.longestStreak}天`}
        />
        <StatCard
          icon={<FileText />}
          label="总篇数"
          value={`${siteMeta.totalEntries}篇`}
        />
        <StatCard
          icon={<BookOpen />}
          label="总字数"
          value={siteMeta.totalWords.toLocaleString()}
          sub="字"
        />
        <StatCard
          icon={<Calendar />}
          label="平均情绪"
          value={avgMood}
          sub="/ 5"
        />
      </section>

      {/* 7-day heatmap */}
      <section className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 border border-warm-200 dark:border-deep-700">
        <h2 className="text-sm font-medium mb-4">最近7天记录情况</h2>
        <div className="flex gap-2 justify-center sm:gap-3">
          {last7DaysStatus.map((day) => (
            <div key={day.date} className="text-center">
              <div
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-sm
                  transition-all duration-300
                  ${day.hasEntry
                    ? 'bg-sage-500 text-white shadow-md shadow-sage-500/20'
                    : 'bg-warm-200 dark:bg-deep-700 text-ink-light'
                  }
                `}
                title={day.date}
              >
                {day.hasEntry ? '✓' : '·'}
              </div>
              <p className="text-xs text-ink-light mt-1">
                {['日', '一', '二', '三', '四', '五', '六'][new Date(day.date).getDay()]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mood chart */}
      {moodData.length > 0 && (
        <section className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 border border-warm-200 dark:border-deep-700">
          <h2 className="text-sm font-medium mb-4">情绪变化（最近记录）</h2>
          <div className="flex items-end gap-1 h-24">
            {moodData.slice(-14).map((m, i) => (
              <div
                key={i}
                className="flex-1 bg-sage-300 dark:bg-sage-500/40 rounded-t-sm transition-all hover:bg-sage-500 dark:hover:bg-sage-400"
                style={{ height: `${(m.mood / 5) * 100}%` }}
                title={`${m.slug}: 情绪 ${m.mood}/5`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-ink-light mt-2">
            <span>低落</span>
            <span>平静</span>
            <span>高涨</span>
          </div>
        </section>
      )}

      {/* Achievements wall */}
      <section className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 border border-warm-200 dark:border-deep-700">
        <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
          <Trophy size={16} className="text-gold-500" />
          成就徽章
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map(ach => {
            const unlocked = checkAchievement(ach);
            return (
              <div
                key={ach.id}
                className={`
                  rounded-xl p-4 text-center border-2 transition-all duration-300
                  ${unlocked
                    ? 'border-sage-300 dark:border-sage-500/30 bg-sage-50/50 dark:bg-sage-500/5'
                    : 'border-dashed border-warm-300 dark:border-deep-600 opacity-50'
                  }
                `}
              >
                <span className="text-3xl block mb-2">
                  {unlocked ? ach.icon : <Lock size={24} className="mx-auto text-ink-light" />}
                </span>
                <p className="text-xs font-medium text-ink dark:text-[#E8E6E3]">{ach.name}</p>
                <p className="text-xs text-ink-light mt-1">{ach.description}</p>
                {unlocked && (
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-sage-100 dark:bg-sage-500/20 text-sage-600 dark:text-sage-400">
                    已解锁
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Tag cloud */}
      {topTags.length > 0 && (
        <section className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 border border-warm-200 dark:border-deep-700">
          <h2 className="text-sm font-medium mb-4">关键词云</h2>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => {
              const size = Math.min(1.5, 0.75 + count * 0.08);
              return (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-sage-50 dark:bg-sage-500/10 text-sage-600 dark:text-sage-400 font-medium"
                  style={{ fontSize: `${size}rem` }}
                >
                  {tag}
                  <span className="text-xs ml-1 opacity-60">{count}</span>
                </span>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

/** Stat card sub-component */
function StatCard({ icon, label, value, sub }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white dark:bg-deep-800 rounded-2xl p-4 border border-warm-200 dark:border-deep-700">
      <div className="flex items-center gap-2 text-ink-muted dark:text-[#9A9A9E] text-xs mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-ink dark:text-[#E8E6E3]">
        {value}
        {sub && <span className="text-sm font-normal text-ink-muted ml-1">{sub}</span>}
      </p>
    </div>
  );
}
