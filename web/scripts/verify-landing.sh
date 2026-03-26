#!/bin/bash

# Landing Page Verification Script
# Verifies complete landing page rendering and frequency objectives display

echo "🧪 FreqHeal Landing Page Verification"
echo "======================================="

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "❌ Server is not running on port 3000"
  echo "Please run: npm run dev"
  exit 1
fi

echo "✅ Server is running on port 3000"

# Test 1: Check FreqHeal branding
echo ""
echo "🔍 Test 1: FreqHeal Branding"
if curl -s http://localhost:3000 | grep -q "FreqHeal"; then
  echo "✅ FreqHeal branding found"
else
  echo "❌ FreqHeal branding not found"
  exit 1
fi

# Test 2: Check for frequency objectives section
echo ""
echo "🔍 Test 2: Frequency Objectives Section" 
if curl -s http://localhost:3000 | grep -q "Frecuencias Destacadas"; then
  echo "✅ Frequency objectives section found"
else
  echo "❌ Frequency objectives section not found"
  exit 1
fi

# Test 3: Check for all 6 unique frequencies
echo ""
echo "🔍 Test 3: Six Unique Healing Frequencies"
frequencies=(
  "DNA Repair"
  "Anxiety Liberation" 
  "Gamma Focus Enhancement"
  "Deep Sleep Delta"
  "Schumann Earth Resonance"
  "Pain Relief Matrix"
)

page_content=$(curl -s http://localhost:3000)

for freq in "${frequencies[@]}"; do
  if echo "$page_content" | grep -q "$freq"; then
    echo "✅ $freq found"
  else
    echo "❌ $freq not found"
  fi
done

# Test 4: Check medical targets (Hz values and categories)
echo ""
echo "🔍 Test 4: Medical Targets (Hz Values)"
medical_targets=(
  "528 Hz"
  "432 Hz" 
  "40 Hz"
  "1.5 Hz"
  "7.83 Hz"
  "285 Hz"
)

for target in "${medical_targets[@]}"; do
  if echo "$page_content" | grep -q "$target"; then
    echo "✅ $target found"
  else
    echo "❌ $target not found"
  fi
done

# Test 5: Check for interactive elements
echo ""
echo "🔍 Test 5: Interactive Elements"
if echo "$page_content" | grep -q "Reproducir"; then
  echo "✅ Play buttons found"
else
  echo "❌ Play buttons not found"
fi

if echo "$page_content" | grep -q "Duración:"; then
  echo "✅ Duration controls found"
else
  echo "❌ Duration controls not found"
fi

# Test 6: Check for benefits display
echo ""
echo "🔍 Test 6: Benefits Display"
if echo "$page_content" | grep -q "BENEFICIOS"; then
  echo "✅ Benefits sections found"
else
  echo "❌ Benefits sections not found"
fi

# Test 7: Check for medical compliance
echo ""
echo "🔍 Test 7: Medical Compliance"
if echo "$page_content" | grep -q "No está destinado a diagnosticar"; then
  echo "✅ Medical disclaimer found"
else
  echo "❌ Medical disclaimer not found"
fi

# Test 8: Check audio visualizer
echo ""
echo "🔍 Test 8: Audio Visualizer" 
if echo "$page_content" | grep -q "Selecciona una frecuencia para comenzar"; then
  echo "✅ Audio visualizer placeholder found"
else
  echo "❌ Audio visualizer placeholder not found"
fi

# Test 9: Check accessibility elements
echo ""
echo "🔍 Test 9: Accessibility Elements"
if echo "$page_content" | grep -q "role=\"main\""; then
  echo "✅ Main content landmark found"
else
  echo "❌ Main content landmark not found"
fi

# Test 10: Check responsive design indicators
echo ""
echo "🔍 Test 10: Responsive Design Indicators"
if echo "$page_content" | grep -q "md:text-"; then
  echo "✅ Responsive typography classes found"
else
  echo "❌ Responsive typography classes not found"
fi

# Test 11: Run Jest tests
echo ""
echo "🔍 Test 11: Running Automated Tests"
cd web
if npm test -- --testPathPattern=frequency-objectives.test.tsx --passWithNoTests --silent; then
  echo "✅ Frequency objectives tests passed"
else
  echo "❌ Frequency objectives tests failed"
fi

# Final verification
echo ""
echo "🎯 Final Verification"
echo "====================="

# Count frequency cards
freq_count=$(echo "$page_content" | grep -o "Reproducir" | wc -l | tr -d ' ')
if [ "$freq_count" -eq "6" ]; then
  echo "✅ All 6 frequency cards found"
else
  echo "❌ Expected 6 frequency cards, found $freq_count"
fi

# Check hero section
if echo "$page_content" | grep -q "Encuentra tu" && echo "$page_content" | grep -q "equilibrio"; then
  echo "✅ Hero section complete"
else
  echo "❌ Hero section incomplete"
fi

# Check footer
if echo "$page_content" | grep -q "FreqHeal" && echo "$page_content" | grep -q "2024"; then
  echo "✅ Footer complete"
else
  echo "❌ Footer incomplete"
fi

echo ""
echo "🏁 Verification Complete!"
echo "========================="