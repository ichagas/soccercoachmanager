import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { userService } from '../../services'
import AppLayout from '../../components/Layout/AppLayout'
import Toast, { type ToastType } from '../../components/Toast'

export default function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  // Form state
  const [name, setName] = useState(user?.name || '')
  const [brandHeadshot, setBrandHeadshot] = useState(user?.brand_headshot || '')
  const [brandLogo, setBrandLogo] = useState(user?.brand_logo || '')
  const [brandColor, setBrandColor] = useState(user?.brand_color || '#667eea')
  const [brandTagline, setBrandTagline] = useState(user?.brand_tagline || '')
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferred_language || 'en')

  // File upload states
  const [headshotFile, setHeadshotFile] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Sync form with user data when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setBrandHeadshot(user.brand_headshot || '')
      setBrandLogo(user.brand_logo || '')
      setBrandColor(user.brand_color || '#667eea')
      setBrandTagline(user.brand_tagline || '')
      setPreferredLanguage(user.preferred_language || 'en')
    }
  }, [user])

  const handleHeadshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHeadshotFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setHeadshotPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLanguageChange = async (newLanguage: 'en' | 'pt-BR') => {
    if (!user) return

    try {
      setIsLoading(true)
      await userService.updateLanguage(user.id, newLanguage)
      setPreferredLanguage(newLanguage)
      i18n.changeLanguage(newLanguage)
      setToast({ message: t('settings.languageUpdated'), type: 'success' })
    } catch (error) {
      console.error('Language update failed:', error)
      setToast({ message: t('settings.languageError'), type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!user) return

    try {
      setIsLoading(true)

      // 1. Upload files if new ones were selected
      if (headshotFile) {
        await userService.uploadFile(user.id, 'brand_headshot', headshotFile)
      }
      if (logoFile) {
        await userService.uploadFile(user.id, 'brand_logo', logoFile)
      }

      // 2. Update other fields
      await userService.updateUser(user.id, {
        name,
        brand_color: brandColor,
        brand_tagline: brandTagline,
      })

      // Clear file upload states
      setHeadshotFile(null)
      setLogoFile(null)
      setHeadshotPreview(null)
      setLogoPreview(null)

      setToast({ message: t('settings.saveSuccess'), type: 'success' })
    } catch (error) {
      console.error('Settings save failed:', error)
      setToast({ message: t('settings.saveError'), type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (user) {
      setName(user.name || '')
      setBrandHeadshot(user.brand_headshot || '')
      setBrandLogo(user.brand_logo || '')
      setBrandColor(user.brand_color || '#667eea')
      setBrandTagline(user.brand_tagline || '')
      setPreferredLanguage(user.preferred_language || 'en')
      setHeadshotFile(null)
      setLogoFile(null)
      setHeadshotPreview(null)
      setLogoPreview(null)
    }
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
          <p className="mt-2 text-gray-600">{t('settings.subtitle')}</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('settings.account.title')}
            </h2>
            <div className="space-y-4">
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.account.email')}
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.account.name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('settings.account.namePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Brand Kit */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('settings.brandKit.title')}
            </h2>
            <div className="space-y-6">
              {/* Brand Headshot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.brandKit.headshot')}
                </label>
                <div className="flex items-center space-x-4">
                  {/* Preview */}
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    {headshotPreview || brandHeadshot ? (
                      <img
                        src={headshotPreview || brandHeadshot}
                        alt="Headshot"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  {/* Upload Button */}
                  <label className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    {t('settings.brandKit.uploadHeadshot')}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeadshotChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Brand Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.brandKit.logo')}
                </label>
                <div className="flex items-center space-x-4">
                  {/* Preview */}
                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    {logoPreview || brandLogo ? (
                      <img
                        src={logoPreview || brandLogo}
                        alt="Logo"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  {/* Upload Button */}
                  <label className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    {t('settings.brandKit.uploadLogo')}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Brand Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.brandKit.color')}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="h-12 w-24 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="#667eea"
                  />
                </div>
              </div>

              {/* Brand Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.brandKit.tagline')}
                </label>
                <input
                  type="text"
                  value={brandTagline}
                  onChange={(e) => setBrandTagline(e.target.value)}
                  placeholder={t('settings.brandKit.taglinePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('settings.preferences.title')}
            </h2>
            <div className="space-y-4">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('settings.preferences.language')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    disabled={isLoading}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                      preferredLanguage === 'en'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('pt-BR')}
                    disabled={isLoading}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                      preferredLanguage === 'pt-BR'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    🇧🇷 Português
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('settings.reset')}
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ ' + t('settings.saving') : t('settings.save')}
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
    </AppLayout>
  )
}
