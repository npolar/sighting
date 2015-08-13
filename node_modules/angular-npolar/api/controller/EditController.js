/**
 * NpolarEditController provides methods for manipulating documents (using ngResource)
 * and controller action methods like edit().
 *
 * The following ngResource-bound methods are defined
 * - create()
 * - update()
 * - delete()
 * - save()
 *
 * Usage:
 *
 * angular.module('myApp').controller('MyApiController', function($scope, $routeParams, $controller, MyModel) {
 *
 * // 1. MyApiController -> NpolarEditController
 * $controller('NpolarBaseController', {$scope: $scope});
 *
 * // 2. Set resource for parent document operations
 * $scope.resource = MyModel;
 *
 * // 3. Set document for resource (and view)
 * MyModel.fetch($routeParams, function(document) {
 *   $scope.document = document;
 *   $scope.formula.model = document;
 * }, function() error {
 *   $scope.error = error;
 * });
 *
 */

'use strict';
var angular = require('angular');

/**
 * @ngInject
 */
var EditController = function ($scope, $location, $route, $routeParams, $window, $controller,
  npolarApiConfig, NpolarApiSecurity, NpolarApiResource) {


  // Extend NpolarBaseController
  $controller('NpolarBaseController', {$scope: $scope});

  $scope.formula = {
    template: npolarApiConfig.formula.template || 'formula',
    language: null,
    model: {},
    onsave: function () {
      $scope.save();
    }
  };

  // Create action, ie. save document and reload app
  $scope.create = function() {

    $scope.resource.save($scope.document, function(data) {
      var uri = $location.path().replace(/\/__new(\/edit)?$/, '/'+data.id+'/edit');

      $scope.document = data;
      $location.path(uri);
      //$route.reload();

    }, function(error) {
      $scope.error = error;
    });
  };


  // Edit action, ie. fetch document and edit with formula
  $scope.editAction = function() {

    $scope.resource.fetch($routeParams, function(document) {

      $scope.document = document;
      $scope.formula.model = document;
    }, function(error) {
      $scope.error = NpolarApiResource.error(error);
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

    $scope.resource.update($scope.document, function(data) {

      $scope.document = data;
      $scope.info = { header: 'Success', message: 'Saved document revision #'+data._rev.split('-')[0] +' at ' + new Date().toISOString() };

    }, function(error) {
      $scope.info = null;
      $scope.error = error;

    });

  };

  // DELETE document, ie. resource remove
  $scope.delete = function() {

  $scope.resource.remove({id: $scope.document.id }, function() {

    // $scope.info = { header: 'Success', message: 'Deleted document revision #'+data._rev.split('-')[0] +' at ' + new Date().toISOString() }
    $location.path('/');

  }, function(error) {
    $scope.error = error;
  });
  };

  // Save document, ie. create or update
  $scope.save = function() {
    if (angular.isUndefined($scope.document.id)) {
      $scope.create();
    } else {
      $scope.update();
    }
  };
};

module.exports = EditController;
