'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface DisclaimerState {
  hasAcceptedDisclaimer: boolean
  disclaimerAcceptedAt: string | null
  disclaimerVersion: string
  sessionId: string
  userAgent: string
  ipHash: string | null
  acceptDisclaimer: () => void
  resetDisclaimer: () => void
  isDisclaimerRequired: () => boolean
}

// Current disclaimer version - increment when medical terms change
const CURRENT_DISCLAIMER_VERSION = '1.2'

// Session expires after 24 hours
const DISCLAIMER_EXPIRY_HOURS = 24

const generateSessionId = () => {
  return `freq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const hashIP = async (ip: string): Promise<string> => {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(ip)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 16) // First 16 chars for privacy
  } catch {
    return 'unknown'
  }
}

export const useDisclaimerStore = create<DisclaimerState>()(
  persist(
    (set, get) => ({
      hasAcceptedDisclaimer: false,
      disclaimerAcceptedAt: null,
      disclaimerVersion: CURRENT_DISCLAIMER_VERSION,
      sessionId: generateSessionId(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      ipHash: null,

      acceptDisclaimer: () => {
        const now = new Date().toISOString()
        set({
          hasAcceptedDisclaimer: true,
          disclaimerAcceptedAt: now,
          disclaimerVersion: CURRENT_DISCLAIMER_VERSION,
          sessionId: generateSessionId(),
        })

        // Log acceptance for compliance (anonymized)
        if (typeof window !== 'undefined') {
          console.log('[Medical Compliance]', {
            action: 'disclaimer_accepted',
            version: CURRENT_DISCLAIMER_VERSION,
            timestamp: now,
            sessionId: get().sessionId,
            userAgent: get().userAgent.substring(0, 50), // Truncated for privacy
          })

          // Store compliance metadata
          try {
            localStorage.setItem('freq_medical_compliance', JSON.stringify({
              disclaimerAccepted: true,
              version: CURRENT_DISCLAIMER_VERSION,
              timestamp: now,
              sessionId: get().sessionId,
            }))
          } catch (error) {
            console.warn('[Medical Compliance] Failed to store compliance metadata:', error)
          }
        }
      },

      resetDisclaimer: () => {
        set({
          hasAcceptedDisclaimer: false,
          disclaimerAcceptedAt: null,
          sessionId: generateSessionId(),
        })

        // Clear compliance metadata
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('freq_medical_compliance')
            console.log('[Medical Compliance] Disclaimer reset by user')
          } catch (error) {
            console.warn('[Medical Compliance] Failed to clear compliance metadata:', error)
          }
        }
      },

      isDisclaimerRequired: () => {
        const state = get()
        
        // Always require if never accepted
        if (!state.hasAcceptedDisclaimer || !state.disclaimerAcceptedAt) {
          return true
        }

        // Require if version has changed
        if (state.disclaimerVersion !== CURRENT_DISCLAIMER_VERSION) {
          return true
        }

        // Check if expired (24 hours)
        const acceptedTime = new Date(state.disclaimerAcceptedAt).getTime()
        const now = Date.now()
        const hoursElapsed = (now - acceptedTime) / (1000 * 60 * 60)
        
        if (hoursElapsed > DISCLAIMER_EXPIRY_HOURS) {
          return true
        }

        return false
      },
    }),
    {
      name: 'freq-disclaimer-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return sessionStorage // Use sessionStorage for session-based persistence
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      // Only persist essential fields
      partialize: (state) => ({
        hasAcceptedDisclaimer: state.hasAcceptedDisclaimer,
        disclaimerAcceptedAt: state.disclaimerAcceptedAt,
        disclaimerVersion: state.disclaimerVersion,
        sessionId: state.sessionId,
      }),
    }
  )
)

// Medical compliance utilities
export const medicalCompliance = {
  // Check if user can access frequency therapy
  canAccessTherapy: (): boolean => {
    const store = useDisclaimerStore.getState()
    return !store.isDisclaimerRequired()
  },

  // Get compliance metadata for audit trail
  getComplianceMetadata: () => {
    const store = useDisclaimerStore.getState()
    return {
      hasAcceptedDisclaimer: store.hasAcceptedDisclaimer,
      disclaimerVersion: store.disclaimerVersion,
      disclaimerAcceptedAt: store.disclaimerAcceptedAt,
      sessionId: store.sessionId,
      isRequired: store.isDisclaimerRequired(),
    }
  },

  // Validate session for medical features
  validateSession: (): { valid: boolean; reason?: string } => {
    const store = useDisclaimerStore.getState()
    
    if (!store.hasAcceptedDisclaimer) {
      return { valid: false, reason: 'Medical disclaimer not accepted' }
    }

    if (store.disclaimerVersion !== CURRENT_DISCLAIMER_VERSION) {
      return { valid: false, reason: 'Disclaimer version outdated' }
    }

    if (!store.disclaimerAcceptedAt) {
      return { valid: false, reason: 'No acceptance timestamp' }
    }

    const acceptedTime = new Date(store.disclaimerAcceptedAt).getTime()
    const now = Date.now()
    const hoursElapsed = (now - acceptedTime) / (1000 * 60 * 60)
    
    if (hoursElapsed > DISCLAIMER_EXPIRY_HOURS) {
      return { valid: false, reason: 'Session expired' }
    }

    return { valid: true }
  },

  // Emergency compliance reset (admin function)
  emergencyReset: () => {
    const store = useDisclaimerStore.getState()
    store.resetDisclaimer()
    
    if (typeof window !== 'undefined') {
      console.warn('[Medical Compliance] Emergency reset triggered')
      
      // Clear all medical-related storage
      try {
        localStorage.removeItem('freq_medical_compliance')
        sessionStorage.removeItem('freq-disclaimer-storage')
      } catch (error) {
        console.error('[Medical Compliance] Failed to clear storage during emergency reset:', error)
      }
    }
  },
}

// Hook for React components to easily access disclaimer state
export const useDisclaimerRequired = () => {
  const isRequired = useDisclaimerStore((state) => state.isDisclaimerRequired())
  const acceptDisclaimer = useDisclaimerStore((state) => state.acceptDisclaimer)
  const resetDisclaimer = useDisclaimerStore((state) => state.resetDisclaimer)
  const hasAccepted = useDisclaimerStore((state) => state.hasAcceptedDisclaimer)
  
  return {
    isRequired,
    hasAccepted,
    acceptDisclaimer,
    resetDisclaimer,
  }
}