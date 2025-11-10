export const environment = {
  production: false,
  name: 'development',
  apiUrl: 'https://localhost:7130/api',
  baseUrl: 'http://localhost:4200',
  jwtConfig: {
    tokenKey: 'ecom_access_token',
    refreshTokenKey: 'ecom_refresh_token',
    headerName: 'Authorization',
    authScheme: 'Bearer ',
    allowedDomains: ['localhost:7130'],
    disallowedRoutes: [
      'localhost:7130/api/Auth/login',
      'localhost:7130/api/Auth/register'
    ]
  },
  features: {
    enableLogging: true,
    enableAnalytics: true,
    enableServiceWorker: false,
    enableOfflineMode: false
  },
  cache: {
    maxAge: 30000, // 30 seconds for dev
    maxSize: 100
  },
  performance: {
    enablePreloading: true,
    preloadDelay: 2000
  }
};
