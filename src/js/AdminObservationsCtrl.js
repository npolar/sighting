  'use strict';
//Admin module

// Respond to search to get relevant entries
// First respond to squares drawn
// @ngInject
var AdminObservationsCtrl = function($scope, $http, nemSimpleLogger, SPECIES, CSVService, NpolarApiSecurity, Sighting, SightingDBGetAdmin) {
//var AdminObservationsCtrl = function($scope, $http, nemSimpleLogger, leafletData, SPECIES, CSVService, NpolarApiSecurity, Sighting, SightingDBGetAdmin) {


$scope.isAdmin = function() {
  return NpolarApiSecurity.hasSystem('https://api.npolar.no/sighting/admin');
};


//var L = require('leaflet');
 //L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';
 /* require('leaflet-draw');*/

};

/*Convert to the search date format */
function convertDate(idate) {
          console.log(idate);
           var temp_date = idate.substring(0,4) + '-' + idate.substring(5,7) + '-' +idate.substring(8,10);
           temp_date += 'T00:00:00.000';
           console.log(temp_date);
           return temp_date;
}


  module.exports = AdminObservationsCtrl;



