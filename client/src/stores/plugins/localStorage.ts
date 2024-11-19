import type { PiniaPlugin } from 'pinia'
import 'pinia'

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    onLoad?: (this: Store) => any
    localStorage?: {
      /**Local Storage key identifier */
      key: string
      /**Whether to sync the stores between tabs */
      sync: boolean
      /**Returned object will be saved in localStorage */
      select: (this: Store) => Record<string | number, any>
      /**Data contains the saved localStorage data from previous save */
      patch: (this: Store, data: any) => any
    }
  }
}

export const localStoragePlugin: PiniaPlugin = (context) => {
  if (!context.options.localStorage) return

  const key = context.options.localStorage.key
  const sync = context.options.localStorage.sync
  const select = context.options.localStorage.select.bind(context.store)
  const patch = context.options.localStorage.patch.bind(context.store)
  const updateLocalStorage = () => {
    const data = select()
    localStorage.setItem(key, JSON.stringify(data))
  }
  const updateFromLocalStorage = () => {
    const data = localStorage.getItem(key)
    try {
      patch(data && data !== 'undefined' ? JSON.parse(data) : {})
      // eslint-disable-next-line no-empty
    } catch {}
  }
  if (key) {
    updateFromLocalStorage()
    updateLocalStorage()
    window.addEventListener('storage', (e) => {
      if (e.key === key && sync) {
        updateFromLocalStorage()
      }
    })
    context.store.$subscribe(updateLocalStorage)
  }
}

export default localStoragePlugin
