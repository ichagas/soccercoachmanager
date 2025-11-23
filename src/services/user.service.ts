/**
 * User Service
 *
 * Handles all user-related operations (profile, brand kit, preferences).
 * Isolates PocketBase implementation from the rest of the app.
 */

import pb from './pocketbase'
import type { User } from '../types'

export interface UpdateUserData {
  name?: string
  brand_headshot?: string
  brand_logo?: string
  brand_color?: string
  brand_tagline?: string
  custom_voice_samples?: string
  preferred_language?: 'en' | 'pt-BR'
  onboarding_completed?: boolean
}

export interface BrandKit {
  headshot?: string
  logo?: string
  color?: string
  tagline?: string
}

class UserService {
  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return pb.currentUser
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User> {
    try {
      const user = await pb.client.collection('users').getOne<User>(userId)
      return user
    } catch (error) {
      console.error('[UserService] Get user failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    try {
      const updatedUser = await pb.updateUser(userId, data as Partial<User>)
      return updatedUser as unknown as User
    } catch (error) {
      console.error('[UserService] Update user failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Upload user file (headshot, logo, etc.)
   */
  async uploadFile(userId: string, field: string, file: File): Promise<User> {
    try {
      const updatedUser = await pb.uploadFile('users', userId, field, file)
      return updatedUser as unknown as User
    } catch (error) {
      console.error('[UserService] File upload failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update brand kit
   */
  async updateBrandKit(userId: string, brandKit: BrandKit): Promise<User> {
    try {
      const data: UpdateUserData = {
        brand_headshot: brandKit.headshot,
        brand_logo: brandKit.logo,
        brand_color: brandKit.color,
        brand_tagline: brandKit.tagline,
      }
      return await this.updateUser(userId, data)
    } catch (error) {
      console.error('[UserService] Update brand kit failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get brand kit for user
   */
  async getBrandKit(userId: string): Promise<BrandKit> {
    try {
      const user = await this.getUser(userId)
      return {
        headshot: user.brand_headshot,
        logo: user.brand_logo,
        color: user.brand_color,
        tagline: user.brand_tagline,
      }
    } catch (error) {
      console.error('[UserService] Get brand kit failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Train custom voice with sample posts
   */
  async trainCustomVoice(userId: string, samples: string): Promise<User> {
    try {
      return await this.updateUser(userId, {
        custom_voice_samples: samples,
      })
    } catch (error) {
      console.error('[UserService] Train custom voice failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update language preference
   */
  async updateLanguage(userId: string, language: 'en' | 'pt-BR'): Promise<User> {
    try {
      return await this.updateUser(userId, {
        preferred_language: language,
      })
    } catch (error) {
      console.error('[UserService] Update language failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get file URL for user assets
   */
  getFileUrl(user: User, filename: string, thumb?: string): string {
    return pb.getFileUrl(user, filename, thumb)
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
export const userService = new UserService()
export default userService
