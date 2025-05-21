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

      // Call the API method
      const response = await api.paymentInformation.findAll(paymentMethod);

      // Ensure the response is an array
      return Array.isArray(response) ? response : [response];
    } catch (error) {
      console.error('Error en PaymentInformationService.findAll:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
