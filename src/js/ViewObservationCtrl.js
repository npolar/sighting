/*user module*/

//View entry here
var ViewObservationCtrl = function($scope, $routeParams,$http, SightingDBUpdate) {
      'use strict';
      $scope.entry = SightingDBUpdate.get({id: $routeParams.id }, function(){
        console.log($scope.entry);
  });
   //get hostname
   $scope.hostname = location.host;
};

module.exports = ViewObservationCtrl;
