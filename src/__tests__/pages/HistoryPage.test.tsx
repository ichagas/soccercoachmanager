import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HistoryPage from '../../pages/History/HistoryPage'
import { generationService } from '../../services'
import type { Generation } from '../../types'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'history.title': 'History',
        'history.search': 'Search...',
        'history.filterByStyle': 'Filter by style',
        'history.allStyles': 'All styles',
        'history.noResults': 'No carousels found',
        'history.delete': 'Delete',
        'history.deleteConfirm': 'Are you sure you want to delete this carousel?',
        'create.styles.hormozi': 'Alex Hormozi',
        'create.styles.welsh': 'Justin Welsh',
        'create.styles.koe': 'Dan Koe',
        'create.styles.custom': 'Custom Voice',
        'dashboard.newCarousel': 'New Carousel',
        'dashboard.remix': 'Remix',
        'dashboard.download': 'Download',
        'common.previous': 'Previous',
        'common.next': 'Next',
      }
      return translations[key] || key
    },
  }),
}))

// Mock generation service
vi.mock('../../services', () => ({
  generationService: {
    list: vi.fn(),
    delete: vi.fn(),
    getPDFUrl: vi.fn(),
  },
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockGenerations: Generation[] = [
  {
    id: 'gen-1',
    owner: 'user-123',
    input_text: 'First carousel input',
    style: 'hormozi',
    carousel_pdf: 'carousel1.pdf',
    caption: 'First carousel caption',
    pinned_comment: 'First comment',
    hooks: ['Hook 1'],
    created: '2024-01-15T10:30:00Z',
    updated: '2024-01-15T10:30:00Z',
  },
  {
    id: 'gen-2',
    owner: 'user-123',
    input_text: 'Second carousel input',
    style: 'welsh',
    carousel_pdf: 'carousel2.pdf',
    caption: 'Second carousel caption',
    pinned_comment: 'Second comment',
    hooks: ['Hook 2'],
    created: '2024-01-14T10:30:00Z',
    updated: '2024-01-14T10:30:00Z',
  },
]

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock implementation
    vi.mocked(generationService.list).mockResolvedValue({
      items: mockGenerations,
      page: 1,
      perPage: 12,
      totalItems: 2,
      totalPages: 1,
    })
  })

  it('should render history page', async () => {
    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    expect(screen.getByText('History')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/2 carousels/)).toBeInTheDocument()
    })
  })

  it('should display search and filter inputs', () => {
    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should load and display generations', async () => {
    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/First carousel caption/)).toBeInTheDocument()
      expect(screen.getByText(/Second carousel caption/)).toBeInTheDocument()
    })
  })

  it('should show loading state', () => {
    vi.mocked(generationService.list).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    // Check for the loading spinner by its class
    const loadingSpinner = document.querySelector('.animate-spin')
    expect(loadingSpinner).toBeInTheDocument()
  })

  it('should show empty state when no generations exist', async () => {
    vi.mocked(generationService.list).mockResolvedValue({
      items: [],
      page: 1,
      perPage: 12,
      totalItems: 0,
      totalPages: 0,
    })

    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No carousels found')).toBeInTheDocument()
    })
  })

  it('should filter by style', async () => {
    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    const styleFilter = screen.getByRole('combobox')
    fireEvent.change(styleFilter, { target: { value: 'hormozi' } })

    await waitFor(() => {
      expect(generationService.list).toHaveBeenCalledWith(
        expect.objectContaining({
          style: 'hormozi',
        })
      )
    })
  })

  it('should search generations', async () => {
    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    const searchInput = screen.getByPlaceholderText('Search...')
    fireEvent.change(searchInput, { target: { value: 'test query' } })

    await waitFor(() => {
      expect(generationService.list).toHaveBeenCalledWith(
        expect.objectContaining({
          searchQuery: 'test query',
        })
      )
    })
  })

  it('should handle pagination', async () => {
    vi.mocked(generationService.list).mockResolvedValue({
      items: mockGenerations,
      page: 1,
      perPage: 12,
      totalItems: 25,
      totalPages: 3,
    })

    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
    })

    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(generationService.list).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
        })
      )
    })
  })

  it('should handle delete with confirmation', async () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm')
    confirmSpy.mockReturnValue(true)

    vi.mocked(generationService.delete).mockResolvedValue()

    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/First carousel caption/)).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled()
      expect(generationService.delete).toHaveBeenCalledWith('gen-1')
    })

    confirmSpy.mockRestore()
  })

  it('should not delete when confirmation is cancelled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm')
    confirmSpy.mockReturnValue(false)

    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/First carousel caption/)).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])

    expect(confirmSpy).toHaveBeenCalled()
    expect(generationService.delete).not.toHaveBeenCalled()

    confirmSpy.mockRestore()
  })

  it('should navigate to create page when remix is clicked', async () => {
    render(
      <BrowserRouter>
        <HistoryPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/First carousel caption/)).toBeInTheDocument()
    })

    const remixButtons = screen.getAllByText('Remix')
    fireEvent.click(remixButtons[0])

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining('/create?prompt=')
    )
  })
})
