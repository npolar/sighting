'use strict';

// @ngInject
var QualityCtrl = function($scope, $http, Sighting, npolarApiConfig, SightingDBSearch, IsAdmin) {

  //pagination
  $scope.itemsByPage=15;
  var displayedCollection = [];

  //editor_assessment=unknown means new entries
  $scope.full = SightingDBSearch.get({search:"&filter-editor_assessment=unknown"}, function(){

  	 //For pagination - a copy is needed for display aka displayedCollection
     displayedCollection.push($scope.full.feed.entries);
     $scope.displayedCollection = displayedCollection;
   });

  //Admin logon?
  $scope.isAdmin = IsAdmin.entryObject.data;

};

module.exports = QualityCtrl;
