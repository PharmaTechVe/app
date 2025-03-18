import type { ApiError } from '../types/api';

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof Error && 'response' in error;
};

export const extractErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.response?.data?.detail || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Error desconocido';
};
