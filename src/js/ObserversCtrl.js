'use strict';
/*Controller not behind login*/

//Get species gallery for images, education/links to NPs home pages.
// @ngInject
var ObserversCtrl = function ($scope, $http, NpolarApiSecurity, Sighting) {
  $scope.security = NpolarApiSecurity;



  Sighting.feed({ fields: "*"}, response => {
    //$scope.filters = response._filters();
    //$scope.feed = response.feed;
    $scope.feed = response.feed;

    console.log($scope.feed);
   });



};


module.exports = ObserversCtrl;
