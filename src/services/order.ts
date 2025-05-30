import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import { CreateOrder, OrderResponse } from '@pharmatech/sdk';
import { extractErrorMessage } from '../utils/errorHandler';

export const OrderService = {
  create: async (order: CreateOrder): Promise<OrderResponse> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      console.log('Enviando solicitud de creación de orden:', order);

      const response = await api.order.create(order, token);

      if (!response?.id) {
        throw new Error('La respuesta no contiene un ID de orden válido');
      }

      console.log('Respuesta de creación de orden:', response);
      return response;
    } catch (error) {
      console.error('Error en OrderService.create:', error);
      throw new Error(extractErrorMessage(error));
    }
  },

  getById: async (orderId: string) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }
      const orderDetail = await api.order.getById(orderId, token);
      return orderDetail;
    } catch (error) {
      console.error('Error en OrderService.getById:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
