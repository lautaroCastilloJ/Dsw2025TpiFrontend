/**
 * Manejo centralizado de errores del backend
 * El backend envía errores con este formato:
 * {
 *   "code": "PRODUCT_ALREADY_EXISTS",
 *   "message": "Ya existe un producto con InternalCode 'INT-2005'.",
 *   "status": 400,
 *   "traceId": "0HNHC01EFPDIP:00000009"
 * }
 */

/**
 * Extrae el mensaje de error de una respuesta del backend
 * @param {object} error - Objeto de error de Axios
 * @returns {string} Mensaje de error del backend o mensaje genérico
 */
export const handleApiError = (error) => {
  // Si el backend envía un mensaje directo (nuestro formato personalizado)
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Si el backend envía un código de error sin mensaje
  if (error?.response?.data?.code) {
    return `Error: ${error.response.data.code}`;
  }
  
  // Errores de red o conexión
  if (!error?.response) {
    return 'Error de conexión. Por favor verifica tu conexión a internet.';
  }
  
  // Errores HTTP estándar sin mensaje personalizado
  switch (error?.response?.status) {
    case 400:
      return 'Solicitud inválida. Verifica los datos enviados.';
    case 401:
      return 'No autorizado. Por favor inicia sesión nuevamente.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'Recurso no encontrado.';
    case 500:
      return 'Error interno del servidor. Intenta nuevamente más tarde.';
    default:
      return 'Ha ocurrido un error inesperado.';
  }
};

/**
 * Obtiene información completa del error para debugging
 * @param {object} error - Objeto de error de Axios
 * @returns {object} Información del error
 */
export const getErrorDetails = (error) => {
  return {
    code: error?.response?.data?.code || null,
    message: error?.response?.data?.message || null,
    status: error?.response?.status || null,
    traceId: error?.response?.data?.traceId || null,
  };
};
