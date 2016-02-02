'use strict';

// @ngInject
var uploadObservations = function(SPECIES) {

return {
      restrict: 'AE',
      templateUrl:'partials/user/upload_observations.html',
     // scope: {},    //new isolated scope
      scope: {
         recorded_by: '@',
         created_by: '@'
      },
 	  link: function(scope, elem, attrs) {

		    scope.filesChanged = function(e){
		        scope.files=e.files;
		        scope.$apply();
		    };

		    scope.upload = function(e) {
		    	    //Get files
		     	    var files = scope.files;
        		    var i,f;
    				//Input about start row and schema version
        		    var start_row = scope.row;
        		    var schema_version = scope.schema_version;


   					//Extraction: Count up each successful row - used for user feedback
			        var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";

			        for (i = 0, f = files[i]; i !== files.length; ++i) {
			          var reader = new FileReader();


			            reader.onload = (function(f){
			              //var fileName = theFile.name;
			              return function(e){
			                 var data = e.target.result;

			                 var workbook = XLSX.read(data, {type: 'binary'});
			                  //Read first workbook
			                 var sheets = workbook.SheetNames;
			                 //Remove helper sheets -warn if sheet names have been changed by user
			                 var sheet_name_list = testSheetNames(sheets);

			                 sheet_name_list.forEach(function(y) { // iterate through sheets
			                    var worksheet = workbook.Sheets[y];

			                    var exped = getContactInfo(worksheet);
			                    if (exped === {}) {
			                    	console.log("Can't find contact information in column J or K in worksheet. Exiting..");
			                    }
			                    console.log(exped);


			                    //Create excel object
			                    var excelfile = getExcelInfo(f);
			                    if (excelfile === {}) {
			                    	console.log("Unable to extract excel file information. Exiting..");
			                    }
			                    console.log(excelfile);


			                    //Some values are the same for all entries
			                    var entry = {};
			                    entry.recorded_by = scope.$parent.recorded_by;
			                    entry.created_by = scope.$parent.created_by;

			                    var date2 = new Date();
			                    entry.created = date2.toISOString().substring(0,10) + 'T00:00:00Z';

			                    //Include excel and expedition in entry
			                    entry.excelfile = excelfile;
                                entry.expedition = exped;

                                //Add database info
                                entry.schema = "https://api.npolar.no/no/schema/sighting.json";
                                entry.collection = "sighting";
                                entry.base = "http://api.npolar.no";

                                //Extract row info, store in database if possible
			                    var result = getExcelLineInfo(worksheet, entry, start_row, schema_version);
			                    if (result) {
			                    	console.log("All rows stored successfully.");
			                    } else {
			                    	console.log("Some - or all - entries were not stored");
			                    }


			                  });  //sheet_name_list
			              }; //return function
			            })(f);   //reader.onload
			            if (rABS) { reader.readAsBinaryString(f); }
			            else {reader.readAsArrayBuffer(f);}
			   }
			}; //upload scope


 			//Extract a row of data from worksheet
 			//start_row is the first row with input
		    //In 2014 the schema questions included bear cubs and dead/alive
			function getExcelLineInfo(worksheet, entry, start_row, schema_version) {

				//Count up the rows
			    var row_count = start_row;

			    for (var z in worksheet) {
			    	//Pick out rows with values
			    	var num = z.substring(1);

			    	//Excel entries start after 10th row
			        if (((worksheet.hasOwnProperty(z))) && (num > (start_row-1))) {

			          if (z === ("A"+num)) { var event_d = getJsDateFromExcel(worksheet[z].v); entry.event_date = event_d;}
                      if (z === ("B"+num)) { entry.latitude = worksheet[z].v;}
                      if (z === ("C"+num)) { entry.longitude = worksheet[z].v;}
                      if (z === ("D"+num)) { worksheet[z].v === "(select or write placename)" ? (entry.locality = "") : (entry.locality = worksheet[z].v);}
                      if (z === ("E"+num)) {
                      	worksheet[z].v === "(select species)" ?
                      	(entry.species = "") : (entry.species = worksheet[z].v);
                      	for (var p = 0; p < SPECIES.length; p++) {
	                        if (entry.species && ((entry.species).toLowerCase() === (SPECIES[p].eng).toLowerCase())) {
	                               entry.species = (SPECIES[p].family).toLowerCase();
	                        }
	                    }
                      }
                      if (z === ("F"+num)) { entry.adult_m = (worksheet[z].v).toString();}
                      if (z === ("G"+num)) { entry.adult_f = (worksheet[z].v).toString();}
                      if (z === ("H"+num)) { entry.adult = (worksheet[z].v).toString();}
                      if (z === ("I"+num)) { entry.sub_adult = (worksheet[z].v).toString();}

                      //Here the schemas differ
	                  if (schema_version) {
	                      if (z === ("J"+num)) { worksheet[z].v === "(select condition)" ? (entry.polar_bear_condition = "") : (entry.polar_bear_condition = worksheet[z].v);}
	                      if (z === ("K"+num)) { entry.cub_calf_pup = (worksheet[z].v).toString();}
	                      if (z === ("L"+num)) { worksheet[z].v === "(select years)" ? (entry.bear_cubs = "") : (entry.bear_cubs = worksheet[z].v);}
	                      if (z === ("M"+num)) { entry.unidentified = (worksheet[z].v).toString();}
	                      if (z === ("N"+num)) { worksheet[z].v === 'NA' ? (entry.dead_alive = 'unknown') : (entry.dead_alive = worksheet[z].v) ;}
	                      if (z === ("O"+num)) { entry.total = (worksheet[z].v).toString();}
	                      if (z === ("P"+num)) { worksheet[z].v === "(select habitat)" ? (entry.habitat = "") : (entry.habitat = worksheet[z].v);}
	                      if (z === ("Q"+num)) { entry.occurrence_remarks= worksheet[z].v;}
	                  } else { //Old schema
	                  	  if (z === ("J"+num)) { entry.cub_calf_pup = (worksheet[z].v).toString();}
	                      if (z === ("K"+num)) { entry.unidentified = (worksheet[z].v).toString();}
	                      if (z === ("L"+num)) { entry.total = (worksheet[z].v).toString();}
	                      if (z === ("M"+num)) { worksheet[z].v === "(select habitat)" ? (entry.habitat = "") : (entry.habitat = worksheet[z].v);}
	                      if (z === ("N"+num)) { entry.occurrence_remarks= worksheet[z].v;}
	                  }

                   } //if worksheet

                //   console.log(JSON.stringify(entry));
                //   console.log("result ----------");
                //&& (worksheet["A"+num] !== undefined) && (typeof worksheet["A"+num].v === "number" )
              } //for worksheet
              return true;
            } // End getExcelLineInfo


			//Extract info on Excel file
			function getExcelInfo(f) {
				//Excel file object
                var excel = {};
                excel.filename = f.name;
                excel.mimetype =  f.type;
                excel.filesize = f.size;

                //Add subobjects to main object entry
                var excelfile = {};
                excelfile.item = excel;
                //Need to add a timestamp to filename to ensure uniqueness
                //which is local time now in iso8601
                var date = new Date();
                excelfile.timestamp =  date.toISOString().replace(/\.[0-9]{3}/g,"");
                return excelfile;
			}

			//Fetch expedition  data - could be either in fields J or K
			function getContactInfo(worksheet) {
			 var exped={};
			 console.log("Checking expedition info - should start in column J or K..");

			 for (var q in worksheet) {
			     if (worksheet.hasOwnProperty(q)) {
			          // all keys that do not begin with "!" correspond to cell addresses
			          // q is cellno, worksheet[q].v is cell content
			          // Up to 2013 J column is used, from 2014 K column
	                   if ((q === "K2") || (q === "J2")) { exped.other_info = worksheet[q].v;}
	                   if ((q === "K3") || (q === "J3")) { exped.contact_info = worksheet[q].v;}
	                   if ((q === "K4") || (q === "J4")) { exped.organisation = worksheet[q].v;}
	                   if ((q === "K5") || (q === "J5")) { var start_d = getJsDateFromExcel(worksheet[q].v); exped.start_date = start_d;}
	                   if ((q === "K6") || (q === "J6")) { var end_d = getJsDateFromExcel(worksheet[q].v); exped.end_date = end_d;}
	                   if ((q === "K7") || (q === "J7")) { exped.platform = worksheet[q].v;}
	            } //if
	          } //for
	          //If exped is still without values, send alarm
	            return exped;
	        }


			// JavaScript dates represents time
			// since the Unix epoch (January 1, 1970) example: new Date(12312512312);

			// 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")
			// 2. Convert to milliseconds.
			//Next leap year 2016
			function getJsDateFromExcel(excelDate) {

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

				   // Date.prototype.toISOString = function() {
				    Object.defineProperty(String.prototype, "toISOString", {
				        value: function () {
				         return this.getUTCFullYear() +
				         '-' + pad( this.getUTCMonth() + 1 ) +
				         '-' + pad( this.getUTCDate() ) +
				         'T' + pad( this.getUTCHours() ) +
				         ':' + pad( this.getUTCMinutes() ) +
				         ':' + pad( this.getUTCSeconds() ) +
				         'Z';
				        }
				    });

					  }() ); }
					 else {//Get rid of date extension
					  return date.toISOString().replace(/\.[0-9]{3}/g,"");
					}
					}  //function getJsDateFromExcel

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

					//Test for sheet names, remove helper sheets
					function testSheetNames(sheet_name_list){
						//Remove 'About the Form' and 'Species name'
			            removeVal(sheet_name_list, 'About the Form');
			            removeVal(sheet_name_list, 'Species name');
			            if (!(sheet_name_list === ["Sightings"])) {
			             console.log('Warning: Contains sheets with other names than "Sightings". Trying..');
						}
						return sheet_name_list;
					}


	} //link


};
};


module.exports = uploadObservations;