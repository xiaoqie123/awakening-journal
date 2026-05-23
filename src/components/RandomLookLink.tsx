'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function RandomLookLink() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/random-journal');
      const data = await res.json();
      if (data.slug) {
        router.push(`/library/${data.slug}`);
      } else {
        router.push('/library');
      }
    } catch {
      router.push('/library');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs text-ink-light dark:text-[#6B6B70] hover:text-sage-500 dark:hover:text-sage-400 transition-colors inline-flex items-center gap-1"
    >
      {loading ? '寻找中...' : '或者，随便看看过去的自己'}
      <ArrowRight size={12} />
    </button>
  );
}
