export interface User {
  id: string
  email: string
  subscription_tier: 'free' | 'basic' | 'pro' | 'clinical'
  trial_end_date?: string
  created_at: string
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  frequency_preferences: FrequencyPreference[]
  biometric_data?: BiometricData
  progress_stats?: ProgressStats
  created_at: string
  updated_at: string
}

export interface FrequencyPreference {
  frequency_hz: number
  category: FrequencyCategory
  intensity: number
  preferred_duration: number
  effectiveness_rating?: number
}

export interface BiometricData {
  heart_rate_variability?: number
  stress_level?: number
  sleep_quality_score?: number
  focus_score?: number
  last_updated: string
}

export interface ProgressStats {
  total_sessions: number
  total_minutes: number
  average_session_rating: number
  most_used_frequency: number
  improvement_metrics: {
    stress_reduction: number
    focus_improvement: number
    sleep_quality_improvement: number
  }
}

export interface Frequency {
  id: string
  name: string
  slug: string
  hz_value: number
  category: FrequencyCategory
  description: string
  scientific_backing: string
  benefits: string[]
  best_for: string[]
  tier: 'free' | 'basic' | 'pro' | 'clinical'
  duration_minutes: number
  research_citations?: string[]
  clinical_trials?: {
    title: string
    participants: number
    duration_weeks: number
    results: string
    institution: string
  }[]
  mechanism?: string
  contraindications?: string[]
  dosage?: string
  breathing?: {
    inhale: number
    hold: number
    exhale: number
    reason: string
  }
}

export type FrequencyCategory = 
  | 'dna_repair' 
  | 'anxiety_relief'
  | 'cognitive_enhancement'
  | 'sleep_optimization'
  | 'grounding'
  | 'pain_management'
  | 'cardiovascular'
  | 'neurotransmitter_optimization'
  | 'mood_enhancement'
  | 'relaxation'
  | 'neural_repair'
  | 'anti_aging'
  | 'immune_enhancement'
  | 'hormonal_balance'
  | 'cellular_energy'
  | 'regenerative_medicine'
  | 'epigenetic_therapy'
  | 'quantum_medicine'
  | 'detox'
  | 'tissue_repair'
  | 'universal_healing'
  | 'vascular_health'
  | 'metabolic_enhancement'
  | 'sleep' 
  | 'focus' 
  | 'meditation' 
  | 'energy' 
  | 'healing'
  | 'creativity'

export interface TherapySession {
  id: string
  user_id: string
  frequency_id: string
  frequency_hz: number
  duration_minutes: number
  intention: string
  visual_pattern?: string
  effectiveness_rating?: number
  notes?: string
  biometric_before?: Partial<BiometricData>
  biometric_after?: Partial<BiometricData>
  created_at: string
  completed_at?: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price_monthly: number
  price_yearly: number
  features: string[]
  frequency_limit?: number
  session_duration_limit?: number
  popular?: boolean
}

export interface VisualPattern {
  id: string
  name: string
  type: 'geometric' | 'particle' | 'wave' | 'mandala'
  complexity: 'low' | 'medium' | 'high'
  color_scheme: string[]
  sync_with_audio: boolean
  tier_required: 'free' | 'basic' | 'pro' | 'clinical'
}

export interface AudioSettings {
  volume: number
  ambient_sound?: string
  binaural_beats: boolean
  spatial_audio: boolean
  fade_in_duration: number
  fade_out_duration: number
}

export interface SessionIntent {
  id: string
  name: string
  description: string
  recommended_frequencies: number[]
  recommended_duration: number
  category: FrequencyCategory
}

// ── Lemon Squeezy Subscription Types ──────────────────────────────

/** Row shape of the `subscriptions` table in Supabase. */
export interface Subscription {
  id: string
  user_id: string | null
  lemon_squeezy_id: string
  lemon_squeezy_customer_id: string | null
  variant_id: string | null
  status: 'active' | 'cancelled' | 'expired' | 'paused' | 'past_due' | 'on_trial' | 'unpaid'
  plan_id: string | null
  current_period_end: string | null
  cancel_at: string | null
  update_payment_url: string | null
  customer_portal_url: string | null
  created_at: string
  updated_at: string
}

/** Lemon Squeezy webhook payload structure (subset of fields we use). */
export interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string
    custom_data?: {
      user_id?: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  data: {
    id: string
    attributes: {
      status?: string
      variant_id?: number
      customer_id?: number
      user_email?: string
      renews_at?: string | null
      ends_at?: string | null
      urls?: {
        update_payment_method?: string
        customer_portal?: string
        [key: string]: unknown
      }
      [key: string]: unknown
    }
    [key: string]: unknown
  }
}