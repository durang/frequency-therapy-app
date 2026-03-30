-- Lemon Squeezy Subscriptions table
-- Stores subscription state received via webhook events.
-- Written exclusively by the service role (webhook handler).
-- Read by authenticated users for their own subscription only (RLS).

CREATE TABLE IF NOT EXISTS subscriptions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  lemon_squeezy_id          TEXT UNIQUE NOT NULL,
  lemon_squeezy_customer_id TEXT,
  variant_id    TEXT,
  status        TEXT NOT NULL DEFAULT 'active',
  plan_id       TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at     TIMESTAMPTZ,
  update_payment_url TEXT,
  customer_portal_url TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Index for fast user lookups (useSubscription hook queries by user_id)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription(s)
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for anon/authenticated roles.
-- Only the service role key (used by the webhook handler) can write.
