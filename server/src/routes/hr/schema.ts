import Joi from "joi";

export const newSoldier = Joi.object({
  f_name: Joi.string().min(3).max(50).required(),
  l_name: Joi.string().min(3).max(50).required(),
  personal_id: Joi.string().alphanum().min(3).max(20).required(),
  department: Joi.string().min(3).max(50).required(),
  role: Joi.string().min(3).max(50).required(),
  platoon_id: Joi.number().required(),
});

export const updateSoldier = Joi.object({
  f_name: Joi.string().min(3).max(50),
  l_name: Joi.string().min(3).max(50),
  personal_id: Joi.string().alphanum().min(3).max(20),
  department: Joi.string().min(3).max(50),
  role: Joi.string().min(3).max(50),
  platoon_id: Joi.number(),
  deleted: Joi.boolean(),
});

export const newSoldierActivity = Joi.object({
  location: Joi.string().min(1).max(200).required(),
  note: Joi.string().min(0).max(1000).allow(null),
});
