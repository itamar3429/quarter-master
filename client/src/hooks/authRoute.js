import router from '../router';
import { useAuthStore } from '../stores/authStore';

/**
 *
 * @param {import("vue-router").RouteLocationNormalized} to
 */
export function authRoute(to) {
  if (to.meta.requireAuth) {
    const authStore = useAuthStore();
    if (!authStore.loggedIn) {
      authStore.redirectUrl = to.fullPath;
      router.push({
        name: 'login'
      });
      return false;
    }
    return true;
  }
  return true;
}
