'use strict';

/**
 * @ngInject
 */
var LoginController = function ($scope, $http, $location, npolarApiConfig, NpolarApiUser, NpolarApiSecurity) {

  // Login and store user (jwt, name, username, email, uri, uuid, exp, systems)
  $scope.login = function() {
    if (!$scope.user.username || !$scope.user.password) {
      return false;
    }
    // TODO force https
    var url = npolarApiConfig.base+"/user/authenticate/";

    var req = { method: "GET", url: url,
      headers: { "Authorization": "Basic " + NpolarApiSecurity.basicToken($scope.user) }
    };
    $http(req).success(function(data) {

      var token = NpolarApiSecurity.decodeJwt(data.token);

      $scope.user = { name: token.name || $scope.user.username, username: $scope.user.username, jwt: data.token };
      
      NpolarApiUser.setUser($scope.user);

      if (/^http/.test(token.uri)) {
        // Merge user with data from the Person API
        $http.get(token.uri).success(function(person) {
          $scope.user.name = person.first_name+" "+person.last_name;
          $scope.user.email = person.email;
          $scope.user.uri = token.uri;
          $scope.user.uuid = person.uuid;
          $scope.user.exp = token.exp;
          $scope.user.systems = token.systems;
  
          NpolarApiUser.setUser($scope.user);
  
        });
      }


    }).error(function(error){
      console.error(error);
      $scope.logout();
    });

  };

  $scope.logout = function() {
    NpolarApiSecurity.removeUser();
    $scope.user = {};
    $location.path('/');
  };
};

module.exports = LoginController;
