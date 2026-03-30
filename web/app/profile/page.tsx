'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { 
  ArrowLeft,
  User,
  Settings,
  Heart,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  Headphones,
  Target,
  BarChart3,
  Crown
} from 'lucide-react'

const statsData = [
  { label: 'Sessions Completed', value: '127', change: '+12%', icon: Headphones },
  { label: 'Total Time', value: '2.4h', change: '+8%', icon: Clock },
  { label: 'Favorite Frequencies', value: '8', change: '+2', icon: Heart },
  { label: 'Current Streak', value: '15 days', change: '+3', icon: TrendingUp }
]

const recentSessions = [
  { frequency: 'DNA Repair', duration: '20 min', date: '2024-03-25', rating: 5 },
  { frequency: 'Anxiety Liberation', duration: '25 min', date: '2024-03-24', rating: 4 },
  { frequency: 'Deep Sleep Delta', duration: '60 min', date: '2024-03-23', rating: 5 },
  { frequency: 'Gamma Focus Enhancement', duration: '45 min', date: '2024-03-22', rating: 4 }
]

const achievements = [
  { title: 'First Week', description: 'Completed 7 consecutive days', earned: true },
  { title: 'Frequency Explorer', description: 'Tried 10 different frequencies', earned: true },
  { title: 'Sleep Master', description: '30 sleep frequency sessions', earned: false },
  { title: 'Calm Guru', description: '100 hours of meditation', earned: false }
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-[var(--surface-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--surface-overlay)] border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                <p className="text-sm text-blue-600 dark:text-blue-400">Manage your therapy experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Settings className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-4">
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 overflow-hidden">
              <CardContent className="p-8">
                {/* Profile Avatar */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12" />
                  </div>
                  <h2 className="text-2xl font-bold">FreqTherapy User</h2>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Crown className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm text-blue-100">Premium Member</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">127</div>
                    <div className="text-sm text-blue-200">Sessions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-sm text-blue-200">Days Streak</div>
                  </div>
                </div>

                {/* Progress Ring */}
                <div className="mt-6 text-center">
                  <div className="relative w-16 h-16 mx-auto">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-white/20"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * 0.25}`}
                        className="text-yellow-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold">75%</span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-200 mt-2">Monthly Goal</p>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Tabs */}
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-2 shadow-lg dark:shadow-slate-900/50">
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'sessions', label: 'Sessions', icon: Clock },
                  { id: 'achievements', label: 'Achievements', icon: Award },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsData.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <Card key={index} className="border-0 shadow-lg dark:shadow-slate-900/50 bg-white dark:bg-slate-800">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                              <p className="text-sm text-green-600 dark:text-green-400">{stat.change}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Progress Chart Placeholder */}
                <Card className="border-0 shadow-lg dark:shadow-slate-900/50 bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                      <TrendingUp className="w-5 h-5" />
                      <span>Weekly Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                        <p className="text-slate-500 dark:text-slate-400">Progress chart coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'sessions' && (
              <Card className="border-0 shadow-lg dark:shadow-slate-900/50 bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                    <Clock className="w-5 h-5" />
                    <span>Recent Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">{session.frequency}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{session.duration} • {session.date}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full ${
                                i < session.rating ? 'bg-yellow-400 dark:bg-yellow-300' : 'bg-slate-200 dark:bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'achievements' && (
              <Card className="border-0 shadow-lg dark:shadow-slate-900/50 bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                    <Award className="w-5 h-5" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.earned
                            ? 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              achievement.earned
                                ? 'bg-yellow-400 dark:bg-yellow-500 text-white'
                                : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">{achievement.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card className="border-0 shadow-lg dark:shadow-slate-900/50 bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white mb-3">Audio Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Default Volume</span>
                          <input type="range" min="0" max="100" defaultValue="75" className="w-24" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Spatial Audio</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Daily Reminders</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Weekly Progress</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
