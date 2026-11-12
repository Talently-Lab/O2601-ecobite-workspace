import ResponseHelper from "../utils/responseHelper.js";

export const validateSchema = (schema) => {
  return (req, res, next) => {

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return ResponseHelper.validationError(res, errors);
    }

    // Utilizamos los datos ya validados por Joi
    req.body = value;

    next();
  };
};
