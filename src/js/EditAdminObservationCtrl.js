'use strict';
/* user module */
//Update entry from Svalbard MMS couch database here
// @ngInject
var EditAdminObservationCtrl =  function($scope,$location, $controller, Sighting, formula, npolarApiConfig,
  npdcAppConfig, chronopicService, fileFunnelService, NpolarApiSecurity, IsAdmin) {


     // EditController -> NpolarEditController
  $controller('NpolarEditController', { $scope: $scope });
   var user = NpolarApiSecurity.getUser();


  // Dataset -> npolarApiResource -> ngResource
  $scope.resource = Sighting;

   $scope.isAdmin = IsAdmin.entryObject.data;


    let templates = [];

  $scope.formula = formula.getInstance({
    schema: '//api.npolar.no/schema/sighting',
    form: 'js/formula.json',
    templates: npdcAppConfig.formula.templates.concat(templates)
   });

  console.log($scope.formula);

  chronopicService.defineOptions({ match: 'released', format: '{date}'});
  chronopicService.defineOptions({ match(field) {
    return field.path.match(/^#\/activity\/\d+\/.+/);
  }, format: '{date}'});



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
