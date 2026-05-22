'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    // Placeholder — connect to your email provider (Resend, ConvertKit, etc.)
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setStatus('success');
      setMessage('订阅成功！每周的觉醒周报会发送到你的邮箱。');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('订阅失败，请稍后重试。');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-warm-100 dark:bg-deep-700 border border-warm-300 dark:border-deep-600 text-ink dark:text-[#E8E6E3] placeholder:text-ink-light text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-5 py-2.5 rounded-lg bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === 'loading' ? '订阅中...' : '订阅'}
      </button>

      {status === 'success' && (
        <p className="sm:col-span-full text-sm text-verdant-500 flex items-center gap-1">
          <CheckCircle size={14} /> {message}
        </p>
      )}
      {status === 'error' && (
        <p className="sm:col-span-full text-sm text-red-500 flex items-center gap-1">
          <AlertCircle size={14} /> {message}
        </p>
      )}
    </form>
  );
}
