import { Response } from "express";

export function respond401(res: Response, message: string) {
  return res.status(401).json({
    message,
    success: false,
    status: 401,
  });
}
