import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import { authService } from '../../services'

vi.mock('../../services', () => ({
  authService: {
    getAuthState: vi.fn(),
    onAuthChange: vi.fn(),
    login: vi.fn(),
    signup: vi.fn(),
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    requestPasswordReset: vi.fn(),
  },
}))

describe('AuthContext', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    is_pro: false,
    preferred_language: 'en' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementations
    vi.mocked(authService.getAuthState).mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: null,
    })

    vi.mocked(authService.onAuthChange).mockImplementation((callback) => {
      return vi.fn() // unsubscribe function
    })
  })

  it('should provide initial auth state', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should provide authenticated state when user is logged in', async () => {
    vi.mocked(authService.getAuthState).mockReturnValue({
      isAuthenticated: true,
      user: mockUser as any,
      token: 'mock-token',
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
  })

  it('should login successfully', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      user: mockUser as any,
      token: 'auth-token',
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123')
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should signup and auto-login', async () => {
    vi.mocked(authService.signup).mockResolvedValue(undefined)
    vi.mocked(authService.login).mockResolvedValue({
      user: mockUser as any,
      token: 'auth-token',
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.signup('new@example.com', 'password123', 'password123')
    })

    expect(authService.signup).toHaveBeenCalledWith('new@example.com', 'password123', 'password123')
    expect(authService.login).toHaveBeenCalledWith('new@example.com', 'password123')
    expect(result.current.user).toEqual(mockUser)
  })

  it('should handle signup errors', async () => {
    const error = new Error('Email already exists')
    vi.mocked(authService.signup).mockRejectedValue(error)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await expect(
      act(async () => {
        await result.current.signup('existing@example.com', 'password', 'password')
      })
    ).rejects.toThrow('Email already exists')
  })

  it('should login with Google', async () => {
    vi.mocked(authService.loginWithGoogle).mockResolvedValue({
      user: mockUser as any,
      token: 'google-token',
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.loginWithGoogle()
    })

    expect(authService.loginWithGoogle).toHaveBeenCalled()
    expect(result.current.user).toEqual(mockUser)
  })

  it('should logout successfully', async () => {
    // Start with authenticated state
    vi.mocked(authService.getAuthState).mockReturnValue({
      isAuthenticated: true,
      user: mockUser as any,
      token: 'mock-token',
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.logout()
    })

    expect(authService.logout).toHaveBeenCalled()
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should request password reset', async () => {
    vi.mocked(authService.requestPasswordReset).mockResolvedValue(undefined)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.requestPasswordReset('test@example.com')
    })

    expect(authService.requestPasswordReset).toHaveBeenCalledWith('test@example.com')
  })

  it('should subscribe to auth changes on mount', async () => {
    renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(authService.onAuthChange).toHaveBeenCalled()
    })
  })

  it('should unsubscribe from auth changes on unmount', async () => {
    const unsubscribe = vi.fn()
    vi.mocked(authService.onAuthChange).mockReturnValue(unsubscribe)

    const { unmount } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(authService.onAuthChange).toHaveBeenCalled()
    })

    unmount()

    expect(unsubscribe).toHaveBeenCalled()
  })

  it('should throw error when useAuth is used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
  })
})
