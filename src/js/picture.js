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


      scope.filesChanged = function(e){
        scope.files=e.files;
        console.log(scope.show);

        //If scope.pictures does not exists
        if (!scope.pictures || scope.pictures === "null" ||  scope.pictures === "undefined") {
           console.log("create pictures obj");
           scope.pictures = [];
        }

        //Transfer uploaded pictures to
        var fileReader = new FileReader();
        for (var i = 0; i < scope.files.length; i++) {
          console.log("files", scope.files[i]);
           var obj = new Object();
           obj.filename = scope.files[i].name;
           obj.content_type = scope.files[i].type;
           obj.content_size = scope.files[i].size;
           obj.the_file = scope.files[i];
           (scope.pictures).push(obj);
        }

         //Update directive page
         scope.$apply(function () {
            scope.show = "true";
            console.log(scope);
        });

      };

      }
  };
};


module.exports = picture;
