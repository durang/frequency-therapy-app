'use client'

import { useAuth } from '@/lib/authState'
import { usePanel } from '@/lib/panelState'
import { useChatState } from '@/lib/chatState'
import { useProgression } from '@/lib/progressionState'
import { Button } from '@/components/ui/button'
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import { LevelIndicator } from './LevelIndicator'

export function PanelHeader() {
  const { user } = useAuth()
  const { activeFrequencyCount, isPlaying, masterVolume } = usePanel()
  const { sidebarOpen, toggleSidebar } = useChatState()
  const { setProgressionPanelOpen } = useProgression()

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-quantum-400 to-neural-400 bg-clip-text text-transparent">
            FreqTherapy Panel
          </h1>
          
          {/* Status Indicators */}
          <div className="hidden md:flex items-center space-x-3 text-sm text-white/70">
            <LevelIndicator onClick={() => setProgressionPanelOpen(true)} />
            <div className="text-white/50">•</div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-red-400'}`} />
              <span>{isPlaying ? 'Playing' : 'Stopped'}</span>
            </div>
            <div className="text-white/50">•</div>
            <span>{activeFrequencyCount} active</span>
            <div className="text-white/50">•</div>
            <span>Volume: {Math.round(masterVolume * 100)}%</span>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-sm text-white/70">
            Welcome, {user?.email?.split('@')[0]}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className={`p-2 transition-colors ${
              sidebarOpen
                ? 'border-quantum-500/50 bg-quantum-500/20 text-quantum-300'
                : ''
            }`}
            title="AI Chat Assistant"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="p-2"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="p-2"
          >
            <UserCircleIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
