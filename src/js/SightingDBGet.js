/*service */

var SightingDBGet = function($resource){
    'use strict';
    return $resource( 'https://data.npolar.no/sighting/:id' , { id:'@id'}, {
    	query: {method: 'GET'}
    	//update: {method: 'PUT'}
    });
};

module.exports = SightingDBGet;
