import { initializePaddle, Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | null = null;

/**
 * Initializes the Paddle SDK with proper configuration.
 * @returns {Promise<Paddle | null>} Initialized Paddle instance or null if failed.
 */
export const getPaddleInstance = async (): Promise<Paddle | null> => {
  if (paddleInstance) {
    return paddleInstance;
  }

  try {
    const env = import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox';
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    
    // Debug logging for developers
    console.log('[Paddle] Initializing in', env, 'mode');

    if (!token) {
      console.warn('[Paddle] Missing VITE_PADDLE_CLIENT_TOKEN. Credit card payments will not work.');
      return null;
    }

    paddleInstance = await initializePaddle({
      environment: env === 'production' ? 'production' : 'sandbox',
      token: token,
      eventCallback: (data) => {
        console.log('[Paddle Event]', data);
      },
    });

    console.log('[Paddle] SDK Initialized successfully');
    return paddleInstance;
  } catch (error) {
    console.error('[Paddle] SDK Initialization failed:', error);
    return null;
  }
};