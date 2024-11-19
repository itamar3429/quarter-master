import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
// import all namespaces (for the default language, only)
import en from '@/locales/en.json'
import he from '@/locales/he.json'
import 'vue-i18n'

declare module 'vue-i18n' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: 'he'
    // custom resources type
    resources: {
      he: typeof he
      en: typeof en
    }
    // other
  }
}

export const i18nPlugin = createI18n<[typeof he], 'en' | 'he'>({
  locale: 'he',
  messages: messages as any,
})
