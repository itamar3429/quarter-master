import Joi from "joi";

export const validateBattalionName = Joi.object({
  name: Joi.string().min(3).max(200).required(),
});

export const addBattalionSchema = Joi.object({
  battalion_name: Joi.string().min(3).max(200).required(),
});

export const validatePlatoonName = Joi.object({
  platoon_name: Joi.string().min(3).max(200),
  battalion_id: Joi.number().required(),
});
