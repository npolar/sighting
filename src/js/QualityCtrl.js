'use strict';

// @ngInject
var QualityCtrl = function($scope, $http, Sighting) {
$scope.submit = function() {
  console.log($scope);
  $http.jsonp('http://apptest.data.npolar.no/sighting/?q='+ $scope.search +'&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
  $scope.full = data;
  console.log(data);
});

};
};

module.exports = QualityCtrl;
