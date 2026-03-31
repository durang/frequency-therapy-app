// ─── SEO Schema Generators ───
// Reusable structured data generators for rich snippets & search rankings

const SITE_URL = 'https://freqtherapy.com'
const SITE_NAME = 'FreqTherapy'

// ─── Organization ───
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Science-backed frequency therapy and binaural beats platform for sleep, focus, anxiety relief, and wellness.',
    sameAs: [
      'https://twitter.com/FreqTherapy',
      'https://youtube.com/@FreqTherapy',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@freqtherapy.com',
      contactType: 'customer support',
      availableLanguage: ['English', 'Spanish'],
    },
  }
}

// ─── WebApplication ───
export function webApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    description: 'Frequency therapy platform with binaural beats, solfeggio frequencies, and structured healing protocols for sleep, anxiety, focus, and pain relief.',
    offers: [
      {
        '@type': 'Offer',
        price: '19',
        priceCurrency: 'USD',
        name: 'Monthly',
        description: 'Full access, billed monthly',
      },
      {
        '@type': 'Offer',
        price: '120',
        priceCurrency: 'USD',
        name: 'Annual',
        description: 'Full access, billed annually — save 47%',
      },
    ],
    featureList: [
      '23 therapeutic frequencies including 432 Hz, 528 Hz, 40 Hz gamma',
      'Structured 25-day healing protocols',
      'Binaural beats and solfeggio tones',
      'Immersive fullscreen experience with breathing guides',
      'Research citations on every frequency page',
    ],
    screenshot: `${SITE_URL}/og-image.png`,
  }
}

// ─── BreadcrumbList ───
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ─── FAQPage ───
export function faqSchema(questions: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }
}

// ─── Article (for frequency pages) ───
export function articleSchema(opts: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    image: opts.image || `${SITE_URL}/og-image.png`,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': opts.url,
    },
  }
}

// ─── HowTo (for protocol pages) ───
export function howToSchema(opts: {
  name: string
  description: string
  totalTime: string // ISO 8601 duration, e.g. "P25D"
  steps: { name: string; text: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    totalTime: opts.totalTime,
    step: opts.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

// ─── CollectionPage ───
export function collectionSchema(opts: {
  name: string
  description: string
  url: string
  itemCount: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    numberOfItems: opts.itemCount,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  }
}

// ─── Product (for pricing page) ───
export function productSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'FreqTherapy Premium',
    description: 'Full access to 23 therapeutic frequencies, unlimited sessions, structured healing protocols, and immersive breathing guides.',
    brand: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    offers: [
      {
        '@type': 'Offer',
        price: '19',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        name: 'Monthly Plan',
        description: 'Billed monthly, cancel anytime',
        url: `${SITE_URL}/pricing`,
      },
      {
        '@type': 'Offer',
        price: '120',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        name: 'Annual Plan',
        description: 'Billed annually — save 47%',
        url: `${SITE_URL}/pricing`,
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '2340',
      bestRating: '5',
    },
  }
}

export { SITE_URL, SITE_NAME }
