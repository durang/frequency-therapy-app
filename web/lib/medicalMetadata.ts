import { Metadata } from 'next'

// ─── Main Site Metadata ───
// Targets: "frequency therapy app", "binaural beats therapy", "sound healing",
// "432 Hz", "528 Hz healing", "40 Hz gamma", "solfeggio frequencies"
export function generateMedicalMetadata(): Metadata {
  return {
    title: {
      default: 'FreqTherapy — Frequency Healing & Binaural Beats App',
      template: '%s | FreqTherapy'
    },
    description: 'Experience science-backed frequency therapy with binaural beats, solfeggio tones, and 40 Hz gamma. 23 therapeutic frequencies, structured healing protocols, and immersive sessions for sleep, anxiety, focus, and pain relief. Try free.',
    keywords: [
      // Tier 1 — high volume
      'frequency therapy',
      'binaural beats',
      'binaural beats for sleep',
      'binaural beats for anxiety',
      'binaural beats for focus',
      'sound therapy app',
      'frequency healing',
      // Tier 2 — specific frequencies (low competition, high intent)
      '432 Hz music',
      '432 Hz anxiety relief',
      '528 Hz healing',
      '528 Hz DNA repair',
      '40 Hz gamma',
      '40 Hz Alzheimer therapy',
      'solfeggio frequencies',
      'healing frequencies',
      // Tier 3 — long-tail
      'brainwave entrainment',
      'sound healing app',
      'frequency therapy for sleep',
      'binaural beats therapy app',
      'delta waves for sleep',
      'theta waves meditation',
      'Schumann resonance',
    ],
    authors: [{ name: 'FreqTherapy' }],
    creator: 'FreqTherapy',
    publisher: 'FreqTherapy',
    category: 'Health & Wellness',
    classification: 'Wellness Application',

    other: {
      'theme-color': '#0891b2',
      'color-scheme': 'light dark',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
    },

    openGraph: {
      title: 'FreqTherapy — Frequency Healing & Binaural Beats',
      description: '23 therapeutic frequencies with structured healing protocols. Binaural beats, solfeggio tones, 40 Hz gamma, and more. Start free.',
      type: 'website',
      locale: 'en_US',
      url: 'https://freqtherapy.com',
      siteName: 'FreqTherapy',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'FreqTherapy — Frequency Healing & Binaural Beats App',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@FreqTherapy',
      creator: '@FreqTherapy',
      title: 'FreqTherapy — Frequency Healing & Binaural Beats',
      description: 'Science-backed frequency therapy. 432 Hz, 528 Hz, 40 Hz gamma, solfeggio frequencies and healing protocols. Try free.',
      images: ['/og-image.png'],
    },

    applicationName: 'FreqTherapy',
    referrer: 'origin-when-cross-origin',

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
      ],
    },

    manifest: '/manifest.json',

    alternates: {
      canonical: 'https://freqtherapy.com',
    },
  }
}

// ─── Frequency Page Metadata Generator ───
export function generateFrequencyMetadata(freq: {
  name: string
  slug: string
  hz_value: number
  description: string
  benefits: string[]
  category: string
}): Metadata {
  const title = `${freq.hz_value} Hz ${freq.name} — Science, Benefits & Free Session`
  const description = `Discover ${freq.hz_value} Hz ${freq.name.toLowerCase()}: ${freq.description}. Research-backed benefits include ${freq.benefits.slice(0, 3).join(', ').toLowerCase()}. Listen free with guided sessions.`
  const url = `https://freqtherapy.com/frequencies/${freq.slug}`

  return {
    title,
    description: description.slice(0, 160),
    keywords: [
      `${freq.hz_value} Hz`,
      `${freq.hz_value} Hz frequency`,
      `${freq.hz_value} Hz benefits`,
      `${freq.hz_value} Hz healing`,
      `${freq.hz_value} Hz therapy`,
      freq.name.toLowerCase(),
      'frequency therapy',
      'binaural beats',
      'sound healing',
    ],
    openGraph: {
      title,
      description: description.slice(0, 200),
      type: 'article',
      url,
      siteName: 'FreqTherapy',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${freq.hz_value} Hz ${freq.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${freq.hz_value} Hz ${freq.name}`,
      description: description.slice(0, 200),
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: url,
    },
  }
}

// ─── Protocol Page Metadata Generator ───
export function generateProtocolMetadata(protocol: {
  name: string
  slug: string
  description: string
  condition: string
  duration_days: number
}): Metadata {
  const title = `${protocol.name} — ${protocol.duration_days}-Day Frequency Therapy Program`
  const description = `${protocol.description} Structured ${protocol.duration_days}-day program for ${protocol.condition.split(',')[0].toLowerCase()}. Research-backed frequencies with daily guided sessions.`
  const url = `https://freqtherapy.com/protocols/${protocol.slug}`

  return {
    title,
    description: description.slice(0, 160),
    keywords: [
      protocol.name.toLowerCase(),
      `frequency therapy ${protocol.condition.split(',')[0].toLowerCase()}`,
      'healing protocol',
      'frequency therapy program',
      'binaural beats protocol',
      'sound therapy program',
    ],
    openGraph: {
      title,
      description: description.slice(0, 200),
      type: 'article',
      url,
      siteName: 'FreqTherapy',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: protocol.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${protocol.name} — ${protocol.duration_days}-Day Program`,
      description: description.slice(0, 200),
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: url,
    },
  }
}

// ─── Accessibility config (kept from original) ───
export const accessibilityConfig = {
  colorContrast: {
    normal: '4.5:1',
    large: '3:1',
    graphics: '3:1'
  },
  focusIndicators: {
    minSize: '2px',
    color: '#0891b2',
    style: 'solid'
  },
  skipLinks: [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#frequency-controls', text: 'Skip to frequency controls' }
  ],
  screenReaderLabels: {
    frequencySlider: 'Frequency in Hertz, use arrow keys to adjust',
    volumeControl: 'Audio volume, use arrow keys to adjust',
    playButton: 'Start frequency therapy session',
    stopButton: 'Stop frequency therapy session',
    emergencyStop: 'Emergency stop - immediately halt all audio'
  },
  keyboardShortcuts: [
    { key: 'Space', action: 'Play/Pause frequency' },
    { key: 'Escape', action: 'Emergency stop all audio' },
    { key: 'Tab', action: 'Navigate between controls' },
    { key: 'Enter', action: 'Activate focused element' }
  ]
}

export const medicalLocalization = {
  en: {
    disclaimer: 'Not intended to diagnose, treat, cure, or prevent any disease',
    emergency: 'If you experience adverse reactions, discontinue use immediately',
    consultation: 'Consult your healthcare provider before use'
  },
  es: {
    disclaimer: 'No está destinado a diagnosticar, tratar, curar o prevenir ninguna enfermedad',
    emergency: 'Si experimenta reacciones adversas, suspenda el uso inmediatamente',
    consultation: 'Consulte a su proveedor de atención médica antes de usar'
  }
}
