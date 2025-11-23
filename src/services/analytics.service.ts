/**
 * Analytics Service
 *
 * Handles team analytics, benchmarks, and recommendations
 */

import { gameService } from './game.service'
import type {
  Game,
  TeamAnalytics,
  FocusArea,
  BenchmarkLevel,
  TrendDirection,
  AnalyticsBenchmarks,
} from '../types'

class AnalyticsService {
  // Benchmark thresholds for each metric
  private readonly benchmarks: AnalyticsBenchmarks = {
    chances_created: {
      good: 3,
      poor: 2,
    },
    chances_conceded: {
      good: 3,
      poor: 5,
    },
    recoveries: {
      good: 8,
      poor: 5,
    },
    bad_touches: {
      good: 8,
      poor: 12,
    },
  }

  /**
   * Calculate analytics for a team
   */
  async calculateTeamAnalytics(teamId: string): Promise<TeamAnalytics | null> {
    try {
      // Get last 5 finalized games
      const recentGames = await gameService.getRecentGames(teamId, 5)

      if (recentGames.length === 0) {
        return null
      }

      // Calculate rolling averages
      const rollingAverage = this.calculateRollingAverages(recentGames)

      // Determine benchmark levels
      const benchmarkLevels = this.calculateBenchmarks(rollingAverage)

      // Determine recommended focus area
      const recommendedFocus = this.determineRecommendedFocus(benchmarkLevels, rollingAverage)

      // Determine trend
      const trend = this.determineTrend(recentGames)

      return {
        team_id: teamId,
        rolling_average: rollingAverage,
        benchmarks: benchmarkLevels,
        recommended_focus: recommendedFocus,
        trend,
        last_5_games: recentGames,
      }
    } catch (error) {
      console.error('[AnalyticsService] Calculate team analytics failed:', error)
      return null
    }
  }

  /**
   * Calculate rolling averages from recent games
   */
  private calculateRollingAverages(games: Game[]) {
    const totalGames = games.length

    const sums = games.reduce(
      (acc, game) => ({
        chances_created: acc.chances_created + game.chances_created,
        chances_conceded: acc.chances_conceded + game.chances_conceded,
        recoveries: acc.recoveries + game.recoveries,
        bad_touches: acc.bad_touches + game.bad_touches,
      }),
      {
        chances_created: 0,
        chances_conceded: 0,
        recoveries: 0,
        bad_touches: 0,
      }
    )

    return {
      chances_created: Math.round((sums.chances_created / totalGames) * 10) / 10,
      chances_conceded: Math.round((sums.chances_conceded / totalGames) * 10) / 10,
      recoveries: Math.round((sums.recoveries / totalGames) * 10) / 10,
      bad_touches: Math.round((sums.bad_touches / totalGames) * 10) / 10,
    }
  }

  /**
   * Calculate benchmark levels for each metric
   */
  private calculateBenchmarks(averages: {
    chances_created: number
    chances_conceded: number
    recoveries: number
    bad_touches: number
  }) {
    return {
      chances_created: this.getBenchmarkLevel(
        averages.chances_created,
        this.benchmarks.chances_created,
        'higher'
      ),
      chances_conceded: this.getBenchmarkLevel(
        averages.chances_conceded,
        this.benchmarks.chances_conceded,
        'lower'
      ),
      recoveries: this.getBenchmarkLevel(
        averages.recoveries,
        this.benchmarks.recoveries,
        'higher'
      ),
      bad_touches: this.getBenchmarkLevel(
        averages.bad_touches,
        this.benchmarks.bad_touches,
        'lower'
      ),
    }
  }

  /**
   * Get benchmark level for a metric
   */
  private getBenchmarkLevel(
    value: number,
    benchmark: { good: number; poor: number },
    direction: 'higher' | 'lower'
  ): BenchmarkLevel {
    if (direction === 'higher') {
      if (value >= benchmark.good) return 'good'
      if (value <= benchmark.poor) return 'needs_work'
      return 'average'
    } else {
      if (value <= benchmark.good) return 'good'
      if (value >= benchmark.poor) return 'needs_work'
      return 'average'
    }
  }

  /**
   * Determine recommended focus area based on benchmarks
   */
  private determineRecommendedFocus(
    benchmarks: {
      chances_created: BenchmarkLevel
      chances_conceded: BenchmarkLevel
      recoveries: BenchmarkLevel
      bad_touches: BenchmarkLevel
    },
    averages: {
      chances_created: number
      chances_conceded: number
      recoveries: number
      bad_touches: number
    }
  ): FocusArea {
    // Priority order: Fix the worst issue first
    // 1. High chances conceded -> Defense
    if (benchmarks.chances_conceded === 'needs_work') {
      return 'defense'
    }

    // 2. High bad touches -> Control
    if (benchmarks.bad_touches === 'needs_work') {
      return 'control'
    }

    // 3. Low recoveries -> Pressing
    if (benchmarks.recoveries === 'needs_work') {
      return 'pressing'
    }

    // 4. Low chances created -> Attack
    if (benchmarks.chances_created === 'needs_work') {
      return 'attack'
    }

    // If everything is average or better, focus on what needs improvement most
    if (averages.chances_conceded > this.benchmarks.chances_conceded.poor) {
      return 'defense'
    }
    if (averages.bad_touches > this.benchmarks.bad_touches.poor) {
      return 'control'
    }
    if (averages.recoveries < this.benchmarks.recoveries.poor) {
      return 'pressing'
    }

    // Default to attack for general improvement
    return 'attack'
  }

  /**
   * Determine trend direction from recent games
   */
  private determineTrend(games: Game[]): TrendDirection {
    if (games.length < 3) {
      return 'stable'
    }

    // Compare first half vs second half of games
    const midpoint = Math.floor(games.length / 2)
    const firstHalf = games.slice(0, midpoint)
    const secondHalf = games.slice(midpoint)

    const firstAvg = this.calculateRollingAverages(firstHalf)
    const secondAvg = this.calculateRollingAverages(secondHalf)

    // Calculate overall improvement score
    let improvementScore = 0

    // Positive metrics (higher is better)
    if (secondAvg.chances_created > firstAvg.chances_created) improvementScore++
    if (secondAvg.recoveries > firstAvg.recoveries) improvementScore++

    // Negative metrics (lower is better)
    if (secondAvg.chances_conceded < firstAvg.chances_conceded) improvementScore++
    if (secondAvg.bad_touches < firstAvg.bad_touches) improvementScore++

    if (improvementScore >= 3) return 'improving'
    if (improvementScore <= 1) return 'declining'
    return 'stable'
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService()
export default analyticsService
