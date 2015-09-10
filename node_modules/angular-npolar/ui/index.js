'use strict';
var angular = require('angular');

var npolarUi = angular.module('npolarUi', []);
npolarUi.value('version', '0.1');

npolarUi.controller('NpolarLoginController', require('./auth/LoginController'));
npolarUi.directive('npolarLoginLogout', require('./auth/loginLogout'));

npolarUi.controller('NpolarMessageController', require('./message/MessageController'));
npolarUi.directive('npolarApiMessage', require('./message/message'));

module.exports = npolarUi;