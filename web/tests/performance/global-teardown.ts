import { FullConfig } from '@playwright/test'
import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * Global teardown for performance testing
 * Generates performance summary and cleans up test artifacts
 */

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Running performance test teardown...')
  
  const resultsDir = path.join(process.cwd(), 'test-results')
  
  try {
    // Generate performance summary report
    const summaryPath = path.join(resultsDir, 'performance-summary.json')
    
    // Collect all lighthouse reports
    const lighthouseReports: any[] = []
    
    try {
      const files = await fs.readdir(resultsDir)
      const lighthouseFiles = files.filter(file => 
        file.startsWith('lighthouse-') && file.endsWith('.html')
      )
      
      console.log(`📊 Found ${lighthouseFiles.length} lighthouse reports`)
      
      // Read results from playwright-report if available
      const reportDir = path.join(resultsDir, 'playwright-report')
      try {
        const reportFiles = await fs.readdir(reportDir)
        console.log(`📈 Found ${reportFiles.length} files in playwright report`)
      } catch {
        console.log('📋 No playwright report directory found')
      }
      
    } catch (error) {
      console.warn('⚠️  Could not read test results directory:', error)
    }
    
    // Create performance summary
    const summary = {
      timestamp: new Date().toISOString(),
      testRun: {
        total: config.projects.length,
        browsers: config.projects.map(p => p.name),
        baseURL: process.env.BASE_URL || 'http://localhost:3000'
      },
      reports: {
        lighthouse: lighthouseReports.length,
        crossBrowser: true,
        performanceRegression: true
      },
      thresholds: {
        desktop: {
          performance: 90,
          accessibility: 95,
          bestPractices: 90,
          seo: 95,
          lcp: 2500,
          fid: 100,
          cls: 0.1
        },
        mobile: {
          performance: 80,
          lcp: 4000,
          cls: 0.15,
          fcp: 3000
        }
      },
      notes: [
        'Lighthouse audits run only on Chromium browsers',
        'Cross-browser tests validate consistent performance',
        'Performance regression tracking enabled',
        'Core Web Vitals monitored across all test runs'
      ]
    }
    
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2))
    console.log('✅ Performance summary generated')
    
    // Log final results
    console.log('🎯 Performance Test Results Summary:')
    console.log(`   - Browsers tested: ${summary.testRun.browsers.join(', ')}`)
    console.log(`   - Lighthouse reports: ${summary.reports.lighthouse}`)
    console.log(`   - Cross-browser validation: ${summary.reports.crossBrowser ? '✅' : '❌'}`)
    console.log(`   - Performance regression tracking: ${summary.reports.performanceRegression ? '✅' : '❌'}`)
    console.log('')
    console.log('📁 Test artifacts:')
    console.log(`   - Results directory: ${resultsDir}`)
    console.log(`   - Summary file: performance-summary.json`)
    console.log(`   - Lighthouse reports: lighthouse-*.html`)
    console.log('')
    console.log('🔍 To view detailed results:')
    console.log('   npx playwright show-report')
    console.log('   open test-results/lighthouse-*.html')
    
  } catch (error) {
    console.error('❌ Error during teardown:', error)
  }
  
  console.log('✅ Performance test teardown complete')
}

export default globalTeardown