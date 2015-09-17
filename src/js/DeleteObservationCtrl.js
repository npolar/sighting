'use strict';
//Delete entry here by updating so entry is still available
// @ngInject
var DeleteObservationCtrl =  function($scope, $http, $routeParams, Sighting, SightingDBUpdate) {

     //Delete by put update, set _deleted to true
    $scope.submit = function(id) {
       /*   var entry = new Sighting($scope.entry);
          //Delete by setting _deleted to true
          entry._deleted = true;
          entry.$update();
          console.log("entry object: ", entry); */
   };
};

module.exports = DeleteObservationCtrl;
