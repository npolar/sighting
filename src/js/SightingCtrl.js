'use strict';
/*Controller not behind login*/

//Get species gallery for images, education/links to NPs home pages.
// @ngInject
var SightingCtrl = function ($scope, $http, NpolarApiSecurity, Sighting, SPECIES) {
  $scope.security = NpolarApiSecurity;
  $scope.species = SPECIES;


  Sighting.feed({ fields: "*"}, response => {
    //$scope.filters = response._filters();
    //$scope.feed = response.feed;
    $scope.feed = response.feed;

    console.log($scope.feed);
   });



};


module.exports = SightingCtrl;
