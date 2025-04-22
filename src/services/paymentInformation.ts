import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import { PaymentInformation, PaymentMethod } from '@pharmatech/sdk';
import { extractErrorMessage } from '../utils/errorHandler';

export const PaymentInformationService = {
  findAll: async (
    paymentMethod?: PaymentMethod,
  ): Promise<PaymentInformation[]> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await api.paymentInformation.findAll({
        paymentMethod,
      });

      return response.results;
    } catch (error) {
      console.error('Error en PaymentInformationService.findAll:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
