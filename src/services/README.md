# Service Layer Architecture

This directory contains the service layer that isolates PocketBase implementation from the rest of the application.

## Why Service Layer?

1. **Separation of Concerns**: Business logic is separated from UI components
2. **Easier Testing**: Services can be mocked easily
3. **Future-Proof**: Easy to add offline-first, caching, or switch backends
4. **Consistent API**: All data operations go through a unified interface
5. **Error Handling**: Centralized error handling and formatting

## Structure

```
services/
├── index.ts                   # Central export point (import from here!)
├── pocketbase.ts             # Low-level PocketBase client (internal use only)
├── auth.service.ts           # Authentication operations
├── user.service.ts           # User profile and brand kit
├── generation.service.ts     # Carousel generation CRUD
├── subscription.service.ts   # Subscription checks and limits
└── README.md                 # This file
```

## Usage

**Always import from `services/index.ts`:**

```typescript
// ✅ CORRECT - Import from index
import { authService, userService, generationService } from '@/services'

// ❌ WRONG - Don't import individual services
import { authService } from '@/services/auth.service'

// ❌ WRONG - NEVER import PocketBase directly in components
import pb from '@/services/pocketbase'
```

## Available Services

### 1. Auth Service (`authService`)

Handles all authentication operations.

```typescript
import { authService } from '@/services'

// Login
const { user, token } = await authService.login(email, password)

// Signup
await authService.signup(email, password, passwordConfirm)

// Google OAuth
const { user, token } = await authService.loginWithGoogle()

// Logout
authService.logout()

// Password reset
await authService.requestPasswordReset(email)

// Get current state
const { isAuthenticated, user, token } = authService.getAuthState()

// Listen to auth changes
const unsubscribe = authService.onAuthChange((user) => {
  console.log('Auth changed:', user)
})
```

### 2. User Service (`userService`)

Manages user profiles and brand kits.

```typescript
import { userService } from '@/services'

// Get current user
const user = userService.getCurrentUser()

// Update user
await userService.updateUser(userId, {
  name: 'John Doe',
  brand_color: '#667eea',
})

// Upload file (headshot, logo)
await userService.uploadFile(userId, 'brand_headshot', file)

// Update brand kit
await userService.updateBrandKit(userId, {
  headshot: 'url',
  logo: 'url',
  color: '#667eea',
  tagline: 'DM me GROW',
})

// Get file URL
const url = userService.getFileUrl(user, user.brand_headshot)

// Train custom voice
await userService.trainCustomVoice(userId, samplePosts)

// Update language
await userService.updateLanguage(userId, 'pt-BR')
```

### 3. Generation Service (`generationService`)

Manages carousel generations.

```typescript
import { generationService } from '@/services'

// Create generation
const generation = await generationService.create({
  input_text: 'Content here',
  style: 'hormozi',
  caption: 'Caption here',
  pinned_comment: 'Comment here',
  hooks: ['Hook 1', 'Hook 2', 'Hook 3'],
})

// Get by ID
const generation = await generationService.getById(id)

// List with filters
const { items, totalItems } = await generationService.list({
  page: 1,
  perPage: 20,
  style: 'hormozi',
  searchQuery: 'marketing',
  sortBy: '-created',
})

// Update
await generationService.update(id, { caption: 'New caption' })

// Delete
await generationService.delete(id)

// Count
const count = await generationService.count()

// Upload PDF
await generationService.uploadPDF(generationId, pdfFile)

// Get PDF URL
const url = generationService.getPDFUrl(generation)
```

### 4. Subscription Service (`subscriptionService`)

Checks subscription status and limits.

```typescript
import { subscriptionService } from '@/services'

// Check subscription
const { tier, generations_used, generations_limit, can_generate } =
  await subscriptionService.checkSubscription()

// Can user generate?
const canGenerate = await subscriptionService.canGenerate()

// Get tier
const tier = subscriptionService.getTier() // 'free' | 'pro' | 'founder'

// Is pro?
const isPro = subscriptionService.isPro()

// Remaining free generations
const remaining = await subscriptionService.getRemainingFreeGenerations()
```

## Error Handling

All services handle errors consistently:

```typescript
try {
  await authService.login(email, password)
} catch (error) {
  // Error is already formatted with a user-friendly message
  console.error(error.message) // "Invalid email or password"
}
```

## Future: Offline-First

The service layer makes it easy to add offline capabilities:

1. **Caching Layer**: Add caching between service and PocketBase
2. **Queue**: Queue operations when offline
3. **Sync**: Sync when back online
4. **IndexedDB**: Store data locally

Example future implementation:

```typescript
class GenerationService {
  async list(options) {
    // Try cache first
    const cached = await cache.get('generations', options)
    if (cached && !navigator.onLine) return cached

    // Fetch from server
    const result = await pb.client.collection('generations').getList(...)

    // Update cache
    await cache.set('generations', options, result)

    return result
  }
}
```

## Testing

Services are easy to mock:

```typescript
// Mock auth service for testing
const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  getAuthState: jest.fn(() => ({ isAuthenticated: true, user: mockUser })),
}

jest.mock('@/services', () => ({
  authService: mockAuthService,
}))
```

## Best Practices

1. **Never import PocketBase directly** in components/pages
2. **Always use services** for all data operations
3. **Import from index.ts** for consistent API
4. **Handle errors** at the component level
5. **Use TypeScript types** from service exports

## Adding New Services

When adding a new service:

1. Create `new-feature.service.ts`
2. Export singleton instance
3. Add to `index.ts` exports
4. Document here
5. Update types if needed

```typescript
// new-feature.service.ts
class NewFeatureService {
  async doSomething() {
    // Implementation
  }
}

export const newFeatureService = new NewFeatureService()
export default newFeatureService

// index.ts
export { newFeatureService } from './new-feature.service'
```

## Migration from Direct PocketBase Usage

If you find direct PocketBase usage in the codebase:

```typescript
// ❌ OLD - Direct PocketBase
import pb from '@/services/pocketbase'
const user = pb.currentUser

// ✅ NEW - Service layer
import { authService } from '@/services'
const { user } = authService.getAuthState()
```

Always refactor to use the service layer.
