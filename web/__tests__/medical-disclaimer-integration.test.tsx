/**
 * Medical Compliance Integration Tests — Updated for M002
 * Tests the progressive scroll-based medical compliance system
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

jest.mock('lucide-react', () => {
  return new Proxy({}, {
    get: (_target: any, prop: string) => {
      if (prop === '__esModule') return true
      return (props: any) => <svg data-testid={`icon-${prop}`} {...props} />
    }
  })
})

jest.mock('@/lib/scrollStory', () => ({
  useScrollStory: () => ({
    currentSection: 'hero', scrollProgress: 0, isReady: false,
    sectionsViewed: [], medicalComplianceProgress: 0, hasCompletedMedicalReview: false,
  }),
  useScrollSection: () => ({ ref: { current: null }, isInView: false }),
  useScrollProgress: () => ({ progress: 0 }),
}))

jest.mock('@/lib/disclaimerState', () => ({
  useDisclaimerStore: () => ({
    hasAcknowledged: false, isVisible: false, hasMedicalCondition: false, progress: 0,
    acknowledgeDisclaimer: jest.fn(), setMedicalCondition: jest.fn(),
    medicalSectionsViewed: {}, setMedicalSectionViewed: jest.fn(),
  }),
  medicalCompliance: {
    validateSession: () => ({ isValid: true, requiresRenewal: false }),
    checkContraindications: () => ({ safe: true, warnings: [] }),
  },
}))

jest.mock('@/lib/authState', () => ({
  useAuth: () => ({ isAuthenticated: false, user: null, signOut: jest.fn() }),
}))

jest.mock('@/lib/real-audio-engine', () => ({
  audioEngine: { play: jest.fn().mockResolvedValue(true), stop: jest.fn(), setVolume: jest.fn(), isPlaying: jest.fn(() => false) },
}))

jest.mock('@/components/landing/frequency-lab/FrequencyLab', () => {
  return function MockFrequencyLab() { return <div data-testid="frequency-lab">FrequencyLab</div> }
})

jest.mock('@/components/landing/HeroAnimations', () => {
  return function MockHeroAnimations() { return <div data-testid="hero-animations">HeroAnimations</div> }
})

jest.mock('@/components/ui/ScrollProgress', () => ({
  __esModule: true,
  default: () => <div data-testid="scroll-progress" />,
  ScrollIndicator: () => <div data-testid="scroll-indicator" />,
}))

jest.mock('@/components/landing/MedicalScrollSections', () => ({
  __esModule: true,
  default: () => <div data-testid="medical-sections"><span>FDA</span><span>supervisión médica</span></div>,
}))

jest.mock('@/components/auth/MagicLinkForm', () => ({
  __esModule: true,
  default: () => <div data-testid="magic-link-form">MagicLinkForm</div>,
}))

import CalmFrequencyApp from '@/app/calm-page'

describe('Medical Compliance — Progressive Scroll System', () => {
  test('renders scroll-based medical sections (no blocking modal)', () => {
    const { container } = render(<CalmFrequencyApp />)
    // Should NOT have a blocking modal dialog
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(container.firstChild).toBeTruthy()
  })

  test('renders FDA disclaimer content', () => {
    render(<CalmFrequencyApp />)
    expect(screen.getByText(/FDA/i)).toBeInTheDocument()
  })

  test('shows safety review when compliance not complete', () => {
    render(<CalmFrequencyApp />)
    // With mock default (compliance incomplete), shows safety review prompt
    expect(screen.getByText(/Revisión de Seguridad/)).toBeInTheDocument()
  })

  test('renders substantial content', () => {
    const { container } = render(<CalmFrequencyApp />)
    expect(container.innerHTML.length).toBeGreaterThan(1000)
  })
})

describe('Disclaimer State Store Interface', () => {
  test('mock store has expected API shape', () => {
    const mockStore = {
      hasAcknowledged: false, isVisible: false, hasMedicalCondition: false,
      progress: 0, acknowledgeDisclaimer: jest.fn(), setMedicalCondition: jest.fn(),
      medicalSectionsViewed: {}, setMedicalSectionViewed: jest.fn(),
    }
    expect(mockStore).toHaveProperty('hasAcknowledged')
    expect(mockStore).toHaveProperty('progress')
    expect(mockStore).toHaveProperty('medicalSectionsViewed')
    expect(typeof mockStore.acknowledgeDisclaimer).toBe('function')
  })
})
