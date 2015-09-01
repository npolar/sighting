'use strict';

/* Respond to search to get relevant entries */
sightingControllers.controller('AdminObservationsCtrl',function( $scope, $http, npolarApiSecurity, npolarApiConfig) {

$scope.endpoint = npolarApiConfig.base+"/sighting";

$scope.security = npolarApiSecurity;

$scope.submit = function() {
	console.log($scope);
    $http.jsonp('http://apptest.data.npolar.no/sighting/?q='+ $scope.search +'&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
    $scope.full = data;
    console.log(data);
})};
});

/* Respond to search to get relevant entries */
sightingControllers.controller('QualityCtrl',
   ['$scope', '$http', function( $scope, $http) {
$scope.submit = function() {
  console.log($scope);
    $http.jsonp('http://apptest.data.npolar.no/sighting/?q='+ $scope.search +'&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {
    $scope.full = data;
    console.log(data);
})};
}]);


/*Controller for CSV print */
sightingControllers.controller('CSVCtrl', function($scope, CSVService) {
    $scope.entries = CSVService.entryObject;
})


//Fetch entry from svalbard sightings couch database here
sightingControllers.controller('MapCtrl',
 function($scope, $http, leafletData, CSVService) {
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
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap2</a> contributors',
        maxZoom: 14,
				minZoom: 2
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
    if ($scope.search) {
       sok = $scope.search;
    }else {
       sok = sok+lat+lng+edate;
    }

    //console.log($scope.search);

    console.log(sok);

    $http.jsonp('http://apptest.data.npolar.no/sighting/?q='+ sok
      +'&format=json&callback=JSON_CALLBACK&locales=utf-8').success(function(data) {

      //console.log($scope);

    var redIcon = {
    iconUrl: 'img/icons/reddot.png',
    iconSize:     [8, 8] // size of the icon
    }

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
    };

    //Display markers on map
    $scope.markers = markers;

    //Reset for next search
    markers = [];

    //Display data for all entries
    $scope.entries = data.feed.entries;

    //Transfer info to CSV file via service
    CSVService.entryObject = $scope.entries;

    //Get hostname
    $scope.hostname = location.host;
   // console.log($scope.hostname);

  })};



});


/*Convert to the search date format */
function convertDate(idate) {
          console.log(idate);
           var temp_date = idate.substring(0,4) + '-' + idate.substring(5,7) + '-' +idate.substring(8,10);
           temp_date += 'T00:00:00.000';
           console.log(temp_date);
           return temp_date;
}
