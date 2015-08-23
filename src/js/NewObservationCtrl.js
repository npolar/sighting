//New entry created here
var NewObservationCtrl = function($scope, $http, $routeParams, npolarApiSecurity, npolarApiUser, Sighting, SightingDBUpdate) {
   'use strict';
   var SpeciesGallery = require('SpeciesGallery');


   /*If new has an id, then it's the old id to be copyed into a new entry */
   if  ($routeParams.id) {
       /*Fetch info from copying the old id's info */
      $scope.entry = SightingDBUpdate.get({id: $routeParams.id }, function(){
      });
     /* console.log($scope.entry); */

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
   } else {
       /*New entry - start over no info fetched*/
       $scope.entry = {};
   }



   /*Set select menu for species*/
   $scope.species = SpeciesGallery;



   $scope.submit = function() {

      /* Populate with inital values */
      console.log($scope.entry);
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

      $scope.entry = entry;



      //Update species
      if (typeof entry.species !== "undefined") {
        $scope.entry.species = entry.species.family;
      }
     /* if (typeof $scope.entry.event_date != "undefined") {
          $scope.entry.event_date = (entry.event_date).toISOString();
      } */
 /*     if (typeof $scope.entry.expedition.start_date != "undefined") {
          $scope.entry.expedition.start_date = entry.expedition.start_date;
      } */
     /* if (typeof $scope.entry.expedition.end_date != "undefined") {
          $scope.entry.expedition.end_date = entry.expedition.end_date;
      } */

       console.log(JSON.stringify($scope.entry));

      //Sighting.save(entry);
      var entry = new Sighting($scope.entry);

      var ret = entry.$save();

      console.log("New entry" + JSON.stringify(entry));
      console.log("New entry2 " + JSON.stringify(ret));

  };
};

module.exports = NewObservationCtrl;
