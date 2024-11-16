import { config } from "../config";
import jwt from "jsonwebtoken";

export type TRole = "admin" | "battalion" | "platoon";

type TokenPayload = {
  id: number;
  username: string;
  role: TRole;
  level_id: number;
  platoons: {
    platoon_id: number;
    battalion_id: number;
    platoon_name: string;
    battalion_name: string;
  }[];
};

declare global {
  namespace Express {
    export interface Request {
      user: TokenPayload;
    }
  }
}

export function jwtVerify(token: string) {
  return jwt.verify(token, config.pblKey, {
    algorithms: ["RS256"],
  }) as TokenPayload;
}

export function jwtSign(obj: Record<string, any>) {
  return jwt.sign(obj, config.prvKey, {
    algorithm: "RS256",
    expiresIn: "2d",
  });
}
