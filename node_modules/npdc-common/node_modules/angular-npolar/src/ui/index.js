'use strict';
var angular = require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material');
require('angular-route');

var npolarUi = angular.module('npolarUi', ['ngMaterial', 'ngRoute']);
npolarUi.value('version', '0.1');

npolarUi.controller('NpolarLoginController', require('./auth/LoginController'));
npolarUi.directive('npolarLoginLogout', require('./auth/loginLogout'));

npolarUi.controller('NpolarMessageController', require('./message/MessageController'));
npolarUi.directive('npolarApiMessage', require('./message/message'));

npolarUi.controller('ToastCtrl', function($scope, $mdToast, message, explanation) {

  $scope.message = message;
  $scope.explanation = explanation;

  $scope.closeToast = function() {
    $mdToast.hide();
  };
});

module.exports = npolarUi;
