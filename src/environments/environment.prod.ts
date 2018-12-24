export const environment = {
  production: true,
  // apiEndpoint: 'https://gior-algamoney-api.herokuapp.com',
  // tokenWhitelistedDomains: ['gior-algamoney-api.herokuapp.com'],
  // tokenBlacklistedRoutes: ['https://gior-algamoney-api.herokuapp.com/oauth/token']

  apiEndpoint: 'http://localhost:8080',
  tokenWhitelistedDomains: ['localhost:8080'],
  tokenBlacklistedRoutes: ['http://localhost:8080/oauth/token']
};
