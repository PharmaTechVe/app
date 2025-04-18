import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import { ServiceResponse, CreateOrder, OrderResponse } from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

export const OrderService = {
  create: async (
    order: CreateOrder,
  ): Promise<ServiceResponse<OrderResponse>> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        console.warn('Auth token not found in SecureStore');
        return {
          success: false,
          error: 'Token de autenticación no encontrado',
        };
      }

      console.log('Sending order creation request:', order);
      const response = await api.order.create(order, token);

      if (!response?.id) {
        // Use the corrected property name
        console.error('Order creation response missing id:', response);
        return {
          success: false,
          error: 'La respuesta no contiene un ID de orden válido',
        };
      }

      console.log('Order creation response:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error in OrderService.create:', error);
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
