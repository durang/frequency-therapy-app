'use client'

import { useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { usePanelStore } from '@/lib/panelState'
import { spatialAudioManager } from '@/lib/spatialAudioManager'

// Channel color mapping for frequency nodes
const CHANNEL_COLORS: Record<number, { ring: string; bg: string; shadow: string }> = {
  0: { ring: 'border-purple-400', bg: 'bg-purple-500/30', shadow: 'rgba(168,85,247,0.5)' },
  1: { ring: 'border-blue-400', bg: 'bg-blue-500/30', shadow: 'rgba(96,165,250,0.5)' },
  2: { ring: 'border-green-400', bg: 'bg-green-500/30', shadow: 'rgba(74,222,128,0.5)' },
  3: { ring: 'border-amber-400', bg: 'bg-amber-500/30', shadow: 'rgba(251,191,36,0.5)' },
}

function getChannelColor(index: number) {
  return CHANNEL_COLORS[index % 4] ?? CHANNEL_COLORS[0]
}

interface DragNodeProps {
  frequencyId: string
  name: string
  hz: number
  channelIndex: number
  initialX: number
  initialY: number
  containerWidth: number
  containerHeight: number
  movementPattern?: string
}

function DragNode({
  frequencyId,
  name,
  hz,
  channelIndex,
  initialX,
  initialY,
  containerWidth,
  containerHeight,
  movementPattern,
}: DragNodeProps) {
  const constraintsRef = useRef<HTMLDivElement | null>(null)
  const updateSpatialPosition = usePanelStore((s) => s.updateSpatialPosition)
  const color = getChannelColor(channelIndex)

  // Motion values for 60fps drag performance — updates happen outside React render
  const motionX = useMotionValue(initialX)
  const motionY = useMotionValue(initialY)

  // Push position to spatial audio manager outside React render cycle
  useEffect(() => {
    const unsubX = motionX.on('change', (latestX) => {
      const normX = containerWidth > 0 ? (latestX / (containerWidth / 2)) : 0
      const normY = containerHeight > 0 ? (motionY.get() / (containerHeight / 2)) : 0
      spatialAudioManager.updatePosition(frequencyId, {
        x: Math.max(-1, Math.min(1, normX)),
        y: 0,
        z: Math.max(-1, Math.min(1, normY)),
      })
    })
    const unsubY = motionY.on('change', (latestY) => {
      const normX = containerWidth > 0 ? (motionX.get() / (containerWidth / 2)) : 0
      const normY = containerHeight > 0 ? (latestY / (containerHeight / 2)) : 0
      spatialAudioManager.updatePosition(frequencyId, {
        x: Math.max(-1, Math.min(1, normX)),
        y: 0,
        z: Math.max(-1, Math.min(1, normY)),
      })
    })
    return () => {
      unsubX()
      unsubY()
    }
  }, [frequencyId, motionX, motionY, containerWidth, containerHeight])

  // Persist final position to Zustand on drag end
  const handleDragEnd = useCallback(() => {
    const normX = containerWidth > 0 ? (motionX.get() / (containerWidth / 2)) : 0
    const normY = containerHeight > 0 ? (motionY.get() / (containerHeight / 2)) : 0
    updateSpatialPosition(frequencyId, {
      x: Math.max(-1, Math.min(1, normX)),
      y: 0,
      z: Math.max(-1, Math.min(1, normY)),
    })
  }, [frequencyId, motionX, motionY, containerWidth, containerHeight, updateSpatialPosition])

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef.current ? constraintsRef : undefined}
      dragElastic={0.1}
      style={{ x: motionX, y: motionY }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.15, boxShadow: `0 0 20px ${color.shadow}` }}
      className={`absolute left-1/2 top-1/2 -ml-7 -mt-7 w-14 h-14 rounded-full cursor-grab active:cursor-grabbing
        flex flex-col items-center justify-center
        border-2 ${color.ring} ${color.bg} backdrop-blur-sm
        select-none z-10 touch-none`}
    >
      <span className="text-[10px] font-semibold text-white truncate max-w-[48px] leading-tight">
        {name}
      </span>
      <span className="text-[9px] text-white/70 font-mono">{hz}Hz</span>
      {movementPattern && movementPattern !== 'static' && (
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-quantum-400 animate-pulse" />
      )}
    </motion.div>
  )
}

export function SpatialArena() {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeFrequencies = usePanelStore((s) => s.activeFrequencies)
  const spatialEnabled = usePanelStore((s) => s.spatialEnabled)
  const toggleSpatial = usePanelStore((s) => s.toggleSpatial)

  // Track container dimensions for normalization
  const containerWidth = containerRef.current?.clientWidth ?? 400
  const containerHeight = containerRef.current?.clientHeight ?? 220

  if (!spatialEnabled) {
    return null
  }

  return (
    <div className="px-6 pb-4">
      <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
        {/* Arena header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-quantum-400 animate-pulse" />
            Spatial Audio
          </h3>
          <button
            onClick={toggleSpatial}
            className="text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            Hide
          </button>
        </div>

        {/* Arena container */}
        <div
          ref={containerRef}
          className="relative w-full h-[220px] overflow-hidden"
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Concentric depth zone circles */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full border border-white/[0.08]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border border-white/[0.08]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full border border-white/[0.08]" />

          {/* Horizontal center line (L/R axis) */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-mono">L</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-mono">R</span>

          {/* Vertical center line (Near/Far axis) */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10" />
          <span className="absolute left-1/2 -translate-x-1/2 top-1 text-[10px] text-white/30 font-mono">Near</span>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-1 text-[10px] text-white/30 font-mono">Far</span>

          {/* Drag nodes per active frequency */}
          {activeFrequencies.map((af, idx) => {
            const sp = af.spatialPosition ?? { x: 0, y: 0, z: 0 }
            const halfW = containerWidth / 2
            const halfH = containerHeight / 2
            return (
              <DragNode
                key={af.frequency.id}
                frequencyId={af.frequency.id}
                name={af.frequency.name}
                hz={af.frequency.hz_value}
                channelIndex={idx}
                initialX={sp.x * halfW}
                initialY={sp.z * halfH}
                containerWidth={containerWidth}
                containerHeight={containerHeight}
                movementPattern={af.movementPattern}
              />
            )
          })}

          {/* Empty state */}
          {activeFrequencies.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">
              Add frequencies to position them in space
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
