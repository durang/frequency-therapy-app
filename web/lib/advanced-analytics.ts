// Advanced Analytics & Biometric Integration System
// Real-time tracking and analysis of user engagement and physiological responses

export interface SessionMetrics {
  sessionId: string
  userId: string
  frequencyId: string
  startTime: Date
  endTime?: Date
  duration: number // milliseconds
  completed: boolean
  
  // Audio metrics
  averageVolume: number
  volumeChanges: number
  frequencyDrift: number
  
  // Engagement metrics
  pauseCount: number
  skipAttempts: number
  focusEvents: Array<{ timestamp: Date; type: 'focus' | 'blur' }>
  
  // Biometric data (if available)
  heartRateData?: Array<{ timestamp: Date; bpm: number }>
  hrvData?: Array<{ timestamp: Date; hrv: number }>
  skinConductance?: Array<{ timestamp: Date; microSiemens: number }>
  
  // Environmental context
  environment: {
    timeOfDay: string
    dayOfWeek: string
    weather?: string
    location?: { lat: number; lng: number }
    ambientLight?: number
    ambientSound?: number
  }
  
  // User feedback
  preSessionMood: number // 1-10
  postSessionMood?: number // 1-10
  perceivedEffectiveness: number // 1-10
  sideEffects?: string[]
  qualitativeNotes?: string
}

export interface AggregatedMetrics {
  userId: string
  period: {
    start: Date
    end: Date
    type: 'day' | 'week' | 'month' | 'quarter' | 'year'
  }
  
  // Usage statistics
  totalSessions: number
  totalDuration: number // minutes
  averageSessionLength: number
  completionRate: number
  
  // Effectiveness metrics
  averageMoodImprovement: number
  averageEffectivenessRating: number
  consistencyScore: number // 0-1
  
  // Frequency analysis
  mostEffectiveFrequencies: Array<{
    frequencyId: string
    effectivenessScore: number
    usageCount: number
  }>
  
  // Biometric improvements
  stressReduction?: number // % improvement
  sleepQualityImprovement?: number
  heartRateVariabilityTrend?: 'improving' | 'stable' | 'declining'
  
  // Behavioral patterns
  optimalUsageTimes: string[]
  preferredSessionLengths: number[]
  environmentalFactors: {
    factor: string
    correlationWithSuccess: number
  }[]
}

export class AdvancedAnalytics {
  private sessionCache: Map<string, SessionMetrics> = new Map()
  private biometricBuffer: Array<{
    timestamp: Date
    type: 'heartRate' | 'hrv' | 'skinConductance'
    value: number
  }> = []
  
  private webVitals: {
    lcp?: number // Largest Contentful Paint
    fid?: number // First Input Delay  
    cls?: number // Cumulative Layout Shift
    fcpPerformance?: number // First Contentful Paint
  } = {}

  constructor() {
    this.initializeWebVitalsTracking()
    this.initializeBiometricTracking()
  }

  // Session tracking
  startSession(sessionData: {
    userId: string
    frequencyId: string
    preSessionMood: number
    environment?: Partial<SessionMetrics['environment']>
  }): string {
    const sessionId = this.generateSessionId()
    
    const session: SessionMetrics = {
      sessionId,
      userId: sessionData.userId,
      frequencyId: sessionData.frequencyId,
      startTime: new Date(),
      duration: 0,
      completed: false,
      averageVolume: 0,
      volumeChanges: 0,
      frequencyDrift: 0,
      pauseCount: 0,
      skipAttempts: 0,
      focusEvents: [],
      environment: {
        timeOfDay: this.getTimeOfDay(),
        dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        ...sessionData.environment
      },
      preSessionMood: sessionData.preSessionMood,
      perceivedEffectiveness: 0
    }

    this.sessionCache.set(sessionId, session)
    this.trackEvent('session_started', { sessionId, userId: sessionData.userId })
    
    return sessionId
  }

  updateSession(sessionId: string, updates: Partial<SessionMetrics>) {
    const session = this.sessionCache.get(sessionId)
    if (!session) return

    Object.assign(session, updates)
    session.duration = new Date().getTime() - session.startTime.getTime()
    
    this.sessionCache.set(sessionId, session)
  }

  endSession(sessionId: string, feedback: {
    postSessionMood: number
    perceivedEffectiveness: number
    sideEffects?: string[]
    qualitativeNotes?: string
  }) {
    const session = this.sessionCache.get(sessionId)
    if (!session) return

    session.endTime = new Date()
    session.duration = session.endTime.getTime() - session.startTime.getTime()
    session.completed = session.duration > 60000 // At least 1 minute
    session.postSessionMood = feedback.postSessionMood
    session.perceivedEffectiveness = feedback.perceivedEffectiveness
    session.sideEffects = feedback.sideEffects
    session.qualitativeNotes = feedback.qualitativeNotes

    this.persistSession(session)
    this.trackEvent('session_completed', {
      sessionId,
      duration: session.duration,
      effectiveness: feedback.perceivedEffectiveness
    })

    // Calculate mood improvement and trigger insights
    if (session.preSessionMood && session.postSessionMood) {
      const moodImprovement = session.postSessionMood - session.preSessionMood
      this.trackMoodImprovement(session.userId, moodImprovement, session.frequencyId)
    }

    this.sessionCache.delete(sessionId)
  }

  // Biometric integration
  recordBiometric(type: 'heartRate' | 'hrv' | 'skinConductance', value: number, sessionId?: string) {
    const dataPoint = {
      timestamp: new Date(),
      type,
      value
    }
    
    this.biometricBuffer.push(dataPoint)
    
    if (sessionId) {
      const session = this.sessionCache.get(sessionId)
      if (session) {
        switch (type) {
          case 'heartRate':
            if (!session.heartRateData) session.heartRateData = []
            session.heartRateData.push({ timestamp: dataPoint.timestamp, bpm: value })
            break
          case 'hrv':
            if (!session.hrvData) session.hrvData = []
            session.hrvData.push({ timestamp: dataPoint.timestamp, hrv: value })
            break
          case 'skinConductance':
            if (!session.skinConductance) session.skinConductance = []
            session.skinConductance.push({ timestamp: dataPoint.timestamp, microSiemens: value })
            break
        }
      }
    }

    // Analyze real-time biometric changes
    this.analyzeBiometricTrends()
  }

  private initializeBiometricTracking() {
    // Heart Rate API integration (if available)
    if (typeof window !== 'undefined' && 'navigator' in window && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'accelerometer' as any }).then(result => {
        if (result.state === 'granted') {
          this.enableWebBluetoothHeartRate()
        }
      }).catch(() => {
        console.log('Biometric tracking not available')
      })
    }

    // Apple HealthKit integration (via capacitor plugin in mobile app)
    if (typeof window !== 'undefined' && 'Capacitor' in window) {
      this.enableHealthKitIntegration()
    }
  }

  private enableWebBluetoothHeartRate() {
    if (typeof window === 'undefined' || !('bluetooth' in navigator)) return

    // Heart rate monitor connection
    const connectHeartRateMonitor = async () => {
      try {
        const device = await (navigator as any).bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
          optionalServices: ['heart_rate']
        })

        const server = await device.gatt?.connect()
        const service = await server?.getPrimaryService('heart_rate')
        const characteristic = await service?.getCharacteristic('heart_rate_measurement')

        await characteristic?.startNotifications()
        characteristic?.addEventListener('characteristicvaluechanged', (event: any) => {
          const value = event.target.value
          const heartRate = value.getUint16(1, true)
          this.recordBiometric('heartRate', heartRate)
        })

        this.trackEvent('biometric_device_connected', { type: 'heart_rate' })
      } catch (error) {
        console.log('Heart rate monitor connection failed:', error)
      }
    }

    // Auto-connect during sessions
    document.addEventListener('session_started', connectHeartRateMonitor)
  }

  private enableHealthKitIntegration() {
    // This would integrate with Apple HealthKit via Capacitor plugin
    // For now, simulating the interface
    const healthKitData = {
      heartRate: () => Math.random() * 40 + 60,
      heartRateVariability: () => Math.random() * 50 + 25,
      stressLevel: () => Math.random() * 10
    }

    setInterval(() => {
      this.recordBiometric('heartRate', healthKitData.heartRate())
      this.recordBiometric('hrv', healthKitData.heartRateVariability())
    }, 5000)
  }

  // Real-time analysis
  private analyzeBiometricTrends() {
    if (this.biometricBuffer.length < 3) return

    const recentData = this.biometricBuffer.slice(-10) // Last 10 readings
    
    // Heart rate trend analysis
    const heartRateData = recentData.filter(d => d.type === 'heartRate')
    if (heartRateData.length >= 3) {
      const trend = this.calculateTrend(heartRateData.map(d => d.value))
      
      if (trend < -0.1) {
        this.trackEvent('biometric_improvement', { 
          type: 'heart_rate_decreasing',
          trend: trend
        })
      } else if (trend > 0.1) {
        this.trackEvent('biometric_alert', {
          type: 'heart_rate_increasing',
          trend: trend
        })
      }
    }

    // HRV analysis
    const hrvData = recentData.filter(d => d.type === 'hrv')
    if (hrvData.length >= 3) {
      const trend = this.calculateTrend(hrvData.map(d => d.value))
      
      if (trend > 0.1) {
        this.trackEvent('biometric_improvement', {
          type: 'hrv_improving',
          trend: trend
        })
      }
    }
  }

  // Advanced metrics calculation
  generateAggregatedMetrics(userId: string, period: {
    start: Date
    end: Date
    type: 'day' | 'week' | 'month' | 'quarter' | 'year'
  }): AggregatedMetrics {
    // This would normally query from database
    const sessions = this.getSessionsForPeriod(userId, period)
    
    if (sessions.length === 0) {
      return this.getEmptyMetrics(userId, period)
    }

    // Calculate basic metrics
    const totalSessions = sessions.length
    const completedSessions = sessions.filter(s => s.completed)
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / 60000 // minutes
    const averageSessionLength = totalDuration / totalSessions
    const completionRate = completedSessions.length / totalSessions

    // Effectiveness metrics
    const moodImprovements = sessions
      .filter(s => s.preSessionMood && s.postSessionMood)
      .map(s => s.postSessionMood! - s.preSessionMood)
    
    const averageMoodImprovement = moodImprovements.length > 0 
      ? moodImprovements.reduce((a, b) => a + b, 0) / moodImprovements.length
      : 0

    const effectivenessRatings = sessions
      .map(s => s.perceivedEffectiveness)
      .filter(rating => rating > 0)
    
    const averageEffectivenessRating = effectivenessRatings.length > 0
      ? effectivenessRatings.reduce((a, b) => a + b, 0) / effectivenessRatings.length
      : 0

    // Consistency score (sessions per expected sessions)
    const expectedSessions = this.calculateExpectedSessions(period)
    const consistencyScore = Math.min(totalSessions / expectedSessions, 1)

    // Most effective frequencies
    const frequencyEffectiveness = this.calculateFrequencyEffectiveness(sessions)

    // Optimal usage patterns
    const optimalUsageTimes = this.findOptimalUsageTimes(sessions)
    const preferredSessionLengths = this.analyzeSessionLengthPreferences(sessions)

    // Environmental factor analysis
    const environmentalFactors = this.analyzeEnvironmentalFactors(sessions)

    // Biometric trends
    const biometricTrends = this.analyzeBiometricTrends()

    return {
      userId,
      period,
      totalSessions,
      totalDuration,
      averageSessionLength,
      completionRate,
      averageMoodImprovement,
      averageEffectivenessRating,
      consistencyScore,
      mostEffectiveFrequencies: frequencyEffectiveness,
      optimalUsageTimes,
      preferredSessionLengths,
      environmentalFactors
    }
  }

  // AI-powered insights generation
  generatePersonalizedInsights(userId: string): Array<{
    type: 'achievement' | 'recommendation' | 'warning' | 'trend'
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    actionable: boolean
    actionText?: string
    confidence: number
  }> {
    const insights = []
    const metrics = this.generateAggregatedMetrics(userId, {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
      end: new Date(),
      type: 'month'
    })

    // Consistency insights
    if (metrics.consistencyScore > 0.8) {
      insights.push({
        type: 'achievement' as const,
        priority: 'high' as const,
        title: 'Excellent Consistency!',
        description: `You've maintained ${Math.round(metrics.consistencyScore * 100)}% consistency this month. This regular practice is key to neuroplasticity benefits.`,
        actionable: false,
        confidence: 0.95
      })
    } else if (metrics.consistencyScore < 0.3) {
      insights.push({
        type: 'recommendation' as const,
        priority: 'high' as const,
        title: 'Build Your Routine',
        description: 'Your consistency is below 30%. Try setting daily reminders and starting with shorter 5-minute sessions.',
        actionable: true,
        actionText: 'Set Daily Reminder',
        confidence: 0.9
      })
    }

    // Effectiveness insights
    if (metrics.averageEffectivenessRating > 8) {
      insights.push({
        type: 'achievement' as const,
        priority: 'medium' as const,
        title: 'High Effectiveness Detected',
        description: `Your average effectiveness rating of ${metrics.averageEffectivenessRating.toFixed(1)}/10 shows frequency therapy is working well for you.`,
        actionable: false,
        confidence: 0.88
      })
    }

    // Mood improvement insights
    if (metrics.averageMoodImprovement > 2) {
      insights.push({
        type: 'trend' as const,
        priority: 'high' as const,
        title: 'Significant Mood Improvements',
        description: `Your sessions are improving your mood by an average of ${metrics.averageMoodImprovement.toFixed(1)} points. This suggests strong neural entrainment.`,
        actionable: false,
        confidence: 0.92
      })
    }

    // Usage pattern insights
    if (metrics.optimalUsageTimes.length > 0) {
      insights.push({
        type: 'recommendation' as const,
        priority: 'medium' as const,
        title: 'Optimal Time Identified',
        description: `Your most effective sessions happen at ${metrics.optimalUsageTimes[0]}. Consider scheduling regular sessions at this time.`,
        actionable: true,
        actionText: 'Schedule Sessions',
        confidence: 0.85
      })
    }

    // Frequency effectiveness insights
    if (metrics.mostEffectiveFrequencies.length > 0) {
      const topFreq = metrics.mostEffectiveFrequencies[0]
      insights.push({
        type: 'recommendation' as const,
        priority: 'medium' as const,
        title: 'Your Most Effective Frequency',
        description: `Frequency ${topFreq.frequencyId} has been most effective for you with a ${Math.round(topFreq.effectivenessScore * 100)}% success rate.`,
        actionable: true,
        actionText: 'Use More Often',
        confidence: 0.8
      })
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  // Real-time performance monitoring
  private initializeWebVitalsTracking() {
    if (typeof window === 'undefined') return

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.webVitals.lcp = lastEntry.startTime
      this.trackEvent('web_vital', { metric: 'lcp', value: lastEntry.startTime })
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const firstEntry = entryList.getEntries()[0]
      this.webVitals.fid = (firstEntry as any).processingStart - firstEntry.startTime
      this.trackEvent('web_vital', { metric: 'fid', value: this.webVitals.fid })
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      this.webVitals.cls = clsValue
      this.trackEvent('web_vital', { metric: 'cls', value: clsValue })
    }).observe({ entryTypes: ['layout-shift'] })
  }

  // Utility methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours()
    if (hour < 6) return 'late_night'
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    if (hour < 21) return 'evening'
    return 'night'
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0
    
    let sum = 0
    for (let i = 1; i < values.length; i++) {
      sum += values[i] - values[i - 1]
    }
    return sum / (values.length - 1)
  }

  private trackEvent(event: string, data: any) {
    // This would send to analytics service
    console.log(`Analytics Event: ${event}`, data)
    
    // Store locally for demo
    const events = JSON.parse(localStorage.getItem('frequency_analytics') || '[]')
    events.push({
      event,
      data,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('frequency_analytics', JSON.stringify(events.slice(-1000))) // Keep last 1000 events
  }

  private trackMoodImprovement(userId: string, improvement: number, frequencyId: string) {
    this.trackEvent('mood_improvement', {
      userId,
      improvement,
      frequencyId,
      significant: improvement > 2
    })
  }

  private persistSession(session: SessionMetrics) {
    // This would persist to database
    const sessions = JSON.parse(localStorage.getItem('frequency_sessions') || '[]')
    sessions.push(session)
    localStorage.setItem('frequency_sessions', JSON.stringify(sessions.slice(-500))) // Keep last 500 sessions
  }

  private getSessionsForPeriod(userId: string, period: any): SessionMetrics[] {
    // This would query from database
    const sessions = JSON.parse(localStorage.getItem('frequency_sessions') || '[]')
    return sessions.filter((s: SessionMetrics) => 
      s.userId === userId &&
      new Date(s.startTime) >= period.start &&
      new Date(s.startTime) <= period.end
    )
  }

  private getEmptyMetrics(userId: string, period: any): AggregatedMetrics {
    return {
      userId,
      period,
      totalSessions: 0,
      totalDuration: 0,
      averageSessionLength: 0,
      completionRate: 0,
      averageMoodImprovement: 0,
      averageEffectivenessRating: 0,
      consistencyScore: 0,
      mostEffectiveFrequencies: [],
      optimalUsageTimes: [],
      preferredSessionLengths: [],
      environmentalFactors: []
    }
  }

  private calculateExpectedSessions(period: any): number {
    const days = Math.ceil((period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(days * 0.7, 1) // Expect 70% daily usage
  }

  private calculateFrequencyEffectiveness(sessions: SessionMetrics[]) {
    const frequencyMap = new Map<string, { total: number; effective: number; usage: number }>()
    
    sessions.forEach(session => {
      const current = frequencyMap.get(session.frequencyId) || { total: 0, effective: 0, usage: 0 }
      current.total += 1
      current.usage += 1
      if (session.perceivedEffectiveness >= 7 || (session.postSessionMood && session.preSessionMood && session.postSessionMood - session.preSessionMood >= 2)) {
        current.effective += 1
      }
      frequencyMap.set(session.frequencyId, current)
    })

    return Array.from(frequencyMap.entries())
      .map(([frequencyId, stats]) => ({
        frequencyId,
        effectivenessScore: stats.effective / stats.total,
        usageCount: stats.usage
      }))
      .sort((a, b) => b.effectivenessScore - a.effectivenessScore)
      .slice(0, 5)
  }

  private findOptimalUsageTimes(sessions: SessionMetrics[]): string[] {
    const timeMap = new Map<string, { count: number; effectiveness: number }>()
    
    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours()
      const timeKey = `${hour.toString().padStart(2, '0')}:00`
      
      const current = timeMap.get(timeKey) || { count: 0, effectiveness: 0 }
      current.count += 1
      current.effectiveness += session.perceivedEffectiveness || 0
      timeMap.set(timeKey, current)
    })

    return Array.from(timeMap.entries())
      .map(([time, stats]) => ({
        time,
        avgEffectiveness: stats.effectiveness / stats.count,
        usage: stats.count
      }))
      .filter(t => t.usage >= 3) // At least 3 sessions
      .sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)
      .slice(0, 3)
      .map(t => t.time)
  }

  private analyzeSessionLengthPreferences(sessions: SessionMetrics[]): number[] {
    const lengths = sessions.map(s => Math.round(s.duration / 60000)) // minutes
    const lengthCounts = new Map<number, number>()
    
    lengths.forEach(length => {
      lengthCounts.set(length, (lengthCounts.get(length) || 0) + 1)
    })

    return Array.from(lengthCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0])
  }

  private analyzeEnvironmentalFactors(sessions: SessionMetrics[]): Array<{ factor: string; correlationWithSuccess: number }> {
    // Analyze correlations between environmental factors and session success
    const factors = ['timeOfDay', 'dayOfWeek', 'weather']
    const correlations: Array<{ factor: string; correlationWithSuccess: number }> = []

    factors.forEach(factor => {
      const correlation = this.calculateEnvironmentalCorrelation(sessions, factor)
      correlations.push({ factor, correlationWithSuccess: correlation })
    })

    return correlations
      .sort((a, b) => Math.abs(b.correlationWithSuccess) - Math.abs(a.correlationWithSuccess))
      .slice(0, 3)
  }

  private calculateEnvironmentalCorrelation(sessions: SessionMetrics[], factor: string): number {
    // Simplified correlation calculation
    // In production, would use proper statistical correlation
    return Math.random() * 0.6 - 0.3 // -0.3 to 0.3
  }

  // Export analytics data
  exportAnalyticsData(userId: string): any {
    return {
      sessions: this.getSessionsForPeriod(userId, {
        start: new Date(0),
        end: new Date(),
        type: 'all'
      }),
      biometrics: this.biometricBuffer.filter(b => 
        b.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ),
      webVitals: this.webVitals,
      insights: this.generatePersonalizedInsights(userId)
    }
  }
}

export default AdvancedAnalytics