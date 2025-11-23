import { useTranslation } from 'react-i18next'
import type { Generation } from '../types'

interface GenerationCardProps {
  generation: Generation
  onDelete: () => void
  onRemix: () => void
  onDownloadPDF: () => void
}

export default function GenerationCard({
  generation,
  onDelete,
  onRemix,
  onDownloadPDF,
}: GenerationCardProps) {
  const { t } = useTranslation()

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Get style badge color
  const getStyleBadgeColor = (style: string) => {
    const colors: Record<string, string> = {
      hormozi: 'bg-red-100 text-red-800',
      welsh: 'bg-blue-100 text-blue-800',
      koe: 'bg-purple-100 text-purple-800',
      custom: 'bg-green-100 text-green-800',
    }
    return colors[style] || 'bg-gray-100 text-gray-800'
  }

  // Truncate text
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header with style badge */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyleBadgeColor(
              generation.style
            )}`}
          >
            {t(`create.styles.${generation.style}`)}
          </span>
          <span className="text-xs text-gray-500">{formatDate(generation.created)}</span>
        </div>
      </div>

      {/* Content Preview */}
      <div className="p-4">
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">
          {truncate(generation.caption, 150)}
        </p>

        {/* Input text preview */}
        <div className="text-xs text-gray-500 mb-4">
          <span className="font-semibold">Source:</span>{' '}
          {truncate(generation.input_text, 80)}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRemix}
              className="px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              {t('dashboard.remix')}
            </button>

            {generation.carousel_pdf ? (
              <button
                onClick={onDownloadPDF}
                className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                {t('dashboard.download')}
              </button>
            ) : (
              <button
                disabled
                className="px-3 py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
              >
                No PDF
              </button>
            )}
          </div>

          {/* Delete Action */}
          <button
            onClick={onDelete}
            className="w-full px-3 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors"
          >
            {t('history.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
