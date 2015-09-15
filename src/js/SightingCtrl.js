'use strict';
/*Controller not behind login*/

//Get species gallery for images, education/links to NPs home pages.
// @ngInject
var SightingCtrl = function ($scope, $http, NpolarApiSecurity, Sighting) {
$scope.security = NpolarApiSecurity;
//   require('./SpeciesGalleryCtrl');
var speciesgallery = require('./SpeciesGallery');

   $scope.species = speciesgallery;


  Sighting.feed({ fields: "*"}, response => {
    //$scope.filters = response._filters();
    //$scope.feed = response.feed;
    $scope.feed = response.feed;


  console.log($scope.feed);
   });


   //Get observers
 /*  $http.jsonp('https://api.npolar.no/sighting/?q=&facets=recorded_by&size-facet=1000&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
     $scope.full = data;
   });*/
};


module.exports = SightingCtrl;
