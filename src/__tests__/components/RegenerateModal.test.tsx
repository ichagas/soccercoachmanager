import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RegenerateModal from '../../components/RegenerateModal'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'generate.modal.title': 'Tweak & Regenerate',
        'generate.modal.subtitle': 'Add custom instructions',
        'generate.modal.instructionsLabel': 'Custom Instructions',
        'generate.modal.instructionsPlaceholder': 'e.g., Make it more casual...',
        'generate.modal.instructionsHint': 'Tell the AI what to change',
        'generate.modal.examplesTitle': 'Example Instructions:',
        'generate.modal.example1': 'Make the tone more professional',
        'generate.modal.example2': 'Add more statistics',
        'generate.modal.example3': 'Focus on beginners',
        'generate.modal.example4': 'Include more steps',
        'generate.modal.regenerate': 'Regenerate',
        'generate.modal.regenerating': 'Regenerating...',
        'common.cancel': 'Cancel',
      }
      return translations[key] || key
    },
  }),
}))

describe('RegenerateModal', () => {
  it('should not render when isOpen is false', () => {
    const onClose = vi.fn()
    const onRegenerate = vi.fn()

    const { container } = render(
      <RegenerateModal
        isOpen={false}
        onClose={onClose}
        onRegenerate={onRegenerate}
        isGenerating={false}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render when isOpen is true', () => {
    const onClose = vi.fn()
    const onRegenerate = vi.fn()

    render(
      <RegenerateModal
        isOpen={true}
        onClose={onClose}
        onRegenerate={onRegenerate}
        isGenerating={false}
      />
    )

    expect(screen.getByText('Tweak & Regenerate')).toBeInTheDocument()
    expect(screen.getByText('Add custom instructions')).toBeInTheDocument()
  })

  it('should allow text input in textarea', () => {
    const onClose = vi.fn()
    const onRegenerate = vi.fn()

    render(
      <RegenerateModal
        isOpen={true}
        onClose={onClose}
        onRegenerate={onRegenerate}
        isGenerating={false}
      />
    )

    const textarea = screen.getByPlaceholderText(/Make it more casual/)
    fireEvent.change(textarea, { target: { value: 'Test instructions' } })

    expect(textarea).toHaveValue('Test instructions')
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn()
    const onRegenerate = vi.fn()

    render(
      <RegenerateModal
        isOpen={true}
        onClose={onClose}
        onRegenerate={onRegenerate}
        isGenerating={false}
      />
    )

    const closeButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onRegenerate with instructions when regenerate button is clicked', () => {
    const onClose = vi.fn()
    const onRegenerate = vi.fn()

    render(
      <RegenerateModal
        isOpen={true}
        onClose={onClose}
        onRegenerate={onRegenerate}
        isGenerating={false}
      />
    )

    const textarea = screen.getByPlaceholderText(/Make it more casual/)
    fireEvent.change(textarea, { target: { value: 'Make it more fun' } })

    const regenerateButton = screen.getByText('Regenerate')
    fireEvent.click(regenerateButton)

    expect(onRegenerate).toHaveBeenCalledWith('Make it more fun')
  })

  it('should disable buttons when isGenerating is true', () => {
    const onClose = vi.fn()
    const onRegenerate = vi.fn()

    render(
      <RegenerateModal
        isOpen={true}
        onClose={onClose}
        onRegenerate={onRegenerate}
        isGenerating={true}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    const regenerateButton = screen.getByText('Regenerating...')

    expect(cancelButton).toBeDisabled()
    expect(regenerateButton).toBeDisabled()
  })

  it('should show example instructions', () => {
    const onClose = vi.fn()
    const onRegenerate = vi.fn()

    render(
      <RegenerateModal
        isOpen={true}
        onClose={onClose}
        onRegenerate={onRegenerate}
        isGenerating={false}
      />
    )

    expect(screen.getByText(/Make the tone more professional/)).toBeInTheDocument()
    expect(screen.getByText(/Add more statistics/)).toBeInTheDocument()
    expect(screen.getByText(/Focus on beginners/)).toBeInTheDocument()
    expect(screen.getByText(/Include more steps/)).toBeInTheDocument()
  })
})
