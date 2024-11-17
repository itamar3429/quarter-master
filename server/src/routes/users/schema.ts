import Joi from "joi";

export const postUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  password: Joi.string().min(6).max(20).required(),
  role: Joi.allow("admin", "battalion", "platoon").required(),
  level_id: Joi.number().required(),
});
