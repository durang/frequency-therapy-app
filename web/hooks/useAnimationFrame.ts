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
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    shouldStopRef.current = false
    
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }

    return () => {
      shouldStopRef.current = true
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isActive])

  return {
    stop: () => {
      shouldStopRef.current = true
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }
}