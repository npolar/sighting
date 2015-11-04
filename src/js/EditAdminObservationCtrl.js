'use strict';
/* user module */
//Update entry from Svalbard MMS couch database here
// @ngInject
var EditAdminObservationCtrl =  function($scope,$location, $controller, Sighting, npolarApiConfig) {
    //var speciesgallery = require('./SpeciesGallery');

     // EditController -> NpolarEditController
  $controller('NpolarEditController', { $scope: $scope });


  // Dataset -> npolarApiResource -> ngResource
  $scope.resource = Sighting;

  // Formula ($scope.formula set by parent)

  $scope.formula.schema = 'https:'+ npolarApiConfig.base + '/schema/sighting';
  $scope.formula.form = './partials/admin/formula_admin.json';
  $scope.formula.validateHidden = false;
  $scope.formula.saveHidden = false;

  // edit (or new) action
  $scope.edit();



};


module.exports = EditAdminObservationCtrl;
