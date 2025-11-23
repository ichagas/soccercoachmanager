import { useTranslation } from 'react-i18next'
import type { StyleOption } from '../types'

interface StyleSelectorProps {
  value: StyleOption
  onChange: (style: StyleOption) => void
  hasCustomVoice: boolean
}

const STYLE_OPTIONS: Array<{ value: StyleOption; key: string }> = [
  { value: 'hormozi', key: 'hormozi' },
  { value: 'welsh', key: 'welsh' },
  { value: 'koe', key: 'koe' },
  { value: 'custom', key: 'custom' },
]

export default function StyleSelector({
  value,
  onChange,
  hasCustomVoice,
}: StyleSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t('create.selectStyle')}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as StyleOption)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
      >
        {STYLE_OPTIONS.map((option) => {
          const isCustomDisabled = option.value === 'custom' && !hasCustomVoice
          return (
            <option
              key={option.value}
              value={option.value}
              disabled={isCustomDisabled}
            >
              {t(`create.styles.${option.key}`)}
              {isCustomDisabled && ` (${t('create.styles.customDisabled')})`}
            </option>
          )
        })}
      </select>

      {/* Style Description */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-purple-700">
            {t('create.styleInfo')}:{' '}
          </span>
          {t(`create.styleDescriptions.${value}`)}
        </p>
      </div>
    </div>
  )
}
