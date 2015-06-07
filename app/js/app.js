/*jslint node: true */
'use strict';

var appSighting = angular.module('sighting',[
  'ngRoute',
  'sightingControllers',
  'sightingServices',    /*Edit service*/
  'leaflet-directive',   /*Map*/
  '720kb.datepicker',    /*Calendar*/
  'angular-jwt',       /* JWT interaction*/
  'ngResource',
  'base64',
  'npolarApi'   /*Logon NP style*/
]);



//Routing to the individual pages
//Open - open to all,
//User - with user login
//Admin - for administrators

appSighting.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/open/login.html',
        controller: 'SightingCtrl'
      }).
      when('/observe', {
        templateUrl: 'partials/open/become_observer.html',
        controller: 'SightingCtrl'
      }).
      when('/learn', {
        templateUrl: 'partials/open/species.html',
        controller: 'SightingCtrl'
      }).
      when('/observers', {
        templateUrl: 'partials/open/observers.html',
        controller: 'SightingCtrl'
      }).
  /*    when('/photos', {
        templateUrl: 'partials/open/photos.html',
        controller: 'PhotoCtrl'
      }).
      when('/stats', {
        templateUrl: 'partials/open/stats.html',
        controller: 'SightingCtrl'
      }).
      when('/maps', {
        templateUrl: 'partials/open/maps.html',
        controller: 'SightingCtrl'
      }).*/
      when('/observations', {
        templateUrl: 'partials/user/my_observations.html',
        controller: 'MyObservationsCtrl'
      }).
      when('/observation', {
        templateUrl: 'partials/user/new_observation.html',
        controller: 'NewObservationCtrl'
      }).
      when('/observation/:id', {
        templateUrl: 'partials/user/view_observation.html',
        controller: 'ViewObservationCtrl'
      }).
      when('/observation/edit/:id', {
        templateUrl: 'partials/user/edit_observation.html',
        controller: 'EditObservationCtrl'
      }).
      when('/observation/delete/:id', {
        templateUrl: 'partials/user/delete_observation.html',
        controller: 'DeleteObservationCtrl'
      }).
      when('/upload', {
        templateUrl: 'partials/user/upload.html',
        controller: 'UploadObservationsCtrl'
      }).
      when('/all', {
        templateUrl: 'partials/admin/all.html',
        controller: 'AdminObservationsCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

/*
var sightingResources = [
  {"path": "/user", "resource": "User"},
  {"path": "/sighting", "resource": "Sighting" }
];

angular.forEach(sightingResources, function(service) {
 appSighting.factory(service.resource, function(NpolarApiResource){
    return NpolarApiResource.resource(service);
  });
});

// Adds the token to the header of the http message
appSighting.config(function($httpProvider, npolarApiAuthInterceptorProvider) {
   $httpProvider.interceptors.push("npolarApiAuthInterceptor");
}); */


// Inject config and run
/* appSighting.run(function(npolarApiConfig, $http) {

  $http.get("./npolarApiConfig.json").success(function(config) {   */
      //console.log("npolarApiConfig", JSON.stringify(npolarApiConfig.json));

   /*  var environment = config.environment || npolarApiConfig.environment;
     angular.extend(npolarApiConfig, _.find(config.config, { environment: environment}));


  }).error(function(response) {
     console.log("error");
     console.log("npolarApiConfig", npolarApiConfig);
  });

}); */


