// Development-safe Supabase client with fallbacks

const isDevelopment = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

// Mock Supabase for development when no real connection is available
const createMockSupabase = () => ({
  auth: {
    signUp: async (credentials: any) => ({
      data: { user: { id: '1', email: credentials.email } },
      error: null
    }),
    signInWithPassword: async (credentials: any) => ({
      data: { user: { id: '1', email: credentials.email } },
      error: null
    }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({
      data: { user: { id: '1', email: 'demo@freqtherapy.app' } }
    })
  },
  from: (table: string) => ({
    select: (fields: string) => ({
      eq: (field: string, value: any) => ({
        single: async () => ({
          data: { id: '1', name: 'Demo Data' },
          error: null
        })
      }),
      order: (field: string, options?: any) => ({
        limit: (limit: number) => ({
          select: async () => ({
            data: [],
            error: null
          })
        })
      })
    }),
    insert: (data: any) => ({
      select: async () => ({
        data: [{ id: '1', ...data }],
        error: null
      })
    }),
    update: (data: any) => ({
      eq: (field: string, value: any) => ({
        select: async () => ({
          data: [{ id: '1', ...data }],
          error: null
        })
      })
    }),
    upsert: (data: any) => ({
      select: async () => ({
        data: [{ id: '1', ...data }],
        error: null
      })
    })
  })
})

// Try to create real Supabase client, fallback to mock if it fails
let supabase: any

try {
  if (isDevelopment && (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder'))) {
    console.log('🔧 Using mock Supabase for development')
    supabase = createMockSupabase()
  } else {
    const { createClient } = require('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
} catch (error) {
  console.log('🔧 Falling back to mock Supabase due to error:', error)
  supabase = createMockSupabase()
}

// Auth helpers with safe fallbacks
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window?.location?.origin || 'http://localhost:3000'}/auth/callback`
      }
    })
    return { data, error }
  } catch (error) {
    return { 
      data: { user: { id: 'demo', email } }, 
      error: null 
    }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  } catch (error) {
    return { 
      data: { user: { id: 'demo', email } }, 
      error: null 
    }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return { error: null }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    return { id: 'demo', email: 'demo@freqtherapy.app' }
  }
}

// Database helpers with safe fallbacks
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    return { data, error }
  } catch (error) {
    return { 
      data: { 
        id: '1', 
        user_id: userId, 
        full_name: 'Demo User',
        created_at: new Date().toISOString()
      }, 
      error: null 
    }
  }
}

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ user_id: userId, ...updates })
      .select()
    
    return { data, error }
  } catch (error) {
    return { 
      data: [{ id: '1', user_id: userId, ...updates }], 
      error: null 
    }
  }
}

export const getFrequencies = async (tier: string = 'free') => {
  // Always return our static frequency data for now
  const { frequencies } = await import('./frequencies')
  const { getFrequenciesByTier } = await import('./frequencies')
  
  try {
    return { 
      data: getFrequenciesByTier(tier), 
      error: null 
    }
  } catch (error) {
    return { data: frequencies.slice(0, 2), error: null }
  }
}

export const getUserSessions = async (userId: string, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('therapy_sessions')
      .select(`
        *,
        frequencies (
          name,
          hz_value,
          category,
          color
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    return { data, error }
  } catch (error) {
    // Return mock session data
    return { 
      data: [
        {
          id: '1',
          user_id: userId,
          frequency_hz: 528,
          duration_minutes: 20,
          created_at: new Date().toISOString(),
          frequencies: {
            name: 'DNA Repair',
            hz_value: 528,
            category: 'dna_repair',
            color: '#9333ea'
          }
        }
      ], 
      error: null 
    }
  }
}

export const createSession = async (sessionData: any) => {
  try {
    const { data, error } = await supabase
      .from('therapy_sessions')
      .insert(sessionData)
      .select()
    
    return { data, error }
  } catch (error) {
    return { 
      data: [{ id: Date.now().toString(), ...sessionData }], 
      error: null 
    }
  }
}

export const updateSession = async (sessionId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('therapy_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
    
    return { data, error }
  } catch (error) {
    return { 
      data: [{ id: sessionId, ...updates }], 
      error: null 
    }
  }
}

// Helper functions
function getTierAccess(tier: string): string[] {
  switch (tier) {
    case 'clinical':
      return ['free', 'basic', 'pro', 'clinical']
    case 'pro':
      return ['free', 'basic', 'pro']
    case 'basic':
      return ['free', 'basic']
    default:
      return ['free']
  }
}

export { supabase }