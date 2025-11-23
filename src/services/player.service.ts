/**
 * Player Service
 *
 * Handles all player-related operations
 */

import pb from './pocketbase'
import type { Player, PlayerFormData } from '../types'

class PlayerService {
  /**
   * Create a new player
   */
  async createPlayer(teamId: string, data: PlayerFormData): Promise<Player> {
    try {
      return await pb.createPlayer({
        ...data,
        team_id: teamId,
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        monthly_rating: {},
      })
    } catch (error) {
      console.error('[PlayerService] Create player failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get all players for a team
   */
  async getPlayers(teamId: string): Promise<Player[]> {
    try {
      const result = await pb.getPlayers(teamId)
      return result.items
    } catch (error) {
      console.error('[PlayerService] Get players failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get a single player by ID
   */
  async getPlayer(id: string): Promise<Player> {
    try {
      return await pb.getPlayer(id)
    } catch (error) {
      console.error('[PlayerService] Get player failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update a player
   */
  async updatePlayer(id: string, data: Partial<PlayerFormData>): Promise<Player> {
    try {
      return await pb.updatePlayer(id, data)
    } catch (error) {
      console.error('[PlayerService] Update player failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Delete a player
   */
  async deletePlayer(id: string): Promise<boolean> {
    try {
      await pb.deletePlayer(id)
      return true
    } catch (error) {
      console.error('[PlayerService] Delete player failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update player rating for a specific month
   */
  async updateMonthlyRating(
    playerId: string,
    month: string,
    rating: number
  ): Promise<Player> {
    try {
      const player = await this.getPlayer(playerId)
      const updatedRatings = {
        ...player.monthly_rating,
        [month]: rating,
      }
      return await pb.updatePlayer(playerId, { monthly_rating: updatedRatings })
    } catch (error) {
      console.error('[PlayerService] Update monthly rating failed:', error)
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
export const playerService = new PlayerService()
export default playerService
