'use strict';
/* User module */

//Controller for Excel file upload
// @ngInject
var UploadObservationsCtrl = function($scope, $http, NpolarApiSecurity, Sighting) {
     $scope.security = NpolarApiSecurity;

     // Dataset -> npolarApiResource -> ngResource
     $scope.resource = Sighting;

     $scope.recorded_by = (NpolarApiSecurity.getUser()).email;
     $scope.created_by = (NpolarApiSecurity.getUser()).email;

};

module.exports = UploadObservationsCtrl;
