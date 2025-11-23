/**
 * Game Service
 *
 * Handles all game-related operations
 */

import pb from './pocketbase'
import type { Game, GameFormData } from '../types'

class GameService {
  /**
   * Create a new game
   */
  async createGame(data: GameFormData): Promise<Game> {
    try {
      return await pb.createGame(data)
    } catch (error) {
      console.error('[GameService] Create game failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get all games for a team
   */
  async getGames(teamId: string): Promise<Game[]> {
    try {
      const result = await pb.getGames(teamId)
      return result.items
    } catch (error) {
      console.error('[GameService] Get games failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get recent finalized games for a team
   */
  async getRecentGames(teamId: string, limit = 5): Promise<Game[]> {
    try {
      const result = await pb.getRecentGames(teamId, limit)
      return result.items
    } catch (error) {
      console.error('[GameService] Get recent games failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get a single game by ID
   */
  async getGame(id: string): Promise<Game> {
    try {
      return await pb.getGame(id)
    } catch (error) {
      console.error('[GameService] Get game failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update a game
   */
  async updateGame(id: string, data: Partial<GameFormData>): Promise<Game> {
    try {
      return await pb.updateGame(id, data)
    } catch (error) {
      console.error('[GameService] Update game failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Delete a game
   */
  async deleteGame(id: string): Promise<boolean> {
    try {
      await pb.deleteGame(id)
      return true
    } catch (error) {
      console.error('[GameService] Delete game failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Finish a game (change status from draft to final)
   */
  async finishGame(id: string): Promise<Game> {
    try {
      return await pb.updateGame(id, { status: 'final' })
    } catch (error) {
      console.error('[GameService] Finish game failed:', error)
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
export const gameService = new GameService()
export default gameService
