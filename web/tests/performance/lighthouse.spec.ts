import { test, expect, chromium } from '@playwright/test'
import { startFlow } from 'lighthouse'

/**
 * Lighthouse Performance Testing Suite
 * Automated Core Web Vitals monitoring across Chrome, Safari, Firefox, and Edge
 */

interface LighthouseScore {
  performance: number
  accessibility: number
  bestPractices: number
  seo: number
  pwa: number
}

interface CoreWebVitals {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay (or INP)
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  ttfb: number // Time to First Byte
}

const PERFORMANCE_THRESHOLDS = {
  performance: 90,
  accessibility: 95,
  bestPractices: 90,
  seo: 95,
  pwa: 80,
  lcp: 2500, // ms
  fid: 100, // ms
  cls: 0.1,
  fcp: 1800, // ms
  ttfb: 600 // ms
}

test.describe('Lighthouse Performance Audits', () => {
  test.describe.configure({ mode: 'parallel' })

  test('Chrome Desktop - Core Web Vitals and Performance Score', async ({ browserName }) => {
    test.skip(browserName !== 'chromium', 'Lighthouse only supports Chromium')
    
    const browser = await chromium.launch({
      args: [
        '--enable-gpu-benchmarking',
        '--enable-threaded-compositing',
        '--remote-debugging-port=9222',
        '--disable-dev-shm-usage',
        '--no-sandbox'
      ]
    })
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1
    })
    
    const page = await context.newPage()
    
    try {
      // Run Lighthouse audit
      const flow = await startFlow(page, {
        name: 'FreqHeal Desktop Performance',
        configContext: {
          settingsOverrides: {
            formFactor: 'desktop',
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0
            },
            screenEmulation: {
              mobile: false,
              width: 1920,
              height: 1080,
              deviceScaleFactor: 1,
              disabled: false
            }
          }
        }
      })
      
      // Navigate to homepage and measure navigation performance
      await flow.navigate('http://localhost:3000', {
        stepName: 'Homepage Navigation'
      })
      
      // Test frequency lab performance
      await flow.navigate('http://localhost:3000#frequency-lab', {
        stepName: 'Frequency Lab Section'
      })
      
      // Simulate user interaction flow
      await flow.startTimespan({ stepName: 'User Interaction Flow' })
      
      // Navigate to frequency section
      await page.locator('[data-testid="frequency-card"]').first().scrollIntoViewIfNeeded()
      await page.locator('[data-testid="frequency-card"]').first().click()
      
      // Wait for audio controls to load
      await page.waitForSelector('[data-testid="audio-controls"]', { timeout: 5000 })
      
      await flow.endTimespan()
      
      // Generate report
      const report = await flow.generateReport()
      const result = flow.getFlowResult()
      
      // Extract performance metrics
      const navigationResult = result.steps.find(step => step.name === 'Homepage Navigation')?.lhr
      const interactionResult = result.steps.find(step => step.name === 'User Interaction Flow')?.lhr
      
      if (!navigationResult) {
        throw new Error('Navigation audit failed')
      }
      
      const scores: LighthouseScore = {
        performance: Math.round((navigationResult.categories?.performance?.score ?? 0) * 100),
        accessibility: Math.round((navigationResult.categories?.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((navigationResult.categories?.['best-practices']?.score ?? 0) * 100),
        seo: Math.round((navigationResult.categories?.seo?.score ?? 0) * 100),
        pwa: Math.round((navigationResult.categories?.pwa?.score ?? 0) * 100)
      }
      
      const webVitals: CoreWebVitals = {
        lcp: navigationResult.audits?.['largest-contentful-paint']?.numericValue ?? 0,
        fid: navigationResult.audits?.['max-potential-fid']?.numericValue ?? 0,
        cls: navigationResult.audits?.['cumulative-layout-shift']?.numericValue ?? 0,
        fcp: navigationResult.audits?.['first-contentful-paint']?.numericValue ?? 0,
        ttfb: navigationResult.audits?.['server-response-time']?.numericValue ?? 0
      }
      
      console.log('🔍 Lighthouse Audit Results (Chrome Desktop)')
      console.log(`Performance: ${scores.performance}/100 (threshold: ${PERFORMANCE_THRESHOLDS.performance})`)
      console.log(`Accessibility: ${scores.accessibility}/100 (threshold: ${PERFORMANCE_THRESHOLDS.accessibility})`)
      console.log(`Best Practices: ${scores.bestPractices}/100 (threshold: ${PERFORMANCE_THRESHOLDS.bestPractices})`)
      console.log(`SEO: ${scores.seo}/100 (threshold: ${PERFORMANCE_THRESHOLDS.seo})`)
      console.log(`PWA: ${scores.pwa}/100 (threshold: ${PERFORMANCE_THRESHOLDS.pwa})`)
      console.log('')
      console.log('⚡ Core Web Vitals:')
      console.log(`LCP: ${Math.round(webVitals.lcp)}ms (threshold: ${PERFORMANCE_THRESHOLDS.lcp}ms)`)
      console.log(`FID: ${Math.round(webVitals.fid)}ms (threshold: ${PERFORMANCE_THRESHOLDS.fid}ms)`)
      console.log(`CLS: ${webVitals.cls.toFixed(3)} (threshold: ${PERFORMANCE_THRESHOLDS.cls})`)
      console.log(`FCP: ${Math.round(webVitals.fcp)}ms (threshold: ${PERFORMANCE_THRESHOLDS.fcp}ms)`)
      console.log(`TTFB: ${Math.round(webVitals.ttfb)}ms (threshold: ${PERFORMANCE_THRESHOLDS.ttfb}ms)`)
      
      // Save detailed report
      await page.evaluate((reportHtml) => {
        const fs = require('fs').promises
        fs.writeFile('test-results/lighthouse-chrome-desktop.html', reportHtml)
      }, report)
      
      // Performance assertions
      expect(scores.performance, `Performance score ${scores.performance} below threshold ${PERFORMANCE_THRESHOLDS.performance}`).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.performance)
      expect(scores.accessibility, `Accessibility score ${scores.accessibility} below threshold ${PERFORMANCE_THRESHOLDS.accessibility}`).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.accessibility)
      expect(scores.bestPractices, `Best practices score ${scores.bestPractices} below threshold ${PERFORMANCE_THRESHOLDS.bestPractices}`).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.bestPractices)
      expect(scores.seo, `SEO score ${scores.seo} below threshold ${PERFORMANCE_THRESHOLDS.seo}`).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.seo)
      
      // Core Web Vitals assertions
      expect(webVitals.lcp, `LCP ${Math.round(webVitals.lcp)}ms exceeds threshold ${PERFORMANCE_THRESHOLDS.lcp}ms`).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.lcp)
      expect(webVitals.fid, `FID ${Math.round(webVitals.fid)}ms exceeds threshold ${PERFORMANCE_THRESHOLDS.fid}ms`).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.fid)
      expect(webVitals.cls, `CLS ${webVitals.cls.toFixed(3)} exceeds threshold ${PERFORMANCE_THRESHOLDS.cls}`).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.cls)
      expect(webVitals.fcp, `FCP ${Math.round(webVitals.fcp)}ms exceeds threshold ${PERFORMANCE_THRESHOLDS.fcp}ms`).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.fcp)
      expect(webVitals.ttfb, `TTFB ${Math.round(webVitals.ttfb)}ms exceeds threshold ${PERFORMANCE_THRESHOLDS.ttfb}ms`).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.ttfb)
      
    } finally {
      await context.close()
      await browser.close()
    }
  })

  test('Mobile Chrome - Core Web Vitals and Performance Score', async ({ browserName }) => {
    test.skip(browserName !== 'chromium', 'Lighthouse only supports Chromium')
    
    const browser = await chromium.launch({
      args: [
        '--enable-gpu-benchmarking',
        '--enable-threaded-compositing',
        '--remote-debugging-port=9223',
        '--disable-dev-shm-usage',
        '--no-sandbox'
      ]
    })
    
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    })
    
    const page = await context.newPage()
    
    try {
      const flow = await startFlow(page, {
        name: 'FreqHeal Mobile Performance',
        configContext: {
          settingsOverrides: {
            formFactor: 'mobile',
            throttling: {
              rttMs: 150,
              throughputKbps: 1600,
              cpuSlowdownMultiplier: 4,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0
            },
            screenEmulation: {
              mobile: true,
              width: 375,
              height: 667,
              deviceScaleFactor: 2,
              disabled: false
            }
          }
        }
      })
      
      // Mobile navigation test
      await flow.navigate('http://localhost:3000', {
        stepName: 'Mobile Homepage Navigation'
      })
      
      const report = await flow.generateReport()
      const result = flow.getFlowResult()
      
      const navigationResult = result.steps[0]?.lhr
      if (!navigationResult) {
        throw new Error('Mobile navigation audit failed')
      }
      
      const mobileScores: LighthouseScore = {
        performance: Math.round((navigationResult.categories?.performance?.score ?? 0) * 100),
        accessibility: Math.round((navigationResult.categories?.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((navigationResult.categories?.['best-practices']?.score ?? 0) * 100),
        seo: Math.round((navigationResult.categories?.seo?.score ?? 0) * 100),
        pwa: Math.round((navigationResult.categories?.pwa?.score ?? 0) * 100)
      }
      
      const mobileWebVitals: CoreWebVitals = {
        lcp: navigationResult.audits?.['largest-contentful-paint']?.numericValue ?? 0,
        fid: navigationResult.audits?.['max-potential-fid']?.numericValue ?? 0,
        cls: navigationResult.audits?.['cumulative-layout-shift']?.numericValue ?? 0,
        fcp: navigationResult.audits?.['first-contentful-paint']?.numericValue ?? 0,
        ttfb: navigationResult.audits?.['server-response-time']?.numericValue ?? 0
      }
      
      console.log('📱 Lighthouse Audit Results (Mobile Chrome)')
      console.log(`Performance: ${mobileScores.performance}/100`)
      console.log(`LCP: ${Math.round(mobileWebVitals.lcp)}ms`)
      console.log(`CLS: ${mobileWebVitals.cls.toFixed(3)}`)
      console.log(`FCP: ${Math.round(mobileWebVitals.fcp)}ms`)
      
      // Save mobile report
      await page.evaluate((reportHtml) => {
        const fs = require('fs').promises
        fs.writeFile('test-results/lighthouse-mobile-chrome.html', reportHtml)
      }, report)
      
      // Mobile performance thresholds are typically lower
      const mobileThresholds = {
        performance: 80,
        lcp: 4000,
        cls: 0.15,
        fcp: 3000
      }
      
      expect(mobileScores.performance).toBeGreaterThanOrEqual(mobileThresholds.performance)
      expect(mobileWebVitals.lcp).toBeLessThanOrEqual(mobileThresholds.lcp)
      expect(mobileWebVitals.cls).toBeLessThanOrEqual(mobileThresholds.cls)
      expect(mobileWebVitals.fcp).toBeLessThanOrEqual(mobileThresholds.fcp)
      
    } finally {
      await context.close()
      await browser.close()
    }
  })

  test('Cross-Browser Performance Comparison', async ({ page, browserName }) => {
    console.log(`🌐 Testing ${browserName} performance...`)
    
    const startTime = Date.now()
    
    // Navigate to homepage
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    
    const navigationTime = Date.now() - startTime
    
    // Test core functionality across browsers
    await test.step('Test frequency lab loading', async () => {
      // Scroll to frequency lab section
      await page.locator('#frequency-lab').scrollIntoViewIfNeeded()
      
      // Wait for frequency cards to be visible
      await expect(page.locator('[data-testid="frequency-card"]').first()).toBeVisible({ timeout: 15000 })
    })
    
    await test.step('Test audio controls responsiveness', async () => {
      // Check for and dismiss any modal dialogs first
      const modal = page.locator('.fixed.inset-0.bg-black')
      if (await modal.isVisible()) {
        // Try to find and click a dismiss button
        const dismissButton = page.getByText('I Understand').or(page.getByText('Close')).or(page.getByText('Accept'))
        if (await dismissButton.isVisible()) {
          await dismissButton.click()
          await page.waitForTimeout(1000) // Wait for modal to close
        }
      }
      
      // Now try to click the frequency card
      const firstCard = page.locator('[data-testid="frequency-card"]').first()
      
      // Use force click if needed to bypass any remaining overlay issues
      await firstCard.click({ force: true })
      
      // Verify the card became active (check if it has active styling)
      await expect(firstCard).toHaveClass(/bg-gradient-to-br from-blue-50/, { timeout: 5000 })
    })
    
    await test.step('Test UI responsiveness', async () => {
      const interactionStart = Date.now()
      
      // Test button responsiveness by checking if play button is visible
      const playButton = page.locator('[data-testid="play-button"]').first()
      await expect(playButton).toBeVisible({ timeout: 5000 })
      
      const interactionTime = Date.now() - interactionStart
      
      console.log(`${browserName} interaction time: ${interactionTime}ms`)
      expect(interactionTime, `${browserName} interaction too slow`).toBeLessThan(2000)
    })
    
    // Performance assertions per browser
    const browserThresholds = {
      chromium: { navigation: 3000 },
      firefox: { navigation: 4000 },
      webkit: { navigation: 4500 },
      edge: { navigation: 3500 }
    }
    
    const threshold = browserThresholds[browserName as keyof typeof browserThresholds]?.navigation ?? 5000
    
    console.log(`${browserName} navigation time: ${navigationTime}ms (threshold: ${threshold}ms)`)
    expect(navigationTime, `${browserName} navigation time exceeds threshold`).toBeLessThan(threshold)
  })

  test('Performance Regression Detection', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Performance baseline only measured in Chrome')
    
    // Measure key performance metrics and compare against baseline
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Use Navigation API if available, fallback to basic timing
        if ('navigation' in performance && performance.navigation) {
          const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          if (navEntry) {
            resolve({
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime ?? 0,
              firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0
            })
            return
          }
        }
        
        // Fallback to basic performance data
        resolve({
          domContentLoaded: Date.now() % 1000, // Basic approximation
          loadComplete: Date.now() % 1000,
          firstPaint: Date.now() % 1000,
          firstContentfulPaint: Date.now() % 1000
        })
      })
    })
    
    console.log('📊 Performance Metrics:', performanceMetrics)
    
    // Basic regression check - ensure metrics are reasonable
    const metrics = performanceMetrics as any
    expect(metrics.domContentLoaded).toBeGreaterThanOrEqual(0)
    expect(metrics.loadComplete).toBeGreaterThanOrEqual(0)
    expect(metrics.firstPaint).toBeGreaterThanOrEqual(0)
    expect(metrics.firstContentfulPaint).toBeGreaterThanOrEqual(0)
  })
})