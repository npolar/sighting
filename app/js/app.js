/*jslint node: true */
'use strict';

var appSighting = angular.module('sighting',[
 /* 'ngRoute', */
  'routes',  /* application routes*/
  'sightingControllers',
  'sightingServices',    /*Edit service*/
  'leaflet-directive',   /*Map*/
  '720kb.datepicker',    /*Calendar*/
  'angular-jwt',       /* JWT interaction*/
  'ngResource',
  'formula',
  'npolarApi'   /*Logon NP style*/
]);



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

    //Set environment to file npolarApiConfig
    var environment = config.environment;

    angular.extend(npolarApiConfig, _.find(config.config, { environment: environment}));
//console.log("npolarApiConfig", npolarApiConfig);

  }).error(function(response) {
    console.error("npolarApiConfig -error", npolarApiConfig);
  });

});
