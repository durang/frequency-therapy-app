/**
 * Cross-Theme QA Test Suite — S07 final verification
 * 
 * Holistic validation of the entire app's theme system:
 * - Dark variant minimums per page
 * - CSS custom property token usage
 * - Zero Spanish text in production code
 * - Zero FreqHeal references in production code
 * - ThemeToggle presence on navigable pages
 * - Theme transition configuration
 * - Build infrastructure checks
 */
import fs from 'fs'
import path from 'path'

const webRoot = path.resolve(__dirname, '..')

/** Read a file relative to web root, return its content */
function readFile(relativePath: string): string {
  const fullPath = path.join(webRoot, relativePath)
  return fs.readFileSync(fullPath, 'utf-8')
}

/** Recursively collect all .tsx/.ts/.jsx/.js files under a directory */
function collectFiles(dir: string, extensions = ['.tsx', '.ts', '.jsx', '.js']): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === '__tests__' || entry.name === 'node_modules' || entry.name === '.next') continue
      results.push(...collectFiles(fullPath, extensions))
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.backup')) continue
      if (extensions.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath)
      }
    }
  }
  return results
}

// ============================================================
// (a) Dark variant minimums per page
// ============================================================
describe('Dark variant minimums per page', () => {
  const darkMinimums: Record<string, number> = {
    'app/calm-page.tsx': 50,
    'app/pricing/page.tsx': 20,
    'app/dashboard/page.tsx': 30,
    'app/library/page.tsx': 15,
    'app/profile/page.tsx': 30,
    'app/therapy/page.tsx': 30,
    'app/auth/login/page.tsx': 15,
    'app/auth/register/page.tsx': 10,
    'app/auth/success/page.tsx': 5,
    'components/auth/MagicLinkForm.tsx': 15,
    'components/therapy/advanced-frequency-player.tsx': 20,
  }

  for (const [filePath, minimum] of Object.entries(darkMinimums)) {
    it(`${filePath} has ≥${minimum} dark: variants`, () => {
      const content = readFile(filePath)
      const darkCount = (content.match(/dark:/g) || []).length
      expect(darkCount).toBeGreaterThanOrEqual(minimum)
    })
  }
})

// ============================================================
// (b) CSS custom property token usage
// ============================================================
describe('CSS custom property token usage', () => {
  const pageFiles = [
    'app/pricing/page.tsx',
    'app/dashboard/page.tsx',
    'app/library/page.tsx',
    'app/profile/page.tsx',
    'app/therapy/page.tsx',
    'app/auth/login/page.tsx',
    'app/auth/register/page.tsx',
  ]
  // Panel (app/panel/) is exempt — dark-only
  // calm-page.tsx uses Tailwind dark: classes instead of CSS tokens (63+ dark: variants)

  for (const filePath of pageFiles) {
    it(`${filePath} uses CSS custom property tokens`, () => {
      const content = readFile(filePath)
      const hasTokens =
        content.includes('var(--surface-') ||
        content.includes('var(--text-') ||
        content.includes('var(--border-') ||
        content.includes('var(--accent-')
      expect(hasTokens).toBe(true)
    })
  }

  it('calm-page.tsx uses dark: variants (Tailwind-based theming)', () => {
    const content = readFile('app/calm-page.tsx')
    const darkCount = (content.match(/dark:/g) || []).length
    // calm-page uses Tailwind dark: classes rather than CSS custom properties — still fully themed
    expect(darkCount).toBeGreaterThanOrEqual(50)
  })
})

// ============================================================
// (c) Zero Spanish text in production code
// ============================================================
describe('Zero Spanish text in production code', () => {
  const spanishPatterns = [
    'Enviar',
    'Enviando',
    'Cancelar',
    'Acceso',
    'Dirección',
    'Entendido',
    'Disfruta',
    'Revisa tu',
    'Hemos enviado',
    'bandeja',
  ]

  it('app/ and components/ contain no Spanish strings', () => {
    const appFiles = collectFiles(path.join(webRoot, 'app'))
    const componentFiles = collectFiles(path.join(webRoot, 'components'))
    const allFiles = [...appFiles, ...componentFiles]

    const violations: string[] = []

    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      const relativePath = path.relative(webRoot, file)
      for (const pattern of spanishPatterns) {
        if (content.includes(pattern)) {
          violations.push(`${relativePath}: contains "${pattern}"`)
        }
      }
    }

    expect(violations).toEqual([])
  })
})

// ============================================================
// (d) Zero FreqHeal in production code
// ============================================================
describe('Zero FreqHeal in production code', () => {
  it('app/ and components/ contain no FreqHeal references', () => {
    const appFiles = collectFiles(path.join(webRoot, 'app'))
    const componentFiles = collectFiles(path.join(webRoot, 'components'))
    const allFiles = [...appFiles, ...componentFiles]

    const violations: string[] = []

    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      if (content.includes('FreqHeal')) {
        const relativePath = path.relative(webRoot, file)
        violations.push(relativePath)
      }
    }

    expect(violations).toEqual([])
  })
})

// ============================================================
// (e) ThemeToggle presence on navigable pages
// ============================================================
describe('ThemeToggle presence on navigable pages', () => {
  const navigablePages: Record<string, string[]> = {
    // Landing page: app/page.tsx imports calm-page.tsx which has ThemeToggle
    'Landing (calm-page.tsx)': ['app/calm-page.tsx'],
    'Pricing': ['app/pricing/page.tsx'],
    'Dashboard': ['app/dashboard/page.tsx'],
    'Library': ['app/library/page.tsx'],
    'Profile': ['app/profile/page.tsx'],
    'Therapy': ['app/therapy/page.tsx'],
    'Login': ['app/auth/login/page.tsx'],
    'Register': ['app/auth/register/page.tsx'],
  }
  // Panel and success page are exempt

  for (const [pageName, filePaths] of Object.entries(navigablePages)) {
    it(`${pageName} page includes ThemeToggle`, () => {
      const hasThemeToggle = filePaths.some(fp => {
        const content = readFile(fp)
        return content.includes('ThemeToggle')
      })
      expect(hasThemeToggle).toBe(true)
    })
  }
})

// ============================================================
// (f) Theme transition enabled
// ============================================================
describe('Theme transition configuration', () => {
  it('ThemeProvider does NOT contain disableTransitionOnChange', () => {
    const content = readFile('components/providers/ThemeProvider.tsx')
    expect(content).not.toContain('disableTransitionOnChange')
  })

  it('globals.css contains background-color in a transition rule', () => {
    const content = readFile('styles/globals.css')
    // Match transition property that includes background-color
    expect(content).toMatch(/transition[^;]*background-color/)
  })

  it('globals.css contains border-color in a transition rule', () => {
    const content = readFile('styles/globals.css')
    expect(content).toMatch(/transition[^;]*border-color/)
  })
})

// ============================================================
// (g) Build infrastructure checks
// ============================================================
describe('Build infrastructure', () => {
  it('package.json has next-themes dependency', () => {
    const pkg = JSON.parse(readFile('package.json'))
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }
    expect(allDeps['next-themes']).toBeDefined()
  })

  it('tailwind.config.js has darkMode configured', () => {
    const content = readFile('tailwind.config.js')
    expect(content).toContain('darkMode')
  })

  it('globals.css has :root token block', () => {
    const content = readFile('styles/globals.css')
    expect(content).toMatch(/:root\s*\{/)
  })

  it('globals.css has .dark token block', () => {
    const content = readFile('styles/globals.css')
    expect(content).toMatch(/\.dark\s*\{/)
  })
})
