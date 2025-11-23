import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../../components/ProtectedRoute'
import { AuthProvider } from '../../contexts/AuthContext'
import { authService } from '../../services'

vi.mock('../../services', () => ({
  authService: {
    getAuthState: vi.fn(),
    onAuthChange: vi.fn(() => vi.fn()),
  },
}))

const mockAuthState = (isAuthenticated: boolean, user: unknown = null) => {
  vi.mocked(authService.getAuthState).mockReturnValue({
    isAuthenticated,
    user: user as never,
    token: isAuthenticated ? 'token' : null,
  })
}

const renderProtectedRoute = (requireOnboarding = false) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ProtectedRoute requireOnboarding={requireOnboarding}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('ProtectedRoute', () => {
  it('should redirect to login when not authenticated', async () => {
    mockAuthState(false)
    renderProtectedRoute()

    // Wait for loading to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should redirect, so protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should show protected content when authenticated', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en' as const,
      onboarding_completed: true,
    }

    mockAuthState(true, mockUser)
    renderProtectedRoute()

    // Wait for loading to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should redirect to onboarding when onboarding is required but not completed', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en' as const,
      onboarding_completed: false,
    }

    mockAuthState(true, mockUser)
    renderProtectedRoute(true)

    // Wait for loading to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should redirect to onboarding, so protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should show protected content when onboarding is completed', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en' as const,
      onboarding_completed: true,
    }

    mockAuthState(true, mockUser)
    renderProtectedRoute(true)

    // Wait for loading to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should not check onboarding when requireOnboarding is false', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en' as const,
      onboarding_completed: false,
    }

    mockAuthState(true, mockUser)
    renderProtectedRoute(false)

    // Wait for loading to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should still show content even though onboarding is not completed
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
