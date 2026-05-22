'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-ink-muted dark:text-[#9A9A9E] hover:bg-warm-200 dark:hover:bg-deep-700 transition-colors"
      aria-label={theme === 'light' ? '切换暗色模式' : '切换亮色模式'}
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
