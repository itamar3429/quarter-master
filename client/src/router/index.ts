import { createRouter, createWebHistory } from 'vue-router'
// import Home from '@/views/HomeView.vue';
import { authRoute } from '@/hooks/authRoute'
import { useAuthStore } from '@/stores/authStore'
import HomeView from '../views/HomeView.vue'
import type { accessEnums } from '../constants'

import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    includeLevels?: (typeof accessEnums)[keyof typeof accessEnums][]
    requireAuth: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   meta: {
    //     title: 'Select style',
    //     requireAuth: true
    //   },
    //   path: '/',
    //   name: 'style',
    //   component: Style
    // },
    {
      // Document title tag
      // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
      meta: {
        title: 'Dashboard',
        requireAuth: true,
      },
      path: '/',
      name: 'dashboard',
      component: HomeView,
    },
    {
      // Document title tag
      // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
      meta: {
        title: 'Battalion Structure',
        requireAuth: true,
      },
      path: '/org',
      name: 'battalion-structure',
      component: () => import('@/views/OrgStructure.vue'),
    },
    {
      meta: {
        title: 'Tables',
        requireAuth: true,
      },
      path: '/tables',
      name: 'tables',
      component: () => import('@/views/TablesView.vue'),
    },
    {
      meta: {
        title: 'Forms',
        requireAuth: true,
      },
      path: '/forms',
      name: 'forms',
      component: () => import('@/views/FormsView.vue'),
    },
    {
      meta: {
        title: 'Profile',
        requireAuth: true,
      },
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      meta: {
        title: 'Ui',
        requireAuth: true,
      },
      path: '/ui',
      name: 'ui',
      component: () => import('@/views/UiView.vue'),
    },
    {
      meta: {
        title: 'Responsive layout',
        requireAuth: true,
      },
      path: '/responsive',
      name: 'responsive',
      component: () => import('@/views/ResponsiveView.vue'),
    },
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
        title: 'Error',
        requireAuth: true,
      },
      path: '/error',
      name: 'error',
      component: () => import('@/views/ErrorView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

const DEFAULT_TITLE = 'מנהל כח אדם'

router.beforeEach((to, from, next) => {
  const meta = to.meta
  document.title = meta.title || DEFAULT_TITLE
  if (to.path === '/logout') {
    useAuthStore().revokeToken()
  }
  const allowed = authRoute(to)
  console.log(allowed, to.fullPath)
  if (allowed) {
    next()
  }
})

export default router
