/**
 * Theme System Test Suite — S01 design system verification
 * Covers: ThemeToggle, ThemeProvider, Button/Card/Input/Badge dark variants,
 * CSS custom property tokens, Tailwind config.
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import fs from 'fs'
import path from 'path'

// --- Mock next-themes ---
const mockSetTheme = jest.fn()
let mockTheme = 'dark'

jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
    resolvedTheme: mockTheme,
    systemTheme: 'dark',
    themes: ['light', 'dark', 'system'],
  }),
}))

// --- Imports (after mocks) ---
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// ============================================================
// ThemeToggle Component
// ============================================================
describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
    mockTheme = 'dark'
  })

  it('renders with aria-label', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument()
  })

  it('renders sun icon in dark mode', () => {
    mockTheme = 'dark'
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: 'Toggle theme' })
    // Sun icon has a <circle> element (moon icon does not)
    const svg = button.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg!.querySelector('circle')).toBeTruthy()
  })

  it('renders moon icon in light mode', () => {
    mockTheme = 'light'
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: 'Toggle theme' })
    const svg = button.querySelector('svg')
    expect(svg).toBeTruthy()
    // Moon icon uses <path>, no <circle>
    expect(svg!.querySelector('circle')).toBeNull()
    expect(svg!.querySelector('path')).toBeTruthy()
  })

  it('calls setTheme("light") when in dark mode', () => {
    mockTheme = 'dark'
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('calls setTheme("dark") when in light mode', () => {
    mockTheme = 'light'
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('has motion-reduce:transition-none class', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: 'Toggle theme' })
    expect(button.className).toContain('motion-reduce:transition-none')
  })

  it('has dark: variant classes on the button', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: 'Toggle theme' })
    expect(button.className).toContain('dark:bg-slate-800')
    expect(button.className).toContain('dark:hover:bg-slate-700')
  })
})

// ============================================================
// ThemeProvider
// ============================================================
describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <span data-testid="child">Hello</span>
      </ThemeProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})

// ============================================================
// Button — dark: class presence
// ============================================================
describe('Button dark mode support', () => {
  it('secondary variant has dark: classes', () => {
    render(<Button variant="secondary">Test</Button>)
    const button = screen.getByRole('button')
    const classes = button.className
    expect(classes).toContain('dark:bg-slate-700')
    expect(classes).toContain('dark:text-white')
    expect(classes).toContain('dark:hover:bg-slate-600')
  })

  it('outline variant has dark: classes', () => {
    render(<Button variant="outline">Test</Button>)
    const button = screen.getByRole('button')
    const classes = button.className
    expect(classes).toContain('dark:border-quantum-400')
    expect(classes).toContain('dark:text-quantum-400')
    expect(classes).toContain('dark:hover:bg-quantum-950')
  })

  it('base styles include dark: focus ring offset', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('dark:focus:ring-offset-slate-900')
  })
})

// ============================================================
// Card — dark: class presence
// ============================================================
describe('Card dark mode support', () => {
  it('default variant has dark: classes', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement
    const classes = card.className
    expect(classes).toContain('dark:bg-slate-900')
    expect(classes).toContain('dark:border-slate-700')
  })

  it('quantum variant has dark: classes', () => {
    const { container } = render(<Card variant="quantum">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('dark:from-quantum-950')
    expect(card.className).toContain('dark:to-neural-950')
    expect(card.className).toContain('dark:border-quantum-800')
  })

  it('neural variant has dark: classes', () => {
    const { container } = render(<Card variant="neural">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('dark:from-neural-950')
    expect(card.className).toContain('dark:border-neural-800')
  })

  it('CardTitle has dark: text class', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByText('Title').className).toContain('dark:text-white')
  })

  it('CardDescription has dark: text class', () => {
    render(<CardDescription>Desc</CardDescription>)
    expect(screen.getByText('Desc').className).toContain('dark:text-slate-400')
  })
})

// ============================================================
// Input — dark: class presence
// ============================================================
describe('Input dark mode support', () => {
  it('input element has dark: classes', () => {
    render(<Input placeholder="test" />)
    const input = screen.getByPlaceholderText('test')
    const classes = input.className
    expect(classes).toContain('dark:bg-slate-800')
    expect(classes).toContain('dark:border-slate-600')
    expect(classes).toContain('dark:text-white')
    expect(classes).toContain('dark:placeholder:text-slate-500')
  })

  it('label has dark: text class', () => {
    render(<Input label="Name" />)
    const label = screen.getByText('Name')
    expect(label.className).toContain('dark:text-slate-300')
  })

  it('helper text has dark: class', () => {
    render(<Input helperText="Help" placeholder="x" />)
    expect(screen.getByText('Help').className).toContain('dark:text-slate-400')
  })

  it('error text has dark: class', () => {
    render(<Input error="Bad" placeholder="x" />)
    expect(screen.getByText('Bad').className).toContain('dark:text-red-400')
  })

  it('error state input has dark: border class', () => {
    render(<Input error="Bad" placeholder="x" />)
    const input = screen.getByPlaceholderText('x')
    expect(input.className).toContain('dark:border-red-400')
  })
})

// ============================================================
// Badge — explicit color classes (not undefined CSS custom properties)
// ============================================================
describe('Badge explicit color classes', () => {
  it('default variant uses explicit bg-quantum-600', () => {
    const { container } = render(<Badge>Tag</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-quantum-600')
    // Should NOT contain var(--) undefined references
    expect(badge.className).not.toContain('bg-primary')
    expect(badge.className).not.toContain('bg-secondary')
  })

  it('secondary variant has dark: classes', () => {
    const { container } = render(<Badge variant="secondary">Tag</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('dark:bg-slate-700')
    expect(badge.className).toContain('dark:text-slate-100')
    expect(badge.className).toContain('dark:hover:bg-slate-600')
  })

  it('outline variant has dark: classes', () => {
    const { container } = render(<Badge variant="outline">Tag</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('dark:text-slate-100')
    expect(badge.className).toContain('dark:border-slate-600')
  })

  it('focus ring uses quantum-500, not undefined ring-ring', () => {
    const { container } = render(<Badge>Tag</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('ring-quantum-500')
    expect(badge.className).not.toContain('ring-ring')
  })
})

// ============================================================
// CSS Token File — :root and .dark blocks
// ============================================================
describe('CSS custom property tokens', () => {
  const globalsPath = path.join(__dirname, '..', 'styles', 'globals.css')
  let cssContent: string

  beforeAll(() => {
    cssContent = fs.readFileSync(globalsPath, 'utf-8')
  })

  it('contains :root block with CSS custom properties', () => {
    expect(cssContent).toMatch(/:root\s*\{/)
    expect(cssContent).toContain('--surface-primary')
  })

  it('contains .dark block with CSS custom properties', () => {
    expect(cssContent).toMatch(/\.dark\s*\{/)
  })

  it('defines surface tokens in both :root and .dark', () => {
    // Check :root has a surface token
    const rootBlock = cssContent.split('.dark')[0]
    expect(rootBlock).toContain('--surface-primary')
    // Check .dark has a surface token
    const darkBlock = cssContent.split('.dark')[1]
    expect(darkBlock).toContain('--surface-primary')
  })

  it('defines text tokens', () => {
    expect(cssContent).toContain('--text-primary')
    expect(cssContent).toContain('--text-secondary')
  })
})

// ============================================================
// Tailwind Config — darkMode: 'class'
// ============================================================
describe('Tailwind config', () => {
  const configPath = path.join(__dirname, '..', 'tailwind.config.js')
  let configContent: string

  beforeAll(() => {
    configContent = fs.readFileSync(configPath, 'utf-8')
  })

  it('contains darkMode: "class"', () => {
    // Matches both single and double quotes
    expect(configContent).toMatch(/darkMode:\s*['"]class['"]/)
  })

  it('has quantum color palette defined', () => {
    expect(configContent).toContain('quantum:')
  })

  it('has neural color palette defined', () => {
    expect(configContent).toContain('neural:')
  })
})
