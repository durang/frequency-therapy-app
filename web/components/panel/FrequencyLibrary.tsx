'use client'

import { useState, useEffect } from 'react'
import { usePanel } from '@/lib/panelState'
import { frequencies, getFrequenciesByCategory, searchFrequencies } from '@/lib/frequencies'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon, PlayIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Frequency } from '@/types'

const categories = [
  { id: 'all', name: 'All Frequencies', icon: '🎵' },
  { id: 'dna_repair', name: 'DNA Repair', icon: '🧬' },
  { id: 'anxiety_relief', name: 'Anxiety Relief', icon: '😌' },
  { id: 'cognitive_enhancement', name: 'Focus', icon: '🧠' },
  { id: 'sleep_optimization', name: 'Sleep', icon: '😴' },
  { id: 'pain_management', name: 'Pain Relief', icon: '💚' },
  { id: 'immune_enhancement', name: 'Immune', icon: '🛡️' },
  { id: 'anti_aging', name: 'Anti-Aging', icon: '✨' }
]

export function FrequencyLibrary() {
  const { 
    selectedCategory, 
    searchQuery, 
    setSelectedCategory, 
    setSearchQuery, 
    activateFrequency,
    isFrequencyActive 
  } = usePanel()
  
  const [filteredFrequencies, setFilteredFrequencies] = useState<Frequency[]>(frequencies)

  // Filter frequencies based on category and search
  useEffect(() => {
    let filtered = frequencies

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = getFrequenciesByCategory(selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = searchFrequencies(searchQuery).filter(freq => 
        !selectedCategory || selectedCategory === 'all' || freq.category === selectedCategory
      )
    }

    setFilteredFrequencies(filtered)
    console.log('📚 [FrequencyLibrary] Filtered to', filtered.length, 'frequencies')
  }, [selectedCategory, searchQuery])

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === 'all' ? null : categoryId)
    console.log('📚 [FrequencyLibrary] Category selected:', categoryId)
  }

  const handleFrequencySelect = (frequency: Frequency) => {
    activateFrequency(frequency)
    console.log('📚 [FrequencyLibrary] Frequency selected for DJ panel:', frequency.name)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Library Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Frequency Library</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search frequencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-quantum-400 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`
                w-full flex items-center space-x-3 p-2 rounded-lg transition-all text-left
                ${(selectedCategory === category.id || (!selectedCategory && category.id === 'all'))
                  ? 'bg-quantum-500/20 border border-quantum-400/50 text-quantum-300'
                  : 'bg-black/10 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }
              `}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Frequency List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredFrequencies.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No frequencies found</p>
            {searchQuery && (
              <p className="text-sm mt-2">Try adjusting your search</p>
            )}
          </div>
        ) : (
          filteredFrequencies.map((frequency) => {
            const isActive = isFrequencyActive(frequency.id)
            
            return (
              <Card
                key={frequency.id}
                variant="glass"
                className={`
                  cursor-pointer transition-all duration-200 hover:scale-[1.02]
                  ${isActive ? 'ring-2 ring-quantum-400 bg-quantum-500/10' : ''}
                `}
                onClick={() => handleFrequencySelect(frequency)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-white">
                        {frequency.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-quantum-400 font-mono text-xs">
                          {frequency.hz_value} Hz
                        </span>
                        <span className="text-xs px-2 py-1 bg-white/10 rounded text-white/70 capitalize">
                          {frequency.tier}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant={isActive ? 'quantum' : 'outline'}
                      size="sm"
                      className="p-1.5"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFrequencySelect(frequency)
                      }}
                    >
                      {isActive ? <PlayIcon className="w-3 h-3" /> : <PlusIcon className="w-3 h-3" />}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-white/60 line-clamp-2">
                    {frequency.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {frequency.best_for.slice(0, 2).map((use, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-neural-500/20 text-neural-300 rounded"
                      >
                        {use}
                      </span>
                    ))}
                    {frequency.best_for.length > 2 && (
                      <span className="text-xs text-white/50">
                        +{frequency.best_for.length - 2} more
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Library Stats */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white/50 text-center">
          Showing {filteredFrequencies.length} of {frequencies.length} frequencies
        </div>
      </div>
    </div>
  )
}