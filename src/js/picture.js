'use strict';

/**
 * @ngInject
 */
var picture = function () {
    return {
      restrict: 'A',
      templateUrl: 'partials/user/picture-upload.html',
      scope: {
          pictures: "="
      },
      link: function(scope, elem, attrs) {

      scope.filesChanged = function(e){
        scope.files=e.files;

        //If scope.pictures does not exists, create object
        if (!scope.pictures || scope.pictures === "null" ||  scope.pictures === "undefined") {
           scope.pictures = [];
        }

        //Transfer uploaded pictures to
       // var fileReader = new FileReader();
        for (var i = 0; i < scope.files.length; i++) {
           var obj = {};
           obj.filename = scope.files[i].name;
           obj.content_type = scope.files[i].type;
           obj.content_size = scope.files[i].size;
           obj.the_file = scope.files[i];
           (scope.pictures).push(obj);
        }

         //Update directive page
         scope.$apply(function () {
            //nothing to do, just handle errors via angular
            //console.log("apply", scope);
        });

      };

      }
  };
};


module.exports = picture;
