'use strict';
/* User module */

//Controller for Excel file upload
// @ngInject
var UploadImagesCtrl = function($scope, $http, NpolarApiSecurity, Sighting) {
     $scope.security = NpolarApiSecurity;

     // Dataset -> npolarApiResource -> ngResource
    //$scope.resource = Sighting;
    $scope.submit = function() {
       console.log("scope after submit", $scope);
    };


};

module.exports = UploadImagesCtrl;