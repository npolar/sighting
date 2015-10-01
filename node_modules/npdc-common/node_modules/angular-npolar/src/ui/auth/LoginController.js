'use strict';

/**
 * @ngInject
 */
var LoginController = function ($scope, $http, $route, $location, $rootScope, $timeout, $interval, npolarApiConfig, NpolarApiUser, NpolarApiMessage, NpolarApiSecurity) {

  const message = NpolarApiMessage;

  const authenticateUri = "https://"+ npolarApiConfig.base.split("//")[1] +"/user/authenticate";

  $scope.security = NpolarApiSecurity;

  // @var response Gouncer response body
  var getErrorMessage = function(response) {

    if (null === response) {

      return message.getMessage(response);

    } else {

      var time = new Date(Date.now()).toJSON();

      return { status: response.status,
        method: "GET",
        uri: authenticateUri,
        time: time,
        body: { error: { explanation: response.error } }
      };
    }

  };

  // After login success: store user in session
  $scope.onLogin = function(data) {

    var token = NpolarApiSecurity.decodeJwt(data.token);
    var expires = new Date(1000*token.exp).toISOString();
    var now = Date.now();

    $scope.user = { name: token.name || $scope.user.username,
      email: token.email || $scope.user.username,
      jwt: data.token,
      uri: token.uri || '',
      expires: expires,
      systems: token.systems || []
    };

    NpolarApiUser.setUser($scope.user);
    message.emit("npolar-login", $scope.user);
    $route.reload();

  };

  // Login (using username and password)
  $scope.login = function() {

    if (!$scope.user.username || !$scope.user.password) {
      return false;
    }
    if (false === (/[@]/).test($scope.user.username)) {
      $scope.user.username = $scope.user.username + "@npolar.no";
    }

    var req = { method: "GET", url: authenticateUri,
      headers: { "Authorization": "Basic " + NpolarApiSecurity.basicToken($scope.user) }
    };
    $http(req).success($scope.onLogin).error(
      response => { message.emit("npolar-api-error", "Login failed"); }
    );
  };

  $scope.logout = function() {
    var who = NpolarApiUser.getUser();
    message.emit("npolar-logout", who);

    $scope.user = {};
    NpolarApiSecurity.removeUser();
    $location.path('/');
    $route.reload();

  };

};

module.exports = LoginController;
