'use strict';
/*Controller not behind login*/

//Get species gallery for images, education/links to NPs home pages.
// @ngInject
var ObserversCtrl = function ($scope,NpolarApiSecurity, SightingDBSearch) {
  $scope.security = NpolarApiSecurity;

  var search = "";
  var temparr = [];
  var arr=[];

    //editor_assessment=unknown means new entries
  $scope.full = SightingDBSearch.get({search:search}, function(){


    // Fetch the lat/lon entries. Have to switch lat/lon for display
    for (var i=0; i< $scope.full.feed.entries.length; i++) {
       temparr.push($scope.full.feed.entries[i].recorded_by);
    }

    //Display only unique names
    for (var j=0;j<temparr.length;j++) {
     if (!arr.includes(temparr[j]) && temparr[j] !== null) {
         arr.push(temparr[j]);
     }
    }
    $scope.arr = arr;

   });


 /* Sighting.feed({ fields: "*"}, response => {
    //$scope.filters = response._filters();
    var feed = response.feed;
     console.log(feed);
    var size = 0,  arr =[];

    //Push all unique entries onto arr
    for (var key in feed.entries){
      if ((feed.entries).hasOwnProperty(key)) {
   	   if (!arr.includes(feed.entries[size].recorded_by_name)) {
    	   arr.push(feed.entries[size].recorded_by_name);
       }
       size++; }
    }

    $scope.arr = arr;

   }); */

};


module.exports = ObserversCtrl;
