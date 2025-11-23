import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CreatePage from '../../pages/Create/CreatePage'
import { AuthProvider } from '../../contexts/AuthContext'
import { authService, subscriptionService } from '../../services'

// Mock Navigation component
vi.mock('../../components/Navigation', () => ({
  default: () => <div>Navigation</div>,
}))

// Mock services
vi.mock('../../services', () => ({
  authService: {
    getAuthState: vi.fn(),
    onAuthChange: vi.fn(() => vi.fn()),
  },
  subscriptionService: {
    canGenerate: vi.fn(),
  },
  userService: {
    getFileUrl: vi.fn(() => 'https://example.com/file.jpg'),
  },
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'common.loading': 'Loading...',
        'common.edit': 'Edit',
        'create.title': 'Create Carousel',
        'create.subtitle': 'Transform your content',
        'create.inputLabel': 'Your Content',
        'create.inputPlaceholder': 'Paste URL...',
        'create.inputHint': 'Minimum 10 characters',
        'create.clearForm': 'Clear form',
        'create.minCharacters': `Minimum ${params?.min} characters required`,
        'create.limitMessage': 'Upgrade to Pro',
        'create.generate': 'Generate Carousel',
        'create.generating': 'Crafting your masterpiece...',
        'create.selectStyle': 'Select Style',
        'create.styleInfo': 'Style Guide',
        'create.brandKit.title': 'Brand Kit',
        'create.tips.title': 'Tips',
        'create.tips.tip1': 'Tip 1',
        'create.tips.tip2': 'Tip 2',
        'create.tips.tip3': 'Tip 3',
        'errors.limitReached': 'Limit reached',
        'upgrade.title': 'Upgrade to Pro',
        'create.styles.hormozi': 'Alex Hormozi',
        'create.styles.welsh': 'Justin Welsh',
        'create.styles.koe': 'Dan Koe',
        'create.styles.custom': 'Custom Voice',
        'create.styles.customDisabled': 'train first',
        'create.styleDescriptions.hormozi': 'Bold and direct',
        'create.styleDescriptions.welsh': 'Calm',
        'create.styleDescriptions.koe': 'Deep',
        'create.styleDescriptions.custom': 'Your voice',
        'create.brandKit.noBrandKit': 'No brand kit',
        'create.brandKit.setupBrandKit': 'Setup',
        'create.brandKit.headshot': 'Headshot',
        'create.brandKit.logo': 'Logo',
        'create.brandKit.color': 'Color',
        'create.brandKit.tagline': 'Tagline',
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

const renderCreatePage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CreatePage />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('CreatePage', () => {
  beforeEach(() => {
    mockAuthState({
      id: 'user-1',
      email: 'test@example.com',
      is_pro: false,
      preferred_language: 'en',
    })
    vi.mocked(subscriptionService.canGenerate).mockResolvedValue(true)
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should show loading state initially', () => {
    renderCreatePage()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render create page after loading', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Create Carousel')).toBeInTheDocument()
    })

    expect(screen.getByText('Transform your content')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Paste URL...')).toBeInTheDocument()
  })

  it('should allow text input in textarea', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Create Carousel')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Paste URL...')
    fireEvent.change(textarea, { target: { value: 'Test content here' } })

    expect(textarea).toHaveValue('Test content here')
  })

  it('should show character count', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Create Carousel')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Paste URL...')
    fireEvent.change(textarea, { target: { value: 'Hello world' } })

    expect(screen.getByText('11 / 10000')).toBeInTheDocument()
  })

  it.skip('should save draft to localStorage', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Create Carousel')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Paste URL...')
    fireEvent.change(textarea, { target: { value: 'Draft content' } })

    await waitFor(
      () => {
        const saved = localStorage.getItem('carousel_draft')
        expect(saved).toBeTruthy()
        if (saved) {
          const parsed = JSON.parse(saved)
          expect(parsed.inputText).toBe('Draft content')
        }
      },
      { timeout: 2000 }
    )
  })

  it('should clear form when clear button is clicked', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Create Carousel')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Paste URL...')
    fireEvent.change(textarea, { target: { value: 'Content to clear' } })

    await waitFor(() => {
      expect(screen.getByText('Clear form')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Clear form'))

    expect(textarea).toHaveValue('')
  })

  it('should disable generate button when input is empty', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Create Carousel')).toBeInTheDocument()
    })

    const generateButton = screen.getByText('Generate Carousel')
    expect(generateButton).toBeDisabled()
  })

  it('should disable generate button when input is too short', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Create Carousel')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Paste URL...')
    fireEvent.change(textarea, { target: { value: 'Short' } })

    const generateButton = screen.getByText('Generate Carousel')
    expect(generateButton).toBeDisabled()
  })

  it('should enable generate button when input is valid', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Create Carousel')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Paste URL...')
    fireEvent.change(textarea, {
      target: { value: 'This is a valid input with enough characters' },
    })

    await waitFor(() => {
      const generateButton = screen.getByText('Generate Carousel')
      expect(generateButton).not.toBeDisabled()
    })
  })

  it.skip('should show limit warning when user cannot generate', async () => {
    vi.mocked(subscriptionService.canGenerate).mockResolvedValue(false)
    renderCreatePage()

    await waitFor(
      () => {
        expect(screen.getByText('Limit reached')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )

    expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument()
  })

  it('should prevent max character input', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Create Carousel')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Paste URL...')
    const longText = 'a'.repeat(10001) // Over 10000 limit

    fireEvent.change(textarea, { target: { value: longText } })

    // Should be truncated to 10000
    expect((textarea as HTMLTextAreaElement).value.length).toBeLessThanOrEqual(
      10000
    )
  })

  it.skip('should show generating state when generate is clicked', async () => {
    // This test requires Claude API configuration and mocking
    // Skipped in unit tests, should be tested in integration tests
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Create Carousel')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Paste URL...')
    fireEvent.change(textarea, {
      target: { value: 'Valid content for generation' },
    })

    await waitFor(() => {
      const generateButton = screen.getByText('Generate Carousel')
      expect(generateButton).not.toBeDisabled()
      fireEvent.click(generateButton)
    })

    expect(screen.getByText('Crafting your masterpiece...')).toBeInTheDocument()
  })

  it('should render style selector', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Select Style')).toBeInTheDocument()
    })
  })

  it('should render brand kit preview', async () => {
    renderCreatePage()

    await waitFor(() => {
      expect(screen.getByText('Brand Kit')).toBeInTheDocument()
    })
  })

  it('should render tips section', async () => {
    renderCreatePage()

    await waitFor(
      () => {
        expect(screen.getByText(/Tips/)).toBeInTheDocument()
      },
      { timeout: 2000 }
    )

    expect(screen.getByText('Tip 1')).toBeInTheDocument()
    expect(screen.getByText('Tip 2')).toBeInTheDocument()
    expect(screen.getByText('Tip 3')).toBeInTheDocument()
  })
})
