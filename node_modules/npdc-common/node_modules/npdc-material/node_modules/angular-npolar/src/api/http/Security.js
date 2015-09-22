'use strict';

/**
 * @ngInject
 */
var Security = function($log, base64, jwtHelper, npolarApiConfig, NpolarApiUser) {
  
  this.actions = ['create', 'read', 'update', 'delete'];

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

  this.getUser = function() {
    try {
      return NpolarApiUser.getUser();
    } catch (e) {
      return {};
    }
 };
  
  this.getJwt = function() {
    return this.getUser().jwt;
  };
  
  this.isAuthenticated = function() {
    return this.isJwtValid();
  };
  
  // Is user authenticated and authorized to perform action on current URI?
  // @var action ["create" | "read" | "update" | "delete"] => this.actions
  this.isAuthorized = function(action, uri) {
    
    if (false === this.actions.includes(action)) {
      $log.error(`isAuthorized(${action}, ${uri}) called with invalid action`);
      return false;
    }
    
    // @todo support relative URIs
    // @todo support just ngResource or NpolarApiResurce => get path from that
    // @todo fallback to application path?
    
    if (uri === undefined || false === (/\/\//).test(uri)) {
      $log.error(`isAuthorized(${action}, ${uri}) called with invalid URI`);
      return false;
    }
    
    if (uri instanceof String && (/^\/[^/]/).test(uri)) {
    //  uri = npolarApiConfig.base + uri;
      console.log(uri);
    }    
    uri = uri.split('//')[1];
    
    // 1. First, verify login
    if (false === this.isAuthenticated()) {
      return false;
    }
    
    // 2. Find all systems URIs matching current URI or *
    let systems = this.getUser().systems.filter(
      system => {
        
        system.uri = system.uri.split('//')[1];
        
        if (system.uri === uri) {
          return true;   
        } else if (system.uri === npolarApiConfig.base.split('//')[1]+"/*") {
          return true;
        } else {
          return false;
        }
      }
    );

    // 3. Does any matching system include the right to perform action?
    systems = systems.filter(
      system => {
        return system.rights.includes(action);
      }
    );
    
     // User is authorized if we are left with at least 1 system
    let isAuthorized = (systems.length > 0);
    //console.log(`isAuthorized(${action}, ${uri})`, isAuthorized);
    return isAuthorized;
  };
  
  this.isJwtExpired = function() {
    let jwt = this.getJwt();
    if (jwt === undefined || jwt === null || !angular.isString(jwt)) {
      return true;
    }
    let now = (Date.now() / 1000);
    
    try {  
      return ((Date.now() / 1000) > this.decodeJwt(jwt).exp );
    } catch (e) {
      return true;
    }
  };
  
  this.isJwtValid = function() {
    return (false === this.isJwtExpired());
  };
  
  this.notAuthenticated = () => { return !this.isAuthenticated(); };
  
  this.removeUser = function() {
    return NpolarApiUser.removeUser();
  };

  this.user = function() {
    return this.getUser();
  };
  
  this.setUser = function(user) {
    return NpolarApiUser.setUser(user);
  };

};

module.exports = Security;