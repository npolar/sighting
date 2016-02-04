'use strict';

var uploadObservations = function(SPECIES, $sce) {
'ngInject';

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
			                    //console.log(exped);


			                    //Create excel object
			                    var excelfile = getExcelInfo(f);
			                    if (excelfile === {}) {
			                    	console.log("Unable to extract excel file information. Exiting..");
			                    }
			                    //console.log(excelfile);


                                //Extract row info, store in database if possible
			                    var result = getExcelLineInfo(worksheet, excelfile, exped, start_row, schema_version);
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
			function getExcelLineInfo(worksheet, excelfile, exped, start_row, sv) {

				//Ugly "semi-global" variable needed for html formatting on a string
				//which is illegal alone if anything is appended..
				var jsonStr = '';

                //create entry object
				var entry =initEntry(excelfile, exped);

			    //Row count
				var row_count = start_row;

				//Set schema_version to false (old schema) if not set
			    if (!sv) { sv = false; };


			    for (var z in worksheet) {
			    	//num holds the currect row number
			    	//Necessary because excel lib does not keep track of rows
			    	var num = z.substring(1);


			    	//Excel form starts with start_row
			        if (((worksheet.hasOwnProperty(z))) && (num > (start_row-1))) {

			          //if new row detected, push entry to database
			          //Afterwards, reset entry object
			          if (num > row_count)
			          	 {
			          	 	//Update row_count
			          	 	row_count = num;
			          	 	//Submit entry if it contains real values
			          	 	jsonStr = submitEntry(entry, jsonStr);
			          	 	//Init new entry
			          	 	entry = initEntry(excelfile, exped);
			          	 }


			          switch(z) {
			          	case ("A"+num): var event_d = getJsDateFromExcel(worksheet[z].v); entry.event_date = event_d; break;
                        case ("B"+num): entry.latitude = worksheet[z].v; break;
                        case ("C"+num): entry.longitude = worksheet[z].v; break;
                        case ("D"+num): worksheet[z].v === "(select or write placename)" ?
                        				(entry.locality = "") : (entry.locality = worksheet[z].v); break;
                        case ("E"+num): worksheet[z].v === "(select species)" ?
                      					(entry.species = "") : (entry.species = worksheet[z].v);
                      					for (var p = 0; p < SPECIES.length; p++) {
	                        				if (entry.species && ((entry.species).toLowerCase() === (SPECIES[p].eng).toLowerCase())) {
	                              			 	entry.species = (SPECIES[p].family).toLowerCase();
	                        				} } break;
                        case ("F"+num): entry.adult_m = (worksheet[z].v).toString(); break;
                        case ("G"+num): entry.adult_f = (worksheet[z].v).toString(); break;
                        case ("H"+num): entry.adult = (worksheet[z].v).toString(); break;
                        case ("I"+num): entry.sub_adult = (worksheet[z].v).toString(); break;
						case ("J"+num): if (sv) { worksheet[z].v === "(select condition)" ?
										(entry.polar_bear_condition = "") : (entry.polar_bear_condition = worksheet[z].v);}
										else { entry.cub_calf_pup = (worksheet[z].v).toString(); } break;
						case ("K"+num): if (sv) { entry.cub_calf_pup = (worksheet[z].v).toString();} else {
										entry.unidentified = (worksheet[z].v).toString(); } break;
						case ("L"+num): if (sv) { worksheet[z].v === "(select years)" ? (entry.bear_cubs = "") : (entry.bear_cubs = worksheet[z].v);
										} else { entry.total = (worksheet[z].v).toString(); } break;
						case ("M"+num): if (sv) { entry.unidentified = (worksheet[z].v).toString(); } else {
										 worksheet[z].v === "(select habitat)" ? (entry.habitat = "") : (entry.habitat = worksheet[z].v);
										} break;
						case ("N"+num): if (sv) {
										worksheet[z].v === 'NA' ? (entry.dead_alive = 'unknown') : (entry.dead_alive = worksheet[z].v);
										} else { entry.occurrence_remarks= worksheet[z].v;} break;
						case ("O"+num): entry.total = (worksheet[z].v).toString(); break;
	                    case ("P"+num): worksheet[z].v === "(select habitat)" ? (entry.habitat = "") : (entry.habitat = worksheet[z].v); break;
	                    case ("Q"+num): entry.occurrence_remarks= worksheet[z].v; break;

                      } //switch
                    } //if worksheet

              } //for worksheet
              //Submit the last entry if it contains real values
			  jsonStr = submitEntry(entry, jsonStr);
              return true;
            } // End getExcelLineInfo


            //Submit entry if it is deemed real
            function submitEntry(entry, jsonStr) {
            	//If event_date is there the entry is real, thus submit
            	if (entry.event_date){
            		//Add all relevant entries to jsonStr
            		jsonStr += JSON.stringify(entry) + '<br /><br />';
            		scope.entry = $sce.trustAsHtml(jsonStr);
            		scope.$apply();
            		//Feedback jsonStr
            		return jsonStr;
            	};
            }

            //Some values are the same for all entries objects
            //they are appended here
            function initEntry(excelfile, exped) {
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
                return entry;
            }


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
			 // expedition info - should start in column J or K..
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