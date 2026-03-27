'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase, signInWithMagicLink as supabaseSignInWithMagicLink, signOut as supabaseSignOut, onAuthStateChange } from './supabase'
import { User } from '../types'

interface AuthState {
  // Core auth state
  user: User | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  
  // Loading and error states
  loading: boolean
  initializing: boolean
  error: string | null
  
  // Auth actions
  signInWithMagicLink: (email: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
  initializeAuth: () => Promise<void>
  clearError: () => void
  
  // Internal state management
  setUser: (user: User | null, supabaseUser: SupabaseUser | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// Transform Supabase user to app User type
const transformSupabaseUser = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    subscription_tier: 'free', // Default tier - will be updated from profile
    created_at: supabaseUser.created_at || new Date().toISOString(),
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      supabaseUser: null,
      session: null,
      loading: false,
      initializing: true,
      error: null,

      // Auth actions
      signInWithMagicLink: async (email: string) => {
        try {
          set({ loading: true, error: null })
          
          console.log('🔐 [AuthState] Initiating magic link sign in for:', email)
          
          const result = await supabaseSignInWithMagicLink(email)
          
          if (result.error) {
            console.error('❌ [AuthState] Magic link failed:', result.error)
            set({ error: result.error.message || 'Failed to send magic link', loading: false })
            return result
          }
          
          console.log('✅ [AuthState] Magic link sent successfully')
          set({ loading: false })
          return result
        } catch (error: any) {
          console.error('❌ [AuthState] Magic link error:', error)
          const errorMessage = error?.message || 'Failed to send magic link'
          set({ error: errorMessage, loading: false })
          return { data: null, error: { message: errorMessage } }
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null })
          
          console.log('👋 [AuthState] Initiating sign out')
          
          const { error } = await supabaseSignOut()
          
          if (error) {
            console.error('❌ [AuthState] Sign out failed:', error)
            set({ error: error.message, loading: false })
            return
          }
          
          // Clear auth state
          set({
            user: null,
            supabaseUser: null,
            session: null,
            loading: false,
            error: null
          })
          
          // Clear any auth-related localStorage items
          if (typeof window !== 'undefined') {
            try {
              // Clear session storage but keep user preferences
              sessionStorage.removeItem('freq-auth-session-storage')
              console.log('✅ [AuthState] Session storage cleared')
            } catch (storageError) {
              console.warn('[AuthState] Failed to clear session storage:', storageError)
            }
          }
          
          console.log('✅ [AuthState] Sign out completed')
          
          // Redirect to home page
          if (typeof window !== 'undefined') {
            window.location.href = '/'
          }
        } catch (error: any) {
          console.error('❌ [AuthState] Sign out error:', error)
          set({ error: error?.message || 'Failed to sign out', loading: false })
        }
      },

      initializeAuth: async () => {
        try {
          set({ initializing: true, error: null })
          
          console.log('🔄 [AuthState] Initializing auth state...')
          
          // Get current session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (sessionError) {
            console.error('❌ [AuthState] Failed to get session:', sessionError)
            set({ initializing: false, error: sessionError.message })
            return
          }
          
          if (session?.user) {
            console.log('✅ [AuthState] Found existing session for:', session.user.email)
            
            const appUser = transformSupabaseUser(session.user)
            set({
              user: appUser,
              supabaseUser: session.user,
              session: session,
              initializing: false
            })
            
            // Fetch user profile to update subscription tier
            try {
              const { getUserProfile } = await import('./supabase')
              const { data: profile } = await getUserProfile(session.user.id)
              
              if (profile) {
                set({
                  user: {
                    ...appUser,
                    subscription_tier: profile.subscription_tier || 'free',
                    profile: profile
                  }
                })
                console.log('✅ [AuthState] User profile loaded')
              }
            } catch (profileError) {
              console.warn('[AuthState] Failed to load user profile:', profileError)
              // Continue with default user data
            }
          } else {
            console.log('ℹ️ [AuthState] No existing session found')
            set({ initializing: false })
          }
          
          // Set up auth state listener
          const { data: { subscription } } = onAuthStateChange(async (event, session) => {
            console.log('🔄 [AuthState] Auth state changed:', event, session?.user?.email || 'no user')
            
            if (event === 'SIGNED_IN' && session?.user) {
              const appUser = transformSupabaseUser(session.user)
              set({
                user: appUser,
                supabaseUser: session.user,
                session: session,
                loading: false,
                error: null
              })
              
              // Load user profile
              try {
                const { getUserProfile } = await import('./supabase')
                const { data: profile } = await getUserProfile(session.user.id)
                
                if (profile) {
                  set({
                    user: {
                      ...appUser,
                      subscription_tier: profile.subscription_tier || 'free',
                      profile: profile
                    }
                  })
                }
              } catch (profileError) {
                console.warn('[AuthState] Failed to load profile on sign in:', profileError)
              }
              
              console.log('✅ [AuthState] User signed in successfully')
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                supabaseUser: null,
                session: null,
                loading: false,
                error: null
              })
              console.log('✅ [AuthState] User signed out')
            } else if (event === 'TOKEN_REFRESHED' && session) {
              set({ session: session })
              console.log('🔄 [AuthState] Token refreshed')
            }
          })
          
          // Store subscription for cleanup (though it's automatically cleaned up on unmount)
          if (typeof window !== 'undefined') {
            (window as any).authStateSubscription = subscription
          }
          
        } catch (error: any) {
          console.error('❌ [AuthState] Initialize auth error:', error)
          set({ 
            initializing: false, 
            error: error?.message || 'Failed to initialize authentication' 
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },

      // Internal setters
      setUser: (user: User | null, supabaseUser: SupabaseUser | null) => {
        set({ user, supabaseUser })
      },

      setSession: (session: Session | null) => {
        set({ session })
      },

      setLoading: (loading: boolean) => {
        set({ loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },
    }),
    {
      name: 'freq-auth-storage',
      storage: createJSONStorage(() => {
        // Use different storage for different types of data
        if (typeof window !== 'undefined') {
          return {
            // Custom storage that persists user preferences in localStorage
            // but keeps session data in sessionStorage for security
            getItem: (name: string) => {
              try {
                if (name === 'freq-auth-storage') {
                  // Get persisted user preferences from localStorage
                  const prefs = localStorage.getItem('freq-auth-preferences')
                  // Get session data from sessionStorage
                  const session = sessionStorage.getItem('freq-auth-session-storage')
                  
                  // Merge preferences with session data
                  const preferences = prefs ? JSON.parse(prefs) : {}
                  const sessionData = session ? JSON.parse(session) : {}
                  
                  return JSON.stringify({
                    ...preferences,
                    ...sessionData
                  })
                }
                return null
              } catch {
                return null
              }
            },
            setItem: (name: string, value: string) => {
              try {
                if (name === 'freq-auth-storage') {
                  const data = JSON.parse(value)
                  
                  // Split data between localStorage (preferences) and sessionStorage (session)
                  const preferences = {
                    // Store user preferences that should persist across sessions
                    lastEmail: data.user?.email || null,
                  }
                  
                  const sessionData = {
                    // Store session-sensitive data that should expire with browser session
                    user: data.user,
                    supabaseUser: data.supabaseUser,
                    session: data.session,
                    initializing: data.initializing,
                    // Don't persist loading or error states
                  }
                  
                  localStorage.setItem('freq-auth-preferences', JSON.stringify(preferences))
                  sessionStorage.setItem('freq-auth-session-storage', JSON.stringify(sessionData))
                }
              } catch (error) {
                console.warn('[AuthState] Failed to save auth state:', error)
              }
            },
            removeItem: (name: string) => {
              try {
                if (name === 'freq-auth-storage') {
                  localStorage.removeItem('freq-auth-preferences')
                  sessionStorage.removeItem('freq-auth-session-storage')
                }
              } catch (error) {
                console.warn('[AuthState] Failed to remove auth state:', error)
              }
            },
          }
        }
        // Fallback for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      
      // Only persist essential, non-sensitive fields
      partialize: (state) => ({
        user: state.user,
        supabaseUser: state.supabaseUser,
        session: state.session,
        initializing: state.initializing,
        // Don't persist loading, error states - they should reset on page load
      }),
    }
  )
)

// Auth utilities following the medical compliance pattern
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const state = useAuthStore.getState()
    return !!(state.user && state.session)
  },

  // Check if user has specific subscription tier
  hasSubscriptionTier: (requiredTier: 'free' | 'basic' | 'pro' | 'clinical'): boolean => {
    const state = useAuthStore.getState()
    if (!state.user) return false
    
    const tierHierarchy = ['free', 'basic', 'pro', 'clinical']
    const userTierIndex = tierHierarchy.indexOf(state.user.subscription_tier)
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier)
    
    return userTierIndex >= requiredTierIndex
  },

  // Get user metadata for logging/analytics
  getUserMetadata: () => {
    const state = useAuthStore.getState()
    return {
      isAuthenticated: !!state.user,
      userId: state.user?.id || null,
      email: state.user?.email || null,
      subscriptionTier: state.user?.subscription_tier || 'free',
      sessionId: state.session?.access_token?.substring(0, 16) || null, // Truncated for privacy
      initializing: state.initializing,
      hasProfile: !!state.user?.profile,
    }
  },

  // Validate session for protected features
  validateSession: (): { valid: boolean; reason?: string } => {
    const state = useAuthStore.getState()
    
    if (state.initializing) {
      return { valid: false, reason: 'Authentication initializing' }
    }
    
    if (!state.user) {
      return { valid: false, reason: 'Not authenticated' }
    }
    
    if (!state.session) {
      return { valid: false, reason: 'No active session' }
    }
    
    // Check if session is expired
    if (state.session.expires_at) {
      const expiresAt = new Date(state.session.expires_at * 1000) // Convert from Unix timestamp
      if (expiresAt < new Date()) {
        return { valid: false, reason: 'Session expired' }
      }
    }
    
    return { valid: true }
  },

  // Emergency auth reset
  emergencyReset: async () => {
    console.warn('[AuthState] Emergency auth reset triggered')
    
    try {
      // Force sign out
      await supabaseSignOut()
      
      // Clear all auth storage
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('freq-auth-preferences')
          sessionStorage.removeItem('freq-auth-session-storage')
          sessionStorage.removeItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1] + '-auth-token')
        } catch (storageError) {
          console.error('[AuthState] Failed to clear auth storage during emergency reset:', storageError)
        }
      }
      
      // Reset store state
      useAuthStore.setState({
        user: null,
        supabaseUser: null,
        session: null,
        loading: false,
        initializing: false,
        error: null,
      })
      
      console.log('✅ [AuthState] Emergency reset completed')
    } catch (error) {
      console.error('❌ [AuthState] Emergency reset failed:', error)
    }
  },
}

// Hook for React components to easily access auth state
export const useAuth = () => {
  const user = useAuthStore((state) => state.user)
  const supabaseUser = useAuthStore((state) => state.supabaseUser)
  const session = useAuthStore((state) => state.session)
  const loading = useAuthStore((state) => state.loading)
  const initializing = useAuthStore((state) => state.initializing)
  const error = useAuthStore((state) => state.error)
  const signInWithMagicLink = useAuthStore((state) => state.signInWithMagicLink)
  const signOut = useAuthStore((state) => state.signOut)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const clearError = useAuthStore((state) => state.clearError)
  
  return {
    // State
    user,
    supabaseUser,
    session,
    loading,
    initializing,
    error,
    
    // Actions
    signInWithMagicLink,
    signOut,
    initializeAuth,
    clearError,
    
    // Computed state
    isAuthenticated: authUtils.isAuthenticated(),
    isValidSession: authUtils.validateSession().valid,
    
    // Utilities
    hasSubscriptionTier: authUtils.hasSubscriptionTier,
    getUserMetadata: authUtils.getUserMetadata,
  }
}

// Auto-initialize auth on module load (client-side only)
if (typeof window !== 'undefined') {
  // Initialize auth state when the module loads
  setTimeout(() => {
    const state = useAuthStore.getState()
    if (state.initializing) {
      state.initializeAuth().catch(error => {
        console.error('[AuthState] Auto-initialization failed:', error)
      })
    }
  }, 100) // Small delay to ensure DOM is ready
}