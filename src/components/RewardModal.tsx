'use client';

import { useEffect, useState } from 'react';
import { Quote } from '@/lib/types';
import { X, Sparkles, Zap, Star } from 'lucide-react';

interface RewardModalProps {
  quote: Quote;
  onClose: () => void;
}

export default function RewardModal({ quote, onClose }: RewardModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delayed appearance builds anticipation
    const timer = setTimeout(() => setVisible(true), 200);
    // Rarer quotes stay longer
    const duration = quote.rarity === 'legendary' ? 4000 : quote.rarity === 'epic' ? 3500 : 2500;
    const closeTimer = setTimeout(onClose, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [quote.rarity, onClose]);

  const rarityConfig = {
    common: {
      bg: 'bg-white dark:bg-deep-800',
      border: 'border-warm-200 dark:border-deep-700',
      icon: null,
      animation: 'animate-float-in',
    },
    rare: {
      bg: 'bg-white dark:bg-deep-800',
      border: 'border-sage-300 dark:border-sage-500/30',
      icon: <Sparkles size={16} className="text-sage-500" />,
      animation: 'animate-float-in',
    },
    epic: {
      bg: 'bg-white dark:bg-deep-800',
      border: 'border-gold-400 dark:border-gold-500/40',
      icon: <Zap size={16} className="text-gold-500" />,
      animation: 'animate-float-in',
    },
    legendary: {
      bg: 'bg-gradient-to-br from-sage-50 via-white to-aura-purple/10 dark:from-deep-800 dark:via-deep-800 dark:to-aura-deep/20',
      border: 'border-sage-400 dark:border-sage-400/50',
      icon: <Star size={16} className="text-aura-purple" />,
      animation: 'animate-badge-unlock',
    },
  };

  const config = rarityConfig[quote.rarity];

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        bg-black/20 dark:bg-black/40 backdrop-blur-sm
        transition-opacity duration-300
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          ${config.bg} ${config.border} ${config.animation}
          rounded-2xl p-6 sm:p-8 mx-4 max-w-md w-full
          shadow-2xl border-2
          relative overflow-hidden
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* Background glow for epic/legendary */}
        {(quote.rarity === 'epic' || quote.rarity === 'legendary') && (
          <div
            className="absolute inset-0 opacity-30 bg-gradient-to-r from-sage-300 via-gold-300 to-aura-purple animate-aurora"
            style={{ backgroundSize: '200% 200%' }}
          />
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1 rounded-lg hover:bg-warm-200 dark:hover:bg-deep-700 transition-colors"
          aria-label="关闭奖励"
        >
          <X size={16} />
        </button>

        <div className="relative z-10 text-center">
          {/* Rarity icon */}
          <div className="mb-4 flex justify-center">
            {quote.rarity === 'legendary' && (
              <span className="text-5xl animate-pulse-gentle">🌌</span>
            )}
            {quote.rarity === 'epic' && (
              <span className="text-4xl">💎</span>
            )}
            {quote.rarity === 'rare' && (
              <span className="text-3xl">🌟</span>
            )}
            {quote.rarity === 'common' && (
              <span className="text-2xl">✨</span>
            )}
          </div>

          {/* Rarity label */}
          <p className="text-xs uppercase tracking-wider text-ink-light dark:text-[#6B6B70] mb-3 flex items-center justify-center gap-1">
            {config.icon}
            {quote.rarity === 'legendary' && '传奇启示'}
            {quote.rarity === 'epic' && '珍贵洞见'}
            {quote.rarity === 'rare' && '稀有感悟'}
            {quote.rarity === 'common' && '智慧语录'}
          </p>

          {/* Quote text */}
          <blockquote className="text-lg text-ink dark:text-[#E8E6E3] leading-relaxed mb-3 italic font-body">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <cite className="text-sm text-ink-muted dark:text-[#9A9A9E] not-italic">
            —— {quote.author}
          </cite>

          {/* Feedback line */}
          <p className="mt-4 text-sm text-sage-500 dark:text-sage-400 font-medium">
            记录完成，你又向觉醒迈进了一步。
          </p>
        </div>
      </div>
    </div>
  );
}
