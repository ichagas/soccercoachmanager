/**
 * PDF Service
 *
 * Handles PDF generation for LinkedIn carousels using @pdfme/generator.
 * Generates professional carousel PDFs with brand kit integration.
 */

import { generate } from '@pdfme/generator'
import type { GeneratedContent } from './claude.service'
import type { User } from '../types'

// Template types
export type TemplateType = 'modern' | 'bold' | 'minimalist' | 'corporate'

export interface PDFOptions {
  content: GeneratedContent
  template: TemplateType
  brandColor?: string
  headshot?: string
  logo?: string
  tagline?: string
}

class PDFService {
  /**
   * Generate PDF from carousel content
   */
  async generatePDF(options: PDFOptions): Promise<Blob> {
    const { content, template, brandColor, headshot, logo, tagline } = options

    // Get template schema
    const schema = this.getTemplateSchema(template, brandColor || '#667eea')

    // Prepare inputs (map slides to template fields)
    const inputs = this.prepareInputs(content, headshot, logo, tagline)

    try {
      // Generate PDF
      const pdf = await generate({
        template: schema,
        inputs: [inputs],
      })

      return new Blob([pdf.buffer], { type: 'application/pdf' })
    } catch (error) {
      console.error('[PDFService] PDF generation failed:', error)
      throw new Error('Failed to generate PDF. Please try again.')
    }
  }

  /**
   * Download PDF file
   */
  downloadPDF(blob: Blob, filename: string = 'carousel.pdf') {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Get template schema based on template type
   * Note: This is a placeholder implementation. Full PDF generation
   * will be enhanced in a future sprint with proper @pdfme schemas.
   */
  private getTemplateSchema(_template: TemplateType, _brandColor: string) {
    // For now, return a simple schema structure
    // TODO: Implement proper @pdfme/generator schema in future sprint
    return {
      schemas: [],
    } as any
  }

  /**
   * Prepare inputs for PDF generation
   * Note: This is a placeholder implementation.
   * TODO: Implement proper multi-page PDF generation in future sprint
   */
  private prepareInputs(
    content: GeneratedContent,
    _headshot?: string,
    _logo?: string,
    _tagline?: string
  ) {
    // For now, we'll just use the first slide as an example
    // In a real implementation, we would generate multiple pages
    const slide = content.slides[0]

    return {
      title: slide.title,
      content: slide.content,
      slideNumber: `${slide.slide_number}`,
    }
  }

  /**
   * Get available templates
   */
  getAvailableTemplates(): Array<{ id: TemplateType; name: string; description: string }> {
    return [
      {
        id: 'modern',
        name: 'Modern Professional',
        description: 'Clean, professional design with gradient accents',
      },
      {
        id: 'bold',
        name: 'Bold & Colorful',
        description: 'Eye-catching design with vibrant colors',
      },
      {
        id: 'minimalist',
        name: 'Minimalist Clean',
        description: 'Simple, elegant design with lots of white space',
      },
      {
        id: 'corporate',
        name: 'Corporate Elegant',
        description: 'Professional design for corporate branding',
      },
    ]
  }

  /**
   * Generate PDF from user and content
   */
  async generateFromUser(user: User | null, content: GeneratedContent): Promise<Blob> {
    const options: PDFOptions = {
      content,
      template: 'modern', // Default template
      brandColor: user?.brand_color || '#667eea',
      headshot: user?.brand_headshot,
      logo: user?.brand_logo,
      tagline: user?.brand_tagline,
    }

    return this.generatePDF(options)
  }
}

// Export singleton instance
export const pdfService = new PDFService()
export default pdfService
