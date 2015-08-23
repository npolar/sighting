/* Admin module */

/*Controller for CSV print */
var CSVCtrl = function($scope, CSVService) {
   'use strict';
    $scope.entries = CSVService.entryObject;
};

module.exports = CSVCtrl;
