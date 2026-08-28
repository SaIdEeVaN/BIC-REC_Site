/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#c9a227',
        'primary-light': '#e5be3a',
        accent: '#FFA300',
        dark: '#0A0A0F',
        surface: '#12121A',
        'surface-2': '#1A1A2E',
        'surface-3': '#1E1E30',
        'text-primary': '#E8E8F0',
        'text-muted': '#8888A0',
        'border-subtle': '#2A2A40',
      },
      fontFamily: {
        heading: ['Rajdhani', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        gradient: 'gradient 8s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee 35s linear infinite reverse',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #6C3AFF, 0 0 10px #6C3AFF' },
          '100%': { boxShadow: '0 0 20px #6C3AFF, 0 0 40px #6C3AFF' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      letterSpacing: {
        widest2: '0.3em',
      },
    },
  },
  plugins: [],
}
