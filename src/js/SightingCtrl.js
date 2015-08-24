/*Controller not behind login*/

//Get species gallery for images, education/links to NPs home pages.
var SightingCtrl = function ($scope, $http) {
   'use strict';

//   require('./SpeciesGalleryCtrl');
var speciesgallery = require('./SpeciesGallery');

   this.species = speciesgallery;


   //Get observers
   $http.jsonp('http://apptest.data.npolar.no/sighting/?q=&facets=recorded_by&size-facet=1000&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
     $scope.full = data;
   });
};


module.exports = SightingCtrl;
