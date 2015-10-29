'use strict';
/*Controller not behind login*/

//Get species gallery for images, education/links to NPs home pages.
// @ngInject
var ObserversCtrl = function ($scope, $http, NpolarApiSecurity, Sighting) {
  $scope.security = NpolarApiSecurity;



  Sighting.feed({ fields: "*"}, response => {
    //$scope.filters = response._filters();
    var feed = response.feed;
    var size = 0,  arr =[];

    //Push all unique entries onto arr
    for (var key in feed.entries){
   	   if (!arr.includes(feed.entries[size].recorded_by_name)) {
    	   arr.push(feed.entries[size].recorded_by_name);
       };
       if ((feed.entries).hasOwnProperty(key)) size++;
    }

    $scope.arr = arr;

   });

};


module.exports = ObserversCtrl;
