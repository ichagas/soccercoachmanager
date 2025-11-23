// ============================================================================
// Soccer Coach Manager - TypeScript Type Definitions
// ============================================================================

// ----------------------------------------------------------------------------
// User types
// ----------------------------------------------------------------------------
export interface User {
  id: string
  email: string
  name?: string
  club_name?: string
  badge_level?: string
  preferred_language: 'en' | 'pt-BR' | 'es'
  avatar?: string
  created: string
  updated: string
}

// ----------------------------------------------------------------------------
// Team types
// ----------------------------------------------------------------------------
export interface Team {
  id: string
  user_id: string
  name: string
  season?: string
  age_group?: string
  created: string
  updated: string
  // Computed fields (not in DB)
  expand?: {
    user_id?: User
  }
}

export interface TeamWithStats extends Team {
  lastGame?: Game
  nextPractice?: PracticePlan
  focusArea?: FocusArea
  stats?: TeamStats
}

export interface TeamStats {
  chancesCreated: number
  chancesConceded: number
  recoveries: number
  badTouches: number
  gamesCount: number
}

// ----------------------------------------------------------------------------
// Player types
// ----------------------------------------------------------------------------
export interface Player {
  id: string
  team_id: string
  name: string
  number?: number
  position?: PlayerPosition
  strengths: string[]
  improvements: string[]
  monthly_rating: MonthlyRatings
  notes?: string
  created: string
  updated: string
  // Computed fields
  expand?: {
    team_id?: Team
  }
}

export type PlayerPosition =
  | 'goalkeeper'
  | 'defender'
  | 'midfielder'
  | 'forward'
  | 'centerBack'
  | 'fullback'
  | 'wingback'
  | 'defensiveMid'
  | 'centralMid'
  | 'attackingMid'
  | 'winger'
  | 'striker'

export interface MonthlyRatings {
  [key: string]: number // Format: "YYYY-MM": 1-5
}

// ----------------------------------------------------------------------------
// Game types
// ----------------------------------------------------------------------------
export interface Game {
  id: string
  team_id: string
  opponent: string
  date: string
  chances_created: number
  chances_conceded: number
  recoveries: number
  bad_touches: number
  notes?: string
  status: GameStatus
  created: string
  updated: string
  // Computed fields
  expand?: {
    team_id?: Team
  }
}

export type GameStatus = 'draft' | 'final'

export interface GameFormData {
  team_id: string
  opponent: string
  date: string
  chances_created: number
  chances_conceded: number
  recoveries: number
  bad_touches: number
  notes?: string
  status: GameStatus
}

// ----------------------------------------------------------------------------
// Practice Plan types
// ----------------------------------------------------------------------------
export interface PracticePlan {
  id: string
  team_id: string
  focus: FocusArea
  drills: Drill[]
  week_of?: string
  created: string
  updated: string
  // Computed fields
  expand?: {
    team_id?: Team
  }
}

export type FocusArea = 'defense' | 'attack' | 'control' | 'pressing'

export interface Drill {
  id?: string
  name: string
  type: DrillType
  duration: number
  players?: string
  setup?: string
  cues: string[]
  rules?: string[]
}

export type DrillType = 'drill' | 'ssg' // ssg = small-sided game

export interface DrillLibrary {
  version: string
  last_updated: string
  focus_areas: {
    [key in FocusArea]: FocusAreaData
  }
  warm_up_activities: Activity[]
  cool_down_activities: Activity[]
  coaching_tips: {
    [key in FocusArea]: string[]
  }
}

export interface FocusAreaData {
  name: string
  description: string
  drills: Drill[]
  small_sided_games: Drill[]
}

export interface Activity {
  name: string
  duration: number
  description: string
}

// ----------------------------------------------------------------------------
// Analytics types
// ----------------------------------------------------------------------------
export interface TeamAnalytics {
  team_id: string
  rolling_average: {
    chances_created: number
    chances_conceded: number
    recoveries: number
    bad_touches: number
  }
  benchmarks: {
    chances_created: BenchmarkLevel
    chances_conceded: BenchmarkLevel
    recoveries: BenchmarkLevel
    bad_touches: BenchmarkLevel
  }
  recommended_focus: FocusArea
  trend: TrendDirection
  last_5_games: Game[]
}

export type BenchmarkLevel = 'good' | 'needs_work' | 'average'
export type TrendDirection = 'improving' | 'declining' | 'stable'

export interface AnalyticsBenchmarks {
  chances_created: {
    good: number
    poor: number
  }
  chances_conceded: {
    good: number
    poor: number
  }
  recoveries: {
    good: number
    poor: number
  }
  bad_touches: {
    good: number
    poor: number
  }
}

// ----------------------------------------------------------------------------
// API Response types
// ----------------------------------------------------------------------------
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: T[]
}

// ----------------------------------------------------------------------------
// PocketBase response types
// ----------------------------------------------------------------------------
export interface PocketBaseRecord {
  id: string
  created: string
  updated: string
  collectionId: string
  collectionName: string
}

export interface PocketBaseList<T> {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: T[]
}

// ----------------------------------------------------------------------------
// Form types
// ----------------------------------------------------------------------------
export interface TeamFormData {
  name: string
  season?: string
  age_group?: string
}

export interface PlayerFormData {
  name: string
  number?: number
  position?: PlayerPosition
  strengths: string[]
  improvements: string[]
  notes?: string
}

export interface PracticePlanFormData {
  team_id: string
  focus: FocusArea
  week_of?: string
}

// ----------------------------------------------------------------------------
// Language types
// ----------------------------------------------------------------------------
export type Language = 'en' | 'pt-BR' | 'es'

export interface LanguageOption {
  code: Language
  name: string
  flag: string
}

// ----------------------------------------------------------------------------
// UI State types
// ----------------------------------------------------------------------------
export interface LoadingState {
  isLoading: boolean
  message?: string
}

export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

// ----------------------------------------------------------------------------
// Utility types
// ----------------------------------------------------------------------------
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ID = string

// ----------------------------------------------------------------------------
// Export all types
// ----------------------------------------------------------------------------
export type {
  User,
  Team,
  TeamWithStats,
  TeamStats,
  Player,
  PlayerPosition,
  MonthlyRatings,
  Game,
  GameStatus,
  GameFormData,
  PracticePlan,
  FocusArea,
  Drill,
  DrillType,
  DrillLibrary,
  FocusAreaData,
  Activity,
  TeamAnalytics,
  BenchmarkLevel,
  TrendDirection,
  AnalyticsBenchmarks,
  ApiResponse,
  PaginatedResponse,
  PocketBaseRecord,
  PocketBaseList,
  TeamFormData,
  PlayerFormData,
  PracticePlanFormData,
  Language,
  LanguageOption,
  LoadingState,
  ErrorState,
  ToastMessage,
}
