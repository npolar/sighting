/*jslint node: true */
'use strict';

var angular = require('angular');
require('angular-route');
require('angular-resource');

/*require('angularjs-datepicker');*/
require('formula');
require('angular-npolar');

var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;


var appSighting = angular.module('sighting',[
  'ngRoute',
  'formula',
  'npolarApi', //NP logon
  'npolarUi',
 // 'nemLogging',
//  'sightingServices',   //Edit service
  'leaflet-directive',
//  '720kb.datepicker',  //Calendar
  'ngResource',
  'templates'
]);


//Routing to the individual pages
//Open - open to all,
//User - with user login
//Admin - for administrators
appSighting.controller('PanelCtrl', require('./js/PanelCtrl'));
appSighting.controller('SightingCtrl', require('./js/SightingCtrl'));
appSighting.controller('AdminObservationsCtrl', require('./js/AdminObservationsCtrl'));
appSighting.controller('QualityCtrl', require('./js/QualityCtrl'));
appSighting.controller('ObserversCtrl', require('./js/ObserversCtrl'));
appSighting.controller('CSVCtrl', require('./js/CSVCtrl'));
appSighting.controller('MyObservationsCtrl', require('./js/MyObservationsCtrl'));
appSighting.controller('ViewObservationCtrl', require('./js/ViewObservationCtrl'));
appSighting.controller('NewObservationCtrl', require('./js/NewObservationCtrl'));
appSighting.controller('EditObservationCtrl', require('./js/EditObservationCtrl'));
appSighting.controller('DeleteObservationCtrl', require('./js/DeleteObservationCtrl'));
appSighting.controller('UploadObservationsCtrl', require('./js/UploadObservationsCtrl'));
appSighting.controller('UploadImagesCtrl', require('./js/UploadImagesCtrl'));
appSighting.controller('QualityEditCtrl', require('./js/QualityEditCtrl'));
appSighting.controller('ngLoginLogout', require('./js/ngLoginlogout'));

appSighting.service('SightingDBUpdate', require('./js/SightingDBUpdate'));
appSighting.service('SightingDBGet', require('./js/SightingDBGet'));
appSighting.service('SightingDBGetAdmin', require('./js/SightingDBGetAdmin'));
appSighting.service('CSVService', require('./js/CSVService'));
appSighting.directive('fileInput', require('./js/fileInput'));
appSighting.directive('npolarLoginLogout2', require('./js/ngloginLogout2'));
appSighting.constant('SPECIES', require('./js/SpeciesGallery'));


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



module.exports = appSighting;
