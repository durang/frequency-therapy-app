'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  { label: 'Sesiones Completadas', value: '127', change: '+12%', icon: Headphones },
  { label: 'Tiempo Total', value: '2.4h', change: '+8%', icon: Clock },
  { label: 'Frecuencias Favoritas', value: '8', change: '+2', icon: Heart },
  { label: 'Racha Actual', value: '15 días', change: '+3', icon: TrendingUp }
]

const recentSessions = [
  { frequency: 'DNA Repair', duration: '20 min', date: '2024-03-25', rating: 5 },
  { frequency: 'Anxiety Liberation', duration: '25 min', date: '2024-03-24', rating: 4 },
  { frequency: 'Deep Sleep Delta', duration: '60 min', date: '2024-03-23', rating: 5 },
  { frequency: 'Gamma Focus Enhancement', duration: '45 min', date: '2024-03-22', rating: 4 }
]

const achievements = [
  { title: 'Primera Semana', description: 'Completaste 7 días consecutivos', earned: true },
  { title: 'Explorador de Frecuencias', description: 'Probaste 10 frecuencias diferentes', earned: true },
  { title: 'Maestro del Sueño', description: '30 sesiones de frecuencias de sueño', earned: false },
  { title: 'Gurú de la Calma', description: '100 horas de meditación', earned: false }
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-sm text-blue-600">Gestiona tu experiencia de terapia</p>
              </div>
            </div>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
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
                  <h2 className="text-2xl font-bold">Usuario FreqHeal</h2>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Crown className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm text-blue-100">Miembro Premium</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">127</div>
                    <div className="text-sm text-blue-200">Sesiones</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-sm text-blue-200">Días seguidos</div>
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
                  <p className="text-sm text-blue-200 mt-2">Objetivo mensual</p>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Tabs */}
            <div className="mt-6 bg-white rounded-xl p-2 shadow-lg">
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Resumen', icon: BarChart3 },
                  { id: 'sessions', label: 'Sesiones', icon: Clock },
                  { id: 'achievements', label: 'Logros', icon: Award },
                  { id: 'settings', label: 'Configuración', icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
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
                      <Card key={index} className="border-0 shadow-lg bg-white">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">{stat.label}</p>
                              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                              <p className="text-sm text-green-600">{stat.change}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Icon className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Progress Chart Placeholder */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Progreso Semanal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Gráfico de progreso próximamente</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'sessions' && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Sesiones Recientes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{session.frequency}</h3>
                          <p className="text-sm text-gray-500">{session.duration} • {session.date}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full ${
                                i < session.rating ? 'bg-yellow-400' : 'bg-gray-200'
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
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Logros</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.earned
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              achievement.earned
                                ? 'bg-yellow-400 text-white'
                                : 'bg-gray-300 text-gray-500'
                            }`}
                          >
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Configuración</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Preferencias de Audio</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Volumen por defecto</span>
                          <input type="range" min="0" max="100" defaultValue="75" className="w-24" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Audio espacial</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Notificaciones</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Recordatorios diarios</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progreso semanal</span>
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