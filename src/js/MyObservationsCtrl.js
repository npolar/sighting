'use strict';
/*User module*/


//Fetch from svalbard sightings couch database here the owner's observations
// @ngInject
var MyObservationsCtrl = function($scope, $http, SightingDBGet, npolarApiSecurity, npolarApiConfig) {
   $scope.security = npolarApiSecurity;


    $scope.full = SightingDBGet.get({}, function(){
        console.log($scope.full);
        console.log("user");
    });
};



module.exports = MyObservationsCtrl;

