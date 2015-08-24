/*Admin module*/

/* Respond to search to get relevant entries */
var AdminObservationsCtrl = function($scope, $http) {
 'use strict';
  var L =require('leaflet');
  require('leaflet-draw');


  var url = 'http://tilestream.data.npolar.no/v2/WorldHax/{z}/{x}/{y}.png',
  			attrib = '&copy; <a href="http://openstreetmap.org/copyright">Norwegian Polar Institute</a>',
  			osm = L.tileLayer(url, {maxZoom: 18, attribution: attrib}),
  			map = new L.Map('map', {layers: [osm], center: new L.LatLng(78.000, 16.000), zoom: 4 });

  		var drawnItems = new L.FeatureGroup();
  		map.addLayer(drawnItems);

  		var drawControl = new L.Control.Draw({
  			draw: {
  				position: 'topleft',
  				polygon: {
  					title: 'Draw a polygon!',
  					allowIntersection: false,
  					drawError: {
  						color: '#b00b00',
  						timeout: 1000
  					},
  					shapeOptions: {
  						color: '#bada55'
  					},
  					showArea: true
  				},
  				polyline: {
  					metric: false
  				},
  				circle: {
  					shapeOptions: {
  						color: '#662d91'
  					}
  				}
  			},
  			edit: {
  				featureGroup: drawnItems
  			}
  		});
  		map.addControl(drawControl);

  		map.on('draw:created', function (e) {
  			var type = e.layerType,
  				layer = e.layer;

  			if (type === 'marker') {
  				layer.bindPopup('A popup!');
  			}

  			drawnItems.addLayer(layer);
  		});


 // create a map in the "map" div, set the view to a given place and zoom
/*$scope.submit = function() {
	console.log($scope);
    $http.jsonp('http://apptest.data.npolar.no/sighting/?q='+ $scope.search +'&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
    $scope.full = data;
    console.log(data);
});
}; */  /*$scope.submit*/
};



module.exports = AdminObservationsCtrl;
