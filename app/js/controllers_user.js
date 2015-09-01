
//Fetch from svalbard sightings couch database here the owner's observations
sightingControllers.controller('MyObservationsCtrl', function($scope, $http, SightingDBUpdate, npolarApiSecurity) {
   $scope.security = npolarApiSecurity;
   $http.jsonp('https://apptest.data.npolar.no/sighting/?q=&format=json&callback=JSON_CALLBACK&locales=utf-8')
    .success(function(data) {
        $scope.full = data;
     }).error(function (data, status, headers, config) {
     });
});


//View entry here
sightingControllers.controller('ViewObservationCtrl', function($scope, $routeParams,$http, SightingDBUpdate) {
      $scope.entry = SightingDBUpdate.get({id: $routeParams.id }, function(){
        console.log($scope.entry);
  });
   //get hostname
   $scope.hostname = location.host;
});


//New entry created here
sightingControllers.controller('NewObservationCtrl', function($scope, $http, $routeParams, npolarApiSecurity, npolarApiUser, Sighting, SightingDBUpdate) {

   /*If new has an id, then it's the old id to be copyed into a new entry */
   if  ($routeParams.id) {
       /*Fetch info from copying the old id's info */
      $scope.entry = SightingDBUpdate.get({id: $routeParams.id }, function(){
      });
     /* console.log($scope.entry); */

      /* Shorten dates for display only*/
   /*   if (typeof $scope.entry.event_date != "undefined" && $scope.entry.event_date != "") {
         $scope.entry.event_date = $scope.entry.event_date.substring(0,10);
      }
      if (typeof $scope.entry.expedition.start_date != "undefined" && $scope.entry.expedition.start_date != "") {
         $scope.entry.expedition.start_date = $scope.entry.expedition.start_date.substring(0,10);
      }
       if (typeof $scope.entry.expedition.end_date != "undefined" && $scope.entry.expedition.end_date != "") {
      $scope.entry.expedition.end_date = $scope.entry.expedition.end_date.substring(0,10);
      } */
   } else {
       /*New entry - start over no info fetched*/
       $scope.entry = {};
   }



   /*Set select menu for species*/
   $scope.items = species_gallery;


   $scope.submit = function() {

      /* Populate with inital values */
      console.log($scope.entry);
      entry = $scope.entry
      entry.schema = 'https://api.npolar.no/schema/sighting.json';
      entry.collection = 'sighting';
      entry.base = 'https://api.npolar.no';
      entry.language = 'en';
      entry.basis_of_record = 'HumanObservation';
      entry.rights = 'No licence announced on the web site';
      entry.rights_holder = 'Norwegian Polar Institute';
      entry.recorded_by = npolarApiUser.getUser().username;
      entry.recorded_by_name = npolarApiUser.getUser().username;
      entry.created = (new Date()).toISOString();
      entry.created_by = npolarApiUser.getUser().username;
     // entry.expedition.start_date = '2014-03-01';

      $scope.entry = entry;



      //Update species
      if (typeof entry.species != "undefined") {
        $scope.entry.species = entry.species.family;
      }

       console.log(JSON.stringify($scope.entry));

      //Sighting.save(entry);
      var entry = new Sighting($scope.entry);

      var ret = entry.$save();

      console.log("New entry" + JSON.stringify(entry));
      console.log("New entry2 " + JSON.stringify(ret));

  }
});


//Update entry from Svalbard MMS couch database here
sightingControllers.controller('EditObservationCtrl',  function($scope, $routeParams, $http,
  Sighting, SightingDBUpdate, npolarApiSecurity, npolarApiUser) {
    $scope.formulaData = {
      schema: "https://api.npolar.no/schema/sighting.json",
      form: "./partials/user/formula.json",
      model: {},
      onsave: function(doc) {
        alert("test");
      }
    };

    var entry = SightingDBUpdate.get({id: $routeParams.id }, function(){
    $scope.entry = entry;
    /*Set abbreviated dates*/
    $scope.entry.event_date = entry.event_date.substring(0,10);
    $scope.entry.expedition.start_date = entry.expedition.start_date.substring(0,10);
    $scope.entry.expedition.end_date = entry.expedition.end_date.substring(0,10);
     console.log('edit ' + JSON.stringify(entry));
    $scope.items = species_gallery;
  });

    //Store update
    $scope.submit = function(id) {
      var entry = new Sighting($scope.entry);
      console.log('edit ' + JSON.stringify(entry));
      console.log("http "  + JSON.stringify($http.defaults.headers.common));
      entry.$update();
  }
});



//Delete entry here by updating so entry is still available
sightingControllers.controller('DeleteObservationCtrl',
  function($scope, $http, $routeParams, Sighting, SightingDBUpdate) {

     //Delete by put update, set _deleted to true
    $scope.submit = function(id) {
          var entry = new Sighting($scope.entry);
          //Delete by setting _deleted to true
          entry._deleted = true;
          entry.$update();
          console.log("entry object: ", entry);
   }
});


//Controller for Excel file upload
sightingControllers.controller('UploadObservationsCtrl', function($scope, $http) {
     $scope.filesChanged = function(elm){
        $scope.files=elm.files;
        $scope.$apply();
       // console.log($scope.files);
     }
     $scope.upload = function() {
        var fd = new FormData();

        angular.forEach($scope.files, function(file){
          fd.append('file',file);
        });

        console.log(fd);

        $http.post('https://apptest.data.npolar.no:4444/upload_excel', fd,
        {
          transformrequest:angular.identity,
          headers:{'Content-Type':'multipart/form-data'}
        } )
        .success(function(data, status, headers, config) {
         console.log('success: ' + data);

        })
        .error(function(data, status, headers, config) {
         console.log('error' + data);
        });
   }
});
