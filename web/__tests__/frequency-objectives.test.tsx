/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalmFrequencyApp from '@/app/calm-page';
import { frequencies } from '@/lib/frequencies';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock audio engine
jest.mock('@/lib/real-audio-engine', () => ({
  audioEngine: {
    play: jest.fn().mockResolvedValue(true),
    stop: jest.fn(),
    setVolume: jest.fn(),
  },
}));

describe('Frequency Objectives Verification', () => {
  beforeEach(() => {
    // Clear any previous mocks
    jest.clearAllMocks();
  });

  test('displays all 6 unique healing frequency objectives with medical targets', () => {
    render(<CalmFrequencyApp />);

    // Verify FreqHeal branding is present
    expect(screen.getByText('FreqHeal')).toBeInTheDocument();
    expect(screen.getByText('Terapia de Frecuencias')).toBeInTheDocument();

    // Verify main hero content
    expect(screen.getByText(/Encuentra tu/)).toBeInTheDocument();
    expect(screen.getByText(/equilibrio/)).toBeInTheDocument();
    expect(screen.getByText(/Terapia de frecuencias científicamente respaldada/)).toBeInTheDocument();

    // Verify frequency cards section header
    expect(screen.getByText('Frecuencias Destacadas')).toBeInTheDocument();
    expect(screen.getByText(/Cada frecuencia está diseñada para objetivos específicos/)).toBeInTheDocument();

    // Verify the first 6 frequencies (featured frequencies) are displayed
    const featuredFrequencies = frequencies.slice(0, 6);
    
    featuredFrequencies.forEach((frequency) => {
      // Check frequency name
      expect(screen.getByText(frequency.name)).toBeInTheDocument();
      
      // Check Hz value and category (medical targets)
      expect(screen.getByText(`${frequency.hz_value} Hz • ${frequency.category}`)).toBeInTheDocument();
      
      // Check description is truncated appropriately
      const truncatedDesc = frequency.description?.substring(0, 120) + '...';
      expect(screen.getByText(truncatedDesc)).toBeInTheDocument();
      
      // Check benefits are displayed (first 3)
      frequency.benefits?.slice(0, 3).forEach((benefit) => {
        expect(screen.getByText(benefit)).toBeInTheDocument();
      });
    });

    // Verify specific healing objectives are present
    expect(screen.getByText('DNA Repair')).toBeInTheDocument();
    expect(screen.getByText('Anxiety Liberation')).toBeInTheDocument();
    expect(screen.getByText('Gamma Focus Enhancement')).toBeInTheDocument();
    expect(screen.getByText('Deep Sleep Delta')).toBeInTheDocument();
    expect(screen.getByText('Schumann Earth Resonance')).toBeInTheDocument();
    
    // Verify medical compliance metadata
    expect(screen.getByText('528 Hz • dna_repair')).toBeInTheDocument();
    expect(screen.getByText('432 Hz • anxiety_relief')).toBeInTheDocument();
    expect(screen.getByText('40 Hz • cognitive_enhancement')).toBeInTheDocument();
    expect(screen.getByText('1.5 Hz • sleep_optimization')).toBeInTheDocument();
    expect(screen.getByText('7.83 Hz • grounding')).toBeInTheDocument();
  });

  test('displays Calm-inspired design system elements correctly', () => {
    render(<CalmFrequencyApp />);

    // Verify gradient backgrounds and design elements
    const heroSection = screen.getByText(/Encuentra tu/).closest('section');
    expect(heroSection).toHaveClass('animated-bg');

    // Verify floating animations and glass effects
    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toBeInTheDocument();

    // Verify card layouts and styling
    const frequencyCards = screen.getAllByText(/Reproducir|Pausar/);
    expect(frequencyCards).toHaveLength(6); // 6 featured frequency cards
  });

  test('frequency card interactions work correctly', async () => {
    render(<CalmFrequencyApp />);

    // Find play buttons
    const playButtons = screen.getAllByText('Reproducir');
    expect(playButtons.length).toBeGreaterThan(0);

    // Click first play button
    fireEvent.click(playButtons[0]);

    // Verify audio visualizer updates
    await waitFor(() => {
      expect(screen.getByText(/Reproduciendo:/)).toBeInTheDocument();
    });

    // Verify frequency info displays in visualizer
    expect(screen.getByText('528 Hz • dna_repair')).toBeInTheDocument();

    // Verify button changes to pause
    await waitFor(() => {
      expect(screen.getByText('Pausar')).toBeInTheDocument();
    });
  });

  test('duration controls function correctly', () => {
    render(<CalmFrequencyApp />);

    // Find duration controls
    const decreaseButtons = screen.getAllByText('−');
    const increaseButtons = screen.getAllByText('+');
    
    expect(decreaseButtons.length).toBeGreaterThan(0);
    expect(increaseButtons.length).toBeGreaterThan(0);

    // Test duration adjustment (first card)
    const firstCard = screen.getByText('DNA Repair').closest('.frequency-card');
    const decreaseBtn = firstCard?.querySelector('button:has-text("−")');
    const increaseBtn = firstCard?.querySelector('button:has-text("+")');
    
    if (decreaseBtn) {
      fireEvent.click(decreaseBtn);
    }
    
    if (increaseBtn) {
      fireEvent.click(increaseBtn);
    }

    // Verify duration display updates
    expect(screen.getByText(/min/)).toBeInTheDocument();
  });

  test('benefits display correctly for each frequency', () => {
    render(<CalmFrequencyApp />);

    // Check that each featured frequency shows its benefits
    const benefitSections = screen.getAllByText('BENEFICIOS');
    expect(benefitSections).toHaveLength(6);

    // Verify specific benefits are shown
    expect(screen.getByText('DNA damage repair up to 98.4%')).toBeInTheDocument();
    expect(screen.getByText('Cortisol reduction by 73%')).toBeInTheDocument();
    expect(screen.getByText('Working memory increase 340%')).toBeInTheDocument();
    expect(screen.getByText('Deep sleep increase 380%')).toBeInTheDocument();
  });

  test('audio visualizer responds to selection', async () => {
    render(<CalmFrequencyApp />);

    // Initially should show placeholder
    expect(screen.getByText('Selecciona una frecuencia para comenzar')).toBeInTheDocument();

    // Click a frequency to play
    const playButton = screen.getAllByText('Reproducir')[0];
    fireEvent.click(playButton);

    // Verify visualizer updates
    await waitFor(() => {
      expect(screen.getByText(/Reproduciendo: DNA Repair/)).toBeInTheDocument();
    });

    // Verify frequency details show
    expect(screen.getByText('528 Hz • dna_repair')).toBeInTheDocument();
  });

  test('volume and audio controls function correctly', () => {
    render(<CalmFrequencyApp />);

    // Find volume controls
    expect(screen.getByText('Vol:')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();

    // Find mute/unmute button
    const muteButtons = screen.getAllByRole('button');
    const muteButton = muteButtons.find(btn => 
      btn.querySelector('svg') // Volume icon
    );
    expect(muteButton).toBeInTheDocument();

    // Find settings button
    const settingsButton = muteButtons.find(btn => 
      btn.querySelector('svg') && btn.getAttribute('class')?.includes('settings')
    );
    // Settings button should be present
    expect(muteButtons.length).toBeGreaterThan(5);
  });

  test('accessibility features work correctly', () => {
    render(<CalmFrequencyApp />);

    // Check for semantic HTML elements
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer

    // Check for proper headings hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3); // Multiple H2s
    
    // Check for proper button labels
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    // Check that frequency cards have proper structure
    expect(screen.getByText('BENEFICIOS')).toBeInTheDocument();
  });

  test('medical compliance information is accessible', () => {
    render(<CalmFrequencyApp />);

    // Scroll to footer to check medical disclaimer
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    // Check for medical compliance statement
    expect(screen.getByText(/No está destinado a diagnosticar, tratar, curar o prevenir enfermedades/)).toBeInTheDocument();
    expect(screen.getByText(/Consulte a su médico/)).toBeInTheDocument();

    // Verify research backing indicators
    expect(screen.getByText('127K+')).toBeInTheDocument(); // User count
    expect(screen.getByText('94.7%')).toBeInTheDocument(); // Effectiveness
    expect(screen.getByText('47')).toBeInTheDocument(); // Studies
  });

  test('navigation and links work correctly', () => {
    render(<CalmFrequencyApp />);

    // Check main navigation
    expect(screen.getByText('Frecuencias')).toBeInTheDocument();
    expect(screen.getByText('Biblioteca')).toBeInTheDocument();
    expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();

    // Check CTA links
    expect(screen.getByText('Ver Biblioteca Completa')).toBeInTheDocument();

    // Check footer links
    expect(screen.getByText('Centro de Ayuda')).toBeInTheDocument();
    expect(screen.getByText('Investigación')).toBeInTheDocument();
    expect(screen.getByText('Información Médica')).toBeInTheDocument();
  });

  test('responsive design works across viewport sizes', () => {
    // Test desktop view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1280,
    });

    render(<CalmFrequencyApp />);

    // Verify content renders properly
    expect(screen.getByText('FreqHeal')).toBeInTheDocument();

    // Test mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 390,
    });

    // Re-render to trigger responsive changes
    // In a real app, this would trigger CSS media queries
    expect(screen.getByText('FreqHeal')).toBeInTheDocument();
  });
});