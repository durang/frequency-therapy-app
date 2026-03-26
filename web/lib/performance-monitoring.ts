/**
 * Production Web Vitals Monitoring and Performance Tracking
 * Real-time Core Web Vitals collection with performance regression detection
 */

import { Metric } from 'web-vitals'

// Web Vitals thresholds based on Google recommendations
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (loading performance)
  LCP: {
    good: 2500,
    poor: 4000
  },
  // First Input Delay (interactivity)
  FID: {
    good: 100,
    poor: 300
  },
  // Interaction to Next Paint (responsiveness)
  INP: {
    good: 200,
    poor: 500
  },
  // Cumulative Layout Shift (visual stability)
  CLS: {
    good: 0.1,
    poor: 0.25
  },
  // First Contentful Paint (loading)
  FCP: {
    good: 1800,
    poor: 3000
  },
  // Time to First Byte (server responsiveness)
  TTFB: {
    good: 800,
    poor: 1800
  }
} as const

export type WebVitalName = keyof typeof WEB_VITALS_THRESHOLDS

export interface PerformanceEvent {
  id: string
  name: WebVitalName
  value: number
  delta: number
  rating: 'good' | 'needs-improvement' | 'poor'
  url: string
  userAgent: string
  connectionType?: string
  deviceMemory?: number
  timestamp: number
  sessionId: string
}

export interface PerformanceData {
  metrics: PerformanceEvent[]
  sessionId: string
  pageLoadTime: number
  navigationTiming: PerformanceTiming | null
  resourceTiming: PerformanceResourceTiming[]
  deviceInfo: {
    userAgent: string
    viewport: { width: number; height: number }
    connectionType?: string
    deviceMemory?: number
    hardwareConcurrency?: number
  }
}

// Performance monitoring class
class PerformanceMonitor {
  private sessionId: string
  private metrics: PerformanceEvent[] = []
  private baselineMetrics: Map<WebVitalName, number> = new Map()
  private regressionThreshold = 0.1 // 10% regression threshold
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadBaseline()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  private loadBaseline(): void {
    try {
      const stored = localStorage.getItem('performance-baseline')
      if (stored) {
        const baseline = JSON.parse(stored)
        Object.entries(baseline).forEach(([key, value]) => {
          this.baselineMetrics.set(key as WebVitalName, value as number)
        })
      }
    } catch (error) {
      console.warn('Failed to load performance baseline:', error)
    }
  }

  private saveBaseline(): void {
    try {
      const baseline = Object.fromEntries(this.baselineMetrics)
      localStorage.setItem('performance-baseline', JSON.stringify(baseline))
    } catch (error) {
      console.warn('Failed to save performance baseline:', error)
    }
  }

  private getRating(name: WebVitalName, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = WEB_VITALS_THRESHOLDS[name]
    if (value <= thresholds.good) return 'good'
    if (value <= thresholds.poor) return 'needs-improvement'
    return 'poor'
  }

  private detectRegression(name: WebVitalName, value: number): boolean {
    const baseline = this.baselineMetrics.get(name)
    if (!baseline) return false
    
    const regression = (value - baseline) / baseline
    return regression > this.regressionThreshold
  }

  private updateBaseline(name: WebVitalName, value: number): void {
    const current = this.baselineMetrics.get(name)
    if (!current || value < current) {
      this.baselineMetrics.set(name, value)
      this.saveBaseline()
    }
  }

  private getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connectionType: (navigator as any).connection?.effectiveType,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency
    }
  }

  public reportWebVital(metric: Metric): void {
    const event: PerformanceEvent = {
      id: metric.id,
      name: metric.name as WebVitalName,
      value: metric.value,
      delta: metric.delta,
      rating: this.getRating(metric.name as WebVitalName, metric.value),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: (navigator as any).connection?.effectiveType,
      deviceMemory: (navigator as any).deviceMemory,
      timestamp: Date.now(),
      sessionId: this.sessionId
    }

    this.metrics.push(event)
    
    // Update baseline if this is a good metric
    if (event.rating === 'good') {
      this.updateBaseline(event.name, event.value)
    }

    // Check for performance regression
    const isRegression = this.detectRegression(event.name, event.value)
    if (isRegression) {
      console.warn(`Performance regression detected for ${event.name}:`, {
        current: event.value,
        baseline: this.baselineMetrics.get(event.name),
        regression: ((event.value - (this.baselineMetrics.get(event.name) || 0)) / (this.baselineMetrics.get(event.name) || 1)) * 100
      })
    }

    // Send to analytics/monitoring service
    this.sendToMonitoring(event, isRegression)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${event.name}:`, {
        value: event.value,
        rating: event.rating,
        delta: event.delta,
        regression: isRegression
      })
    }
  }

  private sendToMonitoring(event: PerformanceEvent, isRegression: boolean): void {
    // In a real application, you would send this to your monitoring service
    // For now, we'll store it locally and optionally send to a custom endpoint
    
    try {
      // Store locally for debugging
      const stored = localStorage.getItem('performance-metrics') || '[]'
      const metrics = JSON.parse(stored)
      metrics.push(event)
      
      // Keep only last 100 metrics to avoid storage bloat
      if (metrics.length > 100) {
        metrics.splice(0, metrics.length - 100)
      }
      
      localStorage.setItem('performance-metrics', JSON.stringify(metrics))

      // Send to analytics if configured
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          metric_name: event.name,
          metric_value: Math.round(event.value),
          metric_rating: event.rating,
          metric_delta: Math.round(event.delta),
          is_regression: isRegression
        })
      }

      // Custom monitoring endpoint (if available)
      if (process.env.NEXT_PUBLIC_PERFORMANCE_ENDPOINT) {
        fetch(process.env.NEXT_PUBLIC_PERFORMANCE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...event,
            isRegression
          })
        }).catch(error => {
          console.warn('Failed to send performance data to monitoring:', error)
        })
      }
    } catch (error) {
      console.warn('Failed to store performance metric:', error)
    }
  }

  public getPerformanceData(): PerformanceData {
    const navigationTiming = performance.timing
    const resourceTiming = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    return {
      metrics: this.metrics,
      sessionId: this.sessionId,
      pageLoadTime: navigationTiming.loadEventEnd - navigationTiming.navigationStart,
      navigationTiming,
      resourceTiming,
      deviceInfo: this.getDeviceInfo()
    }
  }

  public getMetricsSummary() {
    const summary: Record<string, any> = {}
    
    Object.keys(WEB_VITALS_THRESHOLDS).forEach(metricName => {
      const metrics = this.metrics.filter(m => m.name === metricName)
      if (metrics.length > 0) {
        const latest = metrics[metrics.length - 1]
        const average = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length
        
        summary[metricName] = {
          latest: latest.value,
          average: Math.round(average),
          rating: latest.rating,
          count: metrics.length,
          baseline: this.baselineMetrics.get(metricName as WebVitalName)
        }
      }
    })
    
    return summary
  }

  public clearMetrics(): void {
    this.metrics = []
    localStorage.removeItem('performance-metrics')
  }

  public exportMetrics(): string {
    return JSON.stringify(this.getPerformanceData(), null, 2)
  }
}

// Create singleton instance
let performanceMonitor: PerformanceMonitor

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor()
  }
  return performanceMonitor
}

// Next.js compatible Web Vitals reporting function
export function reportWebVitals(metric: Metric): void {
  const monitor = getPerformanceMonitor()
  if (monitor) {
    monitor.reportWebVital(metric)
  }
}

// Performance debugging utilities
export const performanceUtils = {
  // Get current performance metrics
  getMetrics: () => getPerformanceMonitor()?.getMetricsSummary(),
  
  // Get full performance data
  getFullData: () => getPerformanceMonitor()?.getPerformanceData(),
  
  // Clear stored metrics
  clearMetrics: () => getPerformanceMonitor()?.clearMetrics(),
  
  // Export metrics for analysis
  exportMetrics: () => getPerformanceMonitor()?.exportMetrics(),
  
  // Check if performance is within thresholds
  isPerformanceGood: () => {
    const metrics = getPerformanceMonitor()?.getMetricsSummary()
    if (!metrics) return null
    
    return Object.values(metrics).every((metric: any) => 
      metric.rating === 'good' || metric.rating === 'needs-improvement'
    )
  },
  
  // Get performance score (0-100)
  getPerformanceScore: () => {
    const metrics = getPerformanceMonitor()?.getMetricsSummary()
    if (!metrics) return null
    
    const scores: number[] = Object.values(metrics).map((metric: any) => {
      switch (metric.rating) {
        case 'good': return 100
        case 'needs-improvement': return 75
        case 'poor': return 50
        default: return 0
      }
    })
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }
}

// Global performance monitoring interface
declare global {
  interface Window {
    performanceUtils: typeof performanceUtils
    gtag?: (command: string, action: string, parameters: any) => void
  }
}

// Expose utilities globally for debugging
if (typeof window !== 'undefined') {
  window.performanceUtils = performanceUtils
}

export default getPerformanceMonitor