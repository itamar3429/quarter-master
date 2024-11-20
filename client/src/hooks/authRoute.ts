import type { RouteLocationNormalized } from 'vue-router';
import router from '../router';
import { useAuthStore } from '../stores/authStore';
import { accessEnums } from '@/constants';

export function authRoute(to: RouteLocationNormalized) {
  if (to.meta.requireAuth) {
    const authStore = useAuthStore();
    if (!authStore.loggedIn) {
      authStore.redirectUrl = to.fullPath;
      router.push({
        name: 'login',
      });
      return false;
    }
    if (to.meta.includeLevels?.length) {
      return to.meta.includeLevels.includes(accessEnums[authStore.tokenData!.role]);
    }
    return true;
  }
  return true;
}
