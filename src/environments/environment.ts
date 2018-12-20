export const environment = {
  production: false,
  apiEndpoint: 'http://localhost:8080',
  tokenWhitelistedDomains: ['localhost:8080'],
  tokenBlacklistedRoutes: ['http://localhost:8080/oauth/token']
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
