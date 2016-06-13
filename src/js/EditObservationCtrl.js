'use strict';
/* user module */
//Update entry from Svalbard MMS couch database here
// @ngInject
var EditObservationCtrl =  function($scope,$location, $controller, $routeParams, Sighting, formula, npolarApiConfig,
 npdcAppConfig, chronopicService,  fileFunnelService, NpolarApiSecurity) {

     // EditController -> NpolarEditController
  $controller('NpolarEditController', { $scope: $scope });

/*  $scope.duplicate = function() {

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


  }; */

  // Dataset -> npolarApiResource -> ngResource
  $scope.resource = Sighting;


 // var user = NpolarApiSecurity.getUser();


  // Formula ($scope.formula set by parent)
 /* $scope.formula.schema = 'https:' + npolarApiConfig.base + '/schema/sighting';
  $scope.formula.form = './partials/user/formula.json';
  $scope.formula.validateHidden = false;
  $scope.formula.saveHidden = false;

  //Tap into save to set predefined values
  var onSaveCallback = $scope.formula.onsave;

  $scope.formula.onsave = function(model) {
    Object.assign(model, {
      collection: 'sighting',
      base: 'http://api.npolar.no',
      rights: 'No licence announced on the web site',
      rights_holder: "Norwegian Polar Institute",
      basis_of_record: "HumanObservation",
      language: 'en',
      recorded_by: user.email,
      recorded_by_name: user.name
    });

    onSaveCallback(model);
  }; */

  let templates = [];

  $scope.formula = formula.getInstance({
    schema: '//api.npolar.no/schema/sighting',
    form: 'formula.json',
    templates: npdcAppConfig.formula.templates.concat(templates)
   });

   chronopicService.defineOptions({ match: 'released', format: '{date}'});
  chronopicService.defineOptions({ match(field) {
    return field.path.match(/^#\/activity\/\d+\/.+/);
  }, format: '{date}'});



  // edit (or new) action
  $scope.edit();



};



module.exports = EditObservationCtrl;
