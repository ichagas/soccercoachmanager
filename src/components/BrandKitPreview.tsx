import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services'

export default function BrandKitPreview() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const hasHeadshot = !!user?.brand_headshot
  const hasLogo = !!user?.brand_logo
  const hasBrandColor = !!user?.brand_color
  const hasTagline = !!user?.brand_tagline

  const headshotUrl = user?.brand_headshot
    ? userService.getFileUrl(user, user.brand_headshot)
    : null

  const logoUrl = user?.brand_logo
    ? userService.getFileUrl(user, user.brand_logo)
    : null

  const brandColor = user?.brand_color || '#667eea'

  const hasBrandKit = hasHeadshot || hasLogo || hasBrandColor || hasTagline

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('create.brandKit.title')}
        </h3>
        <Link
          to="/settings"
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          {t('common.edit')}
        </Link>
      </div>

      {hasBrandKit ? (
        <div className="space-y-4">
          {/* Preview Card */}
          <div
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-t-4"
            style={{ borderTopColor: brandColor }}
          >
            <div className="flex items-center space-x-4">
              {/* Headshot */}
              {hasHeadshot && headshotUrl ? (
                <img
                  src={headshotUrl}
                  alt="Brand headshot"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.email?.[0]?.toUpperCase()}
                </div>
              )}

              {/* Logo & Info */}
              <div className="flex-1 min-w-0">
                {hasLogo && logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Brand logo"
                    className="h-8 mb-2 object-contain"
                  />
                )}
                {hasTagline && (
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: brandColor }}
                  >
                    {user?.brand_tagline}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Brand Elements List */}
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span
                className={`mr-2 ${hasHeadshot ? 'text-green-600' : 'text-gray-400'}`}
              >
                {hasHeadshot ? '✓' : '○'}
              </span>
              <span className="text-gray-700">
                {t('create.brandKit.headshot')}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span
                className={`mr-2 ${hasLogo ? 'text-green-600' : 'text-gray-400'}`}
              >
                {hasLogo ? '✓' : '○'}
              </span>
              <span className="text-gray-700">{t('create.brandKit.logo')}</span>
            </div>
            <div className="flex items-center text-sm">
              <span
                className={`mr-2 ${hasBrandColor ? 'text-green-600' : 'text-gray-400'}`}
              >
                {hasBrandColor ? '✓' : '○'}
              </span>
              <span className="text-gray-700">
                {t('create.brandKit.color')}
              </span>
              {hasBrandColor && (
                <span
                  className="ml-2 w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: brandColor }}
                />
              )}
            </div>
            <div className="flex items-center text-sm">
              <span
                className={`mr-2 ${hasTagline ? 'text-green-600' : 'text-gray-400'}`}
              >
                {hasTagline ? '✓' : '○'}
              </span>
              <span className="text-gray-700">
                {t('create.brandKit.tagline')}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {t('create.brandKit.noBrandKit')}
          </p>
          <Link
            to="/settings"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
          >
            {t('create.brandKit.setupBrandKit')}
          </Link>
        </div>
      )}
    </div>
  )
}
