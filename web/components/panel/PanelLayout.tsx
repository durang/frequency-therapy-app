'use client'

import { useEffect, useState } from 'react'
import { usePanel, usePanelStore } from '@/lib/panelState'
import { usePanelPersistence, panelPersistenceUtils } from '@/lib/panelPersistence'
import { useChatState } from '@/lib/chatState'
import { useProgression } from '@/lib/progressionState'
import { PanelContainer } from '@/components/ui/PanelContainer'
import { FrequencyLibrary } from './FrequencyLibrary'
import { DJControlPanel } from './DJControlPanel'
import { MobileControls } from './MobileControls'
import { PanelHeader } from './PanelHeader'
import { SpatialArena } from './SpatialArena'
import { ChatSidebar } from './ChatSidebar'
import { Button } from '@/components/ui/button'
import { Bars3Icon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { ProgressionOverlay } from './ProgressionOverlay'
import { UnlockCelebration } from './UnlockCelebration'
import { ProgressionPanel } from './ProgressionPanel'

interface PanelLayoutProps {
  demoMode?: boolean
}

export function PanelLayout({ demoMode = false }: PanelLayoutProps) {
  const { 
    layoutMode, 
    panelView, 
    sidebarCollapsed, 
    setLayoutMode, 
    setPanelView, 
    toggleSidebar,
    isMobile,
    // Include all panel state for persistence
    masterVolume,
    isPlaying,
    activeFrequencies,
    selectedCategory,
    searchQuery,
    libraryScrollPosition
  } = usePanel()

  const { sidebarOpen: chatOpen, setSidebarOpen: setChatOpen } = useChatState()
  const { progressionPanelOpen, setProgressionPanelOpen } = useProgression()
  
  const {
    initialize: initializePersistence,
    savePanelState,
    loadPanelState,
    isEnabled: persistenceEnabled,
    isLoading: persistenceLoading
  } = usePanelPersistence()
  
  const [mounted, setMounted] = useState(false)
  const [persistenceInitialized, setPersistenceInitialized] = useState(false)

  // Initialize persistence system
  useEffect(() => {
    if (!persistenceInitialized) {
      initializePersistence()
        .then(async () => {
          setPersistenceInitialized(true)
          
          // Load saved panel state
          const savedState = await loadPanelState()
          if (savedState) {
            // Apply saved state to panel (except isPlaying for safety)
            const panelState = usePanelStore.getState()
            if (savedState.layoutMode) panelState.setLayoutMode(savedState.layoutMode)
            if (savedState.panelView) panelState.setPanelView(savedState.panelView)
            if (savedState.sidebarCollapsed !== undefined) panelState.setSidebarCollapsed(savedState.sidebarCollapsed)
            if (savedState.masterVolume !== undefined) panelState.setMasterVolume(savedState.masterVolume)
            if (savedState.selectedCategory !== undefined) panelState.setSelectedCategory(savedState.selectedCategory)
            if (savedState.searchQuery !== undefined) panelState.setSearchQuery(savedState.searchQuery)
            if (savedState.libraryScrollPosition !== undefined) panelState.setLibraryScrollPosition(savedState.libraryScrollPosition)
            
            // Restore active frequencies (but don't auto-play)
            if (savedState.activeFrequencies && savedState.activeFrequencies.length > 0) {
              savedState.activeFrequencies.forEach((af: any) => {
                panelState.activateFrequency(af.frequency)
                panelState.updateFrequencyVolume(af.frequency.id, af.volume)
              })
            }
            
            console.log('📖 [PanelLayout] Session restored from storage')
          }
        })
        .catch((error) => {
          console.error('❌ [PanelLayout] Persistence initialization failed:', error)
          setPersistenceInitialized(true) // Continue without persistence
        })
    }
  }, [persistenceInitialized, initializePersistence, loadPanelState])

  // Auto-save panel state when it changes
  useEffect(() => {
    if (!persistenceEnabled || !persistenceInitialized) return
    
    const panelState = {
      layoutMode,
      panelView,
      sidebarCollapsed,
      masterVolume,
      isPlaying,
      activeFrequencies,
      selectedCategory,
      searchQuery,
      libraryScrollPosition
    }
    
    // Debounced save
    const saveTimeout = setTimeout(() => {
      savePanelState(panelState)
    }, 1000)
    
    return () => clearTimeout(saveTimeout)
  }, [
    layoutMode, panelView, sidebarCollapsed, masterVolume, isPlaying, 
    activeFrequencies, selectedCategory, searchQuery, libraryScrollPosition,
    persistenceEnabled, persistenceInitialized, savePanelState
  ])

  // Handle responsive layout detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setLayoutMode('mobile')
      } else if (width < 1024) {
        setLayoutMode('tablet')
      } else {
        setLayoutMode('desktop')
      }
    }

    // Set initial layout
    handleResize()
    
    // Listen for resize events
    window.addEventListener('resize', handleResize)
    
    // Set mounted state for hydration
    setMounted(true)
    
    // Log panel initialization
    console.log('🎛️ [PanelLayout] Panel initialized')
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setLayoutMode])

  // Handle mobile view switching
  const handleMobileViewSwitch = (view: 'library' | 'mixer') => {
    if (isMobile) {
      setPanelView(view)
      console.log('📱 [PanelLayout] Mobile view switched to:', view)
    }
  }

  // Prevent hydration mismatch and show loading during persistence initialization
  if (!mounted || persistenceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-quantum-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">
            {persistenceLoading ? 'Loading session...' : 'Loading panel...'}
          </p>
          {persistenceEnabled && (
            <p className="text-white/60 text-sm mt-2">
              Restoring your previous session
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <PanelContainer>
      {/* Progression particle overlay — renders above background, below content */}
      <ProgressionOverlay />

      {/* Level-up celebration overlay — fixed, only visible during isLevelingUp */}
      <UnlockCelebration />

      {/* Progression stats panel — slide-in from right */}
      <ProgressionPanel
        open={progressionPanelOpen}
        onClose={() => setProgressionPanelOpen(false)}
      />

      <div className="h-screen flex flex-col overflow-hidden">
        {/* Panel Header */}
        <PanelHeader />
        
        {/* Mobile Navigation */}
        {isMobile && (
          <div className="bg-black/20 border-b border-white/10 p-2">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant={panelView === 'library' && !chatOpen ? 'quantum' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setChatOpen(false)
                    handleMobileViewSwitch('library')
                  }}
                >
                  Library
                </Button>
                <Button
                  variant={panelView === 'mixer' && !chatOpen ? 'quantum' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setChatOpen(false)
                    handleMobileViewSwitch('mixer')
                  }}
                >
                  Mixer
                </Button>
                <Button
                  variant={chatOpen ? 'quantum' : 'outline'}
                  size="sm"
                  onClick={() => setChatOpen(!chatOpen)}
                  className="flex items-center gap-1"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Chat
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSidebar}
                className="p-2"
              >
                {sidebarCollapsed ? <Bars3Icon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* Main Panel Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Mobile Layout */}
          {isMobile ? (
            <div className="relative w-full h-full">
              {/* Normal mobile views */}
              {panelView === 'library' ? (
                <div className="w-full h-full">
                  <FrequencyLibrary demoMode={demoMode} />
                </div>
              ) : (
                <div className="w-full h-full">
                  <MobileControls />
                </div>
              )}

              {/* Mobile chat overlay with slide animation */}
              <AnimatePresence>
                {chatOpen && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="chat-mobile-overlay absolute inset-0 z-40"
                  >
                    <ChatSidebar isMobile onClose={() => setChatOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Desktop/Tablet Layout */
            <>
              {/* Frequency Library Sidebar */}
              <div
                className={`
                  transition-all duration-300 bg-black/10 backdrop-blur-sm border-r border-white/10
                  ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80 lg:w-96 overflow-visible'}
                `}
              >
                {!sidebarCollapsed && <FrequencyLibrary demoMode={demoMode} />}
              </div>

              {/* DJ Control Panel Main Area */}
              <div className="flex-1 transition-all duration-300 flex flex-col">
                {/* Spatial Audio Arena — shown when spatial is enabled */}
                <SpatialArena />
                <div className="flex-1 min-h-0">
                  <DJControlPanel />
                </div>
              </div>

              {/* AI Chat Sidebar — right panel, collapsible */}
              <ChatSidebar />
            </>
          )}

          {/* Sidebar Toggle for Desktop */}
          {!isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="absolute top-20 left-4 z-50 bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70 p-2"
            >
              {sidebarCollapsed ? <Bars3Icon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
            </Button>
          )}
        </div>

        {/* Layout Mode Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs p-2 rounded border border-white/20 z-50">
            <div>{layoutMode} | {panelView} | {sidebarCollapsed ? 'collapsed' : 'expanded'}</div>
            <div className="text-quantum-400">
              Persistence: {persistenceEnabled ? '✅' : '❌'} | 
              Active: {activeFrequencies.length}/4
            </div>
          </div>
        )}
      </div>
    </PanelContainer>
  )
}