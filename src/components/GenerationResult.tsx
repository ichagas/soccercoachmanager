import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { pdfService, generationService } from '../services'
import type { GeneratedContent } from '../services'
import type { StyleOption } from '../types'
import Toast, { type ToastType } from './Toast'

interface GenerationResultProps {
  content: GeneratedContent
  inputText: string
  style: StyleOption
  onRegenerate: () => void
  onTweakAndRegenerate: () => void
}

export default function GenerationResult({
  content,
  inputText,
  style,
  onRegenerate,
  onTweakAndRegenerate,
}: GenerationResultProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [selectedHook, setSelectedHook] = useState(0)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(label)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const pdfBlob = await pdfService.generateFromUser(user, content)
      const timestamp = new Date().toISOString().split('T')[0]
      pdfService.downloadPDF(pdfBlob, `carousel-${timestamp}.pdf`)
    } catch (error) {
      console.error('PDF generation failed:', error)
      setToast({ message: t('generate.results.pdfError'), type: 'error' })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleSaveToHistory = async () => {
    setIsSaving(true)
    try {
      // 1. Create generation record in database
      const generation = await generationService.create({
        input_text: inputText,
        style,
        caption: content.caption,
        pinned_comment: content.pinned_comment,
        hooks: content.hooks,
      })

      // 2. Generate and upload PDF
      try {
        const pdfBlob = await pdfService.generateFromUser(user, content)
        const pdfFile = new File([pdfBlob], `carousel-${generation.id}.pdf`, {
          type: 'application/pdf',
        })
        await generationService.uploadPDF(generation.id, pdfFile)
      } catch (pdfError) {
        console.error('PDF upload failed:', pdfError)
        // Continue even if PDF upload fails
      }

      // 3. Show success message
      setToast({ message: t('generate.results.savedSuccess'), type: 'success' })

      // 4. Navigate to history after short delay
      setTimeout(() => {
        navigate('/history')
      }, 1500)
    } catch (error) {
      console.error('Save to history failed:', error)
      setToast({ message: t('generate.results.saveError'), type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('generate.results.title')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onTweakAndRegenerate}
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-600 rounded-md hover:bg-purple-50"
          >
            {t('generate.results.tweakAndRegenerate')}
          </button>
          <button
            onClick={onRegenerate}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:from-purple-700 hover:to-blue-700"
          >
            {t('generate.results.regenerate')}
          </button>
        </div>
      </div>

      {/* Carousel Slides Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('generate.results.slides')} ({content.slides.length})
          </h3>
          <button
            onClick={() => copyToClipboard(
              content.slides.map((s) => `Slide ${s.slide_number}: ${s.title}\n${s.content}`).join('\n\n'),
              'slides'
            )}
            className="px-3 py-1 text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            {copiedItem === 'slides' ? '✓ ' + t('common.copied') : t('common.copy')}
          </button>
        </div>

        {/* Slides Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.slides.map((slide) => (
            <div
              key={slide.slide_number}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-purple-600">
                  {t('generate.results.slide')} {slide.slide_number}
                </span>
                {slide.slide_number === 1 && (
                  <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded">
                    {t('generate.results.hook')}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">{slide.title}</h4>
              <p className="text-xs text-gray-700 leading-relaxed">{slide.content}</p>
              {slide.notes && (
                <p className="text-xs text-purple-600 mt-2 italic">{slide.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Hooks */}
      {content.hooks.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('generate.results.alternativeHooks')}
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            {content.hooks.map((hook, index) => (
              <button
                key={index}
                onClick={() => setSelectedHook(index)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedHook === index
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-purple-600">
                    {t('generate.results.hook')} {index + 1}
                  </span>
                  {selectedHook === index && (
                    <span className="text-xs text-purple-700">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-900 font-medium">{hook}</p>
              </button>
            ))}
          </div>
          {selectedHook !== 0 && (
            <p className="mt-3 text-sm text-purple-600">
              {t('generate.results.hookSelected')}
            </p>
          )}
        </div>
      )}

      {/* Caption */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('generate.results.caption')}
          </h3>
          <button
            onClick={() => copyToClipboard(content.caption, 'caption')}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:from-purple-700 hover:to-blue-700"
          >
            {copiedItem === 'caption' ? '✓ ' + t('common.copied') : t('common.copy')}
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
            {content.caption}
          </p>
        </div>
      </div>

      {/* Pinned Comment */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('generate.results.pinnedComment')}
          </h3>
          <button
            onClick={() => copyToClipboard(content.pinned_comment, 'comment')}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:from-purple-700 hover:to-blue-700"
          >
            {copiedItem === 'comment' ? '✓ ' + t('common.copied') : t('common.copy')}
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
            {content.pinned_comment}
          </p>
        </div>
      </div>

      {/* Next Steps CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">
          {t('generate.results.nextSteps.title')}
        </h3>
        <p className="text-purple-100 mb-4">
          {t('generate.results.nextSteps.subtitle')}
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? '⏳ ' + t('generate.results.generatingPDF') : t('generate.results.nextSteps.downloadPDF')}
          </button>
          <button
            onClick={handleSaveToHistory}
            disabled={isSaving}
            className="px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '⏳ ' + t('generate.results.saving') : t('generate.results.nextSteps.saveToHistory')}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
