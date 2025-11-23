import PocketBase from 'pocketbase'
import type { User, Generation } from '../types'

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

  // Auth methods
  async login(email: string, password: string) {
    return await this.pb.collection('users').authWithPassword(email, password)
  }

  async signup(email: string, password: string, passwordConfirm: string) {
    const data = {
      email,
      password,
      passwordConfirm,
      is_pro: false,
      preferred_language: 'en',
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

  // User methods
  async updateUser(id: string, data: Partial<User>) {
    return await this.pb.collection('users').update(id, data)
  }

  async uploadFile(collection: string, recordId: string, field: string, file: File) {
    const formData = new FormData()
    formData.append(field, file)
    return await this.pb.collection(collection).update(recordId, formData)
  }

  getFileUrl(record: any, filename: string, thumb?: string) {
    return this.pb.files.getUrl(record, filename, { thumb })
  }

  // Generation methods
  async createGeneration(data: Partial<Generation>) {
    return await this.pb.collection('generations').create({
      ...data,
      owner: this.currentUser?.id,
    })
  }

  async getGenerations(page = 1, perPage = 20) {
    return await this.pb.collection('generations').getList<Generation>(page, perPage, {
      sort: '-created',
      filter: `owner = "${this.currentUser?.id}"`,
    })
  }

  async getGeneration(id: string) {
    return await this.pb.collection('generations').getOne<Generation>(id)
  }

  async updateGeneration(id: string, data: Partial<Generation>) {
    return await this.pb.collection('generations').update(id, data)
  }

  async deleteGeneration(id: string) {
    return await this.pb.collection('generations').delete(id)
  }

  async countGenerations() {
    const result = await this.pb.collection('generations').getList(1, 1, {
      filter: `owner = "${this.currentUser?.id}"`,
    })
    return result.totalItems
  }

  // Subscription check
  async checkSubscription() {
    const user = this.currentUser
    if (!user) {
      return {
        tier: 'free' as const,
        generations_used: 0,
        generations_limit: 5,
        can_generate: false,
      }
    }

    const count = await this.countGenerations()
    const isPro = user.is_pro

    return {
      tier: isPro ? ('pro' as const) : ('free' as const),
      generations_used: count,
      generations_limit: isPro ? null : 5,
      can_generate: isPro || count < 5,
    }
  }
}

// Export singleton instance
export const pb = new PocketBaseService()
export default pb
