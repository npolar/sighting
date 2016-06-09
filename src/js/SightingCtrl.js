'use strict';
/*Controller not behind login*/

//Get species gallery for images, education/links to NPs home pages.
// @ngInject
var SightingCtrl = function ($scope, $http, Sighting, SPECIES) {

  $scope.species = SPECIES;

};


module.exports = SightingCtrl;
