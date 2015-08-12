/* Admin module */

/*Controller for CSV print */
var CSVCtrl = function($scope, CSVService) {
    $scope.entries = CSVService.entryObject;
}

module.exports = CSVCtrl;
