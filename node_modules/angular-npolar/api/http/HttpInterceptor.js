/**
* Npolar API HTTP interceptor:
* - adds JWT (Bearer token) in the Authorization header
* - emits Npolar API informational imessages
* - emits Npolar API errors
* Usage:
* myApp.config(function($httpProvider) {
*  $httpProvider.interceptors.push('npolarApiInterceptor');
* });
*
*/

'use strict';

/**
 * @ngInject
 */
var HttpInterceptor = function ($q, $rootScope, npolarApiConfig, NpolarApiMessage, NpolarApiSecurity) {

  var message = NpolarApiMessage;
  
  var isNpolarApiRequest = function(config) {
    if (config.url !== undefined || false === (/\/\//).test(config.url)) {
      return false;
    }
    return (config.url.split("//")[1].indexOf(npolarApiConfig.base.split("//")[1]) === 0);
  };
  
  var isNpolarApiResponse = function(response) {
    if (0 === response.status) {
      return true;
    }
    return (isJSON(response.headers('Content-Type')) && isNpolarApiRequest(response.config));
  };
  
  var isJSON = function(content_type) {
    return (/^application\/(vnd\.\w+\+)?json/.test(content_type));
  };

  return {
    
    request: function (config) {
      
      // Only intercept Npolar API requests
      if (isNpolarApiRequest(config)) {
        config.headers = config.headers || {};
        
        if (!config.headers.Authorization) {
          config.headers.Authorization = NpolarApiSecurity.authorization();
        }
        if ('PUT' === config.method || 'POST' === config.method) {
          $rootScope.saving = true;
        } else if ('DELETE' === config.method) {
          $rootScope.deleting = true;
        }

      }
      return config;
    },
    
    response: function (response) {
      // Only intercept non-GET Npolar API responses
      if (response.config.method !== "GET" && isNpolarApiResponse(response)) {
        message.emit("npolar-api-info", message.getMessage(response));
      }
      if ('PUT' === response.config.method || 'POST' === response.config.method) {
        $rootScope.saving = false;
      } else if ('DELETE' === response.config.method) {
        $rootScope.deleting = false;
      }
      return response || $q.when(response);
    },
    
    requestError: function(response) {       
      message.emit("npolar-api-error", message.getMessage(response, { error: { explanation: "Request failed" } }));
      return $q.reject(response);
    },
    
    responseError: function(response) {
      if (isNpolarApiResponse(response)) {
        message.emit("npolar-api-error", message.getMessage(response, response.data));
      }
      return $q.reject(response);
    }
    
  };
};

module.exports = HttpInterceptor;