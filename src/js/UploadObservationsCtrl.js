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
        var XLSX = require('js-xlsx');

        var files = $scope.files;
        var i,f;

        for (i = 0, f = files[i]; i !== files.length; ++i) {
          var reader = new FileReader();


            reader.onload = (function(theFile){
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
                    var entry = {}, ident, exped = {};

                    for (var z in worksheet) {
                    // all keys that do not begin with "!" correspond to cell addresses
                    //y is heading text, z is cellno, worksheet[z].v is cell content
                    if (z[0] !== '!') {
                           //Expedition
                           if (z ==="K2") { exped['other_info'] = worksheet[z].v;}
                           if (z ==="K3") { exped["contact_info"] = worksheet[z].v;}
                           if (z ==="K4") { exped["organisation"] = worksheet[z].v;}
                           if (z ==="K5") { var start_date = getJsDateFromExcel(worksheet[z].v);}
                           if (z ==="K6") { var end_date = getJsDateFromExcel(worksheet[z].v);}
                           if (z ==="K7") { exped["platform"] = worksheet[z].v;}

                           //For z bigger than 7
                           if (z ==="A20") { var event_date = getJsDateFromExcel(worksheet[z].v)}
                           if (z ==="B20") { entry["latitude"] = worksheet[z].v;}
                           if (z ==="C20") { entry["longitude"] = worksheet[z].v;}
                           if (z ==="D20") { entry["locality"] = worksheet[z].v;}
                           if (z ==="E20") { entry["species"] = worksheet[z].v;}
                           if (z ==="F20") { entry["adult_f"] = worksheet[z].v;}
                           if (z ==="G20") { entry["adult_m"]= worksheet[z].v;}
                           if (z ==="H20") { entry["adult"]= worksheet[z].v;}
                           if (z ==="I20") { entry["sub_adult"]= worksheet[z].v;}
                           if (z ==="J20") { entry["polar_bear_condition"]= worksheet[z].v;}
                           if (z ==="K20") { entry["cub_calf_pup"]= worksheet[z].v;}
                           if (z ==="L20") { entry["bear_cubs"]= worksheet[z].v;}
                           if (z ==="M20") { entry["unidentified"]= worksheet[z].v;}
                           if (z ==="N20") { entry["dead_alive"]= worksheet[z].v;}
                           if (z ==="O20") { entry["total"]= worksheet[z].v;}
                           if (z ==="P20") { entry["habitat"]= worksheet[z].v;}
                           if (z ==="Q20") { entry["occurrence_remarks"]= worksheet[z].v;}


                           if (z ==="A20") {
                            console.log(getJsDateFromExcel(worksheet[z].v));
                           }

                         //Recorded_by
                         entry['recorded_by'] = (NpolarApiSecurity.getUser()).name;


                     //  console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));



                      }
                  } //For -worksheet
                    //Convert dates to ISO8601
                    exped['start_date'] = start_date;
                    exped['end_date'] = end_date;
                    entry['event_date'] = event_date;

                    //A few more values applied to each entry
                    entry['created'] = + 'T00:00:00Z';
                    entry['updated'] = + 'T00:00:00Z';
                    entry['created_by'] = (NpolarApiSecurity.getUser()).name;

                    //Excel file
                    var excel = {}
                    excel['filename'] = f.name;
                    excel['content-type'] =  f.type;
                    excel['content-size'] = f.size;
                    //Need to add a timestamp to filename to ensure uniqueness
                    //which is local time now in iso8601
                    var date = new Date();
                    excel['timestamp'] =  date.toISOString();
                    console.log(excel['timestamp']);

                    //Add subobjects to main object entry
                    entry['excelfile'] =  excel;
                    entry['expedition'] =  exped;

                    //Save entry
                    console.log(JSON.stringify(entry));

                  });
              };
            })(f);
          reader.readAsBinaryString(f);

   }
};
};

function getJsDateFromExcel(excelDate) {

  // JavaScript dates represents time
  // since the Unix epoch (January 1, 1970) example: new Date(12312512312);

  // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")
  // 2. Convert to milliseconds.

  var date = new Date((excelDate - (25567 + 1))*86400*1000);

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
      return this.getUTCFullYear()
       + '-' + pad( this.getUTCMonth() + 1 )
       + '-' + pad( this.getUTCDate() )
       + 'T' + pad( this.getUTCHours() )
       + ':' + pad( this.getUTCMinutes() )
       + ':' + pad( this.getUTCSeconds() )
       + 'Z';
    };

  }() ); }
 else {//Get rid of date extension
  return date.toISOString().replace(".000","");
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
