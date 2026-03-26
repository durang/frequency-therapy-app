import { defineConfig, devices } from '@playwright/test'

/**
 * Cross-browser performance testing configuration with Lighthouse integration
 * Supports Chrome, Safari, Firefox, and Edge with automated Core Web Vitals monitoring
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. */
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video recording */
    video: 'retain-on-failure',
    
    /* Timeout for each action */
    actionTimeout: 10000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable performance metrics collection
        launchOptions: {
          args: [
            '--enable-gpu-benchmarking',
            '--enable-threaded-compositing',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--enable-features=NetworkServiceInProcess'
          ]
        }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          args: [
            '--disable-dev-shm-usage'
          ]
        }
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },

    /* Microsoft Edge */
    {
      name: 'edge',
      use: { 
        ...devices['Desktop Edge'],
        launchOptions: {
          args: [
            '--enable-gpu-benchmarking',
            '--enable-threaded-compositing',
            '--disable-dev-shm-usage',
            '--no-sandbox'
          ]
        }
      },
    },

    /* Mobile testing for performance validation */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        launchOptions: {
          args: [
            '--enable-gpu-benchmarking',
            '--enable-threaded-compositing'
          ]
        }
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe'
  },

  /* Global setup for performance monitoring */
  globalSetup: require.resolve('./tests/performance/global-setup.ts'),

  /* Test output directory */
  outputDir: 'test-results/',
  
  /* Expect configuration */
  expect: {
    /* Timeout for expect assertions */
    timeout: 10000,
    
    /* Animation handling */
    toHaveScreenshot: { 
      animations: 'disabled'
    },
  },

  /* Performance test specific configuration */
  timeout: 60000, // Longer timeout for performance tests
  
  /* Global test configuration */
  globalTeardown: require.resolve('./tests/performance/global-teardown.ts'),
})