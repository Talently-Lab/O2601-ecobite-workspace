import Joi from "joi";

export const createSurplusSchema = Joi.object({
    restaurantId: Joi.string()
        .uuid()
        .required(),

    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    foodType: Joi.string()
        .trim()
        .max(30)
        .optional(),

    quantityAvailable: Joi.number()
        .integer()
        .min(1)
        .max(2147483647)
        .required(),

    weightKg: Joi.number()
        .positive()
        .min(0.001)
        .max(9999999.999)
        .precision(3)
        .required(),

    originalPrice: Joi.number()
        .positive()
        .min(0.01)
        .max(9999999999.99)
        .precision(2)
        .required(),

    discountPercentage: Joi.number()
        .integer()
        .valid(10, 20, 30)
        .required()
        .messages({
            "any.only": "El descuento debe ser del 10%, 20% o 30%",
            "any.required": "El descuento es obligatorio",
        }),

    date: Joi.string()
        .isoDate()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .strict()
        .required(),

    pickupFrom: Joi.string()
        .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
        .required()
        .messages({
            "string.pattern.base": "El horario debe tener formato HH:mm",
        }),

    pickupUntil: Joi.string()
        .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
        .required()
        .messages({
            "string.pattern.base": "El horario debe tener formato HH:mm",
        }),

    imageUrls: Joi.array()
        .items(Joi.string().uri({
            scheme: ["http", "https"],
        }))
        .default([]),
})
    .custom((value, helpers) => {
        if (value.pickupFrom >= value.pickupUntil) {
            return helpers.message({
                custom: "El horario de retiro inicial debe ser anterior al horario final",
            });
        }

        return value;
    });