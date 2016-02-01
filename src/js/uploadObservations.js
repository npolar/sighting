'use strict';

// @ngInject
var uploadObservations = function() {

console.log("directive reached");

return {
      restrict: 'AE',
      templateUrl:'partials/user/upload_observations.html',
      scope: {},    //new isolated scope
     // scope: {
     //    excelobj: '='
     // },
 	  link: function(scope, elem, attrs) {
 	        console.log("uploadDirective");

		    scope.filesChanged = function(e){
		        scope.files=e.files;
		        scope.$apply();
		    };

		    scope.upload = function(e) {
		     	 console.log("upload goes here");
			};
	}


};
};


module.exports = uploadObservations;