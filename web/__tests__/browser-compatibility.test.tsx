/**
 * Browser Compatibility Test Suite — Updated for M002
 * Tests cross-browser API feature detection and graceful fallbacks
 */

describe('Browser API Compatibility', () => {
  describe('Web Audio API', () => {
    test('AudioContext is available', () => {
      expect(window.AudioContext).toBeDefined()
    })

    test('AudioContext can be instantiated', () => {
      const ctx = new AudioContext()
      expect(ctx).toBeDefined()
      expect(ctx.createOscillator).toBeDefined()
      expect(ctx.createGain).toBeDefined()
    })
  })

  describe('Canvas API', () => {
    test('HTMLCanvasElement.getContext is available', () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      expect(ctx).toBeDefined()
    })
  })

  describe('IntersectionObserver', () => {
    test('IntersectionObserver is available', () => {
      expect(window.IntersectionObserver).toBeDefined()
    })

    test('IntersectionObserver can be instantiated', () => {
      const observer = new IntersectionObserver(() => {})
      expect(observer).toBeDefined()
      expect(observer.observe).toBeDefined()
      expect(observer.disconnect).toBeDefined()
    })
  })

  describe('ResizeObserver', () => {
    test('ResizeObserver is available', () => {
      expect(window.ResizeObserver).toBeDefined()
    })
  })

  describe('matchMedia', () => {
    test('matchMedia is available', () => {
      expect(window.matchMedia).toBeDefined()
    })

    test('matchMedia returns expected interface', () => {
      const mql = window.matchMedia('(min-width: 768px)')
      expect(mql).toHaveProperty('matches')
      expect(mql).toHaveProperty('media')
      expect(mql.addEventListener).toBeDefined()
    })
  })

  describe('localStorage', () => {
    test('localStorage is available', () => {
      expect(window.localStorage).toBeDefined()
    })

    test('can store and retrieve values', () => {
      localStorage.setItem('test-key', 'test-value')
      expect(localStorage.getItem('test-key')).toBe('test-value')
      localStorage.removeItem('test-key')
    })
  })

  describe('requestAnimationFrame', () => {
    test('requestAnimationFrame is available', () => {
      expect(window.requestAnimationFrame).toBeDefined()
    })

    test('cancelAnimationFrame is available', () => {
      expect(window.cancelAnimationFrame).toBeDefined()
    })
  })
})

describe('CSS Feature Detection Patterns', () => {
  test('vendor prefix pattern exists in panel CSS', () => {
    // Verify the pattern is used in our CSS files (static check)
    const fs = require('fs')
    const path = require('path')
    const panelCss = fs.readFileSync(
      path.join(__dirname, '../styles/panel-responsive.css'),
      'utf8'
    )
    expect(panelCss).toContain('-webkit-')
  })

  test('reduced motion support exists in CSS', () => {
    const fs = require('fs')
    const path = require('path')
    const panelCss = fs.readFileSync(
      path.join(__dirname, '../styles/panel-responsive.css'),
      'utf8'
    )
    expect(panelCss).toContain('prefers-reduced-motion')
  })
})
