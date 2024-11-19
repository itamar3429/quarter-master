import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import router from '../router';
import fetchService from '../services/fetch.service';
import { DateTime } from 'luxon';
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import type { TokenData } from '@/services/types';

export const useAuthStore = defineStore('auth-store', {
  state(): {
    loggedIn: boolean;
    token: string | null;
    redirectUrl: string;
    tokenData: TokenData | null;
  } {
    return {
      token: null,
      tokenData: null,
      redirectUrl: '',
    } as any;
  },

  actions: {
    registerToken(token: string) {
      const data = jwtDecode(token);
      const exprDate = DateTime.fromSeconds(data.exp!, {
        zone: 'Asia/Jerusalem',
      }).toLocal();
      const isExpired = exprDate <= DateTime.now();
      if (isExpired) {
        console.log('expired');

        return false;
      }
      this.token = token;
      this.tokenData = data as any;
      return true;
    },
    async login(username: string, password: string) {
      const res = await fetchService({
        method: 'post',
        url: '/auth/login',
        body: {
          username,
          password,
        },
      });
      if (res.success && res.token) {
        const valid = this.registerToken(res.token);
        return valid;
      }
      return false;
    },

    redirect(to: RouteLocationRaw, from?: RouteLocationNormalized, full = true) {
      const url =
        from?.[full ? 'fullPath' : 'path'] || router.currentRoute.value[full ? 'fullPath' : 'path'];
      if (!url.match(/login|logout/)) this.redirectUrl = url;
      return router.push(to);
    },
    revokeToken() {
      this.token = null;
      this.tokenData = null;
      this.redirect({
        name: 'login',
      });
    },
  },
  getters: {
    loggedIn() {
      if (!this.token) return false;
      const data = jwtDecode(this.token);
      const exprDate = DateTime.fromSeconds(data.exp!, {
        zone: 'Asia/Jerusalem',
      }).toLocal();
      const isExpired = exprDate <= DateTime.now();
      if (isExpired) {
        return false;
      }
      return true;
    },
  },
  localStorage: {
    key: 'auth-store',
    patch(data) {
      if ('token' in data) {
        this.registerToken(data.token);
      }
    },
    select() {
      return {
        token: this.token,
        tokenData: this.tokenData,
      };
    },
    sync: false,
  },
});
