/**
 * Landing Page Test Suite — Updated for M003 S02 dark-premium redesign
 * Tests CalmFrequencyApp with English content and FreqTherapy branding
 */
import React from 'react'
import { render, screen } from '@testing-library/react'

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

// Mock lucide-react icons with Proxy for auto-generation
jest.mock('lucide-react', () => {
  return new Proxy({}, {
    get: (_target: any, prop: string) => {
      if (prop === '__esModule') return true
      return (props: any) => <svg data-testid={`icon-${prop}`} {...props} />
    }
  })
})

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light', setTheme: jest.fn() }),
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

// Mock disclaimer state
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

// Mock auth state
jest.mock('@/lib/authState', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    signOut: jest.fn(),
  }),
}))

// Mock audio engine
jest.mock('@/lib/real-audio-engine', () => ({
  audioEngine: {
    play: jest.fn().mockResolvedValue(true),
    stop: jest.fn(),
    setVolume: jest.fn(),
    isPlaying: jest.fn(() => false),
  },
}))

// Mock heavy sub-components to simplify rendering
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
      return <div data-testid="medical-sections">
        <span>FDA Disclaimer</span>
        <span>medical supervision</span>
      </div>
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

// Import after mocks
import CalmFrequencyApp from '@/app/calm-page'

describe('Landing Page — M003 S02 FreqTherapy Branding', () => {
  test('renders header with FreqTherapy branding', () => {
    render(<CalmFrequencyApp />)
    const headings = screen.getAllByText('FreqTherapy')
    expect(headings.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Frequency Therapy')).toBeInTheDocument()
  })

  test('renders hero section with main heading', () => {
    render(<CalmFrequencyApp />)
    expect(screen.getByText('Find your')).toBeInTheDocument()
    expect(screen.getByText(/balance/)).toBeInTheDocument()
  })

  test('renders hero description about frequency therapy', () => {
    render(<CalmFrequencyApp />)
    expect(screen.getByText(/Scientifically backed frequency therapy/)).toBeInTheDocument()
  })

  test('renders CTA or safety review section in hero', () => {
    render(<CalmFrequencyApp />)
    // With isReadyToStart=false (mock default), shows safety review instead of "Start Now"
    expect(screen.getByText(/Safety Review/)).toBeInTheDocument()
  })

  test('renders social proof section', () => {
    render(<CalmFrequencyApp />)
    expect(screen.getByText(/Thousands have already transformed/)).toBeInTheDocument()
  })

  test('renders footer with copyright', () => {
    render(<CalmFrequencyApp />)
    expect(screen.getByText(/FreqTherapy.*Frequency therapy platform/)).toBeInTheDocument()
  })

  test('renders without crashing', () => {
    const { container } = render(<CalmFrequencyApp />)
    expect(container.firstChild).toBeTruthy()
  })
})
