import { Footprint } from '@/lib/types';
import { fileExists, readJson } from '@/lib/storage';

async function getFootprints(): Promise<Footprint[]> {
  try {
    if (await fileExists('data/footprints.json')) {
      return readJson<Footprint[]>('data/footprints.json');
    }
  } catch { /* silent fallback */ }
  return [];
}

export default async function FootprintsBanner() {
  const footprints = await getFootprints();
  if (footprints.length === 0) return null;

  return (
    <section className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 border border-warm-200 dark:border-deep-700">
      <p className="text-xs font-medium text-ink-light dark:text-[#6B6B70] mb-4 text-center">
        🕊️ 你并不孤单——这里有一些同行者的足迹
      </p>
      <div className="space-y-3">
        {footprints.map(fp => (
          <div key={fp.id} className="text-center">
            <p className="text-sm text-ink dark:text-[#E8E6E3] italic leading-relaxed">
              &ldquo;{fp.recentInsight}&rdquo;
            </p>
            <p className="text-xs text-ink-light dark:text-[#6B6B70] mt-1">
              —— {fp.displayName}，已连续记录 {fp.streak} 天
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-light dark:text-[#6B6B70] mt-4 text-center opacity-60">
        这些是匿名的同行者，和你一样走在觉察的路上。
      </p>
    </section>
  );
}
