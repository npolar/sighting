  'use strict';
//Admin module

// Respond to search to get relevant entries
// First respond to squares drawn
// @ngInject
//var AdminObservationsCtrl = function($scope, $http, nemSimpleLogger, SPECIES, CSVService, NpolarApiSecurity, Sighting, SightingDBGetAdmin) {
var AdminObservationsCtrl = function($scope, $http, nemSimpleLogger, leafletData, SPECIES, CSVService, NpolarApiSecurity, Sighting, SightingDBGetAdmin) {


$scope.isAdmin = function() {
  return NpolarApiSecurity.hasSystem('https://api.npolar.no/sighting/admin');
};

 var markers = [];

    // Setting up the map
    angular.extend($scope, {
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
  });

     //Draw a rectangle on the map to get coordinates from
  leafletData.getMap().then(function(map) {

        var drawnItems = new L.featureGroup().addTo(map);
        map.addControl(new L.Control.Draw({
          edit: {featureGroup: drawnItems }
        }));

        //var drawnItems = $scope.controls.edit.featureGroup;

       map.on('draw:created', function (e) {
                 var layer = e.layer;
                drawnItems.addLayer(layer);
                var res = (layer.toGeoJSON()).geometry.coordinates;

                //fetch zero and second coordinate pair to get a rectangle
                $scope.lat1= res[0][0][0];
                $scope.lng1= res[0][0][1];
                $scope.lat2= res[0][2][0];
                $scope.lng2= res[0][2][1];
                console.log($scope);
                console.log("----");
        });


        //
         map.on('draw:edited', function (e) {

           var layers = e.layers;
           layers.eachLayer(function (layer) {
             /*update lng/lat from search */
             var res = (layer.toGeoJSON()).geometry.coordinates;

                /*fetch zero and second coordinate pair to get a rectangle */
                $scope.lat1= res[0][0][0];
                $scope.lng1= res[0][0][1];
                $scope.lat2= res[0][2][0];
                $scope.lng2= res[0][2][1];
                console.log($scope);
           });
        });

        map.on('draw:deleted', function (e) {

         //Remove lat/lng from search inputs
         $scope.lat1= $scope.lng1= $scope.lat2 = $scope.lng2 = undefined;

         //Remove markers and squares
         $scope.markers = [];
        });
        //

});

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



