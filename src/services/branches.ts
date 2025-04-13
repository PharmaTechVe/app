import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/sdkConfig';
import { ServiceResponse, Pagination, BranchResponse } from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

type FindAllParams = {
  page?: number;
  limit?: number;
  q?: string;
  stateId?: string;
};

export const BranchService = {
  findAll: async ({
    page = 1,
    limit = 100,
    q,
    stateId,
  }: FindAllParams): Promise<ServiceResponse<Pagination<BranchResponse>>> => {
    try {
      // Obtener token JWT desde SecureStore
      const jwt = await SecureStore.getItemAsync('auth_token');
      if (!jwt) {
        return {
          success: false,
          error: 'No se encontró el token de autenticación.',
        };
      }

      // Llamar a la API usando los parámetros recibidos
      const response = await api.branch.findAll(
        { page, limit, q, stateId },
        jwt,
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
