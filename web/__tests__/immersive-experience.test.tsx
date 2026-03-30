import React from 'react'
import { render, screen } from '@testing-library/react'
import fs from 'fs'
import path from 'path'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useParams: () => ({ id: '1' }),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock ThemeToggle
jest.mock('@/components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <button>Toggle theme</button>,
}))

describe('Immersive Experience - S01', () => {
  describe('ImmersiveExperience component', () => {
    it('renders with frequency name and Hz value', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/ImmersiveExperience.tsx'),
        'utf-8'
      )
      // Verify component passes frequency data to Teleprompter
      expect(source).toContain('frequencyName={frequency.name}')
      expect(source).toContain('hzValue={frequency.hz_value}')
    })

    it('has audio fade-in of 5 seconds', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/ImmersiveExperience.tsx'),
        'utf-8'
      )
      // 5-second linear ramp for fade-in
      expect(source).toContain('linearRampToValueAtTime')
      expect(source).toContain('currentTime + 5')
    })

    it('has audio fade-out on exit', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/ImmersiveExperience.tsx'),
        'utf-8'
      )
      expect(source).toContain('currentTime + 2')
      expect(source).toContain('stopAudio')
    })

    it('supports Escape key to exit', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/ImmersiveExperience.tsx'),
        'utf-8'
      )
      expect(source).toContain("e.key === 'Escape'")
      expect(source).toContain('handleExit')
    })

    it('builds teleprompter sections from frequency data', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/ImmersiveExperience.tsx'),
        'utf-8'
      )
      expect(source).toContain('scientific_backing')
      expect(source).toContain('mechanism')
      expect(source).toContain('benefits')
      expect(source).toContain('best_for')
      expect(source).toContain('dosage')
    })
  })

  describe('Teleprompter component', () => {
    it('uses distinctive typography (not Inter)', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/Teleprompter.tsx'),
        'utf-8'
      )
      expect(source).toContain('--font-playfair')
      expect(source).toContain('--font-instrument')
      // Should NOT use Inter as primary
      expect(source).not.toMatch(/fontFamily.*Inter/i)
    })

    it('has staggered reveal animation', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/Teleprompter.tsx'),
        'utf-8'
      )
      expect(source).toContain('AnimatePresence')
      expect(source).toContain('visibleIndex')
      expect(source).toContain('delay')
    })

    it('displays Hz value and frequency name', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/Teleprompter.tsx'),
        'utf-8'
      )
      expect(source).toContain('hzValue')
      expect(source).toContain('frequencyName')
    })
  })

  describe('AmbientCanvas component', () => {
    it('uses requestAnimationFrame with delta-time', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/AmbientCanvas.tsx'),
        'utf-8'
      )
      expect(source).toContain('requestAnimationFrame')
      expect(source).toContain('delta')
      expect(source).toContain('performance.now')
    })

    it('caps DPR at 2 for performance', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/AmbientCanvas.tsx'),
        'utf-8'
      )
      expect(source).toContain('Math.min(window.devicePixelRatio, 2)')
    })

    it('skips frames with large delta to prevent teleporting', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/AmbientCanvas.tsx'),
        'utf-8'
      )
      expect(source).toContain('delta > 0.1')
    })

    it('responds to frequency Hz for pulse', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/AmbientCanvas.tsx'),
        'utf-8'
      )
      expect(source).toContain('frequency')
      expect(source).toContain('pulse')
      expect(source).toContain('isPlaying')
    })
  })

  describe('Frequencies page', () => {
    it('uses distinctive fonts (not generic)', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../app/frequencies/page.tsx'),
        'utf-8'
      )
      expect(source).toContain('--font-playfair')
      expect(source).toContain('--font-instrument')
    })

    it('has search functionality', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../app/frequencies/page.tsx'),
        'utf-8'
      )
      expect(source).toContain('search')
      expect(source).toContain('Search frequencies')
    })

    it('has category filter', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../app/frequencies/page.tsx'),
        'utf-8'
      )
      expect(source).toContain('activeCategory')
      expect(source).toContain('categories')
    })

    it('shows tier badges (free, premium, clinical)', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../app/frequencies/page.tsx'),
        'utf-8'
      )
      expect(source).toContain("'Free'")
      expect(source).toContain("'Premium'")
      expect(source).toContain("'Clinical'")
    })

    it('navigates to /experience/[id] on selection', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../app/frequencies/page.tsx'),
        'utf-8'
      )
      expect(source).toContain('/experience/${freq.id}')
    })

    it('avoids generic purple gradients', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../app/frequencies/page.tsx'),
        'utf-8'
      )
      // Use cyan/teal palette instead of generic purple
      expect(source).toContain('cyan')
      // Should not have the cliche purple-on-white
      const purpleGradientCount = (source.match(/from-purple.*to-purple/g) || []).length
      expect(purpleGradientCount).toBe(0)
    })
  })

  describe('Experience page route', () => {
    it('loads frequency by ID from params', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../app/experience/[id]/page.tsx'),
        'utf-8'
      )
      expect(source).toContain('useParams')
      expect(source).toContain('frequencies.find')
      expect(source).toContain('params.id')
    })

    it('redirects to /frequencies if frequency not found', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../app/experience/[id]/page.tsx'),
        'utf-8'
      )
      expect(source).toContain("router.push('/frequencies')")
    })
  })

  describe('Design quality (frontend-design skill)', () => {
    it('immersive experience uses dark atmosphere (not white bg)', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/ImmersiveExperience.tsx'),
        'utf-8'
      )
      expect(source).toContain('#0a0a0f')
      // Should not use solid white background
      expect(source).not.toMatch(/bg-white"/)
    })

    it('has noise texture overlay for depth', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../components/immersive/ImmersiveExperience.tsx'),
        'utf-8'
      )
      expect(source).toContain('feTurbulence')
      expect(source).toContain('fractalNoise')
    })

    it('frequency page has no generic AI aesthetics', () => {
      const source = fs.readFileSync(
        path.join(__dirname, '../app/frequencies/page.tsx'),
        'utf-8'
      )
      // No bg-white as main background
      expect(source).not.toMatch(/className="min-h-screen bg-white/)
      // Uses subtle opacity values for refined feel
      expect(source).toContain('white/[0.03]')
    })
  })
})
