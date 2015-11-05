'use strict';
/* user module */
//Update entry from Svalbard MMS couch database here
// @ngInject
var EditObservationCtrl =  function($scope,$location, $controller, Sighting, npolarApiConfig, NpolarApiSecurity) {
    //var speciesgallery = require('./SpeciesGallery');

     // EditController -> NpolarEditController
  $controller('NpolarEditController', { $scope: $scope });

  $scope.duplicate = function() {

      //console.log($scope.document);
      //Duplicating the object to a new instance
      let duplicate = Object.assign($scope.document);
      delete duplicate._rev;
      delete duplicate._id;
      delete duplicate.id;
      //console.log(duplicate);
      $scope.resource.save(duplicate, function(document) {
      $scope.document = document;
      $scope.formula.model = document;
      $location.path('observations/${document.id}/edit');

    });


  };

  // Dataset -> npolarApiResource -> ngResource
  $scope.resource = Sighting;
  console.log("----");

  var user = NpolarApiSecurity.getUser();

  let date_identified = (sighting) => {
     return short_date($scope.formula.date_identified);
  };

  console.log($scope.document);
  // Formula ($scope.formula set by parent)
  /*$scope.formula.collection = 'sighting';
  $scope.formula.base = 'http://api.npolar.no';
  $scope.formula.rights = 'No licence announced on the web site';
  $scope.formula.rights_holder = "Norwegian Polar Institute";
  $scope.formula.basis_of_record = "HumanObservation";
  $scope.formula.language = 'en';
  $scope.formula.recorded_by = user.email;
  $scope.formula.recorded_by_name = user.name;*/
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
