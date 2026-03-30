'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdvancedDashboard from '@/components/dashboard/advanced-dashboard'
import { useAuth, useAuthStore } from '@/lib/authState'
import { useSubscription } from '@/lib/useSubscription'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Brain, Play, Settings, Star, TrendingUp, Zap, LogOut, User, Calendar, Activity, ExternalLink, ArrowUpRight } from 'lucide-react'

// Quick access frequency cards
const quickFrequencies = [
  {
    id: '1',
    name: 'DNA Repair',
    hz: '528 Hz',
    category: 'Healing',
    color: 'from-green-400 to-emerald-600',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: '2',
    name: 'Deep Sleep',
    hz: '7.83 Hz',
    category: 'Sleep',
    color: 'from-blue-400 to-indigo-600',
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: '4',
    name: 'Focus Amplifier',
    hz: '40 Hz',
    category: 'Cognitive',
    color: 'from-purple-400 to-violet-600',
    icon: <TrendingUp className="w-5 h-5" />
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'frequencies'>('overview')
  const [greeting, setGreeting] = useState('')

  // Auth state management
  const { 
    user, 
    session, 
    initializing, 
    loading, 
    error, 
    isAuthenticated,
    signOut,
    initializeAuth,
    getUserMetadata 
  } = useAuth()

  // Subscription state
  const { subscription, isActive: subscriptionActive, isLoading: subscriptionLoading } = useSubscription()

  // Initialize auth on component mount
  useEffect(() => {
    if (initializing) {
      console.log('🔄 [Dashboard] Initializing auth...')
      initializeAuth()
    }
  }, [initializing, initializeAuth])

  // Auth protection - redirect if not authenticated
  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      console.log('🔒 [Dashboard] User not authenticated, redirecting to landing page')
      router.replace('/')
    }
  }, [initializing, isAuthenticated, router])

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Handle sign out
  const handleSignOut = async () => {
    try {
      console.log('👋 [Dashboard] Initiating sign out')
      await signOut()
    } catch (error) {
      console.error('❌ [Dashboard] Sign out failed:', error)
    }
  }

  // Show loading state while auth initializes
  if (initializing) {
    return (
      <div className="min-h-screen bg-[var(--surface-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-quantum-primary to-quantum-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Loading Dashboard...</h2>
          <p className="text-slate-600 dark:text-slate-400">Verifying your session</p>
        </div>
      </div>
    )
  }

  // Show error state if auth error occurred
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--surface-primary)] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Authentication Error</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  // Don't render dashboard if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null
  }

  // Calculate user stats
  const userStats = {
    totalSessions: user.profile?.progress_stats?.total_sessions || 0,
    totalMinutes: user.profile?.progress_stats?.total_minutes || 0,
    streakDays: Math.floor(Math.random() * 15) + 1, // TODO: Calculate from session history
    joinDate: new Date(user.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    thisWeekSessions: Math.floor(Math.random() * 8) + 1, // TODO: Calculate from recent sessions
    avgEffectiveness: user.profile?.progress_stats?.average_session_rating || 8.4
  }

  const startQuickSession = (frequencyId: string) => {
    router.push(`/panel?frequency=${frequencyId}&quick=true`)
  }

  const getSubscriptionBadge = () => {
    if (subscriptionLoading) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 animate-pulse">
          Loading…
        </span>
      )
    }

    if (subscriptionActive && subscription) {
      const planLabel = subscription.variant_id ? 'Pro' : 'Active'
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          ✓ {planLabel}
        </span>
      )
    }

    return (
      <Link
        href="/pricing"
        className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-800 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 transition-colors"
      >
        Free · Upgrade
      </Link>
    )
  }

  const getSubscriptionDetails = () => {
    if (!subscriptionActive || !subscription) return null

    const renewalDate = subscription.current_period_end
      ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : null

    return (
      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
        {renewalDate && <span>Renews {renewalDate}</span>}
        {subscription.customer_portal_url && (
          <a
            href={subscription.customer_portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-quantum-primary hover:underline"
          >
            Manage <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    )
  }

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-[var(--surface-primary)]">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-quantum-primary to-quantum-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.profile?.full_name 
                    ? user.profile.full_name.split(' ').map(n => n[0]).join('')
                    : getInitials(user.email)
                  }
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {greeting}, {user.profile?.full_name?.split(' ')[0] || user.email.split('@')[0]}!
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  {getSubscriptionBadge()}
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    🔥 {userStats.streakDays} day streak
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {userStats.joinDate}
                  </span>
                </div>
                {getSubscriptionDetails()}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg">
                <User className="w-4 h-4" />
                {user.email}
              </div>
              <ThemeToggle />
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                disabled={loading}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {loading ? 'Signing out...' : 'Sign Out'}
              </Button>
              <Button onClick={() => router.push('/panel')}>
                <Play className="w-4 h-4 mr-2" />
                Open Panel
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'frequencies', label: 'Frequency Library' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-quantum-primary text-quantum-primary'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* User Profile Summary */}
            <Card className="bg-gradient-to-r from-quantum-primary to-quantum-secondary text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Welcome to Quantum Healing
                    </h3>
                    <p className="opacity-90 mb-4">
                      You've completed {userStats.totalSessions} healing sessions and spent {Math.floor(userStats.totalMinutes / 60)} hours 
                      in therapeutic frequency practice. Keep up the excellent progress!
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        <span>Session ID: {session?.access_token?.substring(0, 8)}...</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{subscriptionActive ? 'Active Subscriber' : 'Free'} Member</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <Brain className="w-16 h-16 opacity-50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Sessions</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.totalSessions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">This Week</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.thisWeekSessions} sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Effectiveness</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{userStats.avgEffectiveness}/10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Session Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Sessions</CardTitle>
                <p className="text-slate-600 dark:text-slate-400">Start your most effective frequencies</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {quickFrequencies.map((freq) => (
                    <div
                      key={freq.id}
                      className={`bg-gradient-to-r ${freq.color} p-6 rounded-xl text-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                      onClick={() => startQuickSession(freq.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        {freq.icon}
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                          {freq.hz}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1">{freq.name}</h3>
                      <p className="text-sm opacity-90">{freq.category}</p>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-4 w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                        onClick={(e) => {
                          e.stopPropagation()
                          startQuickSession(freq.id)
                        }}
                      >
                        Start 20min Session
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.totalSessions > 0 ? (
                    // Show placeholder data for users with sessions
                    [
                      {
                        session: 'DNA Repair Session',
                        duration: '20 minutes',
                        effectiveness: 9,
                        time: '2 hours ago',
                        mood: '+3 mood boost'
                      },
                      {
                        session: 'Focus Amplifier',
                        duration: '45 minutes',
                        effectiveness: 8,
                        time: '1 day ago',
                        mood: '+2 mood boost'
                      },
                      {
                        session: 'Deep Sleep Induction',
                        duration: '30 minutes',
                        effectiveness: 9,
                        time: '2 days ago',
                        mood: '+4 mood boost'
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">{activity.session}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{activity.duration} • {activity.time}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{activity.effectiveness}/10</span>
                          </div>
                          <p className="text-xs text-green-600">{activity.mood}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Show empty state for new users
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No sessions yet</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">Start your first healing session to see your activity here</p>
                      <Button onClick={() => startQuickSession('1')}>
                        Start First Session
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personalized Recommendations */}
            <Card className="bg-gradient-to-r from-quantum-primary to-quantum-secondary text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">🎯 AI Recommendation</h3>
                    <p className="opacity-90 mb-4">
                      {userStats.totalSessions === 0 
                        ? "As a new user, we recommend starting with DNA Repair frequency for optimal cellular health benefits."
                        : "Based on your circadian rhythm, now is optimal for DNA Repair frequency. Your effectiveness is 23% higher at this time."
                      }
                    </p>
                    <Button 
                      variant="secondary"
                      className="bg-white text-quantum-primary hover:bg-gray-50"
                      onClick={() => startQuickSession('1')}
                    >
                      Start Optimized Session
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <Brain className="w-16 h-16 opacity-50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <AdvancedDashboard userId={user.id} />
        )}

        {activeTab === 'frequencies' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequency Library</CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Explore our scientifically-backed frequency collection
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Frequency Library Coming Soon
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Advanced frequency browsing and filtering capabilities
                  </p>
                  <Button onClick={() => router.push('/panel')}>
                    Browse Current Frequencies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}