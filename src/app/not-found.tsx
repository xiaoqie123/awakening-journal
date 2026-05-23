import Link from 'next/link';
import { ArrowLeft, PenLine } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="text-center py-16 space-y-6">
      <p className="text-5xl">🌙</p>
      <h1 className="text-xl font-heading font-medium text-ink dark:text-[#E8E6E3]">
        这里什么都没有
      </h1>
      <p className="text-sm text-ink-muted dark:text-[#9A9A9E] max-w-sm mx-auto leading-relaxed">
        这个角落还没有内容——就像觉醒前的混沌。不妨回到熟悉的地方，继续你的觉察之旅。
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-warm-200 dark:bg-deep-700 hover:bg-warm-300 dark:hover:bg-deep-600 transition-colors"
        >
          <ArrowLeft size={16} />
          返回首页
        </Link>
        <Link
          href="/write"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-sage-500 text-white hover:bg-sage-600 transition-colors"
        >
          <PenLine size={16} />
          写点什么
        </Link>
      </div>
    </div>
  );
}
