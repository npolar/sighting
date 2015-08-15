/*Admin module*/

/* Respond to search to get relevant entries */
var AdminObservationsCtrl = function($scope, $http) {
 'use strict';

 // create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map', {drawControl: true}).setView([78.000, 16.000], 4);

// add an OpenStreetMap tile layer
L.tileLayer('http://tilestream.data.npolar.no/v2/WorldHax/{z}/{x}/{y}.png', {
    attribution: 'Norwegian Polar Institute'
}).addTo(map);

// Initialize the FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialize the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);




$scope.submit = function() {
	console.log($scope);
    $http.jsonp('http://apptest.data.npolar.no/sighting/?q='+ $scope.search +'&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
    $scope.full = data;
    console.log(data);
})};
};

module.exports = AdminObservationsCtrl;
