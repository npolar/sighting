'use strict';
/* User module */

//Controller for Excel file upload
// @ngInject
var UploadImagesCtrl = function($scope, $http, NpolarApiSecurity, Sighting) {
     $scope.security = NpolarApiSecurity;

     // Dataset -> npolarApiResource -> ngResource
    //$scope.resource = Sighting;
    $scope.color = "red";
    $scope.format = 'M/d/yy h:mm:ss a';

};

module.exports = UploadImagesCtrl;