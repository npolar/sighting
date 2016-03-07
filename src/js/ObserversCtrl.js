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

};


module.exports = ObserversCtrl;
