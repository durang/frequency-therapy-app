import { Metadata } from 'next'
import { protocols } from '@/lib/protocols'
import { generateProtocolMetadata } from '@/lib/medicalMetadata'
import { howToSchema, faqSchema, breadcrumbSchema } from '@/lib/seo'

export async function generateStaticParams() {
  return protocols.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const protocol = protocols.find((p) => p.slug === slug)
  if (!protocol) {
    return { title: 'Protocol Not Found' }
  }
  return generateProtocolMetadata(protocol)
}

export default async function ProtocolDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const protocol = protocols.find((p) => p.slug === slug)

  const schemas: object[] = []

  if (protocol) {
    // HowTo schema — structured steps for rich snippets
    schemas.push(
      howToSchema({
        name: `${protocol.name} — ${protocol.duration_days}-Day Program`,
        description: protocol.description,
        totalTime: `P${protocol.duration_days}D`,
        steps: protocol.phases.map((phase) => ({
          name: `Phase: ${phase.name} (Days ${phase.days})`,
          text: `${phase.description} Sessions: ${phase.sessions.map((s) => `${s.duration} min ${s.timeOfDay}`).join(', ')}.`,
        })),
      })
    )

    // FAQ schema
    const faqs = [
      {
        q: `How long is the ${protocol.name}?`,
        a: `The ${protocol.name} is a ${protocol.duration_days}-day structured program with ${protocol.phases.length} phases. Sessions range from 15-40 minutes, ${protocol.phases[0]?.sessions.length || 2} times per day.`,
      },
      {
        q: `Who is the ${protocol.name} for?`,
        a: `This protocol is designed for people experiencing ${protocol.condition.toLowerCase()}. Difficulty level: ${protocol.difficulty}.`,
      },
      {
        q: `What results can I expect from the ${protocol.name}?`,
        a: `Expected outcomes include: ${protocol.expectedOutcomes.join(', ').toLowerCase()}.`,
      },
      {
        q: `Is the ${protocol.name} safe?`,
        a: `This protocol is for wellness purposes only and is generally safe for most adults. ${protocol.contraindications.length > 0 ? `Contraindications: ${protocol.contraindications.join('. ')}.` : ''} Consult a healthcare provider before starting.`,
      },
    ]
    schemas.push(faqSchema(faqs))

    // Breadcrumb
    schemas.push(
      breadcrumbSchema([
        { name: 'Home', url: 'https://freqtherapy.com' },
        { name: 'Protocols', url: 'https://freqtherapy.com/protocols' },
        { name: protocol.name, url: `https://freqtherapy.com/protocols/${protocol.slug}` },
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
