import { PharmaTech } from '@pharmatech/sdk';
import { PHARMATECH_DEV_MODE } from '@env';

const isDevelopment = PHARMATECH_DEV_MODE === 'true';

// Instancia del SDK para solicitudes con Origin
export const api = new PharmaTech(
  isDevelopment,
  isDevelopment
    ? 'http://localhost:3000' // Origin para desarrollo
    : 'https://pharmatech.site', // Origin para producción
);
