/**
 * Practice Service
 *
 * Handles practice plan generation and management
 */

import pb from './pocketbase'
import type { PracticePlan, PracticePlanFormData, Drill, DrillLibrary, FocusArea } from '../types'

class PracticeService {
  private drillLibrary: DrillLibrary | null = null

  /**
   * Load drill library from JSON
   */
  async loadDrillLibrary(): Promise<DrillLibrary> {
    if (this.drillLibrary) {
      return this.drillLibrary
    }

    try {
      const response = await fetch('/data/drills.json')
      if (!response.ok) {
        throw new Error('Failed to load drill library')
      }
      this.drillLibrary = await response.json()
      return this.drillLibrary
    } catch (error) {
      console.error('[PracticeService] Load drill library failed:', error)
      throw new Error('Failed to load drill library')
    }
  }

  /**
   * Generate a practice plan with random drill selection
   */
  async generatePracticePlan(focus: FocusArea): Promise<Drill[]> {
    try {
      const library = await this.loadDrillLibrary()
      const focusData = library.focus_areas[focus]

      // Randomly select 2 drills
      const selectedDrills = this.selectRandomItems(focusData.drills, 2)

      // Randomly select 1 small-sided game
      const selectedSSG = this.selectRandomItems(focusData.small_sided_games, 1)

      return [...selectedDrills, ...selectedSSG]
    } catch (error) {
      console.error('[PracticeService] Generate practice plan failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Create a new practice plan
   */
  async createPracticePlan(data: PracticePlanFormData): Promise<PracticePlan> {
    try {
      const drills = await this.generatePracticePlan(data.focus)
      return await pb.createPracticePlan({
        ...data,
        drills,
      })
    } catch (error) {
      console.error('[PracticeService] Create practice plan failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get all practice plans for a team
   */
  async getPracticePlans(teamId: string): Promise<PracticePlan[]> {
    try {
      const result = await pb.getPracticePlans(teamId)
      return result.items
    } catch (error) {
      console.error('[PracticeService] Get practice plans failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get a single practice plan by ID
   */
  async getPracticePlan(id: string): Promise<PracticePlan> {
    try {
      return await pb.getPracticePlan(id)
    } catch (error) {
      console.error('[PracticeService] Get practice plan failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update a practice plan
   */
  async updatePracticePlan(
    id: string,
    data: Partial<PracticePlan>
  ): Promise<PracticePlan> {
    try {
      return await pb.updatePracticePlan(id, data)
    } catch (error) {
      console.error('[PracticeService] Update practice plan failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Delete a practice plan
   */
  async deletePracticePlan(id: string): Promise<boolean> {
    try {
      await pb.deletePracticePlan(id)
      return true
    } catch (error) {
      console.error('[PracticeService] Delete practice plan failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Regenerate drills for a practice plan
   */
  async regeneratePracticePlan(planId: string, focus: FocusArea): Promise<PracticePlan> {
    try {
      const drills = await this.generatePracticePlan(focus)
      return await pb.updatePracticePlan(planId, { drills })
    } catch (error) {
      console.error('[PracticeService] Regenerate practice plan failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Randomly select N items from an array
   */
  private selectRandomItems<T>(items: T[], count: number): T[] {
    const shuffled = [...items].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
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
export const practiceService = new PracticeService()
export default practiceService
