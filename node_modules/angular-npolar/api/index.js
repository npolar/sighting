'use strict';
var angular = require('angular');

// angular modules
//window.angular = angular;
require('angular-resource');
require('angular-utf8-base64');
require('angular-jwt');

/**
 * npolarApi: Angular 1.x module for the [Npolar API](http://api.npolar.no/)
 */
var npolarApi = angular.module('npolarApi', ['ngResource', 'utf8-base64', 'angular-jwt']);
npolarApi.value('npolarApiConfig', require('./config'));
npolarApi.service('NpolarApiUser', require('./session/User'));
npolarApi.service('NpolarApiSecurity', require('./http/Security'));
npolarApi.service('NpolarApiResource', require('./http/Resource'));
npolarApi.factory('npolarApiAuthInterceptor', require('./http/authInterceptor'));
npolarApi.service('NpolarApiText', require('./util/Text'));
npolarApi.directive('npolarJsonText', require('./util/jsonText'));

npolarApi.controller('NpolarBaseController', require('./controller/BaseController'));
npolarApi.controller('NpolarEditController', require('./controller/EditController'));

module.exports = npolarApi;
