import type { MakeApiType, TRole } from '.';

type User = {
  id: number;
  username: string;
  role: TRole;
  level_id: number;
  created_date: string;
  deleted_date?: string;
};

export type GetUsers = MakeApiType<
  {
    url: '/users/list';
    res: {
      data: User[];
      success: true;
    };
  },
  'get'
>;

export type ValidateUsername = MakeApiType<
  {
    url: '/users/validate-username';
    res: {
      success: true;
      valid: boolean;
    };
    body: {
      username: string;
    };
  },
  'post'
>;

export type PostUser = MakeApiType<
  {
    url: '/users';
    body: {
      username: string;
      password: string;
      role: TRole;
      level_id: number;
    };
    res: {
      data: User;
      success: true;
    };
  },
  'post'
>;

export type UpdateUser = MakeApiType<
  {
    url: `/users/${number}`;
    body: {
      username?: string;
      password?: string;
      role?: TRole;
      level_id?: number;
      deleted?: boolean;
    };
    res: {
      data: User;
      success: true;
    };
  },
  'put'
>;
