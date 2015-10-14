  'use strict';
/*Admin module*/

/* Respond to search to get relevant entries */
/* First respond to squares drawn */
// @ngInject
//var AdminObservationsCtrl = function($scope, $http, leafletData, SPECIES, CSVService, NpolarApiSecurity, Sighting, SightingDBGetAdmin) {
var AdminObservationsCtrl = function($scope, $http, SPECIES,npolarApiConfig,  CSVService, NpolarApiSecurity, Sighting, SightingDBGetAdmin) {


$scope.isAdmin = function() {
  return NpolarApiSecurity.hasSystem('https://api.npolar.no/sighting/admin');
};

// Setting up the map
 /*   angular.extend($scope, {
      center: {
                    lat: 78.000,
                    lng: 16.000,
                    zoom: 4
      },
      layers: {
        tileLayer: "http://tilestream.data.npolar.no/v2/WorldHax/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap2</a> contributors',
        maxZoom: 14,
        minZoom: 2
      },
      controls: {
        draw: { position : 'topleft',
        polygon : false,
        polyline : false,
        rectangle : true,
        circle : false,
        marker: false }
      }
  });*/


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



