'use client';

import { useActionState } from 'react';
import { login, register } from '@/lib/auth/actions';
import { useState } from 'react';

export default function LoginForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginState, loginAction, loginPending] = useActionState(login, {});
  const [registerState, registerAction, registerPending] = useActionState(register, {});

  const isLogin = mode === 'login';
  const state = isLogin ? loginState : registerState;
  const action = isLogin ? loginAction : registerAction;
  const pending = isLogin ? loginPending : registerPending;

  return (
    <div className="bg-white dark:bg-deep-800 rounded-2xl p-6 border border-warm-200 dark:border-deep-700 shadow-sm">
      {/* Tab switcher */}
      <div className="flex mb-6 bg-warm-100 dark:bg-deep-700 rounded-lg p-1">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            isLogin
              ? 'bg-white dark:bg-deep-800 text-ink dark:text-[#E8E6E3] shadow-sm'
              : 'text-ink-muted dark:text-[#9A9A9E] hover:text-ink dark:hover:text-[#E8E6E3]'
          }`}
        >
          登录
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            !isLogin
              ? 'bg-white dark:bg-deep-800 text-ink dark:text-[#E8E6E3] shadow-sm'
              : 'text-ink-muted dark:text-[#9A9A9E] hover:text-ink dark:hover:text-[#E8E6E3]'
          }`}
        >
          注册
        </button>
      </div>

      {/* Error message */}
      {state?.message && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 mb-4">
          {state.message}
        </div>
      )}

      <form action={action} className="space-y-4">
        {/* Name field (register only) */}
        {!isLogin && (
          <div>
            <label htmlFor="name" className="block text-xs text-ink-muted dark:text-[#9A9A9E] mb-1.5">
              名称
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="你的名字"
              className="w-full px-4 py-2.5 rounded-xl bg-warm-50 dark:bg-deep-700 border border-warm-200 dark:border-deep-600 text-ink dark:text-[#E8E6E3] placeholder:text-ink-light focus:outline-none focus:border-sage-400 text-sm"
            />
            {state?.errors?.name && (
              <p className="text-xs text-red-500 mt-1">{state.errors.name[0]}</p>
            )}
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs text-ink-muted dark:text-[#9A9A9E] mb-1.5">
            邮箱
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            className="w-full px-4 py-2.5 rounded-xl bg-warm-50 dark:bg-deep-700 border border-warm-200 dark:border-deep-600 text-ink dark:text-[#E8E6E3] placeholder:text-ink-light focus:outline-none focus:border-sage-400 text-sm"
          />
          {state?.errors?.email && (
            <p className="text-xs text-red-500 mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs text-ink-muted dark:text-[#9A9A9E] mb-1.5">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder={isLogin ? '输入密码' : '至少 8 个字符'}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-warm-50 dark:bg-deep-700 border border-warm-200 dark:border-deep-600 text-ink dark:text-[#E8E6E3] placeholder:text-ink-light focus:outline-none focus:border-sage-400 text-sm"
          />
          {state?.errors?.password && (
            <p className="text-xs text-red-500 mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="w-full py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 dark:bg-sage-400 dark:hover:bg-sage-300 text-white dark:text-deep-900 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? (isLogin ? '登录中...' : '注册中...') : (isLogin ? '登录' : '注册')}
        </button>
      </form>
    </div>
  );
}
