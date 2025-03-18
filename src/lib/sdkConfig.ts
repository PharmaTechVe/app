import { PharmaTech } from '@pharmatech/sdk';
import { PHARMATECH_DEV_MODE } from '@env';

const isDevelopment = PHARMATECH_DEV_MODE === 'true';

export const api = new PharmaTech(isDevelopment);
