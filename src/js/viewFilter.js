'use strict';
/**
 * @ngInject
 */
var viewFilter = function ($scope, filterFilter) {
  return function(input, uppercase) {
  	console.log(input);
  	var out = input;
    return out;
  };
};

module.exports = viewFilter;
