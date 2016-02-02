/*jslint node: true */
'use strict';

var angular = require('angular');
require('angular-resource');

/*require('angularjs-datepicker');*/


var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;


angular.module('sighting',[
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
angular.module('sighting').controller('PanelCtrl', require('./js/PanelCtrl'));
angular.module('sighting').controller('SightingCtrl', require('./js/SightingCtrl'));
angular.module('sighting').controller('AdminObservationsCtrl', require('./js/AdminObservationsCtrl'));
angular.module('sighting').controller('ObserversCtrl', require('./js/ObserversCtrl'));
angular.module('sighting').controller('CSVCtrl', require('./js/CSVCtrl'));
angular.module('sighting').controller('MyObservationsCtrl', require('./js/MyObservationsCtrl'));
angular.module('sighting').controller('ViewObservationCtrl', require('./js/ViewObservationCtrl'));

angular.module('sighting').controller('EditObservationCtrl', require('./js/EditObservationCtrl'));
//appSighting.controller('UploadImagesCtrl', require('./js/UploadImagesCtrl'));
angular.module('sighting').controller('ngLoginLogout', require('./js/ngLoginlogout'));
angular.module('sighting').controller('EditAdminObservationCtrl', require('./js/EditAdminObservationCtrl'));
angular.module('sighting').controller('DeleteAdminObservationCtrl', require('./js/DeleteAdminObservationCtrl'));
angular.module('sighting').controller('QualityCtrl', require('./js/QualityCtrl'));
angular.module('sighting').controller('UploadObservationsCtrl', require('./js/UploadObservationsCtrl'));

angular.module('sighting').directive('fileInput', require('./js/fileInput'));
angular.module('sighting').directive('npolarLoginLogout2', require('./js/ngloginLogout2'));
angular.module('sighting').directive('picture', require('./js/picture'));
angular.module('sighting').directive('uploadObservations', require('./js/uploadObservations'));

angular.module('sighting').service('SightingDBSearch', require('./js/SightingDBSearch'));
angular.module('sighting').service('SightingDBGet', require('./js/SightingDBGet'));
angular.module('sighting').service('CSVService', require('./js/CSVService'));
angular.module('sighting').service('IsAdmin', require('./js/IsAdmin'));
angular.module('sighting').constant('SPECIES', require('./js/SpeciesGallery'));
angular.module('sighting').filter('viewFilter', require('./js/viewFilter'));
angular.module('sighting').filter('uniqueFilter', require('./js/uniqueFilter'));




// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/user', 'resource': 'User'},
  {'path': '/sighting', 'resource': 'Sighting' }
];



resources.forEach(service => {
  // Expressive DI syntax is needed here
  angular.module('sighting').factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// Routing
angular.module('sighting').config(require('./router'));


// API HTTP interceptor - adds tokens to server + (gir probl routing)
angular.module('sighting').config(function ($httpProvider) {
  $httpProvider.interceptors.push('npolarApiInterceptor');
});


// Inject npolarApiConfig and run
angular.module('sighting').run(npolarApiConfig => {
  //var environment; // 'test', 'development', 'production'
  var autoconfig = new AutoConfig('test');
  angular.extend(npolarApiConfig, autoconfig, { resources });
  //console.log("npolarApiConfig", npolarApiConfig);
});

// Inject Chronopic on suitable input elements
//appSighting.directive('input', require('npdc-common/src/wrappers/chronopic')({
//  css: { 'max-width': '340px' }
//}));



module.exports = angular.module('sighting');
