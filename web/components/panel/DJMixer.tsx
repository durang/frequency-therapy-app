'use client'

import { usePanel } from '@/lib/panelState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon, 
  SpeakerWaveIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline'

export function DJMixer() {
  const { 
    activeFrequencies,
    masterVolume,
    isPlaying,
    setMasterVolume,
    togglePlayback,
    stopPlayback,
    updateFrequencyVolume,
    deactivateFrequency,
    clearActiveFrequencies
  } = usePanel()

  const handleVolumeChange = (frequencyId: string, volume: number) => {
    updateFrequencyVolume(frequencyId, volume / 100)
  }

  const handleMasterVolumeChange = (volume: number) => {
    setMasterVolume(volume / 100)
  }

  return (
    <div className="h-full flex flex-col p-6">
      {/* DJ Panel Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">DJ Mixer</h2>
          <p className="text-white/60 text-sm">Professional frequency control panel</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={isPlaying ? 'neural' : 'quantum'}
            onClick={togglePlayback}
            className="px-6"
          >
            {isPlaying ? <PauseIcon className="w-5 h-5 mr-2" /> : <PlayIcon className="w-5 h-5 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => stopPlayback()}
            className="px-4"
          >
            <StopIcon className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            onClick={clearActiveFrequencies}
            className="px-4 text-red-300 border-red-300/30 hover:bg-red-500/10"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Master Controls */}
      <Card variant="neural" className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center">
            <SpeakerWaveIcon className="w-5 h-5 mr-2" />
            Master Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <span className="text-white/70 text-sm font-medium w-20">Volume</span>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume * 100}
                onChange={(e) => handleMasterVolumeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <span className="text-quantum-400 font-mono text-sm w-12 text-right">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs text-white/50">
            <span>Status: {isPlaying ? 'Playing' : 'Stopped'}</span>
            <span>Active: {activeFrequencies.length}/4 channels</span>
          </div>
        </CardContent>
      </Card>

      {/* Active Frequency Channels */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
          Active Frequencies
        </h3>
        
        {activeFrequencies.length === 0 ? (
          <Card variant="glass" className="h-64 flex items-center justify-center">
            <div className="text-center text-white/50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
                <PlayIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-medium mb-2">No Active Frequencies</h4>
              <p className="text-sm">Select frequencies from the library to add them to your mix</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeFrequencies.map((activeFreq, index) => (
              <Card key={activeFreq.frequency.id} variant="quantum" className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium text-white truncate">
                        {activeFreq.frequency.name}
                      </CardTitle>
                      <div className="text-quantum-400 font-mono text-xs mt-1">
                        {activeFreq.frequency.hz_value} Hz
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deactivateFrequency(activeFreq.frequency.id)}
                      className="p-1 ml-2 text-red-300 border-red-300/30 hover:bg-red-500/10"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Channel Volume Control */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-white/70">Channel {index + 1}</span>
                        <span className="text-xs font-mono text-quantum-400">
                          {Math.round(activeFreq.volume * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={activeFreq.volume * 100}
                        onChange={(e) => handleVolumeChange(activeFreq.frequency.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    
                    {/* Waveform Placeholder */}
                    <div className="h-12 bg-black/30 rounded border border-white/10 flex items-center justify-center">
                      <div className="flex space-x-0.5">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-quantum-400 rounded"
                            style={{
                              height: `${Math.random() * 100}%`,
                              opacity: isPlaying ? 0.8 : 0.3,
                              animation: isPlaying ? `pulse-wave ${0.5 + Math.random()}s ease-in-out infinite` : 'none'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Frequency Info */}
                    <div className="text-xs text-white/60 space-y-1">
                      <div>Category: <span className="capitalize">{activeFreq.frequency.category.replace('_', ' ')}</span></div>
                      <div>Duration: {activeFreq.frequency.duration_minutes}min</div>
                      <div className={`flex items-center space-x-1 ${activeFreq.active ? 'text-green-400' : 'text-yellow-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${activeFreq.active ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        <span>{activeFreq.active ? 'Active' : 'Standby'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Empty Channel Slots */}
            {Array.from({ length: 4 - activeFrequencies.length }).map((_, i) => (
              <Card key={`empty-${i}`} variant="glass" className="opacity-50">
                <CardContent className="h-48 flex items-center justify-center">
                  <div className="text-center text-white/30">
                    <div className="w-8 h-8 mx-auto mb-2 rounded border-2 border-dashed border-white/30" />
                    <div className="text-xs">Channel {activeFrequencies.length + i + 1}</div>
                    <div className="text-xs">Empty</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* EQ and Effects Section Placeholder */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">EQ Controls</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-white/50 text-center py-8">
              Coming Soon
            </CardContent>
          </Card>
          
          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">Audio Effects</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-white/50 text-center py-8">
              Coming Soon
            </CardContent>
          </Card>
          
          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">Biometric Sync</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-white/50 text-center py-8">
              Coming Soon
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}