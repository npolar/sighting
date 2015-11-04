'use strict';

// @ngInject
var QualityCtrl = function($scope, $http, Sighting, npolarApiConfig, SightingDBSearch) {

  //editor_assessment=unknown means new entries
  $scope.full = SightingDBSearch.get({search:"q=filter-editor_assessment=unknown"}, function(){
   });

};

module.exports = QualityCtrl;
