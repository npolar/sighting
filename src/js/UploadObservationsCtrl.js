'use strict';
/* User module */

//Controller for Excel file upload
// @ngInject
var UploadObservationsCtrl = function($scope, $http, NpolarApiSecurity) {
    $scope.security = NpolarApiSecurity;


     $scope.filesChanged = function(elm){
        $scope.files=elm.files;
        console.log($scope.files);
        $scope.$apply();
     };

     $scope.upload = function(elm) {
        console.log($scope.files);

        var fd = new FormData();
        elm.forEach($scope.files, function(file){
          fd.append('file',file);
        });

        console.log(fd);

        $http.post('https://apptest.data.npolar.no:4444/upload_excel', fd,
        {
          transformrequest:elm.identity,
          headers:{'Content-Type':'multipart/form-data'}
        } )
        .success(function(data, status, headers, config) {
         console.log('success: ' + data);

        })
        .error(function(data, status, headers, config) {
         console.log('error' + data);
        });
   };
};


module.exports = UploadObservationsCtrl;
