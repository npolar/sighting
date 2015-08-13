/**
* NpolarBaseController is meant to be the parent of a safe Controller,
* ie. a controller dealing with only with presentation. See also NpolarEditController.
*
*
* Usage:
*
* angular.module('myApp').controller('MyApiController', function($scope, $routeParams, $controller, MyModel) {
*
* // 1. MyApiController -> NpolarBaseController
* $controller('NpolarBaseController', {$scope: $scope});
*
* // 2. Set resource for parent document operations
* $scope.resource = MyModel;
*
* // 3. Set document for resource (and view)
* MyModel.fetch($routeParams, function(document) {
*   $scope.document = document;
* }, function() error {
*   $scope.error = error;
* });
*
*/

'use strict';
var _ = require('lodash');

/**
 * @ngInject
 */
var BaseController = function($scope, $location, $route, $routeParams, $window, $controller, $http,
  npolarApiConfig, NpolarApiSecurity, NpolarApiUser, NpolarApiResource) {

  $scope.init = function() {
    $scope.base = npolarApiConfig.base;
    $scope.environment = npolarApiConfig.environment;
    $scope.lang = npolarApiConfig.lang;
    $scope.user = NpolarApiSecurity.getUser();
  };

  // back() click handler
  $scope.back = function() {
    $window.history.back();
  };
 
  $scope.isAuthenticated = function() {
    return (NpolarApiSecurity.isJwtValid());
  };
    
  $scope.locationBase = function() {
    console.log($routeParams.id);
    if ($routeParams.id === '__new') {
      $location.path('/');
    } else {
      $location.path($routeParams.id);
    }
  };

  // Show action, ie. fetch document and inject into scope
  $scope.show = function() {
    $scope.resource.fetch($routeParams, function(document) {
      $scope.document = document;

    }, function(error) {
      $scope.error = NpolarApiResource.error(error);
    });
  };

  $scope.search = function(query) {
    $scope.resource.feed(query, function(response) {
      $scope.feed = response.feed;
    }, function(error) {
      $scope.error = NpolarApiResource.error(error);
    });
  };

  $scope.getLang = function() {
    return $scope.lang;
  };

  $scope.setLang = function(lang) {
    $scope.lang = lang;
    $scope.title = $scope.getTitle(lang);
  };

  $scope.getTitle = function(lang) {
    return _.where($scope.document.titles,
      { lang: lang }
    )[0].text || $scope.document.titles[0].text;
  };

  $scope.isSuccess = function(status) {
    return (status >= 200 && status <= 299);
  };

  $scope.isError = function(status) {
    return (status <= 99 || status >= 400);
  };

  $scope.init();
};

module.exports = BaseController;