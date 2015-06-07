"use strict";
(function() {

/**
 * npolarApi: Angular 1.x module for the [Npolar API](http://api.npolar.no/)
 */
angular.module("npolarApi", ["ngResource", "base64", "angular-jwt"]);

/**
 * npolarApiConfig, meant to be .run and merged with overrides for the current environment
 *
 * angular.module("myApp").run(function(npolarApiConfig, $http) {
 *   $http.get("/npolar/config.json").success(function(config) {
 *
 *   var environment = config.environment || npolarApiConfig.environment;
 *   angular.extend(npolarApiConfig, _.find(config.config, { environment: environment}));
 *   console.log("npolarApiConfig", npolarApiConfig);
 *
 * }).error(function(response) {
 *   console.log("npolarApiConfig", npolarApiConfig);
 * });
 *
 * });
 *
 */
angular.module("npolarApi").value("npolarApiConfig", {
  environment: "production",
  lang: "en",
  base: "//api.npolar.no",
  security: {
  authorization: "jwt"
  },
  formula: {}
});


/**
 * Authorization interceptor, adds Basic or Bearer tokens to (FIXME: currently all) API requests
 *
 * // Usage:npolarApiError
 * myApp.config(function($httpProvider, npolarApiAuthInterceptorProvider) {
 *  $httpProvider.interceptors.push("npolarApiAuthInterceptor");
 * });
 *
 */
angular.module("npolarApi").factory('npolarApiAuthInterceptor', function ($rootScope, $q, $window, npolarApiConfig, npolarApiSecurity) {
  return {
    request: function (config) {
      // Only intercept Npolar API requests
      if (config.url.indexOf(npolarApiConfig.base) === 0) {
        config.headers = config.headers || {};
        console.log(config.headers);
        if (!config.headers.Authorization) {
          config.headers.Authorization = npolarApiSecurity.authorization();
        }
        console.log(config.method +" "+ config.url, config.params||{}, "[npolarApi]");
        if ("PUT" == config.method) {
          $rootScope.saving = true;
        } else if ("DELETE" == config.method) {
          $rootScope.deleting = true;
        }
      }
      return config;
    },
    response: function (response) {

      if (response.status >= 300 || response.status < 100) {
        console.error(response.status +" "+ response.statusText + " <- "+ response.config.method +" "+ response.config.url + " [npolarApi]");
      }
      if (response.config.method != "GET") {
        console.log(response.status +" "+ response.statusText + " <- "+ response.config.method +" "+ response.config.url + " [npolarApi]");
      }
      if ("PUT" == response.config.method) {
          $rootScope.saving = false;
      } else if ("DELETE" == response.config.method) {
          $rootScope.deleting = false;
      }
      return response || $q.when(response);
    }
  };
});

/**
 *
 *
 *
 *
 *
 */
angular.module("npolarApi").service("npolarApiText", function() {

  // Extract the first capture (1) for all regex matches in text
  this.extract = function(text, regex, capture_capture) {

  var extracted = []
  var m;
  var capture_which_capture = capture_capture || 1;

  while ((m = regex.exec(text)) !== null) {
    if (m.index === regex.lastIndex) {
     regex.lastIndex++;
    }
    extracted.push(m[capture_which_capture]);
  }
  return _.uniq(extracted);
  };

});


// FIXME This service is misnamed and will probably die (it's just a thin session storage wrapper)
angular.module("npolarApi").service('npolarApiUser', function($base64, npolarApiConfig) {


  this.isWriter = function() {
  return $scope.user.name;
  };

  this.getUser = function() {
  var user = sessionStorage.getItem(this.getStorageKey());
  if (angular.isString(user)) {
    return JSON.parse($base64.decode(user));
  } else {
    return {};
  }
  };

  this.setUser = function(user) {
  var key = this.getStorageKey(user);
  sessionStorage.setItem(key, $base64.encode(JSON.stringify(user)));
  }

  this.removeUser = function() {
  sessionStorage.removeItem(this.getStorageKey());
  }

  this.getStorageKey = function(user) {
  return "npolarApiUser";
  }

});

/**
 *
 *
 *
 *
 */
angular.module("npolarApi").service("npolarApiSecurity", function($base64, jwtHelper, npolarApiConfig, npolarApiUser) {

  this.authorization = function(type) {

  var user = npolarApiUser.getUser();

  if ("basic" == npolarApiConfig.security.authorization) {
    return "Basic "+ this.basicToken(user);
  } else if ("jwt" == npolarApiConfig.security.authorization) { // or bearer?
    return "Bearer "+ this.jsonWebToken(user);
  } else {
    console.error("npolarApiSecurity authorization not implemented: " + npolarApiConfig.security.authorization);
    return "";
  }
  };

  this.basicToken = function(user) {
  return $base64.encode(user.username + ':' + user.password);
  };

  this.jsonWebToken = function(user) {
    return user.jwt;
  };

  this.decodeJwt = function(jwt) {
    return jwtHelper.decodeToken(jwt);
  }


  this.user = function(user) {
  // if user not void and valid => setUser
  return this.getUser();
  };

  this.getUser = function() {
  return npolarApiUser.getUser();
  };

  this.setUser = function(user) {
  // if valid... @todo
  return npolarApiUser.setUser(user);
  };

  this.removeUser = function() {
  return npolarApiUser.removeUser();
  };



});

/**
 * NpolarApiBaseController is meant to be the parent of a safe controller,
 * ie. a controller dealing with only with presentation. See also NpolarApiEditController.
 *
 *
 * Usage:
 *
 * angular.module("myApp").controller("MyApiController", function($scope, $routeParams, $controller, MyModel) {
 *
 * // 1. MyApiController -> NpolarApiBaseController
 * $controller("NpolarApiBaseController", {$scope: $scope});
 *
 * // 2. Set resource for parent document operations
 * $scope.resource = MyModel;
 *
 * // 3. Set document for resource (and view)
 * MyModel.fetch($routeParams, function(document) {
 *   $scope.document = document;
 * }, function() error {
 *   $scope.error = error;
 * });
 *
 */
angular.module("npolarApi").controller("NpolarApiBaseController", function($scope, $location, $route, $routeParams, $window, $controller, $http,
  npolarApiConfig, npolarApiSecurity, npolarApiUser, NpolarApiResource) {

  $scope.init = function() {
    $scope.base = npolarApiConfig.base;
    $scope.environment = npolarApiConfig.environment;
    $scope.lang = npolarApiConfig.lang;
    $scope.user = npolarApiSecurity.getUser();
  };

  // back() click handler
  $scope.back = function() {
    $window.history.back();
  };

  $scope.login = function() {
    //console.log("NpolarApiBaseController.login()", $scope.user.username);
    if (!$scope.user.username || !$scope.user.password) {
      return false;
    }
    var url = npolarApiConfig.base+"/user/authenticate/";

    var req = { method: 'GET', url: url,
      headers: { "Authorization": "Basic "+npolarApiSecurity.basicToken($scope.user) } //, data: { test: 'test' }
    };
    $http(req).success(function(data) {

        $scope.user.jwt = data.token;
        $scope.user.name = $scope.user.username;

        //var d = npolarApiSecurity.decodeJwt(data.token);
        // FIXME extract rights
        npolarApiUser.setUser($scope.user);

    }).error(function(error){
      console.error(error);
      $scope.logout();
    });

  };

  $scope.logout = function() {
    npolarApiSecurity.removeUser();
    $scope.user = null;
  }

  $scope.locationBase = function() {
    console.log($routeParams.id);
    if ($routeParams.id == "__new") {
      $location.path("/");
    } else {
      $location.path($routeParams.id);
    }
  }

  // Show action, ie. fetch document and inject into scope
  $scope.show = function() {
  $scope.resource.fetch($routeParams, function(document) {
    $scope.document = document;

  }, function(error) {
    $scope.error = NpolarApiResource.error(error);
  });
  };

  $scope.search = function(query) {
    $scope.resource.feed(query, function(response) {
      $scope.feed = response.feed;
    }, function(error) {
      $scope.error = NpolarApiResource.error(error);
    });
  };

  $scope.getLang = function() {
  return $scope.lang;
  };

  $scope.setLang = function(lang) {
  $scope.lang = lang;
  $scope.title = $scope.getTitle(lang);
  };

  $scope.getTitle = function(lang) {
  return _.where($scope.document.titles,
    { lang: lang }
  )[0].text || $scope.document.titles[0].text;
  };

  $scope.isSuccess = function(status) {
    return (status >= 200 && status <= 299);
  };

  $scope.isError = function(status) {
    return (status <= 99 || status >= 400);
  };

  $scope.init();

});

/**
 * NpolarApiEditController provides methods for manipulating documents (using ngResource)
 * and controller action methods like edit().
 *
 * The following ngResource-bound methods are defined
 * - create()
 * - update()
 * - delete()
 * - save()
 *
 * Usage:
 *
 * angular.module("myApp").controller("MyApiController", function($scope, $routeParams, $controller, MyModel) {
 *
 * // 1. MyApiController -> NpolarApiEditController
 * $controller("NpolarApiBaseController", {$scope: $scope});
 *
 * // 2. Set resource for parent document operations
 * $scope.resource = MyModel;
 *
 * // 3. Set document for resource (and view)
 * MyModel.fetch($routeParams, function(document) {
 *   $scope.document = document;
 *   $scope.formula.model = document;
 * }, function() error {
 *   $scope.error = error;
 * });
 *
 */
angular.module("npolarApi").controller("NpolarApiEditController", function($scope, $location, $route, $routeParams, $window, $controller,
  npolarApiConfig, npolarApiSecurity, NpolarApiResource ) {


  // Extend NpolarApiBaseController
  $controller("NpolarApiBaseController", {$scope: $scope});

  $scope.formula = {
    template: npolarApiConfig.formula.template || "formula",
    language: null,
    model: {},
    onsave: function(model) {
      $scope.save();
    }
  };

  // Create action, ie. save document and reload app
  $scope.create = function() {
    $scope.resource.save($scope.document, function(data) {
      var uri = $location.path().replace(/\/__new\/edit$/, "/"+data.id+"/edit");

      $scope.document = data;
      $location.path(uri);
      //$route.reload();

    }, function(error) {
      $scope.error = error;
    });
  };


  // Edit action, ie. fetch document and edit with formula
  $scope.editAction = function() {

    $scope.resource.fetch($routeParams, function(document) {

      var p, c = 0;
      for(p in document) {
        if (document.hasOwnProperty(p)) {
          ++c;
        }
      }
      console.log(c, document);

      $scope.document = document;
      $scope.formula.model = document;
    }, function(error) {
      $scope.error = NpolarApiResource.error(error);
    });
  };

  // New action, ie. create new document and edit with formula
  $scope.newAction = function() {
    $scope.document = new $scope.resource();
    $scope.formula.model = $scope.document;

  };

  // Edit (or new) action
  $scope.edit = function() {
    if ($routeParams.id == "__new") {
      $scope.newAction();
    } else {
      $scope.editAction(); // from parent
    }
  };

  // PUT document, ie resource update
  $scope.update = function() {

    $scope.resource.update($scope.document, function(data, header) {

      $scope.document = data;
      $scope.info = { header: "Success", message: "Saved document revision #"+data._rev.split("-")[0] +" at " + new Date().toISOString() }

    }, function(error) {
      $scope.info = null;
      $scope.error = error;

    });

  };

  // DELETE document, ie. resource remove
  $scope.delete = function() {

  $scope.resource.remove({id: $scope.document.id }, function(data, header) {

    // $scope.info = { header: "Success", message: "Deleted document revision #"+data._rev.split("-")[0] +" at " + new Date().toISOString() }
    $location.path("/");

  }, function(error) {
    $scope.error = error;
  });
  };

  // Save document, ie. create or update
  $scope.save = function() {
    if (angular.isUndefined($scope.document.id)) {
      $scope.create();
    } else {
      $scope.update();
    }
  };



});

/**
*
*
*/
var npolarResource = angular.module("npolarApi").service("NpolarApiResource", function(npolarApiConfig, npolarApiSecurity, $resource, $location) {

  this.info = function() {
    //return { status: status, statusText: "Npolar API error, failed accessing "+npolarApiConfig.base, data: "Please inform data@npolar.no if this problem persists" };
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
  // response: {data: null, status: 0, headers: function, config: Object, statusText: ""}
  if (error.status >= 400) {
    return error;
  } else {
    var status = (error.status === undefined) ? 500 : error.status ;
    return { status: status, statusText: "Npolar API error, failed accessing "+npolarApiConfig.base, data: "Please inform data@npolar.no if this problem persists" };
  }
  };

  // NpolarApiResource factory
  // @param service e.g. { path: "/dataset", "resource": "Dataset"}
  // @return NpolarApiResource - extended ngResource
  // @todo service.get == null|GET|JSONP
  // @todo make extending ngResource optional
  // @todo Support user-supplied extending
  // @todo Support non-search engine query/array/fetch
  this.resource = function(service) {

    var base = this.base(service);

    // Default parameters
    var params = { id:null, limit: 100, format: "json", q: "", variant: "atom" }

    var fields_feed = (angular.isString(service.fields)) ? service.fields : null ;
    var fields_query = (angular.isString(service.fields)) ? service.fields : 'id,title,name,code,titles,links,created,updated' ;

    var params_feed = angular.extend({}, params, { fields: fields_feed });
    var params_query = angular.extend({}, params, { variant: "array", limit: 1000, fields: fields_query });

    // @todo Store information on which APIs are  used

    var resource = $resource(base+service.path+'/:id', {  }, {
    feed: { method: 'GET', params: params, headers: { Accept:"application/json, application/vnd.geo+json" } },
    query: { method: 'GET', params: params_query, isArray: true },
    array: { method: 'GET', params: params_query, isArray: true },
    fetch: { method: 'GET', params: { }, headers: { Accept:"application/json" } },
    //delete: { method:'DELETE', params: {  }, headers: { Accept:"application/json", Authorization: npolarApiSecurity.authorization() } },
    update: { method:'PUT', params: { id: "@id" }, headers: { Accept:"application/json" } } //
    });

    // Extend Npolar API resources (individual documents)
    angular.extend(resource.prototype, {
    // Usage: var parameter = timeseries._link({rel: "parameter", type: "application/json"});
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

  }
});


/**
 * Adapted from [Stackoverflow?]...
 *
 */
angular.module("npolarApi").directive("npolarJsonText", function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {
      function into(input) {
        //console.log(JSON.parse(input));
        return JSON.parse(input);
      }
      function out(data) {
        return JSON.stringify(data);
      }
      ngModel.$parsers.push(into);
      ngModel.$formatters.push(out);
    }
  };
});


}());