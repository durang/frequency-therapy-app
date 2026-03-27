// Spatial Audio Manager — PannerNode coordination layer
// Manages per-frequency 3D spatial positioning with HRTF/equalpower fallback
// and animated movement patterns (circular, pendulum, spiral)

export type MovementPattern = 'static' | 'circular' | 'pendulum' | 'spiral'

export interface SpatialPosition {
  x: number // -1 (left) to 1 (right)
  y: number // -1 (below) to 1 (above)
  z: number // -1 (near) to 1 (far)
}

interface PannerEntry {
  node: PannerNode
  panningModel: PanningModelType
}

interface MovementEntry {
  pattern: MovementPattern
  speed: number
  angle: number
  rafId: number
  lastTime: number
}

/** Clamp value to [-1, 1] range for normalized spatial coordinates */
function clampPosition(v: number): number {
  return Math.max(-1, Math.min(1, v))
}

/** Scale a normalized [-1,1] coordinate to a Web Audio world unit range */
function toWorldCoord(normalized: number, range: number = 3): number {
  return normalized * range
}

export class SpatialAudioManager {
  private audioContext: AudioContext | null = null
  private panners: Map<string, PannerEntry> = new Map()
  private movements: Map<string, MovementEntry> = new Map()
  private detectedModel: PanningModelType = 'equalpower'

  /** Bind (or rebind) to an AudioContext. Safe to call multiple times. */
  setAudioContext(ctx: AudioContext): void {
    this.audioContext = ctx
    this.detectPanningModel()
  }

  /** Detect best available panning model on current AudioContext */
  private detectPanningModel(): void {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      console.warn('🌐 [SpatialAudio] Cannot detect panning model — context closed or null')
      return
    }
    try {
      const test = this.audioContext.createPanner()
      test.panningModel = 'HRTF'
      this.detectedModel = 'HRTF'
      test.disconnect()
      console.log('🌐 [SpatialAudio] HRTF panning model available')
    } catch {
      this.detectedModel = 'equalpower'
      console.log('🌐 [SpatialAudio] HRTF not available, using equalpower fallback')
    }
  }

  /**
   * Create a PannerNode for the given frequency id.
   * Returns the PannerNode (caller wires it into the signal chain).
   * Falls back to equalpower if HRTF fails.
   */
  createPannerNode(frequencyId: string): PannerNode | null {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      console.warn('🌐 [SpatialAudio] Cannot create PannerNode — AudioContext closed or null', {
        contextState: this.audioContext?.state ?? 'null',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      })
      return null
    }

    // Clean up any existing panner for this id
    this.removePannerNode(frequencyId)

    let panningModel: PanningModelType = this.detectedModel
    let node: PannerNode

    try {
      node = this.audioContext.createPanner()
      node.panningModel = panningModel
      node.distanceModel = 'inverse'
      node.refDistance = 1
      node.maxDistance = 10
      node.rolloffFactor = 1
      node.coneInnerAngle = 360
      node.coneOuterAngle = 360
      // Default centre position
      node.positionX.value = 0
      node.positionY.value = 0
      node.positionZ.value = 0
    } catch (err) {
      // HRTF failed — retry with equalpower
      if (panningModel === 'HRTF') {
        console.warn('🌐 [SpatialAudio] HRTF PannerNode creation failed, retrying with equalpower', err)
        try {
          panningModel = 'equalpower'
          node = this.audioContext.createPanner()
          node.panningModel = 'equalpower'
          node.distanceModel = 'inverse'
          node.refDistance = 1
          node.maxDistance = 10
          node.rolloffFactor = 1
          node.positionX.value = 0
          node.positionY.value = 0
          node.positionZ.value = 0
        } catch (err2) {
          console.error('🌐 [SpatialAudio] PannerNode creation failed completely', {
            error: err2,
            contextState: this.audioContext.state,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          })
          return null
        }
      } else {
        console.error('🌐 [SpatialAudio] PannerNode creation failed', err)
        return null
      }
    }

    this.panners.set(frequencyId, { node, panningModel })
    console.log(`🌐 [SpatialAudio] Created PannerNode for "${frequencyId}" (model: ${panningModel})`)
    return node
  }

  /**
   * Update the spatial position of a frequency's PannerNode.
   * Coordinates are normalized [-1, 1] and clamped before applying.
   */
  updatePosition(frequencyId: string, position: SpatialPosition): void {
    const entry = this.panners.get(frequencyId)
    if (!entry) return

    const x = toWorldCoord(clampPosition(position.x))
    const y = toWorldCoord(clampPosition(position.y))
    const z = toWorldCoord(clampPosition(position.z))

    entry.node.positionX.value = x
    entry.node.positionY.value = y
    entry.node.positionZ.value = z
  }

  /** Remove and disconnect a PannerNode, stopping any active movement. */
  removePannerNode(frequencyId: string): void {
    this.stopMovementPattern(frequencyId)

    const entry = this.panners.get(frequencyId)
    if (entry) {
      try {
        entry.node.disconnect()
      } catch {
        // already disconnected — safe to ignore
      }
      this.panners.delete(frequencyId)
      console.log(`🌐 [SpatialAudio] Removed PannerNode for "${frequencyId}"`)
    }
  }

  /**
   * Start an automated movement pattern for a frequency's PannerNode.
   * Uses requestAnimationFrame for smooth 60fps animation.
   */
  startMovementPattern(frequencyId: string, pattern: MovementPattern, speed: number = 1): void {
    if (pattern === 'static') {
      this.stopMovementPattern(frequencyId)
      return
    }

    const entry = this.panners.get(frequencyId)
    if (!entry) return

    // Stop any existing pattern first
    this.stopMovementPattern(frequencyId)

    const movement: MovementEntry = {
      pattern,
      speed,
      angle: 0,
      rafId: 0,
      lastTime: performance.now(),
    }

    const animate = (now: number) => {
      const dt = (now - movement.lastTime) / 1000 // seconds
      movement.lastTime = now
      movement.angle += dt * movement.speed

      let x = 0
      let y = 0
      let z = 0

      switch (movement.pattern) {
        case 'circular':
          x = Math.cos(movement.angle) * 0.8
          z = Math.sin(movement.angle) * 0.8
          break
        case 'pendulum':
          x = Math.sin(movement.angle) * 0.9
          break
        case 'spiral': {
          const radius = 0.3 + (Math.sin(movement.angle * 0.2) * 0.5 + 0.5) * 0.5
          x = Math.cos(movement.angle) * radius
          z = Math.sin(movement.angle) * radius
          y = Math.sin(movement.angle * 0.5) * 0.3
          break
        }
      }

      // Apply via position AudioParams (not deprecated setPosition)
      entry.node.positionX.value = toWorldCoord(x)
      entry.node.positionY.value = toWorldCoord(y)
      entry.node.positionZ.value = toWorldCoord(z)

      movement.rafId = requestAnimationFrame(animate)
    }

    movement.rafId = requestAnimationFrame(animate)
    this.movements.set(frequencyId, movement)
    console.log(`🌐 [SpatialAudio] Started "${pattern}" movement for "${frequencyId}" (speed: ${speed}x)`)
  }

  /** Stop the movement animation for a frequency. */
  stopMovementPattern(frequencyId: string): void {
    const movement = this.movements.get(frequencyId)
    if (movement) {
      cancelAnimationFrame(movement.rafId)
      this.movements.delete(frequencyId)
      console.log(`🌐 [SpatialAudio] Stopped movement for "${frequencyId}"`)
    }
  }

  /** Get the number of active PannerNodes (for observability/metrics). */
  getActiveNodeCount(): number {
    return this.panners.size
  }

  /** Get the panning model in use (for observability/metrics). */
  getPanningModel(): PanningModelType {
    return this.detectedModel
  }

  /** Check if a frequency has a panner node. */
  hasPannerNode(frequencyId: string): boolean {
    return this.panners.has(frequencyId)
  }

  /** Tear down all PannerNodes and movement patterns. */
  destroy(): void {
    for (const id of Array.from(this.panners.keys())) {
      this.removePannerNode(id)
    }
    console.log('🌐 [SpatialAudio] Destroyed all spatial nodes')
  }
}

// Singleton instance
export const spatialAudioManager = new SpatialAudioManager()

// React hook for spatial audio manager access
export function useSpatialAudio() {
  return {
    manager: spatialAudioManager,
    createPannerNode: (id: string) => spatialAudioManager.createPannerNode(id),
    updatePosition: (id: string, pos: SpatialPosition) => spatialAudioManager.updatePosition(id, pos),
    removePannerNode: (id: string) => spatialAudioManager.removePannerNode(id),
    startMovementPattern: (id: string, pattern: MovementPattern, speed?: number) =>
      spatialAudioManager.startMovementPattern(id, pattern, speed),
    stopMovementPattern: (id: string) => spatialAudioManager.stopMovementPattern(id),
    getActiveNodeCount: () => spatialAudioManager.getActiveNodeCount(),
    getPanningModel: () => spatialAudioManager.getPanningModel(),
  }
}
