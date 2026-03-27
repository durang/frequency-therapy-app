'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePanel } from '@/lib/panelState'
import { useAuth } from '@/lib/authState'
import { frequencies } from '@/lib/frequencies'
import { 
  filterFrequencies, 
  FilterState, 
  defaultFilterState,
  getFilterAnalytics,
  getTierUpgradeSuggestions 
} from '@/lib/panelFilters'
import { FrequencyCard } from './FrequencyCard'
import { LibraryFilters } from './LibraryFilters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Frequency } from '@/types'
import { 
  MagnifyingGlassIcon, 
  ExclamationTriangleIcon,
  SparklesIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'

interface FrequencyLibraryProps {
  demoMode?: boolean
}

export function FrequencyLibrary({ demoMode = false }: FrequencyLibraryProps) {
  const { user, hasSubscriptionTier } = useAuth()
  const { activateFrequency, isFrequencyActive } = usePanel()
  
  // Filter state management
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState)
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency | null>(null)
  
  // Derived state using useMemo for performance
  const filteredFrequencies = useMemo(() => {
    return filterFrequencies(filterState, {
      includeLockedTiers: true, // Show locked frequencies with upgrade prompts
      userTier: user?.subscription_tier || 'free'
    })
  }, [filterState, user?.subscription_tier])
  
  const filterAnalytics = useMemo(() => {
    return getFilterAnalytics(filterState, filteredFrequencies)
  }, [filterState, filteredFrequencies])
  
  const upgradeInfo = useMemo(() => {
    if (!user) return null
    return getTierUpgradeSuggestions(user.subscription_tier || 'free', selectedFrequency || undefined)
  }, [user?.subscription_tier, selectedFrequency])
  
  // Update panel state when filters change
  useEffect(() => {
    console.log('📚 [FrequencyLibrary] Filters updated:', {
      category: filterState.category,
      tier: filterState.tier,
      searchQuery: filterState.searchQuery,
      resultsCount: filteredFrequencies.length
    })
  }, [filterState, filteredFrequencies.length])
  
  // Filter change handlers
  const handleCategoryChange = (category: string | null) => {
    setFilterState(prev => ({ ...prev, category }))
  }
  
  const handleTierChange = (tier: string | null) => {
    setFilterState(prev => ({ ...prev, tier }))
  }
  
  const handleSearchChange = (searchQuery: string) => {
    setFilterState(prev => ({ ...prev, searchQuery }))
  }
  
  const handleClearFilters = () => {
    setFilterState(defaultFilterState)
    setSelectedFrequency(null)
  }
  
  // Frequency selection with enhanced logging
  const handleFrequencySelect = (frequency: Frequency) => {
    setSelectedFrequency(frequency)
    
    // Check access and log accordingly
    if (!user) {
      console.log('🔒 [FrequencyLibrary] Access denied: Authentication required for', frequency.name)
      return
    }
    
    if (!hasSubscriptionTier(frequency.tier)) {
      console.log('🔒 [FrequencyLibrary] Access denied: Insufficient tier for', frequency.name, 'requires', frequency.tier, 'user has', user.subscription_tier)
      return
    }
    
    activateFrequency(frequency)
    console.log('✅ [FrequencyLibrary] Frequency activated:', frequency.name, frequency.hz_value + 'Hz')
  }
  
  // Show frequency details (could open modal in future)
  const handleShowDetails = (frequency: Frequency) => {
    setSelectedFrequency(frequency)
    console.log('ℹ️ [FrequencyLibrary] Showing details for:', frequency.name)
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Library Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Frequency Library</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {filteredFrequencies.length} of {frequencies.length}
            </Badge>
            {filterAnalytics.efficiency < 0.3 && (
              <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-300">
                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                Filtered
              </Badge>
            )}
          </div>
        </div>
        
        {/* Filters Component */}
        <LibraryFilters
          selectedCategory={filterState.category}
          selectedTier={filterState.tier}
          searchQuery={filterState.searchQuery}
          onCategoryChange={handleCategoryChange}
          onTierChange={handleTierChange}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
        />
        
        {/* Filter Analytics & Suggestions */}
        {filterAnalytics.suggestions.length > 0 && (
          <div className="mt-3 p-2 bg-blue-500/10 border border-blue-400/20 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-300 text-xs">
              <SparklesIcon className="w-3 h-3" />
              <span>{filterAnalytics.suggestions[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Frequency Grid */}
      <div className="flex-1 overflow-y-auto">
        {/* Results Summary */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-white/60">
              <div className="flex items-center space-x-1">
                <ChartBarIcon className="w-4 h-4" />
                <span>Showing {filteredFrequencies.length} frequencies</span>
              </div>
              {filterState.searchQuery && (
                <span>for "{filterState.searchQuery}"</span>
              )}
            </div>
            
            {user && (
              <div className="text-xs text-white/50">
                Tier: {user.subscription_tier?.charAt(0).toUpperCase()}{user.subscription_tier?.slice(1)}
              </div>
            )}
          </div>
        </div>
        
        {/* Frequency Cards */}
        <div className="p-4">
          {filteredFrequencies.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <h3 className="text-lg font-medium text-white/70 mb-2">No frequencies found</h3>
              <p className="text-sm text-white/50 mb-4">
                {filterState.searchQuery 
                  ? `No results for "${filterState.searchQuery}"`
                  : 'Try adjusting your filters'
                }
              </p>
              {(filterState.category || filterState.tier || filterState.searchQuery) && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="text-sm"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            // Frequency Grid
            <div className="grid gap-3">
              {filteredFrequencies.map((frequency) => {
                const isActive = isFrequencyActive(frequency.id)
                
                return (
                  <FrequencyCard
                    key={frequency.id}
                    frequency={frequency}
                    isActive={isActive}
                    onSelect={handleFrequencySelect}
                    onShowDetails={handleShowDetails}
                    demoMode={demoMode}
                    className="hover:shadow-lg hover:shadow-quantum-500/20"
                  />
                )
              })}
            </div>
          )}
        </div>
        
        {/* Upgrade Prompt for Locked Frequencies */}
        {upgradeInfo && user && (
          <div className="p-4 border-t border-white/10">
            <Card variant="glass" className="p-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-300 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                  Upgrade Available
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-white/70">
                  Unlock {upgradeInfo.lockedFrequencies} additional frequencies with {upgradeInfo.requiredTier} tier
                </p>
                
                <div className="space-y-1">
                  {upgradeInfo.benefits.slice(0, 3).map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-white/60">
                      <span className="w-1 h-1 bg-quantum-400 rounded-full"></span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="quantum"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    console.log('🚀 [FrequencyLibrary] Upgrade to', upgradeInfo.requiredTier, 'clicked')
                    // Would navigate to pricing/upgrade page
                  }}
                >
                  Upgrade to {upgradeInfo.requiredTier?.charAt(0).toUpperCase()}{upgradeInfo.requiredTier?.slice(1)}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Library Stats Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm font-medium text-white">{filteredFrequencies.length}</div>
            <div className="text-xs text-white/50">Available</div>
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {user ? frequencies.filter(f => hasSubscriptionTier(f.tier)).length : frequencies.filter(f => f.tier === 'free').length}
            </div>
            <div className="text-xs text-white/50">Accessible</div>
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {new Set(frequencies.map(f => f.category)).size}
            </div>
            <div className="text-xs text-white/50">Categories</div>
          </div>
        </div>
      </div>
    </div>
  )
}