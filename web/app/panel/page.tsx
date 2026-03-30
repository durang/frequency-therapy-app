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
  phone: string | null
  created_at: string
  last_sign_in_at: string | null
  confirmed: boolean
  provider: string
  daysSinceSignup: number
  daysSinceLastLogin: number | null
  isActiveRecently: boolean
  isAdmin: boolean
  subscription: {
    status: string
    plan_id: string
    current_period_start: string
    current_period_end: string
    customer_portal_url?: string
    daysUntilExpiry: number | null
    isExpiringSoon: boolean
    isExpired: boolean
  } | null
}

interface Analytics {
  total: number
  active: number
  free: number
  recentSignups: number
  activeLastWeek: number
  expiringSoon: number
  churned: number
  estimatedMRR: number
  conversionRate: number
}

export default function PanelPage() {
  const { user, initializing, isSuperadmin } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [analytics, setAnalytics] = useState<Analytics>({ total: 0, active: 0, free: 0, recentSignups: 0, activeLastWeek: 0, expiringSoon: 0, churned: 0, estimatedMRR: 0, conversionRate: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [grantMonths, setGrantMonths] = useState(1)
  const [filter, setFilter] = useState<'all' | 'active' | 'free' | 'expiring' | 'inactive'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!initializing && !user) router.push('/auth/login?from=panel')
  }, [user, initializing, router])

  useEffect(() => {
    if (!initializing && user && !isSuperadmin) {
      router.push('/frequencies')
      toast.error('Admin access required')
    }
  }, [user, initializing, isSuperadmin, router])

  const fetchUsers = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      if (!token) return
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setUsers(data.users)
      setAnalytics(data.analytics)
    } catch (err) {
      toast.error('Failed to load users')
    } finally { setLoading(false) }
  }, [user])

  useEffect(() => {
    if (isSuperadmin && user) fetchUsers()
  }, [isSuperadmin, user, fetchUsers])

  const performAction = async (userId: string, action: string, months?: number) => {
    setActionLoading(true)
    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      if (!token) throw new Error('No token')
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
    } catch (err: any) { toast.error(err.message || 'Action failed') }
    finally { setActionLoading(false) }
  }

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && u.subscription?.status === 'active') ||
      (filter === 'free' && (!u.subscription || u.subscription.status !== 'active')) ||
      (filter === 'expiring' && u.subscription?.isExpiringSoon) ||
      (filter === 'inactive' && u.daysSinceLastLogin !== null && u.daysSinceLastLogin > 14)
    return matchesSearch && matchesFilter
  })

  if (initializing || (!isSuperadmin && user)) {
    return <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center"><div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" /></div>
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      <div className="bg-amber-50 dark:bg-amber-400/5 border-b border-amber-200 dark:border-amber-400/10 text-center py-2 px-4 text-xs text-amber-700 dark:text-amber-400">
        🔑 Admin Panel — {user?.email}
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /></svg>
            </div>
            <span className="text-base font-semibold tracking-tight">FreqTherapy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
            <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Frequencies</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-amber-600 dark:text-amber-400/60 mb-2 font-medium">Admin Panel</p>
          <h1 className="text-3xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>User Management</h1>
        </div>

        {/* Analytics cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {[
            { label: 'Total', value: analytics.total, color: '' },
            { label: 'Paid', value: analytics.active, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Free', value: analytics.free, color: '' },
            { label: 'New (30d)', value: analytics.recentSignups, color: 'text-cyan-600 dark:text-cyan-400' },
            { label: 'Active (7d)', value: analytics.activeLastWeek, color: 'text-cyan-600 dark:text-cyan-400' },
            { label: 'Expiring', value: analytics.expiringSoon, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Churned', value: analytics.churned, color: 'text-red-600 dark:text-red-400' },
            { label: 'MRR', value: `$${analytics.estimatedMRR}`, color: 'text-emerald-600 dark:text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-center">
              <p className={`text-xl font-light tabular-nums ${s.color}`} style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{s.value}</p>
              <p className="text-[10px] text-gray-400 dark:text-white/20 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Conversion rate bar */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-white/30">Conversion Rate (Free → Paid)</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white/70 tabular-nums">{analytics.conversionRate}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${analytics.conversionRate}%` }} />
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/15" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search by email..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm text-gray-900 dark:text-white/80 placeholder:text-gray-300 dark:placeholder:text-white/15 focus:outline-none focus:border-cyan-500/30" />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'free', 'expiring', 'inactive'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs transition-all border ${filter === f ? 'bg-gray-900 dark:bg-white/10 border-gray-900 dark:border-white/20 text-white dark:text-white/80' : 'border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30'}`}>
                {f === 'all' ? 'All' : f === 'active' ? 'Paid' : f === 'free' ? 'Free' : f === 'expiring' ? 'Expiring' : 'Inactive'}
              </button>
            ))}
          </div>
        </div>

        {/* Users list */}
        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-white/60">{filteredUsers.length} users</p>
            <button onClick={fetchUsers} className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">Refresh</button>
          </div>

          {loading ? (
            <div className="p-12 text-center"><div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto" /></div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-400 dark:text-white/20"><p>No users found</p></div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {filteredUsers.map(u => {
                const isSelected = selectedUser?.id === u.id
                const isActive = u.subscription?.status === 'active'

                return (
                  <div key={u.id}>
                    <button onClick={() => { setSelectedUser(isSelected ? null : u); setGrantMonths(1) }}
                      className={`w-full text-left px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-cyan-50 dark:bg-cyan-500/[0.04]' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            u.isAdmin ? 'bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400' :
                            isActive ? 'bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400' :
                            u.isActiveRecently ? 'bg-cyan-100 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-400' :
                            'bg-gray-100 dark:bg-white/[0.06] text-gray-400 dark:text-white/20'
                          }`}>{u.email?.[0]?.toUpperCase() || '?'}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900 dark:text-white/80">{u.email}</span>
                              {u.isAdmin && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400">Admin</span>}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-white/20">
                              <span>Joined {u.daysSinceSignup}d ago</span>
                              {u.daysSinceLastLogin !== null && <span>· Last login {u.daysSinceLastLogin === 0 ? 'today' : `${u.daysSinceLastLogin}d ago`}</span>}
                              {u.provider !== 'email' && <span>· {u.provider}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isActive ? (
                            <div className="text-right">
                              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Paid
                              </div>
                              {u.subscription?.daysUntilExpiry !== null && (
                                <span className={`text-[10px] ${u.subscription?.isExpiringSoon ? 'text-amber-500' : 'text-gray-400 dark:text-white/15'}`}>
                                  {u.subscription?.isExpiringSoon ? `⚠ ${u.subscription.daysUntilExpiry}d left` : `${u.subscription?.daysUntilExpiry}d left`}
                                </span>
                              )}
                            </div>
                          ) : u.subscription?.isExpired ? (
                            <span className="text-xs text-red-500">Expired</span>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-white/20">Free</span>
                          )}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`text-gray-300 dark:text-white/15 transition-transform ${isSelected ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-5 py-4 bg-gray-50 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/[0.04]">
                            {/* User details grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                              <div className="p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
                                <p className="text-[10px] text-gray-400 dark:text-white/20">User ID</p>
                                <p className="text-[10px] text-gray-600 dark:text-white/40 font-mono truncate mt-0.5">{u.id}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
                                <p className="text-[10px] text-gray-400 dark:text-white/20">Signup</p>
                                <p className="text-xs text-gray-600 dark:text-white/40 mt-0.5">{new Date(u.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
                                <p className="text-[10px] text-gray-400 dark:text-white/20">Last Login</p>
                                <p className="text-xs text-gray-600 dark:text-white/40 mt-0.5">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
                                <p className="text-[10px] text-gray-400 dark:text-white/20">Status</p>
                                <p className="text-xs mt-0.5">
                                  {u.confirmed ? <span className="text-emerald-600 dark:text-emerald-400">✓ Confirmed</span> : <span className="text-amber-600">⏳ Pending</span>}
                                </p>
                              </div>
                            </div>

                            {/* Subscription details */}
                            {u.subscription && (
                              <div className="p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04] mb-4">
                                <p className="text-[10px] text-gray-400 dark:text-white/20 mb-2">Subscription Details</p>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-400 dark:text-white/20">Plan:</span>
                                    <span className="ml-1 text-gray-700 dark:text-white/50">{u.subscription.plan_id}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 dark:text-white/20">Start:</span>
                                    <span className="ml-1 text-gray-700 dark:text-white/50">{new Date(u.subscription.current_period_start).toLocaleDateString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 dark:text-white/20">Expires:</span>
                                    <span className={`ml-1 ${u.subscription.isExpiringSoon ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-white/50'}`}>
                                      {new Date(u.subscription.current_period_end).toLocaleDateString()}
                                      {u.subscription.daysUntilExpiry !== null && ` (${u.subscription.daysUntilExpiry}d)`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3">
                              {!isActive && !u.isAdmin && (
                                <div className="flex items-center gap-2">
                                  <select value={grantMonths} onChange={e => setGrantMonths(Number(e.target.value))}
                                    className="px-2 py-1.5 text-xs bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] rounded-lg text-gray-700 dark:text-white/60">
                                    <option value={1}>1 month</option>
                                    <option value={3}>3 months</option>
                                    <option value={6}>6 months</option>
                                    <option value={12}>12 months</option>
                                  </select>
                                  <button onClick={() => performAction(u.id, 'grant_access', grantMonths)} disabled={actionLoading}
                                    className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                    Grant Access
                                  </button>
                                </div>
                              )}
                              {isActive && !u.isAdmin && (
                                <button onClick={() => performAction(u.id, 'revoke_access')} disabled={actionLoading}
                                  className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50">
                                  Revoke Access
                                </button>
                              )}
                              {!u.isAdmin && (
                                <button onClick={() => { if (confirm(`Delete ${u.email}?`)) performAction(u.id, 'delete_user') }} disabled={actionLoading}
                                  className="px-3 py-1.5 text-xs border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors disabled:opacity-50">
                                  Delete
                                </button>
                              )}
                              {u.isAdmin && <span className="text-xs text-amber-600 dark:text-amber-400/60">Admin — protected</span>}
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
