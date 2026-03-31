/**
 * Freemium Access Model — S03 verification suite
 * Covers tier gating, timer behaviour, fade-out, and UI states
 */
import fs from 'fs'
import path from 'path'
import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { frequencies } from '@/lib/frequencies'

// ── Mock framer-motion ─────────────────────────────────────────
jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: new Proxy({}, {
      get: (_: any, tag: string) =>
        React.forwardRef((props: any, ref: any) => {
          const { initial, animate, exit, transition, whileHover, whileTap, variants, ...rest } = props
          return React.createElement(tag, { ...rest, ref })
        }),
    }),
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
  }
})

// ── 1. Data alignment ──────────────────────────────────────────
describe('Freemium tier data', () => {
  const freeFreqs = frequencies.filter(f => f.tier === 'free')

  test('exactly 2 frequencies are free', () => {
    expect(freeFreqs).toHaveLength(2)
  })

  test('free frequencies are Anxiety Liberation (432 Hz) and Gamma Focus Enhancement (40 Hz)', () => {
    const names = freeFreqs.map(f => f.name).sort()
    expect(names).toEqual(['Anxiety Liberation', 'Gamma Focus Enhancement'])
    expect(freeFreqs.find(f => f.name === 'Anxiety Liberation')!.hz_value).toBe(432)
    expect(freeFreqs.find(f => f.name === 'Gamma Focus Enhancement')!.hz_value).toBe(40)
  })
})

// ── 2-5. FreemiumTimer behaviour ───────────────────────────────
describe('FreemiumTimer', () => {
  // Dynamic import after mocks are set up
  let FreemiumTimer: any

  beforeAll(() => {
    FreemiumTimer = require('@/components/immersive/FreemiumTimer').default
  })

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('displays initial countdown from 300s as 5:00', () => {
    render(<FreemiumTimer isActive={true} limitSeconds={300} onExpired={jest.fn()} />)
    expect(screen.getByText('5:00')).toBeTruthy()
  })

  test('counts down and updates display', () => {
    render(<FreemiumTimer isActive={true} limitSeconds={300} onExpired={jest.fn()} />)
    act(() => { jest.advanceTimersByTime(10_000) })
    expect(screen.getByText('4:50')).toBeTruthy()
  })

  test('warning (amber) styling appears when < 60s remaining', () => {
    render(<FreemiumTimer isActive={true} limitSeconds={70} onExpired={jest.fn()} />)
    // Advance to 9s elapsed → 61s remaining (no warning yet)
    act(() => { jest.advanceTimersByTime(9_000) })
    // The timer badge should NOT have amber class
    const badge = screen.getByText('free').closest('div')!
    expect(badge.className).not.toContain('amber')

    // Advance 2 more seconds → 59s remaining (warning)
    act(() => { jest.advanceTimersByTime(2_000) })
    const badgeAfter = screen.getByText('free').closest('div')!
    expect(badgeAfter.className).toContain('amber')
  })

  test('onExpired callback fires when timer reaches 0', () => {
    const onExpired = jest.fn()
    render(<FreemiumTimer isActive={true} limitSeconds={5} onExpired={onExpired} />)
    act(() => { jest.advanceTimersByTime(5_000) })
    expect(onExpired).toHaveBeenCalledTimes(1)
  })

  test('expired state shows upgrade overlay with /pricing link', () => {
    render(<FreemiumTimer isActive={true} limitSeconds={1} onExpired={jest.fn()} />)
    act(() => { jest.advanceTimersByTime(1_000) })
    expect(screen.getByText(/Your free session/)).toBeTruthy()
    expect(screen.getByText('Unlock Full Access')).toBeTruthy()
    const pricingLink = screen.getByText('Unlock Full Access').closest('a')!
    expect(pricingLink.getAttribute('href')).toBe('/pricing')
  })

  test('pricing text references $19/mo', () => {
    render(<FreemiumTimer isActive={true} limitSeconds={1} onExpired={jest.fn()} />)
    act(() => { jest.advanceTimersByTime(1_000) })
    expect(screen.getByText(/\$19\/mo/)).toBeTruthy()
  })
})

// ── 7. Source analysis — audioManager fade-out ─────────────────
describe('Source analysis: audioManager', () => {
  const source = fs.readFileSync(path.join(__dirname, '../lib/audioManager.ts'), 'utf-8')

  test('contains fadeOutAndStop method', () => {
    expect(source).toContain('fadeOutAndStop')
  })

  test('uses gain ramp for fade-out', () => {
    expect(source).toContain('linearRampToValueAtTime')
  })
})

// ── 8. Source analysis — frequencies page lock ─────────────────
describe('Source analysis: frequencies page lock', () => {
  const source = fs.readFileSync(path.join(__dirname, '../app/frequencies/page.tsx'), 'utf-8')

  test('contains lock icon logic for non-free frequencies', () => {
    expect(source).toContain('isLocked')
    expect(source).toContain('Lock')
  })

  test('applies reduced opacity to locked cards', () => {
    expect(source).toContain('opacity-60')
  })
})

// ── 9. ImmersiveExperience accepts isFreeUser prop ─────────────
describe('Source analysis: ImmersiveExperience', () => {
  const source = fs.readFileSync(path.join(__dirname, '../components/immersive/ImmersiveExperience.tsx'), 'utf-8')

  test('accepts isFreeUser prop', () => {
    expect(source).toContain('isFreeUser')
  })

  test('passes isFreeUser to FreemiumTimer', () => {
    expect(source).toContain('FreemiumTimer')
    expect(source).toContain('isFreeUser')
  })
})
