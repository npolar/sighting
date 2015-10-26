'use strict';
/**
 * @ngInject
 */
var ViewObservationCtrl = function ($scope, $controller, Sighting) {
  $controller('NpolarBaseController', {$scope: $scope});
  console.log($scope);
  $scope.resource = Sighting;
  $scope.show();

};

module.exports = ViewObservationCtrl;
