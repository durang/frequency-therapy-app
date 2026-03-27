'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authState'
import { usePanel } from '@/lib/panelState'
import { useChatState } from '@/lib/chatState'
import { useProgression } from '@/lib/progressionState'
import { Button } from '@/components/ui/button'
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { LevelIndicator } from './LevelIndicator'

export function PanelHeader() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { activeFrequencyCount, isPlaying, masterVolume } = usePanel()
  const { sidebarOpen, toggleSidebar } = useChatState()
  const { setProgressionPanelOpen } = useProgression()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    await signOut()
  }

  const handleDashboard = () => {
    setUserMenuOpen(false)
    router.push('/dashboard')
  }

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
            onClick={() => router.push('/dashboard')}
            title="Settings"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </Button>
          
          {/* User menu with dropdown */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="outline"
              size="sm"
              className={`p-2 transition-colors ${
                userMenuOpen
                  ? 'border-quantum-500/50 bg-quantum-500/20 text-quantum-300'
                  : ''
              }`}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              title="User menu"
            >
              <UserCircleIcon className="w-4 h-4" />
            </Button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-900 border border-white/10 shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-white font-medium truncate">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-white/50 truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleDashboard}
                    className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                  >
                    <ChartBarIcon className="w-4 h-4 mr-3" />
                    Dashboard
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
