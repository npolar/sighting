'use strict';
/**
 * @ngInject
 */
var ViewObservationCtrl = function ($scope, $routeParams, $controller, Sighting, NpolarApiSecurity, SPECIES) {
  $controller('NpolarBaseController', {$scope: $scope});
  $scope.resource = Sighting;
  $scope.items = SPECIES;

  //Convert latin species' names to english/norwegian
  let species = (sighting) => {
      for (var i = 0; i < SPECIES.length; i++) {
             if (((SPECIES[i].family).toLowerCase()) === $scope.document.species) {
                return (SPECIES[i].eng).toLowerCase() + ' (' + (SPECIES[i].name).toLowerCase() + ')';
             } else {
                return  "undefined";
             }
      }
  };

  let start_date = (sighting) => {
     var start = $scope.document.expedition.start_date;
     return short_date(start);
  };

  let end_date = (sighting) => {
     var end = $scope.document.expedition.end_date;
     return short_date(end);
  };

  let date_identified = (sighting) => {
     return short_date($scope.document.date_identified);
  };

  let event_date = (sighting) => {
        return short_date($scope.document.event_date);
  };

  let created = (sighting) => {
      return short_date($scope.document.created);
  };

  let updated = (sighting) => {
      return short_date($scope.document.updated);
  };

    //Convert from date format ISO8601 to human friendly view
   function short_date(theDate) {
   if (theDate !== "undefined" && theDate !== null && theDate !== "") {
      return  theDate.substr(0,10);
    } else {
      return "";
    }
  }

  //Call show, get promise
  let show = function() {
  Sighting.fetch($routeParams, (sighting) => {
    $scope.document = sighting;
    $scope.document.species = species(sighting);
    $scope.document.date_identified = date_identified(sighting);
    $scope.document.created = created(sighting);
    $scope.document.updated = updated(sighting);
    console.log($scope.document.expedition.start_date);
    $scope.document.expedition.start_date = start_date(sighting);
    $scope.document.expedition.end_date = end_date(sighting);
    $scope.document.event_date = event_date(sighting);


    //Delete field that should not be visible
    delete $scope.document._rev;
    delete $scope.document._id;
    delete $scope.document.schema;
    delete $scope.document.collection;
    delete $scope.document.base;
    delete $scope.document.rights;
    delete $scope.document.rights_holder;
    delete $scope.document.basis_of_record;
    delete $scope.document.language;
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
    }

  });
};

  show();

};

module.exports = ViewObservationCtrl;