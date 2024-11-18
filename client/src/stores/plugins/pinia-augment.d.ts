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
