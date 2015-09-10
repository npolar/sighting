'use strict';

/**
 * @ngInject
 */
var Security = function(base64, jwtHelper, npolarApiConfig, NpolarApiUser) {

  this.authorization = function () {

    var user = NpolarApiUser.getUser();
   
    if ('basic' === npolarApiConfig.security.authorization) {
      return 'Basic '+ this.basicToken(user);
    } else if ('jwt' === npolarApiConfig.security.authorization) {
      return 'Bearer '+ user.jwt;
    } else {
      console.error('NpolarApiSecurity authorization not implemented: ' + npolarApiConfig.security.authorization);
      return '';
    }
  };

  this.basicToken = function(user) {
  return base64.encode(user.username + ':' + user.password);
  };

  this.decodeJwt = function(jwt) {
    return jwtHelper.decodeToken(jwt);
  };

  this.user = function() {
    return this.getUser();
  };

  this.getUser = function() {
    return NpolarApiUser.getUser();
  };

  this.setUser = function(user) {
    return NpolarApiUser.setUser(user);
  };

  this.removeUser = function() {
    return NpolarApiUser.removeUser();
  };
  
  this.isJwtExpired = function() {
    var jwt = this.getUser().jwt;
    return (jwt !== undefined) && ((Date.now() / 1000) > this.decodeJwt(jwt).exp );
  };
  
  this.isJwtValid = function() {
    return (false === this.isJwtExpired());
  };

};

module.exports = Security;