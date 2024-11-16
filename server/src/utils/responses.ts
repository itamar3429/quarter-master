import { Response } from "express";

export function respond(res: Response, code: number, message: string) {
  return res.status(401).json({
    message,
    success: false,
    status: 401,
  });
}
export function respond401(res: Response, message: string) {
  return res.status(401).json({
    message,
    success: false,
    status: 401,
  });
}
export function respond500(
  res: Response,
  message: string = "Our servers have experienced an error, please try again later"
) {
  return res.status(500).json({
    message,
    success: false,
    status: 500,
  });
}
