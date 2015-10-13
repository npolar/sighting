'use strict';
/*service */

// @ngInject
var SightingDBGetAdmin = function($resource){
    return $resource( 'https://api.npolar.no/sighting' , { id:'@id'}, {
    	query: {method: 'GET'}
    	//update: {method: 'PUT'}
    });
};

module.exports = SightingDBGetAdmin;
