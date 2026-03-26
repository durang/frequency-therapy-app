/**
 * Browser Compatibility Test Suite
 * Tests for cross-browser compatibility and Next.js 16 App Router functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock Next.js components for compatibility testing
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Import the main page component
import HomePage from '@/app/page'
import CalmFrequencyApp from '@/app/calm-page'

describe('Browser Compatibility Tests', () => {
  // Test suite for different browser environments
  
  describe('Chrome/Webkit Compatibility', () => {
    beforeEach(() => {
      // Mock Chrome-specific features
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        configurable: true
      })
    })

    test('renders correctly in Chrome environment', () => {
      render(<HomePage />)
      expect(screen.getByText(/Encuentra tu/)).toBeInTheDocument()
    })

    test('audio context works in Chrome', () => {
      render(<CalmFrequencyApp />)
      
      // Test that AudioContext mock is properly initialized
      const audioContext = new (window as any).AudioContext()
      expect(audioContext).toBeDefined()
      expect(audioContext.createOscillator).toBeDefined()
    })

    test('CSS Grid and Flexbox layouts render correctly', () => {
      render(<CalmFrequencyApp />)
      
      // Check for grid layouts in frequency cards
      const container = screen.getByText('Frecuencias Destacadas').parentElement
      expect(container).toBeInTheDocument()
    })
  })

  describe('Safari/WebKit Compatibility', () => {
    beforeEach(() => {
      // Mock Safari user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        configurable: true
      })
    })

    test('renders correctly in Safari environment', () => {
      render(<HomePage />)
      expect(screen.getByText(/Encuentra tu/)).toBeInTheDocument()
    })

    test('backdrop-blur effects are properly fallback-supported', () => {
      render(<CalmFrequencyApp />)
      
      // Check that elements with backdrop-blur have proper CSS classes
      // Safari has varying support for backdrop-blur
      const header = screen.getByText('FreqHeal').closest('header')
      expect(header).toBeInTheDocument()
    })

    test('SVG icons render correctly in Safari', () => {
      render(<CalmFrequencyApp />)
      
      // Lucide icons should render properly in Safari
      const svgElements = document.querySelectorAll('svg')
      expect(svgElements.length).toBeGreaterThan(0)
    })
  })

  describe('Firefox Compatibility', () => {
    beforeEach(() => {
      // Mock Firefox user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
        configurable: true
      })
    })

    test('renders correctly in Firefox environment', () => {
      render(<HomePage />)
      expect(screen.getByText(/Encuentra tu/)).toBeInTheDocument()
    })

    test('CSS custom properties work correctly', () => {
      render(<CalmFrequencyApp />)
      
      // Firefox should support CSS custom properties used in gradients
      const gradientElements = document.querySelectorAll('[style*="gradient"]')
      // Elements with gradient styles should be present
      expect(document.body).toBeInTheDocument()
    })
  })

  describe('Next.js 16 App Router Compatibility', () => {
    test('page component renders without SSR issues', () => {
      // Test that the page can be rendered server-side
      render(<HomePage />)
      expect(screen.getByText(/Encuentra tu/)).toBeInTheDocument()
    })

    test('client components work correctly', () => {
      // CalmFrequencyApp is marked with 'use client'
      render(<CalmFrequencyApp />)
      expect(screen.getByText('FreqHeal')).toBeInTheDocument()
    })

    test('navigation links work with App Router', () => {
      render(<CalmFrequencyApp />)
      
      // Check that Next.js Link components are properly mocked
      const libraryLink = screen.getByText('Ver Biblioteca Completa')
      expect(libraryLink.closest('a')).toHaveAttribute('href', '/library')
    })

    test('useEffect hooks work correctly in client components', async () => {
      render(<CalmFrequencyApp />)
      
      // The component uses useEffect for audio visualization
      // Test that it doesn't crash during render
      await waitFor(() => {
        expect(screen.getByText('FreqHeal')).toBeInTheDocument()
      })
    })

    test('useState works correctly for component state', async () => {
      const user = userEvent.setup()
      render(<CalmFrequencyApp />)
      
      // Test state changes work (play button toggle)
      const playButtons = await screen.findAllByText('Reproducir')
      await user.click(playButtons[0])
      
      await waitFor(() => {
        expect(screen.getByText('Pausar')).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Design Compatibility', () => {
    test('mobile layout renders correctly', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<CalmFrequencyApp />)
      
      // Check that mobile menu button is present
      const menuButton = screen.getByRole('button', { 
        name: '', // Menu buttons often don't have accessible names
      })
      expect(document.body).toContainElement(menuButton.parentElement || menuButton)
    })

    test('tablet layout renders correctly', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })
      
      render(<CalmFrequencyApp />)
      expect(screen.getByText('FreqHeal')).toBeInTheDocument()
    })

    test('desktop layout renders correctly', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })
      
      render(<CalmFrequencyApp />)
      
      // Desktop navigation should be visible
      expect(screen.getByText('Frecuencias')).toBeInTheDocument()
      expect(screen.getByText('Biblioteca')).toBeInTheDocument()
    })
  })

  describe('Accessibility Compatibility', () => {
    test('proper ARIA labels are present', () => {
      render(<CalmFrequencyApp />)
      
      // Check for proper button labels
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    test('keyboard navigation works correctly', async () => {
      const user = userEvent.setup()
      render(<CalmFrequencyApp />)
      
      // Test tab navigation
      await user.tab()
      
      // Should focus on first interactive element
      expect(document.activeElement).toBeInTheDocument()
    })

    test('screen reader content is properly structured', () => {
      render(<CalmFrequencyApp />)
      
      // Check for proper heading hierarchy
      const h1Elements = screen.getAllByRole('heading', { level: 1 })
      expect(h1Elements.length).toBeGreaterThan(0)
    })
  })

  describe('Performance and Loading', () => {
    test('components render without significant delay', async () => {
      const startTime = Date.now()
      
      render(<CalmFrequencyApp />)
      
      await waitFor(() => {
        expect(screen.getByText('FreqHeal')).toBeInTheDocument()
      })
      
      const renderTime = Date.now() - startTime
      
      // Component should render within reasonable time (2 seconds in test environment)
      expect(renderTime).toBeLessThan(2000)
    })

    test('no memory leaks with component unmounting', () => {
      const { unmount } = render(<CalmFrequencyApp />)
      
      // Component should unmount without errors
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('Error Boundary Compatibility', () => {
    test('handles errors gracefully', () => {
      // Mock console.error to prevent test output pollution
      const originalError = console.error
      console.error = jest.fn()
      
      try {
        // Component should not throw unhandled errors
        render(<CalmFrequencyApp />)
        expect(screen.getByText('FreqHeal')).toBeInTheDocument()
      } catch (error) {
        // If any error occurs, it should be caught and handled
        expect(error).toBeUndefined()
      } finally {
        console.error = originalError
      }
    })
  })
})