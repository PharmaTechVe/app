const devModeFlag = process.env.PHARMATECH_DEV_MODE === 'true';

const devUrl = 'https://api-dev-8jfx.onrender.com';
const prodUrl = 'https://api-d8h5.onrender.com';

export const SOCKET_URL = devModeFlag ? devUrl : prodUrl;
