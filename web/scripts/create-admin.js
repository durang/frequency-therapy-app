const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = 'sergioduran89@gmail.com'
const adminPassword = 'Sigd785!'

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Use service role to bypass RLS and email confirmation
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function createAdmin() {
  console.log(`Creating admin: ${adminEmail}`)
  
  // Create user via admin API (service role) — bypasses email confirmation
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true, // auto-confirm, no email needed
    user_metadata: { role: 'admin' }
  })

  if (error) {
    if (error.message.includes('already been registered') || error.message.includes('already exists')) {
      console.log('Account already exists. Updating password...')
      
      // List users to find the admin
      const { data: users } = await supabase.auth.admin.listUsers()
      const adminUser = users?.users?.find(u => u.email === adminEmail)
      
      if (adminUser) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(adminUser.id, {
          password: adminPassword,
          email_confirm: true,
          user_metadata: { role: 'admin' }
        })
        if (updateError) {
          console.error('Update failed:', updateError.message)
        } else {
          console.log('✅ Admin password updated. ID:', adminUser.id)
        }
      }
    } else {
      console.error('Create failed:', error.message)
    }
  } else {
    console.log('✅ Admin created. ID:', data.user?.id)
  }

  // Verify sign-in works
  const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const { data: signIn, error: signInError } = await anonSupabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  })
  
  if (signInError) {
    console.error('❌ Sign-in verification failed:', signInError.message)
  } else {
    console.log('✅ Sign-in verified. User ID:', signIn.user?.id)
  }
}

createAdmin()
