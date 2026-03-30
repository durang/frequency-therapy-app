/**
 * Frequency Cards Test — Updated for M002
 * Tests the FrequencyCard component used in the panel library
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  PlayIcon: (props: any) => <svg data-testid="play-icon" {...props} />,
  PlusIcon: (props: any) => <svg data-testid="plus-icon" {...props} />,
  LockClosedIcon: (props: any) => <svg data-testid="lock-icon" {...props} />,
  InformationCircleIcon: (props: any) => <svg data-testid="info-icon" {...props} />,
  ExclamationTriangleIcon: (props: any) => <svg data-testid="warning-icon" {...props} />,
}))

// Mock auth state 
jest.mock('@/lib/authState', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { email: 'test@test.com', subscription: { tier: 'clinical' } },
    signOut: jest.fn(),
    hasSubscriptionTier: () => true,
  }),
}))

import { FrequencyCard } from '@/components/panel/FrequencyCard'

const mockOnSelect = jest.fn()

const mockFrequency = {
  id: 'test-freq-1',
  name: 'Alpha Wave Therapy',
  hz_value: 10,
  category: 'relaxation' as const,
  description: 'Alpha wave for deep relaxation',
  scientific_backing: 'Studies show alpha waves reduce stress',
  benefits: ['Relaxation', 'Stress relief'],
  best_for: ['meditation', 'calm'],
  tier: 'free' as const,
  duration_minutes: 30,
}

describe('FrequencyCard Component', () => {
  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  test('renders frequency name', () => {
    render(<FrequencyCard frequency={mockFrequency} onSelect={mockOnSelect} />)
    expect(screen.getByText('Alpha Wave Therapy')).toBeInTheDocument()
  })

  test('displays Hz value', () => {
    render(<FrequencyCard frequency={mockFrequency} onSelect={mockOnSelect} />)
    expect(screen.getByText(/10/)).toBeInTheDocument()
  })

  test('renders without crashing', () => {
    const { container } = render(
      <FrequencyCard frequency={mockFrequency} onSelect={mockOnSelect} />
    )
    expect(container.firstChild).toBeTruthy()
  })

  test('renders for different tiers', () => {
    const tiers = ['free', 'basic', 'pro', 'clinical'] as const
    tiers.forEach(tier => {
      const freq = { ...mockFrequency, id: `test-${tier}`, tier }
      const { unmount } = render(
        <FrequencyCard frequency={freq} onSelect={mockOnSelect} />
      )
      unmount()
    })
  })
})
