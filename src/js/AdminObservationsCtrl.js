/*Admin module*/

/* Respond to search to get relevant entries */
var AdminObservationsCtrl = function($scope, $http) {
 'use strict';
var map = L.map('map');
map.setView([47.63, -122.32], 11);
var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>';

var tiles = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png';

L.tileLayer(tiles, {
  maxZoom: 18,
  attribution: attribution
}).addTo(map);

$scope.submit = function() {
	console.log($scope);
    $http.jsonp('http://apptest.data.npolar.no/sighting/?q='+ $scope.search +'&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
    $scope.full = data;
    console.log(data);
})};
};

module.exports = AdminObservationsCtrl;
