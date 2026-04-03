import { Metadata } from 'next'
import { productSchema, faqSchema, breadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Pricing — FreqTherapy Plans & Free Trial',
  description: 'FreqTherapy pricing: 2 free frequencies, unlimited premium access from $5.75/month (annual) or $19/month. All 23 therapeutic frequencies, unlimited sessions, healing protocols, and breathing guides. Cancel anytime.',
  keywords: [
    'frequency therapy app price',
    'binaural beats app subscription',
    'sound therapy app cost',
    'FreqTherapy pricing',
    'healing frequency app free trial',
  ],
  openGraph: {
    title: 'Simple, Honest Pricing — FreqTherapy',
    description: 'Full access to 23 frequencies & healing protocols. From $5.75/month. Try free, no account needed.',
    url: 'https://freqtherapy.com/pricing',
    type: 'website',
  },
  alternates: {
    canonical: 'https://freqtherapy.com/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  const schemas = [
    productSchema(),
    faqSchema([
      {
        q: 'Can I try FreqTherapy for free?',
        a: 'Yes. 2 frequencies (432 Hz Anxiety Liberation and 528 Hz Love Frequency) are available completely free with 5-minute sessions. No account or credit card required.',
      },
      {
        q: 'How much does FreqTherapy cost?',
        a: 'FreqTherapy offers two plans: $19/month (monthly, cancel anytime) or $69/year ($5.75/month, save 70%). Both plans include full access to all 23 frequencies, unlimited session length, healing protocols, and breathing guides.',
      },
      {
        q: 'What payment methods does FreqTherapy accept?',
        a: 'We accept all major credit cards, Apple Pay, and Google Pay through our secure payment partner Lemon Squeezy.',
      },
      {
        q: 'Can I cancel my FreqTherapy subscription anytime?',
        a: 'Yes, cancel anytime from your dashboard or the subscription portal. No lock-in contracts, no cancellation fees. Your access continues until the end of your billing period.',
      },
      {
        q: 'Is FreqTherapy a medical device?',
        a: 'No. FreqTherapy is a wellness tool for relaxation, focus, and general wellbeing. It is not FDA-approved and does not diagnose, treat, cure, or prevent any medical condition. Always consult your healthcare provider for medical advice.',
      },
      {
        q: 'What is included in the premium plan?',
        a: 'Premium includes: all 23 therapeutic frequencies (432 Hz, 528 Hz, 40 Hz gamma, delta, theta, and more), unlimited session length, structured 25-day healing protocols, configurable breathing guides, immersive fullscreen experience, scientific teleprompter narratives, and priority access to new frequencies.',
      },
    ]),
    breadcrumbSchema([
      { name: 'Home', url: 'https://freqtherapy.com' },
      { name: 'Pricing', url: 'https://freqtherapy.com/pricing' },
    ]),
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  )
}
