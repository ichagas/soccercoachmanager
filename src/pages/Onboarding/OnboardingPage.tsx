import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { userService } from '../../services'
import FileUpload from '../../components/FileUpload'
import ImageCropper from '../../components/ImageCropper'

type OnboardingStep = 1 | 2 | 3

interface BrandKitData {
  headshot: File | null
  logo: File | null
  color: string
  tagline: string
}

export default function OnboardingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [brandKit, setBrandKit] = useState<BrandKitData>({
    headshot: null,
    logo: null,
    color: '#667eea',
    tagline: '',
  })

  // Preview URLs
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Cropping state
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const [cropType, setCropType] = useState<'headshot' | 'logo'>('headshot')

  const handleFileSelect = (type: 'headshot' | 'logo', file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setImageToCrop(reader.result as string)
      setCropType(type)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (croppedImage: Blob) => {
    const file = new File([croppedImage], `${cropType}.jpg`, {
      type: 'image/jpeg',
    })

    setBrandKit((prev) => ({ ...prev, [cropType]: file }))

    // Create preview URL
    const previewUrl = URL.createObjectURL(croppedImage)
    if (cropType === 'headshot') {
      setHeadshotPreview(previewUrl)
    } else {
      setLogoPreview(previewUrl)
    }

    setImageToCrop(null)
  }

  const canProceedToNextStep = (): boolean => {
    if (currentStep === 1) {
      return brandKit.headshot !== null
    }
    // Steps 2 and 3 are optional
    return true
  }

  const handleNext = () => {
    if (currentStep < 3 && canProceedToNextStep()) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep)
    }
  }

  const handleSkip = async () => {
    if (!user) return

    try {
      // Mark onboarding as completed even when skipped
      await userService.updateUser(user.id, {
        onboarding_completed: true,
      })

      // Refresh user data in AuthContext
      await refreshUser()

      navigate('/dashboard')
    } catch (err) {
      console.error('Skip onboarding error:', err)
      // Even if update fails, try to navigate
      navigate('/dashboard')
    }
  }

  const handleComplete = async () => {
    if (!user) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Upload headshot
      if (brandKit.headshot) {
        await userService.uploadFile(user.id, 'brand_headshot', brandKit.headshot)
      }

      // Upload logo
      if (brandKit.logo) {
        await userService.uploadFile(user.id, 'brand_logo', brandKit.logo)
      }

      // Update brand color and tagline (files are already uploaded above)
      await userService.updateUser(user.id, {
        brand_color: brandKit.color,
        brand_tagline: brandKit.tagline,
        onboarding_completed: true,
      })

      // Refresh user data in AuthContext to reflect onboarding_completed
      await refreshUser()

      navigate('/dashboard')
    } catch (err: unknown) {
      console.error('Onboarding error:', err)
      setError(
        err instanceof Error ? err.message : t('onboarding.errors.saveFailed')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding.title')}
          </h1>
          <p className="text-gray-600">{t('onboarding.subtitle')}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`
                      w-16 h-1 mx-2
                      ${currentStep > step ? 'bg-purple-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-600">
              {t('onboarding.step', { current: currentStep, total: 3 })}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Headshot Upload */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('onboarding.step1.title')}
                </h2>
                <p className="text-gray-600">
                  {t('onboarding.step1.description')}
                </p>
              </div>

              <FileUpload
                label={t('onboarding.step1.uploadLabel')}
                accept="image/*"
                maxSizeMB={5}
                onFileSelect={(file) => handleFileSelect('headshot', file)}
                preview={headshotPreview}
                required
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 {t('onboarding.step1.tip')}
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Logo Upload */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('onboarding.step2.title')}
                </h2>
                <p className="text-gray-600">
                  {t('onboarding.step2.description')}
                </p>
              </div>

              <FileUpload
                label={t('onboarding.step2.uploadLabel')}
                accept="image/*"
                maxSizeMB={5}
                onFileSelect={(file) => handleFileSelect('logo', file)}
                preview={logoPreview}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 {t('onboarding.step2.tip')}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Brand Color & Tagline */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('onboarding.step3.title')}
                </h2>
                <p className="text-gray-600">
                  {t('onboarding.step3.description')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.step3.colorLabel')}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={brandKit.color}
                    onChange={(e) =>
                      setBrandKit((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="h-12 w-24 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandKit.color}
                    onChange={(e) =>
                      setBrandKit((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="#667eea"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.step3.taglineLabel')}
                </label>
                <input
                  type="text"
                  value={brandKit.tagline}
                  onChange={(e) =>
                    setBrandKit((prev) => ({ ...prev, tagline: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t('onboarding.step3.taglinePlaceholder')}
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {brandKit.tagline.length}/50 {t('onboarding.characters')}
                </p>
              </div>

              {/* Preview */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-4">
                  {t('onboarding.step3.preview')}
                </p>
                <div
                  className="bg-white rounded-lg p-6 text-center"
                  style={{ borderTop: `4px solid ${brandKit.color}` }}
                >
                  {headshotPreview && (
                    <img
                      src={headshotPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                  )}
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="h-12 mx-auto mb-4 object-contain"
                    />
                  )}
                  {brandKit.tagline && (
                    <p className="text-lg font-semibold" style={{ color: brandKit.color }}>
                      {brandKit.tagline}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 {t('onboarding.step3.tip')}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  disabled={isSubmitting}
                >
                  ← {t('onboarding.back')}
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                {t('onboarding.skip')}
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceedToNextStep()}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('onboarding.next')} →
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                >
                  {isSubmitting
                    ? t('onboarding.saving')
                    : t('onboarding.complete')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setImageToCrop(null)}
          aspectRatio={cropType === 'headshot' ? 1 : 16 / 9}
        />
      )}
    </div>
  )
}
