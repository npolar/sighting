'use strict';

/**
 * @ngInject
 */
var picture = function () {
   return {
      restrict: 'AE',
      require: '?ngModel',
     // templateUrl: './src/js/picture-upload.html',
      link: function(scope, element, attrs, ngModel) {
         console.log("ngModel", ngModel);
      	 console.log(attrs.tester);
      	 console.log("scope", scope);
      	 console.log("scope color", scope.color);
      	 console.log("element", element);


      }
  };
};

module.exports = picture;
