  'use strict';

// @ngInject
var router = function($routeProvider, $locationProvider) {

/*Fix deep linking - ref base tag in index.html */
  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/', {
        templateUrl: 'partials/open/login.html',
        controller: 'SightingCtrl',
      }).
      when('/observe', {
        templateUrl: 'partials/open/become_observer.html',
        controller: 'SightingCtrl'
      }).
      when('/learn', {
        templateUrl: 'partials/open/species.html',
        controller: 'SightingCtrl'
      }).
      when('/observers', {
        templateUrl: 'partials/user/observers.html',
        controller: 'ObserversCtrl'
      }).
      when('/observations', {
        templateUrl: '/partials/user/my_observations.html',
        controller: 'MyObservationsCtrl'
      }).
      when('/observations/:id', {
        templateUrl: 'partials/user/view_observation.html',
        controller: 'ViewObservationCtrl'
      }).
      when('/observations/:id/edit', {
        templateUrl: 'partials/user/edit_observation.html',
        controller: 'EditObservationCtrl'
      }).
      when('/observation/delete/:id', {
        templateUrl: 'partials/user/delete_observation.html',
        controller: 'DeleteObservationCtrl'
      }).
      when('/upload', {
        templateUrl: 'partials/user/upload.html',
        controller: 'UploadObservationsCtrl'
      }).
      when('/all', {
        templateUrl: 'partials/admin/all.html',
        controller: 'AdminObservationsCtrl'
      }).
      when('/csv', {
        templateUrl: 'partials/admin/csv.html',
        controller: 'CSVCtrl'
      }).
       when('/quality_check', {
        templateUrl: 'partials/admin/quality_check.html',
        controller: 'QualityCtrl'
      }).
      otherwise({
       // redirectTo: '/'
        templateUrl: 'partials/open/login.html',
        controller: 'SightingCtrl'
      });
  };


module.exports = router;
