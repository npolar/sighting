'use strict';


//Get species gallery for images, education/links to NPs home pages.
sightingControllers.controller('SightingCtrl', ['$scope', '$http', function( $scope, $http) {
   this.species = species_gallery;

   //Get observers
   $http.jsonp('http://apptest.data.npolar.no:9000/sighting/?q=&facets=created_by&size-facet=1000&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
     $scope.full = data;
    // console.log("----", $scope.full);
   });
}]);

var species_gallery = [
{
    name: 'Hvalross',
    eng: 'Walrus',
    family: 'Odobenus rosmarus',
    image:  'img/species/hvalross.jpg',
    link: 'http://www.npolar.no/en/species/walrus.html',
    rights: 'Tor Ivan Karlsen / Norwegian Polar Institute'
},
{
    name: 'Ringsel',
    eng: 'Ringed seal',
    family: 'Pusa hispida',
    image:  'img/species/ringsel.jpg',
    link: 'http://www.npolar.no/en/species/ringed-seal.html',
    rights: 'Kit Kovacs / Norwegian Polar Institute'
},
{
    name: 'Storkobbe',
    eng: 'Bearded seal',
    family: 'Erignathus barbatus',
    image: 'img/species/storkobbe.jpg',
    link: 'http://www.npolar.no/en/species/bearded-seal.html',
    rights: 'Inger Lise Næss / Norwegian Polar Institute'
},
{
    name: 'Steinkobbe',
    eng: 'Harbor seal',
    family: 'Phoca vitulina',
    image:  'img/species/steinkobbe.jpg',
    link: 'http://www.npolar.no/en/species/harbour-seal.html',
    rights: 'Kit Kovacs / Norwegian Polar Institute'
},
{
    name: 'Klappmyss',
    eng: 'Hooded seal',
    family: 'Cystophora cristata',
    image:  'img/species/klappmyss.jpg',
    link: 'http://www.npolar.no/en/species/hooded-seal.html',
    rights: 'Norwegian Polar Institute'
},
{
  name: 'Grønlandssel',
    eng: 'Harp seal',
    family: 'Phoca groenlandica',
    image:  'img/species/gronlandssel.jpg',
    link: 'http://www.npolar.no/en/species/harp-seal.html',
    rights: 'G. Bangjord / Norwegian Polar Institute'
},
{
  name: 'Isbjørn',
    eng: 'Polar bear',
    family: 'Ursus maritimus',
    image:  'img/species/isbjorn.jpg',
    link: 'http://www.npolar.no/en/species/polar-bear.html',
    rights: 'Ann Kristin Balto / Norwegian Polar Institute'
},
{  name: 'Blåhval',
    eng: 'Blue whale',
    family: 'Balaenoptera musculus',
    image:  'img/species/blahval.jpg',
    link: 'http://www.npolar.no/en/species/blue-whale.html',
    rights: 'http://commons.wikimedia.org/wiki/File:Blue_Whale_001_body_bw.jpg, NOAA Fisheries, Tom Bjørnstad'
},
{ name: 'Grønlandshval',
    eng: 'Bowhead whale',
    family: 'Balaena mysticetus',
    image:  'img/species/gronlandshval.jpg',
    link: 'http://www.npolar.no/en/species/bowhead-whale.html',
    rights: 'Norwegian Polar Institute'
},
{ name: 'Knølhval',
    eng: 'Humpback whale',
    family: 'Megaptera novaeangliae',
    image:  'img/species/knolhval.jpg',
    link: 'http://www.npolar.no/en/species/humpback-whale.html',
    rights: 'tromsofoto.net - it this ok??'
},
{ name: 'Hvithval',
    eng: 'Beluga whale',
    family: 'Delphinapterus leucas',
    image:  'img/species/hvithval.jpg',
    link: 'http://www.npolar.no/en/species/white-whale.html',
    rights: 'E. Johansen / Norwegian Polar Institute'
},
{ name: 'Vågehval',
    eng: 'Common minke whale',
    family: 'Cystophora cristata',
    image:  'img/species/klappmyss.jpg',
    link: 'http://www.npolar.no/en/species/minke-whale.html',
    rights: 'Norwegian Polar Institute'
},
{ name: 'Finnhval',
    eng: 'Fin whale',
    family: 'Balaenoptera physalus',
    image:  'img/species/finnhval.jpg',
    link: 'http://www.npolar.no/en/species/fin-whale.html',
    rights: 'Aqqa Rosing-Asvid, http://en.wikipedia.org/wiki/Fin_whale#mediaviewer/File:Finhval.jpg'
},
{ name: 'Spekkhugger',
    eng: 'Killer whale',
    family: 'Orcinus orca',
    image:  'img/species/spekkhugger.jpg',
    link: 'http://www.npolar.no/en/species/killer-whale.html',
    rights: 'Robert Pittman, http://www.afsc.noaa.gov/Quarterly/amj2005/divrptsNMML3.htm'
},
{ name: 'Narhval',
    eng: 'Narwhal',
    family: 'Monodon monoceros',
    image:  'img/species/narhval.jpg',
    link: 'http://www.npolar.no/en/species/narwhal.html',
    rights: 'Glenn Williams, National Institute of Standards and Technology, http://commons.wikimedia.org/wiki/File:Narwhals_breach.jpg'
},
{ name: 'Grindhval',
    eng: 'Long-finned pilot whale',
    family: 'Globicephala melas',
    image:  'img/species/grindhval.jpg',
    link: 'http://www.npolar.no/en/species/pilot-whale.html',
    rights: '"Pilot whale spyhop" by Barney Moss - Watching Whales 4. Licensed under CC BY 2.0 via Wikimedia Commons - http://commons.wikimedia.org/wiki/File:Pilot_whale_spyhop.jpg#mediaviewer/File:Pilot_whale_spyhop.jpg'
},
{ name: 'Nebbhval',
    eng: 'Northern northern-bottlenose-whale',
    family: 'Cystophora cristata',
    image:  'img/species/nebbhval.jpg',
    link: 'http://www.npolar.no/en/species/northern-bottlenose-whale.html',
    rights: 'NOAA Photo Library / National Oceanic and Atmospheric'
},
{ name: 'Kvitnos',
    eng:'White beaked dolphin',
    family: 'Lagenorhynchus albirostris',
    image:  'img/species/kvitnos.jpg',
    link: 'http://www.npolar.no/en/species/white-beaked-dolphin.html',
    rights: 'Hannah Beker,  http://commons.wikimedia.org/wiki/File:White_beaked_dolphin.jpg'
},
{ name: 'Spermhval',
    eng: 'Sperm whale',
    family: 'Physeter macrocephalus',
    image:  'img/species/spermhval.jpg',
    link: 'http://www.npolar.no/en/species/sperm-whale.html',
    rights: 'Gabriel Barathieu, http://commons.wikimedia.org/wiki/File:Mother_and_baby_sperm_whale.jpg'
},
{ name: 'Seihval',
    eng: 'Sei whale',
    family: 'Balaenoptera borealis',
    image:  'img/species/klappmyss.jpg',
    link: 'http://www.npolar.no/en/species/sei-whale.html',
    rights: ''
},
];



/* Menu choices */
sightingControllers.controller("PanelCtrl", ['$location', function($location){
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
}]);


//Fetch entry from svalbard sightings couch database here
sightingControllers.controller('MapCtrl', ['$scope', '$http', 'leafletData',
 function($scope, $http, leafletData) {
    $scope.items = species_gallery;

    var markers = [];


    /* Setting up the map  */
    angular.extend($scope, {
      center: {
                    lat: 78.000,
                    lng: 16.000,
                    zoom: 4
      },
      layers: {
        tileLayer: "http://tilestream.data.npolar.no/v2/WorldHax/{z}/{x}/{y}.png",
        maxZoom: 14
      },
      controls: {
        draw: { position : 'topleft',
        polygon : false,
        polyline : false,
        rectangle : true,
        circle : false,
        marker: false }
      }
  });

  /*Draw a rectangle on the map to get coordinates from */
  leafletData.getMap().then(function(map) {
        var drawnItems = $scope.controls.edit.featureGroup;
        //console.log($scope.controls);
        map.on('draw:created', function (e) {
                var layer = e.layer;
                drawnItems.addLayer(layer);

                var res = (layer.toGeoJSON()).geometry.coordinates;

                /*fetch zero and second coordinate pair to get a rectangle */
                $scope.lat1= res[0][0][0];
                $scope.lng1= res[0][0][1];
                $scope.lat2= res[0][2][0];
                $scope.lng2= res[0][2][1];
        });
  });


 /* Execute this function when search button is pressed */
 $scope.submit = function() {

    /* First find out which paramaters are not empty */
    var sok = ''; var lat = ''; var lng = ''; var edate = '';


    /* If event_date exists */
    if (typeof $scope.event_date1 != "undefined" && $scope.event_date1 != "") {
           /*Remember to transform into the correct format*/
           edate = '&filter-event_date=' + convertDate($scope.event_date1) + '..';

           if (typeof $scope.event_date2 != "undefined" && $scope.event_date2 != "") {
               /*Transform edate to correct format*/
               edate = edate + convertDate($scope.event_date2);

           }
    /*Else if lat2 exists */
    } else if (typeof $scope.event_date2 != "undefined" && $scope.event_date2 != "") {
               /*Transform edate to correct format*/
               edate = '&filter-event_date=..' + convertDate($scope.event_date2);
    }


    /* If lat1 exists */
    if (typeof $scope.lat1 != "undefined" && $scope.lat1 != "") {
           lat = '&filter-latitude=' + $scope.lat1 + '..';
           console.log(lat);
           if (typeof $scope.lat2 != "undefined" && $scope.lat2 != "") {
               lat = lat + $scope.lat2;
           }
    /*Else if lat2 exists */
    } else if (typeof $scope.lat2 != "undefined" && $scope.lat2 != "") {
               lat = '&filter-latitude=..' + $scope.lat2;
    }

    /* If lng1 exists */
    if (typeof $scope.lng1 != "undefined" && $scope.lng1 != "") {
           lat = '&filter-longitude=' + $scope.lng1 + '..';

           if (typeof $scope.lng2 != "undefined" && $scope.lng2 != "") {
               lat = lat + $scope.lng2;

           }
    /*Else if lng2 exists */
    } else if (typeof $scope.lng2 != "undefined" && $scope.lng2 != "") {
               lng = '&filter-longitude=..' + $scope.lng2;

    }

    /*Include species */
    if (typeof $scope.species != "undefined") {
           sok = sok + '&filter-species=' + $scope.species.family;
           sok = sok.replace(/ /g,"+");
    };

    /*Sum up the query */
    sok=sok+lat+lng+edate;

    //console.log(sok);

    $http.jsonp('http://apptest.data.npolar.no/sighting/?q='+ sok
      +'&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {

      //console.log($scope);

    /* Fetch the lat/lon entries. Have to switch lat/lon for display */
    for (var i=0; i< data.feed.entries.length; i++) {
       markers.push({
                lat: parseFloat(data.feed.entries[i].longitude),
                lng: parseFloat(data.feed.entries[i].latitude),
                focus: true,
                draggable: false,
                message: data.feed.entries[i].locality
       });
    };

    //Display markers on map
    $scope.markers = markers;

    //Reset for next search
    markers = [];

    //Display data for all entries
    $scope.entries = data.feed.entries;

  })};


}]);


/*Convert to the search date format */
function convertDate(idate) {
          console.log(idate);
           var temp_date = idate.substring(0,4) + '-' + idate.substring(5,7) + '-' +idate.substring(8,10);
           temp_date += 'T00:00:00.000';
           //console.log(temp_date);
           return temp_date;
}


//Update entry from Svalbard MMS couch database here
sightingControllers.controller('LoginCtrl', ['$scope', 'jwtHelper', 'npolarApiSecurity', function($scope, jwtHelper, npolarApiSecurity) {


    /* Angular-jwt */
    //var expToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6ImZhY2Vib29rfDEwMTU0Mjg3MDI3NTEwMzAyIiwiYXVkIjoiQlVJSlNXOXg2MHNJSEJ3OEtkOUVtQ2JqOGVESUZ4REMiLCJleHAiOjE0MTIyMzQ3MzAsImlhdCI6MTQxMjE5ODczMH0.7M5sAV50fF1-_h9qVbdSgqAnXVF7mz3I6RjS6JiH0H8';
    //$scope.tokenPayload = jwtHelper.decodeToken(expToken);
    //$scope.date = jwtHelper.getTokenExpirationDate(expToken);
    //$scope.bool = jwtHelper.isTokenExpired(expToken);

}]);











