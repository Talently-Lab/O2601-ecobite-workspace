import ResponseHelper from "../utils/responseHelper.js";

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return ResponseHelper.unauthorized(
                res,
                "Usuario no autenticado"
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return ResponseHelper.forbidden(
                res,
                "No tenés permisos para acceder"
            );
        }

        next();
    };
};
