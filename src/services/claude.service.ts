/**
 * Claude AI Service
 *
 * Handles carousel content generation via PocketBase backend.
 * All AI API calls happen server-side for security.
 */

import pb from './pocketbase'
import type { StyleOption } from '../types'

// Generated content structure
export interface CarouselSlide {
  slide_number: number
  title: string
  content: string
  notes?: string
}

export interface GeneratedContent {
  slides: CarouselSlide[]
  caption: string
  pinned_comment: string
  hooks: string[]
}

export interface GenerateOptions {
  inputText: string
  style: StyleOption
  customInstructions?: string
  userVoiceSamples?: string
}

interface GenerateCarouselResponse {
  success: boolean
  content?: GeneratedContent
  error?: string
}

class ClaudeService {
  /**
   * Check if Claude API is configured (always true since it's server-side)
   */
  isConfigured(): boolean {
    // Always return true since configuration is handled server-side
    // The server will return appropriate errors if not configured
    return true
  }

  /**
   * Generate carousel content via PocketBase backend
   */
  async generate(options: GenerateOptions): Promise<GeneratedContent> {
    try {
      const response = await pb.client.send<GenerateCarouselResponse>(
        '/api/generate-carousel',
        {
          method: 'POST',
          body: JSON.stringify({
            input_text: options.inputText,
            style: options.style,
            custom_instructions: options.customInstructions,
            user_voice_samples: options.userVoiceSamples,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.success || !response.content) {
        throw new Error(response.error || 'Failed to generate content')
      }

      return response.content
    } catch (error: any) {
      console.error('[ClaudeService] Generation failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): Error {
    // PocketBase errors
    if (error?.status === 401 || error?.status === 403) {
      return new Error('Authentication failed. Please log in again.')
    }

    if (error?.status === 429) {
      return new Error('Rate limit exceeded. Please try again in a few moments.')
    }

    if (error?.status === 400) {
      return new Error(error?.message || 'Invalid request. Please check your input.')
    }

    if (error?.status === 500) {
      return new Error('AI service is temporarily unavailable. Please try again later.')
    }

    // Network errors
    if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
      return new Error('Network error. Please check your internet connection.')
    }

    // Generic error
    if (error?.message) {
      return new Error(error.message)
    }

    return new Error('Failed to generate content. Please try again.')
  }
}

// Export singleton instance
export const claudeService = new ClaudeService()
export default claudeService
