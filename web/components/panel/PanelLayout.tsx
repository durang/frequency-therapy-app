'use client'

import { useEffect, useState } from 'react'
import { usePanel } from '@/lib/panelState'
import { PanelContainer } from '@/components/ui/PanelContainer'
import { FrequencyLibrary } from './FrequencyLibrary'
import { DJMixer } from './DJMixer'
import { PanelHeader } from './PanelHeader'
import { Button } from '@/components/ui/button'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export function PanelLayout() {
  const { 
    layoutMode, 
    panelView, 
    sidebarCollapsed, 
    setLayoutMode, 
    setPanelView, 
    toggleSidebar,
    isMobile 
  } = usePanel()
  
  const [mounted, setMounted] = useState(false)

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

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-quantum-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading panel...</p>
        </div>
      </div>
    )
  }

  return (
    <PanelContainer>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Panel Header */}
        <PanelHeader />
        
        {/* Mobile Navigation */}
        {isMobile && (
          <div className="bg-black/20 border-b border-white/10 p-2">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant={panelView === 'library' ? 'quantum' : 'outline'}
                  size="sm"
                  onClick={() => handleMobileViewSwitch('library')}
                >
                  Library
                </Button>
                <Button
                  variant={panelView === 'mixer' ? 'quantum' : 'outline'}
                  size="sm"
                  onClick={() => handleMobileViewSwitch('mixer')}
                >
                  Mixer
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
          {/* Frequency Library Sidebar */}
          <div
            className={`
              transition-all duration-300 bg-black/10 backdrop-blur-sm border-r border-white/10
              ${isMobile ? (
                panelView === 'library' ? 'w-full' : 'w-0'
              ) : sidebarCollapsed ? 'w-0' : 'w-80 lg:w-96'
              }
              ${sidebarCollapsed && !isMobile ? 'overflow-hidden' : 'overflow-visible'}
            `}
          >
            {(!sidebarCollapsed || isMobile) && (
              <FrequencyLibrary />
            )}
          </div>

          {/* DJ Mixer Main Area */}
          <div
            className={`
              flex-1 transition-all duration-300
              ${isMobile ? (
                panelView === 'mixer' ? 'block' : 'hidden'
              ) : 'block'}
            `}
          >
            {(!isMobile || panelView === 'mixer') && (
              <DJMixer />
            )}
          </div>

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
          <div className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs p-2 rounded border border-white/20">
            {layoutMode} | {panelView} | {sidebarCollapsed ? 'collapsed' : 'expanded'}
          </div>
        )}
      </div>
    </PanelContainer>
  )
}