import { useEffect, useRef } from 'react'

export const useAnimationFrame = (
  callback: (deltaTime: number) => void,
  isActive: boolean = true
) => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const shouldStopRef = useRef(false)

  const animate = (time: number) => {
    if (shouldStopRef.current) return

    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    
    // Fallback for environments without requestAnimationFrame
    if (typeof requestAnimationFrame !== 'undefined') {
      requestRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    shouldStopRef.current = false
    
    if (isActive && typeof requestAnimationFrame !== 'undefined') {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      if (requestRef.current && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(requestRef.current)
      }
    }

    return () => {
      shouldStopRef.current = true
      if (requestRef.current && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isActive])

  return {
    stop: () => {
      shouldStopRef.current = true
      if (requestRef.current && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }
}