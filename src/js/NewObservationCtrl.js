'use strict';
//New entry created here
// @ngInject
var NewObservationCtrl = function($scope, $controller, $http, $routeParams, Sighting) {

  $controller('NpolarEditController', { $scope: $scope });

  // Dataset -> npolarApiResource -> ngResource
  $scope.resource = Sighting;

  // Formula ($scope.formula set by parent)
  $scope.formula.schema = 'https://api.npolar.no/schema/sighting';
  $scope.formula.form = './partials/user/formula.json';
  $scope.formula.validateHidden = false;
  $scope.formula.saveHidden = false;

  // edit (or new) action
  $scope.edit();


    /* $scope.formulaData = {
      schema: "https://api.npolar.no/schema/sighting.json",
      form: "./partials/user/formula.json",
      language: "./partials/user/translation.json",
      model: {},
      onsave: function(doc) {
        alert("test");

    }
    }; */
  };


   /*If new has an id, then it's the old id to be copyed into a new entry */
/*   if  ($routeParams.id) {

      console.log($scope.entry); */

      /* Shorten dates for display only*/
   /*   if (typeof $scope.entry.event_date != "undefined" && $scope.entry.event_date != "") {
         $scope.entry.event_date = $scope.entry.event_date.substring(0,10);
      }
      if (typeof $scope.entry.expedition.start_date != "undefined" && $scope.entry.expedition.start_date != "") {
         $scope.entry.expedition.start_date = $scope.entry.expedition.start_date.substring(0,10);
      }
       if (typeof $scope.entry.expedition.end_date != "undefined" && $scope.entry.expedition.end_date != "") {
      $scope.entry.expedition.end_date = $scope.entry.expedition.end_date.substring(0,10);
      } */
  /* } else { */
       /*New entry - start over no info fetched*/
    /*   $scope.entry = {};
   } */



 //  $scope.submit = function() {

      /* Populate with inital values */
   /*   console.log($scope.entry);
      entry = $scope.entry;
      entry.schema = 'http://api.npolar.no/schema/sighting.json';
      entry.collection = 'sighting';
      entry.base = 'http://api.npolar.no';
      entry.language = 'en';
      entry.basis_of_record = 'HumanObservation';
      entry.rights = 'No licence announced on the web site';
      entry.rights_holder = 'Norwegian Polar Institute';
      entry.recorded_by = npolarApiUser.getUser().username;
      entry.recorded_by_name = npolarApiUser.getUser().username;
      entry.created = (new Date()).toISOString();
      entry.created_by = npolarApiUser.getUser().username;
     // entry.expedition.start_date = '2014-03-01';

      $scope.entry = entry; */




     /* if (typeof $scope.entry.event_date != "undefined") {
          $scope.entry.event_date = (entry.event_date).toISOString();
      } */
 /*     if (typeof $scope.entry.expedition.start_date != "undefined") {
          $scope.entry.expedition.start_date = entry.expedition.start_date;
      } */
     /* if (typeof $scope.entry.expedition.end_date != "undefined") {
          $scope.entry.expedition.end_date = entry.expedition.end_date;
      } */


module.exports = NewObservationCtrl;
