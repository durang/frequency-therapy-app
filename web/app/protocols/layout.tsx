import { Metadata } from 'next'
import { protocols } from '@/lib/protocols'
import { collectionSchema, breadcrumbSchema, faqSchema } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Healing Protocols — 25-Day Frequency Therapy Programs',
  description: 'Structured 25-day frequency therapy programs for sleep, anxiety, focus, pain relief, and detox. Research-backed protocols with daily guided sessions using binaural beats and therapeutic frequencies.',
  keywords: [
    'frequency therapy protocol',
    'healing protocol',
    'binaural beats program',
    'sound therapy for sleep',
    'frequency therapy for anxiety',
    'frequency therapy for pain',
    '25 day healing program',
    'brainwave entrainment protocol',
  ],
  openGraph: {
    title: 'Healing Protocols — 25-Day Frequency Therapy Programs',
    description: 'Structured frequency therapy programs for sleep, anxiety, focus, and pain. Research-backed, guided daily sessions.',
    url: 'https://freqtherapy.com/protocols',
    type: 'website',
  },
  alternates: {
    canonical: 'https://freqtherapy.com/protocols',
  },
}

export default function ProtocolsLayout({ children }: { children: React.ReactNode }) {
  const schemas = [
    collectionSchema({
      name: 'FreqTherapy Healing Protocols',
      description: 'Structured 25-day frequency therapy programs for specific conditions.',
      url: 'https://freqtherapy.com/protocols',
      itemCount: protocols.length,
    }),
    breadcrumbSchema([
      { name: 'Home', url: 'https://freqtherapy.com' },
      { name: 'Protocols', url: 'https://freqtherapy.com/protocols' },
    ]),
    faqSchema([
      {
        q: 'How do frequency therapy protocols work?',
        a: 'Each protocol is a structured 25-day program with 2-3 daily sessions using specific therapeutic frequencies. The program progresses through phases — Foundation (learning to respond), Deepening (increased duration), and Integration (long-term neural adaptation). Consistency is key to results.',
      },
      {
        q: 'Which protocol should I start with?',
        a: 'Start with the protocol that matches your primary concern. The Deep Sleep Protocol (beginner) and Anxiety Relief Protocol (beginner) are the most popular starting points. If you are new to frequency therapy, choose a beginner-level protocol.',
      },
      {
        q: 'Do I need headphones for the protocols?',
        a: 'Yes, quality over-ear headphones are recommended for all protocols. The frequencies must reach both ears directly for proper brainwave entrainment. In-ear headphones work but over-ear provide better results.',
      },
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
