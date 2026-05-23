'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenLine, LayoutDashboard, Library, Home, Menu, X, LogOut, User, Info } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { logout } from '@/lib/auth/actions';

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/write', label: '记录', icon: PenLine },
  { href: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { href: '/library', label: '图书馆', icon: Library },
  { href: '/about', label: '关于', icon: Info },
];

export default function Navigation({ userId }: { userId?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-100/90 dark:bg-deep-900/90 backdrop-blur-md border-b border-warm-300 dark:border-deep-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-wide text-sage-500 dark:text-sage-400 hover:text-sage-600 transition-colors"
        >
          🌙 觉醒日志
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-sage-100 dark:bg-sage-500/20 text-sage-600 dark:text-sage-400'
                    : 'text-ink-muted dark:text-[#9A9A9E] hover:bg-warm-200 dark:hover:bg-deep-700 hover:text-ink dark:hover:text-[#E8E6E3]'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {userId ? (
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-ink-muted dark:text-[#9A9A9E] hover:bg-warm-200 dark:hover:bg-deep-700 hover:text-ink dark:hover:text-[#E8E6E3] transition-all duration-200"
                aria-label="退出登录"
              >
                <LogOut size={16} />
                <span>退出</span>
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-ink-muted dark:text-[#9A9A9E] hover:bg-warm-200 dark:hover:bg-deep-700 hover:text-ink dark:hover:text-[#E8E6E3] transition-all duration-200"
            >
              <User size={16} />
              <span>登录</span>
            </Link>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-ink-muted hover:bg-warm-200 dark:hover:bg-deep-700"
            aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-warm-100 dark:bg-deep-900 border-b border-warm-300 dark:border-deep-700 px-4 pb-4 animate-float-in">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                  ${isActive
                    ? 'bg-sage-100 dark:bg-sage-500/20 text-sage-600 dark:text-sage-400'
                    : 'text-ink-muted hover:bg-warm-200 dark:hover:bg-deep-700'
                  }
                `}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          <div className="mt-2 pt-2 border-t border-warm-300 dark:border-deep-700">
            {userId ? (
              <form action={logout}>
                <button
                  type="submit"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-ink-muted hover:bg-warm-200 dark:hover:bg-deep-700 w-full"
                >
                  <LogOut size={18} />
                  退出登录
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-ink-muted hover:bg-warm-200 dark:hover:bg-deep-700"
              >
                <User size={18} />
                登录
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
