'use strict';



//Service replaces $HTTP service
var sightingServices = angular.module('sightingServices', ['ngResource']);

sightingServices.factory('SightingDBUpdate', ['$resource',
  function($resource){
    return $resource('https://apptest.data.npolar.no/sighting/:id', { id:'@id'}, {
    	query: {method: 'GET'} //,
    	//update: {method: 'PUT'}
    });
}]);

/*Service to get CSV post*/
sightingServices.factory('CSVService', function () {
    return {entryObject: {data: null} }
});
