import { i18nG } from '@/plugins/i18n';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useDarkModeStore = defineStore('style-lang', {
  state() {
    // const storageMode = localStorage.getItem('darkMode')
    // if (storageMode == '1') isDarkMode.value = true
    // if (storageMode == '0') isDarkMode.value = false
    // set(isDarkMode.value)

    return {
      isDarkMode: true,
      locale: 'he',
    };
  },
  actions: {
    setDarkMode(payload?: boolean) {
      this.isDarkMode = typeof payload == 'boolean' ? payload : !this.isDarkMode;

      if (typeof document !== 'undefined') {
        document.body.classList[this.isDarkMode ? 'add' : 'remove']('dark-scrollbars');

        document.documentElement.classList[this.isDarkMode ? 'add' : 'remove'](
          'dark',
          'dark-scrollbars-compat',
        );
      }

      // You can persist dark mode setting
      // if (typeof localStorage !== 'undefined') {
      localStorage.setItem('darkMode', this.isDarkMode ? '1' : '0');
      // }
    },
    setLocale(locale: (typeof i18nG.availableLocales)[number]) {
      if (i18nG.availableLocales.includes(locale)) {
        this.locale = locale;
        (i18nG.locale as any).value = locale;
        document.documentElement.dir = locale == 'he' ? 'rtl' : '';
      }
    },
  },
  localStorage: {
    key: 'style-lang',
    patch(data) {
      if ('isDarkMode' in data && typeof data.isDarkMode == 'boolean')
        this.isDarkMode = data.isDarkMode;
      if ('locale' in data) this.setLocale(data.locale);
      this.setDarkMode(this.isDarkMode);
    },
    select() {
      return {
        isDarkMode: this.isDarkMode,
        locale: this.locale,
      };
    },
    sync: true,
  },
});
