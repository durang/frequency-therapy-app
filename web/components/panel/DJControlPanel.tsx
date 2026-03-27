'use client'

import { useEffect, useRef } from 'react'
import { usePanel } from '@/lib/panelState'
import { usePanelAudioEngine } from '@/lib/panelAudioEngine'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AudioFaders } from './AudioFaders'
import { WaveformVisualizer } from './WaveformVisualizer'
import { ControlKnobs } from './ControlKnobs'
import { LayerControls } from './LayerControls'
import { MovementPatternSelector } from './MovementPatternSelector'
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon, 
  SpeakerWaveIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  BoltIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export function DJControlPanel() {
  const { 
    activeFrequencies,
    masterVolume,
    isPlaying,
    setMasterVolume,
    togglePlayback,
    stopPlayback,
    startPlayback,
    clearActiveFrequencies
  } = usePanel()
  
  const {
    initialize,
    createFrequencyEngine,
    startFrequency,
    stopFrequency,
    updateMasterVolume,
    stopAllFrequencies,
    getPerformanceMetrics,
    getActiveEngines
  } = usePanelAudioEngine()
  
  const initializeRef = useRef(false)
  const performanceTimerRef = useRef<NodeJS.Timeout>()

  // Initialize audio engine on mount
  useEffect(() => {
    if (!initializeRef.current) {
      initialize()
        .then(() => {
          console.log('🎛️ [DJControlPanel] Audio engine initialized')
          initializeRef.current = true
        })
        .catch((error) => {
          console.error('❌ [DJControlPanel] Audio engine initialization failed:', error)
        })
    }
    
    return () => {
      if (performanceTimerRef.current) {
        clearInterval(performanceTimerRef.current)
      }
    }
  }, [initialize])

  // Sync master volume with audio engine
  useEffect(() => {
    updateMasterVolume(masterVolume)
  }, [masterVolume, updateMasterVolume])

  // Handle frequency activation/deactivation
  useEffect(() => {
    const activeEngines = getActiveEngines()
    const currentActiveIds = activeFrequencies.map(af => af.frequency.id)
    
    // Stop engines that are no longer active
    activeEngines.forEach(engineId => {
      if (!currentActiveIds.includes(engineId)) {
        stopFrequency(engineId)
      }
    })

    // Start new engines
    activeFrequencies.forEach(activeFreq => {
      if (activeFreq.active && !activeEngines.includes(activeFreq.frequency.id)) {
        const config = {
          frequency: activeFreq.frequency.hz_value,
          volume: activeFreq.volume,
          waveform: 'sine' as const,
          binauralBeat: {
            enabled: false,
            beatFrequency: 4,
            carrierLeft: activeFreq.frequency.hz_value,
            carrierRight: activeFreq.frequency.hz_value + 4
          },
          neuralPhaseLocking: {
            enabled: true,
            targetBrainwave: 'alpha' as const,
            harmonics: [activeFreq.frequency.hz_value * 2, activeFreq.frequency.hz_value * 3]
          }
        }
        
        createFrequencyEngine(activeFreq.frequency.id, config)
          .then(() => {
            if (isPlaying) {
              return startFrequency(activeFreq.frequency.id)
            }
          })
          .catch(error => {
            console.error('❌ [DJControlPanel] Failed to create/start frequency engine:', error)
          })
      }
    })
  }, [activeFrequencies, isPlaying, createFrequencyEngine, startFrequency, stopFrequency, getActiveEngines])

  // Handle global playback state changes
  useEffect(() => {
    if (isPlaying) {
      activeFrequencies.forEach(activeFreq => {
        if (activeFreq.active) {
          startFrequency(activeFreq.frequency.id).catch(error => {
            console.error('❌ [DJControlPanel] Failed to start frequency:', error)
          })
        }
      })
    } else {
      stopAllFrequencies()
    }
  }, [isPlaying, activeFrequencies, startFrequency, stopAllFrequencies])

  // Performance monitoring
  useEffect(() => {
    performanceTimerRef.current = setInterval(() => {
      const metrics = getPerformanceMetrics()
      
      // Log performance if there are active engines
      if (metrics.activeEngines > 0) {
        console.log('📊 [DJControlPanel] Performance:', {
          latency: metrics.audioLatency?.toFixed(2) + 'ms',
          activeEngines: metrics.activeEngines,
          sampleRate: metrics.sampleRate,
          parameterChanges: metrics.parameterChangeCount
        })
      }
    }, 5000) // Log every 5 seconds

    return () => {
      if (performanceTimerRef.current) {
        clearInterval(performanceTimerRef.current)
      }
    }
  }, [getPerformanceMetrics])

  const handlePlayPause = () => {
    try {
      togglePlayback()
      console.log('🎛️ [DJControlPanel] Playback toggled:', !isPlaying)
    } catch (error) {
      console.error('❌ [DJControlPanel] Failed to toggle playback:', error)
    }
  }

  const handleStop = () => {
    try {
      stopPlayback()
      stopAllFrequencies()
      console.log('🎛️ [DJControlPanel] All playback stopped')
    } catch (error) {
      console.error('❌ [DJControlPanel] Failed to stop playback:', error)
    }
  }

  const handleClearAll = () => {
    try {
      stopAllFrequencies()
      clearActiveFrequencies()
      console.log('🎛️ [DJControlPanel] All frequencies cleared')
    } catch (error) {
      console.error('❌ [DJControlPanel] Failed to clear frequencies:', error)
    }
  }

  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-b from-slate-900/50 to-black/50">
      {/* DJ Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <BoltIcon className="w-8 h-8 mr-3 text-quantum-400" />
            DJ Control Panel
          </h2>
          <p className="text-white/60 text-sm mt-1">Professional frequency mixer with real-time audio processing</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={isPlaying ? 'neural' : 'quantum'}
            onClick={handlePlayPause}
            className="px-6 py-3 text-lg font-medium"
            disabled={activeFrequencies.length === 0}
          >
            {isPlaying ? <PauseIcon className="w-6 h-6 mr-2" /> : <PlayIcon className="w-6 h-6 mr-2" />}
            {isPlaying ? 'Pause' : 'Play All'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleStop}
            className="px-4 py-3"
            disabled={!isPlaying}
          >
            <StopIcon className="w-6 h-6" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="px-4 py-3 text-red-300 border-red-300/30 hover:bg-red-500/10"
            disabled={activeFrequencies.length === 0}
          >
            <XMarkIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Status and Master Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Status Card */}
        <Card variant="neural" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-quantum-500/10 to-neural-500/10" />
          <CardHeader className="relative">
            <CardTitle className="text-lg text-white flex items-center">
              <HeartIcon className="w-5 h-5 mr-2 text-neural-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Status</span>
                <span className={`text-sm font-medium ${isPlaying ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isPlaying ? 'Playing' : 'Stopped'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Active Channels</span>
                <span className="text-quantum-400 font-mono text-sm">
                  {activeFrequencies.filter(af => af.active).length}/4
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Master Volume</span>
                <span className="text-quantum-400 font-mono text-sm">
                  {Math.round(masterVolume * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Master Volume */}
        <Card variant="quantum" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-quantum-500/10 to-purple-500/10" />
          <CardHeader className="relative">
            <CardTitle className="text-lg text-white flex items-center">
              <SpeakerWaveIcon className="w-5 h-5 mr-2 text-quantum-400" />
              Master Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume * 100}
                onChange={(e) => setMasterVolume(parseInt(e.target.value) / 100)}
                className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider-quantum"
              />
              <div className="flex justify-between text-xs text-white/50">
                <span>0%</span>
                <span className="text-quantum-400 font-mono text-base">
                  {Math.round(masterVolume * 100)}%
                </span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Waveform Overview */}
        <Card variant="glass" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neural-500/5 to-quantum-500/5" />
          <CardHeader className="relative">
            <CardTitle className="text-lg text-white flex items-center">
              <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-neural-400" />
              Master Waveform
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="h-16">
              <WaveformVisualizer 
                frequencyId="master"
                height={64}
                className="w-full"
                showFrequencyDomain={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Frequency Channels */}
      <div className="flex-1 min-h-0">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <AdjustmentsHorizontalIcon className="w-6 h-6 mr-3 text-quantum-400" />
          Active Frequency Channels
        </h3>
        
        {activeFrequencies.length === 0 ? (
          <Card variant="glass" className="h-full flex items-center justify-center">
            <div className="text-center text-white/50">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full border-3 border-dashed border-white/30 flex items-center justify-center">
                <PlayIcon className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-medium mb-3">No Active Frequencies</h4>
              <p className="text-base max-w-md">
                Select frequencies from the library to add them to your DJ mix. 
                Each frequency will appear as a channel with professional controls.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 h-full">
            {activeFrequencies.map((activeFreq, index) => (
              <Card key={activeFreq.frequency.id} variant="neural" className="flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-neural-500/10 via-quantum-500/5 to-transparent" />
                
                <CardHeader className="relative pb-3 flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold text-white truncate">
                        {activeFreq.frequency.name}
                      </CardTitle>
                      <div className="text-quantum-400 font-mono text-sm mt-1">
                        Channel {index + 1} • {activeFreq.frequency.hz_value} Hz
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative flex-1 flex flex-col space-y-4">
                  {/* Audio Faders */}
                  <div className="flex-shrink-0">
                    <AudioFaders 
                      frequencyId={activeFreq.frequency.id}
                      initialVolume={activeFreq.volume}
                    />
                  </div>
                  
                  {/* Waveform Visualizer */}
                  <div className="flex-shrink-0 h-20">
                    <WaveformVisualizer 
                      frequencyId={activeFreq.frequency.id}
                      height={80}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Control Knobs */}
                  <div className="flex-1">
                    <ControlKnobs 
                      frequencyId={activeFreq.frequency.id}
                      frequency={activeFreq.frequency}
                    />
                  </div>

                  {/* Layer Controls */}
                  <div className="flex-shrink-0">
                    <LayerControls
                      frequencyId={activeFreq.frequency.id}
                      frequency={activeFreq.frequency}
                    />
                  </div>

                  {/* Movement Pattern Selector */}
                  <div className="flex-shrink-0">
                    <MovementPatternSelector
                      frequencyId={activeFreq.frequency.id}
                    />
                  </div>
                  
                  {/* Frequency Status */}
                  <div className="flex-shrink-0 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60">
                        {activeFreq.frequency.category.replace('_', ' ')}
                      </span>
                      <div className={`flex items-center space-x-1 ${activeFreq.active ? 'text-green-400' : 'text-yellow-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${activeFreq.active ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
                        <span className="font-medium">
                          {activeFreq.active ? 'Active' : 'Standby'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Empty Channel Slots */}
            {Array.from({ length: Math.max(0, 4 - activeFrequencies.length) }).map((_, i) => (
              <Card key={`empty-${i}`} variant="glass" className="flex items-center justify-center opacity-40">
                <div className="text-center text-white/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
                    <div className="text-2xl font-mono">
                      {activeFrequencies.length + i + 1}
                    </div>
                  </div>
                  <div className="text-sm font-medium">Channel {activeFrequencies.length + i + 1}</div>
                  <div className="text-xs mt-1">Available</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}