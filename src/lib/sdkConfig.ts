import { PharmaTech } from '@pharmatech/sdk';
import * as SecureStore from 'expo-secure-store';
import { PHARMATECH_DEV_MODE } from '@env';
import { AxiosRequestConfig } from 'axios'; // Importa el tipo AxiosRequestConfig

const isDevelopment = PHARMATECH_DEV_MODE === 'true';

export const api = new PharmaTech(
  isDevelopment,
  isDevelopment
    ? 'http://localhost:3000' // Origin para desarrollo
    : 'https://pharmatech.site', // Origin para producción
);

// Configurar un interceptor para manejar dinámicamente el JWT
api.client['client'].interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    // Si ya se pasa un jwt explícitamente, no agregar el auth_token
    if (config.headers?.Authorization) {
      return config;
    }

    // Obtener el auth_token de SecureStore
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      if (config.headers) {
        delete config.headers['Authorization'];
      }
    }
    return config;
  },
);
