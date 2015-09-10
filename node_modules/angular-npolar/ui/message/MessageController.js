'use strict';

// @ngInject
var MessageController = function ($scope, $route, $http, $location, $rootScope, npolarApiConfig, NpolarApiUser, NpolarApiSecurity, NpolarApiMessage) {
  
  NpolarApiMessage.on("npolar-api-info", function(message) {
    console.log("<- npolar-api-info", message);
    $scope.info = message;
    $scope.error = null;
  });
    
  NpolarApiMessage.on("npolar-api-error", function(message) {
    console.log("<- npolar-api-error", message);
    $scope.info = null;
    $scope.error = message;
  });
  
};

module.exports = MessageController;