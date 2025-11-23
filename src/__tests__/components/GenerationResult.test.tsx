import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import GenerationResult from '../../components/GenerationResult'
import type { GeneratedContent } from '../../services'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'generate.results.title': 'Your Carousel is Ready!',
        'generate.results.slides': 'Carousel Slides',
        'generate.results.slide': 'Slide',
        'generate.results.hook': 'Hook',
        'generate.results.alternativeHooks': 'Alternative Hooks',
        'generate.results.hookSelected': 'Hook selected',
        'generate.results.caption': 'LinkedIn Caption',
        'generate.results.pinnedComment': 'Pinned Comment',
        'generate.results.regenerate': 'Regenerate',
        'generate.results.tweakAndRegenerate': 'Tweak & Regenerate',
        'generate.results.nextSteps.title': 'Next Steps',
        'generate.results.nextSteps.subtitle': 'Download your PDF',
        'generate.results.nextSteps.downloadPDF': 'Download PDF',
        'generate.results.nextSteps.saveToHistory': 'Save to History',
        'generate.results.generatingPDF': 'Generating PDF...',
        'generate.results.saving': 'Saving...',
        'common.copy': 'Copy',
        'common.copied': 'Copied!',
      }
      return translations[key] || key
    },
  }),
}))

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      brand_color: '#667eea',
      brand_headshot: 'https://example.com/headshot.jpg',
      brand_logo: 'https://example.com/logo.png',
      brand_tagline: 'Test Tagline',
    },
    isAuthenticated: true,
    isLoading: false,
  }),
}))

// Mock services
vi.mock('../../services', async () => {
  const actual = await vi.importActual('../../services')
  return {
    ...actual,
    pdfService: {
      generateFromUser: vi.fn().mockResolvedValue(new Blob(['mock-pdf'], { type: 'application/pdf' })),
      downloadPDF: vi.fn(),
    },
    generationService: {
      create: vi.fn().mockResolvedValue({ id: 'gen-123' }),
      uploadPDF: vi.fn().mockResolvedValue({}),
    },
  }
})

const mockContent: GeneratedContent = {
  slides: [
    {
      slide_number: 1,
      title: 'Hook Title',
      content: 'Hook content here',
    },
    {
      slide_number: 2,
      title: 'Slide 2 Title',
      content: 'Slide 2 content here',
    },
  ],
  caption: 'This is the LinkedIn caption',
  pinned_comment: 'This is the pinned comment',
  hooks: ['Hook 1', 'Hook 2', 'Hook 3'],
}

describe('GenerationResult', () => {
  it('should render generation results', () => {
    const onRegenerate = vi.fn()
    const onTweakAndRegenerate = vi.fn()

    render(
      <BrowserRouter>
        <GenerationResult
          content={mockContent}
          inputText="Test input"
          style="hormozi"
          onRegenerate={onRegenerate}
          onTweakAndRegenerate={onTweakAndRegenerate}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Your Carousel is Ready!')).toBeInTheDocument()
    expect(screen.getByText(/Carousel Slides/)).toBeInTheDocument()
    expect(screen.getByText(/LinkedIn Caption/)).toBeInTheDocument()
    expect(screen.getByText(/Pinned Comment/)).toBeInTheDocument()
  })

  it('should display all slides', () => {
    const onRegenerate = vi.fn()
    const onTweakAndRegenerate = vi.fn()

    render(
      <BrowserRouter>
        <GenerationResult
          content={mockContent}
          inputText="Test input"
          style="hormozi"
          onRegenerate={onRegenerate}
          onTweakAndRegenerate={onTweakAndRegenerate}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Hook Title')).toBeInTheDocument()
    expect(screen.getByText('Hook content here')).toBeInTheDocument()
    expect(screen.getByText('Slide 2 Title')).toBeInTheDocument()
    expect(screen.getByText('Slide 2 content here')).toBeInTheDocument()
  })

  it('should display caption and pinned comment', () => {
    const onRegenerate = vi.fn()
    const onTweakAndRegenerate = vi.fn()

    render(
      <BrowserRouter>
        <GenerationResult
          content={mockContent}
          inputText="Test input"
          style="hormozi"
          onRegenerate={onRegenerate}
          onTweakAndRegenerate={onTweakAndRegenerate}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('This is the LinkedIn caption')).toBeInTheDocument()
    expect(screen.getByText('This is the pinned comment')).toBeInTheDocument()
  })

  it('should display alternative hooks', () => {
    const onRegenerate = vi.fn()
    const onTweakAndRegenerate = vi.fn()

    render(
      <BrowserRouter>
        <GenerationResult
          content={mockContent}
          inputText="Test input"
          style="hormozi"
          onRegenerate={onRegenerate}
          onTweakAndRegenerate={onTweakAndRegenerate}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Alternative Hooks')).toBeInTheDocument()

    // Check if hooks are rendered (they're in buttons)
    const hookElements = screen.getAllByRole('button')
    const hookTexts = hookElements.map(el => el.textContent).filter(text => text?.includes('Hook'))
    expect(hookTexts.length).toBeGreaterThanOrEqual(3)
  })

  it('should call onRegenerate when regenerate button is clicked', () => {
    const onRegenerate = vi.fn()
    const onTweakAndRegenerate = vi.fn()

    render(
      <BrowserRouter>
        <GenerationResult
          content={mockContent}
          inputText="Test input"
          style="hormozi"
          onRegenerate={onRegenerate}
          onTweakAndRegenerate={onTweakAndRegenerate}
        />
      </BrowserRouter>
    )

    const regenerateButton = screen.getByText('Regenerate')
    fireEvent.click(regenerateButton)

    expect(onRegenerate).toHaveBeenCalledTimes(1)
  })

  it('should call onTweakAndRegenerate when tweak button is clicked', () => {
    const onRegenerate = vi.fn()
    const onTweakAndRegenerate = vi.fn()

    render(
      <BrowserRouter>
        <GenerationResult
          content={mockContent}
          inputText="Test input"
          style="hormozi"
          onRegenerate={onRegenerate}
          onTweakAndRegenerate={onTweakAndRegenerate}
        />
      </BrowserRouter>
    )

    const tweakButton = screen.getByText('Tweak & Regenerate')
    fireEvent.click(tweakButton)

    expect(onTweakAndRegenerate).toHaveBeenCalledTimes(1)
  })

  it('should render copy buttons', () => {
    const onRegenerate = vi.fn()
    const onTweakAndRegenerate = vi.fn()

    render(
      <BrowserRouter>
        <GenerationResult
          content={mockContent}
          inputText="Test input"
          style="hormozi"
          onRegenerate={onRegenerate}
          onTweakAndRegenerate={onTweakAndRegenerate}
        />
      </BrowserRouter>
    )

    const copyButtons = screen.getAllByText('Copy')
    expect(copyButtons.length).toBeGreaterThan(0)
  })
})
