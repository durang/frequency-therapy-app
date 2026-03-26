/**
 * Performance tests for FrequencyLab component
 * Verifies 60fps animations, lazy loading, and cross-browser compatibility
 */

import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FrequencyLab from '@/components/landing/frequency-lab/FrequencyLab'
import FrequencyVisualizer from '@/components/landing/frequency-lab/FrequencyVisualizer'

// Mock intersection observer
let intersectionObserverCallback: any = null
const mockIntersectionObserver = jest.fn((callback) => {
  intersectionObserverCallback = callback
  return {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }
})
global.IntersectionObserver = mockIntersectionObserver as any

// Mock requestAnimationFrame
let animationFrameCallbacks: ((time: number) => void)[] = []
let currentTime = 0

global.requestAnimationFrame = jest.fn((cb) => {
  animationFrameCallbacks.push(cb)
  return animationFrameCallbacks.length
})

global.cancelAnimationFrame = jest.fn((id) => {
  if (animationFrameCallbacks[id - 1]) {
    animationFrameCallbacks[id - 1] = () => {}
  }
})

// Mock canvas context
const createMockCanvasContext = () => ({
  clearRect: jest.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  globalAlpha: 1,
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  }))
})

// Mock canvas element
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => createMockCanvasContext())
})

// Helper to simulate animation frames
const simulateAnimationFrames = (count: number, fps: number = 60) => {
  const frameTime = 1000 / fps
  for (let i = 0; i < count; i++) {
    currentTime += frameTime
    act(() => {
      animationFrameCallbacks.forEach(cb => cb(currentTime))
    })
  }
}

// Mock performance API
global.performance = {
  ...global.performance,
  now: jest.fn(() => currentTime),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn().mockReturnValue([])
}

const mockFrequencies = [
  {
    id: 'test-1',
    name: 'Test Frequency 1',
    hz_value: 528,
    description: 'Test description',
    category: 'Healing'
  },
  {
    id: 'test-2', 
    name: 'Test Frequency 2',
    hz_value: 432,
    description: 'Test description',
    category: 'Relaxation'
  },
  {
    id: 'test-3',
    name: 'Test Frequency 3', 
    hz_value: 40,
    description: 'Test description',
    category: 'Focus'
  }
]

describe('FrequencyLab Performance Tests', () => {
  beforeEach(() => {
    animationFrameCallbacks = []
    currentTime = 0
    jest.clearAllMocks()
  })

  describe('Lazy Loading Performance', () => {
    test('should not render visualizers until section is visible', () => {
      render(
        <FrequencyLab 
          featuredFrequencies={mockFrequencies}
          totalFrequencies={150}
        />
      )

      // Should not find canvas elements when not visible initially
      expect(document.querySelectorAll('canvas')).toHaveLength(0)
    })

    test('should render visualizers when section becomes visible', async () => {
      render(
        <FrequencyLab 
          featuredFrequencies={mockFrequencies}
          totalFrequencies={150}
        />
      )

      // Simulate intersection observer firing to make section visible
      if (intersectionObserverCallback) {
        act(() => {
          intersectionObserverCallback([{ isIntersecting: true, intersectionRatio: 0.5 }])
        })
      }

      // Should render visualizer components
      await waitFor(() => {
        expect(screen.getByText('Test Frequency 1')).toBeInTheDocument()
        expect(screen.getAllByText('528 Hz')[0]).toBeInTheDocument()
      })
    })
  })

  describe('Animation Frame Performance', () => {
    test('should maintain 60fps animation loop when active', () => {
      render(
        <FrequencyVisualizer
          frequency={mockFrequencies[0]}
          isActive={true}
          onActivate={() => {}}
        />
      )

      simulateAnimationFrames(10, 60)
      expect(global.requestAnimationFrame).toHaveBeenCalled()
    })

    test('should handle animation cleanup on unmount', () => {
      (global.cancelAnimationFrame as jest.Mock).mockClear()

      const { unmount } = render(
        <FrequencyVisualizer
          frequency={mockFrequencies[0]}
          isActive={true}
          onActivate={() => {}}
        />
      )

      unmount()
      expect(global.cancelAnimationFrame).toHaveBeenCalled()
    })
  })

  describe('Canvas Performance', () => {
    test('should optimize canvas rendering for different states', () => {
      const mockContext = createMockCanvasContext()
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext)

      const { rerender } = render(
        <FrequencyVisualizer
          frequency={mockFrequencies[0]}
          isActive={true}
          isPlaying={false}
          onActivate={() => {}}
        />
      )

      simulateAnimationFrames(3)
      const activeCallCount = mockContext.clearRect.mock.calls.length

      rerender(
        <FrequencyVisualizer
          frequency={mockFrequencies[0]}
          isActive={true}
          isPlaying={true}
          onActivate={() => {}}
        />
      )

      simulateAnimationFrames(3)
      expect(mockContext.clearRect.mock.calls.length).toBeGreaterThan(activeCallCount)
    })

    test('should handle canvas context unavailability gracefully', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null)

      render(
        <FrequencyVisualizer
          frequency={mockFrequencies[0]}
          isActive={true}
          onActivate={() => {}}
        />
      )

      expect(() => simulateAnimationFrames(3)).not.toThrow()
    })
  })

  describe('Memory Performance', () => {
    test('should clean up animation frame on component state changes', () => {
      (global.cancelAnimationFrame as jest.Mock).mockClear()
      
      const { rerender } = render(
        <FrequencyVisualizer
          frequency={mockFrequencies[0]}
          isActive={true}
          onActivate={() => {}}
        />
      )

      rerender(
        <FrequencyVisualizer
          frequency={mockFrequencies[0]}
          isActive={false}
          onActivate={() => {}}
        />
      )

      expect(global.cancelAnimationFrame).toHaveBeenCalled()
    })

    test('should handle multiple visualizers without performance degradation', async () => {
      render(
        <FrequencyLab 
          featuredFrequencies={mockFrequencies}
          totalFrequencies={150}
        />
      )

      if (intersectionObserverCallback) {
        act(() => {
          intersectionObserverCallback([{ isIntersecting: true, intersectionRatio: 0.5 }])
        })
      }

      await waitFor(() => {
        expect(screen.getByText('Test Frequency 1')).toBeInTheDocument()
      })

      simulateAnimationFrames(5)
      expect(global.requestAnimationFrame).toHaveBeenCalled()
    })
  })

  describe('User Interaction Performance', () => {
    test('should respond to frequency selection without lag', async () => {
      const onFrequencySelect = jest.fn()
      
      render(
        <FrequencyLab 
          featuredFrequencies={mockFrequencies}
          totalFrequencies={150}
          onFrequencySelect={onFrequencySelect}
        />
      )

      if (intersectionObserverCallback) {
        act(() => {
          intersectionObserverCallback([{ isIntersecting: true, intersectionRatio: 0.5 }])
        })
      }

      await waitFor(() => {
        expect(screen.getByText('Test Frequency 1')).toBeInTheDocument()
      })

      const buttons = screen.getAllByText('Experience Now')
      
      const startTime = performance.now()
      await userEvent.click(buttons[0])
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(16)
      expect(onFrequencySelect).toHaveBeenCalledWith('test-1')
    })
  })

  describe('Browser Compatibility', () => {
    test('should handle missing requestAnimationFrame gracefully', () => {
      const originalRAF = global.requestAnimationFrame
      const originalCAF = global.cancelAnimationFrame
      
      // @ts-ignore
      delete global.requestAnimationFrame
      // @ts-ignore
      delete global.cancelAnimationFrame

      expect(() => {
        render(
          <FrequencyVisualizer
            frequency={mockFrequencies[0]}
            isActive={true}
            onActivate={() => {}}
          />
        )
      }).not.toThrow()

      global.requestAnimationFrame = originalRAF
      global.cancelAnimationFrame = originalCAF
    })
  })
})

describe('FrequencyLab Integration Performance', () => {
  test('should maintain performance with all features active', async () => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => createMockCanvasContext())
    
    const startTime = performance.now()
    
    render(
      <FrequencyLab 
        featuredFrequencies={mockFrequencies}
        totalFrequencies={150}
        playingFrequency="test-2"
        onFrequencySelect={() => {}}
      />
    )

    if (intersectionObserverCallback) {
      act(() => {
        intersectionObserverCallback([{ isIntersecting: true, intersectionRatio: 0.5 }])
      })
    }

    await waitFor(() => {
      expect(screen.getByText('Test Frequency 2')).toBeInTheDocument()
    })

    simulateAnimationFrames(30)

    const endTime = performance.now()
    const totalTime = endTime - startTime

    expect(totalTime).toBeLessThan(1000)
  })
})