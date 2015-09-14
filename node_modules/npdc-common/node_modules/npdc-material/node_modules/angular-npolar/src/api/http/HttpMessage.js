'use strict';

var angular = require('angular');
var EventEmitter = require('events').EventEmitter;

/**
 * @ngInject
 */
var HttpMessage = function() {
  
  this.getMessage = function(response, body) {
    
    let time = new Date(Date.now()).toJSON();
    
    if (response.body && response.body.time) {
      time = response.body.time;
    }
    
    if (0 === response.status) {
      body = { "error": { explanation: `Failed accessing Npolar API ${response.config.url}` } };
    }
    
    return { status: response.status,
      method: response.config.method,
      uri: response.config.url,
      headers: response.headers(),
      time: time,
      body: body
    };
    
  };
  
  return angular.extend(new EventEmitter(), this);

};

module.exports = HttpMessage;