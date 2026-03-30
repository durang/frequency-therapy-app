/**
 * Frequency Objectives Verification — Updated for M002
 * Tests that frequency data is properly structured and available
 */
import { frequencies } from '@/lib/frequencies'

describe('Frequency Library Data', () => {
  test('frequencies array is populated', () => {
    expect(frequencies.length).toBeGreaterThan(0)
  })

  test('each frequency has required fields', () => {
    frequencies.forEach(freq => {
      expect(freq).toHaveProperty('id')
      expect(freq).toHaveProperty('name')
      expect(freq).toHaveProperty('hz_value')
      expect(freq).toHaveProperty('category')
      expect(typeof freq.hz_value).toBe('number')
      expect(freq.hz_value).toBeGreaterThan(0)
    })
  })

  test('frequencies have unique IDs', () => {
    const ids = frequencies.map(f => f.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  test('frequencies cover multiple categories', () => {
    const categories = new Set(frequencies.map(f => f.category))
    expect(categories.size).toBeGreaterThanOrEqual(3)
  })

  test('each frequency has valid Hz range (0.1-20000)', () => {
    frequencies.forEach(freq => {
      expect(freq.hz_value).toBeGreaterThanOrEqual(0.1)
      expect(freq.hz_value).toBeLessThanOrEqual(20000)
    })
  })
})
