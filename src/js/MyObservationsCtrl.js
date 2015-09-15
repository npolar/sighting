'use strict';
/*User module*/


//Fetch from svalbard sightings couch database here the owner's observations
// @ngInject
var MyObservationsCtrl = function($scope, $http, Sighting, NpolarApiSecurity, npolarApiConfig) {
   $scope.security = NpolarApiSecurity;




        console.log($scope.full);
    //    console.log("user");
    //});


Sighting.feed({ fields: "*"}, response => {
    //$scope.filters = response._filters();
    //$scope.feed = response.feed;
    $scope.feed = response.feed;


  console.log($scope.feed);
   });





};



module.exports = MyObservationsCtrl;

