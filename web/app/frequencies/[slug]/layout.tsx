import { Metadata } from 'next'
import { frequencies } from '@/lib/frequencies'
import { generateFrequencyMetadata } from '@/lib/medicalMetadata'
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/seo'

// Generate static params for all frequencies — enables SSG
export async function generateStaticParams() {
  return frequencies.map((freq) => ({ slug: freq.slug }))
}

// Dynamic metadata per frequency — each page gets unique title, description, OG
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const freq = frequencies.find((f) => f.slug === slug)
  if (!freq) {
    return { title: 'Frequency Not Found' }
  }
  return generateFrequencyMetadata(freq)
}

export default async function FrequencyArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const freq = frequencies.find((f) => f.slug === slug)

  // Build structured data for this frequency
  const schemas: object[] = []

  if (freq) {
    // Article schema
    schemas.push(
      articleSchema({
        title: `${freq.hz_value} Hz ${freq.name} — Science, Benefits & Free Session`,
        description: freq.description,
        url: `https://freqtherapy.com/frequencies/${freq.slug}`,
        datePublished: '2025-01-15',
        dateModified: '2026-03-01',
      })
    )

    // FAQ schema — generates rich snippets in Google
    const faqs = [
      {
        q: `What is ${freq.hz_value} Hz frequency used for?`,
        a: `The ${freq.hz_value} Hz frequency (${freq.name}) is used for ${freq.best_for.slice(0, 3).join(', ').toLowerCase()}. ${freq.description}`,
      },
      {
        q: `Is ${freq.hz_value} Hz safe to listen to?`,
        a: `${freq.hz_value} Hz is generally safe for most adults when used with headphones at moderate volume. ${freq.contraindications && freq.contraindications.length > 0 ? `Precautions: ${freq.contraindications.join('. ')}.` : ''} Consult a healthcare provider if you have medical conditions.`,
      },
      {
        q: `How long should I listen to ${freq.hz_value} Hz?`,
        a: `${freq.dosage || `We recommend ${freq.duration_minutes}-minute sessions daily for best results. Use quality headphones and a quiet environment. Consistent daily use for 2+ weeks produces the most noticeable effects.`}`,
      },
      {
        q: `What are the benefits of ${freq.hz_value} Hz frequency?`,
        a: `Research-associated benefits of ${freq.hz_value} Hz include: ${freq.benefits.join(', ').toLowerCase()}.`,
      },
      {
        q: `Can I listen to ${freq.hz_value} Hz for free?`,
        a: freq.tier === 'free'
          ? `Yes! ${freq.hz_value} Hz ${freq.name} is available free on FreqTherapy with 5-minute preview sessions. No account required.`
          : `${freq.hz_value} Hz ${freq.name} is a premium frequency. FreqTherapy offers 2 free frequencies to try, with full access starting at $5.75/month (annual plan).`,
      },
    ]
    schemas.push(faqSchema(faqs))

    // Breadcrumb schema
    schemas.push(
      breadcrumbSchema([
        { name: 'Home', url: 'https://freqtherapy.com' },
        { name: 'Frequencies', url: 'https://freqtherapy.com/frequencies' },
        { name: `${freq.hz_value} Hz ${freq.name}`, url: `https://freqtherapy.com/frequencies/${freq.slug}` },
      ])
    )
  }

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
