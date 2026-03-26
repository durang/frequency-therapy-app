'use client'

import { accessibilityConfig } from '@/lib/medicalMetadata'

export function ClientAccessibilityControls() {
  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast')
    
    // Announce the change to screen readers
    const isHighContrast = document.documentElement.classList.contains('high-contrast')
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.textContent = `High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`
    document.body.appendChild(announcement)
    
    setTimeout(() => document.body.removeChild(announcement), 3000)
  }

  return (
    <>
      {/* Skip Links for Accessibility */}
      <div className="sr-only focus-within:not-sr-only">
        {accessibilityConfig.skipLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="absolute top-0 left-0 z-50 p-4 bg-blue-600 text-white font-medium rounded-br-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all"
          >
            {link.text}
          </a>
        ))}
      </div>

      {/* High Contrast Mode Toggle */}
      <div className="sr-only focus-within:not-sr-only fixed top-4 right-4 z-50">
        <button
          onClick={toggleHighContrast}
          className="p-2 bg-gray-900 text-white rounded focus:outline-none focus:ring-4 focus:ring-blue-500"
          aria-label="Toggle high contrast mode for better visibility"
          title="Press to toggle high contrast mode"
        >
          🎨 High Contrast
        </button>
      </div>

      {/* Keyboard shortcut announcements for screen readers */}
      <div className="sr-only" aria-live="polite" id="keyboard-shortcuts-info">
        <p>Keyboard shortcuts: Alt+1 for main content, Alt+2 for navigation, Escape for emergency stop</p>
      </div>
    </>
  )
}