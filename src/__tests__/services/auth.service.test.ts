import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authService } from '../../services/auth.service'
import pb from '../../services/pocketbase'

// Mock PocketBase
vi.mock('../../services/pocketbase', () => ({
  default: {
    isAuthenticated: true,
    currentUser: {
      id: 'test-user-id',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
    },
    auth: {
      token: 'mock-token',
      onChange: vi.fn((callback) => vi.fn()),
    },
    login: vi.fn(),
    signup: vi.fn(),
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    requestPasswordReset: vi.fn(),
    client: {
      collection: vi.fn(() => ({
        confirmPasswordReset: vi.fn(),
        authRefresh: vi.fn(),
      })),
    },
  },
}))

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAuthState', () => {
    it('should return current authentication state', () => {
      const authState = authService.getAuthState()

      expect(authState).toEqual({
        isAuthenticated: true,
        user: expect.objectContaining({
          email: 'test@example.com',
        }),
        token: 'mock-token',
      })
    })
  })

  describe('login', () => {
    it('should successfully login with email and password', async () => {
      const mockResult = {
        record: { id: 'user-1', email: 'user@example.com' },
        token: 'auth-token',
      }
      vi.mocked(pb.login).mockResolvedValue(mockResult)

      const result = await authService.login('user@example.com', 'password123')

      expect(pb.login).toHaveBeenCalledWith('user@example.com', 'password123')
      expect(result).toEqual({
        user: mockResult.record,
        token: mockResult.token,
      })
    })

    it('should handle login errors', async () => {
      const error = new Error('Invalid credentials')
      vi.mocked(pb.login).mockRejectedValue(error)

      await expect(authService.login('user@example.com', 'wrong')).rejects.toThrow(
        'Invalid credentials'
      )
    })
  })

  describe('signup', () => {
    it('should successfully create a new account', async () => {
      vi.mocked(pb.signup).mockResolvedValue(undefined)

      await authService.signup('new@example.com', 'password123', 'password123')

      expect(pb.signup).toHaveBeenCalledWith('new@example.com', 'password123', 'password123')
    })

    it('should handle signup errors', async () => {
      const error = { response: { message: 'Email already exists' } }
      vi.mocked(pb.signup).mockRejectedValue(error)

      await expect(
        authService.signup('existing@example.com', 'password', 'password')
      ).rejects.toThrow('Email already exists')
    })
  })

  describe('loginWithGoogle', () => {
    it('should successfully login with Google OAuth', async () => {
      const mockResult = {
        record: { id: 'user-1', email: 'user@gmail.com' },
        token: 'google-token',
      }
      vi.mocked(pb.loginWithGoogle).mockResolvedValue(mockResult)

      const result = await authService.loginWithGoogle()

      expect(pb.loginWithGoogle).toHaveBeenCalled()
      expect(result).toEqual({
        user: mockResult.record,
        token: mockResult.token,
      })
    })
  })

  describe('logout', () => {
    it('should successfully logout', () => {
      authService.logout()
      expect(pb.logout).toHaveBeenCalled()
    })
  })

  describe('requestPasswordReset', () => {
    it('should send password reset email', async () => {
      vi.mocked(pb.requestPasswordReset).mockResolvedValue(undefined)

      await authService.requestPasswordReset('user@example.com')

      expect(pb.requestPasswordReset).toHaveBeenCalledWith('user@example.com')
    })

    it('should handle password reset errors', async () => {
      const error = { response: { message: 'User not found' } }
      vi.mocked(pb.requestPasswordReset).mockRejectedValue(error)

      await expect(authService.requestPasswordReset('invalid@example.com')).rejects.toThrow(
        'User not found'
      )
    })
  })

  describe('confirmPasswordReset', () => {
    it('should confirm password reset with token', async () => {
      const mockCollection = {
        confirmPasswordReset: vi.fn().mockResolvedValue(undefined),
      }
      vi.mocked(pb.client.collection).mockReturnValue(mockCollection as any)

      await authService.confirmPasswordReset('reset-token', 'newpassword', 'newpassword')

      expect(pb.client.collection).toHaveBeenCalledWith('users')
      expect(mockCollection.confirmPasswordReset).toHaveBeenCalledWith(
        'reset-token',
        'newpassword',
        'newpassword'
      )
    })
  })

  describe('onAuthChange', () => {
    it('should subscribe to auth changes', () => {
      const callback = vi.fn()
      const unsubscribe = authService.onAuthChange(callback)

      expect(pb.auth.onChange).toHaveBeenCalled()
      expect(typeof unsubscribe).toBe('function')
    })
  })

  describe('refreshAuth', () => {
    it('should refresh authentication token', async () => {
      const mockCollection = {
        authRefresh: vi.fn().mockResolvedValue(undefined),
      }
      vi.mocked(pb.client.collection).mockReturnValue(mockCollection as any)

      await authService.refreshAuth()

      expect(pb.client.collection).toHaveBeenCalledWith('users')
      expect(mockCollection.authRefresh).toHaveBeenCalled()
    })
  })
})
