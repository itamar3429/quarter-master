import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';
// import all namespaces (for the default language, only)
import en from '@/locales/en.json';
import he from '@/locales/he.json';
import 'vue-i18n';

type Message = typeof he;
declare module 'vue-i18n' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: 'he';
    // custom resources type
    resources: {
      he: typeof he;
      en: typeof en;
    };
    // other
  }
  interface DefineLocaleMessage extends Message {}
}

export const i18nPlugin = createI18n<[typeof he], 'en' | 'he'>({
  locale: 'he',
  messages: messages as any,
  datetimeFormats: {
    he: {
      short_date: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    },
    en: {
      short_date: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    },
  },
});

export const i18nG = i18nPlugin.global;
