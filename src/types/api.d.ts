export interface ApiError extends Error {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export type ServiceResponse<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };
