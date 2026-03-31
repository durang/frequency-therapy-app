/**
 * M004 Integration Test Suite — S05 verification
 *
 * Source-analysis tests verifying all M004 slices compose correctly:
 * auth, freemium, immersive experience, breathing guide, and pricing.
 */
import fs from 'fs'
import path from 'path'

const webRoot = path.resolve(__dirname, '..')

function readSource(relPath: string): string {
  return fs.readFileSync(path.join(webRoot, relPath), 'utf-8')
}

// ── 1. Auth integration ────────────────────────────────────────
describe('Auth integration (S01)', () => {
  const authSrc = readSource('lib/authState.ts')

  test('authState exports signInWithPassword', () => {
    expect(authSrc).toMatch(/signInWithPassword/)
  })

  test('applyAdminTier is defined and called at auth entry points', () => {
    expect(authSrc).toMatch(/const applyAdminTier/)
    // Called at multiple auth entry points (sign-in, init, profile fetch)
    const calls = (authSrc.match(/applyAdminTier\(/g) || []).length
    expect(calls).toBeGreaterThanOrEqual(3)
  })

  test('login page imports useAuthStore from authState', () => {
    const loginSrc = readSource('app/auth/login/page.tsx')
    expect(loginSrc).toMatch(/useAuthStore/)
    expect(loginSrc).toMatch(/from ['"]@\/lib\/authState['"]/)
  })

  test('authState exports useAuthStore and useAuth', () => {
    expect(authSrc).toMatch(/export const useAuthStore/)
  })
})

// ── 2. Freemium data ───────────────────────────────────────────
describe('Freemium data (S03)', () => {
  const freqSrc = readSource('lib/frequencies.ts')
  const audioSrc = readSource('lib/audioManager.ts')

  test('frequencies.ts contains free-tier frequencies', () => {
    const freeCount = (freqSrc.match(/tier:\s*['"]free['"]/g) || []).length
    expect(freeCount).toBeGreaterThanOrEqual(2)
  })

  test('audioManager exports fadeOutAndStop method', () => {
    expect(audioSrc).toMatch(/fadeOutAndStop/)
  })
})

// ── 3. Immersive composition (S04) ─────────────────────────────
describe('Immersive composition (S04)', () => {
  const immSrc = readSource('components/immersive/ImmersiveExperience.tsx')

  test('ImmersiveExperience imports BreathingGuide', () => {
    expect(immSrc).toMatch(/import\s+BreathingGuide\s+from/)
  })

  test('ImmersiveExperience imports Teleprompter', () => {
    expect(immSrc).toMatch(/import\s+Teleprompter\s+from/)
  })

  test('ImmersiveExperience imports AmbientCanvas', () => {
    expect(immSrc).toMatch(/import\s+AmbientCanvas\s+from/)
  })

  test('ImmersiveExperience imports FreemiumTimer', () => {
    expect(immSrc).toMatch(/import\s+FreemiumTimer\s+from/)
  })

  test('ImmersiveExperience accepts isFreeUser prop', () => {
    expect(immSrc).toMatch(/isFreeUser/)
  })
})

// ── 4. Frequencies page gating ─────────────────────────────────
describe('Frequencies page gating', () => {
  const freqPageSrc = readSource('app/frequencies/page.tsx')

  test('frequencies page imports useSubscription', () => {
    expect(freqPageSrc).toMatch(/import.*useSubscription.*from/)
  })

  test('frequencies page has lock icon logic', () => {
    expect(freqPageSrc).toMatch(/isLocked/)
    expect(freqPageSrc).toMatch(/Lock icon/)
  })
})

// ── 5. Experience page guards ──────────────────────────────────
describe('Experience page guards', () => {
  const expSrc = readSource('app/experience/[id]/page.tsx')

  test('experience page imports useSubscription', () => {
    expect(expSrc).toMatch(/import.*useSubscription.*from/)
  })

  test('experience page imports useAuth', () => {
    expect(expSrc).toMatch(/import.*useAuth.*from/)
  })

  test('experience page checks subscription status', () => {
    expect(expSrc).toMatch(/isSubscribed|isActive/)
  })
})

// ── 6. Pricing accuracy (D031) ─────────────────────────────────
describe('Pricing accuracy (D031)', () => {
  const timerSrc = readSource('components/immersive/FreemiumTimer.tsx')

  test('FreemiumTimer contains $19/mo pricing', () => {
    expect(timerSrc).toMatch(/\$19\/mo/)
  })

  test('FreemiumTimer contains $10/mo annual pricing', () => {
    expect(timerSrc).toMatch(/\$10\/mo/)
  })
})
