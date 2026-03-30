'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { frequencies } from '@/lib/frequencies'
import { audioEngine } from '@/lib/real-audio-engine'
import { 
  Play, 
  Pause,
  ArrowLeft,
  Search,
  Filter,
  Heart,
  Brain,
  Moon,
  Sparkles,
  Waves,
  CheckCircle,
  Star
} from 'lucide-react'

const categories = [
  { id: 'all', name: 'All', icon: Star },
  { id: 'dna_repair', name: 'DNA Repair', icon: Sparkles },
  { id: 'anxiety_relief', name: 'Anxiety Relief', icon: Heart },
  { id: 'focus', name: 'Focus', icon: Brain },
  { id: 'sleep', name: 'Sleep', icon: Moon },
  { id: 'meditation', name: 'Meditation', icon: Waves }
]

export default function LibraryPage() {
  const [playingFrequency, setPlayingFrequency] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handlePlay = async (frequencyId: string) => {
    const frequency = frequencies.find(f => f.id === frequencyId)
    if (!frequency || !audioEngine) return

    if (playingFrequency === frequencyId) {
      audioEngine.stop()
      setPlayingFrequency(null)
    } else {
      audioEngine.stop()
      const success = await audioEngine.play(frequency.hz_value, 0.1)
      if (success) {
        setPlayingFrequency(frequencyId)
      } else {
        setPlayingFrequency(frequencyId)
        console.warn('Audio playback failed, but continuing with visual state')
      }
    }
  }

  const filteredFrequencies = frequencies.filter(freq => {
    const matchesCategory = selectedCategory === 'all' || freq.category === selectedCategory
    const matchesSearch = freq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freq.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[var(--surface-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--surface-overlay)] border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Frequency Library</h1>
                <p className="text-sm text-blue-600 dark:text-blue-400">{filteredFrequencies.length} frequencies available</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search frequencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Frequency Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFrequencies.map((frequency) => (
            <Card key={frequency.id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                {/* Category Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    {frequency.category === 'sleep' && <Moon className="w-6 h-6 text-white" />}
                    {frequency.category === 'focus' && <Brain className="w-6 h-6 text-white" />}
                    {frequency.category === 'meditation' && <Sparkles className="w-6 h-6 text-white" />}
                    {frequency.category === 'anxiety_relief' && <Heart className="w-6 h-6 text-white" />}
                    {frequency.category === 'dna_repair' && <Waves className="w-6 h-6 text-white" />}
                    {!['sleep', 'focus', 'meditation', 'anxiety_relief', 'dna_repair'].includes(frequency.category) && <Star className="w-6 h-6 text-white" />}
                  </div>
                  
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full font-semibold">
                    {frequency.tier || 'free'}
                  </span>
                </div>

                {/* Frequency Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {frequency.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {frequency.hz_value} Hz
                  </p>
                </div>

                {/* Description */}
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                  {frequency.description?.substring(0, 80)}...
                </p>

                {/* Play Button */}
                <button
                  onClick={() => handlePlay(frequency.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    playingFrequency === frequency.id
                      ? 'bg-slate-600 dark:bg-slate-500 hover:bg-slate-700 dark:hover:bg-slate-400 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10'
                  }`}
                >
                  {playingFrequency === frequency.id ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                {/* Benefits */}
                <div className="mt-4 space-y-1">
                  {frequency.benefits?.slice(0, 2).map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredFrequencies.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No frequencies found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try different search terms or categories.</p>
          </div>
        )}
      </div>
    </div>
  )
}
