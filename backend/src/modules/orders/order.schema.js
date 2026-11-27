import Joi from "joi";

export const createOrderSchema = Joi.object({
    surplusId: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.guid": "El ID del excedente no es válido",
            "any.required": "El ID del excedente es obligatorio",
        }),

    quantity: Joi.number()
        .integer()
        .min(1)
        .max(2147483647)
        .required()
        .messages({
            "number.base": "La cantidad debe ser un número",
            "number.integer": "La cantidad debe ser un número entero",
            "number.min": "La cantidad debe ser mayor a cero",
            "number.max": "La cantidad supera el límite permitido",
            "any.required": "La cantidad es obligatoria",
        }),
});

export const pickupOrderSchema = Joi.object({
    pickupCode: Joi.string()
        .trim()
        .uppercase()
        .length(6)
        .pattern(/^[A-Z0-9]{6}$/)
        .required()
        .messages({
            "string.empty": "El código de retiro es obligatorio",
            "string.length": "El código debe tener 6 caracteres",
            "string.pattern.base": "El código debe ser alfanumérico",
            "any.required": "El código de retiro es obligatorio",
        }),
});