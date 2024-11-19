import type { MakeApiType } from '.';

type Platoon = {
  platoon_id: number;
  platoon_name: string;
};

type Battalion = {
  battalion_id: number;
  battalion_name: string;
  platoons: Platoon[];
};

export type GetBattalions = MakeApiType<
  {
    url: '/org/battalion';
    res: {
      data: Battalion[];
      success: true;
    };
  },
  'get'
>;

export type ValidateBattalionName = MakeApiType<
  {
    url: '/org/battalion/validate';
    res: {
      valid: boolean;
      success: true;
    };
    body: {
      name: string;
    };
  },
  'post'
>;

export type AddBattalion = MakeApiType<
  {
    url: '/org/battalion';
    res: {
      data: Battalion;
      success: true;
    };
    body: {
      battalion_name: string;
    };
  },
  'post'
>;

export type ValidatePlatoonName = MakeApiType<
  {
    url: '/org/platoon/validate';
    res: {
      valid: boolean;
      success: true;
    };
    body: {
      platoon_name: string;
      battalion_id: number;
    };
  },
  'post'
>;

export type AddPlatoon = MakeApiType<
  {
    url: `/org/battalion/${number}/platoon`;
    res: {
      data: Platoon;
      success: true;
    };
    body: {
      platoon_name: string;
    };
  },
  'post'
>;
