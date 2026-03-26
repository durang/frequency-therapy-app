'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { frequencies } from '@/lib/frequencies'
import { FrequencyAudioEngine, AudioEngineConfig } from '@/lib/audio-engine'
import { Play, Pause, Square, Volume2, Settings } from 'lucide-react'

interface FrequencyPlayerProps {
  frequencyId?: string
  demo?: boolean
}

export default function FrequencyPlayer({ frequencyId = '1', demo = false }: FrequencyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(20 * 60) // 20 minutes default
  const [volume, setVolume] = useState(0.7)
  const [audioConfig, setAudioConfig] = useState<AudioEngineConfig>({
    frequency: 528,
    volume: 0.7,
    waveform: 'sine',
    binauralBeat: {
      enabled: true,
      beatFrequency: 8
    },
    spatialAudio: {
      enabled: true,
      panPosition: 0
    }
  })

  const audioEngineRef = useRef<FrequencyAudioEngine | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const selectedFrequency = frequencies.find(f => f.id === frequencyId) || frequencies[0]

  useEffect(() => {
    audioEngineRef.current = new FrequencyAudioEngine()
    
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setAudioConfig(prev => ({
      ...prev,
      frequency: selectedFrequency.hz_value
    }))
  }, [selectedFrequency])

  const handlePlay = async () => {
    if (!audioEngineRef.current) return

    try {
      setIsPlaying(true)
      await audioEngineRef.current.startFrequency(audioConfig)
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleStop()
            return duration
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error('Error starting frequency:', error)
      setIsPlaying(false)
    }
  }

  const handlePause = () => {
    if (!audioEngineRef.current) return

    audioEngineRef.current.stopFrequency()
    setIsPlaying(false)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleStop = () => {
    if (!audioEngineRef.current) return

    audioEngineRef.current.stopFrequency()
    setIsPlaying(false)
    setCurrentTime(0)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setAudioConfig(prev => ({ ...prev, volume: newVolume }))
    
    if (audioEngineRef.current && isPlaying) {
      audioEngineRef.current.setVolume(newVolume)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = (currentTime / duration) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-quantum-50 to-neural-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Frequency Info */}
        <Card variant="quantum" glow className="mb-8">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">{selectedFrequency.icon}</div>
            <CardTitle className="text-3xl mb-2">{selectedFrequency.name}</CardTitle>
            <p className="text-xl text-slate-600 mb-2">{selectedFrequency.hz_value} Hz</p>
            <p className="text-slate-600 max-w-md mx-auto">{selectedFrequency.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-quantum-500 to-neural-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={isPlaying ? handlePause : handlePlay}
                variant="quantum"
                size="lg"
                className="w-16 h-16 rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              
              <Button
                onClick={handleStop}
                variant="outline"
                size="lg"
                className="w-12 h-12 rounded-full"
              >
                <Square className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-4">
              <Volume2 className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <span className="text-sm text-slate-600 w-8">{Math.round(volume * 100)}%</span>
            </div>

            {/* Session Info */}
            {demo && (
              <div className="bg-quantum-50 border border-quantum-200 rounded-lg p-4 text-center">
                <p className="text-sm text-quantum-800 font-medium mb-2">🎧 Demo Session</p>
                <p className="text-xs text-quantum-700">
                  Experience the power of {selectedFrequency.name} frequency. 
                  Sign up to unlock unlimited sessions and personalized protocols.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Frequency Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Benefits of {selectedFrequency.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedFrequency.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-quantum-500" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold mb-2">Scientific Basis</h4>
              <ul className="space-y-1">
                {selectedFrequency.scientific_basis.map((basis, index) => (
                  <li key={index} className="text-sm text-slate-600 flex items-start space-x-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>{basis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Other Frequencies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Explore Other Frequencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {frequencies.filter(f => f.tier_required === 'free' && f.id !== frequencyId).map((freq) => (
                <Button
                  key={freq.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-quantum-50"
                  onClick={() => window.location.href = `/therapy?frequency=${freq.id}`}
                >
                  <div className="text-2xl">{freq.icon}</div>
                  <div className="text-xs text-center">
                    <div className="font-medium">{freq.name}</div>
                    <div className="text-slate-500">{freq.hz_value} Hz</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action */}
      {demo && (
        <div className="fixed bottom-6 right-6">
          <Button variant="quantum" size="lg" glow>
            🚀 Unlock All Frequencies
          </Button>
        </div>
      )}
    </div>
  )
}