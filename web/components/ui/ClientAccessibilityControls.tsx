'use client'

import { accessibilityConfig } from '@/lib/medicalMetadata'

export function ClientAccessibilityControls() {
  return (
    <>
      {/* Skip Links for Accessibility */}
      <div className="sr-only focus-within:not-sr-only">
        {accessibilityConfig.skipLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="absolute top-0 left-0 z-50 p-4 bg-blue-600 text-white font-medium rounded-br-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            {link.text}
          </a>
        ))}
      </div>

      {/* High Contrast Mode Toggle */}
      <div className="sr-only focus-within:not-sr-only fixed top-4 right-4 z-50">
        <button
          onClick={() => document.documentElement.classList.toggle('high-contrast')}
          className="p-2 bg-gray-900 text-white rounded focus:outline-none focus:ring-4 focus:ring-blue-500"
          aria-label="Toggle high contrast mode for better visibility"
        >
          🎨 High Contrast
        </button>
      </div>
    </>
  )
}