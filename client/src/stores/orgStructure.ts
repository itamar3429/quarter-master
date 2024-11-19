import { fetchComputed } from '@/hooks/fetchComputed'
import type { GetBattalions } from '@/services/types/org'
import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export const useOrgStore = defineStore('org-structure', {
  state() {
    const authStore = useAuthStore()
    const org = fetchComputed<GetBattalions>(
      () => {
        return {
          method: 'get',
          url: '/org/battalion',
        }
      },
      {
        defVal: [],
        loadIf() {
          return authStore.loggedIn
        },
        resetOnLoad: true,
      },
    )
    return { org }
  },
})
