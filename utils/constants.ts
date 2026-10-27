// App constants and configuration

export const APP_CONFIG = {
  name: 'Stock Market App',
  version: '1.0.0',
  buildNumber: 1,
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  wsUrl: process.env.EXPO_PUBLIC_WS_URL || 'wss://ws.example.com',
};