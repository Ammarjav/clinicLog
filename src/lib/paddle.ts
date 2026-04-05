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
    // Debug: Show current environment and token status    const env = import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox';
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    const clientTokenPreview = token ? token.substring(0, 10) + '...' : 'none';

    console.log('[Paddle Debug] Environment:', env);
    console.log('[Paddle Debug] Token loaded:', !!token);
    console.log('[Paddle Debug] Token preview:', clientTokenPreview);

    // Validate required configuration
    if (!token) {
      console.error('[Paddle] Client token not found. Please set VITE_PADDLE_CLIENT_TOKEN in your environment variables.');
      return null;
    }

    // Initialize Paddle with proper configuration
    paddleInstance = await initializePaddle({
      environment: env === 'production' ? 'production' : 'sandbox',
      token,
      eventCallback: (data) => {
        console.log('[Paddle Event]', data);
      },
    });

    console.log('[Paddle] Initialization successful');
    return paddleInstance;
  } catch (error) {
    console.error('[Paddle] Initialization failed:', error);
    return null;
  }
};