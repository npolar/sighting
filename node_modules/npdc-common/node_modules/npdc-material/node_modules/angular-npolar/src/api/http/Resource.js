'use strict';
var angular = require('angular');
var _ = require('lodash'); //@todo eliminate

/**
 * @ngInject
 */
var Resource = function($resource, $location, $log, npolarApiConfig, NpolarApiSecurity) {
  
  // @return Array of path segments "under" the current request URI
  let pathSegments = function() {
    // Split request URI into parts and remove hostname & appname from array [via the slice(2)]
    return $location.absUrl().split("//")[1].split("?")[0].split("/").filter(s => { return s !== "";}).slice(2);
  };
  
  // Get href for id [warn:] relative to current application /path/
  // @return href 
  this.href = function(id) { 
    // Add .json if id contains dots, otherwise the API barfs
    if ((/[.]/).test(id)) {
      id += ".json";
    }
    let segments = pathSegments();
    
    // For apps at /something, we just need to link to the id
    if (segments.length === 0) {
      return id;
    
    // For /cat app with children like /cat/lynx we need to link to `lynx/${id}`
    } else {
      return segments.join("/")+'/'+id;
    }
  };
  
  this.editHref = function() {
    return pathSegments().join('/')+'/edit';
  };
  
  this.newHref = function() {
    return pathSegments().join('/')+'/__new/edit';
  };
  
  this.base = function(service) {
    return (angular.isString(service.base)) ? service.base : npolarApiConfig.base;
  };

  /**
   * Generic error handler
   *
   *  MyResource.feed(angular.extend({ limit: 10 }, $location.search()), function(response) {
   *    $scope.feed = response.feed;
   *  }, function(error) {
   *    $scope.error = NpolarApiResource.error(error);
   *  });
   */
  this.error = function(error) {
  // response: {data: null, status: 0, headers: function, config: Object, statusText: ''}
  if (error.status >= 400) {
    return error;
  } else {
    var status = (error.status === undefined) ? 500 : error.status ;
    return { status: status, statusText: 'Npolar API error, failed accessing '+npolarApiConfig.base, data: 'Please inform data@npolar.no if this problem persists' };
  }
  };

  // NpolarApiResource factory
  // @param service e.g. { path: '/dataset', 'resource': 'Dataset'}
  // @return NpolarApiResource - extended ngResource
  // @todo service.get == null|GET|JSONP
  // @todo make extending ngResource optional
  // @todo Support user-supplied extending
  // @todo Support non-search engine query/array/fetch
  this.resource = function(service) {

    var base = this.base(service);

    // Default parameters
    var params = { id:null, limit: 100, format: 'json', q: '', variant: 'atom' };

    //var fields_feed = (angular.isString(service.fields)) ? service.fields : null ;
    var fields_query = (angular.isString(service.fields)) ? service.fields : 'id,title,name,code,titles,links,created,updated' ;

    //var params_feed = angular.extend({}, params, { fields: fields_feed });
    var params_query = angular.extend({}, params, { variant: 'array', limit: 1000, fields: fields_query });

    var resource = $resource(base+service.path+'/:id', {  }, {
      feed: { method: 'GET', params: params, headers: { Accept:'application/json, application/vnd.geo+json' }, cache: true },
      query: { method: 'GET', params: params_query, isArray: true, cache: true},
      array: { method: 'GET', params: params_query, isArray: true, cache: true },
      fetch: { method: 'GET', params: { }, headers: { Accept:'application/json' }, cache: true },
      //delete: { method:'DELETE', params: {  }, headers: { Accept:'application/json', Authorization: NpolarApiSecurity.authorization() } },
      update: { method:'PUT', params: { id: '@id' }, headers: { Accept:'application/json' } }
    });
    
    resource.path = base+service.path;
    
    resource.href = this.href;
    resource.newHref = this.newHref;
    resource.editHref = this.editHref;
    
    // Extend Npolar API resources (individual documents)
    angular.extend(resource.prototype, {
      
    // Usage: var parameter = timeseries._link({rel: 'parameter', type: 'application/json'});
    _link: function(link) {
      return _.find(this.links, link);
    },
    _links: function(link) {
      return _.select(this.links, link);
    },
    // @todo injectable resoiurce dereferencing...
    // @tods lambda functions on link/links
    _filters: function() {
      var filters = [];
      angular.forEach($location.search(), function(v,k) {
      if (k.match(/^filter-\w+/)) {
        var f = {};
        f[k]=v;
        filters.push(f);
      }
      });
      return filters;

    }

    });
    return resource;

  };
};

module.exports = Resource;