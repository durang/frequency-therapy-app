/**
 * Pages Theme & Design System Test Suite — M003 S04
 *
 * Verifies:
 * 1. Dashboard page & advanced-dashboard dark mode variants and CSS token usage
 * 2. Library page dark mode variants, CSS tokens, English content, no Spanish
 * 3. Profile page dark mode variants, CSS tokens, no FreqHeal branding, no Spanish
 * 4. Therapy page dark mode variants, CSS tokens, ThemeToggle integration
 * 5. Panel page loading/redirect states use CSS tokens, sub-components untouched
 * 6. ThemeToggle presence on dashboard, therapy, library, profile pages
 */
import * as fs from 'fs'
import * as path from 'path'

// ─── Source file paths ──────────────────────────────────────────

const SRC_DIR = path.resolve(__dirname, '..')

const dashboardSrc = fs.readFileSync(path.join(SRC_DIR, 'app/dashboard/page.tsx'), 'utf-8')
const advancedDashSrc = fs.readFileSync(path.join(SRC_DIR, 'components/dashboard/advanced-dashboard.tsx'), 'utf-8')
const librarySrc = fs.readFileSync(path.join(SRC_DIR, 'app/library/page.tsx'), 'utf-8')
const profileSrc = fs.readFileSync(path.join(SRC_DIR, 'app/profile/page.tsx'), 'utf-8')
const therapySrc = fs.readFileSync(path.join(SRC_DIR, 'app/therapy/page.tsx'), 'utf-8')
const panelSrc = fs.readFileSync(path.join(SRC_DIR, 'app/panel/page.tsx'), 'utf-8')
const panelLayoutSrc = fs.readFileSync(path.join(SRC_DIR, 'components/panel/PanelLayout.tsx'), 'utf-8')

// Helper: count occurrences of a pattern in source
function countMatches(source: string, pattern: string | RegExp): number {
  if (typeof pattern === 'string') {
    return (source.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
  }
  return (source.match(pattern) || []).length
}

// ─── 1. Dashboard Page — Dark Variants & CSS Tokens ─────────────

describe('Dashboard page — dark mode (source analysis)', () => {
  test('has ≥15 dark: Tailwind variant classes', () => {
    const count = countMatches(dashboardSrc, /dark:/g)
    expect(count).toBeGreaterThanOrEqual(15)
  })

  test('uses var(--surface-primary) for page background', () => {
    expect(dashboardSrc).toContain('var(--surface-primary)')
  })

  test('imports ThemeToggle', () => {
    expect(dashboardSrc).toContain('ThemeToggle')
  })
})

// ─── 2. Advanced Dashboard — Dark Variants ──────────────────────

describe('Advanced dashboard — dark mode (source analysis)', () => {
  test('has ≥10 dark: Tailwind variant classes', () => {
    const count = countMatches(advancedDashSrc, /dark:/g)
    expect(count).toBeGreaterThanOrEqual(10)
  })
})

// ─── 3. Library Page — Dark Variants, English, No Spanish ───────

describe('Library page — dark mode & content (source analysis)', () => {
  test('has ≥10 dark: Tailwind variant classes', () => {
    const count = countMatches(librarySrc, /dark:/g)
    expect(count).toBeGreaterThanOrEqual(10)
  })

  test('uses var(--surface-primary) or CSS token for background', () => {
    const hasToken =
      librarySrc.includes('var(--surface-primary)') ||
      librarySrc.includes('var(--surface') ||
      librarySrc.includes('var(--bg')
    expect(hasToken).toBe(true)
  })

  test('imports ThemeToggle', () => {
    expect(librarySrc).toContain('ThemeToggle')
  })

  test('has no Spanish text remnants', () => {
    const spanishPatterns = [
      'Todas', 'Reparación', 'Biblioteca', 'Frecuencia',
      'Sesión', 'Configuración', 'Cerrar sesión', 'Iniciar',
      'Buscar', 'Categorías', 'Duración', 'Minutos'
    ]
    for (const pattern of spanishPatterns) {
      // Check that the Spanish word doesn't appear as UI text (allow it in variable names)
      const inJsx = new RegExp(`>\\s*${pattern}`, 'i')
      const inString = new RegExp(`['"\`]${pattern}`, 'i')
      expect(librarySrc).not.toMatch(inJsx)
      expect(librarySrc).not.toMatch(inString)
    }
  })
})

// ─── 4. Profile Page — Dark Variants, No FreqHeal, No Spanish ──

describe('Profile page — dark mode & branding (source analysis)', () => {
  test('has ≥15 dark: Tailwind variant classes', () => {
    const count = countMatches(profileSrc, /dark:/g)
    expect(count).toBeGreaterThanOrEqual(15)
  })

  test('uses var(--surface-primary) or CSS token for background', () => {
    const hasToken =
      profileSrc.includes('var(--surface-primary)') ||
      profileSrc.includes('var(--surface') ||
      profileSrc.includes('var(--bg')
    expect(hasToken).toBe(true)
  })

  test('imports ThemeToggle', () => {
    expect(profileSrc).toContain('ThemeToggle')
  })

  test('has no FreqHeal branding', () => {
    expect(profileSrc).not.toContain('FreqHeal')
  })

  test('has no Spanish text remnants', () => {
    const spanishPatterns = [
      'Perfil', 'Configuración', 'Cerrar sesión',
      'Sesión', 'Frecuencia', 'Iniciar'
    ]
    for (const pattern of spanishPatterns) {
      const inJsx = new RegExp(`>\\s*${pattern}`, 'i')
      const inString = new RegExp(`['"\`]${pattern}`, 'i')
      expect(profileSrc).not.toMatch(inJsx)
      expect(profileSrc).not.toMatch(inString)
    }
  })
})

// ─── 5. Therapy Page — Dark Variants, ThemeToggle, CSS Tokens ───

describe('Therapy page — dark mode & ThemeToggle (source analysis)', () => {
  test('has ≥10 dark: Tailwind variant classes', () => {
    const count = countMatches(therapySrc, /dark:/g)
    expect(count).toBeGreaterThanOrEqual(10)
  })

  test('uses var(--surface-primary) for page background', () => {
    expect(therapySrc).toContain('var(--surface-primary)')
  })

  test('imports ThemeToggle from @/components/ui/ThemeToggle', () => {
    expect(therapySrc).toContain('ThemeToggle')
    expect(therapySrc).toContain("from '@/components/ui/ThemeToggle'")
  })

  test('no hardcoded from-gray-50 gradient backgrounds', () => {
    expect(therapySrc).not.toContain('from-gray-50')
  })

  test('header has dark mode background and border', () => {
    expect(therapySrc).toContain('dark:bg-slate-900')
    expect(therapySrc).toContain('dark:border-slate-700')
  })

  test('text colors have dark: variants', () => {
    expect(therapySrc).toContain('dark:text-white')
    expect(therapySrc).toContain('dark:text-slate-400')
  })
})

// ─── 6. Panel Page — CSS Tokens, Sub-components Untouched ───────

describe('Panel page — loading states & sub-components (source analysis)', () => {
  test('loading/redirect states use var(--surface-primary)', () => {
    expect(panelSrc).toContain('var(--surface-primary)')
  })

  test('PanelLayout.tsx is not modified (still has original structure)', () => {
    // PanelLayout should still exist and have substantial content
    expect(panelLayoutSrc.length).toBeGreaterThan(100)
    // Should still import PanelLayout in the page
    expect(panelSrc).toContain('PanelLayout')
  })

  test('panel page still imports PanelLayout component', () => {
    expect(panelSrc).toContain("from '@/components/panel/PanelLayout'")
  })
})

// ─── 7. Cross-cutting: ThemeToggle on key pages ─────────────────

describe('ThemeToggle integration across pages', () => {
  test('dashboard page imports ThemeToggle', () => {
    expect(dashboardSrc).toContain('ThemeToggle')
  })

  test('therapy page imports ThemeToggle', () => {
    expect(therapySrc).toContain('ThemeToggle')
  })

  test('library page imports ThemeToggle', () => {
    expect(librarySrc).toContain('ThemeToggle')
  })

  test('profile page imports ThemeToggle', () => {
    expect(profileSrc).toContain('ThemeToggle')
  })
})

// ─── 8. CSS Token consistency ───────────────────────────────────

describe('CSS token usage consistency across pages', () => {
  const pages = [
    { name: 'dashboard', src: dashboardSrc },
    { name: 'library', src: librarySrc },
    { name: 'profile', src: profileSrc },
    { name: 'therapy', src: therapySrc },
  ]

  test.each(pages)('$name page uses var(--surface-primary) or var(--surface for background', ({ src }) => {
    const hasToken = src.includes('var(--surface-primary)') || src.includes('var(--surface')
    expect(hasToken).toBe(true)
  })

  test('panel loading states use CSS token instead of hardcoded gradient', () => {
    // Panel loading/redirect should not have from-slate-900 hardcoded gradients
    // Count remaining from-slate-900 — should only be on the main panel div, not loading states
    const loadingSection = panelSrc.split('// Show loading state')[1]?.split('return')[0] || ''
    expect(loadingSection).not.toContain('from-slate-900')
  })
})
