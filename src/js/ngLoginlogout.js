/*directive */

//Use the directive to show username/password html template and get response from the database server
var ngLoginlogout =  function() {
  'use strict';
   return {
   // templateUrl: '../bower_components/angular-npolar/html/_user.html'
     scope: {},
     controller: "NpolarApiEditController",
     templateUrl: 'node_modules/angular-npolar/html/_user.html',
     link: function(scope) {
        scope.user = {};
     }
  };
};

module.exports = ngLoginlogout;
