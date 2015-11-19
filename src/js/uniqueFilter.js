'use strict';
/**
 * @ngInject
 */
 //Filter on recorded_by to get unique values -not currently used by observers
var uniqueFilter = function () {
	var o = []
	return function (arr) {
		console.log(arr);
        for (var l=0; l<arr.length; l++) {
        	if (arr[l].hasOwnProperty("recorded_by")) {
            	 o.push((arr[l].recorded_by));
            };
        };

    console.log(o);
    return o;
};
};


module.exports = uniqueFilter;
