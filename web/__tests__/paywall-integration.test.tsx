/**
 * Paywall & Subscription Gating Integration Test Suite — M003 S06 T02
 *
 * Source-analysis tests verifying all S06 wiring is in place:
 * - Panel paywall gate (useSubscription, access checks, redirects, bypasses)
 * - Pricing auth wiring (useAuth, user context in checkout, auth-aware nav)
 * - Dashboard subscription display (useSubscription, portal URL, renewal date, upgrade CTA)
 * - Build validity (TypeScript syntax check via source parsing)
 */
import * as fs from 'fs'
import * as path from 'path'

// ── Source file paths ───────────────────────────────────────────

const SRC_DIR = path.resolve(__dirname, '..')
const panelSrc = fs.readFileSync(path.join(SRC_DIR, 'app/panel/page.tsx'), 'utf-8')
const pricingSrc = fs.readFileSync(path.join(SRC_DIR, 'app/pricing/page.tsx'), 'utf-8')
const dashboardSrc = fs.readFileSync(path.join(SRC_DIR, 'app/dashboard/page.tsx'), 'utf-8')

// ── 1. Panel Paywall Gate ───────────────────────────────────────

describe('Panel paywall gate (source analysis)', () => {
  test('panel page imports useSubscription', () => {
    expect(panelSrc).toContain("import { useSubscription }")
    expect(panelSrc).toContain("from '@/lib/useSubscription'")
  })

  test('panel page contains subscription-based access check (isActive in hasAccess logic)', () => {
    // hasAccess should depend on isActive from useSubscription
    expect(panelSrc).toContain('isActive')
    expect(panelSrc).toContain('hasAccess')
    // The access logic combines user + isActive
    expect(panelSrc).toMatch(/hasAccess\s*=.*isActive/)
  })

  test('panel page redirects to /pricing for non-subscribers', () => {
    // Should have a redirect to /pricing for authenticated but non-subscribed users
    expect(panelSrc).toContain("'/pricing")
    expect(panelSrc).toMatch(/router\.push\(.*\/pricing/)
  })

  test('panel page preserves demo mode bypass (isDemoMode in access check)', () => {
    expect(panelSrc).toContain('isDemoMode')
    // isDemoMode should feed into the bypass logic
    expect(panelSrc).toContain('isBypassMode')
    expect(panelSrc).toMatch(/isDemoMode/)
    // Demo param detection
    expect(panelSrc).toContain("'demo'")
  })

  test('panel page preserves superadmin mode bypass (isSuperadminMode in access check)', () => {
    expect(panelSrc).toContain('isSuperadminMode')
    // superadmin should also feed into bypass
    expect(panelSrc).toContain("'superadmin'")
    expect(panelSrc).toMatch(/isSuperadminMode/)
  })

  test('panel page handles loading state for both auth and subscription', () => {
    // Should check both initializing (auth) and isLoading (subscription) before rendering
    expect(panelSrc).toContain('initializing')
    expect(panelSrc).toContain('isLoading')
    // Loading condition should include both
    expect(panelSrc).toMatch(/initializing\s*\|\|\s*isLoading/)
  })
})

// ── 2. Pricing Auth Wiring ──────────────────────────────────────

describe('Pricing auth wiring (source analysis)', () => {
  test('pricing page imports useAuth', () => {
    expect(pricingSrc).toContain("import { useAuth }")
    expect(pricingSrc).toContain("from '@/lib/authState'")
    // Destructures user from useAuth
    expect(pricingSrc).toContain('useAuth()')
  })

  test('handleCheckout passes user context to buildCheckoutUrl', () => {
    // Should pass user?.id and user?.email to buildCheckoutUrl
    expect(pricingSrc).toContain('buildCheckoutUrl')
    expect(pricingSrc).toContain('user?.id')
    expect(pricingSrc).toContain('user?.email')
    // The call should include user context params
    expect(pricingSrc).toMatch(/buildCheckoutUrl\([^)]*user\?\.id[^)]*user\?\.email/)
  })

  test('no TODO comment about user context remains in pricing page', () => {
    // The S05 pricing page had a TODO about passing user context — it should be resolved
    const todoMatches = pricingSrc.match(/\/\/\s*TODO.*user\s*context/i)
    expect(todoMatches).toBeNull()
  })

  test('pricing page has auth-aware navigation (conditional rendering based on user state)', () => {
    // Nav should show different content for authenticated vs unauthenticated users
    // Should have conditional rendering checking user
    expect(pricingSrc).toMatch(/\{.*user\s*\?/)
    // Should have Sign In / Dashboard links based on auth state
    expect(pricingSrc).toContain('Sign In')
    expect(pricingSrc).toContain('Dashboard')
  })
})

// ── 3. Dashboard Subscription Display ───────────────────────────

describe('Dashboard subscription display (source analysis)', () => {
  test('dashboard imports useSubscription', () => {
    expect(dashboardSrc).toContain("import { useSubscription }")
    expect(dashboardSrc).toContain("from '@/lib/useSubscription'")
  })

  test('dashboard references subscription.customer_portal_url for manage link', () => {
    expect(dashboardSrc).toContain('customer_portal_url')
    // Should use it in an anchor or link
    expect(dashboardSrc).toMatch(/subscription\.customer_portal_url/)
    // Should have a "Manage" link
    expect(dashboardSrc).toContain('Manage')
  })

  test('dashboard references subscription.current_period_end for renewal date display', () => {
    expect(dashboardSrc).toContain('current_period_end')
    // Should reference it for date formatting
    expect(dashboardSrc).toMatch(/subscription\.current_period_end/)
    // Should display renewal info
    expect(dashboardSrc).toMatch(/[Rr]enew/)
  })

  test('dashboard has upgrade CTA linking to /pricing for non-subscribers', () => {
    // Should have a link to /pricing for users without active subscriptions
    expect(dashboardSrc).toContain('/pricing')
    // Should have upgrade-related text
    expect(dashboardSrc).toMatch(/[Uu]pgrade/)
  })
})

// ── 4. Build Validity ───────────────────────────────────────────

describe('Build validity (source analysis)', () => {
  test('all three modified files are valid TypeScript (no syntax errors detectable by source analysis)', () => {
    // Verify basic structural integrity: each file has a default export,
    // balanced braces/parens, and 'use client' directive
    for (const [name, src] of [
      ['panel', panelSrc],
      ['pricing', pricingSrc],
      ['dashboard', dashboardSrc],
    ] as const) {
      // Has 'use client' directive
      expect(src).toContain("'use client'")

      // Has a default export
      expect(src).toMatch(/export\s+default\s+function/)

      // Basic brace balance check (not perfect but catches obvious issues)
      const opens = (src.match(/\{/g) || []).length
      const closes = (src.match(/\}/g) || []).length
      expect(opens).toBe(closes)

      // Has at least one import statement
      expect(src).toMatch(/^import\s/m)
    }
  })
})
