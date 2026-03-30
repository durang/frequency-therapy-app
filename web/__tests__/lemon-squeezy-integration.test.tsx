/**
 * Lemon Squeezy Integration Test Suite (S05)
 *
 * Covers all three tasks:
 * - T01: Webhook handler (HMAC, event dispatch, Supabase operations)
 * - T02: Lemon.js overlay + checkout URL builder + pricing page
 * - T03: useSubscription hook
 */

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { renderHook, act, waitFor } from '@testing-library/react'

// ── Polyfills for jsdom (NextRequest/NextResponse need Web API globals) ──

// Provide a minimal Request/Response/Headers if not available in jsdom
if (typeof globalThis.Headers === 'undefined') {
  // @ts-expect-error – lightweight polyfill for test environment
  globalThis.Headers = class Headers {
    private _map: Map<string, string> = new Map()
    constructor(init?: Record<string, string> | [string, string][]) {
      if (init) {
        const entries = Array.isArray(init) ? init : Object.entries(init)
        for (const [k, v] of entries) this._map.set(k.toLowerCase(), v)
      }
    }
    get(name: string) { return this._map.get(name.toLowerCase()) ?? null }
    set(name: string, value: string) { this._map.set(name.toLowerCase(), value) }
    has(name: string) { return this._map.has(name.toLowerCase()) }
    forEach(cb: (value: string, key: string) => void) { this._map.forEach(cb) }
  }
}

if (typeof globalThis.Request === 'undefined') {
  // @ts-expect-error – lightweight polyfill for test environment
  globalThis.Request = class Request {
    public url: string
    public method: string
    public headers: InstanceType<typeof Headers>
    private _body: string
    constructor(url: string, init?: { method?: string; headers?: HeadersInit; body?: string }) {
      this.url = url
      this.method = init?.method ?? 'GET'
      this._body = init?.body ?? ''
      this.headers = new (globalThis.Headers as any)()
      if (init?.headers && typeof init.headers === 'object' && 'forEach' in init.headers) {
        (init.headers as any).forEach((v: string, k: string) => (this.headers as any).set(k, v))
      } else if (init?.headers && typeof init.headers === 'object') {
        for (const [k, v] of Object.entries(init.headers)) {
          (this.headers as any).set(k, v as string)
        }
      }
    }
    async text() { return this._body }
    async json() { return JSON.parse(this._body) }
  }
}

if (typeof globalThis.Response === 'undefined') {
  // @ts-expect-error – lightweight polyfill for test environment
  globalThis.Response = class Response {
    public body: string
    public status: number
    public headers: any
    constructor(body?: string | null, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body ?? ''
      this.status = init?.status ?? 200
      this.headers = new (globalThis.Headers as any)(init?.headers ?? {})
    }
    async json() { return JSON.parse(this.body) }
    async text() { return this.body }
    static json(data: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      const body = JSON.stringify(data)
      const headers = { 'content-type': 'application/json', ...(init?.headers ?? {}) }
      return new (globalThis.Response as any)(body, { status: init?.status ?? 200, headers })
    }
  }
}

// ── Mocks ──────────────────────────────────────────────────────────

// Mock Supabase client used by the hook
const mockGetUser = jest.fn()
const mockSelect = jest.fn()
const mockEq = jest.fn()
const mockOrder = jest.fn()
const mockLimit = jest.fn()
const mockSingle = jest.fn()
const mockOnAuthStateChange = jest.fn()
const mockUnsubscribe = jest.fn()

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
    from: jest.fn(() => ({
      select: mockSelect,
    })),
  },
}))

// Mock Supabase admin client used by webhook handler
const mockUpsert = jest.fn()
const mockAdminUpdate = jest.fn()
const mockAdminEq = jest.fn()

jest.mock('@/lib/supabase-admin', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      upsert: mockUpsert,
      update: mockAdminUpdate,
    })),
  },
}))

// ── Helpers ─────────────────────────────────────────────────────────

const WEBHOOK_SECRET = 'test-webhook-secret-12345'

function makeSignature(body: string, secret: string = WEBHOOK_SECRET): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex')
}

function makeWebhookPayload(
  eventName: string,
  overrides: Record<string, unknown> = {},
) {
  return {
    meta: {
      event_name: eventName,
      custom_data: { user_id: 'user-abc-123' },
      ...(overrides.meta as Record<string, unknown> ?? {}),
    },
    data: {
      id: 'sub_123',
      attributes: {
        status: 'active',
        variant_id: 42,
        customer_id: 99,
        user_email: 'test@example.com',
        renews_at: '2026-05-01T00:00:00Z',
        ends_at: null,
        urls: {
          update_payment_method: 'https://ls.com/update',
          customer_portal: 'https://ls.com/portal',
        },
        ...(overrides.attributes as Record<string, unknown> ?? {}),
      },
      ...(overrides.data as Record<string, unknown> ?? {}),
    },
  }
}

function makeRequest(body: string, signature?: string | null): Request {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  if (signature !== null && signature !== undefined) {
    headers.set('X-Signature', signature)
  }
  return new Request('http://localhost/api/webhooks/lemonsqueezy', {
    method: 'POST',
    headers,
    body,
  })
}

// ── Tests ───────────────────────────────────────────────────────────

describe('S05: Lemon Squeezy Integration', () => {
  // ────────────────────────────────────────────────────────────────
  // T01: Checkout URL builder
  // ────────────────────────────────────────────────────────────────
  describe('buildCheckoutUrl', () => {
    let buildCheckoutUrl: typeof import('@/lib/checkout').buildCheckoutUrl

    beforeAll(async () => {
      const mod = await import('@/lib/checkout')
      buildCheckoutUrl = mod.buildCheckoutUrl
    })

    it('returns the base URL when no params are provided', () => {
      const url = buildCheckoutUrl('monthly')
      expect(url).toBe('https://freqtherapy.lemonsqueezy.com/checkout/buy/monthly')
    })

    it('appends user_id when provided', () => {
      const url = buildCheckoutUrl('annual', 'uid-123')
      expect(url).toContain('checkout%5Bcustom%5D%5Buser_id%5D=uid-123')
    })

    it('appends email when provided', () => {
      const url = buildCheckoutUrl('monthly', undefined, 'test@example.com')
      expect(url).toContain('checkout%5Bemail%5D=test%40example.com')
    })

    it('appends both user_id and email', () => {
      const url = buildCheckoutUrl('annual', 'uid-456', 'a@b.com')
      expect(url).toContain('checkout%5Bcustom%5D%5Buser_id%5D=uid-456')
      expect(url).toContain('checkout%5Bemail%5D=a%40b.com')
    })
  })

  // ────────────────────────────────────────────────────────────────
  // T01: Webhook HMAC verification & event handling
  // ────────────────────────────────────────────────────────────────
  describe('Webhook handler', () => {
    let POST: typeof import('@/app/api/webhooks/lemonsqueezy/route').POST

    beforeAll(async () => {
      // Set webhook secret before importing handler
      process.env.LEMONSQUEEZY_WEBHOOK_SECRET = WEBHOOK_SECRET
      const mod = await import('@/app/api/webhooks/lemonsqueezy/route')
      POST = mod.POST
    })

    beforeEach(() => {
      jest.clearAllMocks()
      // Default Supabase admin mock: success
      mockUpsert.mockReturnValue({ error: null })
      mockAdminUpdate.mockReturnValue({ eq: mockAdminEq })
      mockAdminEq.mockReturnValue({ error: null })
    })

    it('returns 401 for missing X-Signature header', async () => {
      const body = JSON.stringify(makeWebhookPayload('subscription_created'))
      const req = makeRequest(body, null) as any
      const res = await POST(req)
      expect(res.status).toBe(401)
      const json = await res.json()
      expect(json.error).toMatch(/missing signature/i)
    })

    it('returns 401 for invalid HMAC signature', async () => {
      const body = JSON.stringify(makeWebhookPayload('subscription_created'))
      const req = makeRequest(body, 'deadbeef0000') as any
      const res = await POST(req)
      expect(res.status).toBe(401)
      const json = await res.json()
      expect(json.error).toMatch(/invalid signature/i)
    })

    it('returns 200 for valid signature with subscription_created', async () => {
      const body = JSON.stringify(makeWebhookPayload('subscription_created'))
      const sig = makeSignature(body)
      const req = makeRequest(body, sig) as any
      const res = await POST(req)
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.received).toBe(true)
      expect(json.event).toBe('subscription_created')
    })

    it('returns 200 for unknown events (forward-compat)', async () => {
      const body = JSON.stringify(makeWebhookPayload('order_created'))
      const sig = makeSignature(body)
      const req = makeRequest(body, sig) as any
      const res = await POST(req)
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.event).toBe('order_created')
    })

    it('calls upsert for subscription_created', async () => {
      const body = JSON.stringify(makeWebhookPayload('subscription_created'))
      const sig = makeSignature(body)
      const req = makeRequest(body, sig) as any
      await POST(req)
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          lemon_squeezy_id: 'sub_123',
          user_id: 'user-abc-123',
          status: 'active',
        }),
        expect.objectContaining({ onConflict: 'lemon_squeezy_id' }),
      )
    })

    it('calls update for subscription_updated', async () => {
      const body = JSON.stringify(makeWebhookPayload('subscription_updated'))
      const sig = makeSignature(body)
      const req = makeRequest(body, sig) as any
      await POST(req)
      expect(mockAdminUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'active' }),
      )
      expect(mockAdminEq).toHaveBeenCalledWith('lemon_squeezy_id', 'sub_123')
    })

    it('calls update with expired status for subscription_expired', async () => {
      const body = JSON.stringify(makeWebhookPayload('subscription_expired'))
      const sig = makeSignature(body)
      const req = makeRequest(body, sig) as any
      await POST(req)
      expect(mockAdminUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'expired' }),
      )
    })

    it('returns 400 for empty body', async () => {
      const req = makeRequest('', makeSignature('')) as any
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  // ────────────────────────────────────────────────────────────────
  // T02: Lemon.js script presence in layout
  // ────────────────────────────────────────────────────────────────
  describe('Lemon.js layout integration', () => {
    const layoutPath = path.resolve(__dirname, '../app/layout.tsx')
    let layoutSource: string

    beforeAll(() => {
      layoutSource = fs.readFileSync(layoutPath, 'utf-8')
    })

    it('includes the Lemon.js CDN URL', () => {
      expect(layoutSource).toContain('https://app.lemonsqueezy.com/js/lemon.js')
    })

    it('uses afterInteractive strategy', () => {
      expect(layoutSource).toContain('afterInteractive')
    })
  })

  // ────────────────────────────────────────────────────────────────
  // T02: Pricing page has no <a href> checkout links
  // ────────────────────────────────────────────────────────────────
  describe('Pricing page checkout links', () => {
    const pricingPath = path.resolve(__dirname, '../app/pricing/page.tsx')
    let pricingSource: string

    beforeAll(() => {
      pricingSource = fs.readFileSync(pricingPath, 'utf-8')
    })

    it('has zero <a href> checkout links', () => {
      const aHrefCheckout = /<a\s[^>]*href[^>]*checkoutUrl/gi
      expect(pricingSource.match(aHrefCheckout)).toBeNull()
    })

    it('references handleCheckout or LemonSqueezy', () => {
      const hasHandler =
        pricingSource.includes('handleCheckout') ||
        pricingSource.includes('LemonSqueezy')
      expect(hasHandler).toBe(true)
    })
  })

  // ────────────────────────────────────────────────────────────────
  // Types
  // ────────────────────────────────────────────────────────────────
  describe('Type declarations', () => {
    it('exports Subscription type from types/index.ts', () => {
      const typesPath = path.resolve(__dirname, '../types/index.ts')
      const src = fs.readFileSync(typesPath, 'utf-8')
      expect(src).toContain('export interface Subscription')
    })

    it('declares LemonSqueezy global in lemonsqueezy.d.ts', () => {
      const dtsPath = path.resolve(__dirname, '../types/lemonsqueezy.d.ts')
      const src = fs.readFileSync(dtsPath, 'utf-8')
      expect(src).toContain('LemonSqueezy')
      expect(src).toContain('createLemonSqueezy')
    })
  })

  // ────────────────────────────────────────────────────────────────
  // T03: useSubscription hook
  // ────────────────────────────────────────────────────────────────
  describe('useSubscription', () => {
    let useSubscription: typeof import('@/lib/useSubscription').useSubscription

    beforeAll(async () => {
      const mod = await import('@/lib/useSubscription')
      useSubscription = mod.useSubscription
    })

    beforeEach(() => {
      jest.clearAllMocks()

      // Default: return an auth listener with unsubscribe
      mockOnAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      })

      // Chain: from('subscriptions').select('*').eq(...).order(...).limit(1).single()
      mockSelect.mockReturnValue({ eq: mockEq })
      mockEq.mockReturnValue({ order: mockOrder })
      mockOrder.mockReturnValue({ limit: mockLimit })
      mockLimit.mockReturnValue({ single: mockSingle })
    })

    it('returns isActive:true for an active subscription', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'uid-1' } },
        error: null,
      })
      mockSingle.mockResolvedValue({
        data: {
          id: 's1',
          user_id: 'uid-1',
          status: 'active',
          lemon_squeezy_id: 'ls_1',
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
        error: null,
      })

      const { result } = renderHook(() => useSubscription())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isActive).toBe(true)
      expect(result.current.subscription?.status).toBe('active')
      expect(result.current.error).toBeNull()
    })

    it('returns isActive:false for a cancelled subscription', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'uid-2' } },
        error: null,
      })
      mockSingle.mockResolvedValue({
        data: {
          id: 's2',
          user_id: 'uid-2',
          status: 'cancelled',
          lemon_squeezy_id: 'ls_2',
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
        error: null,
      })

      const { result } = renderHook(() => useSubscription())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isActive).toBe(false)
      expect(result.current.subscription?.status).toBe('cancelled')
    })

    it('returns null subscription when no user is authenticated', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const { result } = renderHook(() => useSubscription())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.subscription).toBeNull()
      expect(result.current.isActive).toBe(false)
    })

    it('returns null subscription when query finds no rows (PGRST116)', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'uid-3' } },
        error: null,
      })
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Row not found' },
      })

      const { result } = renderHook(() => useSubscription())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.subscription).toBeNull()
      expect(result.current.isActive).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('sets error on auth failure', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'JWT expired' },
      })

      const { result } = renderHook(() => useSubscription())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBeTruthy()
      expect(result.current.error!.message).toContain('Auth error')
    })

    it('refetches on auth state change', async () => {
      let authCallback: () => void = () => {}
      mockOnAuthStateChange.mockImplementation((cb: () => void) => {
        authCallback = cb
        return {
          data: { subscription: { unsubscribe: mockUnsubscribe } },
        }
      })

      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const { result } = renderHook(() => useSubscription())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.subscription).toBeNull()

      // Simulate sign-in
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'uid-4' } },
        error: null,
      })
      mockSingle.mockResolvedValue({
        data: {
          id: 's4',
          user_id: 'uid-4',
          status: 'active',
          lemon_squeezy_id: 'ls_4',
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
        error: null,
      })

      act(() => {
        authCallback()
      })

      await waitFor(() => {
        expect(result.current.subscription).not.toBeNull()
      })

      expect(result.current.isActive).toBe(true)
    })

    it('cleans up auth listener on unmount', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const { unmount } = renderHook(() => useSubscription())

      await waitFor(() => {
        expect(mockOnAuthStateChange).toHaveBeenCalled()
      })

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })
})
