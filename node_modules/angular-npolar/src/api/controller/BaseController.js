/**
* NpolarBaseController is meant to be the parent of a safe controller,
* ie. a controller dealing with only with presentation, search, etc.
* See also NpolarEditController.
*
* Usage example: 
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
    $scope.security = NpolarApiSecurity;
  };

  // Show action, ie. fetch document and inject into scope
  $scope.show = function() {
    $scope.resource.fetch($routeParams, function(document) {
      $scope.document = document;
    });
  };
  
  // Search action, ie. fetch feed and inject into scope
  $scope.search = function(query) {
    $scope.resource.feed(query, function(response) {
      $scope.feed = response.feed;
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

  $scope.init();
};

module.exports = BaseController;