/**
 * Landing Page Test Suite — Updated for M002 scroll-story redesign
 * Tests the current CalmFrequencyApp with progressive medical compliance
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

// Mock scroll story hooks
jest.mock('@/lib/scrollStory', () => ({
  useScrollStory: () => ({
    currentSection: 'hero',
    scrollProgress: 0,
    isReady: false,
    sectionsViewed: [],
    medicalComplianceProgress: 0,
    hasCompletedMedicalReview: false,
  }),
  useScrollSection: () => ({ ref: { current: null }, isInView: false }),
  useScrollProgress: () => ({ progress: 0 }),
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
        <span>supervisión médica</span>
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

// Import after mocks
import CalmFrequencyApp from '@/app/calm-page'

describe('Landing Page — M002 Scroll-Story Design', () => {
  test('renders header with FreqHeal branding', () => {
    render(<CalmFrequencyApp />)
    const headings = screen.getAllByText('FreqHeal')
    expect(headings.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Terapia de Frecuencias')).toBeInTheDocument()
  })

  test('renders hero section with main heading', () => {
    render(<CalmFrequencyApp />)
    expect(screen.getByText('Encuentra tu')).toBeInTheDocument()
    expect(screen.getByText(/equilibrio/)).toBeInTheDocument()
  })

  test('renders hero description about frequency therapy', () => {
    render(<CalmFrequencyApp />)
    expect(screen.getByText(/Terapia de frecuencias científicamente respaldada/)).toBeInTheDocument()
  })

  test('renders CTA or safety review section in hero', () => {
    render(<CalmFrequencyApp />)
    // With isReady=false (mock default), shows safety review instead of "Comenzar Ahora"
    expect(screen.getByText(/Revisión de Seguridad/)).toBeInTheDocument()
  })

  test('renders social proof section', () => {
    render(<CalmFrequencyApp />)
    expect(screen.getByText(/Miles de personas ya han transformado/)).toBeInTheDocument()
  })

  test('renders footer with copyright', () => {
    render(<CalmFrequencyApp />)
    expect(screen.getByText(/FreqHeal.*Plataforma de terapia de frecuencias/)).toBeInTheDocument()
  })

  test('renders without crashing', () => {
    const { container } = render(<CalmFrequencyApp />)
    expect(container.firstChild).toBeTruthy()
  })
})
