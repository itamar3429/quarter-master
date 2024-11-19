import { type Ref, ref, watch } from 'vue'
import { debounce as debounceFn } from '@/utils'
import type { ApiType, OmitRes } from '@/services/types'
import fetchService from '@/services/fetch.service'

export function fetchComputed<T extends ApiType & { res: { data: any } }>(
  func: () => OmitRes<T>,
  config: {
    watchers?: any[]
    debounce?: number
    resetOnLoad?: boolean
    defVal: any
    loadIf?: () => boolean
    fetchCaller?: (opts: OmitRes<T>) => ReturnType<typeof fetchService<T>>
    // onLoad
  },
) {
  if (!config.defVal) config.defVal = null
  const value = ref<T>(config.defVal) as Ref<T['res']['data']>
  const loading = ref(true)
  let gLoadTime = 0
  let loadResolve = () => {}
  let load = async (resetData = true) => {
    const loadTime = (gLoadTime = Date.now())
    loading.value = true
    if (config.loadIf && !config.loadIf()) {
      loading.value = false
      value.value = config.defVal
      return
    }
    if (config.resetOnLoad && resetData) value.value = config.defVal
    const opts = func()
    const res = await (config.fetchCaller ? config.fetchCaller(opts) : fetchService<T>(opts))
    if (loadTime === gLoadTime) {
      loading.value = false
      if (res && 'data' in res) {
        value.value = (res as any).data
      }
    }
  }
  if (config.debounce) {
    load = debounceFn(load, config.debounce)
  } else {
    load = debounceFn(load, 50)
  }
  watch(
    [() => JSON.stringify(func()), ...(config.watchers || []), config.loadIf || (() => null)],
    () => load(),
  )
  load()

  watch(loading, () => {
    if (!loading.value) loadResolve()
  })

  return {
    data: value,
    loading,
    reload: (resetData?: boolean) => {
      const p = new Promise<true>((res) => {
        loadResolve = () => res(true)
      })
      load(resetData)
      return p
    },
  }
}
