import { describe, it, expect, beforeEach, vi } from 'vitest'
import { subscriptionService } from '../../services/subscription.service'
import pb from '../../services/pocketbase'
import { generationService } from '../../services/generation.service'

vi.mock('../../services/pocketbase', () => ({
  default: {
    currentUser: {
      id: 'user-1',
      is_pro: false,
    },
  },
}))

vi.mock('../../services/generation.service', () => ({
  generationService: {
    count: vi.fn(),
  },
}))

describe('SubscriptionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkSubscription', () => {
    it('should return free tier subscription for non-pro user', async () => {
      vi.mocked(generationService.count).mockResolvedValue(3)

      const subscription = await subscriptionService.checkSubscription()

      expect(subscription).toEqual({
        tier: 'free',
        generations_used: 3,
        generations_limit: 5,
        can_generate: true,
      })
    })

    it('should return pro tier subscription for pro user', async () => {
      vi.mocked(pb.currentUser).is_pro = true
      vi.mocked(generationService.count).mockResolvedValue(100)

      const subscription = await subscriptionService.checkSubscription()

      expect(subscription).toEqual({
        tier: 'pro',
        generations_used: 100,
        generations_limit: null,
        can_generate: true,
      })

      // Reset
      vi.mocked(pb.currentUser).is_pro = false
    })

    it('should show cannot generate when limit reached', async () => {
      vi.mocked(generationService.count).mockResolvedValue(5)

      const subscription = await subscriptionService.checkSubscription()

      expect(subscription.can_generate).toBe(false)
    })

    it('should handle no user', async () => {
      const originalUser = pb.currentUser
      ;(pb as any).currentUser = null

      const subscription = await subscriptionService.checkSubscription()

      expect(subscription).toEqual({
        tier: 'free',
        generations_used: 0,
        generations_limit: 5,
        can_generate: false,
      })

      // Reset
      ;(pb as any).currentUser = originalUser
    })
  })

  describe('canGenerate', () => {
    it('should return true when user can generate', async () => {
      vi.mocked(generationService.count).mockResolvedValue(2)

      const canGenerate = await subscriptionService.canGenerate()

      expect(canGenerate).toBe(true)
    })

    it('should return false when limit reached', async () => {
      vi.mocked(generationService.count).mockResolvedValue(5)

      const canGenerate = await subscriptionService.canGenerate()

      expect(canGenerate).toBe(false)
    })
  })

  describe('getTier', () => {
    it('should return free tier for non-pro user', () => {
      const tier = subscriptionService.getTier()
      expect(tier).toBe('free')
    })

    it('should return pro tier for pro user', () => {
      vi.mocked(pb.currentUser).is_pro = true

      const tier = subscriptionService.getTier()

      expect(tier).toBe('pro')

      // Reset
      vi.mocked(pb.currentUser).is_pro = false
    })
  })

  describe('isPro', () => {
    it('should return false for non-pro user', () => {
      const isPro = subscriptionService.isPro()
      expect(isPro).toBe(false)
    })

    it('should return true for pro user', () => {
      vi.mocked(pb.currentUser).is_pro = true

      const isPro = subscriptionService.isPro()

      expect(isPro).toBe(true)

      // Reset
      vi.mocked(pb.currentUser).is_pro = false
    })
  })

  describe('getRemainingFreeGenerations', () => {
    it('should calculate remaining free generations', async () => {
      vi.mocked(generationService.count).mockResolvedValue(2)

      const remaining = await subscriptionService.getRemainingFreeGenerations()

      expect(remaining).toBe(3)
    })

    it('should return 0 when limit reached', async () => {
      vi.mocked(generationService.count).mockResolvedValue(10)

      const remaining = await subscriptionService.getRemainingFreeGenerations()

      expect(remaining).toBe(0)
    })

    it('should return Infinity for pro users', async () => {
      vi.mocked(pb.currentUser).is_pro = true

      const remaining = await subscriptionService.getRemainingFreeGenerations()

      expect(remaining).toBe(Infinity)

      // Reset
      vi.mocked(pb.currentUser).is_pro = false
    })
  })
})
