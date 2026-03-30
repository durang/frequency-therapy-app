/**
 * Landing Page Dark Mode Test Suite — M003 S02
 * Verifies dark theme rendering, theme toggle integration, and CSS dark variants
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import * as fs from 'fs'
import * as path from 'path'

// Mock framer-motion
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    motion: new Proxy({}, {
      get: (_target: any, prop: string) => {
        return React.forwardRef((props: any, ref: any) => {
          const { initial, animate, exit, whileInView, whileHover, whileTap, variants, transition, drag, dragConstraints, style, ...rest } = props
          const Tag = prop as any
          return React.createElement(Tag, { ...rest, ref, style })
        })
      }
    }),
    AnimatePresence: ({ children }: any) => children,
    useScroll: () => ({ scrollY: { get: () => 0, on: () => () => {} } }),
    useTransform: () => ({ get: () => 0, on: () => () => {} }),
    useMotionValue: (val: number) => ({ get: () => val, set: () => {}, on: () => () => {} }),
    useInView: () => true,
    useSpring: (val: any) => val,
  }
})

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  return new Proxy({}, {
    get: (_target: any, prop: string) => {
      if (prop === '__esModule') return true
      return (props: any) => <svg data-testid={`icon-${prop}`} {...props} />
    }
  })
})

// Track useTheme calls for verification
const mockSetTheme = jest.fn()
let mockTheme = 'dark'
let mockResolvedTheme = 'dark'

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: mockTheme, resolvedTheme: mockResolvedTheme, setTheme: mockSetTheme }),
  ThemeProvider: ({ children }: any) => children,
}))

// Mock scroll story hooks
jest.mock('@/lib/scrollStory', () => ({
  useScrollStory: () => ({
    currentSection: 'hero',
    scrollProgress: 0,
    isReady: false,
    sectionsRead: [],
    medicalComplianceProgress: 0,
    isReadyToStart: false,
    sections: [],
    markSectionAsRead: jest.fn(),
    fps: 60,
  }),
  useScrollSection: () => ({ ref: { current: null }, isInView: false }),
  useScrollProgress: () => ({ progress: 0 }),
  defaultScrollSections: [],
  validateMedicalCompliance: () => ({ isValid: false, missingRequirements: [] }),
}))

jest.mock('@/lib/disclaimerState', () => ({
  useDisclaimerStore: () => ({
    hasAcknowledged: false,
    isVisible: false,
    hasMedicalCondition: false,
    progress: 0,
    acknowledgeDisclaimer: jest.fn(),
    setMedicalCondition: jest.fn(),
    medicalSectionsViewed: {},
    setMedicalSectionViewed: jest.fn(),
  }),
}))

jest.mock('@/lib/authState', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    signOut: jest.fn(),
  }),
}))

jest.mock('@/lib/real-audio-engine', () => ({
  audioEngine: {
    play: jest.fn().mockResolvedValue(true),
    stop: jest.fn(),
    setVolume: jest.fn(),
    isPlaying: jest.fn(() => false),
  },
}))

jest.mock('@/components/landing/frequency-lab/FrequencyLab', () => {
  return function MockFrequencyLab() {
    return <div data-testid="frequency-lab">FrequencyLab</div>
  }
})

jest.mock('@/components/landing/HeroAnimations', () => {
  return function MockHeroAnimations() {
    return <div data-testid="hero-animations">HeroAnimations</div>
  }
})

jest.mock('@/components/ui/ScrollProgress', () => {
  const MockScrollProgress = () => <div data-testid="scroll-progress" />
  MockScrollProgress.displayName = 'ScrollProgress'
  const MockScrollIndicator = () => <div data-testid="scroll-indicator" />
  return {
    __esModule: true,
    default: MockScrollProgress,
    ScrollIndicator: MockScrollIndicator,
  }
})

jest.mock('@/components/landing/MedicalScrollSections', () => {
  return {
    __esModule: true,
    default: function MockMedicalScrollSections() {
      return <div data-testid="medical-sections">Medical Sections</div>
    }
  }
})

jest.mock('@/components/auth/MagicLinkForm', () => {
  return {
    __esModule: true,
    default: function MockMagicLinkForm() {
      return <div data-testid="magic-link-form">MagicLinkForm</div>
    }
  }
})

jest.mock('@/components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>
}))

import CalmFrequencyApp from '@/app/calm-page'

describe('Landing Page — Dark Mode Integration', () => {
  beforeEach(() => {
    mockTheme = 'dark'
    mockResolvedTheme = 'dark'
    mockSetTheme.mockClear()
  })

  test('renders ThemeToggle component in header', () => {
    render(<CalmFrequencyApp />)
    const toggles = screen.getAllByTestId('theme-toggle')
    expect(toggles.length).toBeGreaterThanOrEqual(1)
  })

  test('ThemeToggle is present in both desktop nav and mobile header', () => {
    render(<CalmFrequencyApp />)
    // ThemeToggle appears twice: once in desktop nav, once in mobile header
    const toggles = screen.getAllByTestId('theme-toggle')
    expect(toggles.length).toBe(2)
  })

  test('renders dark: Tailwind variants on header glass-card', () => {
    const { container } = render(<CalmFrequencyApp />)
    const header = container.querySelector('header')
    expect(header).toBeTruthy()
    // Header uses glass-card class which has .dark variant in CSS
    expect(header?.className).toContain('glass-card')
  })

  test('renders dark: Tailwind variants on how-it-works cards', () => {
    const { container } = render(<CalmFrequencyApp />)
    // How-it-works cards use dark:bg-slate-800/60 and dark:border-slate-700/30
    const darkBgElements = container.querySelectorAll('[class*="dark:bg-slate-800"]')
    expect(darkBgElements.length).toBeGreaterThanOrEqual(3) // 3 how-it-works cards
  })

  test('renders dark: variant on hero heading', () => {
    const { container } = render(<CalmFrequencyApp />)
    // Hero h1 is the second h1 (first is brand name in header). It has dark:text-slate-100
    const headings = container.querySelectorAll('h1')
    const heroHeading = headings[1] // hero heading is second in DOM
    expect(heroHeading?.className).toContain('dark:text-slate-100')
  })

  test('renders dark: variant on hero description', () => {
    const { container } = render(<CalmFrequencyApp />)
    // Hero description paragraph has dark:text-slate-400
    const heroDesc = screen.getByText(/Scientifically backed frequency therapy/)
    expect(heroDesc.className).toContain('dark:text-slate-400')
  })

  test('renders dark: variant on footer', () => {
    const { container } = render(<CalmFrequencyApp />)
    const footer = container.querySelector('footer')
    expect(footer?.className).toContain('dark:from-gray-900')
  })

  test('renders dark: variant on CTA section', () => {
    const { container } = render(<CalmFrequencyApp />)
    // CTA section uses dark:from-indigo-900 dark:via-purple-900 dark:to-blue-950
    const ctaSections = container.querySelectorAll('[class*="dark:from-indigo-900"]')
    expect(ctaSections.length).toBeGreaterThanOrEqual(1)
  })

  test('FreqTherapy header gradient has dark mode variant', () => {
    const { container } = render(<CalmFrequencyApp />)
    // Brand h1 uses dark:from-cyan-400 dark:via-purple-400 dark:to-indigo-400
    const brandHeading = screen.getAllByText('FreqTherapy')[0]
    expect(brandHeading.className).toContain('dark:from-cyan-400')
  })
})

describe('Landing Page — CSS Dark Variants', () => {
  const cssPath = path.resolve(__dirname, '../styles/unique-design.css')
  let cssContent: string

  beforeAll(() => {
    cssContent = fs.readFileSync(cssPath, 'utf-8')
  })

  test('unique-design.css contains .dark .glass-card rule', () => {
    expect(cssContent).toContain('.dark .glass-card')
  })

  test('unique-design.css contains .dark .animated-bg rule', () => {
    expect(cssContent).toContain('.dark .animated-bg')
  })

  test('unique-design.css contains .dark .neural-pattern rule', () => {
    expect(cssContent).toContain('.dark .neural-pattern')
  })

  test('unique-design.css contains .dark .hero-gradient rule', () => {
    expect(cssContent).toContain('.dark .hero-gradient')
  })

  test('unique-design.css contains .dark .frequency-card rule', () => {
    expect(cssContent).toContain('.dark .frequency-card')
  })

  test('unique-design.css contains .dark .btn-primary-glow rule', () => {
    expect(cssContent).toContain('.dark .btn-primary-glow')
  })

  test('unique-design.css contains .dark .medical-section rule', () => {
    expect(cssContent).toContain('.dark .medical-section')
  })

  test('unique-design.css contains .dark .freq-bar rule', () => {
    expect(cssContent).toContain('.dark .freq-bar')
  })
})

describe('Landing Page — Sub-component Theme Integration', () => {
  test('HeroAnimations source imports useTheme from next-themes', () => {
    const heroSource = fs.readFileSync(
      path.resolve(__dirname, '../components/landing/HeroAnimations.tsx'),
      'utf-8'
    )
    expect(heroSource).toContain("from 'next-themes'")
    expect(heroSource).toContain('useTheme')
  })

  test('FrequencyVisualizer source imports useTheme from next-themes', () => {
    const vizSource = fs.readFileSync(
      path.resolve(__dirname, '../components/landing/frequency-lab/FrequencyVisualizer.tsx'),
      'utf-8'
    )
    expect(vizSource).toContain("from 'next-themes'")
    expect(vizSource).toContain('useTheme')
  })

  test('FrequencyVisualizer uses resolvedTheme for isDark check', () => {
    const vizSource = fs.readFileSync(
      path.resolve(__dirname, '../components/landing/frequency-lab/FrequencyVisualizer.tsx'),
      'utf-8'
    )
    expect(vizSource).toContain('resolvedTheme')
    expect(vizSource).toContain('isDark')
  })
})
