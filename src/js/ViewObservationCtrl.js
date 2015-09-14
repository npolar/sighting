'use strict';
/**
 * @ngInject
 */
var ViewObservationCtrl = function ($scope, $controller, Sighting) {
  $controller('NpolarBaseController', {$scope: $scope});
  $scope.resource = Sighting;
  $scope.show();
};

module.exports = ViewObservationCtrl;
