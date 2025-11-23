/**
 * Team Service
 *
 * Handles all team-related operations
 */

import pb from './pocketbase'
import type { Team, TeamFormData } from '../types'

class TeamService {
  /**
   * Create a new team
   */
  async createTeam(data: TeamFormData): Promise<Team> {
    try {
      return await pb.createTeam(data)
    } catch (error) {
      console.error('[TeamService] Create team failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get all teams for current user
   */
  async getTeams(page = 1, perPage = 50): Promise<{ teams: Team[]; total: number }> {
    try {
      const result = await pb.getTeams(page, perPage)
      return {
        teams: result.items,
        total: result.totalItems,
      }
    } catch (error) {
      console.error('[TeamService] Get teams failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get a single team by ID
   */
  async getTeam(id: string): Promise<Team> {
    try {
      return await pb.getTeam(id)
    } catch (error) {
      console.error('[TeamService] Get team failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Update a team
   */
  async updateTeam(id: string, data: Partial<TeamFormData>): Promise<Team> {
    try {
      return await pb.updateTeam(id, data)
    } catch (error) {
      console.error('[TeamService] Update team failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Delete a team
   */
  async deleteTeam(id: string): Promise<boolean> {
    try {
      await pb.deleteTeam(id)
      return true
    } catch (error) {
      console.error('[TeamService] Delete team failed:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Get team count for current user
   */
  async getTeamCount(): Promise<number> {
    try {
      return await pb.countTeams()
    } catch (error) {
      console.error('[TeamService] Get team count failed:', error)
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
export const teamService = new TeamService()
export default teamService
