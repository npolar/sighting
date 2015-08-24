/* user module */
//Update entry from Svalbard MMS couch database here
var EditObservationCtrl =  function($scope, $routeParams, $http, Sighting, SightingDBUpdate, npolarApiSecurity, npolarApiUser) {
    'use strict';
    var speciesgallery = require('SpeciesGalleryCtrl');

    var entry = SightingDBUpdate.get({id: $routeParams.id }, function(){
    $scope.entry = entry;
    /*Set abbreviated dates*/
    $scope.entry.event_date = entry.event_date.substring(0,10);
    $scope.entry.expedition.start_date = entry.expedition.start_date.substring(0,10);
    $scope.entry.expedition.end_date = entry.expedition.end_date.substring(0,10);
     console.log('edit ' + JSON.stringify(entry));
    $scope.species = speciesgallery.speciesgallery;

  });

    //Store update
    $scope.submit = function(id) {
      var entry = new Sighting($scope.entry);
      console.log('edit ' + JSON.stringify(entry));
      console.log("http "  + JSON.stringify($http.defaults.headers.common));
      entry.$update();
  };
};

module.exports = EditObservationCtrl;
