'use strict';
//service

// @ngInject

var SightingDBSearch = function($resource,  npolarApiConfig){
	//return $resource( 'https:' + npolarApiConfig.base + '/sighting/?:search&format=json&locales=utf-8' , { search:'@search'}, {
	return $resource( 'https:' + npolarApiConfig.base + '/sighting/?q=:search&format=json&locales=utf-8' , { search:'@search'}, {
    query: {method: 'GET'}
    });
};

module.exports = SightingDBSearch;
