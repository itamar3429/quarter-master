import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    includeLevels?: (typeof accessEnums)[keyof typeof accessEnums][]
    requireAuth: boolean
  }
}
