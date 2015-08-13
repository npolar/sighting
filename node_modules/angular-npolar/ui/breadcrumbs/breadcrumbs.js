'use strict';

var breadcrumbs = ['version', function (user) {
  /* jshint unused: false */
  return function(scope, elm, attrs) {
    elm.text(JSON.stringify(user));
  };
}];

module.exports = breadcrumbs;
