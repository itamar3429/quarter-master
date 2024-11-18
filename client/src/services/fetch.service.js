import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL

/**
 * @typedef { {
 *  body?: Record<string, any> | FormData;
 *  headers?: Record<string, any>;
 *  query?: Record<string, any>;
 *  method: 'get' | 'post' | 'put' | 'delete';
 *  url: string;
 *  form_data?: boolean;}} ApiOpts
 */

/**
 * fetch service with api type integration.
 *
 * see request method for more
 */
class FetchService {
  constructor() {
    this.instance = this.createInstance()

    this.authStore = useAuthStore()
  }

  objectToFormData(obj) {
    if (obj instanceof FormData) return obj
    const form = new FormData()
    Object.entries(obj).forEach(([key, val]) => {
      if (typeof val === 'object') val = JSON.stringify(val)
      form.append(key, val)
    })
    return form
  }

  createInstance() {
    return axios.create({
      baseURL: API_URL,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  }
  /**
   *
   * @param {string} url
   * @param {ApiOpts} opts
   * @param {boolean} refreshToken
   * @returns
   */
  async request(url, opts, refreshToken) {
    /**
     * @type {import("axios").AxiosResponse}
     */
    let res
    const token = this.authStore.token
    /**
     * @type {import("axios").AxiosRequestConfig}
     */
    const conf = {
      params: opts.query,
      headers: {
        'content-type': opts.form_data ? 'application/x-www-form-urlencoded' : 'application/json',
        ...opts.headers
      }
    }
    if (token) {
      conf.headers['x-access-token'] = token
    }

    if (
      typeof opts.headers === 'object' &&
      'x-access-token' in opts.headers &&
      !opts.headers['x-access-token']
    ) {
      return {
        status: 0,
        error: 'no access token',
        message: 'no access token',
        res: {}
      }
    }
    try {
      switch (opts.method) {
        case 'post':
        case 'put':
          res = await this.instance[opts.method](
            url,
            opts.body && opts.form_data ? this.objectToFormData(opts.body) : opts.body,
            conf
          )
          break
        default:
          res = await this.instance[opts.method](url, conf)
      }
      return this.processResponse(res, refreshToken)
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        return this.processResponse(err.response, refreshToken)
      }

      return {
        status: 0,
        error: 'Unknown error, please try again later',
        res: err.response
      }
    }
  }

  /**
   *
   * @param {import("axios").AxiosResponse} res
   * @param {boolean} refreshToken
   */
  processResponse(res, refreshToken) {
    if (res.status == 403) {
      console.log('Invalid token')
      this.authStore.revokeToken()
      this.authStore.redirect({ path: '/login' })
    }

    if (typeof res.data === 'string') return res.data
    if (res.data?.token && refreshToken) this.authStore.registerToken(res.data.token)
    return res.data
  }
}

/**
 *
 * @param {ApiOpts} opts
 * @param {boolean} refreshToken
 * @returns
 */
export async function fetchService(opts, refreshToken = true) {
  try {
    const res = await new FetchService().request(opts.url, opts, refreshToken)
    return res
  } catch (error) {
    return
  }
}

export default fetchService
