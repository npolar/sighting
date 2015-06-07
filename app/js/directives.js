'use strict';

/* Directives */

sightingControllers.directive('fileInput', ['$parse', function($parse){
      return {
        restrict:'A',
    link:function(scope,elm,attrs){
          elm.bind('change', function(){
        $parse(attrs, fileInput).assign(scope,elm[0].files);
      scope.$apply();
      console.log("directive");
      console.log(scope);
     })
    }
  }
}]);


//Use the directive to show username/password html template and get response from the database server
sightingControllers.directive('ngLoginlogout', function() {
   return {
   // templateUrl: '../bower_components/angular-npolar/html/_user.html'
     scope: {},
     controller: "NpolarApiEditController",
     templateUrl: '../bower_components/angular-npolar/html/_user.html',
     link: function(scope) {
        scope.user = {};
     }
  }
});
