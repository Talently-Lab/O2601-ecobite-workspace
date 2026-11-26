import { createOrder } from "./order.service.js";
import ResponseHelper from "../../utils/responseHelper.js";

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