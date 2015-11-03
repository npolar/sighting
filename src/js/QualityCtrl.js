'use strict';

// @ngInject
var QualityCtrl = function($scope, $http, Sighting, npolarApiConfig) {

  //editor_assessment=unknown means new entries
  $http.jsonp('https:' + npolarApiConfig.base + '/sighting/?q=filter-editor_assessment=unknown&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
    $scope.full = data;
});

//};
};

module.exports = QualityCtrl;
