/**
 * Global type declarations for Lemon.js (Lemon Squeezy overlay checkout).
 *
 * The script is loaded from https://app.lemonsqueezy.com/js/lemon.js
 * and exposes two globals: `createLemonSqueezy()` to initialise, and
 * `window.LemonSqueezy` with the overlay API.
 *
 * @see https://docs.lemonsqueezy.com/help/checkout/lemonjs
 */

interface LemonSqueezyInstance {
  /** Open a Lemon Squeezy checkout URL in an overlay iframe. */
  Url: {
    Open: (url: string) => void
  }
  /**
   * Close the currently open overlay checkout.
   * Available after Url.Open has been called.
   */
  Url?: {
    Close: () => void
  }
}

declare global {
  interface Window {
    /** Lemon.js overlay instance — available after createLemonSqueezy() is called. */
    LemonSqueezy?: LemonSqueezyInstance
    /** Initialise Lemon.js — injected by the CDN script. */
    createLemonSqueezy?: () => void
  }
}

export {}
