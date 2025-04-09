import { isAPIError, APIError } from '@pharmatech/sdk';

/**
 * Verifica si el error es del tipo APIError proporcionado por el SDK.
 */
export const isApiError = (error: unknown): error is APIError => {
  return isAPIError(error); // Usa el método del SDK directamente
};

/**
 * Extrae un mensaje de error legible para el usuario.
 */
export const extractErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    // Si es un APIError, toma el primer mensaje de la lista
    return error.messages[0] || 'Ocurrió un error desconocido en el servidor.';
  }

  if (error instanceof Error) {
    // Si es un error genérico de JavaScript
    return error.message;
  }

  // Si no se puede identificar el error
  return 'Ocurrió un error desconocido.';
};
