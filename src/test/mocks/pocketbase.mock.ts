import { vi } from 'vitest'

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  brand_headshot: 'headshot.jpg',
  brand_logo: 'logo.png',
  brand_color: '#667eea',
  brand_tagline: 'Test tagline',
  custom_voice_samples: '',
  is_pro: false,
  stripe_customer_id: '',
  preferred_language: 'en' as const,
  created: '2025-01-01T00:00:00.000Z',
  updated: '2025-01-01T00:00:00.000Z',
}

export const mockGeneration = {
  id: 'test-generation-id',
  owner: 'test-user-id',
  input_text: 'Test input',
  style: 'hormozi' as const,
  carousel_pdf: 'test.pdf',
  caption: 'Test caption',
  pinned_comment: 'Test comment',
  hooks: ['Hook 1', 'Hook 2', 'Hook 3'],
  created: '2025-01-01T00:00:00.000Z',
  updated: '2025-01-01T00:00:00.000Z',
  collectionId: 'generations',
  collectionName: 'generations',
}

export const createMockPocketBase = () => {
  const authStore = {
    token: 'mock-token',
    model: mockUser,
    isValid: true,
    onChange: vi.fn((callback) => {
      return vi.fn() // unsubscribe function
    }),
    clear: vi.fn(),
  }

  const mockClient = {
    collection: vi.fn((name: string) => ({
      getOne: vi.fn(),
      getList: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      authWithPassword: vi.fn(),
      authWithOAuth2: vi.fn(),
      requestPasswordReset: vi.fn(),
      confirmPasswordReset: vi.fn(),
      authRefresh: vi.fn(),
    })),
    autoCancellation: vi.fn(),
    files: {
      getUrl: vi.fn((record, filename) => `http://localhost:8090/files/${filename}`),
    },
  }

  return {
    client: mockClient,
    auth: authStore,
    authStore,
    currentUser: mockUser,
    isAuthenticated: true,
    login: vi.fn(),
    signup: vi.fn(),
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    requestPasswordReset: vi.fn(),
    updateUser: vi.fn(),
    uploadFile: vi.fn(),
    getFileUrl: vi.fn(),
    createGeneration: vi.fn(),
    getGeneration: vi.fn(),
    updateGeneration: vi.fn(),
    deleteGeneration: vi.fn(),
    countGenerations: vi.fn(),
    checkSubscription: vi.fn(),
  }
}

export const mockPocketBase = createMockPocketBase()
