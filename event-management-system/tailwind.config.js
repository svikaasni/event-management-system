/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0B0C15',
          800: '#151725',
          700: '#1F2235',
        },
        galaxy: {
          300: '#A78BFA',
          500: '#8B5CF6',
          700: '#7C3AED',
        },
        nebula: {
          300: '#F472B6',
          500: '#EC4899',
          700: '#DB2777',
        },
        star: {
          100: '#E0F2FE',
          300: '#7DD3FC',
          500: '#38BDF8',
        }
      },
      backgroundImage: {
        'galaxy-gradient': 'radial-gradient(circle at center, #1F2235 0%, #0B0C15 100%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
