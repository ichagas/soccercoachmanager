/**
 * Authentication Service
 *
 * Handles all authentication operations.
 * Isolates PocketBase implementation from the rest of the app.
 * Makes it easier to add offline-first capabilities later.
 */

import pb from './pocketbase'
import type { User } from '../types'

export interface AuthResult {
  user: User
  token: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

class AuthService {
  /**
   * Get current authentication state
   */
  getAuthState(): AuthState {
    return {
      isAuthenticated: pb.isAuthenticated,
      user: pb.currentUser,
      token: pb.auth.token || null,
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const result = await pb.login(email, password)
      return {
        user: result.record as unknown as User,
        token: result.token,
      }
    } catch (error) {
      console.error('[AuthService] Login failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Sign up with email and password
   */
  async signup(email: string, password: string, passwordConfirm: string): Promise<void> {
    try {
      await pb.signup(email, password, passwordConfirm)
    } catch (error) {
      console.error('[AuthService] Signup failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Login with Google OAuth
   */
  async loginWithGoogle(): Promise<AuthResult> {
    try {
      const result = await pb.loginWithGoogle()
      return {
        user: result.record as unknown as User,
        token: result.token,
      }
    } catch (error) {
      console.error('[AuthService] Google login failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Logout current user
   */
  logout(): void {
    try {
      pb.logout()
    } catch (error) {
      console.error('[AuthService] Logout failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await pb.requestPasswordReset(email)
    } catch (error) {
      console.error('[AuthService] Password reset request failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(
    token: string,
    password: string,
    passwordConfirm: string
  ): Promise<void> {
    try {
      await pb.client.collection('users').confirmPasswordReset(token, password, passwordConfirm)
    } catch (error) {
      console.error('[AuthService] Password reset confirmation failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Subscribe to auth state changes
   * Returns unsubscribe function
   */
  onAuthChange(callback: (user: User | null) => void): () => void {
    return pb.auth.onChange(() => {
      callback(pb.currentUser)
    })
  }

  /**
   * Refresh authentication token
   */
  async refreshAuth(): Promise<void> {
    try {
      await pb.client.collection('users').authRefresh()
    } catch (error) {
      console.error('[AuthService] Auth refresh failed:', error)
      throw this.handleError(error)
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
export const authService = new AuthService()
export default authService
