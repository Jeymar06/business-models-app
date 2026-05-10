import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm-black core (UI/UX Pro Max — avoid blue-tinted dark)
        ink: '#0A0908',
        'ink-soft': '#141210',
        surface: '#1A1714',
        'surface-2': '#211D19',
        steel: '#6B6660',
        line: '#E6E1D8',
        paper: '#FFFFFF',
        cream: '#F5F1E8',
        mist: '#FAF7F1',

        // Editorial gold scale (Soft UI Evolution + Vintage Analog)
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FBF6E3',
          100: '#F4E8B6',
          200: '#EBD884',
          300: '#E2C754',
          400: '#D9BB3F',
          500: '#D4AF37',
          600: '#B89020',
          700: '#8C6C16',
          800: '#5E480E',
          900: '#382B08',
        },

        mint: '#10B981',
        'mint-dark': '#059669',
        danger: '#E5484D',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      fontFamily: {
        display: [
          'Fraunces',
          'ui-serif',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
        sans: [
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        editorial: '0.22em',
      },
      boxShadow: {
        panel: '0 24px 60px rgba(10, 9, 8, 0.10)',
        soft: '0 12px 32px rgba(10, 9, 8, 0.08)',
        glow: '0 0 0 1px rgba(212, 175, 55, 0.28), 0 22px 50px rgba(10, 9, 8, 0.22)',
        'gold-soft': '0 18px 44px rgba(212, 175, 55, 0.22)',
        'inner-line': 'inset 0 0 0 1px rgba(255,255,255,0.06)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      backgroundImage: {
        'premium-grid':
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        'hero-veil':
          'linear-gradient(135deg, rgba(10,9,8,0.96), rgba(10,9,8,0.72) 45%, rgba(10,9,8,0.32) 100%)',
        'gold-flow':
          'linear-gradient(120deg, rgba(212,175,55,0.0) 0%, rgba(232,199,102,0.55) 50%, rgba(212,175,55,0.0) 100%)',
        noise:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.65s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'fade-in': 'fadeIn 0.5s ease both',
        shimmer: 'shimmer 1.8s linear infinite',
        marquee: 'marquee 38s linear infinite',
        'gold-pulse': 'goldPulse 4.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        goldPulse: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
