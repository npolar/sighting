'use strict';
/* User module */

//Controller for Excel file upload
// @ngInject
var UploadImagesCtrl = function($scope, $http, NpolarApiSecurity, Sighting) {
     $scope.security = NpolarApiSecurity;
     console.log("controller");
   //  $scope.pictures = [{filename:'bird2.jpg', content_type:'jpg', content_size:'6534', photographer:'hans olsen',
   //  comments:'best img ever!', other_info:'not great!'}];
   //  console.log($scope.pictures);
     if ($scope.pictures && $scope.pictures !== "null" &&  $scope.pictures !== "undefined") {
         $scope.show = "true";
     } else {
         $scope.show = "false";
     };

     // Dataset -> npolarApiResource -> ngResource
    //$scope.resource = Sighting;
    $scope.submit = function() {
       console.log($scope);
       console.log("submit");
    };


};

module.exports = UploadImagesCtrl;