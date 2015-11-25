'use strict';
/* user module */
//Update entry from Svalbard MMS couch database here
// @ngInject
var EditAdminObservationCtrl =  function($scope,$location, $controller, Sighting, npolarApiConfig, NpolarApiSecurity, IsAdmin) {
    //var speciesgallery = require('./SpeciesGallery');

     // EditController -> NpolarEditController
  $controller('NpolarEditController', { $scope: $scope });
   var user = NpolarApiSecurity.getUser();


  // Dataset -> npolarApiResource -> ngResource
  $scope.resource = Sighting;

   $scope.isAdmin = IsAdmin.entryObject['data'];

  // Formula ($scope.formula set by parent)

  $scope.formula.schema = 'https:'+ npolarApiConfig.base + '/schema/sighting';
  $scope.formula.form = './partials/admin/formula_admin.json';
  $scope.formula.validateHidden = false;
  $scope.formula.saveHidden = false;



 //Tap into save to set predefined values
  var onSaveCallback = $scope.formula.onsave;

  $scope.formula.onsave = function(model) {
    Object.assign(model, {
      identified_by: user.email
    });

    onSaveCallback(model);
  };


  // edit (or new) action
  $scope.edit();



};


module.exports = EditAdminObservationCtrl;
