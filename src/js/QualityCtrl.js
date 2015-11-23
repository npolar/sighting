'use strict';

// @ngInject
var QualityCtrl = function($scope, $http, Sighting, npolarApiConfig, SightingDBSearch) {

  //pagination
  $scope.itemsByPage=15;
  var displayedCollection = [];

  //editor_assessment=unknown means new entries
  $scope.full = SightingDBSearch.get({search:"q=filter-editor_assessment=unknown"}, function(){
  	 //For pagination - a copy is needed for display aka displayedCollection
     displayedCollection.push($scope.full.feed.entries);
     $scope.displayedCollection = displayedCollection;
   });

};

module.exports = QualityCtrl;
