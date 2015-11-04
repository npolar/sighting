'use strict';
//Delete entry here by updating so entry is still available
// @ngInject
var DeleteAdminObservationCtrl =  function($scope, $routeParams, Sighting, SightingDBGet) {

          //Get entry
          $scope.entry = SightingDBGet.get({id: $routeParams.id }, function(){
          });

     //Delete by put update, set _deleted to true
    $scope.submit = function(id) {
    	  var entry = new Sighting($scope.entry);

          //Delete by setting _deleted to true
          entry._deleted = true;
          entry.$update();
   };
};

module.exports = DeleteAdminObservationCtrl;
