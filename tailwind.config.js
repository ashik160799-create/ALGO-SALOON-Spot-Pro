/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FAF6EB',
          100: '#F4EBCE',
          200: '#E8D69D',
          300: '#DCC06C',
          400: '#D4AF37', // Brand Primary Gold
          500: '#C5A028',
          600: '#A4821D',
          700: '#7E6316',
          800: '#58440F',
          900: '#342809',
          amber: '#F3BA2F',
          champagne: '#E5C07B',
          glow: '#FFD700',
        },
        obsidian: {
          950: '#07070B',
          900: '#0A0A0F',
          800: '#121218',
          700: '#181822',
        },
        onyx: {
          DEFAULT: '#14141C',
          surface: '#1A1A24',
          border: '#242434',
          muted: '#2E2E42',
        },
        dark: {
          bg: '#08080C',
          card: '#12121A',
          surface: '#181824',
          elevated: '#202030',
          border: '#28283C',
          subtle: '#33334C',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      },
      boxShadow: {
        'gold-sm': '0 2px 10px -1px rgba(212, 175, 55, 0.25)',
        'gold-md': '0 4px 18px -2px rgba(212, 175, 55, 0.35)',
        'gold-lg': '0 10px 30px -3px rgba(212, 175, 55, 0.45)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.45)',
        'gold-ring': '0 0 0 2px rgba(212, 175, 55, 0.5)',
        'dark-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
        'card-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3BA2F 0%, #D4AF37 50%, #C5A028 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #FFE066 0%, #E5C07B 50%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(180deg, #161622 0%, #0D0D14 100%)',
        'obsidian-gradient': 'linear-gradient(180deg, #1A1A26 0%, #0D0D14 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'gilded-glow': 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.15) 0%, rgba(10, 10, 15, 0) 70%)',
      }
    },
  },
  plugins: [],
}
