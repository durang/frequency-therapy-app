import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Lazy Supabase client — created on first request, not at module load
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  console.log('🔗 Auth callback triggered:', {
    code: code ? `${code.substring(0, 10)}...` : null,
    next,
    error,
    timestamp: new Date().toISOString()
  })

  // Handle OAuth error responses
  if (error) {
    console.error('❌ OAuth error in callback:', {
      error,
      description: errorDescription,
      timestamp: new Date().toISOString()
    })
    
    const redirectUrl = new URL('/auth/success', request.url)
    redirectUrl.searchParams.set('error', 'auth_failed')
    redirectUrl.searchParams.set('message', errorDescription || 'Authentication failed')
    
    return NextResponse.redirect(redirectUrl)
  }

  // Handle missing authorization code
  if (!code) {
    console.error('❌ Missing authorization code in callback')
    
    const redirectUrl = new URL('/auth/success', request.url)
    redirectUrl.searchParams.set('error', 'invalid_request')
    redirectUrl.searchParams.set('message', 'Missing authorization code')
    
    return NextResponse.redirect(redirectUrl)
  }

  try {
    // Exchange code for session
    console.log('🔄 Exchanging code for session...')
    
    const { data, error: exchangeError } = await getSupabaseClient().auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('❌ Code exchange failed:', {
        error: exchangeError.message,
        code: exchangeError.status,
        timestamp: new Date().toISOString()
      })

      const redirectUrl = new URL('/auth/success', request.url)
      redirectUrl.searchParams.set('error', 'exchange_failed')
      redirectUrl.searchParams.set('message', 'Failed to authenticate. Please try again.')
      
      return NextResponse.redirect(redirectUrl)
    }

    if (!data.session) {
      console.error('❌ No session created after code exchange')
      
      const redirectUrl = new URL('/auth/success', request.url)
      redirectUrl.searchParams.set('error', 'no_session')
      redirectUrl.searchParams.set('message', 'Authentication incomplete. Please try again.')
      
      return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ Session created successfully:', {
      userId: data.user?.id,
      email: data.user?.email,
      timestamp: new Date().toISOString()
    })

    // Create response with redirect to success page
    const response = NextResponse.redirect(new URL('/auth/success', request.url))
    
    // Set authentication cookies for session persistence
    const maxAge = 60 * 60 * 24 * 7 // 7 days
    
    response.cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge
    })
    
    response.cookies.set('sb-refresh-token', data.session.refresh_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge
    })

    console.log('🍪 Session cookies set successfully')

    return response

  } catch (error) {
    console.error('❌ Unexpected error in auth callback:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })

    const redirectUrl = new URL('/auth/success', request.url)
    redirectUrl.searchParams.set('error', 'server_error')
    redirectUrl.searchParams.set('message', 'An unexpected error occurred. Please try again.')
    
    return NextResponse.redirect(redirectUrl)
  }
}