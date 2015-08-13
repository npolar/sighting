'use strict';

/**
 * @ngInject
 */
var loginLogout = function (NpolarApiSecurity) {
  return {
   scope: {},
   controller: 'NpolarLoginController',
   templateUrl: 'angular-npolar/ui/auth/_user.html',
   link: function(scope) {
      scope.user = NpolarApiSecurity.getUser();
   }
  };
};

module.exports = loginLogout;
