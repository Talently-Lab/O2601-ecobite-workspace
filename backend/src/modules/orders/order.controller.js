import { createOrder, pickupOrder } from "./order.service.js";
import ResponseHelper from "../../utils/responseHelper.js";
import Joi from "joi";

export const create = async (req, res) => {
    try {
        const order = await createOrder(req.user.id, req.body);

        return ResponseHelper.created(
            res,
            order,
            "Reserva creada correctamente"
        );

    } catch (error) {

        if (error.statusCode === 404) {
            return ResponseHelper.notFound(
                res,
                error.message
            );
        }

        if (error.statusCode === 400) {
            return ResponseHelper.badRequest(
                res,
                error.message
            );
        }

        if (error.statusCode === 409) {
            return ResponseHelper.conflict(
                res,
                error.message
            );
        }

        return ResponseHelper.error(
            res,
            "Error al crear la reserva",
            error
        );
    }
};

// Controlador para confirmar el retiro de una reserva
export const pickup = async (req, res) => {
    try {
        const { id } = req.params;
        const { pickupCode } = req.body;

        const { error } = Joi.string()
            .uuid()
            .required()
            .validate(id);

        if (error) {
            return ResponseHelper.badRequest(
                res,
                "El ID de la reserva no es válido"
            );
        }

        const order = await pickupOrder(id, pickupCode);

        return ResponseHelper.success(
            res,
            order,
            "Retiro confirmado correctamente"
        );

    } catch (error) {

        if (error.statusCode === 404) {
            return ResponseHelper.notFound(
                res,
                error.message
            );
        }

        if (error.statusCode === 400) {
            return ResponseHelper.badRequest(
                res,
                error.message
            );
        }

        if (error.statusCode === 409) {
            return ResponseHelper.conflict(
                res,
                error.message
            );
        }

        return ResponseHelper.error(
            res,
            "Error al confirmar el retiro",
            error
        );
    }
};