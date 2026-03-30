'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/lib/authState'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface UserData {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  phone: string | null
  confirmed: boolean
  subscription: {
    status: string
    plan_id: string
    current_period_end: string
    customer_portal_url?: string
  } | null
  isAdmin: boolean
}

interface UsersResponse {
  users: UserData[]
  total: number
  active: number
  free: number
}

export default function PanelPage() {
  const { user, initializing, isSuperadmin } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, free: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [grantMonths, setGrantMonths] = useState(1)

  // Auth check
  useEffect(() => {
    if (!initializing && !user) router.push('/auth/login?from=panel')
  }, [user, initializing, router])

  useEffect(() => {
    if (!initializing && user && !isSuperadmin) {
      router.push('/frequencies')
      toast.error('Admin access required')
    }
  }, [user, initializing, isSuperadmin, router])

  // Fetch users
  const fetchUsers = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      if (!token) return

      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      const data: UsersResponse = await res.json()
      setUsers(data.users)
      setStats({ total: data.total, active: data.active, free: data.free })
    } catch (err) {
      console.error('Failed to load users:', err)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (isSuperadmin && user) fetchUsers()
  }, [isSuperadmin, user, fetchUsers])

  // User actions
  const performAction = async (userId: string, action: string, months?: number) => {
    setActionLoading(true)
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, months })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      fetchUsers()
      setSelectedUser(null)
    } catch (err: any) {
      toast.error(err.message || 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  if (initializing || (!isSuperadmin && user)) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Admin banner */}
      <div className="bg-amber-50 dark:bg-amber-400/5 border-b border-amber-200 dark:border-amber-400/10 text-center py-2 px-4 text-xs text-amber-700 dark:text-amber-400">
        🔑 Admin Panel — {user?.email}
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">FreqTherapy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Frequencies</Link>
            <Link href="/dashboard" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.25em] uppercase text-amber-600 dark:text-amber-400/60 mb-3 font-medium">Admin Panel</p>
          <h1 className="text-3xl md:text-4xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            User Management
          </h1>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]">
            <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-2">Total Users</p>
            <p className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{stats.total}</p>
          </div>
          <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/[0.04]">
            <p className="text-xs text-emerald-600 dark:text-emerald-400/60 uppercase tracking-wider mb-2">Active Subscribers</p>
            <p className="text-3xl font-light text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{stats.active}</p>
          </div>
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]">
            <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-2">Free Users</p>
            <p className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{stats.free}</p>
          </div>
        </div>

        {/* Users table */}
        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-white/60">All Users</p>
            <button onClick={fetchUsers} className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-400 dark:text-white/20">
              <p>No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {users.map(u => {
                const isSelected = selectedUser?.id === u.id
                const isActive = u.subscription?.status === 'active'
                const expiresDate = u.subscription?.current_period_end
                  ? new Date(u.subscription.current_period_end)
                  : null
                const isExpiringSoon = expiresDate && expiresDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

                return (
                  <div key={u.id}>
                    <button
                      onClick={() => setSelectedUser(isSelected ? null : u)}
                      className={`w-full text-left px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-cyan-50 dark:bg-cyan-500/[0.04]' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            u.isAdmin ? 'bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400' :
                            isActive ? 'bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400' :
                            'bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/30'
                          }`}>
                            {u.email?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900 dark:text-white/80">{u.email}</span>
                              {u.isAdmin && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400">Admin</span>}
                            </div>
                            <p className="text-xs text-gray-400 dark:text-white/20">
                              Joined {new Date(u.created_at).toLocaleDateString()}
                              {u.last_sign_in_at && ` · Last login ${new Date(u.last_sign_in_at).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isActive ? (
                            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                              {isExpiringSoon && <span className="text-amber-500">· Expiring soon</span>}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-white/20">Free</span>
                          )}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`text-gray-300 dark:text-white/15 transition-transform ${isSelected ? 'rotate-180' : ''}`}>
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Expanded actions */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/[0.04]">
                            <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                              <div>
                                <span className="text-gray-400 dark:text-white/25">User ID</span>
                                <p className="text-gray-600 dark:text-white/40 font-mono text-[10px] mt-0.5">{u.id}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 dark:text-white/25">Phone</span>
                                <p className="text-gray-600 dark:text-white/40 mt-0.5">{u.phone || 'Not provided'}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 dark:text-white/25">Email confirmed</span>
                                <p className="text-gray-600 dark:text-white/40 mt-0.5">{u.confirmed ? '✅ Yes' : '❌ No'}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 dark:text-white/25">Subscription</span>
                                <p className="text-gray-600 dark:text-white/40 mt-0.5">
                                  {u.subscription ? `${u.subscription.status} · Expires ${expiresDate?.toLocaleDateString()}` : 'None'}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3">
                              {!isActive && !u.isAdmin && (
                                <div className="flex items-center gap-2">
                                  <select
                                    value={grantMonths}
                                    onChange={e => setGrantMonths(Number(e.target.value))}
                                    className="px-2 py-1.5 text-xs bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] rounded-lg text-gray-700 dark:text-white/60"
                                  >
                                    <option value={1}>1 month</option>
                                    <option value={3}>3 months</option>
                                    <option value={6}>6 months</option>
                                    <option value={12}>12 months</option>
                                  </select>
                                  <button
                                    onClick={() => performAction(u.id, 'grant_access', grantMonths)}
                                    disabled={actionLoading}
                                    className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                  >
                                    Grant Access
                                  </button>
                                </div>
                              )}
                              {isActive && !u.isAdmin && (
                                <button
                                  onClick={() => performAction(u.id, 'revoke_access')}
                                  disabled={actionLoading}
                                  className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                                >
                                  Revoke Access
                                </button>
                              )}
                              {!u.isAdmin && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete user ${u.email}? This cannot be undone.`)) {
                                      performAction(u.id, 'delete_user')
                                    }
                                  }}
                                  disabled={actionLoading}
                                  className="px-3 py-1.5 text-xs border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors disabled:opacity-50"
                                >
                                  Delete User
                                </button>
                              )}
                              {u.isAdmin && (
                                <span className="text-xs text-amber-600 dark:text-amber-400/60">Admin account — no actions available</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
