import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/sdkConfig';
import { NotificationResponse } from '@pharmatech/sdk';
import { ServiceResponse } from '../types/api';
import { extractErrorMessage } from '../utils/errorHandler';

export const NotificationService = {
  getNotifications: async (): Promise<
    ServiceResponse<NotificationResponse>
  > => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const notifications = await api.notification.getNotifications(token);

      return { success: true, data: notifications };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
  markAsRead: async (orderId: string): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      await api.notification.markAsRead(orderId, token);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
