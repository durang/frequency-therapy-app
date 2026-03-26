// Calm-inspired design system for frequency therapy
export const calmDesignSystem = {
  colors: {
    primary: {
      50: '#f0f7ff',
      100: '#e0effe', 
      200: '#bae0fd',
      300: '#7cc8fb',
      400: '#36adf7',
      500: '#0c94e8',
      600: '#0075c6',
      700: '#015fa1',
      800: '#055086',
      900: '#0a426f',
    },
    calm: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    healing: {
      emerald: '#10b981',
      sage: '#8fbc8f',
      lavender: '#e6e6fa',
      coral: '#ff7f7f',
      gold: '#ffd700',
    },
    frequency: {
      low: '#4c1d95',      // Deep purple for low frequencies
      mid: '#1e40af',      // Blue for mid frequencies  
      high: '#0891b2',     // Cyan for high frequencies
      therapeutic: '#059669', // Green for therapeutic
      binaural: '#7c3aed',   // Purple for binaural
    }
  },
  
  gradients: {
    calm: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    healing: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    focus: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    sleep: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    energy: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    meditation: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },

  typography: {
    headings: {
      xl: 'text-4xl md:text-6xl font-bold tracking-tight',
      lg: 'text-3xl md:text-4xl font-bold tracking-tight',
      md: 'text-2xl md:text-3xl font-semibold tracking-tight',
      sm: 'text-xl font-semibold tracking-tight',
    },
    body: {
      lg: 'text-lg leading-relaxed',
      md: 'text-base leading-relaxed',
      sm: 'text-sm leading-relaxed',
    }
  },

  spacing: {
    section: 'py-16 md:py-24',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },

  animations: {
    float: 'animate-pulse',
    glow: 'animate-pulse',
    wave: 'animate-bounce',
  },

  glassmorphism: {
    light: 'backdrop-blur-xl bg-white/80 border border-white/20 shadow-xl',
    dark: 'backdrop-blur-xl bg-gray-900/80 border border-gray-700/20 shadow-xl',
    card: 'backdrop-blur-sm bg-white/60 border border-white/20 shadow-lg',
  }
}