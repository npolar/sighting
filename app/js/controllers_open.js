


//Get species gallery for images, education/links to NPs home pages.
sightingControllers.controller('SightingCtrl', function( $scope, $http, npolarApiSecurity, SightingDBGet, Species_GalleryService, npolarApiConfig) {
   'use strict';
   $scope.security = npolarApiSecurity;
   this.species = Species_GalleryService;

   $scope.full = SightingDBGet.get({}, function(){
        console.log($scope.full);
        console.log("open");
    });
 });

  /* $http.jsonp('http://api.npolar.no/sighting/?q=&facets=recorded_by&size-facet=1000&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
     $scope.full = data;
   }); */



/* Menu choices  mobile menu*/
sightingControllers.controller("PanelCtrl", ['$location', function($location){
   'use strict';
   this.tab = 1;

   this.selectTab = function(setTab) {
     this.tab = setTab;
   };

   this.choosePath = function(chooseTab) {
     /* select the right path */
     if (chooseTab === 'observer') {
        $location.path("/observe");
     } else if (chooseTab === 'learn'){
        $location.path("/learn");
     } else if (chooseTab === 'observers'){
        $location.path("/observers");
     } else if (chooseTab === 'observations'){
        $location.path("/observations");
     } else if (chooseTab === 'all'){
        $location.path("/all");
     } else {
        $location.path("/");
     }
   };

   this.isSelected = function(checkTab){
     return this.tab === checkTab;
   };
}]);


//Update entry from Svalbard MMS couch database here
sightingControllers.controller('LoginCtrl', ['$scope', 'jwtHelper', 'npolarApiSecurity', function($scope, jwtHelper, npolarApiSecurity) {


}]);
