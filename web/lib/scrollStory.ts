'use client'

import React from 'react'
import { create } from 'zustand'
import { useScroll, useInView, MotionValue } from 'framer-motion'
import { RefObject, useRef, useCallback, useMemo } from 'react'

// Progressive disclosure sections for medical compliance
export interface ScrollSection {
  id: string
  title: string
  minProgress: number // 0-1, when this section becomes active
  maxProgress: number // 0-1, when this section is fully revealed
  medicalContent?: boolean // Whether this contains medical disclaimers
  required?: boolean // Whether user must read this section
}

// Default scroll story sections
export const defaultScrollSections: ScrollSection[] = [
  {
    id: 'hero',
    title: 'Welcome',
    minProgress: 0,
    maxProgress: 0.2,
    medicalContent: false,
  },
  {
    id: 'how-it-works',
    title: 'How It Works',
    minProgress: 0.2,
    maxProgress: 0.4,
    medicalContent: false,
  },
  {
    id: 'medical-info',
    title: 'Medical Information',
    minProgress: 0.4,
    maxProgress: 0.6,
    medicalContent: true,
    required: true,
  },
  {
    id: 'safety-guidelines',
    title: 'Safety Guidelines',
    minProgress: 0.6,
    maxProgress: 0.8,
    medicalContent: true,
    required: true,
  },
  {
    id: 'start-therapy',
    title: 'Start Your Journey',
    minProgress: 0.8,
    maxProgress: 1.0,
    medicalContent: false,
  },
]

interface ScrollStoryState {
  currentSection: string
  scrollProgress: number
  sectionsRead: Set<string>
  medicalComplianceProgress: number
  isReadyToStart: boolean
  setCurrentSection: (sectionId: string) => void
  setScrollProgress: (progress: number) => void
  markSectionAsRead: (sectionId: string) => void
  calculateComplianceProgress: (sections: ScrollSection[]) => number
  resetProgress: () => void
}

export const useScrollStoryStore = create<ScrollStoryState>((set, get) => ({
  currentSection: 'hero',
  scrollProgress: 0,
  sectionsRead: new Set<string>(),
  medicalComplianceProgress: 0,
  isReadyToStart: false,

  setCurrentSection: (sectionId: string) => {
    set({ currentSection: sectionId })
  },

  setScrollProgress: (progress: number) => {
    set({ scrollProgress: progress })
    
    // Auto-calculate medical compliance based on progress
    const { calculateComplianceProgress } = get()
    const complianceProgress = calculateComplianceProgress(defaultScrollSections)
    
    // User is ready to start when they've scrolled through required medical sections
    const isReadyToStart = complianceProgress >= 1.0
    
    set({ 
      medicalComplianceProgress: complianceProgress,
      isReadyToStart
    })
  },

  markSectionAsRead: (sectionId: string) => {
    set((state) => ({
      sectionsRead: new Set([...Array.from(state.sectionsRead), sectionId])
    }))
  },

  calculateComplianceProgress: (sections: ScrollSection[]) => {
    const { sectionsRead, scrollProgress } = get()
    const requiredSections = sections.filter(s => s.medicalContent && s.required)
    
    if (requiredSections.length === 0) return 1.0
    
    let readCount = 0
    for (const section of requiredSections) {
      // Section is considered "read" if:
      // 1. User has explicitly viewed it (via intersection) AND
      // 2. Scroll progress has passed its minimum threshold
      if (sectionsRead.has(section.id) && scrollProgress >= section.minProgress) {
        readCount++
      }
    }
    
    return readCount / requiredSections.length
  },

  resetProgress: () => {
    set({
      currentSection: 'hero',
      scrollProgress: 0,
      sectionsRead: new Set(),
      medicalComplianceProgress: 0,
      isReadyToStart: false,
    })
  },
}))

// Hook to track scroll progress with performance optimizations
export const useScrollStory = (sections: ScrollSection[] = defaultScrollSections) => {
  const { scrollYProgress } = useScroll()
  const { 
    currentSection, 
    scrollProgress, 
    sectionsRead,
    medicalComplianceProgress,
    isReadyToStart,
    setCurrentSection,
    setScrollProgress,
    markSectionAsRead 
  } = useScrollStoryStore()

  // Performance monitoring ref
  const performanceRef = useRef({
    frameCount: 0,
    lastFrameTime: 0,
    fps: 60
  })

  // Optimized scroll progress handler with 60fps monitoring
  const handleScrollProgress = useCallback((progress: number) => {
    // Performance monitoring
    const now = performance.now()
    const perf = performanceRef.current
    
    if (perf.lastFrameTime > 0) {
      const deltaTime = now - perf.lastFrameTime
      perf.fps = 1000 / deltaTime
      perf.frameCount++
      
      // Log performance warnings if FPS drops below 45
      if (perf.frameCount % 60 === 0 && perf.fps < 45) {
        console.warn('[ScrollStory] Performance warning: FPS below 45:', {
          fps: Math.round(perf.fps),
          frame: perf.frameCount
        })
      }
    }
    perf.lastFrameTime = now

    // Update scroll progress
    setScrollProgress(progress)
    
    // Determine current section
    const activeSection = sections.find(section => 
      progress >= section.minProgress && progress <= section.maxProgress
    )
    
    if (activeSection && activeSection.id !== currentSection) {
      setCurrentSection(activeSection.id)
      console.log('[ScrollStory] Section transition:', {
        from: currentSection,
        to: activeSection.id,
        progress: Math.round(progress * 100) + '%'
      })
    }
  }, [sections, currentSection, setCurrentSection, setScrollProgress])

  // Subscribe to scroll progress changes
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', handleScrollProgress)
    return unsubscribe
  }, [scrollYProgress, handleScrollProgress])

  return {
    scrollProgress,
    currentSection,
    sectionsRead,
    medicalComplianceProgress,
    isReadyToStart,
    sections,
    markSectionAsRead,
    
    // Performance data
    fps: performanceRef.current.fps,
    frameCount: performanceRef.current.frameCount,
  }
}

// Hook for individual section tracking with useInView
export const useScrollSection = (
  sectionId: string,
  options: { threshold?: number; rootMargin?: string } = {}
) => {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, {
    amount: options.threshold || 0.5,
    margin: options.rootMargin || '-20% 0px -20% 0px',
  })
  
  const { markSectionAsRead } = useScrollStoryStore()
  
  // Mark section as read when it comes into view
  React.useEffect(() => {
    if (isInView) {
      markSectionAsRead(sectionId)
      console.log('[ScrollStory] Section viewed:', sectionId)
    }
  }, [isInView, sectionId, markSectionAsRead])
  
  return { ref, isInView }
}

// Utility to get section-based animation variants
export const getSectionVariants = (section: ScrollSection, progress: number) => {
  const sectionProgress = Math.max(0, Math.min(1, 
    (progress - section.minProgress) / (section.maxProgress - section.minProgress)
  ))
  
  return {
    opacity: sectionProgress,
    y: 50 * (1 - sectionProgress),
    scale: 0.95 + (0.05 * sectionProgress),
  }
}

// Medical compliance validation
export const validateMedicalCompliance = (
  medicalComplianceProgress: number,
  sectionsRead: Set<string>
): { isValid: boolean; missingRequirements: string[] } => {
  const requiredSections = defaultScrollSections
    .filter(s => s.medicalContent && s.required)
    .map(s => s.id)
  
  const missingRequirements = requiredSections.filter(
    sectionId => !sectionsRead.has(sectionId)
  )
  
  return {
    isValid: medicalComplianceProgress >= 1.0 && missingRequirements.length === 0,
    missingRequirements,
  }
}

// Performance utilities
export const scrollPerformanceMonitor = {
  startMonitoring: () => {
    const startTime = performance.now()
    let frameCount = 0
    let lastFrame = startTime
    
    const monitor = () => {
      const now = performance.now()
      frameCount++
      
      if (now - lastFrame >= 1000) { // Every second
        const fps = frameCount / ((now - lastFrame) / 1000)
        
        if (fps < 50) {
          console.warn('[ScrollStory] Performance Alert:', {
            fps: Math.round(fps),
            duration: Math.round(now - startTime),
            frames: frameCount
          })
        }
        
        frameCount = 0
        lastFrame = now
      }
      
      requestAnimationFrame(monitor)
    }
    
    requestAnimationFrame(monitor)
  }
}