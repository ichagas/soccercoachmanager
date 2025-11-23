import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FileUpload from '../../components/FileUpload'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'onboarding.uploadFile': 'Click to upload',
        'onboarding.dragAndDrop': 'or drag and drop',
        'onboarding.maxSize': `Max ${params?.size}MB`,
        'onboarding.clickToChange': 'Click to change',
        'onboarding.errors.invalidFileType': 'Invalid file type',
        'onboarding.errors.fileTooLarge': `File is too large. Maximum size is ${params?.size}MB.`,
      }
      return translations[key] || key
    },
  }),
}))

describe('FileUpload', () => {
  it('should render upload area', () => {
    const onFileSelect = vi.fn()
    render(
      <FileUpload label="Test Upload" onFileSelect={onFileSelect} />
    )

    expect(screen.getByText('Test Upload')).toBeInTheDocument()
    expect(screen.getByText('Click to upload')).toBeInTheDocument()
  })

  it('should show required indicator when required is true', () => {
    const onFileSelect = vi.fn()
    render(
      <FileUpload label="Test Upload" onFileSelect={onFileSelect} required />
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should show preview when preview URL is provided', () => {
    const onFileSelect = vi.fn()
    render(
      <FileUpload
        label="Test Upload"
        onFileSelect={onFileSelect}
        preview="http://example.com/image.jpg"
      />
    )

    const img = screen.getByAltText('Preview')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'http://example.com/image.jpg')
  })

  it('should call onFileSelect when file is selected', () => {
    const onFileSelect = vi.fn()
    render(
      <FileUpload label="Test Upload" onFileSelect={onFileSelect} />
    )

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    fireEvent.change(input, { target: { files: [file] } })

    expect(onFileSelect).toHaveBeenCalledWith(file)
  })

  it('should validate file size', () => {
    const onFileSelect = vi.fn()
    render(
      <FileUpload label="Test Upload" onFileSelect={onFileSelect} maxSizeMB={1} />
    )

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    // Create a file larger than 1MB
    const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    })

    fireEvent.change(input, { target: { files: [largeFile] } })

    expect(onFileSelect).not.toHaveBeenCalled()
    expect(screen.getByText(/File is too large/i)).toBeInTheDocument()
  })

  it('should handle drag and drop', () => {
    const onFileSelect = vi.fn()
    render(
      <FileUpload label="Test Upload" onFileSelect={onFileSelect} />
    )

    const dropZone = screen.getByText('Click to upload').closest('div')
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [file] },
    })

    expect(onFileSelect).toHaveBeenCalledWith(file)
  })
})
