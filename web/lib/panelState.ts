'use client'

import { create } from 'zustand'
import { Frequency } from '@/types'

export type LayoutMode = 'desktop' | 'mobile' | 'tablet'
export type PanelView = 'library' | 'mixer' | 'both'

interface ActiveFrequency {
  frequency: Frequency
  volume: number
  active: boolean
  lastActivated?: Date
}

interface PanelState {
  // Layout and UI state
  layoutMode: LayoutMode
  panelView: PanelView
  sidebarCollapsed: boolean
  
  // Active frequencies and mixer state
  activeFrequencies: ActiveFrequency[]
  masterVolume: number
  isPlaying: boolean
  
  // Library state
  selectedCategory: string | null
  searchQuery: string
  libraryScrollPosition: number
  
  // Actions
  setLayoutMode: (mode: LayoutMode) => void
  setPanelView: (view: PanelView) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Frequency management
  activateFrequency: (frequency: Frequency) => void
  deactivateFrequency: (frequencyId: string) => void
  updateFrequencyVolume: (frequencyId: string, volume: number) => void
  setMasterVolume: (volume: number) => void
  togglePlayback: () => void
  startPlayback: () => void
  stopPlayback: () => void
  
  // Library management
  setSelectedCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  setLibraryScrollPosition: (position: number) => void
  
  // Reset functions
  clearActiveFrequencies: () => void
  resetMixer: () => void
}

export const usePanelStore = create<PanelState>((set, get) => ({
  // Initial state
  layoutMode: 'desktop',
  panelView: 'both',
  sidebarCollapsed: false,
  activeFrequencies: [],
  masterVolume: 0.7,
  isPlaying: false,
  selectedCategory: null,
  searchQuery: '',
  libraryScrollPosition: 0,

  // Layout actions
  setLayoutMode: (mode) => {
    console.log('🎛️ [PanelState] Layout mode changed:', mode)
    set({ layoutMode: mode })
    
    // Auto-adjust panel view based on layout
    if (mode === 'mobile') {
      set({ panelView: 'library', sidebarCollapsed: true })
    } else if (mode === 'tablet') {
      set({ panelView: 'both', sidebarCollapsed: false })
    }
  },

  setPanelView: (view) => {
    console.log('🎛️ [PanelState] Panel view changed:', view)
    set({ panelView: view })
  },

  toggleSidebar: () => {
    const { sidebarCollapsed } = get()
    console.log('🎛️ [PanelState] Sidebar toggled:', !sidebarCollapsed)
    set({ sidebarCollapsed: !sidebarCollapsed })
  },

  setSidebarCollapsed: (collapsed) => {
    console.log('🎛️ [PanelState] Sidebar collapsed:', collapsed)
    set({ sidebarCollapsed: collapsed })
  },

  // Frequency management
  activateFrequency: (frequency) => {
    const { activeFrequencies } = get()
    
    // Check if frequency is already active
    const existingIndex = activeFrequencies.findIndex(af => af.frequency.id === frequency.id)
    
    if (existingIndex !== -1) {
      // Update existing frequency
      const updated = [...activeFrequencies]
      updated[existingIndex] = {
        ...updated[existingIndex],
        active: true,
        lastActivated: new Date()
      }
      
      console.log('🎵 [PanelState] Frequency reactivated:', frequency.name, frequency.hz_value + 'Hz')
      set({ activeFrequencies: updated })
    } else {
      // Add new frequency (limit to 4 for DJ panel)
      let newActiveFrequencies = [...activeFrequencies]
      
      if (newActiveFrequencies.length >= 4) {
        // Remove oldest frequency
        const oldestIndex = newActiveFrequencies.reduce((oldest, current, index) => {
          const currentTime = current.lastActivated?.getTime() || 0
          const oldestTime = newActiveFrequencies[oldest].lastActivated?.getTime() || 0
          return currentTime < oldestTime ? index : oldest
        }, 0)
        
        console.log('🎵 [PanelState] Removing oldest frequency to make room:', newActiveFrequencies[oldestIndex].frequency.name)
        newActiveFrequencies.splice(oldestIndex, 1)
      }
      
      // Add new frequency
      newActiveFrequencies.push({
        frequency,
        volume: 0.7,
        active: true,
        lastActivated: new Date()
      })
      
      console.log('🎵 [PanelState] Frequency activated:', frequency.name, frequency.hz_value + 'Hz')
      set({ activeFrequencies: newActiveFrequencies })
    }
  },

  deactivateFrequency: (frequencyId) => {
    const { activeFrequencies } = get()
    const updated = activeFrequencies.filter(af => af.frequency.id !== frequencyId)
    
    console.log('🎵 [PanelState] Frequency deactivated:', frequencyId)
    set({ activeFrequencies: updated })
  },

  updateFrequencyVolume: (frequencyId, volume) => {
    const { activeFrequencies } = get()
    const updated = activeFrequencies.map(af => 
      af.frequency.id === frequencyId 
        ? { ...af, volume: Math.max(0, Math.min(1, volume)) }
        : af
    )
    
    console.log('🎵 [PanelState] Frequency volume updated:', frequencyId, 'volume:', volume)
    set({ activeFrequencies: updated })
  },

  setMasterVolume: (volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    console.log('🔊 [PanelState] Master volume changed:', clampedVolume)
    set({ masterVolume: clampedVolume })
  },

  togglePlayback: () => {
    const { isPlaying } = get()
    const newState = !isPlaying
    
    console.log('⏯️ [PanelState] Playback toggled:', newState ? 'playing' : 'paused')
    set({ isPlaying: newState })
  },

  startPlayback: () => {
    console.log('▶️ [PanelState] Playback started')
    set({ isPlaying: true })
  },

  stopPlayback: () => {
    console.log('⏹️ [PanelState] Playback stopped')
    set({ isPlaying: false })
  },

  // Library management
  setSelectedCategory: (category) => {
    console.log('📚 [PanelState] Category selected:', category)
    set({ selectedCategory: category })
  },

  setSearchQuery: (query) => {
    console.log('🔍 [PanelState] Search query:', query)
    set({ searchQuery: query })
  },

  setLibraryScrollPosition: (position) => {
    set({ libraryScrollPosition: position })
  },

  // Reset functions
  clearActiveFrequencies: () => {
    console.log('🧹 [PanelState] Clearing all active frequencies')
    set({ activeFrequencies: [], isPlaying: false })
  },

  resetMixer: () => {
    console.log('🔄 [PanelState] Resetting mixer to defaults')
    set({
      activeFrequencies: [],
      masterVolume: 0.7,
      isPlaying: false
    })
  }
}))

// Utility functions for panel state
export const panelUtils = {
  // Check if layout is mobile
  isMobile: (): boolean => {
    const state = usePanelStore.getState()
    return state.layoutMode === 'mobile'
  },

  // Check if layout is desktop
  isDesktop: (): boolean => {
    const state = usePanelStore.getState()
    return state.layoutMode === 'desktop'
  },

  // Get active frequency count
  getActiveFrequencyCount: (): number => {
    const state = usePanelStore.getState()
    return state.activeFrequencies.filter(af => af.active).length
  },

  // Get frequency by ID from active list
  getActiveFrequency: (frequencyId: string): ActiveFrequency | null => {
    const state = usePanelStore.getState()
    return state.activeFrequencies.find(af => af.frequency.id === frequencyId) || null
  },

  // Check if frequency is active
  isFrequencyActive: (frequencyId: string): boolean => {
    const state = usePanelStore.getState()
    return state.activeFrequencies.some(af => af.frequency.id === frequencyId && af.active)
  },

  // Calculate total volume (master * individual)
  getEffectiveVolume: (frequencyId: string): number => {
    const state = usePanelStore.getState()
    const activeFreq = state.activeFrequencies.find(af => af.frequency.id === frequencyId)
    return activeFreq ? state.masterVolume * activeFreq.volume : 0
  },

  // Get panel state for debugging
  getDebugState: () => {
    const state = usePanelStore.getState()
    return {
      layout: {
        mode: state.layoutMode,
        view: state.panelView,
        sidebarCollapsed: state.sidebarCollapsed
      },
      mixer: {
        activeCount: state.activeFrequencies.length,
        masterVolume: state.masterVolume,
        isPlaying: state.isPlaying
      },
      library: {
        category: state.selectedCategory,
        searchQuery: state.searchQuery,
        scrollPosition: state.libraryScrollPosition
      }
    }
  }
}

// Hook for React components to easily access panel state
export const usePanel = () => {
  const layoutMode = usePanelStore((state) => state.layoutMode)
  const panelView = usePanelStore((state) => state.panelView)
  const sidebarCollapsed = usePanelStore((state) => state.sidebarCollapsed)
  const activeFrequencies = usePanelStore((state) => state.activeFrequencies)
  const masterVolume = usePanelStore((state) => state.masterVolume)
  const isPlaying = usePanelStore((state) => state.isPlaying)
  const selectedCategory = usePanelStore((state) => state.selectedCategory)
  const searchQuery = usePanelStore((state) => state.searchQuery)
  
  // Actions
  const setLayoutMode = usePanelStore((state) => state.setLayoutMode)
  const setPanelView = usePanelStore((state) => state.setPanelView)
  const toggleSidebar = usePanelStore((state) => state.toggleSidebar)
  const activateFrequency = usePanelStore((state) => state.activateFrequency)
  const deactivateFrequency = usePanelStore((state) => state.deactivateFrequency)
  const updateFrequencyVolume = usePanelStore((state) => state.updateFrequencyVolume)
  const setMasterVolume = usePanelStore((state) => state.setMasterVolume)
  const togglePlayback = usePanelStore((state) => state.togglePlayback)
  const startPlayback = usePanelStore((state) => state.startPlayback)
  const stopPlayback = usePanelStore((state) => state.stopPlayback)
  const setSelectedCategory = usePanelStore((state) => state.setSelectedCategory)
  const setSearchQuery = usePanelStore((state) => state.setSearchQuery)
  const clearActiveFrequencies = usePanelStore((state) => state.clearActiveFrequencies)
  
  return {
    // State
    layoutMode,
    panelView,
    sidebarCollapsed,
    activeFrequencies,
    masterVolume,
    isPlaying,
    selectedCategory,
    searchQuery,
    
    // Actions
    setLayoutMode,
    setPanelView,
    toggleSidebar,
    activateFrequency,
    deactivateFrequency,
    updateFrequencyVolume,
    setMasterVolume,
    togglePlayback,
    startPlayback,
    stopPlayback,
    setSelectedCategory,
    setSearchQuery,
    clearActiveFrequencies,
    
    // Computed state
    isMobile: panelUtils.isMobile(),
    isDesktop: panelUtils.isDesktop(),
    activeFrequencyCount: panelUtils.getActiveFrequencyCount(),
    
    // Utilities
    isFrequencyActive: panelUtils.isFrequencyActive,
    getEffectiveVolume: panelUtils.getEffectiveVolume
  }
}