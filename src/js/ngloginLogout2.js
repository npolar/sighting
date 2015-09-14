'use strict';

/**
 * @ngInject
 */
var ngloginLogout2 = function (NpolarApiSecurity, npolarApiConfig, $http) {
  return {
   scope: {},
   controller: 'NpolarLoginController',
   templateUrl: 'partials/open/_myuser.html',
   link: function(scope) {

      scope.user = NpolarApiSecurity.getUser();
      scope.edits = [];

      //let editlog = `${npolarApiConfig.base}/editlog/?sort=-request.time&q=&filter-request.authorization=Bearer&filter-request.username=conrad&fields=method,request.time,endpoint,response.header.Location&filter-response.status=200..299&format=json&variant=array&limit=5`;
      //$http.get(editlog).success(response => {
      //  console.log(response);
      //  scope.edits = response;
      //});
   }
  };
};

module.exports = ngloginLogout2;
