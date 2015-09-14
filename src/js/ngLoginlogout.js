'use strict';
/*directive */

//Use the directive to show username/password html template and get response from the database server
// @ngInject
var ngLoginlogout =  function() {
   return {
   // templateUrl: '../bower_components/angular-npolar/html/_user.html'
     scope: {},
     controller: "NpolarApiEditController",
     templateUrl: 'node_modules/angular-npolar/html/_myuser.html',
     link: function(scope) {
        scope.user = {};
     }
  };
};

module.exports = ngLoginlogout;
