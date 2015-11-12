'use strict';

/**
 * @ngInject
 */
var picture = function () {
    return {
      restrict: 'A',
      //require: '?ngModel',
      templateUrl: 'partials/user/picture-upload.html',
      scope: {
          pictures: "=",
          show:"="
      },
      link: function(scope, elem, attrs, ctrl) {
        console.log("SCOPE", scope);
        console.log("ELEM", elem);
        console.log("THIS", angular.element(this));
      //  scope.form = {submitted: false, data: {}};


      scope.filesChanged = function(e){
        scope.files=e.files;
        console.log(scope.show);

        //If scope.pictures does not exists
        if (!scope.pictures || scope.pictures === "null" ||  scope.pictures === "undefined") {
           console.log("create pictures obj");
           scope.pictures = [];
        };

         //Transfer uploaded pictures to
        for (var i = 0; i < scope.files.length; i++) {
           var obj = new Object();
           obj.filename = scope.files[i].name;
           obj.content_type = scope.files[i].type;
           obj.content_size = scope.files[i].size;
           (scope.pictures).push(obj);
        }
        scope.show = "true";
        console.log(scope);
       // scope.apply();
      };

      }
  }
};


module.exports = picture;
