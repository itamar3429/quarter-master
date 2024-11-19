import axios, {
  type AxiosRequestConfig,
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
} from 'axios'
import type { ApiType, OmitRes } from '@/services/types'
import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL

/**
 * fetch service with api type integration.
 *
 * see request method for more
 */
class FetchService {
  private instance: AxiosInstance
  authStore: ReturnType<typeof useAuthStore>
  constructor() {
    this.instance = this.createInstance()
    this.authStore = useAuthStore()
  }

  objectToFormData<T extends Record<string, any> | FormData>(obj: T) {
    if (obj instanceof FormData) return obj
    const form = new FormData()
    Object.entries(obj).forEach(([key, val]) => {
      if (typeof val === 'object') val = JSON.stringify(val)
      form.append(key, val)
    })
    return form
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createInstance() {
    return axios.create({
      baseURL: API_URL,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
  }

  async request<T extends ApiType = ApiType>(
    url: string,
    opts: Omit<T, 'res'>,
    refreshToken: boolean,
  ): Promise<
    (T['res'] & (T['res'] extends string ? {} : { res: Omit<AxiosResponse, 'data'> })) | undefined
  > {
    let res: AxiosResponse
    const token = this.authStore.token
    const conf: AxiosRequestConfig = {
      params: opts.query,
      headers: {
        'content-type': opts.form_data ? 'application/x-www-form-urlencoded' : 'application/json',
        ...opts.headers,
      },
    }
    if (token) {
      conf.headers!['x-access-token'] = token
    }

    try {
      switch (opts.method) {
        case 'post':
        case 'put':
          res = await this.instance[opts.method](
            url,
            opts.body && opts.form_data ? this.objectToFormData(opts.body) : opts.body,
            conf,
          )
          break
        default:
          res = await this.instance[opts.method](url, conf)
      }
      return this.processResponse<T>(res, refreshToken)
    } catch (err: any) {
      if (err instanceof AxiosError && err.response) {
        return this.processResponse(err.response, refreshToken)
      }

      return
    }
  }

  private processResponse<T extends ApiType>(
    res: AxiosResponse,
    refreshToken: boolean,
  ): (T['res'] & { res: Omit<AxiosResponse, 'data'> }) | T['res'] {
    if (res.status == 403) {
      console.log('Invalid token')
      this.authStore.revokeToken()
    }
    if (typeof res.data === 'string') return res.data
    if (res.data?.token && refreshToken) this.authStore.registerToken(res.data.token)
    return Object.assign(res.data as T['res'], {
      res: {
        ...res,
        data: undefined,
      },
    })
  }
}

type CacheOpts = {
  cache: boolean
  maxTime?: number
  getFromCache: boolean
}

/**
 *
 *
 * typed api integration
 *
 * the function supports caching response. for caching also add a caching opts object
 *
 * ```ts
 * const data = await fetchService<ApiType>(opts, {
 *  cache: true, // allow to save response to cache
 *  maxTime:1000 *60 *5, // 5 minutes
 *  getFromCache: true, // allow to get from cached data
 * });
 * ```
 *
 * example code:
 *
 *
 * ```ts
 * import { GetMe } from "@services/types/api/auth";
 * import fetchService from "@services/fetch.service";
 * const opts: Omit<GetNe, "res"> ={
 *  url: "/auth/me/",
 *  method: "GET",
 *  headers: {
 *    "x-access-token": token
 *  }
 * }
 * const data = await fetchService<ApiType>(opts);
 * if("status" in data){
 *  // there is an error
 * }
 * else {
 *  // res is successful and data is typed with the GetMe.res api type
 * }
 * ...
 * ```
 */
export async function fetchService<T extends ApiType>(
  opts: OmitRes<T>,
  cacheOpts?: CacheOpts,
  refreshToken = true,
) {
  try {
    const cacheKey = opts.url + '?' + new URLSearchParams(opts.query).toString()
    if (cacheOpts?.getFromCache) {
      const cached = await cacheService.getCache(cacheKey)
      if (cached) {
        return cached as T['res'] & {
          res: AxiosResponse<any, any>
        }
      }
    }

    const res = await new FetchService().request(opts.url, opts, refreshToken)

    if (
      res &&
      cacheOpts?.cache &&
      (typeof res === 'string' ||
        // @ts-ignore
        (typeof res === 'object' &&
          !('status' in res) &&
          // don't cache if response data is an empty array
          ('data' in res && Array.isArray(res.data) ? res.data.length : true)))
    ) {
      const cacheData = res
      if (cacheData)
        cacheService.cache(cacheKey, cacheData, {
          maxTime: cacheOpts.maxTime,
        })
    }
    return res
  } catch (error) {}
}

type ServiceCacheOpts = {
  /**
   * max time to cache in ms
   * default: 5m
   */
  maxTime: number
}

type CacheData = {
  objectUrl: string
  time: number
  key: string
  opts: ServiceCacheOpts
  type: 'object' | 'string'
}

class CacheService {
  private cacheMap = new Map<string, CacheData>()

  cache<T>(key: string, data: T, { maxTime = 30 * 1000 }: Partial<ServiceCacheOpts>) {
    const type = typeof data as CacheData['type']
    let strData: string
    if (typeof data == 'object') strData = JSON.stringify(data)
    else if (typeof data == 'string') strData = data
    else return
    const toCache: CacheData = {
      objectUrl: URL.createObjectURL(
        new Blob([strData], {
          type: 'text/plain',
        }),
      ),
      type,
      time: Date.now(),
      key,
      opts: { maxTime },
    }
    this.cacheMap.set(key, toCache)
  }

  async getCache(key: string) {
    const cached = this.cacheMap.get(key)
    if (!cached) return null
    const expired = this.isExpired(cached)
    if (expired) {
      this.cacheMap.delete(key)
      URL.revokeObjectURL(cached.objectUrl)
    }
    if (!expired && cached.objectUrl) {
      await this.wait()
      const res = await fetch(cached.objectUrl)
        .then(
          (res) => {
            console.log('getting cache from saved object')

            if (cached.type == 'object') return res.json() as Promise<Record<string | number, any>>
            else return res.text()
          },
          () => null,
        )
        .catch(() => null)
      return res || null
    }
    return null
  }

  private isExpired(cached: CacheData) {
    return Date.now() > cached.time + cached.opts.maxTime
  }
  clear() {
    this.cacheMap.forEach((v) => {
      URL.revokeObjectURL(v.objectUrl)
    })
    this.cacheMap.clear()
  }
  wait() {
    return new Promise((res) => {
      setTimeout(() => res(true), 150)
    })
  }
}

export const cacheService = new CacheService()

export default fetchService
