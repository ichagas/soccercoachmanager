/**
 * URL Service
 *
 * Handles URL fetching and content extraction.
 * Uses PocketBase hook for server-side fetching.
 */

import pb from './pocketbase'

export interface FetchUrlResult {
  success: boolean
  text?: string
  title?: string
  url?: string
  error?: string
}

class UrlService {
  /**
   * Fetch and extract text from URL
   */
  async fetchUrl(url: string): Promise<FetchUrlResult> {
    try {
      const response = await pb.client.send('/api/fetch-url', {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return response as FetchUrlResult
    } catch (error: any) {
      console.error('[UrlService] Fetch URL failed:', error)

      // Return error in expected format
      return {
        success: false,
        error: error?.message || 'Failed to fetch URL',
      }
    }
  }

  /**
   * Check if text appears to be a URL
   */
  isUrl(text: string): boolean {
    try {
      const url = new URL(text.trim())
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  /**
   * Extract URL from text (if present)
   */
  extractUrl(text: string): string | null {
    // Simple URL regex
    const urlRegex = /(https?:\/\/[^\s]+)/gi
    const match = text.match(urlRegex)
    return match ? match[0] : null
  }
}

// Export singleton instance
export const urlService = new UrlService()
export default urlService
