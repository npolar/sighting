'use strict';
/* user module */
//Update entry from Svalbard MMS couch database here
// @ngInject
var EditObservationCtrl =  function($scope,$location, $controller, Sighting) {
    //var speciesgallery = require('./SpeciesGallery');

     // EditController -> NpolarEditController
  $controller('NpolarEditController', { $scope: $scope });

  $scope.duplicate = function() {

      let duplicate = Object.assign($scope.document);
      delete duplicate._rev;
      delete duplicate._id;
      delete duplicate.id;
      console.log(duplicate);
      $scope.resource.save(duplicate, function(document) {
      $scope.document = document;
      $scope.formula.model = document;
      $location.path(`observations/${document.id}/edit`);

    });


  };

  // Dataset -> npolarApiResource -> ngResource
  $scope.resource = Sighting;

  // Formula ($scope.formula set by parent)
  $scope.formula.schema = 'https://api.npolar.no/schema/sighting';
  $scope.formula.form = './partials/user/formula.json';
  $scope.formula.validateHidden = false;
  $scope.formula.saveHidden = false;

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
