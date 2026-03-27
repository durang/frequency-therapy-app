'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { PanelState } from './panelState'
import { Frequency } from '@/types'

// Types for persistence
interface PersistentPanelData {
  version: number
  timestamp: number
  session: {
    id: string
    startTime: number
    lastActivity: number
  }
  layout: {
    mode: 'desktop' | 'mobile' | 'tablet'
    panelView: 'library' | 'mixer' | 'both'
    sidebarCollapsed: boolean
  }
  mixer: {
    masterVolume: number
    isPlaying: boolean
    activeFrequencies: Array<{
      frequency: Frequency
      volume: number
      active: boolean
      lastActivated: string // ISO string
      persistentSettings?: Record<string, any>
    }>
  }
  library: {
    selectedCategory: string | null
    searchQuery: string
    scrollPosition: number
    recentFrequencies: string[] // frequency IDs
    favoriteFrequencies: string[] // frequency IDs
  }
  preferences: {
    autoSave: boolean
    saveInterval: number // seconds
    maxSessions: number
    crossBrowserSync: boolean
  }
  analytics: {
    totalSessions: number
    totalPlaytime: number // seconds
    frequencyUsageCount: Record<string, number>
    lastBrowserInfo: {
      userAgent: string
      platform: string
      language: string
    }
  }
}

interface PersistenceStore {
  // State
  isLoading: boolean
  isEnabled: boolean
  lastSaveTime: number | null
  saveInterval: NodeJS.Timeout | null
  currentSession: string | null
  
  // Actions
  initialize: () => Promise<void>
  savePanelState: (panelState: Partial<PanelState>) => Promise<void>
  loadPanelState: () => Promise<Partial<PanelState> | null>
  clearStorage: () => Promise<void>
  exportSession: () => Promise<string>
  importSession: (data: string) => Promise<void>
  
  // Session management
  startSession: () => string
  endSession: () => void
  updateLastActivity: () => void
  getSessionInfo: () => { id: string; duration: number; lastActivity: number } | null
  
  // Analytics
  trackFrequencyUsage: (frequencyId: string) => void
  trackPlaytime: (seconds: number) => void
  getBrowserCompatibility: () => { storage: boolean; indexedDB: boolean; webAudio: boolean }
  
  // Settings
  updatePreferences: (prefs: Partial<PersistentPanelData['preferences']>) => void
  enableAutoSave: (enabled: boolean) => void
  setSaveInterval: (seconds: number) => void
}

// Storage utilities
class PanelPersistenceEngine {
  private static readonly STORAGE_KEY = 'frequency-therapy-panel'
  private static readonly VERSION = 1
  private static readonly MAX_STORAGE_SIZE = 5 * 1024 * 1024 // 5MB
  
  static async isStorageAvailable(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false
      
      const testKey = '__panel_storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch (error) {
      console.warn('🔒 [PanelPersistence] LocalStorage not available:', error)
      return false
    }
  }
  
  static async save(data: PersistentPanelData): Promise<void> {
    try {
      if (!(await this.isStorageAvailable())) {
        throw new Error('Storage not available')
      }
      
      const serialized = JSON.stringify(data)
      
      // Check size limit
      if (serialized.length > this.MAX_STORAGE_SIZE) {
        console.warn('⚠️ [PanelPersistence] Data too large, compressing...')
        const compressedData = this.compressData(data)
        const compressedSerialized = JSON.stringify(compressedData)
        
        if (compressedSerialized.length > this.MAX_STORAGE_SIZE) {
          throw new Error('Data exceeds maximum storage limit')
        }
        
        localStorage.setItem(this.STORAGE_KEY, compressedSerialized)
      } else {
        localStorage.setItem(this.STORAGE_KEY, serialized)
      }
      
      console.log('💾 [PanelPersistence] Session saved successfully')
    } catch (error) {
      console.error('❌ [PanelPersistence] Save failed:', error)
      throw error
    }
  }
  
  static async load(): Promise<PersistentPanelData | null> {
    try {
      if (!(await this.isStorageAvailable())) {
        return null
      }
      
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null
      
      const data = JSON.parse(stored) as PersistentPanelData
      
      // Version migration
      if (data.version !== this.VERSION) {
        console.log('📦 [PanelPersistence] Migrating data from version', data.version, 'to', this.VERSION)
        return this.migrateData(data)
      }
      
      console.log('📖 [PanelPersistence] Session loaded successfully')
      return data
    } catch (error) {
      console.error('❌ [PanelPersistence] Load failed:', error)
      return null
    }
  }
  
  static async clear(): Promise<void> {
    try {
      if (await this.isStorageAvailable()) {
        localStorage.removeItem(this.STORAGE_KEY)
        console.log('🧹 [PanelPersistence] Storage cleared')
      }
    } catch (error) {
      console.error('❌ [PanelPersistence] Clear failed:', error)
    }
  }
  
  private static compressData(data: PersistentPanelData): PersistentPanelData {
    // Remove or truncate large data structures
    const compressed = { ...data }
    
    // Limit analytics data
    if (compressed.analytics.frequencyUsageCount) {
      const topFrequencies = Object.entries(compressed.analytics.frequencyUsageCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 50) // Keep only top 50
      compressed.analytics.frequencyUsageCount = Object.fromEntries(topFrequencies)
    }
    
    // Limit recent frequencies
    if (compressed.library.recentFrequencies) {
      compressed.library.recentFrequencies = compressed.library.recentFrequencies.slice(0, 20)
    }
    
    // Remove detailed persistent settings if they exist
    compressed.mixer.activeFrequencies = compressed.mixer.activeFrequencies.map(af => ({
      ...af,
      persistentSettings: undefined
    }))
    
    return compressed
  }
  
  private static migrateData(oldData: any): PersistentPanelData {
    // Handle version migrations here
    const migrated: PersistentPanelData = {
      version: this.VERSION,
      timestamp: Date.now(),
      session: oldData.session || {
        id: PanelPersistenceEngine.generateSessionId(),
        startTime: Date.now(),
        lastActivity: Date.now()
      },
      layout: oldData.layout || {
        mode: 'desktop',
        panelView: 'both',
        sidebarCollapsed: false
      },
      mixer: oldData.mixer || {
        masterVolume: 0.7,
        isPlaying: false,
        activeFrequencies: []
      },
      library: oldData.library || {
        selectedCategory: null,
        searchQuery: '',
        scrollPosition: 0,
        recentFrequencies: [],
        favoriteFrequencies: []
      },
      preferences: {
        autoSave: true,
        saveInterval: 30,
        maxSessions: 10,
        crossBrowserSync: false,
        ...oldData.preferences
      },
      analytics: {
        totalSessions: 1,
        totalPlaytime: 0,
        frequencyUsageCount: {},
        lastBrowserInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        },
        ...oldData.analytics
      }
    }
    
    return migrated
  }
  
  static generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
}

// Create persistence store
export const usePanelPersistence = create<PersistenceStore>((set, get) => ({
  // Initial state
  isLoading: false,
  isEnabled: false,
  lastSaveTime: null,
  saveInterval: null,
  currentSession: null,

  // Initialize persistence system
  initialize: async () => {
    console.log('🔧 [PanelPersistence] Initializing...')
    set({ isLoading: true })
    
    try {
      const isAvailable = await PanelPersistenceEngine.isStorageAvailable()
      
      if (isAvailable) {
        const stored = await PanelPersistenceEngine.load()
        
        if (stored) {
          // Update browser info
          stored.analytics.lastBrowserInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
          
          // Increment session count
          stored.analytics.totalSessions += 1
          stored.timestamp = Date.now()
          
          await PanelPersistenceEngine.save(stored)
        }
        
        console.log('✅ [PanelPersistence] Initialized successfully')
        set({ isEnabled: true })
        
        // Start auto-save if enabled
        if (stored?.preferences.autoSave) {
          get().setSaveInterval(stored.preferences.saveInterval)
        }
      } else {
        console.warn('⚠️ [PanelPersistence] Storage not available, persistence disabled')
        set({ isEnabled: false })
      }
    } catch (error) {
      console.error('❌ [PanelPersistence] Initialization failed:', error)
      set({ isEnabled: false })
    } finally {
      set({ isLoading: false })
    }
  },

  // Save panel state
  savePanelState: async (panelState) => {
    const state = get()
    if (!state.isEnabled) return
    
    try {
      const existingData = await PanelPersistenceEngine.load() || {
        version: 1,
        timestamp: Date.now(),
        session: {
          id: PanelPersistenceEngine.generateSessionId(),
          startTime: Date.now(),
          lastActivity: Date.now()
        },
        layout: { mode: 'desktop', panelView: 'both', sidebarCollapsed: false },
        mixer: { masterVolume: 0.7, isPlaying: false, activeFrequencies: [] },
        library: { selectedCategory: null, searchQuery: '', scrollPosition: 0, recentFrequencies: [], favoriteFrequencies: [] },
        preferences: { autoSave: true, saveInterval: 30, maxSessions: 10, crossBrowserSync: false },
        analytics: { totalSessions: 0, totalPlaytime: 0, frequencyUsageCount: {}, lastBrowserInfo: { userAgent: '', platform: '', language: '' } }
      }
      
      // Update with current panel state
      if (panelState.layoutMode) existingData.layout.mode = panelState.layoutMode
      if (panelState.panelView) existingData.layout.panelView = panelState.panelView
      if (panelState.sidebarCollapsed !== undefined) existingData.layout.sidebarCollapsed = panelState.sidebarCollapsed
      
      if (panelState.masterVolume !== undefined) existingData.mixer.masterVolume = panelState.masterVolume
      if (panelState.isPlaying !== undefined) existingData.mixer.isPlaying = panelState.isPlaying
      
      if (panelState.activeFrequencies) {
        existingData.mixer.activeFrequencies = panelState.activeFrequencies.map(af => ({
          frequency: af.frequency,
          volume: af.volume,
          active: af.active,
          lastActivated: af.lastActivated?.toISOString() || new Date().toISOString()
        }))
      }
      
      if (panelState.selectedCategory !== undefined) existingData.library.selectedCategory = panelState.selectedCategory
      if (panelState.searchQuery !== undefined) existingData.library.searchQuery = panelState.searchQuery
      if (panelState.libraryScrollPosition !== undefined) existingData.library.scrollPosition = panelState.libraryScrollPosition
      
      existingData.timestamp = Date.now()
      existingData.session.lastActivity = Date.now()
      
      await PanelPersistenceEngine.save(existingData)
      set({ lastSaveTime: Date.now() })
      
      console.log('💾 [PanelPersistence] Panel state saved')
    } catch (error) {
      console.error('❌ [PanelPersistence] Save panel state failed:', error)
    }
  },

  // Load panel state
  loadPanelState: async () => {
    const state = get()
    if (!state.isEnabled) return null
    
    try {
      const stored = await PanelPersistenceEngine.load()
      if (!stored) return null
      
      // Convert stored data back to panel state format
      const panelState: Partial<PanelState> = {
        layoutMode: stored.layout.mode,
        panelView: stored.layout.panelView,
        sidebarCollapsed: stored.layout.sidebarCollapsed,
        masterVolume: stored.mixer.masterVolume,
        isPlaying: false, // Don't auto-resume playback
        activeFrequencies: stored.mixer.activeFrequencies.map(af => ({
          frequency: af.frequency,
          volume: af.volume,
          active: af.active,
          lastActivated: new Date(af.lastActivated)
        })),
        selectedCategory: stored.library.selectedCategory,
        searchQuery: stored.library.searchQuery,
        libraryScrollPosition: stored.library.scrollPosition
      }
      
      console.log('📖 [PanelPersistence] Panel state loaded')
      return panelState
    } catch (error) {
      console.error('❌ [PanelPersistence] Load panel state failed:', error)
      return null
    }
  },

  // Clear storage
  clearStorage: async () => {
    try {
      await PanelPersistenceEngine.clear()
      set({ currentSession: null, lastSaveTime: null })
      console.log('🧹 [PanelPersistence] Storage cleared')
    } catch (error) {
      console.error('❌ [PanelPersistence] Clear storage failed:', error)
    }
  },

  // Export session data
  exportSession: async () => {
    try {
      const data = await PanelPersistenceEngine.load()
      if (!data) throw new Error('No session data found')
      
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('❌ [PanelPersistence] Export failed:', error)
      throw error
    }
  },

  // Import session data
  importSession: async (jsonData) => {
    try {
      const data = JSON.parse(jsonData) as PersistentPanelData
      
      // Validate data structure
      if (!data.version || !data.session || !data.mixer) {
        throw new Error('Invalid session data format')
      }
      
      // Update timestamp and session info
      data.timestamp = Date.now()
      data.session.lastActivity = Date.now()
      
      await PanelPersistenceEngine.save(data)
      console.log('📥 [PanelPersistence] Session imported successfully')
    } catch (error) {
      console.error('❌ [PanelPersistence] Import failed:', error)
      throw error
    }
  },

  // Start new session
  startSession: () => {
    const sessionId = PanelPersistenceEngine.generateSessionId()
    set({ currentSession: sessionId })
    get().updateLastActivity()
    
    console.log('🚀 [PanelPersistence] Session started:', sessionId)
    return sessionId
  },

  // End current session
  endSession: () => {
    const state = get()
    if (state.saveInterval) {
      clearInterval(state.saveInterval)
    }
    
    set({ currentSession: null, saveInterval: null })
    console.log('🛑 [PanelPersistence] Session ended')
  },

  // Update last activity timestamp
  updateLastActivity: () => {
    // This is called frequently, so no logging to avoid spam
    set({ lastSaveTime: Date.now() })
  },

  // Get session info
  getSessionInfo: () => {
    const state = get()
    if (!state.currentSession) return null
    
    return {
      id: state.currentSession,
      duration: Date.now() - (state.lastSaveTime || Date.now()),
      lastActivity: state.lastSaveTime || Date.now()
    }
  },

  // Track frequency usage
  trackFrequencyUsage: async (frequencyId) => {
    try {
      const data = await PanelPersistenceEngine.load()
      if (!data) return
      
      data.analytics.frequencyUsageCount[frequencyId] = 
        (data.analytics.frequencyUsageCount[frequencyId] || 0) + 1
      
      await PanelPersistenceEngine.save(data)
      console.log('📊 [PanelPersistence] Frequency usage tracked:', frequencyId)
    } catch (error) {
      console.error('❌ [PanelPersistence] Track frequency usage failed:', error)
    }
  },

  // Track playtime
  trackPlaytime: async (seconds) => {
    try {
      const data = await PanelPersistenceEngine.load()
      if (!data) return
      
      data.analytics.totalPlaytime += seconds
      await PanelPersistenceEngine.save(data)
      
      console.log('⏱️ [PanelPersistence] Playtime tracked:', seconds, 'seconds')
    } catch (error) {
      console.error('❌ [PanelPersistence] Track playtime failed:', error)
    }
  },

  // Get browser compatibility info
  getBrowserCompatibility: () => {
    return {
      storage: typeof Storage !== 'undefined',
      indexedDB: typeof indexedDB !== 'undefined',
      webAudio: typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined'
    }
  },

  // Update preferences
  updatePreferences: async (prefs) => {
    try {
      const data = await PanelPersistenceEngine.load()
      if (!data) return
      
      data.preferences = { ...data.preferences, ...prefs }
      await PanelPersistenceEngine.save(data)
      
      console.log('⚙️ [PanelPersistence] Preferences updated:', prefs)
    } catch (error) {
      console.error('❌ [PanelPersistence] Update preferences failed:', error)
    }
  },

  // Enable/disable auto-save
  enableAutoSave: (enabled) => {
    const state = get()
    
    if (enabled && !state.saveInterval) {
      get().setSaveInterval(30) // Default 30 seconds
    } else if (!enabled && state.saveInterval) {
      clearInterval(state.saveInterval)
      set({ saveInterval: null })
    }
    
    console.log('🔄 [PanelPersistence] Auto-save', enabled ? 'enabled' : 'disabled')
  },

  // Set save interval
  setSaveInterval: (seconds) => {
    const state = get()
    
    if (state.saveInterval) {
      clearInterval(state.saveInterval)
    }
    
    const interval = setInterval(() => {
      get().updateLastActivity()
    }, seconds * 1000)
    
    set({ saveInterval: interval })
    console.log('⏰ [PanelPersistence] Save interval set to', seconds, 'seconds')
  }
}))

// Utility functions
export const panelPersistenceUtils = {
  // Check if persistence is available
  isAvailable: (): boolean => {
    return usePanelPersistence.getState().isEnabled
  },
  
  // Get storage usage info
  getStorageInfo: async (): Promise<{ used: number; available: number; percentage: number } | null> => {
    try {
      if ('estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        return {
          used: estimate.usage || 0,
          available: estimate.quota || 0,
          percentage: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0
        }
      }
    } catch (error) {
      console.warn('⚠️ [PanelPersistence] Could not get storage info:', error)
    }
    return null
  },
  
  // Auto-save helper for React components
  useAutoSave: (panelState: Partial<PanelState>, enabled = true) => {
    if (typeof window === 'undefined') return
    
    const { savePanelState } = usePanelPersistence.getState()
    
    if (enabled) {
      const timeoutId = setTimeout(() => {
        savePanelState(panelState)
      }, 1000) // Debounce saves by 1 second
      
      return () => clearTimeout(timeoutId)
    }
  }
}

// Export the persistence engine for direct use if needed
export { PanelPersistenceEngine }