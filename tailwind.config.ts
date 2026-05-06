import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        surface: '#1A1A1A',
        steel: '#6B7280',
        line: '#E5E7EB',
        paper: '#FFFFFF',
        mist: '#F9FAFB',
        mint: '#10B981',
        'mint-dark': '#059669',
        gold: '#D4AF37',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 24px 60px rgba(17, 17, 17, 0.08)',
        soft: '0 12px 32px rgba(17, 17, 17, 0.06)',
        glow: '0 0 0 1px rgba(212, 175, 55, 0.22), 0 20px 45px rgba(17, 17, 17, 0.18)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      backgroundImage: {
        'premium-grid': 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'hero-veil': 'linear-gradient(135deg, rgba(17,17,17,0.94), rgba(17,17,17,0.68) 45%, rgba(17,17,17,0.28) 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.55s ease both',
        shimmer: 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
