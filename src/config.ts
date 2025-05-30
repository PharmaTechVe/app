export const Config = {
  isDevelopment: process.env.PHARMATECH_DEV_MODE === 'true',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
};

console.log('Variables de entorno disponibles:', process.env);
