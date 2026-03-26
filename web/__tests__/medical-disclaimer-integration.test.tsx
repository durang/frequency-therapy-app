/**
 * Medical Disclaimer Integration Tests
 * Tests the integration between medical disclaimer modal and frequency therapy flow
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import CalmFrequencyApp from '@/app/calm-page'
import { useDisclaimerStore, medicalCompliance } from '@/lib/disclaimerState'

// Mock the audio engine to avoid audio-related issues in tests
jest.mock('@/lib/real-audio-engine', () => ({
  audioEngine: {
    play: jest.fn().mockResolvedValue(true),
    stop: jest.fn(),
    setVolume: jest.fn(),
  }
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
  }
})

// Mock FrequencyLab component
jest.mock('@/components/landing/frequency-lab/FrequencyLab', () => {
  return function MockFrequencyLab(props: any) {
    return <div data-testid="frequency-lab">Frequency Laboratory</div>
  }
})

describe('Medical Disclaimer Integration', () => {
  beforeEach(() => {
    // Reset disclaimer state before each test
    act(() => {
      useDisclaimerStore.getState().resetDisclaimer()
    })
    
    // Clear localStorage and sessionStorage
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
      window.sessionStorage.clear()
    }
  })

  describe('Disclaimer Modal Visibility', () => {
    it('should show medical disclaimer modal on first visit', () => {
      render(<CalmFrequencyApp />)
      
      expect(screen.getByText('Important Medical Information')).toBeInTheDocument()
      expect(screen.getByText('FDA Medical Device Disclaimer')).toBeInTheDocument()
      expect(screen.getByText('I Understand and Agree to Proceed')).toBeInTheDocument()
    })

    it('should hide main app content when disclaimer is shown', () => {
      render(<CalmFrequencyApp />)
      
      // Main app content should not be accessible when disclaimer is visible
      const frequencyLab = screen.queryByText('Frequency Laboratory')
      expect(frequencyLab).not.toBeVisible()
    })

    it('should not show disclaimer after user acceptance', () => {
      // Accept disclaimer first
      act(() => {
        useDisclaimerStore.getState().acceptDisclaimer()
      })
      
      render(<CalmFrequencyApp />)
      
      expect(screen.queryByText('Important Medical Information')).not.toBeInTheDocument()
      expect(screen.getByText('FreqHeal')).toBeInTheDocument()
    })
  })

  describe('Disclaimer Acceptance Flow', () => {
    it('should require all checkboxes to be checked before acceptance', async () => {
      render(<CalmFrequencyApp />)
      
      const acceptButton = screen.getByText('I Understand and Agree to Proceed')
      expect(acceptButton).toBeDisabled()
      
      // Check all required checkboxes
      const checkboxes = screen.getAllByRole('checkbox')
      for (const checkbox of checkboxes) {
        fireEvent.click(checkbox)
      }
      
      await waitFor(() => {
        expect(acceptButton).not.toBeDisabled()
      })
    })

    it('should hide disclaimer and show app after acceptance', async () => {
      render(<CalmFrequencyApp />)
      
      // Check all required checkboxes
      const checkboxes = screen.getAllByRole('checkbox')
      for (const checkbox of checkboxes) {
        fireEvent.click(checkbox)
      }
      
      const acceptButton = screen.getByText('I Understand and Agree to Proceed')
      fireEvent.click(acceptButton)
      
      await waitFor(() => {
        expect(screen.queryByText('Important Medical Information')).not.toBeInTheDocument()
        expect(screen.getByText('FreqHeal')).toBeInTheDocument()
      })
    })

    it('should persist disclaimer acceptance across page reloads', async () => {
      const { unmount } = render(<CalmFrequencyApp />)
      
      // Accept disclaimer
      const checkboxes = screen.getAllByRole('checkbox')
      for (const checkbox of checkboxes) {
        fireEvent.click(checkbox)
      }
      
      fireEvent.click(screen.getByText('I Understand and Agree to Proceed'))
      
      await waitFor(() => {
        expect(screen.queryByText('Important Medical Information')).not.toBeInTheDocument()
      })
      
      // Unmount and re-render to simulate page reload
      unmount()
      render(<CalmFrequencyApp />)
      
      // Disclaimer should not appear again
      expect(screen.queryByText('Important Medical Information')).not.toBeInTheDocument()
      expect(screen.getByText('FreqHeal')).toBeInTheDocument()
    })
  })

  describe('Disclaimer Decline Flow', () => {
    it('should show alert and maintain disclaimer state when declined', async () => {
      // Mock window.alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
      
      render(<CalmFrequencyApp />)
      
      const declineButton = screen.getByText('I Do Not Agree')
      fireEvent.click(declineButton)
      
      // Should show alert
      expect(alertSpy).toHaveBeenCalledWith(
        'You must accept the medical disclaimer to use frequency therapy features. You can return to this page anytime to review and accept.'
      )
      
      // Disclaimer should remain visible
      expect(screen.getByText('Important Medical Information')).toBeInTheDocument()
      
      alertSpy.mockRestore()
    })
  })

  describe('Frequency Therapy Access Control', () => {
    it('should prevent frequency playback without disclaimer acceptance', async () => {
      const { audioEngine } = await import('@/lib/real-audio-engine')
      
      render(<CalmFrequencyApp />)
      
      // Try to access frequency controls while disclaimer is shown
      // The frequency lab should not be interactive
      expect(screen.getByText('Important Medical Information')).toBeInTheDocument()
      
      // Audio engine play should not be called
      expect(audioEngine.play).not.toHaveBeenCalled()
    })

    it('should allow frequency playback after disclaimer acceptance', async () => {
      const { audioEngine } = await import('@/lib/real-audio-engine')
      
      render(<CalmFrequencyApp />)
      
      // Accept disclaimer
      const checkboxes = screen.getAllByRole('checkbox')
      for (const checkbox of checkboxes) {
        fireEvent.click(checkbox)
      }
      
      fireEvent.click(screen.getByText('I Understand and Agree to Proceed'))
      
      await waitFor(() => {
        expect(screen.queryByText('Important Medical Information')).not.toBeInTheDocument()
      })
      
      // Now frequency controls should be available and functional
      const playButtons = screen.getAllByRole('button', { name: /play/i })
      if (playButtons.length > 0) {
        fireEvent.click(playButtons[0])
        
        await waitFor(() => {
          expect(audioEngine.play).toHaveBeenCalled()
        })
      }
    })
  })

  describe('Session Management', () => {
    it('should track compliance metadata', () => {
      act(() => {
        useDisclaimerStore.getState().acceptDisclaimer()
      })
      
      const metadata = medicalCompliance.getComplianceMetadata()
      
      expect(metadata.hasAcceptedDisclaimer).toBe(true)
      expect(metadata.disclaimerVersion).toBe('1.2')
      expect(metadata.disclaimerAcceptedAt).toBeTruthy()
      expect(metadata.sessionId).toBeTruthy()
      expect(metadata.isRequired).toBe(false)
    })

    it('should validate session for medical features', () => {
      // Invalid session initially
      let validation = medicalCompliance.validateSession()
      expect(validation.valid).toBe(false)
      expect(validation.reason).toBe('Medical disclaimer not accepted')
      
      // Accept disclaimer
      act(() => {
        useDisclaimerStore.getState().acceptDisclaimer()
      })
      
      // Should be valid now
      validation = medicalCompliance.validateSession()
      expect(validation.valid).toBe(true)
      expect(validation.reason).toBeUndefined()
    })

    it('should expire session after 24 hours', () => {
      // Accept disclaimer
      act(() => {
        useDisclaimerStore.getState().acceptDisclaimer()
      })
      
      // Mock time to be 25 hours later
      const originalNow = Date.now
      Date.now = jest.fn(() => originalNow() + (25 * 60 * 60 * 1000))
      
      const validation = medicalCompliance.validateSession()
      expect(validation.valid).toBe(false)
      expect(validation.reason).toBe('Session expired')
      
      // Restore original Date.now
      Date.now = originalNow
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for disclaimer elements', () => {
      render(<CalmFrequencyApp />)
      
      // Check for accessible elements
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getAllByRole('checkbox')).toHaveLength(4)
      expect(screen.getAllByRole('button')).toHaveLength(2)
    })

    it('should support keyboard navigation', () => {
      render(<CalmFrequencyApp />)
      
      const firstCheckbox = screen.getAllByRole('checkbox')[0]
      firstCheckbox.focus()
      expect(document.activeElement).toBe(firstCheckbox)
      
      // Tab should move to next checkbox
      fireEvent.keyDown(firstCheckbox, { key: 'Tab' })
      // Note: In a real app, this would focus the next checkbox
      // The exact behavior depends on the implementation
    })
  })

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', () => {
      // Mock localStorage to throw errors
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded')
      })
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      
      // Should not crash when accepting disclaimer
      act(() => {
        useDisclaimerStore.getState().acceptDisclaimer()
      })
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Medical Compliance] Failed to store compliance metadata:'),
        expect.any(Error)
      )
      
      // Restore mocks
      Storage.prototype.setItem = originalSetItem
      consoleSpy.mockRestore()
    })

    it('should handle missing sessionStorage gracefully', () => {
      // Mock missing sessionStorage
      const originalSessionStorage = window.sessionStorage
      Object.defineProperty(window, 'sessionStorage', {
        value: undefined,
        writable: true,
      })
      
      // Should not crash
      render(<CalmFrequencyApp />)
      expect(screen.getByText('Important Medical Information')).toBeInTheDocument()
      
      // Restore sessionStorage
      Object.defineProperty(window, 'sessionStorage', {
        value: originalSessionStorage,
        writable: true,
      })
    })
  })
})