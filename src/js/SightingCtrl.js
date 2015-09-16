'use strict';
/*Controller not behind login*/

//Get species gallery for images, education/links to NPs home pages.
// @ngInject
var SightingCtrl = function ($scope, $http, NpolarApiSecurity, Sighting) {
$scope.security = NpolarApiSecurity;
//   require('./SpeciesGalleryCtrl');
   console.log("hei");
var speciesgallery = require('./SpeciesGallery');

   $scope.species = speciesgallery;


  Sighting.feed({ fields: "*"}, response => {
    //$scope.filters = response._filters();
    //$scope.feed = response.feed;
    $scope.feed = response.feed;

    console.log($scope.feed);
   });



};


module.exports = SightingCtrl;
