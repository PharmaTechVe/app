const devModeFlag = process.env.PHARMATECH_DEV_MODE === 'true';
const devUrl = 'ws://api-dev-8jfx.onrender.com';
const prodUrl = 'ws://api-d8h5.onrender.com';

export const SOCKET_URL = devModeFlag ? devUrl : prodUrl;
