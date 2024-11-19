import { type Ref, ref, watch } from 'vue'
import { debounce as debounceFn } from '@/utils'

export function asyncComputed<T>(
  func: (reload: boolean, isLatest: () => boolean) => Promise<T>,
  opts: {
    watchers: any[]
    debounce?: number
    resetOnLoad: boolean
    defVal: any
  },
) {
  const value = ref<T>(opts.defVal) as Ref<T>
  const loading = ref(true)
  let gLoadTime = 0
  let load = (reload = false, resetData = true) => {
    const loadTime = (gLoadTime = Date.now())
    loading.value = true
    if (opts.resetOnLoad && resetData) value.value = opts.defVal
    func(reload, () => loadTime === gLoadTime).then((res) => {
      if (loadTime === gLoadTime) {
        value.value = res
        loading.value = false
      }
    })
  }
  if (opts.debounce) {
    load = debounceFn(load, opts.debounce)
  } else {
    load = debounceFn(load, 50)
  }
  watch(opts.watchers || [], () => load())
  load()
  return { data: value, loading, reload: load }
}
