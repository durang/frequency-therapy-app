import { MetadataRoute } from 'next'
import { frequencies } from '@/lib/frequencies'
import { protocols } from '@/lib/protocols'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://freqtherapy.com'
  const now = new Date().toISOString()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/frequencies`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/protocols`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Dynamic frequency pages — high priority, these are our pillar content
  const frequencyPages: MetadataRoute.Sitemap = frequencies.map((freq) => ({
    url: `${baseUrl}/frequencies/${freq.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // Dynamic protocol pages
  const protocolPages: MetadataRoute.Sitemap = protocols.map((protocol) => ({
    url: `${baseUrl}/protocols/${protocol.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...frequencyPages, ...protocolPages]
}
