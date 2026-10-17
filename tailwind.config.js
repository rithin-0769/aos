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
        shield: {
          blue: '#0ea5e9',
          navy: '#0b132b',
          dark: '#070b19',
          accent: '#38bdf8',
          border: '#1e293b'
        },
        hydra: {
          red: '#ef4444',
          dark: '#1c0505',
          accent: '#f87171'
        },
        framework: {
          green: '#22c55e',
          dark: '#03170a',
          accent: '#4ade80'
        },
        kree: {
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          dark: '#0b0f19'
        },
        retro: {
          amber: '#f59e0b',
          sepia: '#78350f',
          dark: '#1c1917'
        }
      },
      fontFamily: {
        mono: ['Courier New', 'Consolas', 'monospace'],
        tech: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 6s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
