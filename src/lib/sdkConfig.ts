import { PharmaTech } from '@pharmatech/sdk';
import { PHARMATECH_DEV_MODE } from '@env';

const isDevelopment = PHARMATECH_DEV_MODE === 'true';

// Instancia del SDK para solicitudes con Origin
export const apiWithOrigin = new PharmaTech(
  isDevelopment,
  isDevelopment
    ? 'http://localhost:3000' // Origin para desarrollo
    : 'https://tu-app.com', // Origin para producción
);

// Instancia del SDK para solicitudes sin Origin
export const apiWithoutOrigin = new PharmaTech(isDevelopment);
