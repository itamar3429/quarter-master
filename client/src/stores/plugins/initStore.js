/**
 *
 * @type {import("pinia").PiniaPlugin}
 */
export const initStorePlugin = (context) => {
  context.options.onLoad?.call(context.store)
}

export default initStorePlugin
