// FIXME This service is misnamed and will probably die (it's just a thin session storage wrapper)
'use strict';
var angular = require('angular');

/**
 * @ngInject
 */
var User = function(base64, npolarApiConfig) {

  this.getUser = function() {
    var user = sessionStorage.getItem(this.getStorageKey());
    if (angular.isString(user)) {
      return JSON.parse(base64.decode(user));
    } else {
      return {};
    }
  };

  this.setUser = function(user) {
  var key = this.getStorageKey(user);
    sessionStorage.setItem(key, base64.encode(JSON.stringify(user)));
  };

  this.removeUser = function() {
    sessionStorage.removeItem(this.getStorageKey());
  };

  this.getStorageKey = function() {
    return 'NpolarApiUser-'+npolarApiConfig.base.split("//")[1];
  };

};

module.exports = User;
