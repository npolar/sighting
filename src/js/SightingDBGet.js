'use strict';
/*service */

// @ngInject
var SightingDBGet = function($resource){
    return $resource( 'https://data.npolar.no/sighting/:id' , { id:'@id'}, {
    	query: {method: 'GET'}
    	//update: {method: 'PUT'}
    });
};

module.exports = SightingDBGet;
