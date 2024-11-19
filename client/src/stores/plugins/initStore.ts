import type { PiniaPlugin } from 'pinia'

export const initStorePlugin: PiniaPlugin = (context) => {
  context.options.onLoad?.call(context.store)
}

export default initStorePlugin
