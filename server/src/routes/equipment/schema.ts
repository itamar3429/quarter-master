import Joi from "joi";

export const newEquipment = Joi.object({
  platoon_id: Joi.number().required(),
  name: Joi.string().min(3).max(200).required(),
  type: Joi.string().valid("controlled", "regular").required(),
});

export const newEquipmentRegistration = Joi.object({
  platoon_id: Joi.number().required(),
  equipment_id: Joi.number().required(),
  current_count: Joi.number().required(),
  required_count: Joi.number().required(),
});
export const newControlledEquipmentRegistration = Joi.object({
  platoon_id: Joi.number().required(),
  equipment_id: Joi.number().required(),
  soldier_id: Joi.number().required(),
  item_code: Joi.string().alphanum().min(1).max(50).required(),
});
