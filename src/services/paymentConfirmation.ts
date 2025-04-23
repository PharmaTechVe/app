import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import {
  PaymentConfirmation,
  PaymentConfirmationResponse,
} from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

export const PaymentConfirmationService = {
  create: async (
    paymentConfirmation: PaymentConfirmation,
  ): Promise<PaymentConfirmationResponse> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      console.log('Enviando confirmación de pago:', paymentConfirmation);

      // Validar el payload
      const requiredFields: (keyof PaymentConfirmation)[] = [
        'documentId',
        'phoneNumber',
        'bank',
        'reference',
      ];
      for (const field of requiredFields) {
        if (!paymentConfirmation[field]) {
          throw new Error(`El campo ${field} es obligatorio`);
        }
      }

      const response = await api.paymentConfirmation.create(
        paymentConfirmation,
        token,
      );

      if (!response?.id) {
        throw new Error(
          'La respuesta no contiene un ID de confirmación válido',
        );
      }

      console.log('Respuesta de confirmación de pago:', response);
      return response;
    } catch (error) {
      console.error('Error en PaymentConfirmationService.create:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
