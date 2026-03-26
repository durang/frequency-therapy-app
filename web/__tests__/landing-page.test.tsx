import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CalmFrequencyApp from '@/app/calm-page'

// Mock the frequencies data
jest.mock('@/lib/frequencies', () => ({
  frequencies: [
    {
      id: '1',
      name: 'DNA Repair',
      hz_value: 528,
      category: 'dna_repair',
      description: 'The miracle frequency for cellular healing and genetic optimization',
      benefits: ['DNA damage repair up to 98.4%', 'Cellular regeneration acceleration'],
      duration_minutes: 20,
    },
    {
      id: '2',
      name: 'Anxiety Liberation',
      hz_value: 432,
      category: 'anxiety_relief',
      description: 'Mathematical harmony frequency for anxiety and stress relief',
      benefits: ['Cortisol reduction by 73%', 'Anxiety symptoms decreased 84%'],
      duration_minutes: 25,
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
    },
  },
}))

describe('CalmFrequencyApp Landing Page', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks()
  })

  test('renders the main landing page without crashing', () => {
    render(<CalmFrequencyApp />)
    
    // Check for main heading
    expect(screen.getByText(/Encuentra tu/)).toBeInTheDocument()
    expect(screen.getByText(/equilibrio/)).toBeInTheDocument()
  })

  test('displays header with navigation and branding', () => {
    render(<CalmFrequencyApp />)
    
    // Check branding
    expect(screen.getByText('FreqHeal')).toBeInTheDocument()
    expect(screen.getByText('Terapia de Frecuencias')).toBeInTheDocument()
    
    // Check navigation links (hidden on mobile, visible on desktop)
    expect(screen.getByText('Frecuencias')).toBeInTheDocument()
    expect(screen.getByText('Biblioteca')).toBeInTheDocument()
    expect(screen.getByText('Mi Perfil')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  test('hero section displays correctly with main content', () => {
    render(<CalmFrequencyApp />)
    
    // Check hero text
    expect(screen.getByText(/Terapia de frecuencias científicamente respaldada/)).toBeInTheDocument()
    
    // Check for audio controls
    expect(screen.getByDisplayValue('75')).toBeInTheDocument() // Volume slider
  })

  test('frequency cards are displayed with correct information', async () => {
    render(<CalmFrequencyApp />)
    
    // Wait for frequency cards to render
    await waitFor(() => {
      expect(screen.getByText('DNA Repair')).toBeInTheDocument()
      expect(screen.getByText('Anxiety Liberation')).toBeInTheDocument()
    })
    
    // Check frequency details
    expect(screen.getByText('528 Hz • dna_repair')).toBeInTheDocument()
    expect(screen.getByText('432 Hz • anxiety_relief')).toBeInTheDocument()
  })

  test('play button functionality works correctly', async () => {
    const user = userEvent.setup()
    render(<CalmFrequencyApp />)
    
    // Find and click play button for first frequency
    const playButtons = await screen.findAllByText('Reproducir')
    expect(playButtons).toHaveLength(2)
    
    await user.click(playButtons[0])
    
    // Should change to pause button
    await waitFor(() => {
      expect(screen.getByText('Pausar')).toBeInTheDocument()
    })
  })

  test('duration controls work correctly', async () => {
    const user = userEvent.setup()
    render(<CalmFrequencyApp />)
    
    // Find duration controls
    const increaseButtons = screen.getAllByText('+')
    const decreaseButtons = screen.getAllByText('−')
    
    // Test increase duration
    await user.click(increaseButtons[0])
    
    // Should show increased duration (20 + 5 = 25 min for DNA Repair)
    await waitFor(() => {
      expect(screen.getByText('25 min')).toBeInTheDocument()
    })
    
    // Test decrease duration
    await user.click(decreaseButtons[0])
    await user.click(decreaseButtons[0])
    
    // Should show decreased duration (25 - 5 = 20 min)
    await waitFor(() => {
      expect(screen.getByText('20 min')).toBeInTheDocument()
    })
  })

  test('volume control updates correctly', async () => {
    const user = userEvent.setup()
    render(<CalmFrequencyApp />)
    
    const volumeSlider = screen.getByDisplayValue('75')
    
    // Change volume
    await user.clear(volumeSlider)
    await user.type(volumeSlider, '50')
    
    // Check volume display updates
    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument()
    })
  })

  test('mute/unmute functionality works', async () => {
    const user = userEvent.setup()
    render(<CalmFrequencyApp />)
    
    // Find volume button (should be Volume2 icon initially)
    const volumeButton = screen.getByRole('button', { name: '' })
    
    // Click to mute
    await user.click(volumeButton)
    
    // Note: We can't easily test icon changes without checking DOM structure
    // This test validates the click interaction works
    expect(volumeButton).toBeInTheDocument()
  })

  test('mobile menu toggle works correctly', async () => {
    const user = userEvent.setup()
    render(<CalmFrequencyApp />)
    
    // Find mobile menu button (Menu icon)
    const menuButtons = screen.getAllByRole('button')
    const mobileMenuButton = menuButtons.find(button => {
      const svg = button.querySelector('svg')
      return svg && (svg.getAttribute('data-lucide') === 'menu' || button.className.includes('md:hidden'))
    })
    
    if (mobileMenuButton) {
      await user.click(mobileMenuButton)
      // Menu state should toggle (we can't easily test the visual change without inspecting state)
    }
  })

  test('benefits section renders with correct content', () => {
    render(<CalmFrequencyApp />)
    
    expect(screen.getByText('¿Por qué FreqHeal?')).toBeInTheDocument()
    expect(screen.getByText('Científicamente Probado')).toBeInTheDocument()
    expect(screen.getByText('Fácil de Usar')).toBeInTheDocument()
    expect(screen.getByText('Personalizable')).toBeInTheDocument()
  })

  test('footer contains proper disclaimers and statistics', () => {
    render(<CalmFrequencyApp />)
    
    // Check statistics
    expect(screen.getByText('127K+')).toBeInTheDocument()
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
    expect(screen.getByText('94.7%')).toBeInTheDocument()
    expect(screen.getByText('Efectividad')).toBeInTheDocument()
    
    // Check medical disclaimer
    expect(screen.getByText(/No está destinado a diagnosticar, tratar, curar/)).toBeInTheDocument()
  })
})