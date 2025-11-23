import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { generationService, subscriptionService } from '../../services'
import MainLayout from '../../components/MainLayout'
import type { Generation } from '../../types'

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [usageInfo, setUsageInfo] = useState({
    used: 0,
    limit: 5,
    isPro: false,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Load subscription info
        const subInfo = await subscriptionService.checkSubscription()
        setUsageInfo({
          used: subInfo.generations_used,
          limit: subInfo.generations_limit || 5,
          isPro: subInfo.tier !== 'free',
        })

        // Load recent generations (last 6)
        const result = await generationService.list({
          page: 1,
          perPage: 6,
          sortBy: '-created',
        })
        setGenerations(result.items)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const examplePrompts = [
    {
      text: t('dashboard.quickStart.prompt1'),
      emoji: '💡',
    },
    {
      text: t('dashboard.quickStart.prompt2'),
      emoji: '🎯',
    },
    {
      text: t('dashboard.quickStart.prompt3'),
      emoji: '🚀',
    },
  ]

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
      <div className="space-y-8">
        {/* Header with Usage Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('dashboard.welcome')}, {user?.email?.split('@')[0]}!
            </h1>
            <p className="mt-1 text-gray-600">{t('dashboard.subtitle')}</p>
          </div>

          {/* Usage Badge */}
          <div className="flex items-center space-x-3">
            {usageInfo.isPro ? (
              <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold">
                {t('dashboard.unlimitedPro')}
              </div>
            ) : (
              <div className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg">
                <span className="text-sm text-gray-600">
                  {t('dashboard.usageLimit', {
                    used: usageInfo.used,
                    limit: usageInfo.limit,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Start Section (if less than 3 generations) */}
        {generations.length < 3 && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t('dashboard.quickStart.title')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('dashboard.quickStart.subtitle')}
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {examplePrompts.map((prompt, index) => (
                <Link
                  key={index}
                  to={`/create?prompt=${encodeURIComponent(prompt.text)}`}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all group"
                >
                  <div className="text-3xl mb-2">{prompt.emoji}</div>
                  <p className="text-sm text-gray-700 group-hover:text-purple-700">
                    {prompt.text}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State (if no generations) */}
        {generations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {t('dashboard.noGenerations')}
            </h3>
            <p className="mt-2 text-gray-500">{t('dashboard.noGenerationsDesc')}</p>
            <Link
              to="/create"
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {t('dashboard.createFirst')}
            </Link>
          </div>
        ) : (
          /* Recent Generations Grid */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('dashboard.recentGenerations')}
              </h2>
              {generations.length >= 6 && (
                <Link
                  to="/history"
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  {t('dashboard.viewAll')} →
                </Link>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {generations.map((generation) => (
                <div
                  key={generation.id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    {generation.carousel_pdf ? (
                      <div className="text-center">
                        <svg
                          className="mx-auto h-16 w-16 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm text-gray-600 mt-2">PDF Ready</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg
                          className="mx-auto h-16 w-16 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <p className="text-sm text-gray-600 mt-2">Draft</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(generation.created).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-900 font-medium line-clamp-2 mb-4">
                      {generation.input_text.substring(0, 100)}
                      {generation.input_text.length > 100 ? '...' : ''}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/create?remix=${generation.id}`}
                        className="flex-1 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 text-center"
                      >
                        {t('dashboard.remix')}
                      </Link>
                      {generation.carousel_pdf && (
                        <a
                          href={generationService.getPDFUrl(generation) || '#'}
                          download
                          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 text-center"
                        >
                          {t('dashboard.download')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade CTA (if free user near limit) */}
        {!usageInfo.isPro && usageInfo.used >= usageInfo.limit - 1 && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {t('dashboard.upgradeCTA.title')}
                </h3>
                <p className="text-purple-100">
                  {t('dashboard.upgradeCTA.subtitle')}
                </p>
              </div>
              <Link
                to="/upgrade"
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('upgrade.title')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
