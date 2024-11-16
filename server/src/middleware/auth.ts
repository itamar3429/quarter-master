import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "../utils/jwt";

export const roleEnum = {
  admin: 1,
  battalion: 2,
  platoon: 3,
} as const;

export function requireAuth(
  allowedRole?: "admin" | "battalion" | "platoon"
): any {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("x-access-token");
      if (!token)
        return res.status(403).json({
          message: "Token is Required",
        });

      const payload = jwtVerify(token);

      if (!payload)
        return res.status(403).json({
          message: "Token cannot be verified",
        });
      if (allowedRole && roleEnum[payload.role] > roleEnum[allowedRole])
        return res.status(403).json({
          message: "Access to route is denied",
        });
      req.user = payload;
      return next();
    } catch (error) {
      console.log(error);

      return res.status(403).json({
        message: "Token cannot be verified",
      });
    }
  };
}
