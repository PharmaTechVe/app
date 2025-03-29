import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/sdkConfig';
import { ServiceResponse, ProfileResponse } from '../types/api.d';
import { extractErrorMessage } from '../utils/errorHandler';

export const UserService = {
  getProfile: async (
    userId: string,
  ): Promise<ServiceResponse<ProfileResponse>> => {
    try {
      // Obtén el token JWT desde SecureStore
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Realiza la solicitud manualmente con el encabezado Authorization
      const response = await api.user['client'].get({
        url: `/user/${userId}`, // Ajusta la URL según el endpoint real
        jwt: token, // El token se pasa como parte de la configuración
      });

      console.log('Profile Data:', response); // Verificar los datos del perfil
      return { success: true, data: response as ProfileResponse };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: extractErrorMessage(error),
      };
    }
  },
};
