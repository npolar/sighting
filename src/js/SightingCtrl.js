/*Controller not behind login*/

//Get species gallery for images, education/links to NPs home pages.
var SightingCtrl = function ($scope, $http) {
   'use strict';

   this.species = require('./SpeciesGallery');


   //Get observers
   $http.jsonp('http://apptest.data.npolar.no/sighting/?q=&facets=recorded_by&size-facet=1000&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
     $scope.full = data;
   });
};


module.exports = SightingCtrl;
