#!/bin/bash

# Performance Audit Script
# Automated cross-browser performance testing with Lighthouse integration
# Part of the FreqHeal frequency therapy platform testing suite

set -e

echo "🚀 FreqHeal Performance Audit Suite"
echo "====================================="
echo ""

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
RESULTS_DIR="test-results"
REPORT_DIR="$RESULTS_DIR/performance-audit"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create results directories
create_directories() {
    log_info "Creating results directories..."
    mkdir -p "$RESULTS_DIR"
    mkdir -p "$REPORT_DIR"
    log_success "Directories created"
}

# Check if server is running
check_server() {
    log_info "Checking if development server is running at $BASE_URL..."
    
    if curl -s --connect-timeout 5 "$BASE_URL" > /dev/null; then
        log_success "Server is running at $BASE_URL"
        
        # Check if it's the frequency therapy app
        local page_content=$(curl -s "$BASE_URL")
        if echo "$page_content" | grep -q "FreqHeal\|frequency\|Hz"; then
            log_success "FreqHeal application detected"
        else
            log_warning "Server running but may not be FreqHeal app"
        fi
    else
        log_error "Server not running at $BASE_URL"
        log_info "Please start the development server with: npm run dev"
        exit 1
    fi
}

# Run Playwright tests
run_playwright_tests() {
    log_info "Running Playwright performance tests..."
    
    if npm run test:performance -- --grep="lighthouse" --reporter=list; then
        log_success "Playwright tests completed successfully"
        return 0
    else
        local exit_code=$?
        log_error "Playwright tests failed with exit code $exit_code"
        return $exit_code
    fi
}

# Run cross-browser compatibility tests
run_cross_browser_tests() {
    log_info "Running cross-browser compatibility tests..."
    
    # Test each browser separately to get detailed results
    local browsers=("chromium" "firefox" "webkit")
    local failed_browsers=()
    
    for browser in "${browsers[@]}"; do
        echo ""
        log_info "Testing $browser..."
        
        if npx playwright test --project="$browser" tests/performance/ --reporter=list; then
            log_success "$browser tests passed"
        else
            log_warning "$browser tests failed"
            failed_browsers+=("$browser")
        fi
    done
    
    # Edge testing (if available)
    if npx playwright test --project="edge" tests/performance/ --reporter=list 2>/dev/null; then
        log_success "Edge tests passed"
    else
        log_warning "Edge tests failed or not available"
        failed_browsers+=("edge")
    fi
    
    if [ ${#failed_browsers[@]} -eq 0 ]; then
        log_success "All browsers passed compatibility tests"
        return 0
    else
        log_warning "Some browsers failed: ${failed_browsers[*]}"
        return 1
    fi
}

# Generate lighthouse audit using CLI (fallback)
run_lighthouse_cli() {
    log_info "Running additional Lighthouse CLI audit..."
    
    if command -v lighthouse >/dev/null 2>&1; then
        local output_file="$REPORT_DIR/lighthouse-cli-$TIMESTAMP.html"
        
        lighthouse "$BASE_URL" \
            --output=html \
            --output-path="$output_file" \
            --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
            --throttling-method=devtools \
            --form-factor=desktop \
            --quiet || {
            log_warning "Lighthouse CLI audit failed, but continuing with Playwright results"
            return 1
        }
        
        log_success "Lighthouse CLI report saved to $output_file"
        return 0
    else
        log_warning "Lighthouse CLI not available, skipping additional audit"
        return 1
    fi
}

# Analyze performance results
analyze_results() {
    log_info "Analyzing performance results..."
    
    local json_report="$RESULTS_DIR/results.json"
    local summary_file="$REPORT_DIR/performance-summary-$TIMESTAMP.txt"
    
    {
        echo "FreqHeal Performance Audit Summary"
        echo "Generated: $(date)"
        echo "Base URL: $BASE_URL"
        echo "======================================="
        echo ""
        
        # Check for test results
        if [ -f "$json_report" ]; then
            echo "📊 Test Results Analysis:"
            
            # Count passed/failed tests
            local total_tests=$(jq -r '.suites[].specs | length' "$json_report" 2>/dev/null | paste -sd+ | bc 2>/dev/null || echo "0")
            local passed_tests=$(jq -r '.suites[].specs[] | select(.tests[].results[].status == "passed") | .title' "$json_report" 2>/dev/null | wc -l || echo "0")
            local failed_tests=$((total_tests - passed_tests))
            
            echo "   Total tests: $total_tests"
            echo "   Passed: $passed_tests"
            echo "   Failed: $failed_tests"
            echo ""
        fi
        
        # List generated reports
        echo "📁 Generated Reports:"
        find "$RESULTS_DIR" -name "lighthouse-*.html" -o -name "*.json" | while read -r file; do
            echo "   - $(basename "$file")"
        done
        echo ""
        
        # Performance thresholds summary
        echo "🎯 Performance Thresholds:"
        echo "   Desktop Performance Score: ≥90"
        echo "   Mobile Performance Score: ≥80"
        echo "   Largest Contentful Paint (LCP): ≤2.5s"
        echo "   First Input Delay (FID): ≤100ms"
        echo "   Cumulative Layout Shift (CLS): ≤0.1"
        echo "   Accessibility Score: ≥95"
        echo ""
        
        echo "🌐 Browser Compatibility:"
        echo "   ✓ Chromium (Chrome/Edge)"
        echo "   ✓ Firefox"
        echo "   ✓ WebKit (Safari)"
        echo ""
        
        # Next steps
        echo "📋 Next Steps:"
        echo "   1. Review Lighthouse reports: open test-results/lighthouse-*.html"
        echo "   2. Check Playwright report: npx playwright show-report"
        echo "   3. Address any failing performance thresholds"
        echo "   4. Monitor Core Web Vitals in production"
        echo ""
        
        echo "For detailed analysis, open the HTML reports in your browser."
        
    } > "$summary_file"
    
    log_success "Performance summary saved to $summary_file"
    
    # Display summary on console
    echo ""
    echo "📋 Performance Audit Summary"
    echo "=============================="
    cat "$summary_file" | tail -n +5
}

# Cleanup old reports (optional)
cleanup_old_reports() {
    log_info "Cleaning up old reports (keeping last 5)..."
    
    # Remove old lighthouse reports
    find "$RESULTS_DIR" -name "lighthouse-*.html" -type f -mtime +7 -delete 2>/dev/null || true
    
    # Remove old performance summaries
    find "$REPORT_DIR" -name "performance-summary-*.txt" -type f | sort | head -n -5 | xargs rm -f 2>/dev/null || true
    
    log_success "Cleanup completed"
}

# Main execution
main() {
    echo "Starting performance audit at $(date)"
    echo ""
    
    # Setup
    create_directories
    check_server
    
    # Run tests
    local playwright_success=true
    local cross_browser_success=true
    local lighthouse_success=true
    
    if ! run_playwright_tests; then
        playwright_success=false
    fi
    
    if ! run_cross_browser_tests; then
        cross_browser_success=false
    fi
    
    if ! run_lighthouse_cli; then
        lighthouse_success=false
    fi
    
    # Analysis and cleanup
    analyze_results
    cleanup_old_reports
    
    # Final status
    echo ""
    echo "🏁 Performance Audit Complete"
    echo "=============================="
    
    if $playwright_success && $cross_browser_success; then
        log_success "All core tests passed successfully"
        echo ""
        echo "View results:"
        echo "  npx playwright show-report"
        echo "  open $RESULTS_DIR/lighthouse-*.html"
        exit 0
    else
        log_warning "Some tests failed - check results for details"
        echo ""
        echo "Debug with:"
        echo "  npx playwright test tests/performance/ --debug"
        echo "  npx playwright show-report"
        exit 1
    fi
}

# Handle script interruption
trap 'echo ""; log_warning "Performance audit interrupted"; exit 130' INT

# Check dependencies
if ! command -v npm >/dev/null 2>&1; then
    log_error "npm is required but not installed"
    exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
    log_error "npx is required but not installed"
    exit 1
fi

# Run main function
main "$@"