'use strict';

/**
 * @ngInject
 */
var picture = function () {
   return {
      restrict: 'A',
      transclude: false,
      templateUrl: '/src/js/picture-upload.html'
  };
};

module.exports = picture;
