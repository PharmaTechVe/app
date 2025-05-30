import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/sdkConfig';
import { CouponResponse } from '@pharmatech/sdk';
import { extractErrorMessage } from '../utils/errorHandler';

export const CouponService = {
  validateCoupon: async (code: string): Promise<CouponResponse> => {
    try {
      const jwt = await SecureStore.getItemAsync('auth_token');
      if (!jwt) {
        throw new Error('No se encontró el token de autenticación.');
      }

      const response = await api.coupon.getByCode(code, jwt);
      return response;
    } catch (error) {
      console.error('Error en CouponService.validateCoupon:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
};
