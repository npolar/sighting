  'use strict';
/*Admin module*/

/* Respond to search to get relevant entries */
/* First respond to squares drawn */
// @ngInject
var AdminObservationsCtrl = function($scope, $http, SPECIES, CSVService, NpolarApiSecurity, Sighting) {

  $scope.security = NpolarApiSecurity;
  $scope.species = SPECIES;

  var L = require('leaflet');
  L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';
  require('leaflet-draw');
  require('elasticsearch');



          //Remove old map before reloading
      //  if (map !== undefined) { map.remove(); }

      var url = 'http://tilestream.data.npolar.no/v2/WorldHax/{z}/{x}/{y}.png',
      attrib = '&copy; <a href="http://openstreetmap.org/copyright">Norwegian Polar Institute</a>',
      tiles = L.tileLayer(url, {maxZoom: 18, attribution: attrib}),
      map = new L.Map('map', {layers: [tiles], center: new L.LatLng(78.000, 16.000), zoom: 4 });

      var drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      var drawControl = new L.Control.Draw({
        draw: {
          position: 'topleft',
          polygon: false,
          polyline: false,
          circle: false,
          marker: false,
        },
        edit: {
          featureGroup: drawnItems
        }
      });
      map.addControl(drawControl);

      //When finishing the drawing catch event
      map.on('draw:created', function (e) {
        var type = e.layerType,
          layer = e.layer;

        //When finishing a rectangle, show lat lon in input fields
        if (type === 'rectangle') {
          var res = (layer.toGeoJSON()).geometry.coordinates;

          /*fetch zero and second coordinate pair to get a rectangle */
         // document.getElementById('lat1').value = res[0][0][0];


             $scope.lat1= res[0][0][0];
             $scope.lng1= res[0][0][1];
             $scope.lat2= res[0][2][0];
             $scope.lng2 = res[0][2][1];
             $scope.$apply();

          console.log($scope.lat1);
        }
          drawnItems.addLayer(layer);
      });

      map.on('draw:edited', function (e) {

           var layers = e.layers;
           layers.eachLayer(function (layer) {
             //update lng/lat from search
             var res = (layer.toGeoJSON()).geometry.coordinates;

                //fetch zero and second coordinate pair to get a rectangle
                $scope.lat1= res[0][0][0];
                $scope.lng1= res[0][0][1];
                $scope.lat2= res[0][2][0];
                $scope.lng2= res[0][2][1];
           });
        });

        map.on('draw:deleted', function (e) {

         //Remove lat/lng from search inputs
         $scope.lat1= $scope.lng1= $scope.lat2 = $scope.lng2 = undefined;

         //Remove markers and squares
         $scope.markers = [];
        });


      // Execute this function when search button is pressed
      $scope.submit = function() {
         var markers = [];


          console.log($scope.lat1);
          console.log($scope.lng1);
          console.log($scope.lat2);
          console.log($scope.lng2);


         // First find out which paramaters are not empty
         var sok = ''; var lat = ''; var lng = ''; var edate = '';

         // Build search string - if event_date exists
         if (typeof $scope.event_date1 !== "undefined" && $scope.event_date1 !== "") {
                //Remember to transform into the correct format
                edate = '&filter-event_date=' + convertDate($scope.event_date1) + '..';

                if (typeof $scope.event_date2 !== "undefined" && $scope.event_date2 !== "") {
                    //Transform edate to correct format
                    edate = edate + convertDate($scope.event_date2);

                }
         //Else if lat2 exists
       } else if (typeof $scope.event_date2 !== "undefined" && $scope.event_date2 !== "") {
                    //Transform edate to correct format
                    edate = '&filter-event_date=..' + convertDate($scope.event_date2);
         }

/* If lat1 exists */
         if (typeof $scope.lat1 !== "undefined" && $scope.lat1 !== "") {
                lat = '&filter-latitude=' + $scope.lat1 + '..';
                console.log(lat);
                if (typeof $scope.lat2 !== "undefined" && $scope.lat2 !== "") {
                    lat = lat + $scope.lat2;
                }
         /*Else if lat2 exists */
       } else if (typeof $scope.lat2 !== "undefined" && $scope.lat2 !== "") {
                    lat = '&filter-latitude=..' + $scope.lat2;
         }

         /* If lng1 exists */
         if (typeof $scope.lng1 !== "undefined" && $scope.lng1 !== "") {
                lat = '&filter-longitude=' + $scope.lng1 + '..';

                if (typeof $scope.lng2 !== "undefined" && $scope.lng2 !== "") {
                    lat = lat + $scope.lng2;

                }
         /*Else if lng2 exists */
       } else if (typeof $scope.lng2 !== "undefined" && $scope.lng2 !== "") {
                    lng = '&filter-longitude=..' + $scope.lng2;

         }


          /*Include species search if it exists */
          console.log($scope.species);
          console.log("-------------");
    if ((typeof $scope.species !== "undefined") && ($scope.species !== null) && ($scope.species !== '' )) {
           sok = sok + '&filter-species=' + ($scope.species.family).toLowerCase();
           sok = sok.replace(/ /g,"+");
    }

         /*Sum up the query */
         if ($scope.search) {
            sok = $scope.search;
         }else {
            sok = sok+lat+lng+edate;
         }

        $http.jsonp('http://api.npolar.no/sighting/?q='+ sok +'&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {

        console.log(data);

        var redIcon = {
           iconUrl: 'img/icons/reddot.png',
           iconSize:   [8, 8] // size of the icon
        };

    /* Fetch the lat/lon entries. Have to switch lat/lon for display */
    for (var i=0; i< data.feed.entries.length; i++) {
       markers.push({
                lat: parseFloat(data.feed.entries[i].longitude),
                lng: parseFloat(data.feed.entries[i].latitude),
                focus: true,
                draggable: false,
                message: data.feed.entries[i].locality,
                icon: redIcon
       });
    }

    //Display markers on map
    $scope.markers = markers;



    //Reset for next search
    markers = [];

    //Display data for all entries
    $scope.entries = data.feed.entries;
    //$scope.entries = $scope.full.feed.entries;

    //Transfer info to CSV file via service
    CSVService.entryObject = $scope.entries;

    //Get hostname
    $scope.hostname = location.host;
   // console.log($scope.hostname)


  });
 };
  };


  /*Convert to the search date format */
  function convertDate(idate) {
               console.log(idate);
                var temp_date = idate.substring(0,4) + '-' + idate.substring(5,7) + '-' +idate.substring(8,10);
                temp_date += 'T00:00:00.000';
                console.log(temp_date);
                return temp_date;
  }


  module.exports = AdminObservationsCtrl;






