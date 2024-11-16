import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export function validateSchema(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = schema.validate(req.body, {
      allowUnknown: true,
    });

    if (!data.error) {
      req.body = data.value;
      next();
      return;
    }
    res.status(400).json({
      message: "Body Validation Error",
      error: data.error,
      success: false,
    });
  };
}
