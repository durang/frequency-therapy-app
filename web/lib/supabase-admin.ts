import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client using the service role key.
 * 
 * This client bypasses RLS and should ONLY be used in server-side code
 * (API routes, webhooks). Never import this in client components.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Determine if we're in a non-runtime environment (test, build-time SSG)
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined
const isBuildTime = !supabaseUrl || !supabaseServiceRoleKey

// Validate at runtime only — not during test or build-time static generation
if (!isTestEnv && !isBuildTime) {
  if (!supabaseServiceRoleKey || supabaseServiceRoleKey.includes('placeholder')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing or contains placeholder value. ' +
      'This key is required for server-side operations.'
    )
  }
}

// Create admin client — uses safe defaults during build/test, real values at runtime
const clientUrl = supabaseUrl || 'https://placeholder-project.supabase.co'
const clientKey = supabaseServiceRoleKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-service-role'

export const supabaseAdmin: SupabaseClient = createClient(clientUrl, clientKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Connection status logging (only at runtime with real credentials)
if (!isTestEnv && !isBuildTime) {
  console.log('🔐 Supabase admin client initialized:', {
    url: supabaseUrl,
    keyLength: supabaseServiceRoleKey.length,
    timestamp: new Date().toISOString(),
  })
}
