class ResponseHelper {

  // 200 OK
  static success(res, data, message = "Operación exitosa") {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  // 201 Created
  static created(res, data, message = "Recurso creado correctamente") {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  // 400 Bad Request
  static badRequest(res, message = "Petición inválida") {
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // 400 Validation Error
  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: "Error de validación en los datos ingresados",
      errors,
    });
  }

  // 401 Unauthorized
  static unauthorized(res, message = "No autorizado") {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  // 403 Forbidden
  static forbidden(res, message = "Acceso denegado") {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  // 404 Not Found
  static notFound(res, message = "Recurso no encontrado") {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  // 409 Conflict
  static conflict(res, message = "El recurso ya existe") {
    return res.status(409).json({
      success: false,
      message,
    });
  }

  // 500 Internal Server Error
  static error(res, message = "Error interno del servidor", error = null) {
    console.error("[Error del servidor]:", error || message);

    return res.status(500).json({
      success: false,
      message,
    });
  }
}

export default ResponseHelper;
