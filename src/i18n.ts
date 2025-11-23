import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from './locales/en/translation.json'
import ptBRTranslation from './locales/pt-BR/translation.json'
import esTranslation from './locales/es/translation.json'

const resources = {
  en: {
    translation: enTranslation,
  },
  'pt-BR': {
    translation: ptBRTranslation,
  },
  es: {
    translation: esTranslation,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
