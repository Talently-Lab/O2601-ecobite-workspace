import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "El nombre es obligatorio",
      "string.min": "El nombre debe tener al menos 2 caracteres",
      "any.required": "El nombre es obligatorio",
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(255)
    .required()
    .messages({
      "string.empty": "El email es obligatorio",
      "string.email": "El formato del email no es válido",
      "any.required": "El email es obligatorio",
    }),

  password: Joi.string()
    .min(8)
    .max(72)
    .required()
    .messages({
      "string.empty": "La contraseña es obligatoria",
      "string.min": "La contraseña debe tener al menos 8 caracteres",
      "string.max": "La contraseña no puede superar los 72 caracteres",
      "any.required": "La contraseña es obligatoria",
    }),
});
