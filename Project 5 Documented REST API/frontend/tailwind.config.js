/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1A24',
        paper: '#F4F6F7',
        panel: '#FFFFFF',
        line: '#DCE3E7',
        muted: '#5B6B75',
        brand: { DEFAULT: '#0B6E6E', dark: '#085353' },
        ok: '#15803D',
        warn: '#B45309',
        danger: '#B91C1C',
        retired: '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'ui-sans-serif', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        'fade-scale': {
          '0%': { opacity: '0', transform: 'translateY(4px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        in: 'fade-scale 160ms ease-out',
      },
    },
  },
  plugins: [],
};
