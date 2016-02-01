'use strict';

// @ngInject
var uploadObservations = function() {


 	//templateUrl:'src/partials/user/upload_observations.html',
 //	scope: {
 //      excelobj: '='
 // 	},
 //	link: function(scope, elem, attrs) {
 //        console.log("uploadDirective");
// 	}
console.log("directive reached");

return {
      restrict: 'AE',
      replace: 'true',
      template: '<h3>Hello World!!</h3>'
};


};


module.exports = uploadObservations;