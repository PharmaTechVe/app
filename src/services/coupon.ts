import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/sdkConfig';
import { ServiceResponse, CouponResponse } from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

export const CouponService = {
  validateCoupon: async (
    code: string,
  ): Promise<ServiceResponse<CouponResponse>> => {
    try {
      // Retrieve the JWT token from SecureStore
      const jwt = await SecureStore.getItemAsync('auth_token');
      if (!jwt) {
        return {
          success: false,
          error: 'No se encontró el token de autenticación.',
        };
      }

      // Call the SDK's getByCode method
      const response = await api.coupon.getByCode(code, jwt);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: extractErrorMessage(error) };
    }
  },
};
