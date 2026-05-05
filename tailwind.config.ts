import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172026',
        mint: '#2bbf8a',
        coral: '#f9735b',
        steel: '#3e6f8e',
      },
      boxShadow: {
        panel: '0 10px 30px rgba(23, 32, 38, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
