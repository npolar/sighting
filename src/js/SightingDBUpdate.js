'use strict';
/*service */

// @ngInject
var SightingDBUpdate = function($resource){
    return $resource( 'https://apptest.data.npolar.no/sighting/:id' , { id:'@id'}, {
    	query: {method: 'GET'}
    	//update: {method: 'PUT'}
    });
};

module.exports = SightingDBUpdate;
