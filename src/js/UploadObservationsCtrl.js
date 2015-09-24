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
        var XLSX = require('js-xlsx');

        var files = $scope.files;
        var i,f;


        for (i = 0, f = files[i]; i !== files.length; ++i) {
          var reader = new FileReader();
          //  var name = f.name;
            reader.onload = (function(theFile){
              var fileName = theFile.name;
              return function(e){
                 var data = e.target.result;
                 var workbook = XLSX.read(data, {type: 'binary'});
                  //Read first workbook
                 var sheet_name_list = workbook.SheetNames;
                 sheet_name_list.forEach(function(y) { // iterate through sheets
                    var worksheet = workbook.Sheets[y];
                    for (var z in worksheet) {
                    // all keys that do not begin with "!" correspond to cell addresses
                        if(z[0] === '!') continue;
                        console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
                    }
}               );
              };
            })(f);
          reader.readAsBinaryString(f);

   }
};
};


module.exports = UploadObservationsCtrl;
