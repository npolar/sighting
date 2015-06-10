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
sightingControllers.controller('NewObservationCtrl', ['$scope', '$http', 'npolarApiSecurity', function($scope, $http, npolarApiSecurity) {
   $scope.entry = {};
   $scope.items = species_gallery;


   $scope.submit = function() {
     // console.log(JSON.parse($scope.entry));
      var entry = $scope.entry;
     // console.log(JSON.stringify(entry));
    // console.log(user.username);
    // var basic = basicToken(user.username);
    // console.log(basic);


   $http({
    method: 'POST',
    url: 'https://apptest.data.npolar.no/sighting',
    //headers: {'Content-Type': 'application/json'},
    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    headers: {'Content-Type': 'text/plain; charset=utf-8','Authorization': 'Basic'},
    transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: entry,
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


//Update entry from Svalbard MMS couch database here
sightingControllers.controller('EditObservationCtrl', ['$scope', '$routeParams', 'SightingDBUpdate', '$http', function($scope, $routeParams, SightingDBUpdate, $http) {
    var entry = SightingDBUpdate.get({id: $routeParams.id }, function(){
          console.log(entry);
    $scope.entry = entry;
    $scope.entry.event_date = (entry.event_date).substring(0,10);
    $scope.entry.expedition.start_date = (entry.expedition.start_date).substring(0,10);
    $scope.entry.expedition.end_date = (entry.expedition.end_date).substring(0,10);
    $scope.items = species_gallery;
  });

    //Put update
    $scope.submit = function(id) {
      console.log($scope.entry);
      console.log ("put----" + id);
      var entry = $scope.entry;
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
