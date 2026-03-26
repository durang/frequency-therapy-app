import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('Next.js 16 Integration', () => {
  test('HomePage component integrates correctly with CalmFrequencyApp', () => {
    render(<HomePage />)
    
    // Should render the main page without errors
    expect(screen.getByText(/Encuentra tu/)).toBeInTheDocument()
    expect(screen.getByText(/equilibrio/)).toBeInTheDocument()
  })

  test('Client-side rendering works correctly', () => {
    // This tests that the 'use client' directive works properly
    render(<HomePage />)
    
    // Should have interactive elements that require client-side JS
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})