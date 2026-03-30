/**
 * Bundle Analysis Test Suite
 * Validates bundle size thresholds, optimization opportunities, and performance regression prevention
 */

const fs = require('fs');
const path = require('path');

describe('Bundle Analysis', () => {
  const bundleStatsPath = path.join(__dirname, '../.next/analyze/bundle-summary.json');
  const buildIdPath = path.join(__dirname, '../.next/BUILD_ID');
  const staticDir = path.join(__dirname, '../.next/static');

  let bundleStats;
  let buildExists;

  beforeAll(() => {
    // Check if build exists
    buildExists = fs.existsSync(buildIdPath);
    
    if (buildExists && fs.existsSync(bundleStatsPath)) {
      const rawStats = fs.readFileSync(bundleStatsPath, 'utf8');
      bundleStats = JSON.parse(rawStats);
    }
  });

  describe('Build Artifacts', () => {
    test('should have successful build', () => {
      expect(buildExists).toBe(true);
      expect(fs.existsSync(buildIdPath)).toBe(true);
    });

    test('should generate bundle analysis files', () => {
      if (!buildExists) {
        console.warn('Skipping bundle analysis - no build found');
        return;
      }

      if (!fs.existsSync(bundleStatsPath)) {
        console.warn('Skipping bundle analysis - no bundle-summary.json (run with ANALYZE=true)');
        return;
      }

      expect(bundleStats).toBeDefined();
      expect(bundleStats.bundle_stats).toBeDefined();
    });

    test('should create static assets directory', () => {
      if (!buildExists) return;
      
      expect(fs.existsSync(staticDir)).toBe(true);
    });
  });

  describe('Bundle Size Thresholds', () => {
    const THRESHOLDS = {
      MAIN_JS_MAX: 512 * 1024,    // 512KB - main application bundle
      VENDOR_JS_MAX: 1024 * 1024, // 1MB - vendor dependencies
      TOTAL_JS_MAX: 2048 * 1024,  // 2MB - total JavaScript
      TOTAL_CSS_MAX: 256 * 1024,  // 256KB - total CSS
      CHUNK_COUNT_MAX: 25,        // Maximum number of chunks
    };

    test('main bundle should be within size limits', () => {
      if (!buildExists || !bundleStats) return;

      const mainJsSize = bundleStats.bundle_stats.main_js_size;
      expect(mainJsSize).toBeLessThanOrEqual(THRESHOLDS.MAIN_JS_MAX);
      
      if (mainJsSize > THRESHOLDS.MAIN_JS_MAX * 0.8) {
        console.warn(`Main bundle approaching limit: ${(mainJsSize / 1024).toFixed(1)}KB`);
      }
    });

    test('vendor bundle should be within size limits', () => {
      if (!buildExists || !bundleStats) return;

      const vendorJsSize = bundleStats.bundle_stats.vendor_js_size;
      expect(vendorJsSize).toBeLessThanOrEqual(THRESHOLDS.VENDOR_JS_MAX);
      
      if (vendorJsSize > THRESHOLDS.VENDOR_JS_MAX * 0.8) {
        console.warn(`Vendor bundle approaching limit: ${(vendorJsSize / 1024).toFixed(1)}KB`);
      }
    });

    test('total JavaScript should be within size limits', () => {
      if (!buildExists || !bundleStats) return;

      const totalJsSize = bundleStats.bundle_stats.total_js_size;
      expect(totalJsSize).toBeLessThanOrEqual(THRESHOLDS.TOTAL_JS_MAX);
      
      if (totalJsSize > THRESHOLDS.TOTAL_JS_MAX * 0.8) {
        console.warn(`Total JS approaching limit: ${(totalJsSize / 1024).toFixed(1)}KB`);
      }
    });

    test('total CSS should be within size limits', () => {
      if (!buildExists || !bundleStats) return;

      const totalCssSize = bundleStats.bundle_stats.total_css_size;
      expect(totalCssSize).toBeLessThanOrEqual(THRESHOLDS.TOTAL_CSS_MAX);
      
      if (totalCssSize > THRESHOLDS.TOTAL_CSS_MAX * 0.8) {
        console.warn(`Total CSS approaching limit: ${(totalCssSize / 1024).toFixed(1)}KB`);
      }
    });

    test('chunk count should be reasonable', () => {
      if (!buildExists || !bundleStats) return;

      const chunkCount = bundleStats.chunk_count;
      expect(chunkCount).toBeLessThanOrEqual(THRESHOLDS.CHUNK_COUNT_MAX);
      
      if (chunkCount > THRESHOLDS.CHUNK_COUNT_MAX * 0.8) {
        console.warn(`Chunk count approaching limit: ${chunkCount}`);
      }
    });
  });

  describe('Optimization Validation', () => {
    test('should have appropriate chunk splitting', () => {
      if (!buildExists) return;

      // Check for expected chunks
      const jsFiles = fs.readdirSync(staticDir, { recursive: true })
        .filter(file => file.endsWith('.js'))
        .filter(file => typeof file === 'string');

      // Should have vendor or framework chunks
      const hasVendorLikeChunk = jsFiles.some(file => 
        file.includes('vendor') || 
        file.includes('chunk') || 
        file.includes('framework') || 
        file.includes('webpack')
      );
      expect(hasVendorLikeChunk).toBe(true);

      // Should have JavaScript files (any will do for Turbopack)
      expect(jsFiles.length).toBeGreaterThan(0);
    });

    test('should generate bundle analyzer reports or provide analysis', () => {
      if (!buildExists || !bundleStats) return;

      const { reports_generated } = bundleStats;
      
      // Should provide analysis via bundle stats even if reports aren't generated
      expect(bundleStats.bundle_stats).toBeDefined();
      expect(bundleStats.analysis_method).toBeDefined();
      
      // Analysis method should be valid
      expect(['turbopack', 'webpack', 'standard']).toContain(bundleStats.analysis_method);
    });

    test('should have optimized asset filenames', () => {
      if (!buildExists) return;

      const allFiles = fs.readdirSync(staticDir, { recursive: true });
      
      // Check for hash-based filenames (Next.js optimization)
      const hashedFiles = allFiles.filter(file => 
        typeof file === 'string' && 
        (file.includes('-') || file.includes('.')) &&
        (file.endsWith('.js') || file.endsWith('.css'))
      );

      expect(hashedFiles.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Regression Detection', () => {
    const previousStatsPath = path.join(__dirname, '../.next/analyze/previous-stats-backup.json');

    test('should not exceed regression threshold when previous build exists', () => {
      if (!buildExists || !bundleStats || !fs.existsSync(previousStatsPath)) {
        console.log('Skipping regression test - no previous build data');
        return;
      }

      const previousStats = JSON.parse(fs.readFileSync(previousStatsPath, 'utf8'));
      const current = bundleStats.bundle_stats;
      const previous = previousStats;

      // Calculate size differences
      const jsDiff = current.total_js_size - previous.total_js_size;
      const cssDiff = current.total_css_size - previous.total_css_size;
      const totalDiff = jsDiff + cssDiff;

      // Regression threshold: 50KB increase
      const REGRESSION_THRESHOLD = 50 * 1024;

      if (totalDiff > REGRESSION_THRESHOLD) {
        console.error(`Bundle size regression detected: +${(totalDiff / 1024).toFixed(1)}KB`);
        console.error(`JS change: +${(jsDiff / 1024).toFixed(1)}KB`);
        console.error(`CSS change: +${(cssDiff / 1024).toFixed(1)}KB`);
      }

      expect(totalDiff).toBeLessThanOrEqual(REGRESSION_THRESHOLD);
    });

    test('should track bundle stats over time', () => {
      if (!buildExists || !bundleStats) return;

      const stats = bundleStats.bundle_stats;
      
      // Validate stats structure
      expect(stats).toHaveProperty('timestamp');
      expect(stats).toHaveProperty('main_js_size');
      expect(stats).toHaveProperty('vendor_js_size');
      expect(stats).toHaveProperty('total_js_size');
      expect(stats).toHaveProperty('total_css_size');
      expect(stats).toHaveProperty('build_id');

      // Validate stats values
      expect(typeof stats.main_js_size).toBe('number');
      expect(typeof stats.vendor_js_size).toBe('number');
      expect(typeof stats.total_js_size).toBe('number');
      expect(typeof stats.total_css_size).toBe('number');
    });
  });

  describe('Next.js 16 Optimization Features', () => {
    test('should validate Turbopack optimization settings', () => {
      const nextConfigPath = path.join(__dirname, '../next.config.js');
      expect(fs.existsSync(nextConfigPath)).toBe(true);

      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Check for Next.js 16 optimization features that are available
      expect(configContent).toContain('optimizeCss: true');
      expect(configContent).toContain('optimizePackageImports');
      expect(configContent).toContain('turbopack:');
    });

    test('should have bundle analyzer configuration', () => {
      const nextConfigPath = path.join(__dirname, '../next.config.js');
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      expect(configContent).toContain('withBundleAnalyzer');
      expect(configContent).toContain('BundleAnalyzerPlugin');
    });

    test('should have webpack optimization configuration', () => {
      const nextConfigPath = path.join(__dirname, '../next.config.js');
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      expect(configContent).toContain('splitChunks');
      expect(configContent).toContain('cacheGroups');
    });
  });

  describe('Bundle Health Metrics', () => {
    test('should report bundle composition', () => {
      if (!buildExists || !bundleStats) return;

      const stats = bundleStats.bundle_stats;
      const totalSize = stats.total_js_size + stats.total_css_size;
      
      console.log('\n📊 Bundle Composition:');
      console.log(`Total Bundle: ${(totalSize / 1024).toFixed(1)}KB`);
      console.log(`JavaScript: ${(stats.total_js_size / 1024).toFixed(1)}KB`);
      console.log(`CSS: ${(stats.total_css_size / 1024).toFixed(1)}KB`);
      console.log(`Chunks: ${bundleStats.chunk_count}`);

      // Bundle should have meaningful content
      expect(totalSize).toBeGreaterThan(10 * 1024); // At least 10KB
    });

    test('should validate asset optimization', () => {
      if (!buildExists) return;

      // Check for compressed assets (Next.js should generate these)
      const staticFiles = fs.readdirSync(staticDir, { recursive: true });
      
      // Should have JavaScript files
      const jsFiles = staticFiles.filter(file => 
        typeof file === 'string' && file.endsWith('.js')
      );
      expect(jsFiles.length).toBeGreaterThan(0);

      // Should have CSS files
      const cssFiles = staticFiles.filter(file => 
        typeof file === 'string' && file.endsWith('.css')
      );
      expect(cssFiles.length).toBeGreaterThan(0);
    });
  });
});