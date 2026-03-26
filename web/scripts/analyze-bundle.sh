#!/bin/bash

# Bundle Analysis Infrastructure for Next.js 16
# Provides automated bundle size tracking, optimization detection, and performance regression prevention
# Compatible with Turbopack (default) and Webpack builds

set -e

echo "🔍 Starting Bundle Analysis..."

# Create analysis directory
mkdir -p .next/analyze

# Function to check if file exists and get size
get_file_size() {
  if [ -f "$1" ]; then
    if [ "$(uname)" = "Darwin" ]; then
      stat -f%z "$1"
    else
      stat -c%s "$1"
    fi
  else
    echo "0"
  fi
}

# Function to format bytes to human readable
format_bytes() {
  local bytes=$1
  if [ "$bytes" -ge 1048576 ]; then
    echo "$(echo "scale=2; $bytes/1048576" | bc)MB"
  elif [ "$bytes" -ge 1024 ]; then
    echo "$(echo "scale=2; $bytes/1024" | bc)KB"
  else
    echo "${bytes}B"
  fi
}

# Store previous build stats if they exist
PREV_STATS_FILE=".next/analyze/previous-stats.json"
if [ -f "$PREV_STATS_FILE" ]; then
  echo "📊 Found previous bundle stats"
  cp "$PREV_STATS_FILE" ".next/analyze/previous-stats-backup.json"
fi

# Clean build with bundle analysis
echo "🧹 Cleaning previous build..."
rm -rf .next

# Determine build method based on Next.js 16 capabilities
echo "📦 Building with bundle analysis..."

# Try standard build for size analysis
echo "📦 Running standard build for bundle size analysis..."
npm run build
ANALYSIS_METHOD="standard"

# Generate bundle stats
echo "📈 Generating bundle statistics..."

# Get build stats from Next.js output - works with both Turbopack and Webpack
STATIC_DIR=".next/static"
MAIN_JS_SIZE=0
VENDOR_JS_SIZE=0
CHUNK_SIZES=0
CSS_SIZES=0

if [ -d "$STATIC_DIR" ]; then
  # Get main bundle sizes (adapt for Turbopack structure)
  
  # Find JavaScript files (Turbopack may have different naming)
  if [ -d "$STATIC_DIR/chunks" ]; then
    # Webpack-style chunks
    MAIN_JS_SIZE=$(find "$STATIC_DIR/chunks" -name "main-*.js" -o -name "app-*.js" -type f -exec stat -f%z {} \; 2>/dev/null | head -1 || echo "0")
    VENDOR_JS_SIZE=$(find "$STATIC_DIR/chunks" -name "*vendor*.js" -o -name "*framework*.js" -type f -exec stat -f%z {} \; 2>/dev/null | head -1 || echo "0")
  else
    # Turbopack-style or app directory structure
    MAIN_JS_SIZE=$(find "$STATIC_DIR" -name "*.js" -type f | head -1 | xargs stat -f%z 2>/dev/null || echo "0")
  fi
  
  # Get total sizes safely
  JS_FILES=$(find "$STATIC_DIR" -name "*.js" -type f 2>/dev/null || echo "")
  if [ -n "$JS_FILES" ]; then
    CHUNK_SIZES=$(echo "$JS_FILES" | xargs stat -f%z 2>/dev/null | paste -sd+ - | bc 2>/dev/null || echo "0")
  fi
  
  CSS_FILES=$(find "$STATIC_DIR" -name "*.css" -type f 2>/dev/null || echo "")
  if [ -n "$CSS_FILES" ]; then
    CSS_SIZES=$(echo "$CSS_FILES" | xargs stat -f%z 2>/dev/null | paste -sd+ - | bc 2>/dev/null || echo "0")
  fi
fi

# Create current stats
CURRENT_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CURRENT_STATS="{
  \"timestamp\": \"$CURRENT_TIMESTAMP\",
  \"analysis_method\": \"$ANALYSIS_METHOD\",
  \"main_js_size\": ${MAIN_JS_SIZE:-0},
  \"vendor_js_size\": ${VENDOR_JS_SIZE:-0},
  \"total_js_size\": ${CHUNK_SIZES:-0},
  \"total_css_size\": ${CSS_SIZES:-0},
  \"build_id\": \"$(cat .next/BUILD_ID 2>/dev/null || echo 'unknown')\"
}"

# Ensure directory exists
mkdir -p .next/analyze
echo "$CURRENT_STATS" > "$PREV_STATS_FILE"

# Compare with previous build if available
if [ -f ".next/analyze/previous-stats-backup.json" ]; then
  echo "🔍 Comparing with previous build..."
  
  PREV_MAIN=$(cat ".next/analyze/previous-stats-backup.json" | grep -o '"main_js_size": [0-9]*' | grep -o '[0-9]*' || echo "0")
  PREV_VENDOR=$(cat ".next/analyze/previous-stats-backup.json" | grep -o '"vendor_js_size": [0-9]*' | grep -o '[0-9]*' || echo "0")
  PREV_TOTAL_JS=$(cat ".next/analyze/previous-stats-backup.json" | grep -o '"total_js_size": [0-9]*' | grep -o '[0-9]*' || echo "0")
  PREV_TOTAL_CSS=$(cat ".next/analyze/previous-stats-backup.json" | grep -o '"total_css_size": [0-9]*' | grep -o '[0-9]*' || echo "0")
  
  # Calculate differences
  MAIN_DIFF=$((${MAIN_JS_SIZE:-0} - $PREV_MAIN))
  VENDOR_DIFF=$((${VENDOR_JS_SIZE:-0} - $PREV_VENDOR))
  TOTAL_JS_DIFF=$((${CHUNK_SIZES:-0} - $PREV_TOTAL_JS))
  TOTAL_CSS_DIFF=$((${CSS_SIZES:-0} - $PREV_TOTAL_CSS))
  
  echo ""
  echo "📊 Bundle Size Comparison:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Format comparison output
  format_comparison() {
    local current=$1
    local previous=$2
    local diff=$3
    local name="$4"
    
    if [ "$diff" -gt 0 ]; then
      echo "  $name: $(format_bytes $current) (+$(format_bytes $diff)) ⚠️"
    elif [ "$diff" -lt 0 ]; then
      local abs_diff=$((0 - $diff))
      echo "  $name: $(format_bytes $current) (-$(format_bytes $abs_diff)) ✅"
    else
      echo "  $name: $(format_bytes $current) (no change) ➖"
    fi
  }
  
  format_comparison ${MAIN_JS_SIZE:-0} $PREV_MAIN $MAIN_DIFF "Main JS Bundle"
  format_comparison ${VENDOR_JS_SIZE:-0} $PREV_VENDOR $VENDOR_DIFF "Vendor Bundle"
  format_comparison ${CHUNK_SIZES:-0} $PREV_TOTAL_JS $TOTAL_JS_DIFF "Total JS"
  format_comparison ${CSS_SIZES:-0} $PREV_TOTAL_CSS $TOTAL_CSS_DIFF "Total CSS"
  
  echo ""
  
  # Check for size regressions
  REGRESSION_THRESHOLD=51200 # 50KB
  TOTAL_DIFF=$((TOTAL_JS_DIFF + TOTAL_CSS_DIFF))
  
  if [ "$TOTAL_DIFF" -gt "$REGRESSION_THRESHOLD" ]; then
    echo "❌ Bundle size regression detected!"
    echo "   Total increase: $(format_bytes $TOTAL_DIFF)"
    echo "   Threshold: $(format_bytes $REGRESSION_THRESHOLD)"
    echo ""
    echo "🔍 Consider optimizing:"
    echo "   • Check for unnecessary dependencies"
    echo "   • Use dynamic imports for large components"
    echo "   • Optimize images and assets"
    echo "   • Review chunk splitting configuration"
    exit 1
  elif [ "$TOTAL_DIFF" -gt 10240 ]; then # 10KB
    echo "⚠️  Bundle size increase detected: $(format_bytes $TOTAL_DIFF)"
    echo "   Consider reviewing recent changes for optimization opportunities"
  else
    echo "✅ Bundle size within acceptable limits"
  fi
else
  echo "📊 Bundle Size Analysis (Baseline):"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Main JS Bundle: $(format_bytes ${MAIN_JS_SIZE:-0})"
  echo "  Vendor Bundle: $(format_bytes ${VENDOR_JS_SIZE:-0})"
  echo "  Total JS: $(format_bytes ${CHUNK_SIZES:-0})"
  echo "  Total CSS: $(format_bytes ${CSS_SIZES:-0})"
  echo ""
  echo "📝 Baseline established for future comparisons"
fi

# Check for bundle analyzer reports
echo ""
echo "📄 Bundle Analysis Reports:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CLIENT_REPORT=".next/client-bundle-report.html"
SERVER_REPORT=".next/server-bundle-report.html"

if [ -f "$CLIENT_REPORT" ]; then
  echo "✅ Client bundle report: $CLIENT_REPORT"
else
  echo "❌ Client bundle report not found"
fi

if [ -f "$SERVER_REPORT" ]; then
  echo "✅ Server bundle report: $SERVER_REPORT"
else
  echo "❌ Server bundle report not found"
fi

# Performance recommendations
echo ""
echo "💡 Optimization Opportunities:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for large chunks
if [ "${MAIN_JS_SIZE:-0}" -gt 524288 ]; then # 512KB
  echo "⚠️  Main bundle is large ($(format_bytes ${MAIN_JS_SIZE:-0}))"
  echo "   Consider code splitting and dynamic imports"
fi

if [ "${VENDOR_JS_SIZE:-0}" -gt 1048576 ]; then # 1MB
  echo "⚠️  Vendor bundle is large ($(format_bytes ${VENDOR_JS_SIZE:-0}))"
  echo "   Consider splitting vendor dependencies"
fi

# Check for optimal chunk configuration
CHUNK_COUNT=$(find "$STATIC_DIR" -name "*.js" -type f 2>/dev/null | wc -l | tr -d ' ' || echo "0")
if [ "$CHUNK_COUNT" -gt 20 ]; then
  echo "⚠️  Many chunks detected ($CHUNK_COUNT)"
  echo "   Consider optimizing chunk splitting strategy"
fi

echo ""
echo "🎯 Next.js 16 Features Active:"
echo "   • Turbopack bundler (default)"
echo "   • Optimized CSS bundling"
echo "   • Package import optimization"
case "$ANALYSIS_METHOD" in
  "turbopack")
    echo "   • Turbopack experimental analyzer used"
    ;;
  "webpack") 
    echo "   • Webpack bundle analyzer fallback used"
    ;;
  "standard")
    echo "   • Standard build with size analysis"
    ;;
esac

echo ""
echo "✅ Bundle analysis complete!"

# Save analysis summary
SUMMARY_FILE=".next/analyze/bundle-summary.json"
SUMMARY="{
  \"analysis_timestamp\": \"$CURRENT_TIMESTAMP\",
  \"analysis_method\": \"$ANALYSIS_METHOD\",
  \"bundle_stats\": $CURRENT_STATS,
  \"chunk_count\": $CHUNK_COUNT,
  \"reports_generated\": {
    \"client_report\": $([ -f "$CLIENT_REPORT" ] && echo "true" || echo "false"),
    \"server_report\": $([ -f "$SERVER_REPORT" ] && echo "true" || echo "false"),
    \"turbopack_analysis\": $([ "$ANALYSIS_METHOD" = "turbopack" ] && echo "true" || echo "false")
  }
}"

echo "$SUMMARY" > "$SUMMARY_FILE"
echo "📊 Analysis summary saved to $SUMMARY_FILE"