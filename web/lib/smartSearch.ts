/**
 * Smart Search Engine for Frequency Library
 * 
 * Provides multi-field fuzzy search across all frequency attributes:
 * - Hz value (exact and range)
 * - Name, description, category
 * - Benefits, best_for, mechanism
 * - Contraindications, scientific_backing
 * 
 * Also includes intent detection to determine if user input
 * should trigger search mode or chat mode.
 */

import Fuse, { type IFuseOptions } from 'fuse.js'
import { Frequency } from '@/types'
import { frequencies } from '@/lib/frequencies'

// ─── Synonym Mappings ──────────────────────────────────────────────────
// Maps common terms (including Spanish) to frequency-relevant keywords
const SYNONYMS: Record<string, string[]> = {
  // English symptoms → frequency keywords
  headache: ['pain', 'neural', 'stress', 'anxiety'],
  migraine: ['pain', 'neural', 'stress'],
  insomnia: ['sleep', 'delta', 'relaxation', 'anxiety'],
  'cant sleep': ['sleep', 'delta', 'relaxation'],
  tired: ['energy', 'cellular', 'fatigue', 'mitochondrial'],
  fatigue: ['energy', 'cellular', 'fatigue', 'mitochondrial'],
  depression: ['mood', 'serotonin', 'dopamine', 'motivation'],
  sad: ['mood', 'serotonin', 'emotional'],
  anxious: ['anxiety', 'stress', 'cortisol', 'parasympathetic'],
  nervous: ['anxiety', 'stress', 'calm'],
  backpain: ['pain', 'tissue', 'inflammation'],
  'back pain': ['pain', 'tissue', 'inflammation'],
  inflammation: ['pain', 'tissue', 'healing'],
  arthritis: ['pain', 'inflammation', 'joint'],
  'brain fog': ['focus', 'cognitive', 'gamma', 'clarity'],
  memory: ['cognitive', 'focus', 'neural', 'memory'],
  concentration: ['focus', 'cognitive', 'gamma', 'attention'],
  aging: ['anti-aging', 'telomere', 'cellular', 'regenerative'],
  immunity: ['immune', 'enhancement', 'defense'],
  cold: ['immune', 'healing'],
  detox: ['detox', 'cleansing', 'cellular'],
  weight: ['metabolic', 'metabolism'],
  heart: ['cardiovascular', 'heart', 'circulation'],
  blood: ['vascular', 'circulation', 'cardiovascular'],
  meditation: ['grounding', 'relaxation', 'schumann'],
  zen: ['grounding', 'relaxation', 'meditation'],
  // Spanish symptoms
  dolor: ['pain', 'tissue'],
  'dolor de cabeza': ['pain', 'neural', 'stress'],
  'no puedo dormir': ['sleep', 'delta', 'relaxation'],
  dormir: ['sleep', 'delta'],
  sueño: ['sleep', 'delta', 'relaxation'],
  estres: ['anxiety', 'stress', 'cortisol'],
  estrés: ['anxiety', 'stress', 'cortisol'],
  ansiedad: ['anxiety', 'stress', 'calm'],
  cansancio: ['energy', 'fatigue', 'cellular'],
  energia: ['energy', 'cellular', 'mitochondrial'],
  energía: ['energy', 'cellular', 'mitochondrial'],
  relajacion: ['relaxation', 'calm', 'stress'],
  relajación: ['relaxation', 'calm', 'stress'],
  enfoque: ['focus', 'cognitive', 'gamma'],
  concentracion: ['focus', 'cognitive', 'gamma'],
  concentración: ['focus', 'cognitive', 'gamma'],
  tristeza: ['mood', 'serotonin', 'emotional'],
  inmunidad: ['immune', 'defense'],
  curar: ['healing', 'repair', 'regenerative'],
  sanar: ['healing', 'repair', 'regenerative'],
}

// ─── Popular Search Suggestions ────────────────────────────────────────
export const POPULAR_SEARCHES = [
  { label: 'Sleep', emoji: '😴', query: 'sleep' },
  { label: 'Focus', emoji: '🧠', query: 'focus' },
  { label: 'Pain Relief', emoji: '💆', query: 'pain' },
  { label: 'Anxiety', emoji: '🧘', query: 'anxiety' },
  { label: 'Energy', emoji: '⚡', query: 'energy' },
  { label: '528 Hz', emoji: '🧬', query: '528' },
  { label: '432 Hz', emoji: '🎵', query: '432' },
  { label: 'Healing', emoji: '💚', query: 'healing' },
]

// ─── Fuse.js Configuration ─────────────────────────────────────────────
const fuseOptions: IFuseOptions<Frequency> = {
  keys: [
    { name: 'name', weight: 0.25 },
    { name: 'description', weight: 0.15 },
    { name: 'category', weight: 0.15 },
    { name: 'benefits', weight: 0.15 },
    { name: 'best_for', weight: 0.15 },
    { name: 'mechanism', weight: 0.08 },
    { name: 'scientific_backing', weight: 0.05 },
    { name: 'slug', weight: 0.02 },
  ],
  threshold: 0.35,    // balance between strict and fuzzy
  distance: 100,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
}

const fuseIndex = new Fuse(frequencies, fuseOptions)

// ─── Search Result Type ────────────────────────────────────────────────
export interface SmartSearchResult {
  frequency: Frequency
  score: number             // 0 = perfect match, 1 = worst
  matchedFields: string[]   // which fields matched for highlighting
  matchType: 'exact_hz' | 'fuzzy' | 'synonym' | 'category'
}

// ─── Main Search Function ──────────────────────────────────────────────
export function smartSearch(query: string): SmartSearchResult[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const results: SmartSearchResult[] = []
  const seenIds = new Set<string>()

  // 1. Exact Hz match (highest priority)
  const hzMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:hz)?$/i)
  if (hzMatch) {
    const targetHz = parseFloat(hzMatch[1])
    
    // Exact matches first
    const exactMatches = frequencies.filter(f => f.hz_value === targetHz)
    exactMatches.forEach(f => {
      seenIds.add(f.id)
      results.push({
        frequency: f,
        score: 0,
        matchedFields: ['hz_value'],
        matchType: 'exact_hz',
      })
    })

    // Close Hz matches (within 10% range)
    const closeMatches = frequencies.filter(
      f => !seenIds.has(f.id) && Math.abs(f.hz_value - targetHz) / Math.max(targetHz, 1) < 0.1
    )
    closeMatches.forEach(f => {
      seenIds.add(f.id)
      results.push({
        frequency: f,
        score: 0.2,
        matchedFields: ['hz_value'],
        matchType: 'exact_hz',
      })
    })

    // If we got Hz results, also run fuzzy for any mention of the number
    if (results.length > 0) return results
  }

  // 2. Tier search
  const tierMatch = trimmed.match(/^(free|premium|basic|pro|clinical)$/i)
  if (tierMatch) {
    const tier = tierMatch[1].toLowerCase()
    const tierMap: Record<string, string> = { premium: 'basic', free: 'free', basic: 'basic', pro: 'pro', clinical: 'clinical' }
    const mappedTier = tierMap[tier] || tier
    
    frequencies
      .filter(f => f.tier === mappedTier)
      .forEach(f => {
        results.push({
          frequency: f,
          score: 0.1,
          matchedFields: ['tier'],
          matchType: 'category',
        })
      })
    
    if (results.length > 0) return results
  }

  // 3. Synonym expansion
  const lowerQuery = trimmed.toLowerCase()
  const synonymTerms = SYNONYMS[lowerQuery]
  if (synonymTerms) {
    // Search with each synonym term and combine results
    const synonymResults = new Map<string, SmartSearchResult>()
    
    for (const term of synonymTerms) {
      const fuseResults = fuseIndex.search(term)
      fuseResults.forEach(result => {
        if (!synonymResults.has(result.item.id)) {
          synonymResults.set(result.item.id, {
            frequency: result.item,
            score: (result.score ?? 0.5) * 0.8, // boost synonym matches
            matchedFields: result.matches?.map(m => m.key ?? '') ?? [],
            matchType: 'synonym',
          })
        }
      })
    }
    
    const combined = Array.from(synonymResults.values())
    if (combined.length > 0) {
      return combined.sort((a, b) => a.score - b.score)
    }
  }

  // 4. Multi-word synonym check (for phrases)
  for (const [phrase, terms] of Object.entries(SYNONYMS)) {
    if (lowerQuery.includes(phrase) && phrase.includes(' ')) {
      const synonymResults = new Map<string, SmartSearchResult>()
      for (const term of terms) {
        fuseIndex.search(term).forEach(result => {
          if (!synonymResults.has(result.item.id)) {
            synonymResults.set(result.item.id, {
              frequency: result.item,
              score: (result.score ?? 0.5) * 0.85,
              matchedFields: result.matches?.map(m => m.key ?? '') ?? [],
              matchType: 'synonym',
            })
          }
        })
      }
      const combined = Array.from(synonymResults.values())
      if (combined.length > 0) {
        return combined.sort((a, b) => a.score - b.score)
      }
    }
  }

  // 5. Fuzzy search (Fuse.js)
  const fuseResults = fuseIndex.search(trimmed)
  fuseResults.forEach(result => {
    results.push({
      frequency: result.item,
      score: result.score ?? 0.5,
      matchedFields: result.matches?.map(m => m.key ?? '') ?? [],
      matchType: 'fuzzy',
    })
  })

  return results.sort((a, b) => a.score - b.score)
}

// ─── Intent Detection ──────────────────────────────────────────────────
export type InputIntent = 'search' | 'chat'

/**
 * Determines whether user input should trigger search mode or chat mode.
 * 
 * Search triggers: numbers, single keywords, exact frequency names
 * Chat triggers: conversational phrases, questions, multi-symptom descriptions
 */
export function detectIntent(input: string): InputIntent {
  const trimmed = input.trim()
  if (!trimmed) return 'search'

  // Pure number → search by Hz
  if (/^\d+(?:\.\d+)?\s*(?:hz)?$/i.test(trimmed)) return 'search'

  // Single word that matches a known keyword → search
  if (trimmed.split(/\s+/).length === 1) {
    const lower = trimmed.toLowerCase()
    const isKnownKeyword = frequencies.some(f =>
      f.name.toLowerCase().includes(lower) ||
      f.category.toLowerCase().includes(lower)
    ) || SYNONYMS[lower] !== undefined
    
    if (isKnownKeyword) return 'search'
  }

  // Two-word category matches → search
  if (trimmed.split(/\s+/).length === 2) {
    const lower = trimmed.toLowerCase()
    const isCategory = frequencies.some(f =>
      f.name.toLowerCase() === lower ||
      f.category.replace(/_/g, ' ').toLowerCase() === lower
    )
    if (isCategory) return 'search'
  }

  // Question patterns → chat
  if (/^(what|which|how|why|can|should|is|are|do|does|tell|help|recommend|qué|cuál|cómo|por qué|puedo|debería|recomienda)/i.test(trimmed)) {
    return 'chat'
  }

  // Conversational patterns → chat
  if (/^(i feel|i have|i need|i want|i can'?t|my .+ (hurts?|aches?|is)|me siento|tengo|necesito|quiero|no puedo|me duele)/i.test(trimmed)) {
    return 'chat'
  }

  // Comparison requests → chat
  if (/\bvs\.?\b|\bversus\b|\bcompare\b|\bdiffer/i.test(trimmed)) {
    return 'chat'
  }

  // Multiple symptoms → chat
  if (/\b(and|y|also|además|también)\b/i.test(trimmed) && trimmed.split(/\s+/).length > 3) {
    return 'chat'
  }

  // Long input (>4 words) → likely conversational → chat
  if (trimmed.split(/\s+/).length > 4) return 'chat'

  // Default: search
  return 'search'
}

// ─── Get highlighted field label ───────────────────────────────────────
export function getMatchLabel(field: string): string {
  const labels: Record<string, string> = {
    name: 'Name',
    description: 'Description',
    category: 'Category',
    benefits: 'Benefit',
    best_for: 'Best for',
    mechanism: 'Mechanism',
    scientific_backing: 'Research',
    hz_value: 'Hz Match',
    tier: 'Tier',
    slug: 'Name',
  }
  return labels[field] || field
}
