import { createRouter, createWebHistory } from 'vue-router';
// import Home from '@/views/HomeView.vue';
import { authRoute } from '@/hooks/authRoute';
import { useAuthStore } from '@/stores/authStore';
import HomeView from '../views/HomeView.vue';
import type { accessEnums } from '../constants';

import 'vue-router';
declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    includeLevels?: (typeof accessEnums)[keyof typeof accessEnums][];
    requireAuth: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      meta: {
        title: 'Login',
        requireAuth: false,
      },
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      meta: {
        title: 'Home',
        requireAuth: true,
      },
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      meta: {
        title: 'Battalion Structure',
        requireAuth: true,
        includeLevels: [1, 2],
      },
      path: '/org',
      name: 'battalion-structure',
      component: () => import('@/views/OrgStructure.vue'),
    },

    /**
     *
     *
     *
     * template
     *
     *
     *
     */

    {
      meta: {
        title: 'Dashboard',
        requireAuth: false,
      },
      path: '/dashboard',
      name: 'dashboard',
      component: HomeView,
    },

    {
      meta: {
        title: 'Tables',
        requireAuth: false,
      },
      path: '/tables',
      name: 'tables',
      component: () => import('@/views/TablesView.vue'),
    },
    {
      meta: {
        title: 'Forms',
        requireAuth: false,
      },
      path: '/forms',
      name: 'forms',
      component: () => import('@/views/FormsView.vue'),
    },
    {
      meta: {
        title: 'Profile',
        requireAuth: false,
      },
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      meta: {
        title: 'Ui',
        requireAuth: false,
      },
      path: '/ui',
      name: 'ui',
      component: () => import('@/views/UiView.vue'),
    },
    {
      meta: {
        title: 'Responsive layout',
        requireAuth: false,
      },
      path: '/responsive',
      name: 'responsive',
      component: () => import('@/views/ResponsiveView.vue'),
    },
    {
      meta: {
        title: 'Error',
        requireAuth: false,
      },
      path: '/error',
      name: 'error',
      component: () => import('@/views/ErrorView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

const DEFAULT_TITLE = 'מנהל כח אדם';

router.beforeEach((to, from, next) => {
  const meta = to.meta;
  document.title = meta.title || DEFAULT_TITLE;
  if (to.path === '/logout') {
    useAuthStore().revokeToken();
  }
  const allowed = authRoute(to);
  console.log(allowed, to.fullPath);
  if (allowed) {
    next();
  }
});

export default router;
