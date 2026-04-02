import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

// For development purposes, create client even with placeholder values
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if we're using real Supabase credentials
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder_key'
}

// Database types
export interface User {
  id: string
  email: string
  subscription_tier: 'basic' | 'pro' | 'clinical'
  biometric_preferences: any
  created_at: string
}

export interface FrequencySession {
  id: string
  user_id: string
  frequency_type: string
  duration: number
  effectiveness_score?: number
  biometric_data?: any
  session_date: string
}

export interface FrequencyProtocol {
  id: string
  frequency_hz: number
  category: string
  name: string
  description: string
  scientific_basis: string
  recommended_duration: number
  benefits: string[]
  visualization_type: string
}