/**
 * @ngInject
 */
var ViewObservationCtrl = function ($scope, $controller, Sighting) {
  'use strict';
  $controller('NpolarBaseController', {$scope: $scope});
  $scope.resource = Sighting;
  $scope.show();
};

module.exports = ViewObservationCtrl;
