'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AdvancedAnalytics, { AggregatedMetrics } from '@/lib/advanced-analytics'
import { 
  TrendingUp, 
  Brain, 
  Heart, 
  Target, 
  Calendar, 
  Clock,
  Zap,
  Award,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
  Lightbulb
} from 'lucide-react'

interface DashboardProps {
  userId: string
}

interface InsightCardProps {
  insight: {
    type: 'achievement' | 'recommendation' | 'warning' | 'trend'
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    actionable: boolean
    actionText?: string
    confidence: number
  }
  onAction?: (actionText: string) => void
}

const InsightCard = ({ insight, onAction }: InsightCardProps) => {
  const getInsightIcon = () => {
    switch (insight.type) {
      case 'achievement': return <Award className="w-5 h-5 text-green-500" />
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-blue-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'trend': return <TrendingUp className="w-5 h-5 text-purple-500" />
    }
  }

  const getPriorityColor = () => {
    switch (insight.priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
    }
  }

  return (
    <div className={`border-l-4 p-4 rounded-lg ${getPriorityColor()}`}>
      <div className="flex items-start gap-3">
        {getInsightIcon()}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {Math.round(insight.confidence * 100)}% confidence
            </span>
            {insight.actionable && insight.actionText && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAction?.(insight.actionText!)}
                className="text-xs"
              >
                {insight.actionText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  description?: string
}

const MetricCard = ({ title, value, change, changeType, icon, description }: MetricCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="text-quantum-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change && (
          <p className={`text-xs ${getChangeColor()}`}>
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdvancedDashboard({ userId }: DashboardProps) {
  const [analytics] = useState(() => new AdvancedAnalytics())
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null)
  const [insights, setInsights] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [timeframe, userId])

  const loadAnalytics = async () => {
    setLoading(true)
    
    // Calculate period based on timeframe
    const now = new Date()
    const periods = {
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      quarter: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    }

    const period = {
      start: periods[timeframe],
      end: now,
      type: timeframe
    }

    // Load metrics and insights
    const metricsData = analytics.generateAggregatedMetrics(userId, period)
    const insightsData = analytics.generatePersonalizedInsights(userId)

    setMetrics(metricsData)
    setInsights(insightsData)
    setLoading(false)
  }

  const handleInsightAction = (actionText: string) => {
    // Handle insight actions
    switch (actionText) {
      case 'Set Daily Reminder':
        // Integrate with device notifications
        alert('Daily reminder set for your optimal time!')
        break
      case 'Schedule Sessions':
        // Navigate to scheduling interface
        alert('Redirecting to session scheduler...')
        break
      case 'Use More Often':
        // Suggest frequency in next session
        alert('We\'ll suggest your most effective frequency in your next session!')
        break
      default:
        console.log('Action:', actionText)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">Complete some therapy sessions to see your analytics.</p>
      </div>
    )
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Analytics</h1>
          <p className="text-gray-600 mt-1">
            Insights from your frequency therapy journey
          </p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Sessions"
          value={metrics.totalSessions}
          change={`${metrics.completionRate * 100}% completion rate`}
          changeType={metrics.completionRate > 0.8 ? 'positive' : 'neutral'}
          icon={<Activity className="w-4 h-4" />}
          description="Frequency therapy sessions completed"
        />

        <MetricCard
          title="Total Practice Time"
          value={formatDuration(metrics.totalDuration)}
          change={`${formatDuration(metrics.averageSessionLength)} avg session`}
          changeType="neutral"
          icon={<Clock className="w-4 h-4" />}
          description="Time invested in your wellbeing"
        />

        <MetricCard
          title="Mood Improvement"
          value={`+${metrics.averageMoodImprovement.toFixed(1)}`}
          change="points on average"
          changeType={metrics.averageMoodImprovement > 1 ? 'positive' : 'neutral'}
          icon={<Heart className="w-4 h-4" />}
          description="Average mood boost per session"
        />

        <MetricCard
          title="Consistency Score"
          value={`${Math.round(metrics.consistencyScore * 100)}%`}
          change={metrics.consistencyScore > 0.7 ? 'Excellent!' : 'Room to improve'}
          changeType={metrics.consistencyScore > 0.7 ? 'positive' : 'neutral'}
          icon={<Target className="w-4 h-4" />}
          description="How regularly you practice"
        />
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-quantum-primary" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.slice(0, 5).map((insight, index) => (
                <InsightCard
                  key={index}
                  insight={insight}
                  onAction={handleInsightAction}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Effectiveness Analysis */}
      {metrics.mostEffectiveFrequencies.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-quantum-primary" />
                Most Effective Frequencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.mostEffectiveFrequencies.slice(0, 3).map((freq, index) => (
                  <div key={freq.frequencyId} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Frequency {freq.frequencyId}</div>
                      <div className="text-sm text-gray-600">{freq.usageCount} sessions</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        {Math.round(freq.effectivenessScore * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">effectiveness</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-quantum-primary" />
                Optimal Usage Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.optimalUsageTimes.slice(0, 3).map((time, index) => (
                  <div key={time} className="flex items-center justify-between">
                    <div className="font-medium">{time}</div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Optimal</span>
                    </div>
                  </div>
                ))}
                {metrics.optimalUsageTimes.length === 0 && (
                  <p className="text-gray-600 text-sm">
                    Complete more sessions to identify your optimal times
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-quantum-primary" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Consistency Visualization */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#667eea"
                    strokeWidth="3"
                    strokeDasharray={`${metrics.consistencyScore * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {Math.round(metrics.consistencyScore * 100)}%
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">Consistency</div>
            </div>

            {/* Effectiveness Visualization */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${(metrics.averageEffectivenessRating / 10) * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {metrics.averageEffectivenessRating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">Avg Effectiveness</div>
            </div>

            {/* Mood Improvement */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray={`${Math.min((metrics.averageMoodImprovement / 5) * 100, 100)}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    +{metrics.averageMoodImprovement.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">Mood Boost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-quantum-primary to-quantum-secondary text-white">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Ready for your next session?
          </h3>
          <p className="mb-4 opacity-90">
            Based on your data, now would be an optimal time for frequency therapy
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => window.location.href = '/therapy'}
            className="bg-white text-quantum-primary hover:bg-gray-50"
          >
            Start Optimized Session
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}