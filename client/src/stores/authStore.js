import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import router from '../router';
import fetchService from '../services/fetch.service';
import { DateTime } from 'luxon';

export const useAuthStore = defineStore('auth-store', {
  /**
   *
   * @returns {{
   * loggedIn:boolean;
   * token:string|null;
   * redirectUrl:string;
   * tokenData:{id: number;
   * username: string;
   * role: TRole;
   * level_id: number;
   * platoons: {
   *   platoon_id: number;
   *   battalion_id: number;
   *   platoon_name: string;
   *   battalion_name: string;
   * }[];
   * } | null;
   * }}
   */
  state: () => {
    return {
      token: null,
      tokenData: null,
      redirectUrl: ''
    };
  },
  actions: {
    registerToken(token) {
      const data = jwtDecode(token);
      const exprDate = DateTime.fromSeconds(data.exp, {
        zone: 'Asia/Jerusalem'
      }).toLocal();
      const isExpired = exprDate <= DateTime.now();
      if (isExpired) {
        console.log('expired');

        return false;
      }
      this.token = token;
      this.tokenData = data;
      return true;
    },
    async login(username, password) {
      const res = await fetchService({
        method: 'post',
        url: '/auth/login',
        body: {
          username,
          password
        }
      });
      if (res.success && res.token) {
        const valid = this.registerToken(res.token);
        return valid;
      }
      return false;
    },

    /**
     *
     * @param {import('vue-router').RouteLocationRaw} to
     * @param {import('vue-router').RouteLocationNormalized} from
     * @param {boolean} full
     * @returns
     */
    redirect(to, from, full = true) {
      const url =
        from?.[full ? 'fullPath' : 'path'] || router.currentRoute.value[full ? 'fullPath' : 'path'];
      if (!url.match(/login|logout/)) this.redirectUrl = url;
      return router.push(to);
    },
    revokeToken() {
      this.token = null;
      this.tokenData = null;
      router.push({
        name: 'login'
      });
    }
  },
  getters: {
    loggedIn() {
      if (!this.token) return false;
      const data = jwtDecode(this.token);
      const exprDate = DateTime.fromSeconds(data.exp, {
        zone: 'Asia/Jerusalem'
      }).toLocal();
      const isExpired = exprDate <= DateTime.now();
      if (isExpired) {
        return false;
      }
      return true;
    }
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
        tokenData: this.tokenData
      };
    }
  }
});
