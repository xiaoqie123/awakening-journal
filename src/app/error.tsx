'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="text-center py-16 space-y-6">
      <p className="text-5xl">☁️</p>
      <h1 className="text-xl font-heading font-medium text-ink dark:text-[#E8E6E3]">
        出了一些问题
      </h1>
      <p className="text-sm text-ink-muted dark:text-[#9A9A9E] max-w-sm mx-auto leading-relaxed">
        没关系，这不影响你的记录——它们都是安全的。试试刷新页面，或者回到首页重新开始。
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-warm-200 dark:bg-deep-700 hover:bg-warm-300 dark:hover:bg-deep-600 transition-colors"
        >
          <RefreshCw size={16} />
          再试一次
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-sage-500 text-white hover:bg-sage-600 transition-colors"
        >
          <ArrowLeft size={16} />
          返回首页
        </Link>
      </div>
    </div>
  );
}
