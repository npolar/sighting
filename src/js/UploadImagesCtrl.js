'use strict';
/* User module */

//Controller for Excel file upload
// @ngInject
var UploadImagesCtrl = function($scope, $http, NpolarApiSecurity, Sighting) {
     $scope.security = NpolarApiSecurity;
    // $scope.pictures = [{filename:'bird2.jpg', content_type:'jpg', content_size:'6534', photographer:'hans olsen',
    // comments:'best img ever!', other_info:'not great!'}];


     // Dataset -> npolarApiResource -> ngResource
    //$scope.resource = Sighting;
    $scope.submit = function() {
       console.log("scope after submit", $scope);
    };


};

module.exports = UploadImagesCtrl;