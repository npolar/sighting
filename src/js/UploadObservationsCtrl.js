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





/*'use strict';
// User module

//Controller for Excel file upload
// @ngInject
var UploadImagesCtrl = function($scope, $http, formula,  npolarApiConfig,
 npdcAppConfig, Sighting,  fileFunnelService, NpolarApiSecurity, chronopicService) {
     $scope.security = NpolarApiSecurity;


       $scope.resource = Sighting;

        let templates = [];

  $scope.formula = formula.getInstance({
    schema: '//api.npolar.no/schema/sighting',
    form: 'formula.json',
    templates: npdcAppConfig.formula.templates.concat(templates)
   });

  chronopicService.defineOptions({ match: 'released', format: '{date}'});
  chronopicService.defineOptions({ match(field) {
    return field.path.match(/^#\/activity\/\d+\/.+/);
  }, format: '{date}'});


   function initFileUpload(formula) {

    let server = `${NpolarApiSecurity.canonicalUri($scope.resource.path)}/:id/_file`;
    fileFunnelService.fileUploader({
      match(field) {
        return field.id === "files";
      },
      server,
      multiple: true,
      progress: false,
      restricted: function () {
        return !formula.getModel().license;
      },
      fileToValueMapper: Publication.fileObject,
      valueToFileMapper: Publication.hashiObject,
      fields: [] // 'type', 'hash'
    }, formula);
  }


  try {
    initFileUpload($scope.formula);
    // edit (or new) action
    $scope.edit();
  } catch (e) {
    NpolarMessage.error(e);
  }
}


    //$scope.resource = Sighting;
  //  $scope.submit = function() {
  //     console.log("scope after submit", $scope);
  //  };


};

module.exports = UploadImagesCtrl;*/