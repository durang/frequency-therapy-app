'use client'

import { useState } from 'react'
import { Frequency } from '@/types'
import { useAuth } from '@/lib/authState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  PlayIcon, 
  PlusIcon, 
  LockClosedIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'

interface FrequencyCardProps {
  frequency: Frequency
  isActive?: boolean
  onSelect: (frequency: Frequency) => void
  onShowDetails?: (frequency: Frequency) => void
  className?: string
}

const tierColors = {
  free: 'bg-green-500/20 text-green-300 border-green-400/50',
  basic: 'bg-blue-500/20 text-blue-300 border-blue-400/50',
  pro: 'bg-purple-500/20 text-purple-300 border-purple-400/50',
  clinical: 'bg-red-500/20 text-red-300 border-red-400/50'
}

const tierLabels = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
  clinical: 'Clinical'
}

export function FrequencyCard({ 
  frequency, 
  isActive = false, 
  onSelect, 
  onShowDetails, 
  className = '' 
}: FrequencyCardProps) {
  const { user, hasSubscriptionTier } = useAuth()
  const [showAccessMessage, setShowAccessMessage] = useState(false)
  
  // Check if user has access to this frequency tier
  const hasAccess = hasSubscriptionTier(frequency.tier)
  
  // Handle frequency selection with tier validation
  const handleSelect = () => {
    if (!user) {
      setShowAccessMessage(true)
      setTimeout(() => setShowAccessMessage(false), 3000)
      console.log('🔒 [FrequencyCard] Access denied: Authentication required')
      return
    }
    
    if (!hasAccess) {
      setShowAccessMessage(true)
      setTimeout(() => setShowAccessMessage(false), 3000)
      console.log('🔒 [FrequencyCard] Access denied: Insufficient tier for', frequency.name, 'requires', frequency.tier)
      return
    }
    
    onSelect(frequency)
    console.log('✅ [FrequencyCard] Frequency selected:', frequency.name)
  }
  
  // Handle details view
  const handleShowDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onShowDetails) {
      onShowDetails(frequency)
    }
  }
  
  // Get tier-specific styling
  const tierColorClass = tierColors[frequency.tier]
  const tierLabel = tierLabels[frequency.tier]
  
  return (
    <Card
      variant="glass"
      className={`
        cursor-pointer transition-all duration-200 hover:scale-[1.02] relative
        ${isActive ? 'ring-2 ring-quantum-400 bg-quantum-500/10' : ''}
        ${!hasAccess ? 'opacity-60' : ''}
        ${className}
      `}
      onClick={handleSelect}
    >
      {/* Access denied overlay */}
      {showAccessMessage && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center p-4">
            <LockClosedIcon className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <p className="text-sm font-medium text-white mb-1">
              {!user ? 'Login Required' : 'Upgrade Required'}
            </p>
            <p className="text-xs text-white/60">
              {!user 
                ? 'Sign in to access frequencies' 
                : `${tierLabel} tier required for this frequency`
              }
            </p>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium text-white line-clamp-1">
              {frequency.name}
            </CardTitle>
            
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-quantum-400 font-mono text-xs">
                {frequency.hz_value} Hz
              </span>
              
              <Badge 
                variant="outline" 
                className={`text-xs px-2 py-0.5 ${tierColorClass}`}
              >
                {tierLabel}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            {/* Details button */}
            {onShowDetails && (
              <Button
                variant="secondary"
                size="sm"
                className="p-1.5 opacity-70 hover:opacity-100"
                onClick={handleShowDetails}
              >
                <InformationCircleIcon className="w-3 h-3" />
              </Button>
            )}
            
            {/* Access indicator and action button */}
            {!hasAccess ? (
              <div className="flex items-center">
                <LockClosedIcon className="w-4 h-4 text-red-400" />
              </div>
            ) : (
              <Button
                variant={isActive ? 'quantum' : 'outline'}
                size="sm"
                className="p-1.5"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect()
                }}
              >
                {isActive ? <PlayIcon className="w-3 h-3" /> : <PlusIcon className="w-3 h-3" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="text-xs text-white/60 line-clamp-2 mb-3">
          {frequency.description}
        </CardDescription>
        
        {/* Benefits tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {frequency.best_for.slice(0, 2).map((use, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-neural-500/20 text-neural-300 rounded-full"
            >
              {use}
            </span>
          ))}
          {frequency.best_for.length > 2 && (
            <span className="text-xs text-white/40 py-1">
              +{frequency.best_for.length - 2} more
            </span>
          )}
        </div>
        
        {/* Frequency metadata */}
        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center space-x-3">
            <span>{frequency.duration_minutes}min</span>
            {frequency.clinical_trials && frequency.clinical_trials.length > 0 && (
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Clinical</span>
              </span>
            )}
          </div>
          
          {/* Tier requirement warning */}
          {!hasAccess && (
            <div className="flex items-center space-x-1 text-amber-400">
              <ExclamationTriangleIcon className="w-3 h-3" />
              <span className="text-xs">Upgrade</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}