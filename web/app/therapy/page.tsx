'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import AdvancedFrequencyPlayer from '@/components/therapy/advanced-frequency-player'
import { frequencies } from '@/lib/frequencies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import Link from 'next/link'
import { ChevronLeft, BookOpen, Star } from 'lucide-react'

function TherapyContent() {
  const searchParams = useSearchParams()
  const frequency = searchParams.get('frequency') || '1'
  const quick = searchParams.get('quick') === 'true'
  const autoStart = searchParams.get('autostart') === 'true'

  // Get related frequencies for suggestions
  const currentFreq = frequencies.find(f => f.id === frequency)
  const relatedFrequencies = frequencies
    .filter(f => f.category === currentFreq?.category && f.id !== frequency)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-[var(--surface-primary)]">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Frequency Therapy</h1>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {quick ? 'Quick Session' : 'Full Therapy Session'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/frequencies">
                <Button variant="outline" size="sm" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Browse All
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Player - Takes 2 columns */}
          <div className="lg:col-span-2">
            <AdvancedFrequencyPlayer 
              selectedFrequencyId={frequency}
              showAnalytics={true}
              autoStart={autoStart}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Info */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-slate-400">Frequency Type</span>
                  <span className="font-medium capitalize dark:text-white">
                    {currentFreq?.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-slate-400">Subscription Tier</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    currentFreq?.tier === 'free' ? 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-200' :
                    currentFreq?.tier === 'basic' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                    currentFreq?.tier === 'pro' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' :
                    'bg-gold-100 text-gold-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                  }`}>
                    {currentFreq?.tier.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-slate-400">Duration</span>
                  <span className="font-medium dark:text-white">{currentFreq?.duration_minutes} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-slate-400">Research Citations</span>
                  <span className="font-medium dark:text-white">{currentFreq?.research_citations?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Session Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-700 dark:text-slate-300">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-quantum-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Use headphones for optimal binaural beat effect</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-quantum-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Find a comfortable position and close your eyes</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-quantum-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Focus on your breath and let the frequency work</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-quantum-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Stay hydrated and avoid distractions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Frequencies */}
            {relatedFrequencies.length > 0 && (
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">Related Frequencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedFrequencies.map((freq) => (
                      <Link 
                        key={freq.id} 
                        href={`/therapy?frequency=${freq.id}${quick ? '&quick=true' : ''}`}
                        className="block p-3 rounded-lg border dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{freq.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 line-clamp-2">
                              {freq.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-quantum-primary font-medium">
                                {freq.hz_value} Hz
                              </span>
                              <span className="text-xs text-gray-500 dark:text-slate-500">•</span>
                              <span className="text-xs text-gray-500 dark:text-slate-500">
                                {freq.duration_minutes} min
                              </span>
                            </div>
                          </div>
                          <div className={`ml-3 px-2 py-1 text-xs font-medium rounded ${
                            freq.tier === 'free' ? 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-200' :
                            freq.tier === 'basic' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                            freq.tier === 'pro' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' :
                            'bg-gold-100 text-gold-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                          }`}>
                            {freq.tier}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upgrade CTA */}
            {currentFreq?.tier !== 'clinical' && (
              <Card className="bg-gradient-to-r from-quantum-primary to-quantum-secondary text-white">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 mx-auto mb-3 opacity-90" />
                  <h3 className="font-semibold mb-2">
                    Unlock More Frequencies
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    Access our complete library of {frequencies.length}+ scientifically-backed frequencies
                  </p>
                  <Link href="/pricing">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="bg-white text-blue-600 hover:bg-gray-50 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800"
                    >
                      Upgrade Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Research References */}
        {currentFreq?.research_citations && currentFreq.research_citations.length > 0 && (
          <Card className="mt-8 dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Scientific Research</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Research Citations</h4>
                  <ul className="space-y-2">
                    {currentFreq.research_citations.map((citation, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-slate-300 pl-4 relative">
                        <div className="absolute left-0 top-2 w-1.5 h-1.5 bg-quantum-primary rounded-full"></div>
                        {citation}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Scientific Note</h4>
                  <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                    All frequencies in our library are backed by peer-reviewed research or 
                    established scientific principles. We continuously update our database 
                    with the latest findings in frequency medicine and bioacoustics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function TherapyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--surface-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-quantum-primary rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Loading therapy session...</p>
        </div>
      </div>
    }>
      <TherapyContent />
    </Suspense>
  )
}