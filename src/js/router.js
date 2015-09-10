/**
 * @ngInject
 */
var router = function($routeProvider, $locationProvider) {
  'use strict';

/*Fix deep linking - ref base tag in index.html */
  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/', {
        templateUrl: './src/partials/open/login.html',
        controller: 'SightingCtrl',
      }).
      when('/observe', {
        templateUrl: './src/partials/open/become_observer.html',
        controller: 'SightingCtrl'
      }).
      when('/learn', {
        templateUrl: './src/partials/open/species.html',
        controller: 'SightingCtrl'
      }).
      when('/observers', {
        templateUrl: './src/partials/open/observers.html',
        controller: 'SightingCtrl'
      }).
      when('/observations', {
        templateUrl: './src/partials/user/my_observations.html',
        controller: 'MyObservationsCtrl'
      }).
      when('/observation', {
        templateUrl: './src/partials/user/new_observation.html',
        controller: 'NewObservationCtrl'
      }).
      when('/observations/:id', {
        templateUrl: './src/partials/user/view_observation.html',
        controller: 'ViewObservationCtrl'
      }).
      when('/observations/edit/:id', {
        templateUrl: './src/partials/user/edit_observation.html',
        controller: 'EditObservationCtrl'
      }).
      /*This entry is for copying old info onto new entries */
      when('/observations/copy/:id', {
        templateUrl: './src/partials/user/new_observation.html',
        controller: 'NewObservationCtrl'
      }).
      when('/observation/delete/:id', {
        templateUrl: './src/partials/user/delete_observation.html',
        controller: 'DeleteObservationCtrl'
      }).
      when('/upload', {
        templateUrl: './src/partials/user/upload.html',
        controller: 'UploadObservationsCtrl'
      }).
      when('/all', {
        templateUrl: './src/partials/admin/all.html',
        controller: 'AdminObservationsCtrl'
      }).
      when('/csv', {
        templateUrl: './src/partials/admin/csv.html',
        controller: 'CSVCtrl'
      }).
       when('/quality_check', {
        templateUrl: './src/partials/admin/quality_check.html',
        controller: 'QualityCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  };


module.exports = router;
