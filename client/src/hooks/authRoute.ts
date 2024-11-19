import type { RouteLocationNormalized } from 'vue-router'
import router from '../router'
import { useAuthStore } from '../stores/authStore'

export function authRoute(to: RouteLocationNormalized) {
  if (to.meta.requireAuth) {
    const authStore = useAuthStore()
    if (!authStore.loggedIn) {
      authStore.redirectUrl = to.fullPath
      router.push({
        name: 'login',
      })
      return false
    }
    return true
  }
  return true
}
