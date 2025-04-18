import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import {
  ServiceResponse,
  PaymentInformation,
  PaymentMethod,
} from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

export const PaymentInformationService = {
  findAll: async (
    paymentMethod?: PaymentMethod,
  ): Promise<ServiceResponse<PaymentInformation[]>> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        return {
          success: false,
          error: 'Token de autenticación no encontrado',
        };
      }

      const response = await api.paymentInformation.findAll({
        paymentMethod,
      });

      return { success: true, data: response.results };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
