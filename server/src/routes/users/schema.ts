import Joi from "joi";

export const postUserSchema = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9._@]+$/)
    .min(3)
    .max(50)
    .required(),
  password: Joi.string().min(6).max(20).required(),
  role: Joi.string().valid("admin", "battalion", "platoon").required(),
  level_id: Joi.number().required(),
});

export const putUserSchema = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9._@]+$/)
    .min(3)
    .max(50),
  password: Joi.string().min(6).max(20),
  role: Joi.string().valid("admin", "battalion", "platoon"),
  level_id: Joi.number(),
  deleted: Joi.boolean(),
});

export const validateUsername = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9._@]+$/)
    .min(3)
    .max(50)
    .required(),
});
