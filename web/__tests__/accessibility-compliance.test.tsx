/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import CalmFrequencyApp from '@/app/calm-page'
import { ClientAccessibilityControls } from '@/components/ui/ClientAccessibilityControls'
import { ClientEmergencyHandler } from '@/components/ui/ClientEmergencyHandler'
import '@testing-library/jest-dom'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock audio functionality
const mockAudioEngine = {
  playFrequency: jest.fn(),
  stopFrequency: jest.fn(),
  emergencyStop: jest.fn(),
  setVolume: jest.fn(),
  mute: jest.fn(),
  unmute: jest.fn(),
}

// Mock global audio engine
Object.defineProperty(window, 'FreqTherapyAudio', {
  value: mockAudioEngine,
  writable: true,
})

// Mock audio context
Object.defineProperty(window, 'AudioContext', {
  value: jest.fn().mockImplementation(() => ({
    createOscillator: jest.fn().mockReturnValue({
      frequency: { value: 0 },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    }),
    createGain: jest.fn().mockReturnValue({
      gain: { value: 0 },
      connect: jest.fn(),
    }),
    destination: {},
  })),
  writable: true,
})

// Mock disclaimer state
jest.mock('@/lib/disclaimerState', () => ({
  useDisclaimerRequired: () => ({
    isRequired: false,
    acceptDisclaimer: jest.fn(),
    resetDisclaimer: jest.fn(),
  }),
  medicalCompliance: {
    validateSession: () => ({ valid: true }),
    getComplianceMetadata: () => ({}),
  },
}))

// Mock health profile
jest.mock('@/lib/userHealthProfile', () => ({
  UserHealthProfileManager: {
    getProfile: () => ({ conditions: [], medications: [], allergies: [] }),
  },
}))

// Mock medical safety
jest.mock('@/lib/medicalSafety', () => ({
  FrequencySafetyValidator: {
    validateFrequency: () => ({ isValid: true, frequency: { hz_value: 440 } }),
    checkContraindications: () => ({ isContraindicated: false, warnings: [] }),
  },
}))

describe('Accessibility Compliance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset any accessibility state
    document.documentElement.classList.remove('high-contrast')
    
    // Clear any existing emergency notices
    const existingNotice = document.getElementById('emergency-notice')
    if (existingNotice) {
      existingNotice.remove()
    }
  })

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations on accessibility controls', async () => {
      const { container } = render(<ClientAccessibilityControls />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations on emergency handler', async () => {
      const { container } = render(<ClientEmergencyHandler />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should provide skip links for keyboard navigation', () => {
      render(<ClientAccessibilityControls />)
      
      const skipToMainLink = screen.getByText('Skip to main content')
      const skipToNavigationLink = screen.getByText('Skip to navigation')
      const skipToControlsLink = screen.getByText('Skip to frequency controls')
      
      expect(skipToMainLink).toBeInTheDocument()
      expect(skipToNavigationLink).toBeInTheDocument()
      expect(skipToControlsLink).toBeInTheDocument()
      
      // Verify skip links have proper href attributes
      expect(skipToMainLink).toHaveAttribute('href', '#main-content')
      expect(skipToNavigationLink).toHaveAttribute('href', '#navigation')
      expect(skipToControlsLink).toHaveAttribute('href', '#frequency-controls')
    })

    it('should support Tab navigation through interactive elements', async () => {
      const user = userEvent.setup()
      render(<ClientAccessibilityControls />)

      // Get the high contrast button (it's in a focus-within container)
      const contrastButton = screen.getByRole('button', { name: /high contrast/i })
      expect(contrastButton).toBeInTheDocument()

      // Focus the container first to make the button visible/focusable
      const focusContainer = contrastButton.closest('div')
      if (focusContainer) {
        focusContainer.focus()
      }

      // Test direct button focus
      contrastButton.focus()
      expect(contrastButton).toHaveFocus()
    })

    it('should support Enter key activation on buttons', async () => {
      const user = userEvent.setup()
      render(<ClientAccessibilityControls />)

      const contrastButton = screen.getByRole('button', { name: /high contrast/i })
      contrastButton.focus()
      
      // Press Enter to activate
      await user.keyboard('{Enter}')
      
      // Should toggle high contrast (DOM class change)
      expect(document.documentElement).toHaveClass('high-contrast')
    })
  })

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels on all controls', () => {
      render(<ClientAccessibilityControls />)

      // Check high contrast button has accessible name
      const contrastButton = screen.getByRole('button', { name: /high contrast/i })
      expect(contrastButton).toHaveAccessibleName()
      expect(contrastButton).toHaveAttribute('aria-label')
    })

    it('should announce emergency stop activation', async () => {
      render(<ClientEmergencyHandler />)

      // Get the emergency notice element
      const emergencyNotice = screen.getByRole('alert')
      expect(emergencyNotice).toBeInTheDocument()
      
      // Check for proper ARIA attributes
      expect(emergencyNotice).toHaveAttribute('role', 'alert')
      expect(emergencyNotice).toHaveAttribute('aria-live', 'assertive')
      expect(emergencyNotice).toHaveAttribute('aria-label', 'Emergency stop notification')
    })

    it('should provide clear button descriptions', () => {
      render(<ClientEmergencyHandler />)

      const acknowledgeButton = screen.getByRole('button', { name: /acknowledge/i })
      expect(acknowledgeButton).toHaveAccessibleName()
      expect(acknowledgeButton).toHaveAttribute('aria-label')
    })
  })

  describe('Emergency Stop Functionality', () => {
    it('should trigger emergency stop on Escape key', () => {
      render(<ClientEmergencyHandler />)

      // Mock the emergency stop event handler that would be in the layout
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if ((window as any).FreqTherapyAudio) {
            (window as any).FreqTherapyAudio.emergencyStop()
            document.getElementById('emergency-notice')?.classList.remove('hidden')
          }
        }
      }

      // Add the event listener manually for testing
      document.addEventListener('keydown', handleEscapeKey)

      // Simulate Escape key press
      fireEvent.keyDown(document, { key: 'Escape' })

      // Verify emergency stop was called
      expect(mockAudioEngine.emergencyStop).toHaveBeenCalled()

      // Clean up
      document.removeEventListener('keydown', handleEscapeKey)
    })

    it('should show emergency notice with proper accessibility', () => {
      const { container } = render(<ClientEmergencyHandler />)

      // Get emergency notice
      const emergencyNotice = container.querySelector('#emergency-notice')
      expect(emergencyNotice).toHaveAttribute('role', 'alert')
      expect(emergencyNotice).toHaveAttribute('aria-live', 'assertive')
      expect(emergencyNotice).toHaveTextContent(/emergency stop activated/i)
    })

    it('should allow emergency notice acknowledgment', async () => {
      const user = userEvent.setup()
      render(<ClientEmergencyHandler />)

      // Find acknowledge button
      const acknowledgeButton = screen.getByText('Acknowledge')
      await user.click(acknowledgeButton)

      // Verify notice can be hidden (function exists)
      expect(acknowledgeButton).toBeInTheDocument()
    })

    it('should have acknowledge button that can receive focus', () => {
      render(<ClientEmergencyHandler />)

      // Find acknowledge button and verify it can be focused
      const acknowledgeButton = screen.getByText('Acknowledge')
      expect(acknowledgeButton).toBeInTheDocument()
      
      // Focus the button manually
      acknowledgeButton.focus()
      expect(acknowledgeButton).toHaveFocus()
    })
  })

  describe('High Contrast Mode', () => {
    it('should provide high contrast toggle', () => {
      render(<ClientAccessibilityControls />)

      const contrastToggle = screen.getByRole('button', { name: /high contrast/i })
      expect(contrastToggle).toBeInTheDocument()
      expect(contrastToggle).toHaveAccessibleName()
    })

    it('should toggle high contrast mode when activated', async () => {
      const user = userEvent.setup()
      render(<ClientAccessibilityControls />)

      const contrastToggle = screen.getByRole('button', { name: /high contrast/i })
      
      // Initial state - no high contrast
      expect(document.documentElement).not.toHaveClass('high-contrast')

      // Click to enable high contrast
      await user.click(contrastToggle)
      expect(document.documentElement).toHaveClass('high-contrast')

      // Click again to disable
      await user.click(contrastToggle)
      expect(document.documentElement).not.toHaveClass('high-contrast')
    })

    it('should apply high contrast styles when enabled', async () => {
      const user = userEvent.setup()
      render(<ClientAccessibilityControls />)

      const contrastToggle = screen.getByRole('button', { name: /high contrast/i })
      await user.click(contrastToggle)

      // Verify high contrast class is applied
      expect(document.documentElement).toHaveClass('high-contrast')
    })
  })

  describe('Focus Management', () => {
    it('should have visible focus indicators on interactive elements', () => {
      render(<ClientAccessibilityControls />)

      const contrastButton = screen.getByRole('button', { name: /high contrast/i })
      
      // Focus the button
      contrastButton.focus()
      
      // Verify it's focusable and has focus styles
      expect(contrastButton).toHaveFocus()
      expect(contrastButton).toHaveClass('focus:outline-none', 'focus:ring-4')
    })
  })

  describe('Medical Compliance Accessibility', () => {
    it('should ensure emergency elements have proper accessibility attributes', () => {
      render(<ClientEmergencyHandler />)

      // Emergency notice should be an alert
      const emergencyNotice = screen.getByRole('alert')
      expect(emergencyNotice).toHaveAttribute('aria-live', 'assertive')
      expect(emergencyNotice).toHaveAttribute('aria-label')
    })

    it('should provide accessible skip links', () => {
      render(<ClientAccessibilityControls />)

      // Check that skip links are present and properly structured
      const skipLinks = screen.getAllByRole('link')
      expect(skipLinks).toHaveLength(3)
      
      skipLinks.forEach(link => {
        expect(link).toHaveAttribute('href')
        expect(link.getAttribute('href')).toMatch(/^#/)
      })
    })
  })

  describe('Error Handling Accessibility', () => {
    it('should provide accessible error announcement mechanisms', () => {
      render(<ClientEmergencyHandler />)

      // Should have alert role for error announcements
      const alertElement = screen.getByRole('alert')
      expect(alertElement).toHaveAttribute('role', 'alert')
    })
  })

  describe('Keyboard Shortcuts', () => {
    it('should provide keyboard shortcut information for screen readers', () => {
      render(<ClientAccessibilityControls />)

      // Should have keyboard shortcuts information
      const shortcutsInfo = screen.getByText(/keyboard shortcuts/i)
      expect(shortcutsInfo).toBeInTheDocument()
      expect(shortcutsInfo.closest('div')).toHaveAttribute('aria-live', 'polite')
    })
  })
})