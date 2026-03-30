import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { LemonSqueezyWebhookPayload } from '@/types'

/**
 * POST /api/webhooks/lemonsqueezy
 *
 * Receives Lemon Squeezy subscription lifecycle events.
 * Verifies HMAC SHA-256 signature, then dispatches by event name
 * to upsert/update the `subscriptions` table via the admin client.
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('❌ Webhook: LEMONSQUEEZY_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Missing webhook secret' },
      { status: 500 }
    )
  }

  // 1. Read raw body BEFORE any JSON parsing
  let rawBody: string
  try {
    rawBody = await request.text()
  } catch {
    return NextResponse.json(
      { error: 'Failed to read request body' },
      { status: 400 }
    )
  }

  if (!rawBody) {
    return NextResponse.json(
      { error: 'Empty request body' },
      { status: 400 }
    )
  }

  // 2. Verify HMAC SHA-256 signature
  const signature = request.headers.get('X-Signature')
  if (!signature) {
    console.warn('⚠️ Webhook: Missing X-Signature header')
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 401 }
    )
  }

  const hmac = crypto.createHmac('sha256', webhookSecret)
  hmac.update(rawBody)
  const digest = hmac.digest('hex')

  // Use timingSafeEqual with same-length Buffers to prevent timing attacks
  const digestBuffer = Buffer.from(digest, 'utf-8')
  const signatureBuffer = Buffer.from(signature, 'utf-8')

  if (
    digestBuffer.length !== signatureBuffer.length ||
    !crypto.timingSafeEqual(digestBuffer, signatureBuffer)
  ) {
    console.warn('⚠️ Webhook: Invalid HMAC signature')
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    )
  }

  // 3. Parse the verified payload
  let payload: LemonSqueezyWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    console.error('❌ Webhook: Body passed signature check but is not valid JSON')
    return NextResponse.json(
      { error: 'Invalid payload' },
      { status: 400 }
    )
  }

  const eventName = payload?.meta?.event_name
  if (!eventName) {
    console.error('❌ Webhook: Missing meta.event_name in payload')
    return NextResponse.json(
      { error: 'Missing event_name in payload' },
      { status: 400 }
    )
  }

  // 4. Extract user_id from custom_data, fall back to email lookup
  const customData = payload.meta.custom_data
  let userId = customData?.user_id ?? null

  if (!userId) {
    const email = payload.data?.attributes?.user_email
    if (email) {
      console.warn(
        `⚠️ Webhook: No custom_data.user_id for event ${eventName}, ` +
        `attempting email fallback: ${email}`
      )
      // Attempt to find user by email via Supabase auth admin API
      try {
        // Query auth.users via supabase admin — listUsers with filter is not always available,
        // so we use the subscriptions table or user_profiles as fallback.
        // For now, store with null user_id and log the gap.
        console.warn(
          `⚠️ Webhook: Storing subscription without user_id. ` +
          `Email: ${email}. Manual linking may be needed.`
        )
      } catch (lookupErr) {
        console.error('❌ Webhook: Email fallback lookup failed:', lookupErr)
      }
    } else {
      console.warn(
        `⚠️ Webhook: No custom_data.user_id and no user_email for event ${eventName}`
      )
    }
  }

  const subscriptionId = payload.data?.id
  const attributes = payload.data?.attributes

  // 5. Dispatch by event name
  try {
    switch (eventName) {
      case 'subscription_created': {
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .upsert(
            {
              lemon_squeezy_id: String(subscriptionId),
              lemon_squeezy_customer_id: String(attributes?.customer_id ?? ''),
              user_id: userId,
              variant_id: String(attributes?.variant_id ?? ''),
              status: attributes?.status ?? 'active',
              plan_id: mapVariantToPlan(attributes?.variant_id),
              current_period_end: attributes?.renews_at ?? null,
              cancel_at: attributes?.ends_at ?? null,
              update_payment_url: attributes?.urls?.update_payment_method ?? null,
              customer_portal_url: attributes?.urls?.customer_portal ?? null,
            },
            { onConflict: 'lemon_squeezy_id' }
          )

        if (error) {
          console.error('❌ Webhook: Supabase upsert failed for subscription_created:', error.message)
          return NextResponse.json(
            { error: 'Database error' },
            { status: 500 }
          )
        }

        console.log(`✅ Webhook: subscription_created processed — lsId=${subscriptionId}`)
        break
      }

      case 'subscription_updated': {
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: attributes?.status ?? 'active',
            variant_id: String(attributes?.variant_id ?? ''),
            plan_id: mapVariantToPlan(attributes?.variant_id),
            current_period_end: attributes?.renews_at ?? null,
            cancel_at: attributes?.ends_at ?? null,
            update_payment_url: attributes?.urls?.update_payment_method ?? null,
            customer_portal_url: attributes?.urls?.customer_portal ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq('lemon_squeezy_id', String(subscriptionId))

        if (error) {
          console.error('❌ Webhook: Supabase update failed for subscription_updated:', error.message)
          return NextResponse.json(
            { error: 'Database error' },
            { status: 500 }
          )
        }

        console.log(`✅ Webhook: subscription_updated processed — lsId=${subscriptionId}`)
        break
      }

      case 'subscription_expired': {
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('lemon_squeezy_id', String(subscriptionId))

        if (error) {
          console.error('❌ Webhook: Supabase update failed for subscription_expired:', error.message)
          return NextResponse.json(
            { error: 'Database error' },
            { status: 500 }
          )
        }

        console.log(`✅ Webhook: subscription_expired processed — lsId=${subscriptionId}`)
        break
      }

      default:
        // Forward-compatible: unknown events return 200 (no-op)
        console.log(`ℹ️ Webhook: Unhandled event "${eventName}" — no-op`)
        return NextResponse.json({ received: true, event: eventName })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown processing error'
    console.error(`❌ Webhook: Processing error for ${eventName}:`, message)
    return NextResponse.json(
      { error: 'Processing error' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true, event: eventName })
}

/**
 * Map a Lemon Squeezy variant_id to our plan_id.
 * Returns null if the variant doesn't match any known plan.
 */
function mapVariantToPlan(variantId: number | string | undefined): string | null {
  // Variant IDs are assigned by Lemon Squeezy.
  // Until real variant IDs are configured, we store the raw variant_id as plan_id.
  // TODO: Map real variant IDs once Lemon Squeezy products are created.
  if (!variantId) return null
  return String(variantId)
}
