// date pattern: YYYY-MM-DD

export type TMethod = 'POST' | 'GET' | 'PUT' | 'DELETE'
export type TMethodLower = 'post' | 'get' | 'put' | 'delete'

export type TRole = 'admin' | 'battalion' | 'platoon'

export type TokenData = {
  id: number
  username: string
  role: TRole
  level_id: number
  platoons: {
    platoon_id: number
    battalion_id: number
    platoon_name: string
    battalion_name: string
  }[]
}

export type ApiType = {
  res: any
  body?: Record<string, any> | FormData
  headers?: Record<string, any>
  path?: Record<string, any>
  query?: Record<string, any>
  method: TMethodLower
  url: string
  form_data?: boolean
}

export type TokenHeader<T extends Record<string, any> = {}> = {
  headers?: {
    'x-access-token': string
  } & T
}

export type OmitRes<T extends ApiType> = Omit<T, 'res'>

export type MakeApiType<T extends Omit<ApiType, 'method'>, M extends TMethodLower> = {
  method: M
} & T
