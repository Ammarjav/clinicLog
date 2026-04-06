import { initializePaddle, Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | null = null;

export const getPaddleInstance = async (): Promise<Paddle | null> => {
  if (!paddleInstance) {
    try {
      const env = import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox';
      const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
      
      if (!token) {
        console.warn('[Paddle] Client token not found. Please set VITE_PADDLE_CLIENT_TOKEN in your .env file.');
        return null;
      }

      paddleInstance = await initializePaddle({
        environment: env === 'production' ? 'production' : 'sandbox',
        token,
        eventCallback: (data) => {
          console.log('[Paddle] Event:', data);
        },
      });
    } catch (error) {
      console.error('[Paddle] Initialization failed:', error);
    }
  }
  return paddleInstance;
};