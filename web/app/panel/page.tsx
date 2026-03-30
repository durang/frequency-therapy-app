'use client'

import { useAuth } from '@/lib/authState'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PanelLayout } from '@/components/panel/PanelLayout'
import '../../styles/panel-responsive.css'

export default function PanelPage() {
  const { user, initializing, isSuperadmin } = useAuth()
  const router = useRouter()
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isSuperadminMode, setIsSuperadminMode] = useState(false)

  // Check for demo mode and superadmin mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      setIsDemoMode(urlParams.get('demo') === 'true')
      setIsSuperadminMode(urlParams.get('superadmin') === 'true')
    }
  }, [])

  const hasAccess = !!user || isDemoMode || isSuperadminMode

  useEffect(() => {
    if (!initializing && !hasAccess) {
      // Redirect to login if not authenticated and not in demo/superadmin mode
      router.push('/auth/login?from=panel')
    }
  }, [user, initializing, router, hasAccess])

  // Show loading state during initialization
  if (initializing && !isDemoMode && !isSuperadminMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-quantum-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing panel...</p>
        </div>
      </div>
    )
  }

  // Show login redirect if not authenticated
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Redirecting to login...</p>
          <div className="w-12 h-12 border-4 border-quantum-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {isSuperadmin && (
        <div className="bg-purple-600/90 text-white text-center py-2 px-4 text-sm font-medium">
          🔑 Superadmin Mode — Clinical tier, all features unlocked
        </div>
      )}
      {isDemoMode && !isSuperadmin && (
        <div className="bg-yellow-600/90 text-white text-center py-2 px-4 text-sm">
          🧪 Demo Mode Active - Full functionality without authentication
        </div>
      )}
      <PanelLayout demoMode={isDemoMode || isSuperadminMode} />
    </div>
  )
}