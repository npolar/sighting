/*jslint node: true */
'use strict';

var angular = require('angular');
//require('angular-resource');
//require('angular-sanitize');

/*require('angularjs-datepicker');*/


var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;


var sightingApp = angular.module('sighting',[
  'npdcCommon',
  'ngRoute',
  'formula',
  'ngNpolar', //NP logon
 // 'nemLogging',
//  'sightingServices',   //Edit service
  'leaflet-directive',
  'ngResource',
  'templates',
  'smart-table'
]);


//Routing to the individual pages
//Open - open to all,
//User - with user login
//Admin - for administrators
sightingApp.controller('PanelCtrl', require('./js/PanelCtrl'));
sightingApp.controller('SightingCtrl', require('./js/SightingCtrl'));
sightingApp.controller('AdminObservationsCtrl', require('./js/AdminObservationsCtrl'));
sightingApp.controller('ObserversCtrl', require('./js/ObserversCtrl'));
sightingApp.controller('CSVCtrl', require('./js/CSVCtrl'));
sightingApp.controller('MyObservationsCtrl', require('./js/MyObservationsCtrl'));
sightingApp.controller('ViewObservationCtrl', require('./js/ViewObservationCtrl'));

sightingApp.controller('EditObservationCtrl', require('./js/EditObservationCtrl'));
//appSighting.controller('UploadImagesCtrl', require('./js/UploadImagesCtrl'));
sightingApp.controller('ngLoginLogout', require('./js/ngLoginlogout'));
sightingApp.controller('EditAdminObservationCtrl', require('./js/EditAdminObservationCtrl'));
sightingApp.controller('DeleteAdminObservationCtrl', require('./js/DeleteAdminObservationCtrl'));
sightingApp.controller('QualityCtrl', require('./js/QualityCtrl'));
sightingApp.controller('UploadObservationsCtrl', require('./js/UploadObservationsCtrl'));

sightingApp.directive('fileInput', require('./js/fileInput'));
sightingApp.directive('npolarLoginLogout2', require('./js/ngloginLogout2'));
sightingApp.directive('picture', require('./js/picture'));
sightingApp.directive('uploadObservations', require('./js/uploadObservations'));

sightingApp.service('SightingDBSearch', require('./js/SightingDBSearch'));
sightingApp.service('SightingDBGet', require('./js/SightingDBGet'));
sightingApp.service('CSVService', require('./js/CSVService'));
sightingApp.service('IsAdmin', require('./js/IsAdmin'));
sightingApp.constant('SPECIES', require('./js/SpeciesGallery'));
sightingApp.filter('viewFilter', require('./js/viewFilter'));
sightingApp.filter('uniqueFilter', require('./js/uniqueFilter'));


// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/user', 'resource': 'User'},
  {'path': '/sighting', 'resource': 'Sighting' }
];



resources.forEach(service => {
  // Expressive DI syntax is needed here
  sightingApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// Routing
sightingApp.config(require('./router'));


// API HTTP interceptor - adds tokens to server + (gir probl routing)
//angular.module('sighting').config(function ($httpProvider) {
//  $httpProvider.interceptors.push('npolarApiInterceptor');
//});


// Inject npolarApiConfig and run
//angular.module('sighting').run(npolarApiConfig => {
  //var environment; // 'test', 'development', 'production'
  //var autoconfig = new AutoConfig('test');
  //angular.extend(npolarApiConfig, autoconfig, { resources });
  //console.log("npolarApiConfig", npolarApiConfig);
//});



// API HTTP interceptor
sightingApp.config($httpProvider => {
  $httpProvider.interceptors.push('npolarApiInterceptor');
});

// Inject npolarApiConfig and run
sightingApp.run(($http, npolarApiConfig) => {
  var autoconfig = new AutoConfig("production");
  angular.extend(npolarApiConfig, autoconfig, { resources });
});

sightingApp.run(($http, npdcAppConfig) => {
  npdcAppConfig.toolbarTitle = 'Marine mammal sighting';
});

// Inject Chronopic on suitable input elements
//angular.module('sighting').directive('input', require('npdc-common/src/wrappers/chronopic')({
//  css: { 'max-width': '340px' }
//}));



module.exports = angular.module('sighting');
