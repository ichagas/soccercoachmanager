import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import {
  subscriptionService,
  claudeService,
  urlService,
  type GeneratedContent,
} from '../../services'
import MainLayout from '../../components/MainLayout'
import StyleSelector from '../../components/StyleSelector'
import BrandKitPreview from '../../components/BrandKitPreview'
import GenerationResult from '../../components/GenerationResult'
import RegenerateModal from '../../components/RegenerateModal'
import type { StyleOption } from '../../types'

const DRAFT_KEY = 'carousel_draft'
const MAX_INPUT_LENGTH = 10000

interface CreateFormData {
  inputText: string
  style: StyleOption
}

export default function CreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const [formData, setFormData] = useState<CreateFormData>({
    inputText: '',
    style: 'hormozi',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [canGenerate, setCanGenerate] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFetchingUrl, setIsFetchingUrl] = useState(false)

  // Check if user can generate
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const canGen = await subscriptionService.canGenerate()
        setCanGenerate(canGen)
      } catch (error) {
        console.error('Failed to check subscription:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSubscription()
  }, [])

  // Load draft from localStorage on mount
  useEffect(() => {
    const prompt = searchParams.get('prompt')
    if (prompt) {
      setFormData((prev) => ({ ...prev, inputText: decodeURIComponent(prompt) }))
      return
    }

    const savedDraft = localStorage.getItem(DRAFT_KEY)
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        setFormData(draft)
      } catch (error) {
        console.error('Failed to load draft:', error)
      }
    }
  }, [searchParams])

  // Save draft to localStorage whenever formData changes
  useEffect(() => {
    if (formData.inputText || formData.style !== 'hormozi') {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
    }
  }, [formData])

  const handleInputChange = (value: string) => {
    if (value.length <= MAX_INPUT_LENGTH) {
      setFormData((prev) => ({ ...prev, inputText: value }))
    }
  }

  const handleStyleChange = (style: StyleOption) => {
    setFormData((prev) => ({ ...prev, style }))
  }

  const handleClear = () => {
    setFormData({
      inputText: '',
      style: 'hormozi',
    })
    localStorage.removeItem(DRAFT_KEY)
  }

  const handleGenerate = async (customInstructions?: string) => {
    if (!canGenerate) {
      navigate('/upgrade')
      return
    }

    if (!formData.inputText.trim()) {
      return
    }

    setError(null)
    setIsGenerating(true)
    setIsModalOpen(false) // Close modal if open

    try {
      let inputTextToUse = formData.inputText

      // Check if input is a URL
      if (urlService.isUrl(formData.inputText.trim())) {
        setIsFetchingUrl(true)
        const urlResult = await urlService.fetchUrl(formData.inputText.trim())
        setIsFetchingUrl(false)

        if (!urlResult.success || !urlResult.text) {
          throw new Error(urlResult.error || 'Failed to fetch URL content')
        }

        inputTextToUse = urlResult.text
      }

      // Generate content with Claude
      const result = await claudeService.generate({
        inputText: inputTextToUse,
        style: formData.style,
        customInstructions,
        userVoiceSamples: user?.custom_voice_samples,
      })

      setGeneratedContent(result)
    } catch (error: any) {
      console.error('Generation failed:', error)
      setError(error.message || t('errors.generationFailed'))
    } finally {
      setIsGenerating(false)
      setIsFetchingUrl(false)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handleTweakAndRegenerate = () => {
    setIsModalOpen(true)
  }

  const handleModalRegenerate = (customInstructions: string) => {
    handleGenerate(customInstructions)
  }

  const isFormValid = formData.inputText.trim().length >= 10

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('create.title')}
          </h1>
          <p className="mt-1 text-gray-600">{t('create.subtitle')}</p>
        </div>

        {/* Limit Warning */}
        {!canGenerate && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-red-600 mt-0.5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  {t('errors.limitReached')}
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {t('create.limitMessage')}
                </p>
                <button
                  onClick={() => navigate('/upgrade')}
                  className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  {t('upgrade.title')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-red-600 mt-0.5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  {t('errors.error')}
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  {t('common.dismiss')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Content */}
        {generatedContent && !isGenerating && (
          <div className="mb-6">
            <GenerationResult
              content={generatedContent}
              inputText={formData.inputText}
              style={formData.style}
              onRegenerate={handleRegenerate}
              onTweakAndRegenerate={handleTweakAndRegenerate}
            />
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                {/* Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('create.inputLabel')}
                    </label>
                    <span className="text-sm text-gray-500">
                      {formData.inputText.length} / {MAX_INPUT_LENGTH}
                    </span>
                  </div>
                  <textarea
                    value={formData.inputText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={t('create.inputPlaceholder')}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {t('create.inputHint')}
                  </p>
                </div>

                {/* Clear Button */}
                {formData.inputText && (
                  <button
                    onClick={handleClear}
                    className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                  >
                    {t('create.clearForm')}
                  </button>
                )}
              </div>
            </div>

            {/* Style Selector */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <StyleSelector
                value={formData.style}
                onChange={handleStyleChange}
                hasCustomVoice={!!user?.custom_voice_samples}
              />
            </div>

            {/* Generate Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <button
                onClick={() => handleGenerate()}
                disabled={!isFormValid || isGenerating || !canGenerate}
                className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {isFetchingUrl ? t('create.fetchingUrl') : t('create.generating')}
                  </span>
                ) : (
                  t('create.generate')
                )}
              </button>

              {!isFormValid && formData.inputText.length > 0 && (
                <p className="mt-2 text-sm text-red-600 text-center">
                  {t('create.minCharacters', { min: 10 })}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Brand Kit Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BrandKitPreview />

              {/* Tips Card */}
              <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  💡 {t('create.tips.title')}
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>{t('create.tips.tip1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>{t('create.tips.tip2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>{t('create.tips.tip3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regenerate Modal */}
      <RegenerateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegenerate={handleModalRegenerate}
        isGenerating={isGenerating}
      />
    </MainLayout>
  )
}
