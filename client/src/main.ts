import './css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import initStorePlugin from './stores/plugins/initStore'
import localStoragePlugin from './stores/plugins/localStorage'
import { i18nPlugin } from './plugins/i18n'
import { useMainStore } from './stores/main'

const app = createApp(App)
const pinia = createPinia()
pinia.use(initStorePlugin)
pinia.use(localStoragePlugin)
app.use(pinia)
app.use(router)

app.use(i18nPlugin)

app.mount('#app')

const mainStore = useMainStore()
mainStore.fetchSampleClients()
mainStore.fetchSampleHistory()
