import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import {
  OrderDeliveryStatus,
  OrderDeliveryResponse,
  OrderDeliveryDetailedResponse,
  Pagination,
  OrderDeliveryPaginationRequest,
} from '@pharmatech/sdk';
import { extractErrorMessage } from '../utils/errorHandler';

export const DeliveryService = {
  /**
   * Listar órdenes asignadas al delivery.
   * @param employeeId - ID del motorizado (delivery).
   * @param status - Estado de las órdenes a filtrar (por defecto: 'ASSIGNED').
   * @returns Lista paginada de órdenes asignadas.
   */
  getAssignedOrders: async (
    employeeId: string,
    status: OrderDeliveryStatus = OrderDeliveryStatus.ASSIGNED,
  ): Promise<Pagination<OrderDeliveryResponse>> => {
    try {
      // Obtener el JWT del SecureStore
      const jwt = await SecureStore.getItemAsync('auth_token');
      if (!jwt) {
        throw new Error('Token de autenticación no encontrado');
      }

      // Llamar al método findAll con el JWT
      const response = await api.deliveryService.findAll(
        {
          employeeId,
          status,
          page: 1,
          limit: 10,
        } as OrderDeliveryPaginationRequest,
        jwt, // Pasar el JWT como segundo argumento
      );
      return response;
    } catch (error) {
      console.error('Error al obtener las órdenes asignadas:', error);
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Obtener detalles de una orden específica.
   * @param orderId - ID de la orden de delivery.
   * @returns Detalles completos de la orden.
   */
  getOrderDetails: async (
    orderId: string,
  ): Promise<OrderDeliveryDetailedResponse> => {
    try {
      // Obtener el JWT del SecureStore
      const jwt = await SecureStore.getItemAsync('auth_token');
      if (!jwt) {
        throw new Error('Token de autenticación no encontrado');
      }

      // Llamar al método getById con el JWT
      const response = await api.deliveryService.getById(orderId, jwt); // Pasar el JWT como segundo argumento
      return response;
    } catch (error) {
      console.error('Error al obtener los detalles de la orden:', error);
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Actualizar el estado de una orden de delivery.
   * @param orderId - ID de la orden de delivery.
   * @param status - Nuevo estado de la orden.
   * @returns Respuesta actualizada de la orden.
   */
  updateOrderStatus: async (
    orderId: string,
    status: OrderDeliveryStatus,
  ): Promise<OrderDeliveryResponse> => {
    try {
      // Obtener el JWT del SecureStore
      const jwt = await SecureStore.getItemAsync('auth_token');
      if (!jwt) {
        throw new Error('Token de autenticación no encontrado');
      }

      // Llamar al método update del SDK con el JWT
      const response = await api.deliveryService.update(
        orderId,
        { deliveryStatus: status },
        jwt,
      );
      return response;
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
