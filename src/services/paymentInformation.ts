import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import { PaymentInfoResponse, PaymentMethod } from '@pharmatech/sdk';
import { extractErrorMessage } from '../utils/errorHandler';

export const PaymentInformationService = {
  findAll: async (
    paymentMethod?: PaymentMethod,
  ): Promise<PaymentInfoResponse[]> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      // Llamar al método findAll con el argumento directamente
      const response = await api.paymentInformation.findAll(paymentMethod);

      // Devolver la respuesta directamente (se asume que ya es un array)
      return response;
    } catch (error) {
      console.error('Error en PaymentInformationService.findAll:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
