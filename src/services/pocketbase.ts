import PocketBase from 'pocketbase'
import type {
  User,
  Team,
  Player,
  Game,
  PracticePlan,
  PocketBaseList,
} from '../types'

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090'

class PocketBaseService {
  private pb: PocketBase

  constructor() {
    this.pb = new PocketBase(PB_URL)
    // Auto-refresh auth token
    this.pb.autoCancellation(false)
  }

  get client() {
    return this.pb
  }

  get auth() {
    return this.pb.authStore
  }

  get currentUser() {
    return this.pb.authStore.model as User | null
  }

  get isAuthenticated() {
    return this.pb.authStore.isValid
  }

  // ============================================================================
  // Auth methods
  // ============================================================================

  async login(email: string, password: string) {
    return await this.pb.collection('users').authWithPassword(email, password)
  }

  async signup(email: string, password: string, passwordConfirm: string, name?: string) {
    const data = {
      email,
      password,
      passwordConfirm,
      name: name || '',
      preferred_language: 'en' as const,
    }
    return await this.pb.collection('users').create(data)
  }

  async loginWithGoogle() {
    return await this.pb.collection('users').authWithOAuth2({ provider: 'google' })
  }

  async requestPasswordReset(email: string) {
    return await this.pb.collection('users').requestPasswordReset(email)
  }

  logout() {
    this.pb.authStore.clear()
  }

  // ============================================================================
  // User methods
  // ============================================================================

  async updateUser(id: string, data: Partial<User>) {
    return await this.pb.collection('users').update<User>(id, data)
  }

  async getUser(id: string) {
    return await this.pb.collection('users').getOne<User>(id)
  }

  async uploadFile(collection: string, recordId: string, field: string, file: File) {
    const formData = new FormData()
    formData.append(field, file)
    return await this.pb.collection(collection).update(recordId, formData)
  }

  getFileUrl(record: any, filename: string, thumb?: string) {
    return this.pb.files.getUrl(record, filename, { thumb })
  }

  // ============================================================================
  // Team methods
  // ============================================================================

  async createTeam(data: Partial<Team>) {
    return await this.pb.collection('teams').create<Team>({
      ...data,
      user_id: this.currentUser?.id,
    })
  }

  async getTeams(page = 1, perPage = 50) {
    return await this.pb.collection('teams').getList<Team>(page, perPage, {
      sort: '-created',
      filter: `user_id = "${this.currentUser?.id}"`,
    })
  }

  async getTeam(id: string) {
    return await this.pb.collection('teams').getOne<Team>(id)
  }

  async updateTeam(id: string, data: Partial<Team>) {
    return await this.pb.collection('teams').update<Team>(id, data)
  }

  async deleteTeam(id: string) {
    return await this.pb.collection('teams').delete(id)
  }

  // ============================================================================
  // Player methods
  // ============================================================================

  async createPlayer(data: Partial<Player>) {
    return await this.pb.collection('players').create<Player>(data)
  }

  async getPlayers(teamId: string, page = 1, perPage = 100) {
    return await this.pb.collection('players').getList<Player>(page, perPage, {
      sort: 'number,name',
      filter: `team_id = "${teamId}"`,
    })
  }

  async getPlayer(id: string) {
    return await this.pb.collection('players').getOne<Player>(id)
  }

  async updatePlayer(id: string, data: Partial<Player>) {
    return await this.pb.collection('players').update<Player>(id, data)
  }

  async deletePlayer(id: string) {
    return await this.pb.collection('players').delete(id)
  }

  // ============================================================================
  // Game methods
  // ============================================================================

  async createGame(data: Partial<Game>) {
    return await this.pb.collection('games').create<Game>({
      ...data,
      status: data.status || 'draft',
    })
  }

  async getGames(teamId: string, page = 1, perPage = 50) {
    return await this.pb.collection('games').getList<Game>(page, perPage, {
      sort: '-date',
      filter: `team_id = "${teamId}"`,
    })
  }

  async getRecentGames(teamId: string, limit = 5) {
    return await this.pb.collection('games').getList<Game>(1, limit, {
      sort: '-date',
      filter: `team_id = "${teamId}" && status = "final"`,
    })
  }

  async getGame(id: string) {
    return await this.pb.collection('games').getOne<Game>(id)
  }

  async updateGame(id: string, data: Partial<Game>) {
    return await this.pb.collection('games').update<Game>(id, data)
  }

  async deleteGame(id: string) {
    return await this.pb.collection('games').delete(id)
  }

  // ============================================================================
  // Practice Plan methods
  // ============================================================================

  async createPracticePlan(data: Partial<PracticePlan>) {
    return await this.pb.collection('practice_plans').create<PracticePlan>(data)
  }

  async getPracticePlans(teamId: string, page = 1, perPage = 50) {
    return await this.pb.collection('practice_plans').getList<PracticePlan>(page, perPage, {
      sort: '-created',
      filter: `team_id = "${teamId}"`,
    })
  }

  async getPracticePlan(id: string) {
    return await this.pb.collection('practice_plans').getOne<PracticePlan>(id)
  }

  async updatePracticePlan(id: string, data: Partial<PracticePlan>) {
    return await this.pb.collection('practice_plans').update<PracticePlan>(id, data)
  }

  async deletePracticePlan(id: string) {
    return await this.pb.collection('practice_plans').delete(id)
  }

  // ============================================================================
  // Utility methods
  // ============================================================================

  async countTeams() {
    const result = await this.pb.collection('teams').getList(1, 1, {
      filter: `user_id = "${this.currentUser?.id}"`,
    })
    return result.totalItems
  }

  async countPlayers(teamId: string) {
    const result = await this.pb.collection('players').getList(1, 1, {
      filter: `team_id = "${teamId}"`,
    })
    return result.totalItems
  }

  async countGames(teamId: string) {
    const result = await this.pb.collection('games').getList(1, 1, {
      filter: `team_id = "${teamId}"`,
    })
    return result.totalItems
  }
}

// Export singleton instance
export const pb = new PocketBaseService()
export default pb
