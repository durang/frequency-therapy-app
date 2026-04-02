import { Frequency } from '@/types'
import { frequencies, searchFrequencies, getFrequenciesByCategory, getFrequenciesByTier } from './frequencies'

export interface FilterState {
  category: string | null
  tier: string | null
  searchQuery: string
  sortBy: 'name' | 'hz_value' | 'tier' | 'duration_minutes'
  sortOrder: 'asc' | 'desc'
}

export interface FilterOptions {
  includeLockedTiers?: boolean
  userTier?: string
  maxResults?: number
}

// Enhanced filtering with multiple criteria
export const filterFrequencies = (
  filterState: FilterState,
  options: FilterOptions = {}
): Frequency[] => {
  const {
    category,
    tier,
    searchQuery,
    sortBy = 'name',
    sortOrder = 'asc'
  } = filterState
  
  const {
    includeLockedTiers = true,
    userTier = 'free',
    maxResults
  } = options

  let filtered = [...frequencies]

  // Apply search filter first (most selective)
  if (searchQuery.trim()) {
    filtered = searchFrequencies(searchQuery.trim())
    console.log('🔍 [PanelFilters] Search filtered to', filtered.length, 'results')
  }

  // Apply category filter
  if (category && category !== 'all') {
    filtered = filtered.filter(freq => freq.category === category)
    console.log('🏷️ [PanelFilters] Category filtered to', filtered.length, 'results')
  }

  // Apply tier filter
  if (tier && tier !== 'all') {
    filtered = filtered.filter(freq => freq.tier === tier)
    console.log('🎫 [PanelFilters] Tier filtered to', filtered.length, 'results')
  }

  // Filter by user access if requested
  if (!includeLockedTiers) {
    const tierHierarchy = ['free', 'basic', 'pro', 'clinical']
    const userTierIndex = tierHierarchy.indexOf(userTier)
    
    if (userTierIndex >= 0) {
      const accessibleTiers = tierHierarchy.slice(0, userTierIndex + 1)
      filtered = filtered.filter(freq => accessibleTiers.includes(freq.tier))
      console.log('🔒 [PanelFilters] Access filtered to', filtered.length, 'results')
    }
  }

  // Apply sorting
  filtered = sortFrequencies(filtered, sortBy, sortOrder)

  // Apply result limit
  if (maxResults && maxResults > 0) {
    filtered = filtered.slice(0, maxResults)
    console.log('📊 [PanelFilters] Limited to', filtered.length, 'results')
  }

  return filtered
}

// Advanced sorting function
export const sortFrequencies = (
  frequencies: Frequency[],
  sortBy: FilterState['sortBy'],
  sortOrder: FilterState['sortOrder']
): Frequency[] => {
  const sorted = [...frequencies].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'hz_value':
        aValue = a.hz_value
        bValue = b.hz_value
        break
      case 'tier':
        const tierOrder = { free: 0, basic: 1, pro: 2, clinical: 3 }
        aValue = tierOrder[a.tier]
        bValue = tierOrder[b.tier]
        break
      case 'duration_minutes':
        aValue = a.duration_minutes
        bValue = b.duration_minutes
        break
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
    }

    // Handle comparison
    let comparison = 0
    if (aValue < bValue) comparison = -1
    else if (aValue > bValue) comparison = 1

    return sortOrder === 'desc' ? -comparison : comparison
  })

  console.log('🔄 [PanelFilters] Sorted by', sortBy, sortOrder)
  return sorted
}

// Get filter suggestions based on current state
export const getFilterSuggestions = (
  currentFilters: FilterState,
  availableFrequencies: Frequency[] = frequencies
): {
  categories: Array<{ id: string; name: string; count: number }>
  tiers: Array<{ id: string; name: string; count: number }>
  popularSearches: string[]
} => {
  // Get category counts
  const categoryCounts = availableFrequencies.reduce((acc, freq) => {
    acc[freq.category] = (acc[freq.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categories = Object.entries(categoryCounts).map(([id, count]) => ({
    id,
    name: getCategoryDisplayName(id),
    count
  }))

  // Get tier counts
  const tierCounts = availableFrequencies.reduce((acc, freq) => {
    acc[freq.tier] = (acc[freq.tier] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const tiers = Object.entries(tierCounts).map(([id, count]) => ({
    id,
    name: getTierDisplayName(id),
    count
  }))

  // Popular search terms (could be enhanced with analytics)
  const popularSearches = [
    'DNA',
    'sleep',
    'anxiety',
    'pain',
    'focus',
    'healing',
    'meditation',
    'stress',
    'energy',
    'immune'
  ]

  return {
    categories: categories.sort((a, b) => b.count - a.count),
    tiers: tiers.sort((a, b) => b.count - a.count),
    popularSearches
  }
}

// Validate filter state
export const validateFilterState = (filterState: Partial<FilterState>): FilterState => {
  const validSortFields = ['name', 'hz_value', 'tier', 'duration_minutes']
  const validSortOrders = ['asc', 'desc']

  return {
    category: filterState.category || null,
    tier: filterState.tier || null,
    searchQuery: filterState.searchQuery || '',
    sortBy: validSortFields.includes(filterState.sortBy || '') 
      ? (filterState.sortBy as FilterState['sortBy']) 
      : 'name',
    sortOrder: validSortOrders.includes(filterState.sortOrder || '') 
      ? (filterState.sortOrder as FilterState['sortOrder']) 
      : 'asc'
  }
}

// Get user-accessible frequencies
export const getUserAccessibleFrequencies = (userTier: string): Frequency[] => {
  const tierHierarchy = ['free', 'basic', 'pro', 'clinical']
  const userTierIndex = tierHierarchy.indexOf(userTier)
  
  if (userTierIndex < 0) return getFrequenciesByTier('free')
  
  const accessibleTiers = tierHierarchy.slice(0, userTierIndex + 1)
  return frequencies.filter(freq => accessibleTiers.includes(freq.tier))
}

// Get tier upgrade suggestions
export const getTierUpgradeSuggestions = (
  currentTier: string,
  desiredFrequency?: Frequency
): {
  requiredTier: string
  lockedFrequencies: number
  benefits: string[]
} | null => {
  const tierHierarchy = ['free', 'basic', 'pro', 'clinical']
  const currentIndex = tierHierarchy.indexOf(currentTier)
  
  if (currentIndex < 0) return null
  
  // If a specific frequency is desired
  if (desiredFrequency) {
    const requiredIndex = tierHierarchy.indexOf(desiredFrequency.tier)
    if (requiredIndex <= currentIndex) return null
    
    const requiredTier = tierHierarchy[requiredIndex]
    const lockedFrequencies = frequencies.filter(freq => {
      const freqIndex = tierHierarchy.indexOf(freq.tier)
      return freqIndex > currentIndex
    }).length
    
    return {
      requiredTier,
      lockedFrequencies,
      benefits: getTierBenefits(requiredTier)
    }
  }
  
  // General upgrade suggestion
  const nextTierIndex = currentIndex + 1
  if (nextTierIndex >= tierHierarchy.length) return null
  
  const nextTier = tierHierarchy[nextTierIndex]
  const additionalFrequencies = frequencies.filter(freq => freq.tier === nextTier).length
  
  return {
    requiredTier: nextTier,
    lockedFrequencies: additionalFrequencies,
    benefits: getTierBenefits(nextTier)
  }
}

// Utility functions
const getCategoryDisplayName = (categoryId: string): string => {
  const categoryNames: Record<string, string> = {
    dna_repair: 'Love Frequency',
    anxiety_relief: 'Anxiety Relief',
    cognitive_enhancement: 'Focus & Cognition',
    sleep_optimization: 'Sleep & Recovery',
    pain_management: 'Pain Relief',
    immune_enhancement: 'Immune System',
    anti_aging: 'Anti-Aging',
    cardiovascular: 'Heart Health',
    mood_enhancement: 'Mood & Wellness',
    cellular_energy: 'Energy & Vitality',
    neural_repair: 'Neural Recovery',
    grounding: 'Grounding',
    neurotransmitter_optimization: 'Neurotransmitter',
    relaxation: 'Relaxation',
    vascular_health: 'Vascular Health',
    metabolic_enhancement: 'Metabolism',
    hormonal_balance: 'Hormone Balance',
    regenerative_medicine: 'Regenerative Medicine',
    epigenetic_therapy: 'Genetic Therapy',
    quantum_medicine: 'Advanced Wellness'
  }
  
  return categoryNames[categoryId] || categoryId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getTierDisplayName = (tierId: string): string => {
  const tierNames: Record<string, string> = {
    free: 'Free',
    basic: 'Basic',
    pro: 'Pro',
    clinical: 'Clinical'
  }
  
  return tierNames[tierId] || tierId.charAt(0).toUpperCase() + tierId.slice(1)
}

const getTierBenefits = (tier: string): string[] => {
  const tierBenefits: Record<string, string[]> = {
    basic: [
      'Advanced therapeutic frequencies',
      'Pain management protocols',
      'Neurotransmitter optimization',
      'Enhanced sleep algorithms'
    ],
    pro: [
      'Clinical-grade frequencies',
      'Neural regeneration protocols',
      'Immune system optimization',
      'Anti-aging therapies',
      'Hormone balance frequencies'
    ],
    clinical: [
      'Medical-grade protocols',
      'Stem cell activation',
      'Genetic expression optimization',
      'Quantum coherence fields',
      'Professional monitoring'
    ]
  }
  
  return tierBenefits[tier] || []
}

// Analytics and insights
export const getFilterAnalytics = (filterState: FilterState, results: Frequency[]): {
  efficiency: number
  suggestions: string[]
  trends: Record<string, number>
} => {
  const totalFrequencies = frequencies.length
  const efficiency = results.length / totalFrequencies
  
  const suggestions: string[] = []
  
  // Suggest removing filters if results are too few
  if (results.length < 3 && (filterState.category || filterState.tier || filterState.searchQuery)) {
    suggestions.push('Try removing some filters to see more results')
  }
  
  // Suggest adding filters if results are too many
  if (results.length > 15 && !filterState.category && !filterState.tier) {
    suggestions.push('Use category or tier filters to narrow down results')
  }
  
  // Category popularity trends
  const categoryTrends = results.reduce((acc, freq) => {
    acc[freq.category] = (acc[freq.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return {
    efficiency: Math.round(efficiency * 100) / 100,
    suggestions,
    trends: categoryTrends
  }
}

// Export default filter state
export const defaultFilterState: FilterState = {
  category: null,
  tier: null,
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc'
}