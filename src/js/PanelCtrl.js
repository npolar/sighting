/*Controller not behind login*/

/* Menu choices */
var PanelCtrl = function ($location) {
   'use strict';
//sightingControllers.controller("PanelCtrl", ['$location', function($location){
   this.tab = 1;

   this.selectTab = function(setTab) {
     this.tab = setTab;
   };

   this.choosePath = function(chooseTab) {
     /* select the right path */
     if (chooseTab === 2) {
        $location.path("/observe");
     } else if (chooseTab === 3){
        $location.path("/learn");
     } else if (chooseTab === 4){
        $location.path("/observers");
     } else if (chooseTab === 5){
        $location.path("/photos");
     } else if (chooseTab === 6){
        $location.path("/stats");
     } else if (chooseTab === 7){
        $location.path("/docs");
     } else if (chooseTab === 8){
        $location.path("/observations");
     } else if (chooseTab === 9){
        $location.path("/all");
     } else if (chooseTab === 10){
        $location.path("/observation");
     } else if (chooseTab === 11){
        $location.path("/upload");
     } else if (chooseTab === 12){
        $location.path("/profile");
     } else if (chooseTab === 13){
        $location.path("/maps");
     } else {
        $location.path("/");
     }
   };

   this.isSelected = function(checkTab){
     return this.tab === checkTab;
   };
}; //]);

module.exports = PanelCtrl;
