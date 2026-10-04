/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#050816',
          900: '#070B1F',
          800: '#0A1330',
          700: '#0B1B3F',
          600: '#12244F',
        },
        ink: {
          DEFAULT: '#E8EEF9',
          muted: '#AFBDD6',
          faint: '#8496B4',
        },
        cyan: {
          DEFAULT: '#22D3EE',
          soft: '#67E8F9',
          deep: '#0E7490',
        },
        violet: {
          DEFAULT: '#8B5CF6',
          soft: '#C4B5FD',
          deep: '#5B21B6',
        },
        amber: {
          DEFAULT: '#FBBF24',
          soft: '#FCD34D',
          deep: '#B45309',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.125rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.25), 0 8px 30px -12px rgba(34,211,238,0.45)',
        card: '0 18px 40px -28px rgba(0,0,0,0.9)',
      },
      keyframes: {
        twinkle: {
          '0%,100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        twinkle: 'twinkle 4s ease-in-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.35s ease-out both',
        'scale-in': 'scale-in 0.18s ease-out both',
      },
    },
  },
  plugins: [],
}
