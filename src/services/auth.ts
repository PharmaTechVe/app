import { api } from '../lib/sdkConfig';
import * as SecureStore from 'expo-secure-store';
import { ServiceResponse } from '../types/api';
import { validateEmail } from '../utils/validators';
import { extractErrorMessage } from '../utils/errorHandler';

export const AuthService = {
  login: async (email: string, password: string): Promise<ServiceResponse> => {
    try {
      if (!validateEmail(email)) {
        return { success: false, error: 'Correo electrónico inválido' };
      }

      const { accessToken } = await api.auth.login({
        email: email.trim(),
        password: password.trim(),
      });

      await SecureStore.setItemAsync('auth_token', accessToken);
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
