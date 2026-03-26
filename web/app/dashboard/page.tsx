'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdvancedDashboard from '@/components/dashboard/advanced-dashboard'
import { Brain, Play, Settings, Star, TrendingUp, Zap } from 'lucide-react'

// Mock user data - in production this would come from authentication
const mockUser = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex@example.com',
  subscription_tier: 'pro' as const,
  avatar: null,
  joined_date: '2024-01-15',
  total_sessions: 47,
  streak_days: 12
}

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

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const startQuickSession = (frequencyId: string) => {
    router.push(`/therapy?frequency=${frequencyId}&quick=true`)
  }

  const getTierBadge = (tier: string) => {
    const styles = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800',
      clinical: 'bg-gold-100 text-gold-800'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[tier as keyof typeof styles]}`}>
        {tier.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-quantum-primary to-quantum-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {greeting}, {mockUser.name.split(' ')[0]}!
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  {getTierBadge(mockUser.subscription_tier)}
                  <span className="text-sm text-gray-600">
                    🔥 {mockUser.streak_days} day streak
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => router.push('/pricing')}>
                Upgrade Plan
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
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Play className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">{mockUser.total_sessions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">This Week</p>
                      <p className="text-2xl font-bold text-gray-900">5 sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Effectiveness</p>
                      <p className="text-2xl font-bold text-gray-900">8.4/10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Session Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Sessions</CardTitle>
                <p className="text-gray-600">Start your most effective frequencies</p>
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
                  {[
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
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.session}</h4>
                        <p className="text-sm text-gray-600">{activity.duration} • {activity.time}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{activity.effectiveness}/10</span>
                        </div>
                        <p className="text-xs text-green-600">{activity.mood}</p>
                      </div>
                    </div>
                  ))}
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
                      Based on your circadian rhythm, now is optimal for DNA Repair frequency. 
                      Your effectiveness is 23% higher at this time.
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
          <AdvancedDashboard userId={mockUser.id} />
        )}

        {activeTab === 'frequencies' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequency Library</CardTitle>
                <p className="text-gray-600">
                  Explore our scientifically-backed frequency collection
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Frequency Library Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Advanced frequency browsing and filtering capabilities
                  </p>
                  <Button onClick={() => router.push('/therapy')}>
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