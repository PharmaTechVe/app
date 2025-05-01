import { PHARMATECH_DEV_MODE, GOOGLE_MAPS_API_KEY } from '@env';

export const Config = {
  isDevelopment: PHARMATECH_DEV_MODE === 'true',
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
};
