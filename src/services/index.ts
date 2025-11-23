/**
 * Services Index
 *
 * Central export point for all services.
 * Components should import from here, not from individual service files.
 */

export { authService } from './auth.service'
export { userService } from './user.service'
export { generationService } from './generation.service'
export { subscriptionService } from './subscription.service'
export { claudeService } from './claude.service'
export { urlService } from './url.service'
export { pdfService } from './pdf.service'

export type { AuthResult, AuthState } from './auth.service'
export type { UpdateUserData, BrandKit } from './user.service'
export type {
  CreateGenerationData,
  GenerationListOptions,
  GenerationListResult,
} from './generation.service'
export type {
  CarouselSlide,
  GeneratedContent,
  GenerateOptions,
} from './claude.service'
export type { FetchUrlResult } from './url.service'
export type { TemplateType, PDFOptions } from './pdf.service'

// Re-export types
export type { User, Generation, StyleOption, SubscriptionInfo } from '../types'
