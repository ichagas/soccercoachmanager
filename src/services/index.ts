/**
 * Services Index
 *
 * Central export point for all services.
 * Components should import from here, not from individual service files.
 */

export { authService } from './auth.service'
export { userService } from './user.service'
export { teamService } from './team.service'
export { playerService } from './player.service'
export { gameService } from './game.service'
export { practiceService } from './practice.service'
export { analyticsService } from './analytics.service'
export { pb } from './pocketbase'

export type { AuthResult, AuthState } from './auth.service'

// Re-export types for convenience
export type {
  User,
  Team,
  Player,
  Game,
  PracticePlan,
  FocusArea,
  TeamAnalytics,
} from '../types'
