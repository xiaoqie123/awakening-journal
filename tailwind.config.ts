import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FDFCFA',
          100: '#FAF8F5',
          200: '#F5F0EB',
          300: '#EBE4DB',
        },
        deep: {
          900: '#1A1A1D',
          800: '#252528',
          700: '#2F2F33',
          600: '#3A3A3F',
        },
        ink: {
          DEFAULT: '#2D2D2F',
          muted: '#6B6B70',
          light: '#9A9A9E',
        },
        sage: {
          50: '#F0F5F4',
          100: '#DCE8E5',
          200: '#B5D1CC',
          300: '#8BBAB2',
          400: '#7DB9B0',
          500: '#5B9A8B',
          600: '#4A7D71',
          700: '#3A6258',
        },
        gold: {
          300: '#F0D78C',
          400: '#E8C77D',
          500: '#D4A84B',
          600: '#B8913A',
        },
        verdant: {
          400: '#8CC090',
          500: '#7BA87F',
        },
        aura: {
          purple: '#7B6FAA',
          deep: '#9B8FC0',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'PingFang SC', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'body': ['1.0625rem', { lineHeight: '1.75' }],
        'body-lg': ['1.25rem', { lineHeight: '1.7' }],
      },
      maxWidth: {
        'reading': '65ch',
      },
      animation: {
        'aurora': 'aurora 3s ease-in-out infinite',
        'float-in': 'floatIn 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'badge-unlock': 'badgeUnlock 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%', opacity: '0.8' },
          '50%': { backgroundPosition: '100% 50%', opacity: '1' },
        },
        floatIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        badgeUnlock: {
          '0%': { transform: 'scale(0) rotate(-12deg)', opacity: '0' },
          '60%': { transform: 'scale(1.2) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
