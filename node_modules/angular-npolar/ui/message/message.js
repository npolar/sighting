'use strict';

/**
 * @ngInject
 */
var message = function () {
  return {
   scope: {},
   controller: 'NpolarMessageController',
   templateUrl: 'angular-npolar/ui/message/_message.html'
   //link: function(scope) {
     //console.log("npolar-api-message link(scope)", scope);
   //}
  };
};

module.exports = message;