/**
 * Subscription Service
 *
 * Handles subscription checks and limits.
 * Isolates PocketBase implementation from the rest of the app.
 */

import pb from './pocketbase'
import { generationService } from './generation.service'
import type { SubscriptionInfo, SubscriptionTier } from '../types'

class SubscriptionService {
  /**
   * Check current subscription status
   */
  async checkSubscription(): Promise<SubscriptionInfo> {
    try {
      const user = pb.currentUser

      if (!user) {
        return {
          tier: 'free',
          generations_used: 0,
          generations_limit: 5,
          can_generate: false,
        }
      }

      const count = await generationService.count()
      const isPro = user.is_pro

      return {
        tier: isPro ? 'pro' : 'free',
        generations_used: count,
        generations_limit: isPro ? null : 5,
        can_generate: isPro || count < 5,
      }
    } catch (error) {
      console.error('[SubscriptionService] Check subscription failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Check if user can generate
   */
  async canGenerate(): Promise<boolean> {
    try {
      const subscription = await this.checkSubscription()
      return subscription.can_generate
    } catch (error) {
      console.error('[SubscriptionService] Can generate check failed:', error)
      return false
    }
  }

  /**
   * Get user's subscription tier
   */
  getTier(): SubscriptionTier {
    const user = pb.currentUser
    if (!user) return 'free'
    return user.is_pro ? 'pro' : 'free'
  }

  /**
   * Check if user is pro
   */
  isPro(): boolean {
    const user = pb.currentUser
    return user?.is_pro || false
  }

  /**
   * Get remaining free generations
   */
  async getRemainingFreeGenerations(): Promise<number> {
    try {
      const subscription = await this.checkSubscription()

      if (subscription.tier === 'pro' || subscription.generations_limit === null) {
        return Infinity
      }

      return Math.max(0, subscription.generations_limit - subscription.generations_used)
    } catch (error) {
      console.error('[SubscriptionService] Get remaining generations failed:', error)
      return 0
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): Error {
    if (error?.response?.message) {
      return new Error(error.response.message)
    }
    if (error?.message) {
      return new Error(error.message)
    }
    return new Error('An unexpected error occurred')
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService()
export default subscriptionService
