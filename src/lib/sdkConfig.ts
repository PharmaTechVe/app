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
