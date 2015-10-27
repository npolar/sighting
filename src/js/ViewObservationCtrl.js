'use strict';
/**
 * @ngInject
 */
var ViewObservationCtrl = function ($scope, $routeParams, $controller, Sighting, NpolarApiSecurity) {
  $controller('NpolarBaseController', {$scope: $scope});
  $scope.resource = Sighting;

  let expedition = (sighting) => {
  	  var str = 'Name: ' + sighting.expedition.name
  	  + ' Contact information: ' + sighting.expedition.contact_info
  	  + ' Platform: ' + sighting.expedition.platform
  	  + ' Platform comment: ' + sighting.expedition.platform_comment
  	  + ' Start date: ' + sighting.expedition.start_date
  	  + ' End date: ' + sighting.expedition.end_date
  	  + ' Other infomation: ' + sighting.expedition.other_info;
  	  return str;
  };

  //Call show, get promise
  let show = function() {
  Sighting.fetch($routeParams, (sighting) => {
    $scope.document = sighting;
    $scope.document.expedition = expedition(sighting);
    //Delete field that should not be visible
    delete $scope.document._rev;
    delete $scope.document._id;
    delete $scope.document.schema;
    delete $scope.document.collection;
    delete $scope.document.base;
    delete $scope.document.rights;
    delete $scope.document.rights_holder;
    delete $scope.document.basis_of_record;
    $scope.pic = $scope.document.pictures;
    //Don't want pictures listed twice
    delete $scope.document.pictures;

    //Unless you are admin, don't display these fields
    var isAdmin =  NpolarApiSecurity.hasSystem('https://api.npolar.no/sighting/admin');
    if (!isAdmin) {
        delete $scope.document.editor_assessment;
        delete $scope.document.editor_comment;
        delete $scope.document.created;
        delete $scope.document.updated;
        delete $scope.document.created_by;
        delete $scope.document.updated_by;
    };

    var str2="blue_ter_test";
    var res = str2.replace(/_/g, " ");
    console.log("str ", res);
    console.log($scope.document);

  });
};

  show();

};

module.exports = ViewObservationCtrl;