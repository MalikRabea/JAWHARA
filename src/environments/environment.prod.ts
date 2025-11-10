export const environment = {
  production: true,
  name: 'production',
  apiUrl: 'https://localhost:7130/api',
  baseUrl: 'https://localhost:7130',
  jwtConfig: {
    tokenKey: 'ecom_access_token',
    refreshTokenKey: 'ecom_refresh_token',
    headerName: 'Authorization',
    authScheme: 'Bearer ',
    allowedDomains: ['api.yourdomain.com'],
    disallowedRoutes: [
      'api.yourdomain.com/api/auth/login',
      'api.yourdomain.com/api/auth/register',
    ],
  },
  features: {
    enableLogging: false,
    enableAnalytics: true,
    enableServiceWorker: true,
    enableOfflineMode: true,
  },
  cache: {
    maxAge: 300000, // 5 minutes for prod
    maxSize: 500,
  },
  performance: {
    enablePreloading: true,
    preloadDelay: 1000,
  },
};
