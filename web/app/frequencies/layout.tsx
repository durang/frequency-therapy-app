import { Metadata } from 'next'
import { frequencies } from '@/lib/frequencies'
import { collectionSchema, breadcrumbSchema, faqSchema } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Frequency Library — 23 Therapeutic Frequencies for Healing',
  description: 'Explore 23 science-backed therapeutic frequencies: 432 Hz for anxiety, 528 Hz for DNA repair, 40 Hz gamma for focus, delta waves for sleep, and solfeggio frequencies. Free sessions available.',
  keywords: [
    'healing frequencies',
    'healing frequencies list',
    'solfeggio frequencies',
    'binaural beats frequencies',
    'therapeutic frequencies',
    '432 Hz',
    '528 Hz',
    '40 Hz gamma',
    'frequency therapy library',
  ],
  openGraph: {
    title: 'Frequency Library — 23 Therapeutic Healing Frequencies',
    description: 'Browse all therapeutic frequencies: 432 Hz anxiety relief, 528 Hz DNA repair, 40 Hz gamma focus, delta sleep waves, and more. Research-backed, free to try.',
    url: 'https://freqtherapy.com/frequencies',
    type: 'website',
  },
  alternates: {
    canonical: 'https://freqtherapy.com/frequencies',
  },
}

export default function FrequenciesLayout({ children }: { children: React.ReactNode }) {
  const schemas = [
    collectionSchema({
      name: 'FreqTherapy Frequency Library',
      description: '23 science-backed therapeutic frequencies for healing, sleep, focus, anxiety relief, and pain management.',
      url: 'https://freqtherapy.com/frequencies',
      itemCount: frequencies.length,
    }),
    breadcrumbSchema([
      { name: 'Home', url: 'https://freqtherapy.com' },
      { name: 'Frequencies', url: 'https://freqtherapy.com/frequencies' },
    ]),
    faqSchema([
      {
        q: 'What are healing frequencies?',
        a: 'Healing frequencies are specific sound tones (measured in Hz) that research suggests can influence brainwave patterns through a process called brainwave entrainment. Different frequencies target different states — delta waves (1-4 Hz) promote deep sleep, theta waves (4-8 Hz) aid meditation, alpha waves (8-14 Hz) enhance relaxation, and gamma waves (30-100 Hz) support focus and cognition.',
      },
      {
        q: 'What is the difference between binaural beats and solfeggio frequencies?',
        a: 'Binaural beats play two slightly different tones in each ear, creating a perceived frequency difference that encourages brainwave entrainment. Solfeggio frequencies are specific single tones (174 Hz, 396 Hz, 432 Hz, 528 Hz, etc.) from an ancient musical scale believed to have therapeutic properties. FreqTherapy uses both approaches depending on the target frequency.',
      },
      {
        q: 'Which frequency is best for anxiety?',
        a: '432 Hz is the most researched frequency for anxiety relief. Studies suggest it activates the parasympathetic nervous system and reduces cortisol. FreqTherapy offers a free 432 Hz Anxiety Liberation session with guided breathing.',
      },
      {
        q: 'Are frequency therapy sessions free?',
        a: 'FreqTherapy offers 2 frequencies completely free with 5-minute preview sessions. No account required. Full access to all 23 frequencies with unlimited session length starts at $10/month (annual plan).',
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
