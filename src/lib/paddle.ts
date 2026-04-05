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
    // Read all VITE_* environment variables for debugging
    const allEnv = Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'));
    console.log('[Paddle Debug] All VITE_* env vars:', allEnv);
    
    // Debug: Show current environment and token status    const env = import.meta.env.VITE_PADDLE_ENVIRONMENT || 'NOT_SET';
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    const basicPriceId = import.meta.env.VITE_PADDLE_BASIC_PRICE_ID || 'NOT_SET';
    const proPriceId = import.meta.env.VITE_PADDLE_PRO_PRICE_ID || 'NOT_SET';
    const clientTokenPreview = token ? `${token.substring(0, 5)}...${token.substring(-5)}` : 'none';

    console.log('[Paddle Debug] Environment:', env);
    console.log('[Paddle Debug] Basic Price ID:', basicPriceId);
    console.log('[Paddle Debug] Pro Price ID:', proPriceId);
    console.log('[Paddle Debug] Token loaded:', !!token);
    console.log('[Paddle Debug] Token preview:', clientTokenPreview);

    // Validate required configuration
    if (!token) {
      console.error('[Paddle] Client token not found. Please set VITE_PADDLE_CLIENT_TOKEN in your environment variables.');
      console.error('[Paddle Debug] Available env vars:', Object.keys(import.meta.env));
      return null;
    }

    // Initialize Paddle with proper configuration
    console.log('[Paddle Debug] Initializing Paddle with env:', env === 'production' ? 'production' : 'sandbox');
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
    console.error('[Paddle Debug] Error details:', error);
    return null;
  }
};