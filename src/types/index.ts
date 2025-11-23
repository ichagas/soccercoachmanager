// User types
export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  brand_headshot?: string
  brand_logo?: string
  brand_color?: string
  brand_tagline?: string
  custom_voice_samples?: string
  is_pro: boolean
  stripe_customer_id?: string
  preferred_language: 'en' | 'pt-BR'
  onboarding_completed?: boolean
  created: string
  updated: string
}

// Generation types
export interface Generation {
  id: string
  owner: string
  input_text: string
  style: string
  carousel_pdf?: string
  caption: string
  pinned_comment: string
  hooks: string[]
  created: string
  updated: string
}

// Style options
export type StyleOption = 'hormozi' | 'welsh' | 'koe' | 'custom'

// Generation request
export interface GenerationRequest {
  input: string
  style: StyleOption
  save_to_history?: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// PocketBase response types
export interface PocketBaseRecord {
  id: string
  created: string
  updated: string
  collectionId: string
  collectionName: string
}

// Language types
export type Language = 'en' | 'pt-BR'

// Subscription types
export type SubscriptionTier = 'free' | 'pro' | 'founder'

export interface SubscriptionInfo {
  tier: SubscriptionTier
  generations_used: number
  generations_limit: number | null // null means unlimited
  can_generate: boolean
}
