'use strict';
/*User module*/


//Fetch from svalbard sightings couch database here the owner's observations
// @ngInject
var MyObservationsCtrl = function($scope, $http, Sighting, NpolarApiSecurity, npolarApiConfig, SightingDBSearch, SPECIES) {
   $scope.security = NpolarApiSecurity;
   $scope.items = SPECIES;

   //Do a search for the logged in person.
   var user = NpolarApiSecurity.getUser();
   console.log(npolarApiConfig.base);

   //editor_assessment=unknown means new entries
   $scope.entry = SightingDBSearch.get({search:'q=&filter-recorded_by='+ user.email}, function(){
   });

  // Execute this function when advanced search button is pressed
  $scope.submit = function() {
     console.log("submit");

     console.log($scope);

     if ($scope.species && !($scope.species == 'null')) {
       var search = $scope.species.family;
       console.log(search);
       //Add + instead of space
       search = search.replace(/ /g,"+");
        console.log(search);

       var search2 = 'q=' + search + '&filter-recorded_by='+ user.email;
       //Do the search
       console.log(search2);

       $scope.entry = SightingDBSearch.get({search:search2}, function(){
       });

       console.log($scope.entry);

    }
  };

};



module.exports = MyObservationsCtrl;