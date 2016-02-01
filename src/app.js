/*jslint node: true */
'use strict';

var angular = require('angular');
require('angular-resource');

/*require('angularjs-datepicker');*/


var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;


var appSighting = angular.module('sighting',[
  'ngRoute',
  'formula',
  'ngNpolar', //NP logon
 // 'nemLogging',
//  'sightingServices',   //Edit service
  'leaflet-directive',
//  '720kb.datepicker',  //Calendar
  'ngResource',
  'templates',
  'smart-table'
]);


//Routing to the individual pages
//Open - open to all,
//User - with user login
//Admin - for administrators
appSighting.controller('PanelCtrl', require('./js/PanelCtrl'));
appSighting.controller('SightingCtrl', require('./js/SightingCtrl'));
appSighting.controller('AdminObservationsCtrl', require('./js/AdminObservationsCtrl'));
appSighting.controller('ObserversCtrl', require('./js/ObserversCtrl'));
appSighting.controller('CSVCtrl', require('./js/CSVCtrl'));
appSighting.controller('MyObservationsCtrl', require('./js/MyObservationsCtrl'));
appSighting.controller('ViewObservationCtrl', require('./js/ViewObservationCtrl'));

appSighting.controller('EditObservationCtrl', require('./js/EditObservationCtrl'));
//appSighting.controller('UploadImagesCtrl', require('./js/UploadImagesCtrl'));
appSighting.controller('ngLoginLogout', require('./js/ngLoginlogout'));
appSighting.controller('EditAdminObservationCtrl', require('./js/EditAdminObservationCtrl'));
appSighting.controller('DeleteAdminObservationCtrl', require('./js/DeleteAdminObservationCtrl'));
appSighting.controller('QualityCtrl', require('./js/QualityCtrl'));
appSighting.controller('UploadObservationsCtrl', require('./js/UploadObservationsCtrl'));

appSighting.directive('fileInput', require('./js/fileInput'));
appSighting.directive('npolarLoginLogout2', require('./js/ngloginLogout2'));
appSighting.directive('picture', require('./js/picture'));
appSighting.directive('uploadObservations', require('./js/uploadObservations'));

appSighting.service('SightingDBSearch', require('./js/SightingDBSearch'));
appSighting.service('SightingDBGet', require('./js/SightingDBGet'));
appSighting.service('CSVService', require('./js/CSVService'));
appSighting.service('IsAdmin', require('./js/IsAdmin'));
appSighting.constant('SPECIES', require('./js/SpeciesGallery'));
appSighting.filter('viewFilter', require('./js/viewFilter'));
appSighting.filter('uniqueFilter', require('./js/uniqueFilter'));




// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/user', 'resource': 'User'},
  {'path': '/sighting', 'resource': 'Sighting' }
];



resources.forEach(service => {
  // Expressive DI syntax is needed here
  appSighting.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// Routing
appSighting.config(require('./router'));


// API HTTP interceptor - adds tokens to server + (gir probl routing)
appSighting.config(function ($httpProvider) {
  $httpProvider.interceptors.push('npolarApiInterceptor');
});


// Inject npolarApiConfig and run
appSighting.run(npolarApiConfig => {
  //var environment; // 'test', 'development', 'production'
  var autoconfig = new AutoConfig('test');
  angular.extend(npolarApiConfig, autoconfig, { resources });
  //console.log("npolarApiConfig", npolarApiConfig);
});

// Inject Chronopic on suitable input elements
//appSighting.directive('input', require('npdc-common/src/wrappers/chronopic')({
//  css: { 'max-width': '340px' }
//}));



module.exports = appSighting;
