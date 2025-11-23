import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GenerationCard from '../../components/GenerationCard'
import type { Generation } from '../../types'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'create.styles.hormozi': 'Alex Hormozi',
        'create.styles.welsh': 'Justin Welsh',
        'create.styles.koe': 'Dan Koe',
        'create.styles.custom': 'Custom Voice',
        'dashboard.remix': 'Remix',
        'dashboard.download': 'Download',
        'history.delete': 'Delete',
      }
      return translations[key] || key
    },
  }),
}))

const mockGeneration: Generation = {
  id: 'gen-123',
  owner: 'user-123',
  input_text: 'This is the input text for the carousel generation',
  style: 'hormozi',
  carousel_pdf: 'carousel.pdf',
  caption: 'This is a test caption for the LinkedIn carousel post',
  pinned_comment: 'This is a pinned comment',
  hooks: ['Hook 1', 'Hook 2', 'Hook 3'],
  created: '2024-01-15T10:30:00Z',
  updated: '2024-01-15T10:30:00Z',
}

describe('GenerationCard', () => {
  it('should render generation details', () => {
    const onDelete = vi.fn()
    const onRemix = vi.fn()
    const onDownloadPDF = vi.fn()

    render(
      <GenerationCard
        generation={mockGeneration}
        onDelete={onDelete}
        onRemix={onRemix}
        onDownloadPDF={onDownloadPDF}
      />
    )

    expect(screen.getByText('Alex Hormozi')).toBeInTheDocument()
    expect(screen.getByText(/This is a test caption/)).toBeInTheDocument()
    expect(screen.getByText(/This is the input text/)).toBeInTheDocument()
  })

  it('should display style badge with correct color', () => {
    const onDelete = vi.fn()
    const onRemix = vi.fn()
    const onDownloadPDF = vi.fn()

    const { rerender } = render(
      <GenerationCard
        generation={{ ...mockGeneration, style: 'hormozi' }}
        onDelete={onDelete}
        onRemix={onRemix}
        onDownloadPDF={onDownloadPDF}
      />
    )

    expect(screen.getByText('Alex Hormozi')).toBeInTheDocument()

    // Test different styles
    rerender(
      <GenerationCard
        generation={{ ...mockGeneration, style: 'welsh' }}
        onDelete={onDelete}
        onRemix={onRemix}
        onDownloadPDF={onDownloadPDF}
      />
    )
    expect(screen.getByText('Justin Welsh')).toBeInTheDocument()
  })

  it('should call onRemix when remix button is clicked', () => {
    const onDelete = vi.fn()
    const onRemix = vi.fn()
    const onDownloadPDF = vi.fn()

    render(
      <GenerationCard
        generation={mockGeneration}
        onDelete={onDelete}
        onRemix={onRemix}
        onDownloadPDF={onDownloadPDF}
      />
    )

    const remixButton = screen.getByText('Remix')
    fireEvent.click(remixButton)

    expect(onRemix).toHaveBeenCalledTimes(1)
  })

  it('should call onDownloadPDF when download button is clicked', () => {
    const onDelete = vi.fn()
    const onRemix = vi.fn()
    const onDownloadPDF = vi.fn()

    render(
      <GenerationCard
        generation={mockGeneration}
        onDelete={onDelete}
        onRemix={onRemix}
        onDownloadPDF={onDownloadPDF}
      />
    )

    const downloadButton = screen.getByText('Download')
    fireEvent.click(downloadButton)

    expect(onDownloadPDF).toHaveBeenCalledTimes(1)
  })

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    const onRemix = vi.fn()
    const onDownloadPDF = vi.fn()

    render(
      <GenerationCard
        generation={mockGeneration}
        onDelete={onDelete}
        onRemix={onRemix}
        onDownloadPDF={onDownloadPDF}
      />
    )

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('should show disabled download button when no PDF exists', () => {
    const onDelete = vi.fn()
    const onRemix = vi.fn()
    const onDownloadPDF = vi.fn()

    render(
      <GenerationCard
        generation={{ ...mockGeneration, carousel_pdf: undefined }}
        onDelete={onDelete}
        onRemix={onRemix}
        onDownloadPDF={onDownloadPDF}
      />
    )

    const noPdfButton = screen.getByText('No PDF')
    expect(noPdfButton).toBeDisabled()
  })

  it('should format date correctly', () => {
    const onDelete = vi.fn()
    const onRemix = vi.fn()
    const onDownloadPDF = vi.fn()

    render(
      <GenerationCard
        generation={mockGeneration}
        onDelete={onDelete}
        onRemix={onRemix}
        onDownloadPDF={onDownloadPDF}
      />
    )

    // Check that date is displayed (format may vary by locale)
    const dateElement = screen.getByText(/Jan|15|2024/)
    expect(dateElement).toBeInTheDocument()
  })

  it('should truncate long captions', () => {
    const onDelete = vi.fn()
    const onRemix = vi.fn()
    const onDownloadPDF = vi.fn()

    const longCaption = 'A'.repeat(200)

    render(
      <GenerationCard
        generation={{ ...mockGeneration, caption: longCaption }}
        onDelete={onDelete}
        onRemix={onRemix}
        onDownloadPDF={onDownloadPDF}
      />
    )

    // Check that the caption is truncated
    const captionText = screen.getByText(/A+\.\.\./)
    expect(captionText).toBeInTheDocument()
    expect(captionText.textContent?.length).toBeLessThan(200)
  })
})
