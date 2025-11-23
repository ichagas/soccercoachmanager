import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SettingsPage from '../../pages/Settings/SettingsPage'
import { userService } from '../../services'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.title': 'Settings',
        'settings.subtitle': 'Manage your account, brand kit, and preferences',
        'settings.account.title': 'Account Settings',
        'settings.account.email': 'Email Address',
        'settings.account.name': 'Name',
        'settings.account.namePlaceholder': 'Your name',
        'settings.brandKit.title': 'Brand Kit',
        'settings.brandKit.headshot': 'Brand Headshot',
        'settings.brandKit.logo': 'Brand Logo',
        'settings.brandKit.color': 'Brand Color',
        'settings.brandKit.tagline': 'Brand Tagline',
        'settings.brandKit.taglinePlaceholder': 'e.g., DM me \'GROW\' for the template',
        'settings.brandKit.uploadHeadshot': 'Upload Headshot',
        'settings.brandKit.uploadLogo': 'Upload Logo',
        'settings.preferences.title': 'Preferences',
        'settings.preferences.language': 'Language',
        'settings.save': 'Save Changes',
        'settings.saving': 'Saving...',
        'settings.reset': 'Reset',
        'settings.saveSuccess': 'Settings saved successfully!',
        'settings.saveError': 'Failed to save settings. Please try again.',
        'settings.languageUpdated': 'Language updated successfully',
        'settings.languageError': 'Failed to update language. Please try again.',
        'common.loading': 'Loading...',
      }
      return translations[key] || key
    },
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}))

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      brand_headshot: 'https://example.com/headshot.jpg',
      brand_logo: 'https://example.com/logo.png',
      brand_color: '#667eea',
      brand_tagline: 'Test Tagline',
      preferred_language: 'en' as const,
      is_pro: false,
      created: '2024-01-01',
      updated: '2024-01-01',
    },
    isAuthenticated: true,
    isLoading: false,
  }),
}))

// Mock userService
vi.mock('../../services', () => ({
  userService: {
    updateUser: vi.fn().mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      brand_headshot: 'https://example.com/headshot.jpg',
      brand_logo: 'https://example.com/logo.png',
      brand_color: '#667eea',
      brand_tagline: 'Test Tagline',
      preferred_language: 'en' as const,
      is_pro: false,
      created: '2024-01-01',
      updated: '2024-01-01',
    }),
    uploadFile: vi.fn().mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      brand_headshot: 'https://example.com/headshot.jpg',
      brand_logo: 'https://example.com/logo.png',
      brand_color: '#667eea',
      brand_tagline: 'Test Tagline',
      preferred_language: 'en' as const,
      is_pro: false,
      created: '2024-01-01',
      updated: '2024-01-01',
    }),
    updateLanguage: vi.fn().mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      brand_headshot: 'https://example.com/headshot.jpg',
      brand_logo: 'https://example.com/logo.png',
      brand_color: '#667eea',
      brand_tagline: 'Test Tagline',
      preferred_language: 'en' as const,
      is_pro: false,
      created: '2024-01-01',
      updated: '2024-01-01',
    }),
  },
}))

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render settings page with all sections', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Manage your account, brand kit, and preferences')).toBeInTheDocument()
    expect(screen.getByText('Account Settings')).toBeInTheDocument()
    expect(screen.getByText('Brand Kit')).toBeInTheDocument()
    expect(screen.getByText('Preferences')).toBeInTheDocument()
  })

  it('should display user email', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const emailInput = screen.getByDisplayValue('test@example.com')
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toBeDisabled()
  })

  it('should display user name', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const nameInput = screen.getByDisplayValue('Test User')
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).not.toBeDisabled()
  })

  it('should display brand color', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const colorInputs = screen.getAllByDisplayValue('#667eea')
    expect(colorInputs.length).toBeGreaterThan(0)
  })

  it('should display brand tagline', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const taglineInput = screen.getByDisplayValue('Test Tagline')
    expect(taglineInput).toBeInTheDocument()
  })

  it('should have editable name input', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const nameInput = screen.getByDisplayValue('Test User')
    expect(nameInput).not.toBeDisabled()
  })

  it('should have color picker inputs', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const colorInputs = screen.getAllByDisplayValue('#667eea')
    expect(colorInputs.length).toBeGreaterThan(0)
  })

  it('should have editable tagline input', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const taglineInput = screen.getByDisplayValue('Test Tagline')
    expect(taglineInput).not.toBeDisabled()
  })

  it('should show language toggle buttons', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    expect(screen.getByText('🇺🇸 English')).toBeInTheDocument()
    expect(screen.getByText('🇧🇷 Português')).toBeInTheDocument()
  })

  it('should call updateLanguage when language button is clicked', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const portugueseButton = screen.getByText('🇧🇷 Português')
    fireEvent.click(portugueseButton)

    await waitFor(() => {
      expect(userService.updateLanguage).toHaveBeenCalledWith('test-user-id', 'pt-BR')
    })
  })

  it('should render save and reset buttons', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Reset')).toBeInTheDocument()
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('should call updateUser when save button is clicked', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    // Click save
    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)

    // Should call updateUser with current values
    await waitFor(() => {
      expect(userService.updateUser).toHaveBeenCalledWith(
        'test-user-id',
        expect.objectContaining({
          name: 'Test User',
        })
      )
    })
  })

  it('should have reset button', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const resetButton = screen.getByText('Reset')
    expect(resetButton).toBeInTheDocument()
    expect(resetButton).not.toBeDisabled()
  })

  it('should display headshot preview if available', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const headshotImages = screen.getAllByAltText('Headshot')
    expect(headshotImages.length).toBeGreaterThan(0)
    expect(headshotImages[0]).toHaveAttribute('src', 'https://example.com/headshot.jpg')
  })

  it('should display logo preview if available', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const logoImages = screen.getAllByAltText('Logo')
    expect(logoImages.length).toBeGreaterThan(0)
    expect(logoImages[0]).toHaveAttribute('src', 'https://example.com/logo.png')
  })

  it('should render upload buttons for headshot and logo', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Upload Headshot')).toBeInTheDocument()
    expect(screen.getByText('Upload Logo')).toBeInTheDocument()
  })

  it('should show loading state when saving', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    )

    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)

    // Should show saving state briefly
    expect(screen.getByText(/Saving.../)).toBeInTheDocument()
  })
})
