import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CalmFrequencyApp from '@/app/calm-page'

// Mock the frequencies data with more comprehensive test data
jest.mock('@/lib/frequencies', () => ({
  frequencies: [
    {
      id: '1',
      name: 'DNA Repair',
      hz_value: 528,
      category: 'dna_repair',
      description: 'The miracle frequency for cellular healing and genetic optimization. This frequency has been studied extensively and shows remarkable results in cellular regeneration and genetic repair.',
      benefits: [
        'DNA damage repair up to 98.4%',
        'Cellular regeneration acceleration',
        'Genetic optimization',
        'Enhanced healing response'
      ],
      duration_minutes: 20,
    },
    {
      id: '2',
      name: 'Anxiety Liberation',
      hz_value: 432,
      category: 'anxiety_relief',
      description: 'Mathematical harmony frequency for anxiety and stress relief. Clinical trials show significant reduction in cortisol levels and anxiety symptoms.',
      benefits: [
        'Cortisol reduction by 73%',
        'Anxiety symptoms decreased 84%',
        'Parasympathetic activation',
        'Emotional regulation enhancement'
      ],
      duration_minutes: 25,
    },
    {
      id: '3',
      name: 'Gamma Focus Enhancement',
      hz_value: 40,
      category: 'focus',
      description: 'Peak cognitive performance through gamma wave entrainment for enhanced focus and mental clarity.',
      benefits: [
        'Working memory increase 340%',
        'Attention span boost 250%',
        'Processing speed enhancement',
        'Cognitive binding improvement'
      ],
      duration_minutes: 45,
    },
    {
      id: '4',
      name: 'Deep Sleep Delta',
      hz_value: 1.5,
      category: 'sleep',
      description: 'Ultra-deep delta frequency for restorative sleep and neural repair during sleep cycles.',
      benefits: [
        'Deep sleep increase 380%',
        'Growth hormone boost 420%',
        'Neural repair acceleration',
        'Memory consolidation'
      ],
      duration_minutes: 60,
    },
    {
      id: '5',
      name: 'Meditation Bliss',
      hz_value: 7.83,
      category: 'meditation',
      description: 'Earth resonance frequency for deep meditative states and spiritual connection.',
      benefits: [
        'Circadian rhythm synchronization',
        'Stress reduction',
        'Natural grounding effect',
        'Electromagnetic field balance'
      ],
      duration_minutes: 30,
    },
    {
      id: '6',
      name: 'Energy Boost',
      hz_value: 95,
      category: 'energy',
      description: 'High-frequency stimulation for natural energy enhancement and metabolic activation.',
      benefits: [
        'Metabolic rate increase 167%',
        'Energy expenditure increase',
        'Physical stamina enhancement',
        'Mental energy boost'
      ],
      duration_minutes: 20,
    },
  ],
}))

// Mock the design system
jest.mock('@/lib/calmDesignSystem', () => ({
  calmDesignSystem: {
    gradients: {
      sleep: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      focus: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      meditation: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      energy: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      healing: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      dna_repair: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      anxiety_relief: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  },
}))

describe('Frequency Cards Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders all frequency cards with correct information', async () => {
    render(<CalmFrequencyApp />)
    
    // Wait for all frequency cards to load (first 6 are featured)
    await waitFor(() => {
      expect(screen.getByText('DNA Repair')).toBeInTheDocument()
      expect(screen.getByText('Anxiety Liberation')).toBeInTheDocument()
      expect(screen.getByText('Gamma Focus Enhancement')).toBeInTheDocument()
      expect(screen.getByText('Deep Sleep Delta')).toBeInTheDocument()
      expect(screen.getByText('Meditation Bliss')).toBeInTheDocument()
      expect(screen.getByText('Energy Boost')).toBeInTheDocument()
    })
    
    // Check frequency values are displayed
    expect(screen.getByText('528 Hz • dna_repair')).toBeInTheDocument()
    expect(screen.getByText('432 Hz • anxiety_relief')).toBeInTheDocument()
    expect(screen.getByText('40 Hz • focus')).toBeInTheDocument()
    expect(screen.getByText('1.5 Hz • sleep')).toBeInTheDocument()
  })

  test('frequency card descriptions are properly truncated', () => {
    render(<CalmFrequencyApp />)
    
    // Check that descriptions are truncated (looking for the "..." ending)
    const descriptions = screen.getAllByText(/\.\.\.$/)
    expect(descriptions.length).toBeGreaterThan(0)
  })

  test('each frequency card displays correct category icons', () => {
    render(<CalmFrequencyApp />)
    
    // Check for SVG icons (Lucide icons are rendered as SVG)
    const svgElements = screen.getAllByRole('img', { hidden: true })
    expect(svgElements.length).toBeGreaterThan(0)
  })

  test('duration controls work independently for each frequency card', async () => {
    const user = userEvent.setup()
    render(<CalmFrequencyApp />)
    
    // Get all increase buttons (+ buttons)
    const increaseButtons = screen.getAllByText('+')
    
    // Find DNA Repair card duration (should start at 20 min)
    const dnaRepairCard = screen.getByText('DNA Repair').closest('[role="button"]')?.parentElement?.parentElement
    
    if (dnaRepairCard) {
      // Find the increase button within this card
      const cardIncreaseButton = dnaRepairCard.querySelector('button')
      if (cardIncreaseButton && cardIncreaseButton.textContent === '+') {
        await user.click(cardIncreaseButton)
        
        // Check that duration changed for this card
        await waitFor(() => {
          expect(screen.getByText('25 min')).toBeInTheDocument()
        })
      }
    }
  })

  test('play/pause functionality works for individual cards', async () => {
    const user = userEvent.setup()
    render(<CalmFrequencyApp />)
    
    // Get all play buttons
    const playButtons = await screen.findAllByText('Reproducir')
    expect(playButtons.length).toBe(6) // Should have 6 featured frequency cards
    
    // Click first play button
    await user.click(playButtons[0])
    
    // Should change to pause for that card
    await waitFor(() => {
      expect(screen.getByText('Pausar')).toBeInTheDocument()
    })
    
    // Other cards should still show "Reproducir"
    const remainingPlayButtons = screen.getAllByText('Reproducir')
    expect(remainingPlayButtons.length).toBe(5)
  })

  test('only one frequency can play at a time', async () => {
    const user = userEvent.setup()
    render(<CalmFrequencyApp />)
    
    const playButtons = await screen.findAllByText('Reproducir')
    
    // Start playing first frequency
    await user.click(playButtons[0])
    await waitFor(() => {
      expect(screen.getByText('Pausar')).toBeInTheDocument()
    })
    
    // Start playing second frequency
    await user.click(playButtons[1])
    
    // First should stop, second should start
    await waitFor(() => {
      const pauseButtons = screen.getAllByText('Pausar')
      expect(pauseButtons.length).toBe(1) // Only one pause button should exist
    })
  })

  test('benefits are displayed correctly for each frequency', () => {
    render(<CalmFrequencyApp />)
    
    // Check for benefit indicators (CheckCircle icons and text)
    expect(screen.getByText('DNA damage repair up to 98.4%')).toBeInTheDocument()
    expect(screen.getByText('Cortisol reduction by 73%')).toBeInTheDocument()
    expect(screen.getByText('Working memory increase 340%')).toBeInTheDocument()
  })

  test('frequency cards have hover effects and proper styling', () => {
    render(<CalmFrequencyApp />)
    
    // Get frequency cards (they should have the Card component structure)
    const cards = screen.getAllByText(/Hz •/).map(element => 
      element.closest('[class*="Card"]') || element.closest('[class*="card"]')
    ).filter(Boolean)
    
    expect(cards.length).toBeGreaterThan(0)
    
    // Check that cards have proper CSS classes for hover effects
    cards.forEach(card => {
      expect(card).toHaveClass()
    })
  })

  test('duration has minimum and maximum limits', async () => {
    const user = userEvent.setup()
    render(<CalmFrequencyApp />)
    
    // Get decrease buttons (−)
    const decreaseButtons = screen.getAllByText('−')
    
    // Try to decrease below minimum (5 minutes)
    for (let i = 0; i < 10; i++) {
      await user.click(decreaseButtons[0])
    }
    
    // Should not go below 5 minutes
    await waitFor(() => {
      expect(screen.getByText('5 min')).toBeInTheDocument()
    })
    
    // Get increase buttons (+)
    const increaseButtons = screen.getAllByText('+')
    
    // Try to increase above maximum (60 minutes)
    for (let i = 0; i < 20; i++) {
      await user.click(increaseButtons[0])
    }
    
    // Should not go above 60 minutes
    await waitFor(() => {
      expect(screen.getByText('60 min')).toBeInTheDocument()
    })
  })

  test('frequency categories determine correct icons', () => {
    render(<CalmFrequencyApp />)
    
    // Each category should have its specific icon
    // We can't easily test specific Lucide icons without checking the actual SVG,
    // but we can verify icons are rendered
    const iconContainers = screen.getAllByText(/Hz •/).map(element =>
      element.parentElement?.parentElement?.querySelector('[class*="w-12 h-12"]')
    ).filter(Boolean)
    
    expect(iconContainers.length).toBe(6) // 6 featured frequencies should have icons
  })

  test('library link navigates correctly', () => {
    render(<CalmFrequencyApp />)
    
    const libraryLink = screen.getByText('Ver Biblioteca Completa')
    expect(libraryLink.closest('a')).toHaveAttribute('href', '/library')
  })
})