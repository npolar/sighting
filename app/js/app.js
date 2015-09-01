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
/* 'utf8-base64', */
  'formula',
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
        controller: 'SightingCtrl',
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
      /*This entry is for copying old info onto new entries */
      when('/observation/copy/:id', {
        templateUrl: 'partials/user/new_observation.html',
        controller: 'NewObservationCtrl'
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
      when('/csv', {
        templateUrl: 'partials/admin/csv.html',
        controller: 'CSVCtrl'
      }).
       when('/quality_check', {
        templateUrl: 'partials/admin/quality_check.html',
        controller: 'QualityCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


var sightingResources = [
  {"path": "/user", "resource": "User"},
  {"path": "/sighting", "resource": "Sighting" }
];

angular.forEach(sightingResources, function(service) {
 appSighting.factory(service.resource, function(NpolarApiResource){
    return NpolarApiResource.resource(service);
  });
});



 // Auth interceptor -add to HTTP header
appSighting.config(function($httpProvider, npolarApiAuthInterceptorProvider) {
   $httpProvider.interceptors.push("npolarApiAuthInterceptor");
});



// Inject config and run
appSighting.run(function(npolarApiConfig, $http, npolarApiSecurity, npolarApiUser) {

  $http.get("./npolarApiConfig.json").success(function(config) {

    var environment = config.environment || npolarApiConfig.environment;
    angular.extend(npolarApiConfig, _.find(config.config, { environment: environment}));
console.log("npolarApiConfig", npolarApiConfig);

  }).error(function(response) {
    console.error("npolarApiConfig -error", npolarApiConfig);
  });

});
