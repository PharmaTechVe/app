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

      // La respuesta ahora es directamente un array de PaymentInfoResponse
      return response;
    } catch (error) {
      console.error('Error en PaymentInformationService.findAll:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
