'use strict';
/*Controller not behind login*/

/* Menu choices */
// @ngInject
var PanelCtrl = function ($location, $scope, NpolarApiSecurity) {

   $scope.security = NpolarApiSecurity;

   this.tab = 'login';

   this.selectTab = function(setTab) {
     this.tab = setTab;
   };

   this.choosePath = function(chooseTab) {
    console.log(chooseTab);
     /* select the right path */
     if (chooseTab === 'observe') {
        $location.path("/observe");
     } else if (chooseTab === 'species'){
        $location.path("/learn");
     } else if (chooseTab === 'observers'){
        $location.path("/observers");
     } else if (chooseTab === 'my_observations"'){
        $location.path("/observations");
     } else if (chooseTab === 'admin'){
        $location.path("/all");
     } else {
        $location.path("/");
     }
   };

   this.isSelected = function(checkTab){
     return this.tab === checkTab;
   };
}; //]);

module.exports = PanelCtrl;
