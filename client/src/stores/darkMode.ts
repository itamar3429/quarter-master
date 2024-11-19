import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDarkModeStore = defineStore('darkMode', {
  state() {
    // const storageMode = localStorage.getItem('darkMode')
    // if (storageMode == '1') isEnabled.value = true
    // if (storageMode == '0') isEnabled.value = false
    // set(isEnabled.value)

    return {
      isEnabled: true,
    }
  },
  actions: {
    set(payload?: boolean) {
      this.isEnabled = typeof payload == 'boolean' ? payload : !this.isEnabled

      if (typeof document !== 'undefined') {
        document.body.classList[this.isEnabled ? 'add' : 'remove']('dark-scrollbars')

        document.documentElement.classList[this.isEnabled ? 'add' : 'remove'](
          'dark',
          'dark-scrollbars-compat',
        )
      }

      // You can persist dark mode setting
      // if (typeof localStorage !== 'undefined') {
      localStorage.setItem('darkMode', this.isEnabled ? '1' : '0')
      // }
    },
  },
  localStorage: {
    key: 'dark-mode',
    patch(data) {
      if ('isEnabled' in data && typeof data.isEnabled == 'boolean') this.isEnabled = data.isEnabled
      this.set(this.isEnabled)
    },
    select() {
      return {
        isEnabled: this.isEnabled,
      }
    },
    sync: true,
  },
})
