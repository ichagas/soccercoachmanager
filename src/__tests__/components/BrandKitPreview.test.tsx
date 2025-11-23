import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import BrandKitPreview from '../../components/BrandKitPreview'
import { AuthProvider } from '../../contexts/AuthContext'
import { authService } from '../../services'

// Mock services
vi.mock('../../services', () => ({
  authService: {
    getAuthState: vi.fn(),
    onAuthChange: vi.fn(() => vi.fn()),
  },
  userService: {
    getFileUrl: vi.fn((user, filename) => `https://example.com/${filename}`),
  },
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.edit': 'Edit',
        'create.brandKit.title': 'Brand Kit',
        'create.brandKit.headshot': 'Headshot',
        'create.brandKit.logo': 'Logo',
        'create.brandKit.color': 'Brand Color',
        'create.brandKit.tagline': 'Tagline',
        'create.brandKit.noBrandKit': 'No brand kit set up yet',
        'create.brandKit.setupBrandKit': 'Set up brand kit',
      }
      return translations[key] || key
    },
  }),
}))

const mockAuthState = (user: unknown) => {
  vi.mocked(authService.getAuthState).mockReturnValue({
    isAuthenticated: !!user,
    user: user as never,
    token: user ? 'token' : null,
  })
}

const renderBrandKitPreview = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <BrandKitPreview />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('BrandKitPreview', () => {
  it('should render brand kit title and edit link', () => {
    mockAuthState({
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
    })

    renderBrandKitPreview()

    expect(screen.getByText('Brand Kit')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('should show empty state when no brand kit is set up', () => {
    mockAuthState({
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
    })

    renderBrandKitPreview()

    expect(screen.getByText('No brand kit set up yet')).toBeInTheDocument()
    expect(screen.getByText('Set up brand kit')).toBeInTheDocument()
  })

  it('should display brand kit when headshot is set', () => {
    mockAuthState({
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
      brand_headshot: 'headshot.jpg',
      brand_color: '#667eea',
    })

    renderBrandKitPreview()

    expect(screen.getByAltText('Brand headshot')).toBeInTheDocument()
    expect(screen.queryByText('No brand kit set up yet')).not.toBeInTheDocument()
  })

  it('should display brand kit when logo is set', () => {
    mockAuthState({
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
      brand_logo: 'logo.png',
    })

    renderBrandKitPreview()

    expect(screen.getByAltText('Brand logo')).toBeInTheDocument()
  })

  it('should display tagline when set', () => {
    mockAuthState({
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
      brand_headshot: 'headshot.jpg',
      brand_tagline: 'DM me GROW',
    })

    renderBrandKitPreview()

    expect(screen.getByText('DM me GROW')).toBeInTheDocument()
  })

  it('should show checkmarks for completed brand elements', () => {
    mockAuthState({
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
      brand_headshot: 'headshot.jpg',
      brand_logo: 'logo.png',
      brand_color: '#667eea',
      brand_tagline: 'DM me GROW',
    })

    renderBrandKitPreview()

    // All elements should show checkmarks
    const checkmarks = screen.getAllByText('✓')
    expect(checkmarks.length).toBeGreaterThan(0)
  })

  it('should show circles for incomplete brand elements', () => {
    mockAuthState({
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
      brand_headshot: 'headshot.jpg',
      // No logo, color, or tagline
    })

    renderBrandKitPreview()

    // Some elements should show circles
    const circles = screen.getAllByText('○')
    expect(circles.length).toBeGreaterThan(0)
  })

  it('should display user initial when no headshot is set', () => {
    mockAuthState({
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
      brand_color: '#667eea', // Has brand kit, but no headshot
    })

    renderBrandKitPreview()

    expect(screen.getByText('T')).toBeInTheDocument() // First letter of email
  })

  it('should use default color when brand color is not set', () => {
    mockAuthState({
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
      brand_headshot: 'headshot.jpg',
    })

    renderBrandKitPreview()

    // Should render without errors with default color
    expect(screen.getByAltText('Brand headshot')).toBeInTheDocument()
  })
})
