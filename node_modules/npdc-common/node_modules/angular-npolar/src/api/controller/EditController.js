'use strict';
/**
 * NpolarEditController extends [NpolarBaseController](https://github.com/npolar/angular-npolar/blob/master/src/api/controller/BaseController.js) with scope methods for REST-style document editing (using ngResource)
 * and [formula](https://github.com/npolar/formula)-bound controller action methods, like $scope.edit()
 *
 * For following ngResource-bound scope methods are defined
 * - create()
 * - update()
 * - delete()
 * - save()
 *
 * Usage example: https://github.com/npolar/npdc-dataset/blob/ae0dc74d33708c76ac88fc8f0f492ac14759cae7/src/edit/DatasetEditController.js  
 *
 * @ngInject
 */
var EditController = function ($scope, $location, $route, $routeParams, $window, $controller,
  npolarApiConfig, NpolarApiMessage, NpolarApiSecurity, NpolarApiResource) {
  
  // Extend NpolarBaseController
  $controller('NpolarBaseController', {$scope: $scope});

  $scope.formula = {
    template: npolarApiConfig.formula.template || 'default',
    language: null,
    validateHidden: true,
    saveHidden: true,
    onsave: function () {
      $scope.save();
    }
  };

  // Create action, ie. save document and redirect to new URI
  $scope.create = function() {
    $scope.resource.save($scope.document, function(document) {
      let uri = $location.path().replace(/\/__new(\/edit)?$/, '/'+data.id+'/edit');
      $scope.document = document;
      $scope.formula.model = document;
      $location.path(uri);
    });
  };

  // Edit action, ie. fetch document and edit with formula
  $scope.editAction = function() {
    $scope.resource.fetch($routeParams, function(document) {
      $scope.document = document;
      $scope.formula.model = document;
    });
  };

  // New action, ie. create new document and edit with formula
  $scope.newAction = function() {
    $scope.document = new $scope.resource();
    $scope.formula.model = $scope.document;
  };
  
  // Edit (or new) action
  $scope.edit = function() {
    if ($routeParams.id === '__new') {
      $scope.newAction();
    } else {
      $scope.editAction();
    }
  };

  // PUT document, ie resource update
  $scope.update = function() {
    $scope.resource.update($scope.document, function(document) {
      $scope.document = document;
      $scope.formula.model = document;
    });
  };

  // DELETE document, ie. resource remove
  $scope.delete = function() {
    $scope.resource.remove({id: $scope.document.id }, function() {
      $location.path('/');
    });
  };

  // Save document action, ie. create or update
  $scope.save = function() {
    if (angular.isUndefined($scope.document.id)) {
      $scope.create();
    } else {
      $scope.update();
    }
  };
};

module.exports = EditController;