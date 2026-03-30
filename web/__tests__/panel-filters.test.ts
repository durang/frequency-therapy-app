/**
 * Panel Filters Tests
 * Tests frequency library filtering, sorting, and tier access
 */
import {
  filterFrequencies,
  validateFilterState,
  getUserAccessibleFrequencies,
  defaultFilterState,
  FilterState,
} from '@/lib/panelFilters'
import { frequencies } from '@/lib/frequencies'

describe('Panel Filters', () => {
  describe('filterFrequencies', () => {
    test('returns all frequencies with default filter state', () => {
      const result = filterFrequencies(defaultFilterState)
      expect(result.length).toBe(frequencies.length)
    })

    test('filters by category', () => {
      const filterState: FilterState = { ...defaultFilterState, category: 'relaxation' }
      const result = filterFrequencies(filterState)
      expect(result.length).toBeGreaterThan(0)
      result.forEach(f => {
        expect(f.category).toBe('relaxation')
      })
    })

    test('filters by search query', () => {
      // Find a term that exists in some frequency name
      const firstFreq = frequencies[0]
      const searchTerm = firstFreq.name.split(' ')[0].toLowerCase()
      const filterState: FilterState = { ...defaultFilterState, searchQuery: searchTerm }
      const result = filterFrequencies(filterState)
      expect(result.length).toBeGreaterThan(0)
    })

    test('returns empty for non-matching search', () => {
      const filterState: FilterState = { ...defaultFilterState, searchQuery: 'xyznonexistent999' }
      const result = filterFrequencies(filterState)
      expect(result).toHaveLength(0)
    })

    test('filters by tier', () => {
      const filterState: FilterState = { ...defaultFilterState, tier: 'free' }
      const result = filterFrequencies(filterState)
      result.forEach(f => {
        expect(f.tier).toBe('free')
      })
    })
  })

  describe('validateFilterState', () => {
    test('returns valid state for empty input', () => {
      const result = validateFilterState({})
      expect(result).toHaveProperty('searchQuery')
      expect(result).toHaveProperty('category')
      expect(result).toHaveProperty('sortBy')
      expect(result).toHaveProperty('sortOrder')
    })

    test('preserves valid filter values', () => {
      const result = validateFilterState({ searchQuery: 'test', category: 'relaxation' })
      expect(result.searchQuery).toBe('test')
      expect(result.category).toBe('relaxation')
    })

    test('defaults sortBy to name', () => {
      const result = validateFilterState({})
      expect(result.sortBy).toBe('name')
    })

    test('defaults sortOrder to asc', () => {
      const result = validateFilterState({})
      expect(result.sortOrder).toBe('asc')
    })
  })

  describe('getUserAccessibleFrequencies', () => {
    test('free tier returns some frequencies', () => {
      const result = getUserAccessibleFrequencies('free')
      expect(result.length).toBeGreaterThan(0)
      result.forEach(f => {
        expect(f.tier).toBe('free')
      })
    })

    test('clinical tier returns all frequencies', () => {
      const result = getUserAccessibleFrequencies('clinical')
      expect(result.length).toBe(frequencies.length)
    })

    test('higher tiers return more frequencies', () => {
      const free = getUserAccessibleFrequencies('free')
      const pro = getUserAccessibleFrequencies('pro')
      expect(pro.length).toBeGreaterThanOrEqual(free.length)
    })
  })

  describe('defaultFilterState', () => {
    test('has expected default values', () => {
      expect(defaultFilterState.category).toBeNull()
      expect(defaultFilterState.tier).toBeNull()
      expect(defaultFilterState.searchQuery).toBe('')
      expect(defaultFilterState.sortBy).toBe('name')
      expect(defaultFilterState.sortOrder).toBe('asc')
    })
  })
})
