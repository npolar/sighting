/*jslint node: true */
'use strict';

var angular = require('angular');
require('angular-route');
require('angular-resource');
var L = require('leaflet');
require('leaflet-draw');
/*require('angular-leaflet-directive');*/
/*require('angularjs-datepicker');*/
require('elasticsearch');
require('formula');
require('angular-npolar');

var appSighting = angular.module('sighting',[
  'ngRoute',
  'formula',
  'npolarApi', /*NP logon*/
  'npolarUi',
/*  'templates', */
/*  'sightingServices', */   /*Edit service*/
/*  'leaflet-directive', */   /*Map*/
/*  '720kb.datepicker', */    /*Calendar*/
  'ngResource'
]);


// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/user', 'resource': 'User'},
  {'path': '/sighting', 'resource': 'Sighting' }
];

resources.forEach(function (service) {
  // Expressive DI syntax is needed here
  appSighting.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// Routing
appSighting.config(require('./src/js/router'));


// API HTTP interceptor - adds tokens to server + (gir probl routing)
appSighting.config(function ($httpProvider) {
  $httpProvider.interceptors.push('npolarApiInterceptor');
});


//Routing to the individual pages
//Open - open to all,
//User - with user login
//Admin - for administrators
appSighting.controller('PanelCtrl', require('./src/js/PanelCtrl'));
appSighting.controller('SightingCtrl', require('./src/js/SightingCtrl'));
appSighting.controller('AdminObservationsCtrl', require('./src/js/AdminObservationsCtrl'));
appSighting.controller('QualityCtrl', require('./src/js/QualityCtrl'));
appSighting.controller('MapCtrl', require('./src/js/MapCtrl'));
appSighting.controller('CSVCtrl', require('./src/js/CSVCtrl'));
appSighting.controller('MyObservationsCtrl', require('./src/js/MyObservationsCtrl'));
appSighting.controller('ViewObservationCtrl', require('./src/js/ViewObservationCtrl'));
appSighting.controller('NewObservationCtrl', require('./src/js/NewObservationCtrl'));
appSighting.controller('EditObservationCtrl', require('./src/js/EditObservationCtrl'));
appSighting.controller('DeleteObservationCtrl', require('./src/js/DeleteObservationCtrl'));
appSighting.controller('UploadObservationsCtrl', require('./src/js/UploadObservationsCtrl'));
appSighting.service('SightingDBUpdate', require('./src/js/SightingDBUpdate'));
appSighting.service('CSVService', require('./src/js/CSVService'));
appSighting.directive('fileInput', require('./src/js/fileInput'));

var AutoConfig = require('npdc-common').AutoConfig;

// Inject npolarApiConfig and run
appSighting.run(function(npolarApiConfig) {
  var environment; // development | test | production
  var autoconfig = new AutoConfig(environment);
  angular.extend(npolarApiConfig, autoconfig);
  console.log("npolarApiConfig", npolarApiConfig);
});
