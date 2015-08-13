/**
 * npolarApiConfig, meant to be .run and merged with overrides for the current environment
 *
 * angular.module('myApp').run(function(npolarApiConfig, $http) {
 *   $http.get('/npolar/config.json').success(function(config) {
 *
 *   var environment = config.environment || npolarApiConfig.environment;
 *   angular.extend(npolarApiConfig, _.find(config.config, { environment: environment}));
 *   console.log('npolarApiConfig', npolarApiConfig);
 *
 * }).error(function(response) {
 *   console.log('npolarApiConfig', npolarApiConfig);
 * });
 *
 * });
 *
 */
'use strict';

var config = {
  environment: 'production',
  lang: 'en',
  base: '//api.npolar.no',
  security: {
  authorization: 'jwt'
  },
  formula: {}
};

module.exports = config;
