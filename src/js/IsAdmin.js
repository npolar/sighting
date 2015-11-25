 'use strict';
/*Service*/

/*Service to get CSV post*/
// @ngInject
var IsAdmin =  function (NpolarApiSecurity, npolarApiConfig) {
	return {entryObject: {data: NpolarApiSecurity.hasSystem('https:' + npolarApiConfig.base + '/sighting/admin')} };
};


module.exports = IsAdmin;
