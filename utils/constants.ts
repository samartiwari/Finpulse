// App constants and configuration

export const APP_CONFIG = {
  name: 'Stock Market App',
  version: '1.0.0',
  buildNumber: 1,
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  wsUrl: process.env.EXPO_PUBLIC_WS_URL || 'wss://ws.example.com',
};

export const STORAGE_KEYS = {
  authToken: 'auth_token',
  refreshToken: 'refresh_token',
  user: 'user',
  theme: 'theme',
  currency: 'currency',
  biometric: 'biometric_enabled',
  notifications: 'notifications_enabled',
  onboarding: 'onboarding_completed',
} as const;
