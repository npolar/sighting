'use strict';
/*User module*/


//Fetch from svalbard sightings couch database here the owner's observations
// @ngInject
var MyObservationsCtrl = function($scope, Sighting, NpolarApiSecurity, npolarApiConfig, SightingDBSearch, SPECIES) {
   $scope.security = NpolarApiSecurity;
   $scope.items = SPECIES;

   //pagination
   $scope.itemsByPage=10;
   var displayedCollection = [];


   //Need to define a form in order to receive results from the form.
   //Form is not defined first time controller is run.
   $scope.form = {};

   //Do a search for the logged in person.
   var user = NpolarApiSecurity.getUser();


   //editor_assessment=unknown means new entries
   $scope.arr = SightingDBSearch.get({search:'&filter-recorded_by='+ user.email}, function(){
     //For pagination - a copy is needed for display aka displayedCollection
     displayedCollection.push($scope.arr.feed.entries);
     $scope.displayedCollection = displayedCollection;
   });



  // Execute this function when advanced search button is pressed
  $scope.submit = function() {

     if ($scope.form.species && (!!$scope.form.species)) {
       var search = $scope.form.species.family;

       //Add + instead of space
       search = search.replace(/ /g,"+");

        //Do the search
       var search2 =  search + '&filter-recorded_by='+ user.email + '&sort=-event_date';
       $scope.arr = SightingDBSearch.get({search:search2}, function(){
       });

    }
  };

};



module.exports = MyObservationsCtrl;