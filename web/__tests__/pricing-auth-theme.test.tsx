/**
 * Pricing + Auth Pages Theme & Config Test Suite — M003 S03
 *
 * Verifies:
 * 1. Checkout config module (Lemon Squeezy plans, pricing)
 * 2. Pricing page dark mode variants, ThemeToggle, CSS token usage
 * 3. Auth pages (login, register, success) dark mode variants
 * 4. No Stripe references remain anywhere in web/app/ or web/lib/
 * 5. Register page has no 'Free Trial' language
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import * as fs from 'fs'
import * as path from 'path'
import { PLANS, CHECKOUT_URLS, FEATURES } from '@/lib/checkout'

// ─── Mocks ──────────────────────────────────────────────────────

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  return new Proxy({}, {
    get: (_target: any, prop: string) => {
      if (prop === '__esModule') return true
      return (props: any) => <svg data-testid={`icon-${prop}`} {...props} />
    }
  })
})

// Mock next-themes
const mockSetTheme = jest.fn()
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', resolvedTheme: 'dark', setTheme: mockSetTheme }),
  ThemeProvider: ({ children }: any) => children,
}))

// Mock ThemeToggle so we can detect its presence
jest.mock('@/components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}))

// Mock supabase (auth pages import it)
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
  },
  signIn: jest.fn().mockResolvedValue({ data: null, error: null }),
  signUp: jest.fn().mockResolvedValue({ data: null, error: null }),
  signInWithMagicLink: jest.fn().mockResolvedValue({ data: null, error: null }),
}))

// Mock react-hot-toast (auth pages import it)
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// ─── Imports (after mocks) ──────────────────────────────────────

import PricingPage from '@/app/pricing/page'
import LoginPage from '@/app/auth/login/page'
import RegisterPage from '@/app/auth/register/page'

// ─── Source file paths ──────────────────────────────────────────

const SRC_DIR = path.resolve(__dirname, '..')
const pricingSrc = fs.readFileSync(path.join(SRC_DIR, 'app/pricing/page.tsx'), 'utf-8')
const loginSrc = fs.readFileSync(path.join(SRC_DIR, 'app/auth/login/page.tsx'), 'utf-8')
const registerSrc = fs.readFileSync(path.join(SRC_DIR, 'app/auth/register/page.tsx'), 'utf-8')
const successSrc = fs.readFileSync(path.join(SRC_DIR, 'app/auth/success/page.tsx'), 'utf-8')

// ─── 1. Checkout Config Module ──────────────────────────────────

describe('Checkout config module (web/lib/checkout.ts)', () => {
  test('PLANS has monthly entry priced at $19/mo', () => {
    expect(PLANS.monthly).toBeDefined()
    expect(PLANS.monthly.price).toBe(19)
    expect(PLANS.monthly.period).toBe('month')
    expect(PLANS.monthly.pricePerMonth).toBe(19)
  })

  test('PLANS has annual entry priced at $120/yr ($10/mo)', () => {
    expect(PLANS.annual).toBeDefined()
    expect(PLANS.annual.price).toBe(120)
    expect(PLANS.annual.period).toBe('year')
    expect(PLANS.annual.pricePerMonth).toBe(10)
  })

  test('monthly checkoutUrl contains lemonsqueezy', () => {
    expect(PLANS.monthly.checkoutUrl).toContain('lemonsqueezy')
  })

  test('annual checkoutUrl contains lemonsqueezy', () => {
    expect(PLANS.annual.checkoutUrl).toContain('lemonsqueezy')
  })

  test('CHECKOUT_URLS entries match PLANS checkoutUrls', () => {
    expect(CHECKOUT_URLS.monthly).toBe(PLANS.monthly.checkoutUrl)
    expect(CHECKOUT_URLS.annual).toBe(PLANS.annual.checkoutUrl)
  })

  test('annual plan has Save badge', () => {
    expect(PLANS.annual.badge).toContain('Save')
  })

  test('FEATURES array is non-empty', () => {
    expect(FEATURES.length).toBeGreaterThan(0)
  })
})

// ─── 2. Pricing Page — Dark Variants & Theme ────────────────────

describe('Pricing page — dark mode variants (source analysis)', () => {
  test('source contains dark: Tailwind classes', () => {
    const darkClasses = pricingSrc.match(/dark:/g)
    expect(darkClasses).not.toBeNull()
    expect(darkClasses!.length).toBeGreaterThanOrEqual(10)
  })

  test('imports from checkout.ts, not stripe', () => {
    expect(pricingSrc).toContain("from '@/lib/checkout'")
    expect(pricingSrc).not.toContain("from '@/lib/stripe'")
    expect(pricingSrc).not.toContain("from 'stripe'")
  })

  test('imports ThemeToggle', () => {
    expect(pricingSrc).toContain('ThemeToggle')
    expect(pricingSrc).toContain("from '@/components/ui/ThemeToggle'")
  })

  test('uses CSS custom property tokens (var(--surface or var(--text or var(--border or var(--accent)', () => {
    const hasTokens =
      pricingSrc.includes('var(--surface') ||
      pricingSrc.includes('var(--text') ||
      pricingSrc.includes('var(--border') ||
      pricingSrc.includes('var(--accent')
    expect(hasTokens).toBe(true)
  })

  test('uses var(--surface-primary) for page background', () => {
    expect(pricingSrc).toContain('var(--surface-primary)')
  })

  test('uses var(--accent-primary) for CTA buttons', () => {
    expect(pricingSrc).toContain('var(--accent-primary)')
  })
})

describe('Pricing page — DOM rendering', () => {
  test('renders ThemeToggle in nav', () => {
    render(<PricingPage />)
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  test('renders billing toggle with Monthly and Annual buttons', () => {
    render(<PricingPage />)
    // "Monthly" and "Annual" appear in both toggle buttons and plan card headings
    expect(screen.getAllByText('Monthly').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('Annual').length).toBeGreaterThanOrEqual(2)
  })

  test('renders both plan cards', () => {
    render(<PricingPage />)
    // Both plan names visible
    expect(screen.getAllByText('Monthly').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Annual').length).toBeGreaterThanOrEqual(1)
  })

  test('displays $19/mo pricing', () => {
    render(<PricingPage />)
    expect(screen.getByText('$19')).toBeInTheDocument()
  })

  test('billing toggle switches active plan', () => {
    render(<PricingPage />)
    // Click Annual
    const annualButtons = screen.getAllByText('Annual')
    fireEvent.click(annualButtons[0])
    // $10/mo price should appear for annual
    expect(screen.getByText('$10')).toBeInTheDocument()
  })

  test('renders feature list from checkout module', () => {
    render(<PricingPage />)
    FEATURES.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument()
    })
  })

  test('renders FAQ section', () => {
    render(<PricingPage />)
    expect(screen.getByText('Frequently asked questions')).toBeInTheDocument()
  })

  test('renders dark: variant classes on plan cards', () => {
    const { container } = render(<PricingPage />)
    const darkBgElements = container.querySelectorAll('[class*="dark:bg-slate"]')
    expect(darkBgElements.length).toBeGreaterThanOrEqual(2)
  })

  test('renders dark: variant classes on FAQ cards', () => {
    const { container } = render(<PricingPage />)
    const darkBorderElements = container.querySelectorAll('[class*="dark:border-slate"]')
    expect(darkBorderElements.length).toBeGreaterThanOrEqual(1)
  })
})

// ─── 3. Auth Pages — Dark Variants (source analysis) ────────────

describe('Auth pages — dark mode variants (source analysis)', () => {
  test('login page source contains dark: classes', () => {
    const darkClasses = loginSrc.match(/dark:/g)
    expect(darkClasses).not.toBeNull()
    expect(darkClasses!.length).toBeGreaterThanOrEqual(5)
  })

  test('register page source contains dark: classes', () => {
    const darkClasses = registerSrc.match(/dark:/g)
    expect(darkClasses).not.toBeNull()
    expect(darkClasses!.length).toBeGreaterThanOrEqual(5)
  })

  test('success page source contains dark: classes', () => {
    const darkClasses = successSrc.match(/dark:/g)
    expect(darkClasses).not.toBeNull()
    expect(darkClasses!.length).toBeGreaterThanOrEqual(3)
  })
})

// ─── 4. Login Page ──────────────────────────────────────────────

describe('Login page — theme integration', () => {
  test('source imports ThemeToggle', () => {
    expect(loginSrc).toContain("from '@/components/ui/ThemeToggle'")
  })

  test('uses var(--surface-primary) for background', () => {
    expect(loginSrc).toContain('var(--surface-primary)')
  })

  test('renders ThemeToggle in header', () => {
    render(<LoginPage />)
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  test('renders dark: variant on card', () => {
    const { container } = render(<LoginPage />)
    const darkBgCards = container.querySelectorAll('[class*="dark:bg-slate-800"]')
    expect(darkBgCards.length).toBeGreaterThanOrEqual(1)
  })

  test('renders dark: variant on text elements', () => {
    const { container } = render(<LoginPage />)
    const darkText = container.querySelectorAll('[class*="dark:text-white"]')
    expect(darkText.length).toBeGreaterThanOrEqual(1)
  })
})

// ─── 5. Register Page ───────────────────────────────────────────

describe('Register page — theme integration & content', () => {
  test('source imports ThemeToggle', () => {
    expect(registerSrc).toContain("from '@/components/ui/ThemeToggle'")
  })

  test('does not contain "Free Trial" text', () => {
    expect(registerSrc).not.toContain('Free Trial')
    expect(registerSrc).not.toContain('free trial')
  })

  test('uses "Your Account Includes" instead of trial language', () => {
    expect(registerSrc).toContain('Your Account Includes')
  })

  test('uses "Create Account" button text', () => {
    expect(registerSrc).toContain('Create Account')
  })

  test('uses var(--surface-primary) for background', () => {
    expect(registerSrc).toContain('var(--surface-primary)')
  })

  test('renders ThemeToggle in header', () => {
    render(<RegisterPage />)
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  test('renders dark: variant on card', () => {
    const { container } = render(<RegisterPage />)
    const darkBgCards = container.querySelectorAll('[class*="dark:bg-slate-800"]')
    expect(darkBgCards.length).toBeGreaterThanOrEqual(1)
  })

  test('does not render "Free Trial" in DOM', () => {
    render(<RegisterPage />)
    expect(screen.queryByText(/free trial/i)).not.toBeInTheDocument()
  })
})

// ─── 6. Success Page ────────────────────────────────────────────

describe('Success page — dark variants (source analysis)', () => {
  test('source contains dark: variant classes', () => {
    const darkClasses = successSrc.match(/dark:/g)
    expect(darkClasses).not.toBeNull()
    expect(darkClasses!.length).toBeGreaterThanOrEqual(3)
  })

  test('uses dark:bg-slate-800 on card', () => {
    expect(successSrc).toContain('dark:bg-slate-800')
  })

  test('uses dark:text-white on heading', () => {
    expect(successSrc).toContain('dark:text-white')
  })

  test('uses dark:border-slate for card border', () => {
    expect(successSrc).toContain('dark:border-slate')
  })

  test('uses var(--surface-primary) for page background', () => {
    expect(successSrc).toContain('var(--surface-primary)')
  })

  test('status colors have dark variants (green, red, quantum)', () => {
    expect(successSrc).toContain('dark:text-green-400')
    expect(successSrc).toContain('dark:text-red-400')
    expect(successSrc).toContain('dark:text-quantum-400')
  })
})

// ─── 7. No Stripe References ────────────────────────────────────

describe('Stripe removal verification', () => {
  const walkDir = (dir: string): string[] => {
    const results: string[] = []
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          results.push(...walkDir(fullPath))
        } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
          results.push(fullPath)
        }
      }
    } catch {
      // skip unreadable dirs
    }
    return results
  }

  test('no file in web/app/ imports from stripe', () => {
    const appDir = path.resolve(SRC_DIR, 'app')
    const files = walkDir(appDir)
    const stripeImports: string[] = []

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8')
      if (
        content.includes("from 'stripe'") ||
        content.includes("from '@stripe/") ||
        content.includes("from '@/lib/stripe'") ||
        content.includes('require("stripe")') ||
        content.includes("require('stripe')")
      ) {
        stripeImports.push(path.relative(SRC_DIR, file))
      }
    }

    expect(stripeImports).toEqual([])
  })

  test('no file in web/lib/ imports from stripe', () => {
    const libDir = path.resolve(SRC_DIR, 'lib')
    const files = walkDir(libDir)
    const stripeImports: string[] = []

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8')
      if (
        content.includes("from 'stripe'") ||
        content.includes("from '@stripe/") ||
        content.includes('require("stripe")') ||
        content.includes("require('stripe')")
      ) {
        stripeImports.push(path.relative(SRC_DIR, file))
      }
    }

    expect(stripeImports).toEqual([])
  })

  test('no stripe.ts or stripe.js file exists in web/lib/', () => {
    const libDir = path.resolve(SRC_DIR, 'lib')
    const stripeFile = ['stripe.ts', 'stripe.js', 'stripe.tsx'].some(
      (f) => fs.existsSync(path.join(libDir, f))
    )
    expect(stripeFile).toBe(false)
  })
})

// ─── 8. CSS Token Usage ─────────────────────────────────────────

describe('Pricing page — CSS token usage', () => {
  test('uses var(--surface-overlay) for nav background', () => {
    expect(pricingSrc).toContain('var(--surface-overlay)')
  })

  test('uses var(--border-default) for nav border', () => {
    expect(pricingSrc).toContain('var(--border-default)')
  })

  test('uses var(--text-primary) for brand text', () => {
    expect(pricingSrc).toContain('var(--text-primary)')
  })

  test('uses var(--text-secondary) for nav links', () => {
    expect(pricingSrc).toContain('var(--text-secondary)')
  })

  test('combines CSS tokens with dark: Tailwind variants (hybrid pattern)', () => {
    // The pricing page uses var(--*) tokens for nav/CTA and dark: for card/text granularity
    const hasTokens = pricingSrc.includes('var(--')
    const hasDarkVariants = pricingSrc.includes('dark:')
    expect(hasTokens).toBe(true)
    expect(hasDarkVariants).toBe(true)
  })
})
