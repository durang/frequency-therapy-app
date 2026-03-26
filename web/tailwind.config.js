/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Quantum-inspired color palette
        quantum: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        frequency: {
          dna: '#9333ea', // 528 Hz - Purple
          schumann: '#059669', // 7.83 Hz - Green
          gamma: '#dc2626', // 40 Hz - Red
          theta: '#2563eb', // 6.3 Hz - Blue
          cellular: '#ea580c', // Multiple Hz - Orange
        },
        neural: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      fontFamily: {
        'quantum': ['Inter', 'system-ui', 'sans-serif'],
        'scientific': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'quantum-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'neural-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'frequency-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'frequency-wave': 'frequency-wave 3s ease-in-out infinite',
      },
      keyframes: {
        'frequency-wave': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
          '50%': { transform: 'scale(1.05) rotate(180deg)', opacity: 0.8 },
        }
      }
    },
  },
  plugins: [],
}