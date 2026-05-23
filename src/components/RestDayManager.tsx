'use client';

import { useState } from 'react';
import { Coffee } from 'lucide-react';

interface RestDayData {
  available: number;
  used: number;
  max: number;
  restDays: string[];
  resetMonth: string;
}

export default function RestDayManager({ initial }: { initial: RestDayData }) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRest = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/rest-day', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const result = await res.json();
      if (res.ok) {
        setData({ ...data, available: result.available, used: result.used, restDays: result.restDays });
        setMessage('今天已设为休日，好好休息。');
      } else {
        setMessage(result.error || '请求失败');
      }
    } catch {
      setMessage('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const isTodayRest = data.restDays.includes(today);

  return (
    <section className="bg-white dark:bg-deep-800 rounded-2xl p-5 sm:p-6 border border-warm-200 dark:border-deep-700">
      <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
        <Coffee size={16} className="text-ink-muted" />
        休日
        <span className="text-xs font-normal text-ink-light">
          （本月剩余 {data.available}/{data.max} 天）
        </span>
      </h2>

      <p className="text-xs text-ink-muted dark:text-[#9A9A9E] mb-4 leading-relaxed">
        持续觉察不意味着每天都必须记录。每个月可以申请 1-2 天「休日」——心累的时候，允许自己暂停，Streak 不会中断。
      </p>

      {isTodayRest ? (
        <p className="text-sm text-sage-500 dark:text-sage-400">☁️ 今天是休日，你已经做了最好的选择。</p>
      ) : (
        <button
          onClick={handleRest}
          disabled={loading || data.available <= 0}
          className="
            inline-flex items-center gap-2 px-4 py-2
            rounded-xl text-sm font-medium
            bg-warm-200 dark:bg-deep-700 text-ink-muted
            hover:bg-warm-300 dark:hover:bg-deep-600
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200
          "
        >
          <Coffee size={14} />
          {loading ? '处理中...' : '今天休息一天'}
        </button>
      )}

      {message && (
        <p className="mt-3 text-xs text-sage-500 dark:text-sage-400">{message}</p>
      )}

      {data.restDays.length > 0 && (
        <div className="mt-4 pt-3 border-t border-warm-200 dark:border-deep-700">
          <p className="text-xs text-ink-light mb-2">本月休日：</p>
          <div className="flex flex-wrap gap-1">
            {data.restDays.map(d => (
              <span key={d} className="px-2 py-0.5 rounded-full text-xs bg-sage-50 dark:bg-sage-500/10 text-sage-600 dark:text-sage-400">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
