import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDarkModeStore = defineStore(
  'darkMode',
  () => {
    const isEnabled = ref(true)

    function set(payload = null) {
      isEnabled.value = payload !== null ? payload : !isEnabled.value

      if (typeof document !== 'undefined') {
        document.body.classList[isEnabled.value ? 'add' : 'remove']('dark-scrollbars')

        document.documentElement.classList[isEnabled.value ? 'add' : 'remove'](
          'dark',
          'dark-scrollbars-compat'
        )
      }

      // You can persist dark mode setting
      // if (typeof localStorage !== 'undefined') {
      localStorage.setItem('darkMode', isEnabled.value ? '1' : '0')
      // }
    }

    // const storageMode = localStorage.getItem('darkMode')
    // if (storageMode == '1') isEnabled.value = true
    // if (storageMode == '0') isEnabled.value = false
    // set(isEnabled.value)

    return {
      isEnabled,
      set
    }
  },
  {
    localStorage: {
      key: 'dark-mode',
      patch(data) {
        if ('isEnabled' in data && typeof data.isEnabled == 'boolean')
          this.isEnabled = data.isEnabled
        this.set(this.isEnabled)
      },
      select() {
        return {
          isEnabled: this.isEnabled
        }
      },
      sync: true
    }
  }
)
