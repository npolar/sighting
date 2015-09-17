'use strict';
/* User module */

//Controller for Excel file upload
// @ngInject
var UploadObservationsCtrl = function($scope, $http) {


     $scope.filesChanged = function(elm){
        $scope.files=elm.files;
        $scope.$apply();
       // console.log($scope.files);
     };
     $scope.upload = function() {
        //var fd = new FormData();

      /*  angular.forEach($scope.files, function(file){
          fd.append('file',file);
        });

        console.log(fd);

        $http.post('https://apptest.data.npolar.no:4444/upload_excel', fd,
        {
          transformrequest:angular.identity,
          headers:{'Content-Type':'multipart/form-data'}
        } )
        .success(function(data, status, headers, config) {
         console.log('success: ' + data);

        })
        .error(function(data, status, headers, config) {
         console.log('error' + data);
        }); */
   };
};


module.exports = UploadObservationsCtrl;
