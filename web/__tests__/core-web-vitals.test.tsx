/**
 * Core Web Vitals Testing Suite
 * Tests for production Web Vitals monitoring and performance tracking
 */

import { describe, it, expect } from '@jest/globals'

// Import the constants we want to test
import { WEB_VITALS_THRESHOLDS } from '@/lib/performance-monitoring'

describe('Core Web Vitals Thresholds', () => {
  it('should have correct LCP thresholds', () => {
    expect(WEB_VITALS_THRESHOLDS.LCP.good).toBe(2500)
    expect(WEB_VITALS_THRESHOLDS.LCP.poor).toBe(4000)
  })

  it('should have correct FID thresholds', () => {
    expect(WEB_VITALS_THRESHOLDS.FID.good).toBe(100)
    expect(WEB_VITALS_THRESHOLDS.FID.poor).toBe(300)
  })

  it('should have correct INP thresholds', () => {
    expect(WEB_VITALS_THRESHOLDS.INP.good).toBe(200)
    expect(WEB_VITALS_THRESHOLDS.INP.poor).toBe(500)
  })

  it('should have correct CLS thresholds', () => {
    expect(WEB_VITALS_THRESHOLDS.CLS.good).toBe(0.1)
    expect(WEB_VITALS_THRESHOLDS.CLS.poor).toBe(0.25)
  })

  it('should have correct FCP thresholds', () => {
    expect(WEB_VITALS_THRESHOLDS.FCP.good).toBe(1800)
    expect(WEB_VITALS_THRESHOLDS.FCP.poor).toBe(3000)
  })

  it('should have correct TTFB thresholds', () => {
    expect(WEB_VITALS_THRESHOLDS.TTFB.good).toBe(800)
    expect(WEB_VITALS_THRESHOLDS.TTFB.poor).toBe(1800)
  })
})

describe('Threshold Validation', () => {
  it('should have all required Core Web Vitals metrics', () => {
    const requiredMetrics = ['LCP', 'FID', 'INP', 'CLS', 'FCP', 'TTFB']
    
    requiredMetrics.forEach(metric => {
      expect(WEB_VITALS_THRESHOLDS[metric as keyof typeof WEB_VITALS_THRESHOLDS]).toBeDefined()
      expect(WEB_VITALS_THRESHOLDS[metric as keyof typeof WEB_VITALS_THRESHOLDS].good).toBeDefined()
      expect(WEB_VITALS_THRESHOLDS[metric as keyof typeof WEB_VITALS_THRESHOLDS].poor).toBeDefined()
    })
  })

  it('should have logical threshold progression (good < poor)', () => {
    Object.entries(WEB_VITALS_THRESHOLDS).forEach(([metricName, thresholds]) => {
      expect(thresholds.good).toBeLessThan(thresholds.poor)
    })
  })

  it('should have reasonable performance thresholds', () => {
    // Based on Google's Core Web Vitals recommendations
    expect(WEB_VITALS_THRESHOLDS.LCP.good).toBeLessThanOrEqual(2500)
    expect(WEB_VITALS_THRESHOLDS.FID.good).toBeLessThanOrEqual(100)
    expect(WEB_VITALS_THRESHOLDS.CLS.good).toBeLessThanOrEqual(0.1)
    expect(WEB_VITALS_THRESHOLDS.INP.good).toBeLessThanOrEqual(200)
  })
})

describe('Next.js Integration', () => {
  it('should export reportWebVitals function for Next.js integration', () => {
    // Use dynamic import to avoid window dependency issues
    return import('@/lib/performance-monitoring').then(module => {
      expect(typeof module.reportWebVitals).toBe('function')
    })
  })

  it('should export performance utilities', () => {
    return import('@/lib/performance-monitoring').then(module => {
      expect(module.performanceUtils).toBeDefined()
      expect(typeof module.performanceUtils).toBe('object')
    })
  })
})

describe('Performance Metrics Configuration', () => {
  it('should validate Core Web Vitals metrics coverage', () => {
    const googleCoreWebVitals = ['LCP', 'INP', 'CLS'] // Current Core Web Vitals as of 2024
    const legacyMetrics = ['FID'] // Legacy but still important
    const additionalMetrics = ['FCP', 'TTFB'] // Additional useful metrics
    
    const allMetrics = [...googleCoreWebVitals, ...legacyMetrics, ...additionalMetrics]
    
    allMetrics.forEach(metric => {
      expect(WEB_VITALS_THRESHOLDS).toHaveProperty(metric)
    })
  })

  it('should use current Google recommendations for thresholds', () => {
    // Verify against latest Google Core Web Vitals recommendations
    expect(WEB_VITALS_THRESHOLDS.LCP.good).toBe(2500) // 2.5 seconds
    expect(WEB_VITALS_THRESHOLDS.INP.good).toBe(200)  // 200 milliseconds
    expect(WEB_VITALS_THRESHOLDS.CLS.good).toBe(0.1)  // 0.1 cumulative score
  })

  it('should have proper threshold structure', () => {
    // Each metric should have both good and poor thresholds
    Object.entries(WEB_VITALS_THRESHOLDS).forEach(([metricName, thresholds]) => {
      expect(thresholds).toHaveProperty('good')
      expect(thresholds).toHaveProperty('poor')
      expect(typeof thresholds.good).toBe('number')
      expect(typeof thresholds.poor).toBe('number')
    })
  })
})

describe('Module Structure', () => {
  it('should have proper export structure', () => {
    expect(typeof WEB_VITALS_THRESHOLDS).toBe('object')
    expect(WEB_VITALS_THRESHOLDS).toBeDefined()
  })

  it('should export all required threshold constants', () => {
    const expectedMetrics = ['LCP', 'FID', 'INP', 'CLS', 'FCP', 'TTFB']
    expectedMetrics.forEach(metric => {
      expect(WEB_VITALS_THRESHOLDS).toHaveProperty(metric)
    })
  })
})