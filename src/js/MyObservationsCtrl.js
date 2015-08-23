/*User module*/

//Fetch from svalbard sightings couch database here the owner's observations
var MyObservationsCtrl = function($scope, $http, SightingDBUpdate) {
  'use strict';

//sightingControllers.controller('MyObservationsCtrl', function($scope, $http, SightingDBUpdate) {
   $http.jsonp('http://apptest.data.npolar.no/sighting/?q=&format=json&callback=JSON_CALLBACK&locales=utf-8')
    .success(function(data) {
        $scope.full = data;
     }).error(function (data, status, headers, config) {
     });
};

module.exports = MyObservationsCtrl;
