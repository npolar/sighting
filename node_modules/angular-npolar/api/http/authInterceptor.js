/**
* Authorization interceptor, adds JWT Bearer token to Npolar API requests
*
* Usage:
* myApp.config(function($httpProvider) {
*  $httpProvider.interceptors.push('npolarApiAuthInterceptor');
* });
*
*/
'use strict';

/**
 * @ngInject
 */
var authInterceptor = function ($rootScope, $q, $window, npolarApiConfig, NpolarApiSecurity) {
  return {
    request: function (config) {
      
      // Only intercept Npolar API requests
      if (config.url !== undefined && config.url.indexOf(npolarApiConfig.base) === 0 || config.url.indexOf("https:"+npolarApiConfig.base) === 0) {
        config.headers = config.headers || {};
        
        if (!config.headers.Authorization) {
          config.headers.Authorization = NpolarApiSecurity.authorization();
        }
        console.log(config.method +' '+ config.url, config.params||{}, '[npolarApi]');
        if ('PUT' === config.method) {
          $rootScope.saving = true;
        } else if ('DELETE' === config.method) {
          $rootScope.deleting = true;
        }
      }
      return config;
    },
    response: function (response) {

      if (response.status >= 300 || response.status < 100) {
        console.error(response.status +' '+ response.statusText + ' <- '+ response.config.method +' '+ response.config.url + ' [npolarApi]');
      }
      if (response.config.method !== 'GET') {
        console.log(response.status +' '+ response.statusText + ' <- '+ response.config.method +' '+ response.config.url + ' [npolarApi]');
      }
      if ('PUT' === response.config.method) {
        $rootScope.saving = false;
      } else if ('DELETE' === response.config.method) {
        $rootScope.deleting = false;
      }
      return response || $q.when(response);
    }
  };
};

module.exports = authInterceptor;
