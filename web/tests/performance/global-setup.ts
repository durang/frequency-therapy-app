import { chromium, FullConfig } from '@playwright/test'

/**
 * Global setup for performance testing
 * Initializes test environment and validates server availability
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up performance testing environment...')
  
  // Validate that the dev server is running
  const baseURL = process.env.BASE_URL || 'http://localhost:3000'
  
  try {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    
    console.log(`⚡ Testing server availability at ${baseURL}`)
    
    const response = await page.goto(baseURL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    })
    
    if (!response || response.status() !== 200) {
      throw new Error(`Server not responding correctly. Status: ${response?.status()}`)
    }
    
    // Verify frequency therapy app is loaded
    const title = await page.title()
    console.log(`✅ Server running. Page title: "${title}"`)
    
    // Check for critical elements
    const frequencyLab = page.locator('#frequency-lab')
    const hasFrequencyLab = await frequencyLab.isVisible()
    
    if (!hasFrequencyLab) {
      console.warn('⚠️  Frequency lab section not immediately visible - may affect some tests')
    } else {
      console.log('✅ Frequency lab section detected')
    }
    
    await context.close()
    await browser.close()
    
    // Create test results directory
    const fs = require('fs').promises
    const path = require('path')
    
    const resultsDir = path.join(process.cwd(), 'test-results')
    try {
      await fs.mkdir(resultsDir, { recursive: true })
      console.log('✅ Test results directory ready')
    } catch (error) {
      console.warn('⚠️  Could not create test results directory:', error)
    }
    
    // Initialize performance baseline if needed
    const baselinePath = path.join(resultsDir, 'performance-baseline.json')
    try {
      await fs.access(baselinePath)
      console.log('✅ Performance baseline found')
    } catch {
      const initialBaseline = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        thresholds: {
          desktop: {
            performance: 90,
            lcp: 2500,
            fid: 100,
            cls: 0.1,
            fcp: 1800,
            ttfb: 600
          },
          mobile: {
            performance: 80,
            lcp: 4000,
            fid: 100,
            cls: 0.15,
            fcp: 3000,
            ttfb: 800
          }
        }
      }
      
      await fs.writeFile(baselinePath, JSON.stringify(initialBaseline, null, 2))
      console.log('✅ Performance baseline created')
    }
    
    console.log('🎯 Performance testing setup complete')
    
  } catch (error) {
    console.error('❌ Failed to setup performance testing environment:', error)
    throw error
  }
}

export default globalSetup