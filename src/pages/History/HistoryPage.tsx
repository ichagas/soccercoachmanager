import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { generationService } from '../../services'
import type { Generation, StyleOption } from '../../types'
import GenerationCard from '../../components/GenerationCard'

export default function HistoryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // State
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [styleFilter, setStyleFilter] = useState<StyleOption | ''>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const perPage = 12

  // Load generations
  useEffect(() => {
    loadGenerations()
  }, [searchQuery, styleFilter, currentPage])

  const loadGenerations = async () => {
    setIsLoading(true)
    try {
      const result = await generationService.list({
        page: currentPage,
        perPage,
        style: styleFilter || undefined,
        searchQuery: searchQuery || undefined,
        sortBy: '-created',
      })

      setGenerations(result.items)
      setTotalPages(result.totalPages)
      setTotalItems(result.totalItems)
    } catch (error) {
      console.error('Failed to load generations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleStyleFilter = (style: StyleOption | '') => {
    setStyleFilter(style)
    setCurrentPage(1) // Reset to first page on new filter
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('history.deleteConfirm'))) {
      return
    }

    try {
      await generationService.delete(id)
      // Reload current page
      await loadGenerations()

      // If current page is now empty and not the first page, go back one page
      if (generations.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (error) {
      console.error('Failed to delete generation:', error)
      alert('Failed to delete carousel. Please try again.')
    }
  }

  const handleRemix = (generation: Generation) => {
    // Navigate to create page with the input text as URL parameter
    navigate(`/create?prompt=${encodeURIComponent(generation.input_text)}&style=${generation.style}`)
  }

  const handleDownloadPDF = (generation: Generation) => {
    const pdfUrl = generationService.getPDFUrl(generation)
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    } else {
      alert('PDF not available for this carousel')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('history.title')}
          </h1>
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? 'carousel' : 'carousels'} generated
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="sr-only">
                {t('history.search')}
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t('history.search')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Style Filter */}
            <div>
              <label htmlFor="style-filter" className="sr-only">
                {t('history.filterByStyle')}
              </label>
              <select
                id="style-filter"
                value={styleFilter}
                onChange={(e) => handleStyleFilter(e.target.value as StyleOption | '')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">{t('history.allStyles')}</option>
                <option value="hormozi">{t('create.styles.hormozi')}</option>
                <option value="welsh">{t('create.styles.welsh')}</option>
                <option value="koe">{t('create.styles.koe')}</option>
                <option value="custom">{t('create.styles.custom')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && generations.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {t('history.noResults')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || styleFilter
                ? 'Try adjusting your filters'
                : 'Create your first carousel to get started'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {t('dashboard.newCarousel')}
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        {!isLoading && generations.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {generations.map((generation) => (
                <GenerationCard
                  key={generation.id}
                  generation={generation}
                  onDelete={() => handleDelete(generation.id)}
                  onRemix={() => handleRemix(generation)}
                  onDownloadPDF={() => handleDownloadPDF(generation)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.previous')}
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
