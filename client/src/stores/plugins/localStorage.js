/**
 *
 * @type {import("pinia").PiniaPlugin}
 */
export const localStoragePlugin = (context) => {
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
