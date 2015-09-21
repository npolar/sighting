'use strict';
/* user module */
//Update entry from Svalbard MMS couch database here
// @ngInject
var EditObservationCtrl =  function($scope, $controller, $routeParams, $http, Sighting) {
    //var speciesgallery = require('./SpeciesGallery');

     // EditController -> NpolarEditController
  $controller('NpolarEditController', { $scope: $scope });

  // Dataset -> npolarApiResource -> ngResource
  $scope.resource = Sighting;

  // Formula ($scope.formula set by parent)
  $scope.formula.schema = 'https://api.npolar.no/schema/sighting';
  $scope.formula.form = './partials/user/formula.json';
  $scope.formula.validateHidden = true;
  $scope.formula.saveHidden = true;

  // edit (or new) action
  $scope.edit();

};


  /*  $scope.formulaData = {
      schema: "https://api.npolar.no/schema/sighting.json",
      form: "./partials/user/formula.json",
      language: "./partials/user/translation.json",
      model: {},
      onsave: function(doc) {
        alert($scope);
    }
    }; */



module.exports = EditObservationCtrl;
