/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0A0A0C',
          surface: '#121216',
          elevated: '#18181F',
          card: '#141419',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-yellow': 'rgba(255, 229, 0, 0.3)',
          yellow: '#FFE500',
          'yellow-hover': '#E6CF00',
          'yellow-light': '#FFF566',
          'yellow-dark': '#C2AD00',
          white: '#FFFFFF',
          muted: '#9CA3AF',
          subtle: '#6B7280'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'yellow-glow': '0 0 20px -2px rgba(255, 229, 0, 0.35)',
        'yellow-glow-lg': '0 0 35px 2px rgba(255, 229, 0, 0.45)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'bounce-light': 'bounceLight 1.8s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceLight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      }
    },
  },
  plugins: [],
}
