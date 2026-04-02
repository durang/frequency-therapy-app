/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
        'pulse-neural': 'pulse-neural 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float-1': 'float-1 8s ease-in-out infinite',
        'float-2': 'float-2 10s ease-in-out infinite',
        'float-3': 'float-3 12s ease-in-out infinite',
        'pulse-spectrum': 'pulse-spectrum 2s ease-in-out infinite alternate',
        'pulse-wave': 'pulse-wave 1s ease-in-out infinite',
      },
      keyframes: {
        'frequency-wave': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
          '50%': { transform: 'scale(1.05) rotate(180deg)', opacity: 0.8 },
        },
        'pulse-neural': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3)' },
        },
        'float-1': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(10px) translateX(-5px)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(15px) translateX(-8px)' },
          '66%': { transform: 'translateY(-10px) translateX(12px)' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-15px) translateX(-10px)' },
          '66%': { transform: 'translateY(20px) translateX(8px)' },
        },
        'pulse-spectrum': {
          '0%': { transform: 'scaleY(0.3)', opacity: 0.6 },
          '100%': { transform: 'scaleY(1)', opacity: 1 },
        },
        'pulse-wave': {
          '0%': { transform: 'scaleY(0.5)', opacity: 0.7 },
          '50%': { transform: 'scaleY(1)', opacity: 1 },
          '100%': { transform: 'scaleY(0.5)', opacity: 0.7 },
        },
      }
    },
  },
  plugins: [],
}