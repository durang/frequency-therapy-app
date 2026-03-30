import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'sergioduran89@gmail.com'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  
  const token = authHeader.replace('Bearer ', '')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(url, key)
  
  const { data } = await supabase.auth.getUser(token)
  return data?.user?.email === ADMIN_EMAIL
}

// GET /api/admin/users — list all users with subscription status
export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdmin(request)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = getAdminClient()

  // Get all users
  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers()
  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 })
  }

  // Get all subscriptions
  const { data: subs } = await admin.from('subscriptions').select('*')

  // Merge users with subscription data
  const users = usersData.users.map(u => {
    const sub = subs?.find(s => s.user_id === u.id)
    return {
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      phone: u.phone || null,
      confirmed: !!u.email_confirmed_at,
      subscription: sub ? {
        status: sub.status,
        plan_id: sub.plan_id,
        current_period_end: sub.current_period_end,
        customer_portal_url: sub.customer_portal_url,
      } : null,
      isAdmin: u.email === ADMIN_EMAIL,
    }
  })

  return NextResponse.json({
    users,
    total: users.length,
    active: users.filter(u => u.subscription?.status === 'active').length,
    free: users.filter(u => !u.subscription || u.subscription.status !== 'active').length,
  })
}

// POST /api/admin/users — update user (grant/revoke access)
export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdmin(request)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { userId, action, months } = body

  if (!userId || !action) {
    return NextResponse.json({ error: 'userId and action required' }, { status: 400 })
  }

  const admin = getAdminClient()

  if (action === 'grant_access') {
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + (months || 1))

    const { error } = await admin.from('subscriptions').upsert({
      user_id: userId,
      status: 'active',
      plan_id: 'admin_granted',
      lemon_squeezy_id: `admin_grant_${Date.now()}`,
      current_period_start: new Date().toISOString(),
      current_period_end: endDate.toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, message: `Access granted until ${endDate.toLocaleDateString()}` })
  }

  if (action === 'revoke_access') {
    const { error } = await admin.from('subscriptions').update({
      status: 'expired',
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, message: 'Access revoked' })
  }

  if (action === 'delete_user') {
    await admin.from('subscriptions').delete().eq('user_id', userId)
    const { error } = await admin.auth.admin.deleteUser(userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, message: 'User deleted' })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
