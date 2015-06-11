//This controller shows the 20 last images submitted
sightingControllers.controller('PhotoCtrl', ['$scope', '$timeout', function($scope, $timeout) {
  //Search here for the 20 last images submitted
   var path = 'img/imagestore/idxxxxx';
   //var path = 'img/imagestore/' + $routeparams.id;
    $timeout(function () {
       $scope.path = [ path + '/01.jpeg', path + '/02.jpeg' ];
    }, 1000);
}]);


//Fetch from svalbard sightings couch database here the owner's observations
sightingControllers.controller('MyObservationsCtrl', ['$scope', '$http', function($scope, $http) {
    $http.jsonp('http://apptest.data.npolar.no/sighting/?q=&format=json&callback=JSON_CALLBACK&locales=utf-8')
    .success(function(data) {
        $scope.full = data;
           console.log(data);
     }).error(function (data, status, headers, config) {
            console.log('status',status);
            console.log('data',data);
            console.log('headers',headers);
     });
}]);


//View entry goes here
sightingControllers.controller('ViewObservationCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams,$http) {
   $http.get('http://apptest.data.npolar.no/sighting/' + $routeParams.id)
  .success(function(data) {
     $scope.entry = data;
  });

   //get hostname
   $scope.hostname = location.host;

}]);


//New entry goes here
sightingControllers.controller('NewObservationCtrl', function($scope, $http, npolarApiSecurity, npolarApiUser) {
   $scope.entry = {};
   /* Fill in entries that already have a value */
   $scope.entry.schema = 'http://api.npolar.no/schema/sighting.json';
   $scope.entry.collection = 'sighting';
   $scope.entry.base = 'http://api.npolar.no';
   $scope.entry.language = 'en';
   $scope.entry.basis_of_record = 'HumanObservation';
   $scope.entry.rights = 'No licence announced on the web site';
   $scope.entry.rights_holder = 'Norwegian Polar Institute';
   $scope.entry.recorded_by = npolarApiUser.getUser();
   $scope.entry.recorded_by_name = $scope.entry.recorded_by;
  /* $scope.entry.expedition.contact_info = npolarApiUser.getUser();
   $scope.entry.expedition_db.hreflang = 'en'; */
   $scope.entry.created = (new Date()).toISOString();
   $scope.created_by = npolarApiUser.getUser();

   /*Set select menu for species*/
   $scope.items = species_gallery;


   $scope.submit = function() {
      var entry = $scope.entry;
      console.log("Return entry" + entry);

      $scope.user = npolarApiUser.getUser();
      //console.log("token: " + npolarApiSecurity.basicToken($scope.user));
      var auth = npolarApiSecurity.basicToken($scope.user);


   $http({
     method: 'POST',
     url: 'https://apptest.data.npolar.no/sighting',
     headers: {'Content-Type': 'text/plain; charset=utf-8', 'Authorization': 'Basic '+ auth},
     data: entry,
     }).success(function (data, status, headers, config) {
            console.log('status- success',status);
            console.log('data',data);
            console.log('headers',headers);
     }).error(function (data, status, headers, config) {
            console.log('status- error',status);
            console.log('data',data);
            console.log('headers',headers);
     });

  }
});


//Update entry from Svalbard MMS couch database here
sightingControllers.controller('EditObservationCtrl',  function($scope, $routeParams, $http, SightingDBUpdate, npolarApiSecurity, npolarApiUser) {
    var entry = SightingDBUpdate.get({id: $routeParams.id }, function(){
    $scope.entry = entry;
    $scope.entry.event_date = (entry.event_date).substring(0,10);
    $scope.entry.expedition.start_date = (entry.expedition.start_date).substring(0,10);
    $scope.entry.expedition.end_date = (entry.expedition.end_date).substring(0,10);
    $scope.items = species_gallery;
  });
    $scope.user = npolarApiUser.getUser();
    //console.log("token: " + npolarApiSecurity.basicToken($scope.user));
    var auth = npolarApiSecurity.basicToken($scope.user);

    //Put update
    $scope.submit = function(id) {
      var entry = $scope.entry;
      console.log('edit ' + JSON.stringify(entry));

      $http({
     method: 'PUT',
     url: 'https://apptest.data.npolar.no/sighting/' + id,
     headers: {'Content-Type': 'text/plain; charset=utf-8', 'Authorization': 'Basic '+ auth},
     data: entry,
     }).success(function (data, status, headers, config) {
            console.log('status - success',status);
            console.log('data',data);
            console.log('headers',headers);
     }).error(function (data, status, headers, config) {
            console.log('status - error',status);
            console.log('data',data);
            console.log('headers',headers);
     });
  }
});


//Delete entry from svalbard sightings couch database here
sightingControllers.controller('DeleteObservationCtrl', ['$scope', '$http', '$routeParams', 'SightingDBUpdate', function($scope, $http, $routeParams, SightingDBUpdate) {

    //First fetch the object so we keep all other parameters
    var entry = SightingDBUpdate.get({id: $routeParams.id }, function(){
          console.log(entry);
          $scope.entry = entry;
    });

     //Put update
    $scope.submit = function(id) {

          entry._deleted = true;

          console.log("entry object: ", entry);

       //Then update the entry
          $http({ method: 'PUT',
            url: 'http://apptest.data.npolar.no/sighting/' + id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {username: user, password: pass, entry}
            }).success(function (data, status, headers, config) {
              console.log('status',status);
              console.log('data',data);
              console.log('headers',headers);
            }).error(function (data, status, headers, config) {
              console.log('status',status);
              console.log('data',data);
              console.log('headers',headers);
    });
}

}]);


//Controller for Excel file upload
sightingControllers.controller('UploadObservationsCtrl', ['$scope', '$http', function($scope, $http) {
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
         console.log('success');
         console.log(data);
         console.log(status);
         console.log(headers);
         console.log(config);
        })
        .error(function(data, status, headers, config) {
         //console.log(data);
         console.log(status);
         console.log('error');
         console.log(headers);
         console.log(config);

  });
   }
}]);
