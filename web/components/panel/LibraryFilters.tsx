'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/authState'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FunnelIcon, 
  XMarkIcon, 
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline'

interface LibraryFiltersProps {
  selectedCategory: string | null
  selectedTier: string | null
  searchQuery: string
  onCategoryChange: (category: string | null) => void
  onTierChange: (tier: string | null) => void
  onSearchChange: (query: string) => void
  onClearFilters: () => void
  className?: string
}

const categories = [
  { id: 'all', name: 'All Categories', icon: '🎵', count: 20 },
  { id: 'dna_repair', name: 'DNA Repair', icon: '🧬', count: 1 },
  { id: 'anxiety_relief', name: 'Anxiety Relief', icon: '😌', count: 2 },
  { id: 'cognitive_enhancement', name: 'Focus & Cognition', icon: '🧠', count: 2 },
  { id: 'sleep_optimization', name: 'Sleep & Recovery', icon: '😴', count: 2 },
  { id: 'pain_management', name: 'Pain Relief', icon: '💚', count: 1 },
  { id: 'immune_enhancement', name: 'Immune System', icon: '🛡️', count: 1 },
  { id: 'anti_aging', name: 'Anti-Aging', icon: '✨', count: 2 },
  { id: 'cardiovascular', name: 'Heart Health', icon: '❤️', count: 1 },
  { id: 'mood_enhancement', name: 'Mood & Wellness', icon: '🌟', count: 2 },
  { id: 'cellular_energy', name: 'Energy & Vitality', icon: '⚡', count: 2 },
  { id: 'neural_repair', name: 'Neural Recovery', icon: '🔬', count: 1 },
  { id: 'grounding', name: 'Grounding', icon: '🌍', count: 1 }
]

const tiers = [
  { id: 'all', name: 'All Tiers', description: 'Show all frequencies', color: 'bg-gray-500/20 text-gray-300', count: 20 },
  { id: 'free', name: 'Free', description: 'Available to all users', color: 'bg-green-500/20 text-green-300', count: 5 },
  { id: 'basic', name: 'Basic', description: 'Requires Basic plan', color: 'bg-blue-500/20 text-blue-300', count: 5 },
  { id: 'pro', name: 'Pro', description: 'Requires Pro plan', color: 'bg-purple-500/20 text-purple-300', count: 5 },
  { id: 'clinical', name: 'Clinical', description: 'Medical supervision required', color: 'bg-red-500/20 text-red-300', count: 5 }
]

export function LibraryFilters({
  selectedCategory,
  selectedTier,
  searchQuery,
  onCategoryChange,
  onTierChange,
  onSearchChange,
  onClearFilters,
  className = ''
}: LibraryFiltersProps) {
  const { user, hasSubscriptionTier } = useAuth()
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== null || selectedTier !== null || searchQuery.trim() !== ''
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    const newCategory = categoryId === 'all' ? null : categoryId
    onCategoryChange(newCategory)
    console.log('🏷️ [LibraryFilters] Category filter:', newCategory || 'all')
  }
  
  // Handle tier selection with access validation
  const handleTierSelect = (tierId: string) => {
    const newTier = tierId === 'all' ? null : tierId
    onTierChange(newTier)
    console.log('🎫 [LibraryFilters] Tier filter:', newTier || 'all')
  }
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    onSearchChange(query)
    console.log('🔍 [LibraryFilters] Search query:', query)
  }
  
  // Clear all filters
  const handleClearAll = () => {
    onClearFilters()
    setShowAdvanced(false)
    console.log('🧹 [LibraryFilters] All filters cleared')
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
        <input
          type="text"
          placeholder="Search frequencies, benefits, or conditions..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-quantum-400 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Quick Category Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Categories</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-1 text-xs text-white/60 hover:text-white/80"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            <span>{showAdvanced ? 'Less' : 'More'} Filters</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`
                flex items-center space-x-2 p-2 rounded-lg transition-all text-left text-sm
                ${(selectedCategory === category.id || (!selectedCategory && category.id === 'all'))
                  ? 'bg-quantum-500/20 border border-quantum-400/50 text-quantum-300'
                  : 'bg-black/10 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }
              `}
            >
              <span>{category.icon}</span>
              <span className="flex-1 truncate">{category.name}</span>
              <Badge variant="outline" className="text-xs">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>
      
      {/* Advanced Filters */}
      {showAdvanced && (
        <Card variant="glass" className="p-4 space-y-4">
          {/* All Categories */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">All Categories</h4>
            <div className="grid grid-cols-1 gap-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`
                    flex items-center justify-between p-2 rounded text-left text-sm transition-all
                    ${(selectedCategory === category.id || (!selectedCategory && category.id === 'all'))
                      ? 'bg-quantum-500/20 text-quantum-300'
                      : 'text-white/70 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tier Filters */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Subscription Tiers</h4>
            <div className="space-y-1">
              {tiers.map((tier) => {
                const hasAccess = tier.id === 'all' || hasSubscriptionTier(tier.id as any)
                const isSelected = selectedTier === tier.id || (!selectedTier && tier.id === 'all')
                
                return (
                  <button
                    key={tier.id}
                    onClick={() => handleTierSelect(tier.id)}
                    disabled={!hasAccess && tier.id !== 'all'}
                    className={`
                      w-full flex items-center justify-between p-2 rounded text-left text-sm transition-all
                      ${isSelected
                        ? 'bg-quantum-500/20 text-quantum-300'
                        : hasAccess 
                          ? 'text-white/70 hover:bg-white/10'
                          : 'text-white/30 opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge className={tier.color}>
                          {tier.name}
                        </Badge>
                        {!hasAccess && tier.id !== 'all' && (
                          <span className="text-xs text-amber-400">Upgrade Required</span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 mt-1">{tier.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tier.count}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>
        </Card>
      )}
      
      {/* Active Filters & Clear */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-3 bg-black/20 border border-white/10 rounded-lg">
          <div className="flex items-center space-x-2 flex-1">
            <FunnelIcon className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">Active filters:</span>
            
            <div className="flex items-center space-x-2 flex-wrap">
              {selectedCategory && (
                <Badge variant="secondary" className="text-xs">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </Badge>
              )}
              {selectedTier && (
                <Badge variant="secondary" className="text-xs">
                  {tiers.find(t => t.id === selectedTier)?.name} Tier
                </Badge>
              )}
              {searchQuery.trim() && (
                <Badge variant="secondary" className="text-xs">
                  "{searchQuery.trim()}"
                </Badge>
              )}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}