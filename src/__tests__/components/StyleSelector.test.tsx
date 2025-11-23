import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StyleSelector from '../../components/StyleSelector'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'create.selectStyle': 'Select Style',
        'create.styleInfo': 'Style Guide',
        'create.styles.hormozi': 'Alex Hormozi - Direct, proof-heavy',
        'create.styles.welsh': 'Justin Welsh - Calm, helpful',
        'create.styles.koe': 'Dan Koe - Deep, philosophical',
        'create.styles.custom': 'Custom Voice - Trained on your posts',
        'create.styles.customDisabled': 'train your voice first',
        'create.styleDescriptions.hormozi':
          'Bold and direct with concrete examples.',
        'create.styleDescriptions.welsh': 'Calm and conversational.',
        'create.styleDescriptions.koe': 'Deep and philosophical.',
        'create.styleDescriptions.custom': 'Your unique voice.',
      }
      return translations[key] || key
    },
  }),
}))

describe('StyleSelector', () => {
  it('should render style selector with all options', () => {
    const onChange = vi.fn()
    render(
      <StyleSelector value="hormozi" onChange={onChange} hasCustomVoice={false} />
    )

    expect(screen.getByText('Select Style')).toBeInTheDocument()
    expect(screen.getByText(/Style Guide/)).toBeInTheDocument()

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('hormozi')
  })

  it('should call onChange when style is changed', () => {
    const onChange = vi.fn()
    render(
      <StyleSelector value="hormozi" onChange={onChange} hasCustomVoice={false} />
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'welsh' } })

    expect(onChange).toHaveBeenCalledWith('welsh')
  })

  it('should disable custom voice option when hasCustomVoice is false', () => {
    const onChange = vi.fn()
    render(
      <StyleSelector value="hormozi" onChange={onChange} hasCustomVoice={false} />
    )

    const select = screen.getByRole('combobox') as HTMLSelectElement
    const customOption = Array.from(select.options).find(
      (opt) => opt.value === 'custom'
    )

    expect(customOption).toBeDefined()
    expect(customOption?.disabled).toBe(true)
  })

  it('should enable custom voice option when hasCustomVoice is true', () => {
    const onChange = vi.fn()
    render(
      <StyleSelector value="hormozi" onChange={onChange} hasCustomVoice={true} />
    )

    const select = screen.getByRole('combobox') as HTMLSelectElement
    const customOption = Array.from(select.options).find(
      (opt) => opt.value === 'custom'
    )

    expect(customOption).toBeDefined()
    expect(customOption?.disabled).toBe(false)
  })

  it('should display style description for selected style', () => {
    const onChange = vi.fn()
    render(
      <StyleSelector value="hormozi" onChange={onChange} hasCustomVoice={false} />
    )

    expect(
      screen.getByText('Bold and direct with concrete examples.')
    ).toBeInTheDocument()
  })

  it('should update style description when style changes', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <StyleSelector value="hormozi" onChange={onChange} hasCustomVoice={false} />
    )

    expect(
      screen.getByText('Bold and direct with concrete examples.')
    ).toBeInTheDocument()

    rerender(
      <StyleSelector value="welsh" onChange={onChange} hasCustomVoice={false} />
    )

    expect(screen.getByText('Calm and conversational.')).toBeInTheDocument()
  })

  it('should render all style options', () => {
    const onChange = vi.fn()
    render(
      <StyleSelector value="hormozi" onChange={onChange} hasCustomVoice={false} />
    )

    expect(
      screen.getByText(/Alex Hormozi - Direct, proof-heavy/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Justin Welsh - Calm, helpful/)).toBeInTheDocument()
    expect(
      screen.getByText(/Dan Koe - Deep, philosophical/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Custom Voice - Trained on your posts/)
    ).toBeInTheDocument()
  })
})
