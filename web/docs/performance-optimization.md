# Performance Optimization Guide

This document outlines the comprehensive performance monitoring, optimization, and tracking infrastructure implemented in the Frequency Therapy Application.

## Overview

The application includes production-grade performance monitoring with:
- Real-time Core Web Vitals collection
- Performance regression detection
- Cross-browser performance testing
- Bundle optimization analysis
- Automated performance auditing

## Core Web Vitals Monitoring

### What Are Core Web Vitals?

Core Web Vitals are a set of real-world, user-centered metrics that quantify key aspects of user experience:

- **LCP (Largest Contentful Paint)**: Loading performance - measures when the largest content element becomes visible
- **INP (Interaction to Next Paint)**: Responsiveness - measures the time from user interaction to visual response
- **CLS (Cumulative Layout Shift)**: Visual stability - measures unexpected layout shifts

Additional metrics monitored:
- **FID (First Input Delay)**: Legacy interactivity metric
- **FCP (First Contentful Paint)**: Initial loading metric
- **TTFB (Time to First Byte)**: Server responsiveness

### Performance Thresholds

The application uses Google-recommended thresholds:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| FID | ≤ 100ms | ≤ 300ms | > 300ms |
| FCP | ≤ 1.8s | ≤ 3.0s | > 3.0s |
| TTFB | ≤ 800ms | ≤ 1.8s | > 1.8s |

### Implementation

The Web Vitals monitoring is automatically enabled through Next.js's `useReportWebVitals` hook in `app/layout.tsx`:

```tsx
import { reportWebVitals } from '@/lib/performance-monitoring'

export function useReportWebVitals(metric: any) {
  reportWebVitals(metric)
}
```

### Features

#### 1. Automated Baseline Tracking
- Automatically establishes performance baselines from good metrics
- Stores baselines in localStorage for persistence
- Updates baselines when better performance is achieved

#### 2. Regression Detection
- Monitors for performance regressions > 10% from baseline
- Logs warnings when regressions are detected
- Tracks regression history for analysis

#### 3. Real-time Monitoring
- Collects metrics as users interact with the application
- Stores up to 100 recent metrics locally
- Sends data to analytics services (Google Analytics, custom endpoints)

#### 4. Device Context
- Captures device information (screen size, memory, connection type)
- Associates performance data with hardware capabilities
- Enables device-specific performance analysis

## Usage

### Accessing Performance Data

The performance monitoring exposes utilities for debugging and analysis:

```javascript
// Get current performance metrics summary
const metrics = window.performanceUtils.getMetrics()

// Check if performance is within acceptable thresholds
const isGood = window.performanceUtils.isPerformanceGood()

// Get overall performance score (0-100)
const score = window.performanceUtils.getPerformanceScore()

// Export all metrics for analysis
const data = window.performanceUtils.exportMetrics()

// Clear stored metrics
window.performanceUtils.clearMetrics()
```

### Performance Score Calculation

The performance score is calculated based on Web Vitals ratings:
- **Good metrics**: 100 points
- **Needs improvement**: 75 points  
- **Poor metrics**: 50 points

Final score is the average across all collected metrics.

### Analytics Integration

#### Google Analytics 4
When Google Analytics is available, metrics are automatically sent:

```javascript
gtag('event', 'web_vitals', {
  metric_name: 'LCP',
  metric_value: 2500,
  metric_rating: 'good',
  metric_delta: 2500,
  is_regression: false
})
```

#### Custom Monitoring Endpoint
Configure a custom endpoint via environment variable:

```env
NEXT_PUBLIC_PERFORMANCE_ENDPOINT=https://your-monitoring-service.com/metrics
```

## Cross-Browser Performance Testing

### Automated Testing with Playwright

The application includes comprehensive cross-browser performance testing using Playwright and Lighthouse:

```bash
# Run performance tests across all browsers
npm run test:performance

# Run tests for specific browser
npm run test:performance:chrome
npm run test:performance:firefox
npm run test:performance:safari
npm run test:performance:edge
```

### Performance Audit Script

```bash
# Run comprehensive performance audit
./scripts/performance-audit.sh

# Audit specific pages
./scripts/performance-audit.sh /therapy /dashboard /pricing
```

### Browser-Specific Thresholds

Different browsers have different performance characteristics:

```typescript
// Chrome/Edge (Chromium-based)
const chromiumThresholds = {
  lcp: 2500,
  fid: 100,
  cls: 0.1
}

// Firefox
const firefoxThresholds = {
  lcp: 3000, // Slightly more lenient
  fid: 150,
  cls: 0.15
}

// Safari
const safariThresholds = {
  lcp: 3500, // Most lenient due to platform differences
  fid: 200,
  cls: 0.2
}
```

## Bundle Analysis and Optimization

### Bundle Size Monitoring

The application includes automated bundle analysis to detect size regressions:

```bash
# Analyze current bundle
npm run analyze

# Compare with previous build
./scripts/analyze-bundle.sh
```

### Bundle Optimization Features

1. **Tree Shaking**: Removes unused code
2. **Code Splitting**: Loads code on demand
3. **Dynamic Imports**: Reduces initial bundle size
4. **Image Optimization**: Next.js automatic image optimization
5. **Font Optimization**: Automatic Google Fonts optimization

### Size Regression Detection

The system automatically detects bundle size increases:

```javascript
// Regression threshold: 50KB increase
const REGRESSION_THRESHOLD = 50 * 1024

// Monitors:
// - Total bundle size
// - Individual chunk sizes
// - JS/CSS split
// - Third-party dependencies
```

## Performance Debugging

### Development Mode

In development, detailed performance logs are displayed in the console:

```
[Web Vitals] LCP: {
  value: 2245,
  rating: 'good',
  delta: 2245,
  regression: false
}
```

### Production Monitoring

In production, metrics are:
- Stored locally (last 100 metrics)
- Sent to configured analytics
- Available via browser DevTools

### Performance Issues Checklist

When performance degrades, check:

1. **Network Issues**
   - Slow API responses
   - Large image files
   - Unoptimized fonts
   - Third-party scripts

2. **Runtime Issues**
   - JavaScript execution time
   - Layout thrashing
   - Memory leaks
   - Inefficient re-renders

3. **Build Issues**
   - Bundle size increases
   - Missing optimizations
   - Duplicate dependencies
   - Unoptimized assets

### Debugging Tools

```javascript
// Performance timeline analysis
performance.mark('start-operation')
// ... operation code
performance.mark('end-operation')
performance.measure('operation', 'start-operation', 'end-operation')

// Memory usage monitoring
console.log('Memory usage:', performance.memory)

// Resource timing analysis
const resources = performance.getEntriesByType('resource')
console.log('Slow resources:', 
  resources.filter(r => r.duration > 1000)
)
```

## Configuration

### Environment Variables

```env
# Custom monitoring endpoint
NEXT_PUBLIC_PERFORMANCE_ENDPOINT=https://your-service.com/metrics

# Google Analytics ID (for Web Vitals tracking)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Performance monitoring features
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_PERFORMANCE_SAMPLE_RATE=1.0
```

### Next.js Configuration

Performance optimizations in `next.config.js`:

```javascript
module.exports = {
  // Enable experimental features for better performance
  experimental: {
    turbo: true,        // Turbopack for faster builds
    optimizeCss: true,  // CSS optimization
    optimizeServerReact: true
  },
  
  // Bundle optimization
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
    return config
  }
}
```

## Best Practices

### Code Level Optimizations

1. **Use Next.js Image component** for automatic optimization
2. **Implement lazy loading** for below-the-fold content
3. **Minimize JavaScript bundle size** through tree shaking
4. **Use CSS-in-JS efficiently** to avoid style duplication
5. **Implement proper caching strategies** for static assets

### Medical Application Considerations

For medical applications, balance performance with safety:

1. **Prioritize critical safety features** over performance
2. **Ensure accessibility compliance** doesn't sacrifice performance
3. **Monitor audio processing performance** for therapy delivery
4. **Track emergency response times** as critical metrics
5. **Maintain compliance logging** without performance impact

### Monitoring Strategy

1. **Set up alerts** for performance regressions
2. **Monitor real user metrics** not just synthetic tests
3. **Track performance by user segment** (device, location, network)
4. **Correlate performance with business metrics** (conversion, engagement)
5. **Regularly review and update** performance budgets

## Testing

Run the performance test suite:

```bash
# Unit tests for performance monitoring
npm test -- web/__tests__/core-web-vitals.test.tsx

# Integration tests with real browsers
npm run test:performance

# Bundle analysis tests
npm test -- web/__tests__/bundle-analysis.test.js
```

## Troubleshooting

### Common Performance Issues

1. **High LCP**
   - Large images not optimized
   - Slow server responses
   - Render-blocking resources

2. **Poor INP/FID**
   - Heavy JavaScript execution
   - Large DOM updates
   - Unoptimized event handlers

3. **High CLS**
   - Images without dimensions
   - Dynamic content insertion
   - Web fonts causing layout shifts

### Debugging Steps

1. Check browser DevTools Performance tab
2. Review Network tab for slow resources
3. Analyze bundle size with `npm run analyze`
4. Run Lighthouse audit for recommendations
5. Check console for performance warnings

For additional support, consult the performance monitoring dashboard or review the automated performance test results.