import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface RegenerateModalProps {
  isOpen: boolean
  onClose: () => void
  onRegenerate: (customInstructions: string) => void
  isGenerating: boolean
}

export default function RegenerateModal({
  isOpen,
  onClose,
  onRegenerate,
  isGenerating,
}: RegenerateModalProps) {
  const { t } = useTranslation()
  const [instructions, setInstructions] = useState('')

  const handleSubmit = () => {
    onRegenerate(instructions)
    setInstructions('') // Reset for next time
  }

  const handleClose = () => {
    if (!isGenerating) {
      setInstructions('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {t('generate.modal.title')}
              </h2>
              {!isGenerating && (
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <p className="text-gray-600 mb-4">
              {t('generate.modal.subtitle')}
            </p>

            {/* Custom Instructions */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('generate.modal.instructionsLabel')}
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={t('generate.modal.instructionsPlaceholder')}
                disabled={isGenerating}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-sm text-gray-500">
                {t('generate.modal.instructionsHint')}
              </p>
            </div>

            {/* Example Instructions */}
            <div className="mt-6 bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h4 className="text-sm font-semibold text-purple-900 mb-2">
                {t('generate.modal.examplesTitle')}
              </h4>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• {t('generate.modal.example1')}</li>
                <li>• {t('generate.modal.example2')}</li>
                <li>• {t('generate.modal.example3')}</li>
                <li>• {t('generate.modal.example4')}</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={handleClose}
              disabled={isGenerating}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isGenerating}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isGenerating
                ? t('generate.modal.regenerating')
                : t('generate.modal.regenerate')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
