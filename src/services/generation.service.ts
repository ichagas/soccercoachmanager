/**
 * Generation Service
 *
 * Handles all carousel generation operations.
 * Isolates PocketBase implementation from the rest of the app.
 */

import pb from './pocketbase'
import type { Generation, StyleOption } from '../types'

export interface CreateGenerationData {
  input_text: string
  style: StyleOption
  caption: string
  pinned_comment: string
  hooks: string[]
  carousel_pdf?: File
}

export interface GenerationListOptions {
  page?: number
  perPage?: number
  style?: StyleOption
  searchQuery?: string
  sortBy?: 'created' | '-created' | 'updated' | '-updated'
}

export interface GenerationListResult {
  items: Generation[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

class GenerationService {
  /**
   * Create a new generation
   */
  async create(data: CreateGenerationData): Promise<Generation> {
    try {
      const generation = await pb.createGeneration({
        input_text: data.input_text,
        style: data.style,
        caption: data.caption,
        pinned_comment: data.pinned_comment,
        hooks: data.hooks,
      })
      return generation as unknown as Generation
    } catch (error) {
      console.error('[GenerationService] Create generation failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get generation by ID
   */
  async getById(id: string): Promise<Generation> {
    try {
      const generation = await pb.getGeneration(id)
      return generation
    } catch (error) {
      console.error('[GenerationService] Get generation failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * List generations with filters and pagination
   */
  async list(options: GenerationListOptions = {}): Promise<GenerationListResult> {
    try {
      const { page = 1, perPage = 20, style, searchQuery, sortBy = '-created' } = options

      // Build filter
      let filter = `owner = "${pb.currentUser?.id}"`

      if (style) {
        filter += ` && style = "${style}"`
      }

      if (searchQuery) {
        filter += ` && (input_text ~ "${searchQuery}" || caption ~ "${searchQuery}")`
      }

      const result = await pb.client.collection('generations').getList<Generation>(page, perPage, {
        sort: sortBy,
        filter,
      })

      return {
        items: result.items,
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      }
    } catch (error) {
      console.error('[GenerationService] List generations failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update generation
   */
  async update(id: string, data: Partial<CreateGenerationData>): Promise<Generation> {
    try {
      const generation = await pb.updateGeneration(id, data as Partial<Generation>)
      return generation as unknown as Generation
    } catch (error) {
      console.error('[GenerationService] Update generation failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Delete generation
   */
  async delete(id: string): Promise<void> {
    try {
      await pb.deleteGeneration(id)
    } catch (error) {
      console.error('[GenerationService] Delete generation failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Count user's generations
   */
  async count(): Promise<number> {
    try {
      return await pb.countGenerations()
    } catch (error) {
      console.error('[GenerationService] Count generations failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Upload PDF to generation
   */
  async uploadPDF(generationId: string, file: File): Promise<Generation> {
    try {
      const formData = new FormData()
      formData.append('carousel_pdf', file)

      const generation = await pb.client
        .collection('generations')
        .update<Generation>(generationId, formData)

      return generation
    } catch (error) {
      console.error('[GenerationService] Upload PDF failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get PDF URL for generation
   */
  getPDFUrl(generation: Generation): string | null {
    if (!generation.carousel_pdf) return null
    return pb.getFileUrl(generation, generation.carousel_pdf)
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
export const generationService = new GenerationService()
export default generationService
