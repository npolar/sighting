'use strict';
/*User module*/


//Fetch from svalbard sightings couch database here the owner's observations
// @ngInject
var MyObservationsCtrl = function($scope, $http, Sighting, NpolarApiSecurity, npolarApiConfig) {
   $scope.security = NpolarApiSecurity;

   //Do a search for the logged in person.
   var sok = NpolarApiSecurity.getUser();
   $http.jsonp('https:'+ npolarApiConfig.base +'/sighting/?q=&filter-recorded_by='+ sok.email + '&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
     $scope.feed2 = data;
   });

/*Sighting.feed({ fields: "*"}, response => {
    //$scope.filters = response._filters();
    //$scope.feed = response.feed;
    $scope.feed = response.feed;

   }); */

};



module.exports = MyObservationsCtrl;