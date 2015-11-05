'use strict';
/*User module*/


//Fetch from svalbard sightings couch database here the owner's observations
// @ngInject
var MyObservationsCtrl = function($scope, $http, Sighting, NpolarApiSecurity, npolarApiConfig, SightingDBSearch) {
   $scope.security = NpolarApiSecurity;

   //Do a search for the logged in person.
   var user = NpolarApiSecurity.getUser();
   console.log(npolarApiConfig.base);

   //editor_assessment=unknown means new entries
   $scope.feed2 = SightingDBSearch.get({search:'q=&filter-recorded_by='+ user.email}, function(){
   });


/*Sighting.feed({ fields: "*"}, response => {
    //$scope.filters = response._filters();
    //$scope.feed = response.feed;
    $scope.feed = response.feed;

   }); */

};



module.exports = MyObservationsCtrl;