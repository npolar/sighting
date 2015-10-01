'use strict';
/* User module */

//Controller for Excel file upload
// @ngInject
var UploadObservationsCtrl = function($scope, $http, NpolarApiSecurity) {
    $scope.security = NpolarApiSecurity;


     $scope.filesChanged = function(elm){
        $scope.files=elm.files;
        $scope.$apply();
     };

     $scope.upload = function(elm) {

        var files = $scope.files;
        var i,f;
        var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";


        for (i = 0, f = files[i]; i !== files.length; ++i) {
          var reader = new FileReader();

            reader.onload = (function(f){
              //var fileName = theFile.name;
              return function(e){
                 var data = e.target.result;

                 var workbook = XLSX.read(data, {type: 'binary'});
                  //Read first workbook
                 var sheet_name_list = workbook.SheetNames;

                 //Remove the two helper sheets from sheet list
                 removeVal(sheet_name_list, 'About the Form');
                 removeVal(sheet_name_list, 'Species name');

                 sheet_name_list.forEach(function(y) { // iterate through sheets
                    var worksheet = workbook.Sheets[y];
                    var entry = {}, exped = {};

                    for (var q in worksheet) {
                    // all keys that do not begin with "!" correspond to cell addresses
                    //y is heading text, z is cellno, worksheet[z].v is cell content

                           //Expedition
                           if (q ==="K2") { exped.other_info = worksheet[q].v;}
                           if (q ==="K3") { exped.contact_info = worksheet[q].v;}
                           if (q ==="K4") { exped.organisation = worksheet[q].v;}
                           if (q ==="K5") { var start_d = getJsDateFromExcel(worksheet[q].v); exped.start_date = start_d;}
                           if (q ==="K6") { var end_d = getJsDateFromExcel(worksheet[q].v); exped.end_date = end_d;}
                           if (q ==="K7") { exped.platform = worksheet[q].v;}
                    }

                     //A few more values applied to each entry
                    entry.recorded_by = (NpolarApiSecurity.getUser()).name;
                    entry.created_by = (NpolarApiSecurity.getUser()).name;
                     var date2 = new Date();
                    entry.created = date2.toISOString().substring(0,10) + 'T00:00:00Z';


                    //Excel file
                    var excel = {};
                    excel.filename = f.name;
                    excel['content-type'] =  f.type;
                    excel['content-size'] = f.size;

                    for (var z in worksheet) {
                           var num = z.substring(1);
                          // console.log(num, z, worksheet["A"+num]);
                          //Excel lines start at 20 so check bigger than 19
                           if ((num > 19) && (worksheet["A"+num] !== undefined) && (typeof worksheet["A"+num].v === "number" )) {

                              if (z === ("A"+num)) { var event_d = getJsDateFromExcel(worksheet[z].v);
                               exped.event_date = event_d;}
                              if (z === ("B"+num)) { entry.latitude = worksheet[z].v;}
                              if (z === ("C"+num)) { entry.longitude = worksheet[z].v;}
                              if (z === ("D"+num)) { worksheet[z].v === "(select or write placename)" ? (entry.locality = "") : (entry.locality = worksheet[z].v);}
                              if (z === ("E"+num)) { worksheet[z].v === "(select species)" ? (entry.species = "") : (entry.species = worksheet[z].v);}
                              if (z === ("F"+num)) { entry.adult_m = worksheet[z].v;}
                              if (z === ("G"+num)) { entry.adult_f = worksheet[z].v;}
                              if (z === ("H"+num)) { entry.adult = worksheet[z].v;}
                              if (z === ("I"+num)) { entry.sub_adult = worksheet[z].v;}
                              if (z === ("J"+num)) {  worksheet[z].v === "(select condition)" ? (entry.polar_bear_condition = "") : (entry.polar_bear_condition = worksheet[z].v);}
                              if (z === ("K"+num)) { entry.cub_calf_pup = worksheet[z].v;}
                              if (z === ("L"+num)) { worksheet[z].v === "(select years)" ? (entry.bear_cubs = "") : (entry.bear_cubs = worksheet[z].v);}
                              if (z === ("M"+num)) { entry.unidentified = worksheet[z].v;}
                              if (z === ("N"+num)) { entry.dead_alive = worksheet[z].v;}
                              if (z === ("O"+num)) { entry.total = worksheet[z].v;}
                              if (z === ("P"+num)) { worksheet[z].v === "(select habitat)" ? (entry.habitat = "") : (entry.habitat = worksheet[z].v);}
                              if (z === ("Q"+num)) { entry.occurrence_remarks= worksheet[z].v;}

                              //Need to add a timestamp to filename to ensure uniqueness
                              //which is local time now in iso8601
                              var date = new Date();
                               excel.timestamp =  date.toISOString().replace(/\.[0-9]{3}/g,"");
                                //console.log(excel.timestamp);

                                //Add subobjects to main object entry
                                entry.excelfile =  excel;
                                entry.expedition =  exped;


                                //Save entry, P is last letter
                                if (z.substring(0,1) === "P") {
                                   console.log(z, JSON.stringify(entry));
                                }

                       } //typeof
                  } //For -worksheet

                  });
              };
            })(f);
            if (rABS) { reader.readAsBinaryString(f); }
            else {reader.readAsArrayBuffer(f);}

   }
};
};

function getJsDateFromExcel(excelDate) {

  // JavaScript dates represents time
  // since the Unix epoch (January 1, 1970) example: new Date(12312512312);

  // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")
  // 2. Convert to milliseconds.
  //Next leap year 2016

  var date = new Date((excelDate - (25567+2))*86400*1000);

  //Browser that does not have toISOString
  if ( !Date.prototype.toISOString ) {
  ( function() {

    function pad(number) {
      var r = String(number);
      if ( r.length === 1 ) {
        r = '0' + r;
      }
      return r;
    }

    Date.prototype.toISOString = function() {
      return this.getUTCFullYear() +
         '-' + pad( this.getUTCMonth() + 1 ) +
         '-' + pad( this.getUTCDate() ) +
         'T' + pad( this.getUTCHours() ) +
         ':' + pad( this.getUTCMinutes() ) +
         ':' + pad( this.getUTCSeconds() ) +
         'Z';
    };

  }() ); }
 else {//Get rid of date extension
  return date.toISOString().replace(/\.[0-9]{3}/g,"");
}
}

//Pops a value by name off the workbook array
function removeVal(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

module.exports = UploadObservationsCtrl;