'use strict';
/* User module */

//Controller for Excel file upload
// @ngInject
var UploadImagesCtrl = function($scope, $http, NpolarApiSecurity, Sighting, npolarApiConfig) {
     $scope.security = NpolarApiSecurity;

     // Dataset -> npolarApiResource -> ngResource
    $scope.resource = Sighting;


     $scope.filesChanged = function(e){
        $scope.files=e.files;
        $scope.$apply();
     };

     //Upload files one by one to server
     $scope.upload = function(e) {
        var files = $scope.files;
        console.log(files);
        var uploadUrl = 'https:'+ npolarApiConfig.base + '/sighting/stored_images';

    //Take the first selected file
    for (var i = 0; i < files.length; i++) {
        var fd = new FormData();
        console.log(files[i].name);
        fd.append(files[i].name, files[i]);
       $http.post(uploadUrl, fd, {
         withCredentials: true,
         headers: {'Content-Type': undefined },
         transformRequest: angular.identity
         }).success(function(){
         }).error(function(){
         });
        };
}; //Upload

};

module.exports = UploadImagesCtrl;