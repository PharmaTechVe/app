import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import {
  ServiceResponse,
  PaymentConfirmation,
  PaymentConfirmationResponse,
} from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

export const PaymentConfirmationService = {
  create: async (
    paymentConfirmation: PaymentConfirmation,
  ): Promise<ServiceResponse<PaymentConfirmationResponse>> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        console.warn('Auth token not found in SecureStore');
        return {
          success: false,
          error: 'Token de autenticación no encontrado',
        };
      }

      console.log('Sending payment confirmation request:', paymentConfirmation);

      // Validate paymentConfirmation
      if (
        !paymentConfirmation.documentId ||
        !paymentConfirmation.phoneNumber ||
        !paymentConfirmation.bank ||
        !paymentConfirmation.reference
      ) {
        console.error(
          'Invalid payment confirmation payload:',
          paymentConfirmation,
        );
        return {
          success: false,
          error: 'Datos de confirmación de pago inválidos',
        };
      }

      const response = await api.paymentConfirmation.create(
        paymentConfirmation,
        token,
      );

      // Adjust validation based on actual response structure
      if (!response || !response.id) {
        console.error(
          'Payment confirmation failed: Missing ID in response',
          response,
        );
        return {
          success: false,
          error:
            'Error en la confirmación del pago: Falta el ID en la respuesta',
        };
      }

      console.log('Payment confirmation response:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error in PaymentConfirmationService.create:', error);
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
