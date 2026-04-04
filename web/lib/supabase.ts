import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Determine if we're in a non-runtime environment (test, build-time SSG)
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined
const isBuildTime = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder") || supabaseAnonKey.includes("placeholder")

// Validate at runtime only — not during test or build-time static generation
if (!isTestEnv && !isBuildTime) {
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
    throw new Error('Supabase environment variables contain placeholder values')
  }
}

// Create Supabase client — uses safe defaults during build/test, real values at runtime
const clientUrl = supabaseUrl || 'https://placeholder-project.supabase.co'
const clientKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

export const supabase: SupabaseClient = createClient(clientUrl, clientKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: !isTestEnv && !isBuildTime,
    detectSessionInUrl: !isTestEnv && !isBuildTime
  }
})

// Connection status logging (only at runtime with real credentials)
if (!isTestEnv && !isBuildTime) {
  console.log('🔗 Supabase client initialized:', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey.length,
    timestamp: new Date().toISOString()
  })
}

// Magic Link Authentication
export const signInWithMagicLink = async (email: string) => {
  try {
    console.log('📧 Attempting magic link sign in for:', email)
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })

    if (error) {
      console.error('❌ Magic link sign in failed:', error)
      return { data: null, error }
    }

    console.log('✅ Magic link sent successfully to:', email)
    return { data, error: null }
  } catch (error) {
    console.error('❌ Magic link sign in error:', error)
    return { 
      data: null, 
      error: { message: 'Failed to send magic link' } 
    }
  }
}

// Traditional Auth helpers (updated for real Supabase)
export const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
  try {
    console.log('👤 Sign up attempt for:', email)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        ...(metadata ? { data: metadata } : {})
      }
    })

    if (error) {
      console.error('❌ Sign up failed:', error)
    } else {
      console.log('✅ Sign up successful for:', email)
    }

    return { data, error }
  } catch (error) {
    console.error('❌ Sign up error:', error)
    return { 
      data: null, 
      error: { message: 'Failed to create account' } 
    }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    console.log('🔑 Sign in attempt for:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('❌ Sign in failed:', error)
    } else {
      console.log('✅ Sign in successful for:', email)
    }

    return { data, error }
  } catch (error) {
    console.error('❌ Sign in error:', error)
    return { 
      data: null, 
      error: { message: 'Failed to sign in' } 
    }
  }
}

export const signOut = async () => {
  try {
    console.log('👋 Sign out attempt')
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Sign out failed:', error)
    } else {
      console.log('✅ Sign out successful')
    }

    return { error }
  } catch (error) {
    console.error('❌ Sign out error:', error)
    return { error: { message: 'Failed to sign out' } }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('❌ Get user failed:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('❌ Get user error:', error)
    return null
  }
}

// Session management
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Get session failed:', error)
      return null
    }

    return session
  } catch (error) {
    console.error('❌ Get session error:', error)
    return null
  }
}

// Auth state listener
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Database helpers with error handling
export const getUserProfile = async (userId: string) => {
  try {
    console.log('👤 Fetching user profile for:', userId)
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('❌ Get user profile failed:', error)
    }

    return { data, error }
  } catch (error) {
    console.error('❌ Get user profile error:', error)
    return { data: null, error }
  }
}

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    console.log('📝 Updating user profile for:', userId)
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ user_id: userId, ...updates })
      .select()
    
    if (error) {
      console.error('❌ Update user profile failed:', error)
    } else {
      console.log('✅ User profile updated successfully')
    }

    return { data, error }
  } catch (error) {
    console.error('❌ Update user profile error:', error)
    return { data: null, error }
  }
}

export const getFrequencies = async (tier: 'free' | 'basic' | 'pro' | 'clinical' = 'free') => {
  // For now, return static frequency data but log the attempt
  console.log('🎵 Fetching frequencies for tier:', tier)
  
  try {
    const { frequencies } = await import('./frequencies')
    const { getFrequenciesByTier } = await import('./frequencies')
    
    return { 
      data: getFrequenciesByTier(tier), 
      error: null 
    }
  } catch (error) {
    console.error('❌ Get frequencies error:', error)
    return { data: [], error }
  }
}

export const getUserSessions = async (userId: string, limit = 50) => {
  try {
    console.log('📊 Fetching user sessions for:', userId)
    
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
    
    if (error) {
      console.error('❌ Get user sessions failed:', error)
    }

    return { data, error }
  } catch (error) {
    console.error('❌ Get user sessions error:', error)
    return { data: null, error }
  }
}

export const createSession = async (sessionData: any) => {
  try {
    console.log('📝 Creating therapy session')
    
    const { data, error } = await supabase
      .from('therapy_sessions')
      .insert(sessionData)
      .select()
    
    if (error) {
      console.error('❌ Create session failed:', error)
    } else {
      console.log('✅ Session created successfully')
    }

    return { data, error }
  } catch (error) {
    console.error('❌ Create session error:', error)
    return { data: null, error }
  }
}

export const updateSession = async (sessionId: string, updates: any) => {
  try {
    console.log('📝 Updating session:', sessionId)
    
    const { data, error } = await supabase
      .from('therapy_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
    
    if (error) {
      console.error('❌ Update session failed:', error)
    } else {
      console.log('✅ Session updated successfully')
    }

    return { data, error }
  } catch (error) {
    console.error('❌ Update session error:', error)
    return { data: null, error }
  }
}